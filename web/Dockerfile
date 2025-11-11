# Use official Node.js image for building
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files and install dependencies using pnpm
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile

# Generate Prisma client
RUN pnpm prisma generate

# Copy the rest of the app and build it
COPY . .
RUN pnpm run build

# Use a lightweight Node.js runtime for production
FROM node:20-alpine AS runner

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy built app and dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY package.json pnpm-lock.yaml ./

EXPOSE 3000

# Run migrations and start the server
CMD ["sh", "-c", "pnpm prisma migrate deploy && pnpm start"]
