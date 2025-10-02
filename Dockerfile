# Use a smaller Node.js runtime (Alpine-based)
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy only necessary application files (public and src)
COPY src ./src

# Expose the port your app is running on
EXPOSE 5000

# Command to run your app
CMD ["npm", "run", "dev"]
