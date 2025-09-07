# QUICK_DEPLOYMENT.ps1
Write-Host "SLATE360 Quick Deployment" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Checking Git status..." -ForegroundColor Yellow
git status
Write-Host ""

Write-Host "Adding all changes..." -ForegroundColor Yellow
git add .
Write-Host ""

Write-Host "Committing changes..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$commitMessage = "feat: Update project - $timestamp"
git commit -m $commitMessage
Write-Host ""

Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main
Write-Host ""

Write-Host "SUCCESS! Deployment triggered!" -ForegroundColor Green
Write-Host "Site: https://slate360.vercel.app" -ForegroundColor Cyan
Write-Host ""

Read-Host -Prompt "Press ENTER to exit"
