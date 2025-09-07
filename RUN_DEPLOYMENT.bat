@echo off
echo ===============================================
echo SLATE360 Complete Deployment Workflow
echo ===============================================
echo.
echo This will:
echo 1. Run the diagnostic report
echo 2. Commit all changes to Git
echo 3. Push to GitHub
echo 4. Trigger Vercel deployment
echo.
pause

powershell.exe -ExecutionPolicy Bypass -File "%~dp0COMPLETE_DEPLOYMENT_WORKFLOW.ps1"
