# 📚 Library Management System


**Library Management System** est une application web complète pour gérer une bibliothèque, incluant le backend en **NestJS**, le frontend en **React**, et une base de données **MongoDB**. Le projet est conçu pour être facilement déployé via **Docker**, tout en respectant les bonnes pratiques de développement et d’architecture logicielle. Il intègre également un module de **Machine Learning** capable de prédire les livres les plus populaires à venir.


[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)  
[![NestJS](https://img.shields.io/badge/NestJS-v10-red)](https://nestjs.com/)  
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)  
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green)](https://www.mongodb.com/)  
[![FastAPI](https://img.shields.io/badge/FastAPI-latest-lightblue)](https://fastapi.tiangolo.com/)  
[![Supabase](https://img.shields.io/badge/Supabase-latest-magenta)](https://supabase.com/)  
[![Docker](https://img.shields.io/badge/Docker-latest-blue)](https://www.docker.com/)

---

## 🏗️ Architecture du projet
```
Library/
│
├── bu-management-frontend/       # Frontend React
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── package.json
│   └── README.md
├── src/                          # Backend NestJS source
│   ├── Dockerfile
├── test/                         # Tests unitaires et e2e
├── Documentation/                # Diagrammes UML, backlog, rétrospéctive
├── ML_ApiFast/                   # Module Machine Learning FastAPI + Supabase
│   ├── app/
│   ├── requirements.txt
│   └── Dockerfile
├── Dockerfile                     # Backend Dockerfile principal
├── package.json
├── docker-compose.yml
└── README.md
```
---

## ⚙️ Technologies utilisées


---

## ⚙️ Technologies utilisées

| Technologie            | Usage                      | Pourquoi                                                  |
|------------------------|----------------------------|-----------------------------------------------------------|
| **Node.js / NestJS**   | Backend principal          | API modulaire, typage fort avec TypeScript                |
| **React.js**           | Frontend utilisateur       | Interface dynamique, composants réutilisables             |
| **FastAPI**            | Service ML REST            | Rapide, simple et optimal pour exposer modèles ML         |
| **Supabase**           | Authentification / stockage| Backend "as‑a‑service", simplifie gestion utilisateurs    |
| **MongoDB**            | Base de données            | NoSQL souple pour livres, utilisateurs, prêts             |
| **Docker / Docker Compose** | Conteneurisation     | Déploiement homogène sur toutes les machines              |
| **TypeScript**         | Backend & Frontend         | Réduction des bugs, meilleure maintenabilité              |


---

## 🛠️ Installation et lancement

### 1️⃣ Cloner le projet

```bash
git clone https://github.com/nyela20/Library.git
cd Library
```
---

### 3️⃣ Lancer avec Docker Compose

```bash
docker-compose up --build
```

* **Backend** : [http://localhost:3000](http://localhost:3000)
* **Frontend** : [http://localhost:3001](http://localhost:3001)

> L’IP interne Docker (ex: 172.18.x.x) n’est pas accessible depuis le navigateur Windows. Utilisez `localhost` ou l’IP réseau de votre machine.

---

### 4️⃣ Installation manuelle (optionnel)

```bash
# Backend
cd Library
npm install
npm run start:dev

# Frontend
cd bu-management-frontend
npm install
npm run start:dev
```

---

## 📊 Gestion de projet

### Backlog

* Les fonctionnalités `utilisateurs` :

```
- Se connecter 
- Emprunter ou reserver un livre
- Parcourir le catalogue des livres
```

* Les fonctionnalités `personnels` :

```
- Se connecter 
- Ajouter un livre
- Supprimer un livre
- Modifier les informations d'un livre
- Gérer les prêts et retours
- Gérer les utilisateurs 
- Parcourir le catalogue des livres
- Obtenir la prédiction des livres sur l'année
```


## ✅ Résumé

Ce projet **Library Management System** est prêt pour le développement et le déploiement.
Il inclut :

* Backend NestJS et Frontend React
* Docker et MongoDB
* Diagrammes UML 
* Backlog et planification des sprints
