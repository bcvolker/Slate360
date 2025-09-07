# COMPLETE_DEPLOYMENT_WORKFLOW.ps1
Write-Host "SLATE360 Complete Deployment Workflow" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/4] Running diagnostic report..." -ForegroundColor Yellow
& ".\RUN_DIAGNOSTIC.bat"
Write-Host "Diagnostic report completed!" -ForegroundColor Green
Write-Host ""

Write-Host "[2/4] Checking Git status..." -ForegroundColor Yellow
git status
Write-Host ""

Write-Host "[3/4] Committing changes..." -ForegroundColor Yellow
git add .
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$commitMessage = "feat: Update project with diagnostic report - $timestamp"
git commit -m $commitMessage
Write-Host "Changes committed!" -ForegroundColor Green
Write-Host ""

Write-Host "[4/4] Pushing to GitHub..." -ForegroundColor Yellow
git push origin main
Write-Host ""

Write-Host "SUCCESS! Deployment workflow completed!" -ForegroundColor Green
Write-Host "Your site should be updating at: https://slate360.vercel.app" -ForegroundColor Cyan
Write-Host ""

Read-Host -Prompt "Press ENTER to exit"