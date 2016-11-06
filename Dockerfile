FROM node:latest
RUN useradd -m memry
RUN mkdir /memry /storage
RUN chown memry. /memry /storage
WORKDIR /memry
COPY package.json ./
COPY bin/ ./bin/
COPY src/ ./src/
RUN npm install -g
USER memry
ENV MEMRY_HOST 0.0.0.0
ENV MEMRY_STORAGE /storage
ENTRYPOINT ["memry"]
