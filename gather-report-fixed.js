// Simple gather-report.js - Fixed version
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = 'C:\\Slate360';
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const outputDir = path.join(projectRoot, 'DIAGNOSTIC_REPORTS');
const finalZipName = `PROJECT_DIAGNOSTIC_${timestamp}.zip`;
const finalZipPath = path.join(outputDir, finalZipName);

console.log('Starting SLATE360 Diagnostic Report Generation...');

try {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const summaryFilePath = path.join(outputDir, `SUMMARY_${timestamp}.md`);
    const sourceZipPath = path.join(outputDir, `SOURCE_${timestamp}.zip`);

    // Generate Summary Report
    console.log('[+] Generating summary report...');
    let summaryContent = `# SLATE360 Project Diagnostic Summary\nGenerated on: ${new Date().toString()}\n\n`;

    // Environment Info
    summaryContent += '## Environment Info\n```text\n';
    summaryContent += `Node.js Version: ${process.version}\n`;
    summaryContent += `Platform: ${process.platform}\n`;
    summaryContent += `Project Root: ${projectRoot}\n`;
    summaryContent += '```\n\n';

    // Git Info
    summaryContent += '## Git Status\n```text\n';
    try {
        const gitStatus = execSync(`git status --porcelain`, { encoding: 'utf8', stdio: 'pipe' });
        summaryContent += `Git Status:\n${gitStatus}\n\n`;
        
        const gitLog = execSync(`git log -n 5 --pretty=format:"%h - %an %ar : %s"`, { encoding: 'utf8', stdio: 'pipe' });
        summaryContent += `Recent Commits:\n${gitLog}\n`;
    } catch (e) { 
        summaryContent += `Error getting Git info: ${e.message}\n`; 
    }
    summaryContent += '```\n\n';

    // Project Structure
    summaryContent += '## Project Structure\n```text\n';
    try {
        const files = fs.readdirSync(projectRoot);
        summaryContent += 'Root Directory Contents:\n';
        files.forEach(file => {
            const filePath = path.join(projectRoot, file);
            const stats = fs.statSync(filePath);
            summaryContent += `${stats.isDirectory() ? '[DIR]' : '[FILE]'} ${file}\n`;
        });
    } catch (e) { 
        summaryContent += `Error reading directory: ${e.message}\n`; 
    }
    summaryContent += '```\n\n';

    // Key Files
    summaryContent += '## Key Configuration Files\n';
    const configFiles = ['package.json', 'next.config.mjs', 'tsconfig.json', 'tailwind.config.js'];
    configFiles.forEach(file => {
        const filePath = path.join(projectRoot, file);
        if (fs.existsSync(filePath)) {
            summaryContent += `### ${file}\n\`\`\`${file.endsWith('.json') ? 'json' : 'javascript'}\n`;
            try {
                summaryContent += fs.readFileSync(filePath, 'utf8');
            } catch (e) {
                summaryContent += `Error reading file: ${e.message}`;
            }
            summaryContent += '\n```\n\n';
        }
    });

    // Write summary file
    fs.writeFileSync(summaryFilePath, summaryContent, 'utf8');
    console.log('[SUCCESS] Summary report created.');

    // Archive source code
    console.log('[+] Archiving source code...');
    const itemsToArchive = fs.readdirSync(projectRoot)
        .filter(item => !['node_modules', '.next', '.git', 'DIAGNOSTIC_REPORTS'].includes(item))
        .map(item => `"${path.join(projectRoot, item)}"`)
        .join(',');
    
    execSync(`powershell -Command "Compress-Archive -Path ${itemsToArchive} -DestinationPath '${sourceZipPath}' -Force"`, { stdio: 'pipe' });
    console.log('[SUCCESS] Source code archived.');

    // Combine into final package
    console.log('[+] Creating final package...');
    execSync(`powershell -Command "Compress-Archive -Path '${summaryFilePath}','${sourceZipPath}' -DestinationPath '${finalZipPath}' -Force"`, { stdio: 'pipe' });

    // Cleanup
    fs.unlinkSync(summaryFilePath);
    fs.unlinkSync(sourceZipPath);

    console.log("\n----------------------------------------------------");
    console.log(`[SUCCESS] Diagnostic report generated successfully!`);
    console.log(`Your complete report is located at: ${finalZipPath}`);
    console.log("----------------------------------------------------");

} catch (error) {
    console.error('\n[ERROR] An error occurred during script execution:');
    console.error(error.message);
    process.exit(1);
}
