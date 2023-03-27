FROM node:14

WORKDIR /var/www/

COPY . .

RUN npm install pm2 -g

RUN npm install

CMD ["pm2-runtime", "app.js", "--no-daemon"]