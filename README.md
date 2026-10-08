# 🐞 VulnTrack

Application de gestion de vulnérabilités pour équipes sécurité : recensement, suivi du traitement, tableau de bord et journal d'audit.

![Node.js](https://img.shields.io/badge/Node.js-18-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

> Statut : prototype. Code de base généré (backend, frontend, Docker).

## Fonctionnalités

- **Vulnérabilités** : création, consultation, modification et suppression, avec sévérité (`LOW` → `CRITICAL`), statut (`OPEN`, `IN_PROGRESS`, `RESOLVED`, `WONTFIX`) et source (interne, pentest, scanner, manuel)
- **Authentification JWT** avec refresh token, déconnexion et mots de passe hachés (bcrypt)
- **Rôles** : `ADMIN`, `ANALYST`, `VIEWER`, contrôlés par un middleware RBAC
- **Journal d'audit** des actions réalisées
- **Tableau de bord** avec graphiques, liste filtrable (MUI Data Grid) et fiche détaillée
- **Sécurité de l'API** : Helmet, limitation de débit, validation des entrées avec Zod, logs Winston

## Stack technique

| Couche | Technologies |
|---|---|
| Backend | Node.js, Express, TypeScript, Prisma, Zod, JWT |
| Frontend | React, TypeScript, Material UI, React Query, Axios |
| Base de données | PostgreSQL 15 (SQLite pour les tests) |
| Tests | Jest (unitaires et intégration), Testing Library |
| Outillage | Docker Compose, GitHub Actions, ESLint, Prettier |

## Architecture

```
backend/src/
├── middleware/        # auth JWT, RBAC, gestion d'erreurs
├── modules/
│   ├── auth/          # login, refresh, logout
│   ├── users/         # gestion des utilisateurs
│   ├── vulnerabilities/
│   └── audit-log/
│       └── *.routes → *.controller → *.service → *.repository
└── tests/             # unit/ et integration/
frontend/src/
├── pages/             # Dashboard, VulnerabilityList, VulnerabilityDetails, AuditLog, Login
├── components/        # DataTable, ChartCard, VulnerabilityForm…
└── hooks/, services/  # accès API (React Query + Axios)
```

## API

Base : `http://localhost:4000/api/v1`

| Ressource | Endpoints |
|---|---|
| `/auth` | `POST /login`, `POST /refresh`, `POST /logout` |
| `/users` | `GET /`, `POST /` |
| `/vulnerabilities` | `GET /`, `GET /:id`, `POST /`, `PATCH /:id`, `DELETE /:id` |
| `/audit-logs` | `GET /` (rôles `ADMIN` et `ANALYST`) |

## Démarrage rapide

Prérequis : Node.js et npm.

```bash
npm install
npm run start:demo
```

Le script lance le backend (port `4000`) et le frontend (port `5173`), puis ouvre `http://localhost:5173`.

### Avec Docker

```bash
cp .env.example .env
docker-compose up --build
```

Compte administrateur de démo : `npm run seed` dans `backend/` (ou via docker-compose, voir `.env`).

## Tests

```bash
cd backend
npm ci
npm run test:ci   # base SQLite temporaire, schéma Prisma poussé, puis Jest
```

Sur Windows, `test:ci` utilise `cross-env` pour définir `DATABASE_URL=file:./dev-test.db` avant `prisma db push` et `jest`.
