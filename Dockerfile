FROM node:18 as base

# install dependencies
FROM base as deps

WORKDIR /app

# RUN chown -R node /app

# COPY --chown=node package.json yarn.lock ./

# RUN yarn --frozen-lockfile;

# COPY --chown=node . .

# RUN yarn build

# USER node

COPY package.json yarn.lock ./

RUN yarn --frozen-lockfile;

COPY . .

RUN yarn build

CMD [ "yarn", "start:dev" ]
