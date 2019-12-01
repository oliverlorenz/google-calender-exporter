FROM node:lts-alpine
WORKDIR /workspace
ADD . .
RUN npm install
RUN ls -la
