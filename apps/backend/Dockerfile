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

# 🟢 FIX A: Copy your drizzle schemas into the builder stage so turbo compiles its metadata assets
COPY apps/backend/drizzle ./apps/backend/drizzle
COPY apps/backend/src/views ./apps/backend/src/views

# Build the NestJS app
ENV APP_NAME="backend"
RUN pnpm turbo run build --filter=$APP_NAME...


# --- Stage 3: Production Runtime Environment ---
FROM node:22-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

RUN corepack disable && npm install --global pnpm@9.1.0

ENV NODE_ENV=production
ENV APP_NAME="backend"
ENV APP_PATH="apps/backend"

COPY --from=pruner --chown=nestjs:nodejs /app/out/json/ .
COPY --from=pruner --chown=nestjs:nodejs /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --prod --frozen-lockfile

RUN pnpm add -F backend drizzle-kit

COPY --from=builder --chown=nestjs:nodejs /app/${APP_PATH}/dist ./${APP_PATH}/dist
COPY --from=builder --chown=nestjs:nodejs /app/${APP_PATH}/drizzle ./${APP_PATH}/drizzle
COPY --from=builder --chown=nestjs:nodejs /app/${APP_PATH}/drizzle.config.ts ./${APP_PATH}/drizzle.config.ts
COPY --from=builder --chown=nestjs:nodejs /app/${APP_PATH}/src/db/schema.ts ./${APP_PATH}/src/db/schema.ts

RUN chown -R nestjs:nodejs /app

USER nestjs
EXPOSE 3000

# 🟢 FIX B: Switch back to utilizing npx drizzle-kit migrate directly
CMD cd apps/backend && npx drizzle-kit migrate && node dist/src/main.js
