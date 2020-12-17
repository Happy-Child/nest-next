FROM node:12-alpine
WORKDIR /app

ENV NODE_ENV="development"

COPY yarn.lock package.json ./
RUN yarn --frozen-lockfile
COPY . .

CMD ["yarn", "build"]
