# 🗺️ ROADMAP - KOBA ERP Cloud

Ce document définit la feuille de route du développement de **KOBA ERP Cloud**.

---

## 📌 Étape 1 : Cadrage Architecture & Directives (EN COURS)
- [x] Initialisation de l'arborescence officielle et des prompts de gouvernance
- [x] Validation de la Stack Technique et de l'Architecture Modulaire / Moteur Commun
- [ ] Réception et validation de l'Architecture globale, Relations inter-modules, Dépendances, Conventions de nommage et Bonnes pratiques

---

## 📌 Étape 2 : Modélisation Base de Données & Schéma Prisma (PROCHAINE ÉTAPE)
- [ ] Spécification des Entités Communes du Moteur (Tenant, User, Role, Permission, Company, Branch, etc.)
- [ ] Définition des Relations entre entités
- [ ] Spécification des Index, Clés uniques et Contraintes d'intégrité
- [ ] Écriture et validation du Schéma Prisma officiel (`schema.prisma`)
- [ ] *(Remarque : Aucune API ne sera générée avant la validation complète du schéma Prisma)*

---

## 📌 Étape 3 : Premier Développement — Socle Partagé (Core Engine)
- [ ] Backend NestJS & Schéma Prisma pour le **Socle Partagé** :
  1. 🔑 **Authentification** (JWT + Refresh Token)
  2. 👤 **Utilisateurs**
  3. 🏢 **Entreprises**
  4. 🌿 **Filiales**
  5. 🎭 **Rôles**
  6. 🔐 **Permissions** (RBAC / ABAC)
  7. ⚙️ **Paramètres**
  8. 📜 **Audit** (Audit Logs & Traçabilité)
  9. 🔔 **Notifications** (WebSocket / Email / SMS)
  10. 🔄 **Workflow** (Circuits d'approbation)
  11. 📁 **Gestion Documentaire** (GED / MinIO S3)

---

## 📌 Étape 4 : Modules Métier Verticaux & Frontend Next.js
- [ ] Découplage et implémentation progressive des 9 modules verticaux basés sur le Socle Partagé.



---

## 📌 Phase 3 : Interface Utilisateur (Frontend SaaS)
- [ ] Design System & Composants UI (Theme SaaS Enterprise)
- [ ] Dashboard d'Administration SaaS (Super Admin & Tenant Admin)
- [ ] Navigation dynamique et gestion des modules activables par Tenant

---

## 📌 Phase 4 : Modules ERP Metier
- [ ] Module Gestion Commerciale & Ventes
- [ ] Module Achats & Stocks
- [ ] Module Comptabilité & Finance
- [ ] Module Ressources Humaines (RH) / Paie
- [ ] Module CRM / Clientèle

---

## 📌 Phase 5 : Industrialisation, Tests & Déploiement Cloud
- [ ] Suite complète de tests automatisés (Backend & Frontend)
- [ ] Pipelines CI/CD & Déploiement Cloud
- [ ] Monitoring, Alerting et Haute Disponibilité
