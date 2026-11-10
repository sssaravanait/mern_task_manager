# syntax=docker/dockerfile:1

# ---------- Stage 1: Install workspace deps and build the client ----------
# Use a Debian-based image to avoid a known npm issue with Rollup's
# optional native binaries on Alpine (musl).
FROM node:24-alpine AS build

WORKDIR /app

# 1. Copy the root manifests and every workspace manifest.
#    npm needs all workspace package.json files to resolve the lockfile,
#    even when you only build one workspace.
COPY package.json package-lock.json ./
COPY client/package.json ./client/
COPY server/package.json ./server/

# 2. Install dependencies (cached until a manifest or lockfile changes)
RUN npm ci

# 3. Copy the client source
COPY client/ ./client/

# 4. Vite inlines VITE_* values into the bundle at build time
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# 5. Build only the client workspace (output: /app/client/dist)
RUN npm run build -w client


# ---------- Stage 2: Serve the static build with Nginx ----------
FROM nginx:1.27-alpine AS production

# SPA-aware Nginx config (React Router fallback)
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

# Copy only the compiled output
COPY --from=build /app/client/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


# ---------- Dev stage: Vite dev server with hot reload ----------
FROM node:24-alpine AS dev

WORKDIR /app

COPY package.json package-lock.json ./
COPY client/package.json ./client/
COPY server/package.json ./server/

RUN npm ci

EXPOSE 5173

CMD ["npm", "run", "dev", "-w", "client"]