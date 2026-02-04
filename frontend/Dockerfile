FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Production stage - use http-server
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist

# Install http-server
RUN npm install -g http-server

EXPOSE 4000

# http-server automatically binds to 0.0.0.0
CMD ["http-server", "dist", "-p", "4000", "-a", "0.0.0.0"]