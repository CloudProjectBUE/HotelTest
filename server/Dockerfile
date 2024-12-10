# Use an official Node runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source inside the Docker image
COPY . .

# Make port available to the world outside this container
EXPOSE 8080

# Define environment variables
ENV NODE_ENV=production

# Run the app when the container launches
CMD ["node", "server.js"]
