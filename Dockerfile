FROM node:20 as builder

WORKDIR /usr/src/app

COPY package*.json .npmrc ./

RUN npm ci

COPY . .

RUN rm -f .npmrc

RUN npm run build

FROM node:20-slim

ENV NODE_ENV production
USER node

WORKDIR /usr/src/app

COPY package*.json .npmrc ./

RUN npm ci --production

RUN rm -f .npmrc

COPY --from=builder /usr/src/app/dist ./dist

CMD [ "npm", "start" ]