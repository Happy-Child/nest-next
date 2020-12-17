FROM node:12-alpine
WORKDIR /app

ENV NODE_ENV="development"

COPY yarn.lock package.json ./
RUN yarn --frozen-lockfile
RUN yarn global add @nestjs/cli@latest
COPY . .
CMD ["yarn", "start:dev"]