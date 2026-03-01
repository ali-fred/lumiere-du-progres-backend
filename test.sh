#!/bin/bash

echo "🔹 Kora user..."
USER_RESPONSE=$(curl -s -X POST http://localhost:3000/create-user \
-H "Content-Type: application/json" \
-d '{"username":"Alfred"}')

echo "Response: $USER_RESPONSE"

# Fata ID ya user
USER_ID=$(echo $USER_RESPONSE | sed -n 's/.*"id":"\([^"]*\)".*/\1/p')

echo "🆔 User ID = $USER_ID"

echo "💰 Ongeramwo 500..."
curl -s -X POST http://localhost:3000/deposit \
-H "Content-Type: application/json" \
-d "{\"id\":\"$USER_ID\",\"amount\":500}"

echo ""
echo "📊 Users bose:"
curl -s http://localhost:3000/users

echo ""
echo "✅ Test iheze neza"
