#! /bin/bash

echo "Checking for required files and directories..."

# Make sure we're in the right place
if [ ! -a "./chat-bot.js" -o ! -a "./music-bot.js" ] 
  then
    echo "ERROR: This script should only be run in the elhg-discord directory!"
    kill -INT $$
fi

# Verify or create the log directory
if [ ! -d "./logs/" ]
  then 
    mkdir logs
fi

# Start the chat bot
echo "Starting Chat Bot"
forever start -o ./logs/chatbot.log -e ./logs/chatboterr.log -a chat-bot.js

# # Start the music bot
echo "Starting Music Bot"
forever start -o ./logs/musicbot.log -e ./logs/musicboterr.log -a music-bot.js
