@echo off
echo SLATE360 Complete Project Export
echo ================================
echo.
echo This script will export ALL project files and information
echo including complete code from every frontend and backend file
echo into a comprehensive markdown document.
echo.
echo Running PowerShell script...
echo.

powershell -ExecutionPolicy Bypass -File "export_complete_project.ps1"

echo.
echo Export completed! Check the generated file.
pause
