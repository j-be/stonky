FROM node:lts as builder

# Setup the sources
RUN mkdir /app
WORKDIR /app

COPY . .
RUN npm install
RUN npm run build

FROM bitnami/nginx

ENV NGINX_SKIP_SAMPLE_CERTS=true

COPY --from=builder /app/build /app
