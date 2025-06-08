FROM node:22.0

WORKDIR /frontend

COPY package*.json ./

RUN npm ci

COPY . .