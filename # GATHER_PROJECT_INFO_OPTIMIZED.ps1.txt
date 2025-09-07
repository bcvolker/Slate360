# GATHER_PROJECT_INFO_OPTIMIZED.ps1
# This script generates a fast and comprehensive diagnostic report for the SLATE360 project.

# --- Configuration ---
$ErrorActionPreference = "Stop" # Stop the script on any error
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

    # --- 1. Generate the Summary Report (Fast Operation) ---
    Write-Host "[+] Generating quick summary report..."

    $summaryContent = [System.Text.StringBuilder]::new()

    $summaryContent.AppendLine("# SLATE360 Project Diagnostic Summary") | Out-Null
    $summaryContent.AppendLine("Generated on: $(Get-Date)") | Out-Null
    $summaryContent.AppendLine("") | Out-Null

    # -- Environment & Git Info --
    $summaryContent.AppendLine("## Environment Info") | Out-Null
    $summaryContent.AppendLine("```text") | Out-Null
    $summaryContent.AppendLine("PowerShell Version: $($PSVersionTable.PSVersion)") | Out-Null
    $summaryContent.AppendLine("$(Get-ComputerInfo | Select-Object "OsName", "OsVersion" | Format-List | Out-String)") | Out-Null
    $summaryContent.AppendLine("```") | Out-Null

    $summaryContent.AppendLine("## Git Status") | Out-Null
    $summaryContent.AppendLine("```text") | Out-Null
    $summaryContent.AppendLine("$(git -C $projectRoot status)") | Out-Null
    $summaryContent.AppendLine("### Recent Commits") | Out-Null
    $summaryContent.AppendLine("$(git -C $projectRoot log -n 5 --pretty=format:'%h - %an, %ar : %s')") | Out-Null
    $summaryContent.AppendLine("```") | Out-Null

    # -- Project Structure Tree --
    $summaryContent.AppendLine("## Project File Structure") | Out-Null
    $summaryContent.AppendLine("```text") | Out-Null
    if (Get-Command tree -ErrorAction SilentlyContinue) {
        $summaryContent.AppendLine("$(tree $frontendDir /A /F | Out-String)") | Out-Null
    } else {
         $summaryContent.AppendLine("$(Get-ChildItem -Path $frontendDir -Recurse -Exclude "node_modules", ".next" | ForEach-Object { $_.FullName.Replace($frontendDir, "") } | Out-String)") | Out-Null
    }
    $summaryContent.AppendLine("```") | Out-Null

    # -- Key Configuration Files --
    $summaryContent.AppendLine("## Key Configuration Files") | Out-Null
    $configFiles = @("package.json", "next.config.mjs", "tsconfig.json", "tailwind.config.js")
    foreach ($file in $configFiles) {
        $filePath = Join-Path $frontendDir $file
        if (Test-Path $filePath) {
            $summaryContent.AppendLine("### $file") | Out-Null
            $language = if ($file.EndsWith(".json")) { "json" } else { "javascript" }
            $summaryContent.AppendLine("``````$language") | Out-Null
            $summaryContent.AppendLine("$(Get-Content $filePath -Raw)") | Out-Null
            $summaryContent.AppendLine("``````") | Out-Null
        }
    }

    # -- Dependency Tree --
    $summaryContent.AppendLine("## NPM Dependency Tree (Top 5 Levels)") | Out-Null
    $summaryContent.AppendLine("```text") | Out-Null
    try {
        cd $frontendDir
        $summaryContent.AppendLine("$(npm ls --depth=5 2>&1 | Out-String)") | Out-Null
        cd $projectRoot
    } catch {
        $summaryContent.AppendLine("Error running 'npm ls': $($_.Exception.Message)") | Out-Null
    }
    $summaryContent.AppendLine("```") | Out-Null

    # Write the completed summary to a file
    $summaryContent.ToString() | Out-File -FilePath $summaryFilePath -Encoding UTF8
    Write-Host "[SUCCESS] Summary report created."

    # --- 2. Archive Source Code (Fast I/O Operation) ---
    Write-Host "[+] Archiving source code (excluding node_modules, .next, etc.)..."
    $itemsToArchive = Get-ChildItem -Path $frontendDir -Exclude "node_modules", ".next", ".git", "dist", "build"
    Compress-Archive -Path $itemsToArchive.FullName -DestinationPath $sourceZipPath -Force
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
    # If any error occurs, write it to the screen
    Write-Host "[ERROR] An error occurred:" -ForegroundColor Red
    Write-Error $_.Exception.Message
}

# --- Keep Window Open ---
Read-Host -Prompt "Script finished. Press ENTER to exit"