FROM node:14

# Author
MAINTAINER Nicolas Flores & Martin Mulone

WORKDIR /usr/src/app
COPY package.json ./
RUN npm install

# copy environments targets
COPY .env ./
COPY .env.mocTestnetAlpha ./
COPY .env.mocTestnet ./
COPY .env.mocMainnet2 ./

# build script target
COPY build_target.sh ./

CMD /bin/bash -c 'bash ./build_target.sh'
