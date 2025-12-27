#!/bin/bash
set -e

# Load .env variables
if [ -f .env ]; then
  export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
fi

# Set environment variables for frontend
export VITE_INTERNAL_API_URL="${VITE_INTERNAL_API_URL:-http://localhost:8000}"
export JWT_SECRET="${JWT_SECRET:-super-secret-jwt-token-with-at-least-32-characters-long}"

echo "🚀 Starting Web (Next.js)..."
echo "   - URL: http://localhost:5173"
echo "   - Backend: $VITE_INTERNAL_API_URL"

cd src/web

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

npm run dev
