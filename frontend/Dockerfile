## Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm install --silent
COPY . .
RUN npm run build

## Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Optional: add custom nginx config if needed
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
