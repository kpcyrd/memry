FROM node:latest
RUN useradd -m memry
RUN mkdir /memry /storage
RUN chown memry. /memry /storage
WORKDIR /memry
COPY package.json ./
COPY bin/ ./bin/
COPY memry.js ./
RUN npm install -g
USER memry
ENTRYPOINT ["memry"]
