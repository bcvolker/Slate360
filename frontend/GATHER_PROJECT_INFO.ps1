# SLATE360 Project Information Gatherer
# Run this script to collect all project information for AI assistance

Write-Host "=== SLATE360 PROJECT DIAGNOSTIC SCRIPT ===" -ForegroundColor Green
Write-Host ""

# Create output file
$outputFile = "PROJECT_DIAGNOSTIC_$(Get-Date -Format 'yyyyMMdd_HHmmss').txt"
Write-Host "Creating diagnostic file: $outputFile" -ForegroundColor Yellow

# Start collecting information
"=== SLATE360 PROJECT DIAGNOSTIC REPORT ===" | Out-File $outputFile
"Generated: $(Get-Date)" | Out-File $outputFile -Append
"" | Out-File $outputFile -Append

# Git Information
Write-Host "Collecting Git information..." -ForegroundColor Cyan
"=== GIT INFORMATION ===" | Out-File $outputFile -Append
git branch -a | Out-File $outputFile -Append
git log --oneline -10 | Out-File $outputFile -Append
git status | Out-File $outputFile -Append
git remote -v | Out-File $outputFile -Append
"" | Out-File $outputFile -Append

# File Structure
Write-Host "Collecting file structure..." -ForegroundColor Cyan
"=== FILE STRUCTURE ===" | Out-File $outputFile -Append
Get-ChildItem -Recurse -Name | Out-File $outputFile -Append
"" | Out-File $outputFile -Append

# Package.json
Write-Host "Collecting package.json..." -ForegroundColor Cyan
"=== PACKAGE.JSON ===" | Out-File $outputFile -Append
Get-Content package.json | Out-File $outputFile -Append
"" | Out-File $outputFile -Append

# Next.js Config
Write-Host "Collecting Next.js config..." -ForegroundColor Cyan
"=== NEXT.CONFIG.MJS ===" | Out-File $outputFile -Append
Get-Content next.config.mjs | Out-File $outputFile -Append
"" | Out-File $outputFile -Append

# Key Source Files
Write-Host "Collecting key source files..." -ForegroundColor Cyan

# Layout files
"=== LAYOUT FILES ===" | Out-File $outputFile -Append
"--- src/app/layout.tsx ---" | Out-File $outputFile -Append
Get-Content src/app/layout.tsx | Out-File $outputFile -Append
"" | Out-File $outputFile -Append

"--- src/app-shell/SimpleAppShell.tsx ---" | Out-File $outputFile -Append
Get-Content src/app-shell/SimpleAppShell.tsx | Out-File $outputFile -Append
"" | Out-File $outputFile -Append

"--- src/app-shell/index.ts ---" | Out-File $outputFile -Append
Get-Content src/app-shell/index.ts | Out-File $outputFile -Append
"" | Out-File $outputFile -Append

# Header component
"=== HEADER COMPONENT ===" | Out-File $outputFile -Append
"--- src/components/CleanHeader.tsx ---" | Out-File $outputFile -Append
Get-Content src/components/CleanHeader.tsx | Out-File $outputFile -Append
"" | Out-File $outputFile -Append

# Homepage
"=== HOMEPAGE ===" | Out-File $outputFile -Append
"--- src/app/page.tsx (first 100 lines) ---" | Out-File $outputFile -Append
Get-Content src/app/page.tsx | Select-Object -First 100 | Out-File $outputFile -Append
"" | Out-File $outputFile -Append

# CEO page
"=== CEO DASHBOARD ===" | Out-File $outputFile -Append
"--- src/app/ceo/page.tsx (first 50 lines) ---" | Out-File $outputFile -Append
Get-Content src/app/ceo/page.tsx | Select-Object -First 50 | Out-File $outputFile -Append
"" | Out-File $outputFile -Append

# Diagnostic checks
Write-Host "Running diagnostic checks..." -ForegroundColor Cyan
"=== DIAGNOSTIC CHECKS ===" | Out-File $outputFile -Append

# Check if changes are in files
"--- Checking for h-20 logo size ---" | Out-File $outputFile -Append
Select-String -Path "src\components\CleanHeader.tsx" -Pattern "h-20" | Out-File $outputFile -Append
"" | Out-File $outputFile -Append

"--- Checking for Reports & Analytics ---" | Out-File $outputFile -Append
Select-String -Path "src\app\page.tsx" -Pattern "REPORTS & ANALYTICS" | Out-File $outputFile -Append
"" | Out-File $outputFile -Append

"--- Checking for CEO page ---" | Out-File $outputFile -Append
Test-Path "src\app\ceo\page.tsx" | Out-File $outputFile -Append
"" | Out-File $outputFile -Append

"--- Checking for test changes ---" | Out-File $outputFile -Append
Select-String -Path "src\app\page.tsx" -Pattern "TEST CHANGE" | Out-File $outputFile -Append
"" | Out-File $outputFile -Append

# Environment info
Write-Host "Collecting environment information..." -ForegroundColor Cyan
"=== ENVIRONMENT INFORMATION ===" | Out-File $outputFile -Append
"PowerShell Version: $($PSVersionTable.PSVersion)" | Out-File $outputFile -Append
"Current Directory: $(Get-Location)" | Out-File $outputFile -Append
"Node.js Version:" | Out-File $outputFile -Append
node --version 2>&1 | Out-File $outputFile -Append
"NPM Version:" | Out-File $outputFile -Append
npm --version 2>&1 | Out-File $outputFile -Append
"" | Out-File $outputFile -Append

# Build test
Write-Host "Testing build process..." -ForegroundColor Cyan
"=== BUILD TEST ===" | Out-File $outputFile -Append
"Running: npm run build" | Out-File $outputFile -Append
try {
    npm run build 2>&1 | Out-File $outputFile -Append
} catch {
    "Build failed: $($_.Exception.Message)" | Out-File $outputFile -Append
}
"" | Out-File $outputFile -Append

Write-Host ""
Write-Host "=== DIAGNOSTIC COMPLETE ===" -ForegroundColor Green
Write-Host "Output file created: $outputFile" -ForegroundColor Yellow
Write-Host "File size: $((Get-Item $outputFile).Length) bytes" -ForegroundColor Yellow
Write-Host ""
Write-Host "You can now share this file with other AI assistants for help." -ForegroundColor Cyan
Write-Host "The file contains all project information, code, and diagnostic data." -ForegroundColor Cyan
