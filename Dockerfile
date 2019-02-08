FROM node

WORKDIR usr/src/front

COPY . .
RUN npm install

EXPOSE 8080

CMD [ "npm", "start" ]