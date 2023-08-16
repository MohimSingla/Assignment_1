FROM node:16
EXPOSE 3000
WORKDIR /data

COPY . /data

RUN npm ci
CMD node /data/src/app.js