#!/bin/bash

echo "🛑 Stopping Project Budget Tracker Development Servers..."

# Kill backend processes
pkill -f "go run main.go"

# Kill frontend processes  
pkill -f "npm run dev"

echo "✅ All development servers stopped!"