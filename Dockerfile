# Use official Node.js image for building
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the app and build it
COPY . .
RUN npm run build

# Use a lightweight Node.js runtime for production
FROM node:20-alpine AS runner

WORKDIR /app

# Copy built app and dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY package.json package-lock.json ./

EXPOSE 3000

# Run migrations and start the server
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
