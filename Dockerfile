FROM node

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 4000:3000

CMD ["node", "server.js"]