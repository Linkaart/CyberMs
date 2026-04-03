# VulnTrack — Preview

Démarrage rapide d'une instance locale pour la démo.

Pré-requis : `node` et `npm` installés.

Commande unique pour lancer backend + frontend et ouvrir la page :

```bash
npm install
npm run start:demo
```

Le script `start:demo` démarre les serveurs de développement :
- Backend : `backend` (`npm run dev`) sur le port `4000`
- Frontend : `frontend` (`npm run dev`) sur le port `5173`

Si le navigateur ne s'ouvre pas automatiquement, ouvrez manuellement : `http://localhost:5173`.
# VulnTrack — gestion de vulnérabilités

Prototype minimal pour équipes sécurité. Contenu généré : backend (Node/TypeScript/Prisma), frontend (React/TS), Docker.

<!-- CI badge -->
[![CI](https://github.com/<OWNER>/<REPO>/actions/workflows/ci.yml/badge.svg)](https://github.com/<OWNER>/<REPO>/actions/workflows/ci.yml)


Démarrage local (Docker) :

```bash
cp .env.example .env
docker-compose up --build
```

Backend:
- API: http://localhost:4000/api/v1
- seed admin: `npm run seed` (ou via docker-compose, voir .env)

Tests (SQLite in-memory / file for CI):

```bash
# installez deps
cd backend
npm ci

# crée un fichier sqlite temporaire, pousse le schéma Prisma puis lance les tests
npm run test:ci
```

Sur Windows `test:ci` utilise `cross-env` pour définir `DATABASE_URL=file:./dev-test.db` puis exécute `prisma db push` avant `jest`.
