#!/bin/sh
# Start the main server
npm run dev &
MAIN_PID=$!

# Wait a bit for the main server to start
sleep 5

# Start the proxy server
npx tsx proxy-server.ts &
PROXY_PID=$!

# Function to handle termination signals
cleanup() {
  echo "Shutting down servers..."
  kill $MAIN_PID
  kill $PROXY_PID
  exit 0
}

# Set up trap for termination signals
trap cleanup SIGINT SIGTERM

# Keep the script running
wait