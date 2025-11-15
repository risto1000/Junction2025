# Multi-stage Dockerfile for full-stack app
# Stage 1: Build frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./
RUN npm install

# Copy frontend source and build
COPY frontend/ ./
RUN npm run build

# Stage 2: Build backend
FROM node:20-slim AS backend-builder
WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./
COPY backend/tsconfig.json ./
RUN npm ci

# Copy backend source and build
COPY backend/ ./
RUN npm run build

# Stage 3: Production
FROM node:20-slim AS production
WORKDIR /app

# Copy backend production dependencies
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy built backend
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/package*.json ./backend/

# Copy built frontend to app root (so server can serve it from ../frontend/build)
COPY --from=frontend-builder /app/frontend/build ./frontend/build

# Expose port
EXPOSE 8080

# Set working directory to backend for npm start
WORKDIR /app/backend

# Start server
CMD ["npm", "start"]

