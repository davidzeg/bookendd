FROM node:20-slim AS base

# Install pnpm
RUN npm install -g pnpm

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy root package files for monorepo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy the api package
COPY apps/api ./apps/api

# Copy shared packages if they exist
COPY packages ./packages

# Install dependencies
RUN pnpm install --frozen-lockfile

# Generate Prisma client
RUN pnpm --filter @bookendd/api run db:generate

# Build the API
RUN pnpm --filter @bookendd/api run build

# Expose port
EXPOSE 3001

# Start the server
CMD ["node", "apps/api/dist/main.js"]