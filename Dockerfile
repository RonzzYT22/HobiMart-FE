# ============================================
# HobiMart Frontend - Dockerfile (Next.js 16)
# Node.js 18 + React 19 + TypeScript
# ============================================

FROM node:18-alpine AS base

# Install dependencies for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc-dev

WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy application source code
COPY . .

# Build the application for production
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy built application from build stage
COPY --from=base /app/.next/standalone ./
COPY --from=base /app/.next/static ./.next/static
COPY --from=base /app/public ./public

# Expose Next.js default port
EXPOSE 3000

# Environment variables for production
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Start Next.js in production mode
CMD ["node", "server.js"]
