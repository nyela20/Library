# Dockerfile pour le backend
FROM node:20-alpine

WORKDIR /app

# Copie des fichiers package pour installer les dépendances (plus rapide)
COPY package.json package-lock.json ./

# Installer en dev pour le hot-reload
RUN npm install

# Copier le reste
COPY . .

EXPOSE 3000

# script attendu : "start:dev" -> "nest start --watch" ou équivalent
CMD ["npm", "run", "start:dev"]
