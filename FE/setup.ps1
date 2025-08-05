# E-commerce Frontend Monorepo Setup Script
Write-Host "🚀 Setting up E-commerce Frontend Monorepo" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js (v16 or higher) first." -ForegroundColor Red
    exit 1
}

# Install root dependencies
Write-Host "📦 Installing root dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install root dependencies" -ForegroundColor Red
    exit 1
}

# Install web dependencies
Write-Host "🌐 Installing web application dependencies..." -ForegroundColor Yellow
Set-Location packages/web
npm install
Set-Location ../..

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install web dependencies" -ForegroundColor Red
    exit 1
}

# Install mobile dependencies
Write-Host "📱 Installing mobile application dependencies..." -ForegroundColor Yellow
Set-Location packages/mobile
npm install
Set-Location ../..

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install mobile dependencies" -ForegroundColor Red
    exit 1
}

# Install shared package dependencies
Write-Host "🔧 Installing shared package dependencies..." -ForegroundColor Yellow
Set-Location packages/shared
npm install
Set-Location ../..

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install shared package dependencies" -ForegroundColor Red
    exit 1
}

# Build shared package
Write-Host "🔨 Building shared package..." -ForegroundColor Yellow
Set-Location packages/shared
npm run build
Set-Location ../..

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to build shared package" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "📖 Read the README.md for detailed instructions" -ForegroundColor White
Write-Host "🌐 Start web app: npm run web" -ForegroundColor White
Write-Host "📱 Start mobile app: npm run mobile" -ForegroundColor White
Write-Host ""
Write-Host "Happy coding! 🚀" -ForegroundColor Green
