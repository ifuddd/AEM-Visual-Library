#!/bin/bash
# Run this script on YOUR Mac where Docker is running
# NOT in the Claude Code remote environment

set -e

echo "🚀 AEM Portal Setup Script"
echo "=========================="
echo ""

# Step 1: Pull latest changes
echo "📥 Step 1: Pulling latest changes..."
git pull origin claude/plan-aem-library-01NwUfar18HqXNwKgK6wfgmD
echo "✅ Git pull complete"
echo ""

# Step 2: Install dependencies
echo "📦 Step 2: Installing dependencies..."
npm install --legacy-peer-deps
echo "✅ Dependencies installed"
echo ""

# Step 3: Setup backend environment
echo "📝 Step 3: Setting up backend environment..."
cd backend
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file"
else
    echo "✅ .env file already exists"
fi
cd ..
echo ""

# Step 4: Setup frontend environment
echo "📝 Step 4: Setting up frontend environment..."
cd frontend
if [ ! -f .env.local ]; then
    cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_ENV=development
EOF
    echo "✅ Created .env.local file"
else
    echo "✅ .env.local file already exists"
fi
cd ..
echo ""

# Step 5: Generate Prisma client
echo "🔧 Step 5: Generating Prisma client..."
cd backend
npx prisma generate
echo "✅ Prisma client generated"
echo ""

# Step 6: Run database migrations
echo "🗄️  Step 6: Running database migrations..."
npx prisma migrate dev --name init
echo "✅ Database migrations complete"
echo ""

# Step 7: Seed database
echo "🌱 Step 7: Seeding database with 18 components..."
npx prisma db seed
echo "✅ Database seeded successfully"
echo ""

# Step 8: Verify database
echo "🔍 Step 8: Verifying database..."
COMPONENT_COUNT=$(psql "${DATABASE_URL:-postgresql://postgres:postgres@localhost:5432/aem_portal}" -t -c "SELECT COUNT(*) FROM \"Component\";")
echo "✅ Database has $COMPONENT_COUNT components"
echo ""

# Step 9: Instructions for starting servers
echo "🎉 Setup Complete!"
echo ""
echo "===================="
echo "Next Steps:"
echo "===================="
echo ""
echo "Open TWO terminal windows:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend"
echo "  npm run dev"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:3000"
echo ""
echo "You should see 18 AEM components!"
echo ""
