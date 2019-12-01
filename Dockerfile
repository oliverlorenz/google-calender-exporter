FROM node:lts-alpine
WORKDIR /workspace
ADD . .
RUN npm install
CMD npm start
