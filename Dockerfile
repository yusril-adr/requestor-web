# Stage 1: Build
FROM node:24-alpine AS build

ARG VITE_MAIN_API_BASE_URL
ENV VITE_MAIN_API_BASE_URL=${VITE_MAIN_API_BASE_URL}

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

COPY --from=build /app/build/client /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
