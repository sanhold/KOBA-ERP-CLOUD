# 📜 CHARTE DU PROJET — KOBA ERP CLOUD (PROJECT CHARTER)

> **Projet** : KOBA ERP Cloud  
> **Type** : Plateforme ERP SaaS Cloud Africaine Modulaire Enterprise  
> **Organisation** : KOBA / Sanhold  
> **Version** : 1.0.0  
> **Statut** : Cadrage & Architecture  

---

## 🎯 1. Mission & Vision du Projet

**KOBA ERP Cloud** a pour mission de fournir une plateforme ERP SaaS multi-tenant ultra-performante, sécurisée, modulaire et adaptée aux réalités opérationnelles des entreprises et institutions.

La plateforme repose sur un **Moteur Commun (Core Engine)** unifié alimentant **9 modules métiers verticaux** activables à la demande par les tenants.

---

## 🛠️ 2. Stack Technique Officielle

| Couche Applicative | Technologie / Framework |
| :--- | :--- |
| **Frontend** | Next.js (App Router) + React + TypeScript |
| **Backend** | NestJS (Node.js) + TypeScript |
| **ORM** | Prisma ORM |
| **Base de Données** | PostgreSQL (Isolation Multi-Tenant) |
| **Cache & In-Memory** | Redis |
| **Stockage Fichiers / GED** | MinIO (S3-compatible) |
| **Temps Réel** | WebSockets (NestJS Gateways / Socket.io) |
| **Moteur de Recherche** | OpenSearch |
| **Authentification & Sécurité** | JWT + Refresh Token (MFA, RBAC, ABAC) |
| **Infrastructure & Orchestration** | Docker (Dev/Staging) & Kubernetes (Prod à terme) |

---

## ⚙️ 3. Périphérie & Périmètre du Socle Partagé (Core Engine)

Le premier volet de développement porte sur le **Socle Partagé** composé des 11 services transversaux :
1. 🔑 **Authentification** (JWT, Sessions, Refresh Token)
2. 👤 **Utilisateurs** (Profils & Rattachements)
3. 🏢 **Entreprises** (Entité racine du Tenant)
4. 🌿 **Filiales** (Multi-filiales, Établissements & Devises)
5. 🎭 **Rôles** (Gestion des rôles au niveau Tenant/Filiale)
6. 🔐 **Permissions** (Contrôle d'accès fin RBAC / ABAC)
7. ⚙️ **Paramètres** (Configuration globale & thématisation)
8. 📜 **Audit** (Journalisation d'audit immuable & traçabilité)
9. 🔔 **Notifications** (System multi-canal In-app/WebSocket/Email/SMS)
10. 🔄 **Workflow** (Moteur de processus & circuits d'approbation)
11. 📁 **Gestion Documentaire** (GED / MinIO S3)

---

## 📦 4. Les 9 Modules Métier Verticaux

1. **KOBA BUSINESS** (Gestion Commerciale, Ventes & CRM)
2. **KOBA EDU** (Équipes, Écoles & Universités)
3. **KOBA HEALTH** (Santé, Hôpitaux & Cliniques)
4. **KOBA FINANCE** (Comptabilité, Trésorerie & Budgets)
5. **KOBA RH** (Ressources Humaines & Paie)
6. **KOBA HOTEL** (Hôtellerie & Réservations)
7. **KOBA LOGISTICS** (Achats, Stocks & Supply Chain)
8. **KOBA INDUSTRY** (Production & GPAO)
9. **KOBA ADMIN** (Super-Administration SaaS & Tenant Provisioning)

---

## ⚖️ 5. Principes de Gouvernance & Règles de Développement

Toute contribution au projet doit obligatoirement respecter les règles établies dans [`prompts/00_GLOBAL_RULES.md`](file:///d:/PROGRAMATION/Application%20web/Koba%20projet%20vrai/prompts/00_GLOBAL_RULES.md) :

1. **Respect absolu de la documentation officielle** (`docs/`). Aucune invention ou déviation d'architecture.
2. **Isolation Multi-Tenant Étanche** sur chaque requête BDD, API et cache.
3. **Absence de "Patcher les Symptômes"** : Recherche de la cause racine obligatoire (Root Cause Analysis).
4. **Pas d'API ni de Code produit sans validation préalable du schéma BDD Prisma.**
5. **Tests & Preuves Empiriques** obligatoires avant de déclarer une tâche terminée.

---

## 📅 6. Engagements & Suivi

- Le suivi des modifications est consigné dans [`CHANGELOG.md`](file:///d:/PROGRAMATION/Application%20web/Koba%20projet%20vrai/CHANGELOG.md).
- Les étapes d'exécutions sont suivies dans [`ROADMAP.md`](file:///d:/PROGRAMATION/Application%20web/Koba%20projet%20vrai/ROADMAP.md).
