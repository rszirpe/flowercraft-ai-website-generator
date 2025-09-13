@echo off
REM 🌸 FlowerCraft AI Website Generator - Windows Start Script

echo 🌸 FlowerCraft AI Website Generator
echo ====================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.9 or higher.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18 or higher.
    pause
    exit /b 1
)

echo 🚀 Starting FlowerCraft AI...
echo.

REM Start backend
echo 🔎 Starting backend API on port 8000...
start "Backend API" cmd /k "cd backend && python main.py"

REM Wait for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
echo 🌸 Starting beautiful frontend on port 3000...
start "Frontend UI" cmd /k "cd frontend && npm run dev"

echo.
echo ✨ FlowerCraft AI is starting up...
echo.
echo 🌍 Backend API: http://localhost:8000
echo 🌸 Frontend UI: http://localhost:3000
echo.
echo 💫 Powered by Google Gemini AI
echo.
echo Press any key to exit...
pause >nul