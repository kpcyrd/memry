FROM node:6-alpine
RUN adduser -h /memry -S memry \
    && mkdir /storage \
    && chown memry. /storage
WORKDIR /memry
COPY ./ ./
RUN apk add --no-cache --virtual .build-deps-memry python make g++ \
    && npm install -g \
    && apk del .build-deps-memry
USER memry
ENV MEMRY_HOST 0.0.0.0
ENV MEMRY_STORAGE /storage
ENTRYPOINT ["memry"]
