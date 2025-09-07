# C:\Slate360\Generate-AI-Report.ps1

# --- Configuration ---
$ErrorActionPreference = "Stop" # Stop the script immediately on any error
$projectRoot = "C:\Slate360"
$frontendDir = Join-Path $projectRoot "frontend"
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$outputBaseName = "SLATE360_DIAGNOSTIC_REPORT_$timestamp"
$outputFilePart1 = Join-Path $projectRoot "$($outputBaseName)_PART1.md"
$outputFilePart2 = Join-Path $projectRoot "$($outputBaseName)_PART2.md"

Write-Host "--- Starting SLATE360 Diagnostic Report Generation ---" -ForegroundColor Green

try {
    # --- PART 1: Project Overview, Configs, and Build Log ---
    Write-Host "Generating Part 1: Overview, Configs, and Build Log..."
    
    # Run npm run build first and capture all output
    Write-Host "Running 'npm run build' inside '$frontendDir'..."
    cd $frontendDir
    $buildOutput = (npm run build 2>&1 | Out-String)
    cd $projectRoot
    Write-Host "Build command finished."

    $part1Content = @"
# SLATE360 Diagnostic Report (Part 1 of 2)
Generated on: $(Get-Date)
====================================================================

## Build Log Output
$buildOutput


## Tech Stack & Versions (from package.json)
```json
$(Get-Content (Join-Path $frontendDir 'package.json') | ConvertFrom-Json | Select-Object name, version, dependencies, devDependencies | ConvertTo-Json -Depth 5)
```

## File & Folder Structure
$(Get-ChildItem -Path $projectRoot -Recurse -Exclude "node_modules", ".next", ".git" | ForEach-Object { $_.FullName.Replace("$projectRoot\", "") } | Out-String)

## next.config.mjs
```javascript
$(Get-Content (Join-Path $frontendDir 'next.config.mjs') -Raw)
```

## tsconfig.json
```json
$(Get-Content (Join-Path $frontendDir 'tsconfig.json') -Raw)
```
"@
    $part1Content | Out-File -FilePath $outputFilePart1 -Encoding UTF8
    Write-Host "✅ Part 1 successfully created at: $outputFilePart1"

    # --- PART 2: Complete Source Code Dump ---
    Write-Host "Generating Part 2: Complete Source Code Dump..."
    $part2Header = @"
# SLATE360 Diagnostic Report (Part 2 of 2)
Generated on: $(Get-Date)
====================================================================

## Complete Source Code
"@
    $part2Header | Out-File -FilePath $outputFilePart2 -Encoding UTF8

    $sourceFiles = Get-ChildItem -Path $frontendDir -Recurse -Include *.ts, *.tsx, *.js, *.mjs, *.json, *.css, *.md -Exclude "node_modules", ".next", "package-lock.json"

    foreach ($file in $sourceFiles) {
        $relativePath = $file.FullName.Replace("$frontendDir\", "frontend\")
        $fileContent = Get-Content $file.FullName -Raw
        $fileBlock = @"

### File: $relativePath
```typescript
$fileContent
```
"@
        $fileBlock | Out-File -FilePath $outputFilePart2 -Encoding UTF8 -Append
    }
    Write-Host "✅ Part 2 successfully created at: $outputFilePart2"
    Write-Host "`n--- Report Generation Complete ---" -ForegroundColor Green

} catch {
    Write-Host "`n❌ An error occurred:" -ForegroundColor Red
    Write-Error $_.Exception.Message
    Write-Host "The script could not complete." -ForegroundColor Yellow
}

Write-Host ""
Read-Host -Prompt "Press ENTER to exit"
