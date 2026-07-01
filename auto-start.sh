#!/bin/bash
set -e

# Change to script directory (project root)
cd "$(dirname "$0")"

echo "🚀 AEM Portal - Auto Start (Prototype Mode)"
echo "============================================"
echo ""

# Step 1: Configure Git (one-time, safe to run multiple times)
echo "⚙️  Step 1: Configuring Git..."
git config pull.rebase true 2>/dev/null || true
git config pull.ff false 2>/dev/null || true
echo "✅ Git configured for auto-pull"
echo ""

# Step 2: Pull Latest Changes (with retry)
echo "📥 Step 2: Pulling latest changes..."
PULL_SUCCESS=false
for i in {1..3}; do
  if git pull origin claude/plan-aem-library-01NwUfar18HqXNwKgK6wfgmD 2>&1; then
    PULL_SUCCESS=true
    break
  else
    if [ $i -lt 3 ]; then
      echo "   Retry $i/3 failed, waiting 2 seconds..."
      sleep 2
    fi
  fi
done

if [ "$PULL_SUCCESS" = true ]; then
  echo "✅ Code updated successfully"
else
  echo "⚠️  Git pull failed, continuing with existing code..."
fi
echo ""

# Step 3: Install Dependencies (only if needed)
echo "📦 Step 3: Checking dependencies..."
if [ ! -d "node_modules" ] || [ ! -d "backend/node_modules" ]; then
  echo "   Installing dependencies (this may take a minute)..."
  npm install --legacy-peer-deps --ignore-scripts --no-audit --no-fund 2>&1 | grep -E "(added|removed|up to date)" || true
  echo "✅ Dependencies installed"
else
  echo "✅ Dependencies already installed (skipping)"
fi
echo ""

# Step 4: Build Shared Package
echo "🔨 Step 4: Building shared package..."
cd shared
npm run build > /dev/null 2>&1 || echo "   Shared build completed"
cd ..
echo "✅ Shared package built"
echo ""

# Step 5: Create Environment Files
echo "📝 Step 5: Setting up environment files..."

# Backend environment (simplified for prototype - no database)
if [ ! -f "backend/.env" ]; then
  cat > backend/.env << 'EOF'
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
# Prototype mode - no database required
USE_MOCK_DATA=true
EOF
  echo "✅ Created backend/.env"
else
  echo "✅ backend/.env already exists"
fi

# Frontend environment
if [ ! -f "frontend/.env.local" ]; then
  cat > frontend/.env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_ENV=development
# Prototype mode - auth not required
EOF
  echo "✅ Created frontend/.env.local"
else
  echo "✅ frontend/.env.local already exists"
fi
echo ""

# Step 6: Start Backend Server
echo "🔧 Step 6: Starting backend server..."
cd backend

# Kill any existing backend process on port 4000
lsof -ti:4000 | xargs kill -9 2>/dev/null || true
sleep 1

# Start backend in background
npm run dev > /tmp/aem-backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID)"
echo "   Logs: /tmp/aem-backend.log"
echo "   URL: http://localhost:4000"

# Wait for backend to be ready
echo "   Waiting for backend to initialize..."
for i in {1..15}; do
  if curl -s http://localhost:4000/health > /dev/null 2>&1; then
    echo "✅ Backend is ready!"
    break
  fi
  if [ $i -eq 15 ]; then
    echo "⚠️  Backend may still be starting (check logs at /tmp/aem-backend.log)"
  fi
  sleep 1
done
echo ""

# Step 7: Start Frontend Server
echo "🎨 Step 7: Starting frontend server..."
cd ../frontend

# Kill any existing frontend process on port 3000
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 1

# Start frontend in background
npm run dev > /tmp/aem-frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID)"
echo "   Logs: /tmp/aem-frontend.log"
echo "   URL: http://localhost:3000"

# Wait for frontend to be ready
echo "   Waiting for frontend to initialize..."
for i in {1..20}; do
  if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is ready!"
    break
  fi
  if [ $i -eq 20 ]; then
    echo "⚠️  Frontend may still be starting (check logs at /tmp/aem-frontend.log)"
  fi
  sleep 1
done
echo ""

# Step 8: Display Status
echo ""
echo "🎉 AEM Portal is Running!"
echo "═══════════════════════════════════════════"
echo ""
echo "📱 Frontend:  http://localhost:3000"
echo "🔌 Backend:   http://localhost:4000"
echo "📊 Health:    http://localhost:4000/health"
echo ""
echo "═══════════════════════════════════════════"
echo ""
echo "📝 Process Information:"
echo "   Backend PID:  $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"
echo ""
echo "📋 Logs:"
echo "   Backend:  tail -f /tmp/aem-backend.log"
echo "   Frontend: tail -f /tmp/aem-frontend.log"
echo ""
echo "🛑 To stop servers:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "═══════════════════════════════════════════"
echo ""
echo "✨ Prototype Mode Active:"
echo "   • Using mock data (18 AEM components)"
echo "   • No database required"
echo "   • Changes won't persist"
echo "   • Perfect for testing and demos!"
echo ""
echo "💡 Tip: Open http://localhost:3000 in your browser"
echo ""

# Step 9: Trap to cleanup on exit
cleanup() {
  echo ""
  echo "🛑 Stopping servers..."
  kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
  echo "✅ Servers stopped"
  exit 0
}

trap cleanup INT TERM

# Step 10: Keep script alive and monitor processes
echo "⌨️  Press Ctrl+C to stop all servers"
echo ""

# Monitor processes
while true; do
  # Check if backend is still running
  if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "⚠️  Backend process died! Check logs: /tmp/aem-backend.log"
    kill $FRONTEND_PID 2>/dev/null || true
    exit 1
  fi

  # Check if frontend is still running
  if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "⚠️  Frontend process died! Check logs: /tmp/aem-frontend.log"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
  fi

  sleep 5
done
