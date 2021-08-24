# Builder
FROM node:14.16.0-alpine

RUN apk add git

# Set working directory
WORKDIR /usr/src/backend

# Copy all files
COPY ./ ./

# Install dependencies
RUN yarn install

EXPOSE 3333

CMD yarn dev
