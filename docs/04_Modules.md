# 04 - Spécifications de la Plateforme Modulaire & Moteur Commun

## 📌 Vision Architecture Modulaire
**KOBA ERP Cloud** est conçu comme une plateforme ERP SaaS hautement modulaire. Elle repose sur un **Moteur Commun (Core Engine)** unifié sur lequel se greffent des modules verticaux spécialisés selon le secteur d'activité du Tenant.

```text
+-----------------------------------------------------------------------------------+
|                                 MODULES METIER                                    |
| +-----------+ +----------+ +-----------+ +-----------+ +---------+ +------------+ |
| | BUSINESS  | |   EDU    | |  HEALTH   | |  FINANCE  | |   RH    | |   HOTEL    | |
| +-----------+ +----------+ +-----------+ +-----------+ +---------+ +------------+ |
| | LOGISTICS | | INDUSTRY | |   ADMIN   |                                          |
| +-----------+ +----------+ +-----------+                                          |
+-----------------------------------------------------------------------------------+
|                                MOTEUR COMMUN (CORE)                               |
| Auth | Users | Roles | Perms | Companies | Subs | Notifs | Docs | Workflow | Audit  |
| Dashboards | API Gateway | AI Copilot | Backups | Settings                        |
+-----------------------------------------------------------------------------------+
```

---

## ⚙️ 1. Moteur Commun (Core Engine) — Socle Partagé (Premier Développement)

Le **Socle Partagé** regroupe les 11 services de base indispensables que tous les modules métiers utiliseront obligatoirement :

1. **Authentification** : Gestion des accès, sessions, JWT, Refresh Token, MFA.
2. **Utilisateurs** : Profils utilisateurs, statut des comptes, rattachements.
3. **Entreprises** : Entité organisationnelle racine du Tenant.
4. **Filiales** : Support multi-filiales, établissements, devises et localisation.
5. **Rôles** : Modèle de rôles dynamiques au niveau Tenant et filiale.
6. **Permissions** : Matrice de contrôle d'accès fin (RBAC / ABAC) par ressource et action.
7. **Paramètres** : Configuration globale de la plateforme, thématisation et règles d'entreprise.
8. **Audit** : Journalisation immuable de toutes les actions, accès et mutations (Traçabilité & Compliance).
9. **Notifications** : Système de notifications multi-canal (In-App WebSocket, Email, SMS).
10. **Workflow** : Moteur de processus métier et circuits d'approbation réutilisables.
11. **Gestion Documentaire (GED)** : Stockage sécurisé de fichiers (MinIO S3), métadonnées, versionnage et liaisons aux entités.

---

## 📦 2. Catalogue des Modules Verticaux


Les modules métier sont activables à la demande selon l'abonnement et la configuration du Tenant :

### 1. 💼 KOBA BUSINESS
- Gestion commerciale complète (Devis, Commandes, Facturation, Clients, Ventes).
- Suivi de la relation client (CRM) et pipeline des opportunités.

### 2. 🎓 KOBA EDU
- Gestion des établissements scolaires et universitaires.
- Suivi des étudiants, inscriptions, emplois du temps, notes, bulletins et scolarité.

### 3. 🏥 KOBA HEALTH
- Gestion des structures de santé (Hôpitaux, Cliniques, Cabinets).
- Dossiers patients, rendez-vous, consultations, prescriptions et gestion des lits/soins.

### 4. 💰 KOBA FINANCE
- Comptabilité générale, analytique et auxiliaire.
- Trésorerie, rapprochement bancaire, budgets et rapports financiers.

### 5. 👥 KOBA RH
- Gestion des Ressources Humaines.
- Paie, gestion des congés, recrutements, évaluations et compétences.

### 6. 🏨 KOBA HOTEL
- Gestion hôtelière et hébergement.
- Réservations, Check-in / Check-out, gestion des chambres, Room Service et facturation.

### 7. 🚛 KOBA LOGISTICS
- Gestion de la chaîne d'approvisionnement (Supply Chain).
- Stocks multi-entrepôts, suivi des flux, livraisons, achats et fournisseurs.

### 8. 🏭 KOBA INDUSTRY
- Gestion de la production industrielle (GPAO).
- Ordres de fabrication (OF), nomenclatures (BOM), suivi d'atelier et contrôle qualité.

### 9. 🛡️ KOBA ADMIN
- Console d'administration SaaS centrale (Super Admin KOBA).
- Gestion du provisionnement des Tenants, abonnements, facturation SaaS, métriques et licences.

---

## 🔄 Interopérabilité & Activation Dynamique

- **Découplage** : Chaque module communique avec le Moteur Commun via des interfaces et contrats NestJS stricts.
- **Activation par Tenant** : Le Moteur Commun filtre la visibilité des menus, endpoints d'API et entités Prisma en fonction des modules souscrits par le Tenant.
