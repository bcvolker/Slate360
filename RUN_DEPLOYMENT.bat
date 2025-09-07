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

echo [1/4] Running diagnostic report...
call RUN_DIAGNOSTIC.bat
echo.

echo [2/4] Checking Git status...
git status
echo.

echo [3/4] Committing changes...
git add .
set timestamp=%date% %time%
git commit -m "feat: Update project with diagnostic report - %timestamp%"
echo.

echo [4/4] Pushing to GitHub...
git push origin main
echo.

echo SUCCESS! Deployment workflow completed!
echo Your site should be updating at: https://slate360.vercel.app
echo.
pause