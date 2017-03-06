FROM node:7-alpine
COPY ./ /memry/
WORKDIR /memry/
RUN apk add --no-cache su-exec tini \
    && adduser -S memry \
    && apk add --no-cache --virtual .build-deps-memry python make g++ \
    && npm install -g \
    && apk del .build-deps-memry
ENV MEMRY_HOST 0.0.0.0
ENV MEMRY_STORAGE /storage
VOLUME /storage
ENTRYPOINT ["/sbin/tini", "-g", "--", "bin/container-memry"]
