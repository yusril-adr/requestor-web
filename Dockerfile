FROM node:24-alpine AS build

ARG VITE_REQUESTOR_API_BASE_URL
ENV VITE_REQUESTOR_API_BASE_URL=${VITE_REQUESTOR_API_BASE_URL}

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build
