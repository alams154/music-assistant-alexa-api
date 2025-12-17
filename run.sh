#!/usr/bin/with-contenv bashio

bashio::log.info "Starting Music Assistant Alexa API Addon..."

# Get configuration from Home Assistant addon options
USERNAME=$(bashio::config 'username')
PASSWORD=$(bashio::config 'password')
PORT=$(bashio::config 'port')

# Set environment variables for the application
if bashio::config.has_value 'username'; then
    export USERNAME="$USERNAME"
    bashio::log.info "Authentication enabled with username: $USERNAME"
fi

if bashio::config.has_value 'password'; then
    export PASSWORD="$PASSWORD"
fi

export PORT="$PORT"

bashio::log.info "API will be available on port $PORT"

# Change to app directory
cd /app

# Start the application
exec node server.js