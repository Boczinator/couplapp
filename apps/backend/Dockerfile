# --- Stage 1: Prune Workspace ---
FROM node:22-alpine AS pruner
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Enable Corepack for pnpm
RUN corepack enable && corepack prepare pnpm@9.1.0 --activate
RUN pnpm config set global-bin-dir /usr/local/bin && pnpm add -g turbo

ENV APP_NAME="backend"

COPY . .
# Isolates only the backend app and its direct shared workspace packages into /app/out
RUN turbo prune --scope=$APP_NAME --docker

# --- Stage 2: Install and Build Workspace ---
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.1.0 --activate

# Copy pruned manifests, lockfile, AND pnpm workspace configuration
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml

RUN pnpm install --frozen-lockfile

# Copy source files and configs
COPY --from=pruner /app/out/full/ .
COPY turbo.json turbo.json

# Build the NestJS app (and dependent local packages)
ENV APP_NAME="backend"
RUN pnpm turbo run build --filter=$APP_NAME...

# --- Stage 3: Production Runtime Environment ---
FROM node:22-alpine AS runner
WORKDIR /app

# Create unprivileged system user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

RUN corepack enable && corepack prepare pnpm@9.1.0 --activate

ENV NODE_ENV=production
ENV APP_PATH="apps/backend"

# Copy package manifests and workspace definition for prod dependency installation
COPY --from=pruner --chown=nestjs:nodejs /app/out/json/ .
COPY --from=pruner --chown=nestjs:nodejs /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner --chown=nestjs:nodejs /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Install production-only dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy compiled JavaScript output from builder
COPY --from=builder --chown=nestjs:nodejs /app/${APP_PATH}/dist ./${APP_PATH}/dist

# Copy Drizzle migrations folder directly from pruner stage
COPY --from=pruner --chown=nestjs:nodejs /app/out/full/${APP_PATH}/drizzle ./${APP_PATH}/drizzle

USER nestjs

EXPOSE 3000

# Execute compiled NestJS application
# Adjust "main.js" path if your tsconfig outputs to dist/src/main.js
CMD ["node", "apps/backend/dist/main.js"]