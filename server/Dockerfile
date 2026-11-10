# syntax=docker/dockerfile:1

FROM node:24-alpine as dev

WORKDIR /app

# Copy every workspace manifest so npm can resolve the lockfile
COPY package.json package-lock.json ./
COPY server/package.json ./server/
COPY client/package.json ./client/

RUN npm ci

EXPOSE 5000

# Source is bind-mounted from docker-compose.yml, so no COPY of server/ is needed here
CMD ["npm", "run", "dev", "-w", "server"]