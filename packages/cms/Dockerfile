FROM node:11.1.0-alpine

WORKDIR /usr/src/api
COPY package.json package-lock.json* ./
RUN yarn cache clean --force && yarn

COPY . /usr/src/api

EXPOSE 1337

CMD [ "yarn", "start" ]