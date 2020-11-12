FROM nginx

RUN mkdir /usr/share/nginx/www
RUN mkdir /etc/nginx/ssl
RUN rm -rf /etc/nginx/nginx.conf

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./ssl /etc/nginx/ssl
COPY ./app /usr/share/nginx/www

EXPOSE 3000
EXPOSE 843