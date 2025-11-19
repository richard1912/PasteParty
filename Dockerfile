# PasteParty Dockerfile
# Lightweight Node.js 20 Alpine Linux image (~150MB)

FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application files
COPY server.js ./
COPY public ./public

# Create data directory
RUN mkdir -p /app/data

# Expose port
EXPOSE 8081

# Set environment variable
ENV NODE_ENV=production

# Start the application
CMD ["node", "server.js"]
