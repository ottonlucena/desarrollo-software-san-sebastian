# ── Etapa 1: instalar dependencias ──────────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# ── Etapa 2: compilar TypeScript ─────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN yarn build

# ── Etapa 3: imagen final (solo lo necesario para correr) ────────────────────
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/views ./views
COPY --from=build /app/src/generated ./src/generated
COPY package.json ./

EXPOSE 3000
CMD ["node", "dist/index.cjs"]
