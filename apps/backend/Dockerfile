# --- Stage 1: Prune Workspace ---
FROM node:22-alpine AS pruner
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Enable Corepack to use your repository's native pnpm version
RUN corepack enable && corepack prepare pnpm@9.1.0 --activate

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
RUN corepack enable && corepack prepare pnpm@9.1.0 --activate

# Copy pruned lockfiles and package manifests to cache installation layers
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the actual pruned source files and configurations
COPY --from=pruner /app/out/full/ .
COPY turbo.json turbo.json

COPY apps/backend/src/views ./apps/backend/src/views

# Build the NestJS app (and any dependent local packages automatically)
ENV APP_NAME="backend"
RUN pnpm turbo run build --filter=$APP_NAME...

# --- Stage 3: Production Runtime Environment ---
FROM node:22-alpine AS runner
WORKDIR /app

# Create a secure, non-root system user for safety
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Install the repository's pinned pnpm version
RUN corepack disable && npm install --global pnpm@9.1.0

ENV NODE_ENV=production
ENV APP_NAME="backend"
ENV APP_PATH="apps/backend"

# Copy package manifests and install production-only dependencies
COPY --from=pruner --chown=nestjs:nodejs /app/out/json/ .
COPY --from=pruner --chown=nestjs:nodejs /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --prod --frozen-lockfile

# Copy compiled JavaScript code from the builder stage matching your subfolder path
COPY --from=builder --chown=nestjs:nodejs /app/${APP_PATH}/dist ./${APP_PATH}/dist

# Copy Drizzle migrations and runtime config into the image
COPY --from=builder --chown=nestjs:nodejs /app/${APP_PATH}/drizzle ./${APP_PATH}/drizzle
COPY --from=builder --chown=nestjs:nodejs /app/${APP_PATH}/drizzle.config.ts ./${APP_PATH}/drizzle.config.ts

# Drizzle Kit is a runtime dependency so migrations run before startup
COPY --from=builder --chown=nestjs:nodejs /app/${APP_PATH}/src/db/schema.ts ./${APP_PATH}/src/db/schema.ts

# Crucial Fix: Ensure the nestjs user owns the directory to run binaries and workspace scripts
RUN chown -R nestjs:nodejs /app

USER nestjs

# Expose your NestJS server port
EXPOSE 3000

# Execute runtime Drizzle migrations before launching NestJS
CMD cd apps/backend && npx drizzle-kit migrate && node dist/src/main.js