# --- Stage 1: Prune Workspace ---
FROM node:22-alpine AS pruner
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Enable Corepack to use your repository's native pnpm version
RUN corepack enable && corepack prepare pnpm@latest --activate

# Fix for pnpm 12 global binary path restriction
RUN pnpm config set global-bin-dir /usr/local/bin && pnpm add -g turbo

ENV APP_NAME="backend"

COPY . .
# Isolates only the backend app and its direct shared workspace packages into /app/out
RUN turbo prune --scope=$APP_NAME --docker

# --- Stage 2: Install and Build Workspace ---
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Enable Corepack for pnpm installation
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy pruned lockfiles and package manifests to cache installation layers
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the actual pruned source files and configurations
COPY --from=pruner /app/out/full/ .
COPY turbo.json turbo.json

# Build the NestJS app (and any dependent local packages automatically)
ENV APP_NAME="backend"
RUN pnpm turbo run build --filter=$APP_NAME...

# --- Stage 3: Production Runtime Environment ---
FROM node:22-alpine AS runner
WORKDIR /app

# Create a secure, non-root system user for safety
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# CRITICAL: Run corepack setup as ROOT before dropping down to the nestjs user
RUN corepack enable && corepack prepare pnpm@latest --activate

ENV NODE_ENV=production
ENV APP_NAME="backend"
ENV APP_PATH="apps/backend"

# Copy package manifests and install production-only dependencies
COPY --from=pruner --chown=nestjs:nodejs /app/out/json/ .
COPY --from=pruner --chown=nestjs:nodejs /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --prod --frozen-lockfile

USER nestjs

# Copy compiled JavaScript code from the builder stage matching your subfolder path
COPY --from=builder --chown=nestjs:nodejs /app/${APP_PATH}/dist ./${APP_PATH}/dist

# Copy your generated Drizzle SQL migration files and config into the runtime image
COPY --from=builder --chown=nestjs:nodejs /app/${APP_PATH}/drizzle ./${APP_PATH}/drizzle
COPY --from=builder --chown=nestjs:nodejs /app/${APP_PATH}/drizzle.config.ts ./${APP_PATH}/drizzle.config.ts

# Expose your NestJS server port (used for both HTTP APIs and Socket.io)
EXPOSE 3000

CMD ["node", "apps/backend/dist/main.js"]
