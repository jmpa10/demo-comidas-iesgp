# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Prisma necesita DATABASE_URL (aunque no conecte) para `prisma generate`.
# Se sobrescribe en runtime vía docker-compose (env_file).
ENV DATABASE_URL=postgresql://user:pass@localhost:5432/db?schema=public

# Prisma engine y utilidades para esperar a Postgres
RUN apk add --no-cache openssl libc6-compat postgresql-client

FROM base AS deps
COPY package.json package-lock.json* ./
# Necesario para que `prisma generate` (postinstall) encuentre el schema.
COPY prisma ./prisma
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production

# Copiamos runtime + build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/prisma ./prisma

# Entrypoint (migraciones + arranque)
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]
CMD ["npm", "run", "start"]
