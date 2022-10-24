FROM node:19-alpine

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json

WORKDIR /app

RUN npm install --legacy-peer-deps
COPY . .
CMD npm start
