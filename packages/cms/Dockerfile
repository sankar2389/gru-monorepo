FROM node:11.1.0-alpine

WORKDIR /usr/src/api
COPY package.json package-lock.json* ./
RUN npm install

COPY . /usr/src/api

EXPOSE 1337

ENV NODE_ENV=production

CMD [ "npm", "start"]
