FROM node:24-alpine

WORKDIR /app

# Copy manifests first so the dependency layer is cached between code changes
COPY package.json package-lock.json ./
COPY server/package.json ./server/

RUN npm ci

COPY server ./server

EXPOSE 5000

CMD ["npm", "run", "dev", "-w", "server"]