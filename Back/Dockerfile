# Start your image with a node base image
FROM node:22-alpine

# The /app directory should act as the main application directory
WORKDIR /app

# Copy the app package and package-lock.json file
COPY package*.json ./
RUN npm install

# Copy local directories to the current local directory of our docker image (/app)
COPY . .

EXPOSE 5000

# Start the app using serve command
CMD [ "npm", "start" ]