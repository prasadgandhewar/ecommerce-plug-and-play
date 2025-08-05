#!/bin/bash

echo "🚀 Setting up E-commerce Frontend Monorepo"
echo "==========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="16.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js version $NODE_VERSION is not supported. Please install Node.js v16 or higher."
    exit 1
fi

echo "✅ Node.js version: $NODE_VERSION"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install web dependencies
echo "🌐 Installing web application dependencies..."
cd packages/web
npm install
cd ../..

# Install mobile dependencies
echo "📱 Installing mobile application dependencies..."
cd packages/mobile
npm install
cd ../..

# Install shared package dependencies
echo "🔧 Installing shared package dependencies..."
cd packages/shared
npm install
cd ../..

# Build shared package
echo "🔨 Building shared package..."
cd packages/shared
npm run build
cd ../..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "📖 Read the README.md for detailed instructions"
echo "🌐 Start web app: npm run web"
echo "📱 Start mobile app: npm run mobile"
echo ""
echo "Happy coding! 🚀"
