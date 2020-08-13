FROM nginx

RUN mkdir /usr/share/nginx/www
RUN rm -rf /etc/nginx/nginx.conf

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./app /usr/share/nginx/www

EXPOSE 3000