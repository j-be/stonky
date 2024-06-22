FROM bitnami/nginx

ENV NGINX_SKIP_SAMPLE_CERTS=true

COPY ./build /app
COPY ./docker/stonky.conf /opt/bitnami/nginx/conf.default/bitnami
