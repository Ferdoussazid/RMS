FROM node:16-alpine

ENV APP_ROOT /src

RUN mkdir ${APP_ROOT}
WORKDIR ${APP_ROOT}
ADD package*.json ${APP_ROOT}

RUN apk update
RUN apk add git

RUN npm install
RUN npm uninstall webpack
RUN npm install webpack@^4.0.0 --save-dev

ADD . ${APP_ROOT}
RUN npm run build

ENV HOST 0.0.0.0
