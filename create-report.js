// Simple zip creator - guaranteed to work
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = 'C:\\Slate360';
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const outputDir = path.join(projectRoot, 'DIAGNOSTIC_REPORTS');
const zipName = `PROJECT_DIAGNOSTIC_${timestamp}.zip`;
const zipPath = path.join(outputDir, zipName);

console.log('Creating diagnostic report...');

try {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Create simple summary
    const summaryContent = `# Slate360 Project Report
Generated: ${new Date().toString()}

## Project Status
- Node.js: ${process.version}
- Platform: ${process.platform}
- Project Root: ${projectRoot}

## Recent Changes
- Complete UI redesign with modern styling
- Added animations and gradients
- Professional header with navigation
- Mobile-responsive design
- Glass-morphism effects

## Files Modified
- src/app/page.tsx (complete redesign)
- src/app/globals.css (modern styling)
- src/components/CleanHeader.tsx (professional header)
`;

    const summaryFile = path.join(outputDir, `SUMMARY_${timestamp}.md`);
    fs.writeFileSync(summaryFile, summaryContent);

    // Create zip with all project files (excluding node_modules, .git, etc.)
    const itemsToZip = [
        'src',
        'public', 
        'package.json',
        'package-lock.json',
        'next.config.mjs',
        'tsconfig.json',
        'tailwind.config.js',
        'postcss.config.js',
        'README-DemoMode.md'
    ].filter(item => fs.existsSync(path.join(projectRoot, item)))
     .map(item => `"${path.join(projectRoot, item)}"`)
     .join(',');

    // Add summary file to zip
    const allItems = itemsToZip + `,"${summaryFile}"`;

    console.log('Creating zip file...');
    execSync(`powershell -Command "Compress-Archive -Path ${allItems} -DestinationPath '${zipPath}' -Force"`, { stdio: 'inherit' });

    // Clean up summary file
    fs.unlinkSync(summaryFile);

    console.log(`\n✅ SUCCESS! Zip file created: ${zipPath}`);
    console.log(`📁 Location: ${outputDir}`);

} catch (error) {
    console.error('❌ Error:', error.message);
}
