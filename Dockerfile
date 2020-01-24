FROM node:12-alpine

LABEL maintainer="Gary Kim <gary@garykim.dev>"
RUN apk add --no-cache ca-certificates git bash

ADD . /app
WORKDIR /app

ENTRYPOINT ["/app/docker-entrypoint.sh"]
