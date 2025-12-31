@echo off
REM Complete setup script for Windows
REM Usage: setup.bat

echo.
echo AEM Visual Portal - Complete Setup
echo ======================================
echo.

REM Check if we're in the right directory
if not exist package.json (
    echo Error: Run this script from the backend directory
    echo    cd backend ^&^& setup.bat
    exit /b 1
)

REM Step 1: Check if .env exists
echo Step 1: Checking environment file...
if not exist .env (
    echo    Creating .env from .env.example...
    copy .env.example .env
    echo    Created .env file
) else (
    echo    .env file already exists
)

REM Step 2: Install pg package
echo.
echo Step 2: Installing PostgreSQL client...
npm install pg

REM Step 3: Run seed script
echo.
echo Step 3: Seeding database...
node seed-direct.js

echo.
echo Setup complete!
echo.
echo Next steps:
echo 1. Make sure backend is running: npm run dev
echo 2. Make sure frontend is running: cd ..\frontend ^&^& npm run dev
echo 3. Open http://localhost:3000
echo 4. You should see 18 components!
echo.
pause
