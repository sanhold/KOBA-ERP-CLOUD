# ⚙️ KOBA ERP Cloud — Service Backend (NestJS Engine)

Ce dossier contient l'application backend NestJS officielle qui propulse le Moteur Central **KOBA CORE** et les API de la plateforme KOBA ERP Cloud.

---

## 🏛️ Architecture du Dossier `src/`

```text
src/
├── auth/           # Authentification (JWT, Refresh Token, Passport, MFA)
├── users/          # Gestion des Utilisateurs & Profils
├── roles/          # Gestion des Rôles (RBAC)
├── permissions/    # Catalogue des Permissions
├── tenants/        # Gestion des Tenants SaaS
├── organizations/  # Gestion des Organisations & Holdings
├── companies/      # Gestion des Entreprises & Sociétés juridiques
├── branches/       # Gestion des Filiales & Établissements
├── departments/    # Gestion des Départements
├── notifications/  # Moteur de Notifications (WebSocket, Email, SMS)
├── documents/      # GED & Intégration MinIO S3
├── workflows/      # Moteur de Processus & Approbations
├── audit/          # Registre Légale d'Audit & Activity Logs
├── core/           # Services partagés et briques du noyau KOBA
├── common/         # Middlewares, Intercepteurs, Filtres d'erreurs (RFC 7807) & Décorateurs
├── config/         # Configuration dynamique centralisée
├── database/       # Service Prisma Client instancié
├── shared/         # Utilitaires et fonctions partagées
└── modules/        # Ancrages pour les 9 modules métiers verticaux (Vides au départ)
```

---

## 🛠️ Stack & Outils
- **NestJS** + **TypeScript** (Mode strict)
- **Prisma ORM** + **PostgreSQL**
- **Redis** (Cache & Sessions)
- **Swagger / OpenAPI** sur `/api/docs`
- **Validation DTOs** (`class-validator` / `class-transformer`)
- **Pipes, Interceptors & Filters** normés RFC 7807

---

## 🚀 Démarrage Rapide

```bash
# Installation des dépendances
npm install

# Lancement en mode développement avec Hot-Reload
npm run start:dev
```
