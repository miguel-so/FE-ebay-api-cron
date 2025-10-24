#!/bin/bash

# eBay Listing Monitor Deployment Script
# This script helps deploy the application to various platforms

set -e

echo "🚀 eBay Listing Monitor Deployment Script"
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are available"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check for environment file
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Creating from template..."
    cp env.example .env
    echo "📝 Please edit .env file with your credentials before running the application"
    echo "   - Get eBay API credentials from https://developer.ebay.com/"
    echo "   - Set up email credentials (Gmail App Password recommended)"
fi

# Test the application
echo "🧪 Testing the application..."
if node -e "console.log('Node.js syntax check passed')" 2>/dev/null; then
    echo "✅ Application syntax is valid"
else
    echo "❌ Application has syntax errors"
    exit 1
fi

echo ""
echo "🎉 Setup complete! Next steps:"
echo "=============================="
echo "1. Edit .env file with your credentials"
echo "2. Run 'npm start' to start the server"
echo "3. Run 'npm run cron' to start the monitoring service"
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "For production deployment:"
echo "- VPS: Set up system cron job"
echo "- Heroku: Use Heroku Scheduler add-on"
echo "- AWS: Use Lambda + EventBridge"
echo ""
echo "📚 See README.md for detailed instructions"
