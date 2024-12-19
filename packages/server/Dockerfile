FROM node:20-alpine

WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY turbo.json ./

# Copy server package
COPY packages/server/package*.json ./packages/server/
COPY packages/shared/package*.json ./packages/shared/

# Install dependencies
RUN npm install

# Copy source code
COPY packages/server ./packages/server
COPY packages/shared ./packages/shared

WORKDIR /app/packages/server

# Generate Prisma client
RUN npx prisma generate

EXPOSE 3000

# Run migrations and start the server
CMD sh -c "npx prisma migrate deploy && npm run dev"