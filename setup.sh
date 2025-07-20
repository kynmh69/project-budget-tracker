#!/bin/bash

echo "🚀 Setting up Project Budget Tracker..."

# Backend setup
echo "📦 Setting up backend..."
cd backend

# Copy environment file
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created backend .env file"
fi

# Install Go dependencies
echo "⬇️ Installing Go dependencies..."
go mod tidy

# Generate Prisma client
echo "🔧 Generating Prisma client..."
go run github.com/steebchen/prisma-client-go generate

# Push database schema
echo "💾 Setting up database..."
go run github.com/steebchen/prisma-client-go db push

echo "✅ Backend setup complete!"

# Frontend setup
echo "📦 Setting up frontend..."
cd ../frontend

# Copy environment file
if [ ! -f .env.local ]; then
    cp .env.local.example .env.local
    echo "✅ Created frontend .env.local file"
fi

# Install Node.js dependencies
echo "⬇️ Installing Node.js dependencies..."
npm install

echo "✅ Frontend setup complete!"

cd ..

echo "🎉 Setup complete! Use ./start-dev.sh to start development servers."