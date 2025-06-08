FROM node:22.0

WORKDIR /backend

COPY package*.json ./

RUN npm ci

COPY . .