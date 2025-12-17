ARG BUILD_FROM
FROM $BUILD_FROM

# Install requirements for addon
RUN apk add --no-cache \
    nodejs \
    npm

# Create app directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application files
COPY server.js ./

# Copy addon run script
COPY run.sh /
RUN chmod a+x /run.sh

# Expose port
EXPOSE 3000

CMD [ "/run.sh" ]