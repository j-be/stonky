FROM bitnami/nginx

ENV NGINX_SKIP_SAMPLE_CERTS=true

COPY ./build /app
