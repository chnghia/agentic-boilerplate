#!/bin/bash
set -e

# Load .env variables
if [ -f .env ]; then
  export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
fi

echo "🚀 Starting Backend (FastAPI with integrated LangGraph)..."
echo "   - Database: $DB_URI"
echo "   - LLM Base URL: $LLM_BASE_URL"
echo "   - LLM Model: $LLM_MODEL"

cd src/backend

# Run uvicorn
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
