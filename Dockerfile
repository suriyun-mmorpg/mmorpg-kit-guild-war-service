FROM node:18-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./
COPY src ./src
COPY prisma ./prisma
COPY tsconfig.json ./tsconfig.json

USER root

RUN npm install --force
RUN npx prisma generate --schema "./prisma/guildWarSchema.prisma"
RUN npm run build
RUN rm -rf ./src

EXPOSE 80

CMD ["npm","run","start"]
