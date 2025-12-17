# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json if available
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application source code
COPY . .

# Set default port value
ENV PORT=3000

# Expose the port the app runs on
EXPOSE ${PORT}

# Start the server
CMD ["node", "server.js"]