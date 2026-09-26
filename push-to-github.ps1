#!/usr/bin/env pwsh

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🚀 GitHub Push Script" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "❌ Git not initialized!" -ForegroundColor Red
    Write-Host "Run: git init" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Git repository found" -ForegroundColor Green
Write-Host ""

# Get GitHub username
$username = Read-Host "Enter your GitHub username"

if ([string]::IsNullOrWhiteSpace($username)) {
    Write-Host "❌ Username required!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📋 Steps you need to follow:" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  Go to: https://github.com/new" -ForegroundColor White
Write-Host "2️⃣  Repository name: new-brother-picklebar" -ForegroundColor White
Write-Host "3️⃣  Make it Public" -ForegroundColor White
Write-Host "4️⃣  Click 'Create repository'" -ForegroundColor White
Write-Host ""
Write-Host "Press Enter when done..." -ForegroundColor Yellow
Read-Host

Write-Host ""
Write-Host "🔄 Adding remote and pushing..." -ForegroundColor Cyan

# Add remote
$repoUrl = "https://github.com/$username/new-brother-picklebar.git"
git remote add origin $repoUrl 2>$null

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Remote already exists, updating..." -ForegroundColor Yellow
    git remote set-url origin $repoUrl
}

# Push to GitHub
Write-Host "📤 Pushing to GitHub..." -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
    Write-Host "🎉 SUCCESS! Repository pushed!" -ForegroundColor Green
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 Your repository URL:" -ForegroundColor Cyan
    Write-Host "   https://github.com/$username/new-brother-picklebar" -ForegroundColor White
    Write-Host ""
    Write-Host "🌐 View in browser:" -ForegroundColor Cyan
    Write-Host "   https://github.com/$username/new-brother-picklebar" -ForegroundColor White
    Write-Host ""
    
    # Ask to open browser
    $open = Read-Host "Open in browser? (Y/n)"
    if ($open -ne 'n') {
        Start-Process "https://github.com/$username/new-brother-picklebar"
    }
} else {
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Red
    Write-Host "❌ Push failed!" -ForegroundColor Red
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "1. Authentication failed - Use GitHub Desktop or Personal Access Token" -ForegroundColor White
    Write-Host "2. Repository not created - Make sure you created the repo on GitHub first" -ForegroundColor White
    Write-Host "3. Internet connection - Check your internet" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 Easiest solution: Use GitHub Desktop" -ForegroundColor Cyan
    Write-Host "   Download: https://desktop.github.com/" -ForegroundColor White
}
