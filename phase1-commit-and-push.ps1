# Phase 1: Commit and Push Changes
# This script commits the visual design recovery and stabilization changes

Write-Host "Phase 1: Committing visual design recovery and stabilization changes..." -ForegroundColor Green

# Add all changes
Write-Host "Adding all changes to git..." -ForegroundColor Yellow
git add .

# Commit with the exact message specified
Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "chore: restore and stabilize visual design"

# Push the feature/recover-and-stabilize branch to origin
Write-Host "Pushing feature/recover-and-stabilize branch to origin..." -ForegroundColor Yellow
git push origin feature/recover-and-stabilize

Write-Host "Phase 1 completed successfully!" -ForegroundColor Green
Write-Host "Changes committed and pushed to feature/recover-and-stabilize branch." -ForegroundColor Cyan
