# bu-management-front-end/Dockerfile pour le frontend
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3000

# script attendu : "start-watch" -> npm run start (ou un script qui fait hot-reload)
CMD ["npm", "run", "start-watch"]

