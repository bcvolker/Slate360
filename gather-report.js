// C:\Slate360\gather-report.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// --- Configuration ---
const projectRoot = 'C:\\Slate360';
const frontendDir = path.join(projectRoot, 'frontend');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const outputDir = path.join(projectRoot, 'DIAGNOSTIC_REPORTS');
const finalZipName = `PROJECT_DIAGNOSTIC_${timestamp}.zip`;
const finalZipPath = path.join(outputDir, finalZipName);

console.log('Starting SLATE360 Diagnostic Report Generation with Node.js...');

try {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const summaryFilePath = path.join(outputDir, `SUMMARY_${timestamp}.md`);
    const sourceZipPath = path.join(outputDir, `SOURCE_${timestamp}.zip`);

    // --- 1. Generate Summary Report ---
    console.log('[+] Generating quick summary report...');
    let summaryContent = `# SLATE360 Project Diagnostic Summary\nGenerated on: ${new Date().toString()}\n\n`;

    // Environment Info
    summaryContent += '## Environment Info\n```text\n';
    summaryContent += `Node.js Version: ${process.version}\n`;
    summaryContent += `Platform: ${process.platform}\n`;
    try {
        const psInfo = execSync('powershell -Command "Get-ComputerInfo | Select-Object OsName, OsVersion | Format-List | Out-String"', { encoding: 'utf8' });
        summaryContent += psInfo;
    } catch (e) { summaryContent += 'Could not get PowerShell info.\n'; }
    summaryContent += '```\n\n';

    // Git Info
    summaryContent += '## Git Status\n```text\n';
    try {
        const gitStatus = execSync(`git -C "${projectRoot}" status`, { encoding: 'utf8' });
        summaryContent += gitStatus;
        summaryContent += '\n### Recent Commits\n';
        const gitLog = execSync(`git -C "${projectRoot}" log -n 5 --pretty=format:'%h - %an, %ar : %s'`, { encoding: 'utf8' });
        summaryContent += gitLog;
    } catch (e) { summaryContent += `Error getting Git info: ${e.message}\n`; }
    summaryContent += '```\n\n';

    // File Structure
    summaryContent += '## Project File Structure\n```text\n';
    try {
        const tree = execSync(`tree "${frontendDir}" /A /F`, { encoding: 'utf8' });
        summaryContent += tree;
    } catch (e) { summaryContent += `Could not generate file tree. Error: ${e.message}\n`; }
    summaryContent += '```\n\n';

    // Key Config Files
    summaryContent += '## Key Configuration Files\n';
    const configFiles = ['package.json', 'next.config.mjs', 'tsconfig.json', 'tailwind.config.js'];
    configFiles.forEach(file => {
        const filePath = path.join(frontendDir, file);
        if (fs.existsSync(filePath)) {
            summaryContent += `### ${file}\n\`\`\`${file.endsWith('.json') ? 'json' : 'javascript'}\n`;
            summaryContent += fs.readFileSync(filePath, 'utf8');
            summaryContent += '\n```\n\n';
        }
    });

    // Dependency Tree
    summaryContent += '## NPM Dependency Tree (Top 5 Levels)\n```text\n';
    try {
        const npmLs = execSync('npm ls --depth=5', { cwd: frontendDir, encoding: 'utf8' });
        summaryContent += npmLs;
    } catch (err) {
        // npm ls returns a non-zero exit code if there are issues, but still outputs the tree. We'll capture stdout.
        summaryContent += err.stdout || `Error running 'npm ls': ${err.message}\n`;
    }
    summaryContent += '```\n';

    fs.writeFileSync(summaryFilePath, summaryContent, 'utf8');
    console.log('[SUCCESS] Summary report created.');

    // --- 2. Archive Source Code ---
    console.log('[+] Archiving source code...');
    const itemsToArchive = fs.readdirSync(frontendDir)
        .filter(item => !['node_modules', '.next', '.git', 'dist', 'build'].includes(item))
        .map(item => `'${path.join(frontendDir, item)}'`)
        .join(',');
    
    execSync(`powershell -Command "Compress-Archive -Path ${itemsToArchive} -DestinationPath '${sourceZipPath}' -Force"`, { stdio: 'inherit' });
    console.log('[SUCCESS] Source code archived.');

    // --- 3. Combine into Final Package ---
    console.log('[+] Combining summary and source archive into a final package...');
    execSync(`powershell -Command "Compress-Archive -Path '${summaryFilePath}','${sourceZipPath}' -DestinationPath '${finalZipPath}' -Force"`, { stdio: 'inherit' });

    // --- 4. Cleanup ---
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
