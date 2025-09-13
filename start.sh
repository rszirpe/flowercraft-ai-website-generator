#!/bin/bash

# 🌸 FlowerCraft AI Website Generator - Start Script

echo "🌸 FlowerCraft AI Website Generator"
echo "===================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.9 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

echo "🚀 Starting FlowerCraft AI..."
echo ""

# Start backend
echo "🔎 Starting backend API on port 8000..."
cd backend
python3 main.py &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🌸 Starting beautiful frontend on port 3000..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✨ FlowerCraft AI is starting up..."
echo ""
echo "🌍 Backend API: http://localhost:8000"
echo "🌸 Frontend UI: http://localhost:3000"
echo ""
echo "💫 Powered by Google Gemini AI"
echo ""
echo "Press Ctrl+C to stop both services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "👋 Stopping FlowerCraft AI..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for processes
wait