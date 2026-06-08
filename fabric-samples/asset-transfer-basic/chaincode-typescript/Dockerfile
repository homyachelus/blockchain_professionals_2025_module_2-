#
# SPDX-License-Identifier: Apache-2.0
#
FROM node:22 AS builder

WORKDIR /usr/src/app

# Copy node.js source and build, changing owner as well
COPY --chown=node:node package*.json ./
RUN npm install
COPY --chown=node:node . /usr/src/app
ENV npm_config_cache=/usr/src/app
RUN npm run build

FROM node:22 AS production
ARG CC_SERVER_PORT

WORKDIR /usr/src/app
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist
COPY --chown=node:node --from=builder /usr/src/app/package.json ./
COPY --chown=node:node --from=builder /usr/src/app/npm-shrinkwrap.json ./
COPY --chown=node:node docker/docker-entrypoint.sh /usr/src/app/docker-entrypoint.sh

COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules

ENV PORT $CC_SERVER_PORT
EXPOSE $CC_SERVER_PORT
ENV NODE_ENV=production

USER node
ENTRYPOINT [ "/usr/src/app/docker-entrypoint.sh" ]
