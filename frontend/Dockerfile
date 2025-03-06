FROM node:20.18-alpine as builder

WORKDIR /app
COPY . .

RUN yarn

ENV BASE_URL=admin:8000

RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]