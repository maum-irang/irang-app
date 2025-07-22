FROM node:20.10.0-alpine

WORKDIR /app

# Install dependencies only when needed
COPY package.json yarn.lock ./
RUN yarn install

# Copy all files
COPY . .

# Build the Next.js application
RUN yarn build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["yarn", "dev"]