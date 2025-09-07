# GATHER_PROJECT_INFO_OPTIMIZED.ps1
# This script generates a fast and comprehensive diagnostic report for the SLATE360 project.

# --- Configuration ---
$ErrorActionPreference = "Stop"
$projectRoot = "C:\Slate360"
$frontendDir = Join-Path $projectRoot "frontend"
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$outputDir = Join-Path $projectRoot "DIAGNOSTIC_REPORTS"
$finalZipName = "PROJECT_DIAGNOSTIC_$timestamp.zip"
$finalZipPath = Join-Path $outputDir $finalZipName

# --- Create output directory if it doesn't exist ---
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

Write-Host "Starting SLATE360 Diagnostic Report Generation..."

# --- Main Script Logic ---
try {
    # Define temporary file paths for the components
    $summaryFilePath = Join-Path $outputDir "SUMMARY_$timestamp.md"
    $sourceZipPath = Join-Path $outputDir "SOURCE_$timestamp.zip"
    
    # --- 1. Generate the Summary Report ---
    Write-Host "[+] Generating quick summary report..."
    
    # Build summary content
    $summaryContent = @"
# SLATE360 Project Diagnostic Summary
Generated on: $(Get-Date)

## Environment Info
PowerShell Version: $($PSVersionTable.PSVersion)
OS: $(Get-ComputerInfo | Select-Object -ExpandProperty OsName)

## Git Status
$(git -C $projectRoot status)

### Recent Commits
$(git -C $projectRoot log -n 5 --pretty=format:'%h - %an, %ar : %s')

## Project File Structure
$(Get-ChildItem -Path $frontendDir -Recurse -Exclude "node_modules", ".next" | ForEach-Object { $_.FullName.Replace($frontendDir, '') } | Out-String)

## Key Configuration Files

### package.json
$(Get-Content (Join-Path $frontendDir "package.json") -Raw)

### next.config.mjs
$(Get-Content (Join-Path $frontendDir "next.config.mjs") -Raw)

### tsconfig.json
$(Get-Content (Join-Path $frontendDir "tsconfig.json") -Raw)

### tailwind.config.js
$(Get-Content (Join-Path $frontendDir "tailwind.config.js") -Raw)

## NPM Dependency Tree
$(try { cd $frontendDir; npm ls --depth=3 2>&1 | Out-String; cd $projectRoot } catch { "Error running npm ls: $($_.Exception.Message)" })
"@

    # Write the completed summary to a file
    $summaryContent | Out-File -FilePath $summaryFilePath -Encoding UTF8
    Write-Host "[SUCCESS] Summary report created."

    # --- 2. Archive Source Code ---
    Write-Host "[+] Archiving source code..."
    $filesToArchive = Get-ChildItem -Path $frontendDir -Recurse -File -Exclude "node_modules", ".next", ".git", "dist", "build"
    Compress-Archive -Path $filesToArchive.FullName -DestinationPath $sourceZipPath -Force
    Write-Host "[SUCCESS] Source code archived."

    # --- 3. Combine into a Single Package ---
    Write-Host "[+] Combining summary and source archive into a final package..."
    $finalPackageItems = @($summaryFilePath, $sourceZipPath)
    Compress-Archive -Path $finalPackageItems -DestinationPath $finalZipPath -Force

    # --- 4. Cleanup ---
    Remove-Item $summaryFilePath
    Remove-Item $sourceZipPath
    
    Write-Host "----------------------------------------------------" -ForegroundColor Green
    Write-Host "[SUCCESS] Diagnostic report generated successfully!" -ForegroundColor Green
    Write-Host "Your complete report is located at: $finalZipPath"
    Write-Host "----------------------------------------------------" -ForegroundColor Green

} catch {
    Write-Host "[ERROR] An error occurred:" -ForegroundColor Red
    Write-Error $_.Exception.Message
}

# --- Keep Window Open ---
Read-Host -Prompt "Script finished. Press ENTER to exit"