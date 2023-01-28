# Setup container and build app 
FROM node:16.15.1-alpine AS tscbuild

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "tsconfig.json", "./"]

COPY . .

RUN ls -a && npm install && npm run build

CMD ["node", "./dist/index.js"]


## Run the app
FROM node:16.15.1-alpine

WORKDIR /app

COPY ["package.json", "./"]

RUN npm install --only=production

COPY --from=tscbuild /app/dist .

RUN npm install pm2 -g

EXPOSE 80

CMD ["pm2-runtime", "./dist/index.js"]
