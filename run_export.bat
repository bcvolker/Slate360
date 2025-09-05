@echo off
echo Running SLATE360 Project Export Script...
echo.
powershell -ExecutionPolicy Bypass -File "export_complete_project.ps1"
echo.
echo Export completed! Check the generated files.
pause
