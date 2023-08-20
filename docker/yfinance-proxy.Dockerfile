FROM nginx
COPY ./yfinance-proxy.conf /etc/nginx/conf.d/yfinance-proxy.conf
