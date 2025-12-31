#!/bin/bash
# Complete setup script - Run this on your Mac
# Usage: bash setup.sh

set -e  # Exit on error

echo "🚀 AEM Visual Portal - Complete Setup"
echo "======================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the backend directory"
    echo "   cd backend && bash setup.sh"
    exit 1
fi

# Step 1: Check if .env exists
echo "📝 Step 1: Checking environment file..."
if [ ! -f ".env" ]; then
    echo "   Creating .env from .env.example..."
    cp .env.example .env
    echo "   ✅ Created .env file"
else
    echo "   ✅ .env file already exists"
fi

# Step 2: Install pg package
echo ""
echo "📦 Step 2: Installing PostgreSQL client..."
if npm list pg > /dev/null 2>&1; then
    echo "   ✅ pg package already installed"
else
    echo "   Installing pg..."
    npm install pg
    echo "   ✅ pg package installed"
fi

# Step 3: Run seed script
echo ""
echo "🌱 Step 3: Seeding database..."
node seed-direct.js

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Make sure backend is running: npm run dev"
echo "2. Make sure frontend is running: cd ../frontend && npm run dev"
echo "3. Open http://localhost:3000"
echo "4. You should see 18 components!"
echo ""
