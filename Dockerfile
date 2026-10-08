FROM node:14

# Author
MAINTAINER Nicolas Flores & Martin Mulone

WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack pnpm install --frozen-lockfile

# copy environments targets
COPY .env ./
COPY .env.mocTestnetAlpha ./
COPY .env.mocTestnet ./
COPY .env.mocMainnet2 ./

# build script target
COPY build_target.sh ./
COPY prepare_target.sh ./

CMD /bin/bash -c 'bash ./build_target.sh'
