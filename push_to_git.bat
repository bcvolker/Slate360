@echo off
cd /d C:\Slate360
git add frontend/
git add *.ps1 *.bat *.md *.js
git commit -m "Add complete Slate360 project files"
git push slate360-v2 main --force
echo Push completed!
pause
