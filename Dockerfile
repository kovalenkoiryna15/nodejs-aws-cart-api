# syntax=docker/dockerfile:1

# Stage 1
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copy "package.json" and "package.lock.json" files and install dependencies.
COPY package*.json .
RUN npm install

# Copy the rest of the source files into the image.
COPY . .

# Build the application.
RUN npm run build

# Stage 2
FROM node:18-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist .

# Run the application as a non-root user.
USER node

EXPOSE 4000

CMD [ "node", "main.js" ]
