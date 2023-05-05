# That is why we tell node here to use the current node image as base.
FROM node:lts-alpine

# Create an application directory
RUN mkdir -p /app

# The /app directory should act as the main application directory
WORKDIR /app

# Copy or project directory (locally) in the current directory of our docker image (/app)
COPY frontend/ .

# Copy the app package and package-lock.json file
COPY frontend/package*.json ./

# Install node packages
RUN npm install

# Build the app
RUN npm run build

# Expose $PORT on container.
# We use a varibale here as the port is something that can differ on the environment.
EXPOSE 80

# Start the app
CMD [ "npm","run","start" ]