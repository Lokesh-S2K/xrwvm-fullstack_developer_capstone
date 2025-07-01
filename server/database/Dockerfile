FROM node:18.12.1-bullseye-slim

# Set working directory
WORKDIR /usr/src/app

# Copy only package files first for install caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app code
COPY . .

# Expose API port
EXPOSE 3030

# Start the application
CMD ["node", "app.js"]
