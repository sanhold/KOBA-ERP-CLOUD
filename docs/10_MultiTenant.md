# 🏢 ARCHITECTURE MULTI-TENANT — KOBA ERP CLOUD (MULTI-TENANCY SPECIFICATIONS)

> **Document de Référence pour l'Isolation et la Hiérarchie Organisationnelle**  
> **Projet** : KOBA ERP Cloud  
> **Composant** : KOBA CORE Engine  
> **Rôle** : Architecte Logiciel Principal  
> **Version** : 1.0.0  
> **Statut** : Modèle Organisationnel Officiel  

---

# 1. Arborescence Organisationnelle à 5 Niveaux

L'architecture Multi-Tenant de **KOBA ERP Cloud** repose sur un modèle hiérarchique strict garantissant l'étanchéité absolue des données et la flexibilité d'organisation des groupes d'entreprises :

```text
               +-----------------------------------+
               |            KOBA CLOUD             |
               | (Plateforme SaaS Racine / Super)  |
               +-----------------------------------+
                                 │
                                 ▼
               +-----------------------------------+
               |              TENANT               |
               |    (Client utilisant KOBA)        |
               +-----------------------------------+
                                 │
                                 ▼
               +-----------------------------------+
               |           ORGANIZATION            |
               | (Groupe ou structure principale)  |
               +-----------------------------------+
                                 │
                                 ▼
               +-----------------------------------+
               |              COMPANY              |
               |        (Société juridique)        |
               +-----------------------------------+
                                 │
                                 ▼
               +-----------------------------------+
               |              BRANCH               |
               |   (Agence / Site / Établissement) |
               +-----------------------------------+
                                 │
                                 ▼
               +-----------------------------------+
               |            DEPARTMENT             |
               |         (Service interne)         |
               +-----------------------------------+
```

---

# 2. Rôle et Définition de Chaque Niveau

### 1. 🌐 KOBA CLOUD (Plateforme Racine)
- **Rôle** : Niveau d'administration centrale SaaS géré par KOBA.
- **Périmètre** : Provisionnement des Tenants, abonnements, licences, supervision système et monitoring global.

### 2. 🏢 TENANT (Client souscripteur SaaS)
- **Rôle** : Compte client racine souscripteur (ex: Groupe Sanogo Holding).
- **Isolation** : Racine de l'étanchéité des données (`tenant_id`). Aucune donnée ne peut être partagée entre deux Tenants distincts.

### 3. 🏛️ ORGANIZATION (Groupe ou Structure Principale)
- **Rôle** : Holding, congrégat ou organisation chapeau regroupant plusieurs filiales ou sociétés.
- **Identifiant** : `organization_id` (Rattaché à un `tenant_id`).

### 4. 💼 COMPANY (Société Juridique)
- **Rôle** : Société légale immatriculée avec son registre de commerce, Numéro de Compte Contribuable (NCC) et raison sociale.
- **Identifiant** : `company_id` (Rattaché à un `organization_id` et `tenant_id`).
- **Périmètre** : Exercices comptables, déclarations fiscales, devises légales.

### 5. 🏪 BRANCH (Agence / Site / Établissement)
- **Rôle** : Unité opérationnelle locale (ex: Agence Cocody, Usine San-Pédro, Clinique Plateau, Magasin Yopougon).
- **Identifiant** : `branch_id` (Rattaché à une `company_id` et `tenant_id`).
- **Périmètre** : Stocks locaux, caisses, points de vente, plannings.

### 6. 👥 DEPARTMENT (Service Interne)
- **Rôle** : Service fonctionnel interne (ex: Direction Financière, Service RH, Service Commercial, Service Achats).
- **Identifiant** : `department_id` (Rattaché à une `branch_id` et `tenant_id`).
- **Périmètre** : Attribution des rôles utilisateurs, circuits de validation et départements RH.

---

# 3. Application au Niveau Base de Données (Prisma / PostgreSQL)

Dans le schéma PostgreSQL / Prisma (`database/prisma/schema.prisma`), cette hiérarchie est concrétisée par les modèles :
- `Tenant` (`tenants`)
- `Organizations` (`organizations`) ➔ `tenantId`
- `Companies` (`companies`) ➔ `organizationId`, `tenantId`
- `Branches` (`branches`) ➔ `companyId`, `tenantId`
- `Departments` (`departments`) ➔ `branchId`, `tenantId`

### Clés Composites d'Isolation
Toute requête sur les données métiers doit inclure les filtres d'isolation :
```sql
WHERE tenant_id = $1 AND (company_id = $2 OR branch_id = $3)
```
