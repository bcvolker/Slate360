@echo off
echo Starting SLATE360 Diagnostic Report Generation...
echo.
powershell.exe -ExecutionPolicy Bypass -File "%~dp0GATHER_PROJECT_INFO_FIXED.ps1"
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Script failed with exit code %errorlevel%
    echo Please check the error messages above.
)
echo.
pause
