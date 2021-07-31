FROM node:16 AS build

COPY package.json .
RUN npm install

COPY tsconfig*.json .
COPY src/server ./src/server
RUN npm run "server: build: release"

CMD [ "node", "dist/server/index.js" ]