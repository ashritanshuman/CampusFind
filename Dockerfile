FROM node:20-alpine

WORKDIR /app

# Copy backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev

# Copy entire application (frontend, backend, database)
COPY . .

# Set working directory to backend
WORKDIR /app/backend

# Create uploads directory if not present
RUN mkdir -p uploads

EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000

CMD ["node", "server.js"]
