FROM node:lts-alpine
WORKDIR /app
ADD . .
RUN npm install
CMD npm start
