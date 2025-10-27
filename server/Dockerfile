# Use Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy all server files
COPY . .

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "index.js"]
