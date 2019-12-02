FROM node:lts-alpine
WORKDIR /app
ADD . .
RUN npm install
ENTRYPOINT [ "npm" ]
CMD npm start
