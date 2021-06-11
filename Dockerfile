FROM node:lts

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 3000

CMD [ "npm", "start", "3000" ]
