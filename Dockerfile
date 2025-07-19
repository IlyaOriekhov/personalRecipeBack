FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
