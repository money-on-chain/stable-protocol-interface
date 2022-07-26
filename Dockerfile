FROM node:14

# Author
MAINTAINER Nicolas Flores

WORKDIR /usr/src/app
COPY package.json ./
COPY .env ./
COPY .env.mocTestnetAlpha ./
COPY .env.mocTestnet ./
COPY .env.mocMainnet2 ./

RUN npm install

CMD  ["npm", "run", "build:moc-alpha-testnet"]