# 🗄️ ARCHITECTURE DE LA BASE DE DONNÉES — KOBA ERP CLOUD (DATABASE ARCHITECTURE)

> **Document de Référence pour l'Ingénierie des Données**  
> **Projet** : KOBA ERP Cloud  
> **SGBD Target** : PostgreSQL + Prisma ORM  
> **Rôle** : Architecte Base de Données Senior  
> **Version** : 1.0.0  
> **Statut** : Documentation Officielle de Référence  

---

# 1. Principes de conception

La conception de la base de données de KOBA ERP Cloud repose sur des standards industriels stricts adaptés aux plateformes SaaS ERP à forte charge et exigences réglementaires élevées :

- **PostgreSQL** : Utilisation des capacités avancées de PostgreSQL (Types UUIDv4, JSONB indexé GIN, RLS, types Enum, fonctions fenêtres, partitionnement natif).
- **Normalisation (3NF)** : Respect strict de la Troisième Forme Normale pour éviter la redondance et garantir l'intégrité des données, avec dénormalisation ciblée uniquement pour des besoins d'analytique temps réel.
- **Performance** : Temps d'exécution des requêtes OLTP cibles < 10 ms via indexation composite et requêtes filtrées sur le contexte tenant.
- **Sécurité** : Étanchéité absolue inter-tenants, masquage des données sensibles et principe du moindre privilège d'accès au niveau SGBD.
- **Scalabilité** : Architecture prête pour la réplication Read-Replicas, le sharding par tenant et le partitionnement de tables volumineuses.
- **Indexation Strategique** : B-Tree composites sur `(tenant_id, company_id, deleted_at)`, index GIN sur le JSONB et index GiST/SP-GiST pour les recherches géographiques.
- **Historisation & Soft Delete** : Horodatage universel UTC (`created_at`, `updated_at`) et suppression logique (`deleted_at`) sur l'ensemble des entités métiers.

---

# 2. Stratégie Multi-Tenant

KOBA ERP Cloud implémente un modèle d'**isolation logique partagée (Shared Database, Discriminator-Based & Row-Level Security)** offrant un compromis idéal entre coût d'infrastructure et étanchéité des données.

```text
[ Tenant Root (Compte SaaS) ] ── (tenant_id)
      └── [ Organisation (Groupe) ] ── (organization_id)
            └── [ Entreprise (Société Juridique) ] ── (company_id)
                  └── [ Filiale / Branch (Site / Établissement) ] ── (branch_id)
                        └── [ Département / Service ] ── (department_id)
                              └── [ Utilisateur ] ── (user_id)
```

### Champs Obligatoires d'Isolation
Chaque table métier sans exception intègre dans son schéma relationnel les clés d'isolation suivantes :
- `tenant_id` (UUID, Not Null) : Identifiant de l'abonné SaaS.
- `organization_id` (UUID, Nullable) : Identifiant de la holding ou organisation parente.
- `company_id` (UUID, Nullable) : Identifiant de la société juridique opératrice.
- `branch_id` (UUID, Nullable) : Identifiant du site ou établissement local.

### Stratégie d'Isolation & Row-Level Security (RLS)
Chaque requête exécutée par Prisma ORM ou en direct passe obligatoirement par un middleware d'injection du contexte de session tenant (`SET LOCAL app.current_tenant_id = '...'`), couplé aux politiques PostgreSQL RLS qui rejettent nativement toute ligne n'appartenant pas au Tenant actif.

---

# 3. Tables du KOBA CORE

Conception détaillée des 20 tables fondamentales composant le schéma du Moteur Commun KOBA CORE :

### 1. `tenants`
- **Description** : Compte souscripteur SaaS racine (Société mère ou client souscripteur).
- **Champs principaux** : `id` (UUID), `name`, `slug` (Unique), `plan_type`, `status` (ACTIVE/SUSPENDED), `created_at`, `updated_at`.
- **Relations** : 1-N vers `organizations`, `companies`, `users`.

### 2. `organizations`
- **Description** : Holding ou groupe regroupant plusieurs entreprises.
- **Champs principaux** : `id`, `tenant_id`, `name`, `code`, `tax_id`, `created_at`.
- **Relations** : N-1 vers `tenants`, 1-N vers `companies`.

### 3. `companies`
- **Description** : Entité juridique / société légale (Registre du commerce, raison sociale).
- **Champs principaux** : `id`, `tenant_id`, `organization_id`, `name`, `registration_number`, `currency_id`, `country_id`, `created_at`.
- **Relations** : N-1 vers `organizations`, 1-N vers `branches`.

### 4. `branches`
- **Description** : Filiale, établissement secondaire, magasin, usine ou site d'exploitation.
- **Champs principaux** : `id`, `tenant_id`, `company_id`, `name`, `code`, `city_id`, `address`, `created_at`.
- **Relations** : N-1 vers `companies`, 1-N vers `departments`.

### 5. `departments`
- **Description** : Département fonctionnel au sein d'une filiale (ex: Direction Comptable, Service RH).
- **Champs principaux** : `id`, `tenant_id`, `branch_id`, `name`, `code`, `manager_id`, `created_at`.
- **Relations** : N-1 vers `branches`, 1-N vers `users`.

### 6. `users`
- **Description** : Comptes utilisateurs physiques de la plateforme.
- **Champs principaux** : `id`, `tenant_id`, `email` (Unique), `password_hash`, `first_name`, `last_name`, `phone`, `status`, `is_mfa_enabled`, `created_at`.
- **Relations** : N-1 vers `tenants`, N-N vers `roles`, 1-N vers `activity_logs`.

### 7. `roles`
- **Description** : Définition des rôles fonctionnels par tenant ou globaux.
- **Champs principaux** : `id`, `tenant_id`, `name`, `code`, `description`, `is_system`, `created_at`.
- **Relations** : N-N vers `permissions` via `role_permissions`, N-N vers `users` via `user_roles`.

### 8. `permissions`
- **Description** : Catalogue des permissions granulaires atomiques (ex: `sales:invoice:approve`).
- **Champs principaux** : `id`, `module`, `resource`, `action`, `code` (Unique), `description`.
- **Relations** : N-N vers `roles` via `role_permissions`.

### 9. `role_permissions`
- **Description** : Table de jonction associant les permissions aux rôles.
- **Champs principaux** : `role_id`, `permission_id`, `created_at`.
- **Relations** : N-1 vers `roles`, N-1 vers `permissions`.

### 10. `user_roles`
- **Description** : Table de jonction affectant les rôles aux utilisateurs avec scope (Company/Branch).
- **Champs principaux** : `user_id`, `role_id`, `company_id`, `branch_id`, `created_at`.
- **Relations** : N-1 vers `users`, N-1 vers `roles`.

### 11. `countries`
- **Description** : Référentiel des pays, indicatifs téléphoniques et normes nationales.
- **Champs principaux** : `id`, `name`, `iso_code_2`, `iso_code_3`, `phone_code`, `currency_id`, `flag_url`.
- **Relations** : 1-N vers `cities`, 1-N vers `companies`.

### 12. `cities`
- **Description** : Villes et découpages administratifs associés aux pays.
- **Champs principaux** : `id`, `country_id`, `name`, `region_name`, `postal_code`.
- **Relations** : N-1 vers `countries`, 1-N vers `branches`.

### 13. `settings`
- **Description** : Pares de configurations clé-valeur globales et par tenant.
- **Champs principaux** : `id`, `tenant_id`, `company_id`, `key`, `value` (JSONB), `category`, `is_encrypted`.
- **Relations** : N-1 vers `tenants`, N-1 vers `companies`.

### 14. `notifications`
- **Description** : Notifications générées pour les utilisateurs (In-App, WebSocket, Email).
- **Champs principaux** : `id`, `tenant_id`, `user_id`, `title`, `message`, `type`, `is_read`, `read_at`, `payload` (JSONB), `created_at`.
- **Relations** : N-1 vers `users`.

### 15. `documents`
- **Description** : Métadonnées centrales des documents GED de la plateforme.
- **Champs principaux** : `id`, `tenant_id`, `company_id`, `entity_type`, `entity_id`, `title`, `document_type_id`, `created_by`.
- **Relations** : 1-N vers `files`, 1-N vers `document_versions`.

### 16. `files`
- **Description** : Emplacements et détails techniques des fichiers stockés sur MinIO S3.
- **Champs principaux** : `id`, `tenant_id`, `bucket_name`, `object_key`, `file_name`, `file_size`, `mime_type`, `checksum_sha256`.
- **Relations** : N-1 vers `documents`.

### 17. `workflows`
- **Description** : Définition des processus métiers et circuits de décision.
- **Champs principaux** : `id`, `tenant_id`, `module`, `process_name`, `description`, `is_active`.
- **Relations** : 1-N vers `workflow_steps`.

### 18. `workflow_steps`
- **Description** : Étapes séquentielles ou conditionnelles d'un workflow.
- **Champs principaux** : `id`, `workflow_id`, `step_order`, `step_name`, `required_role_id`, `action_type`.
- **Relations** : N-1 vers `workflows`, N-1 vers `roles`.

### 19. `audit_logs`
- **Description** : Registre légal immuable des modifications de données sensibles.
- **Champs principaux** : `id`, `tenant_id`, `company_id`, `user_id`, `action`, `table_name`, `record_id`, `old_values` (JSONB), `new_values` (JSONB), `ip_address`, `created_at`.
- **Relations** : N-1 vers `users`.

### 20. `activity_logs`
- **Description** : Journalisation des connexions et activités opérationnelles utilisateurs.
- **Champs principaux** : `id`, `tenant_id`, `user_id`, `event_type`, `description`, `user_agent`, `ip_address`, `created_at`.
- **Relations** : N-1 vers `users`.

---

# 4. Gestion utilisateurs

### Modèle de Sécurité et Compte Utilisateur
- **Authentification** : Mots de passe hachés via Argon2id ou bcrypt (cost level 12 minimum).
- **Gestion des Sessions** : Identifiants de session stockés sur Redis avec révocation instantanée et suivi des Refresh Tokens (UUIDv4 signés).
- **Sécurité Compte** : Verrouillage automatique du compte après 5 tentatives échouées pendant 15 minutes.
- **Historique de Connexion** : Enregistrement de l'historique des accès dans `activity_logs` avec traçabilité d'adresse IP et Device Fingerprint.

---

# 5. Gestion géographique Afrique

Le modèle géographique de KOBA CORE est conçu pour s'adapter précisément aux architectures territoriales de l'Afrique francophone (UEMOA, CEMAC) et notamment de la Côte d'Ivoire :

```text
[ Country (ex: Côte d'Ivoire / CI) ]
      └── [ Region (ex: District Autonome d'Abidjan / Région des Lagunes) ]
            └── [ District / Department (ex: Abidjan) ]
                  └── [ City / Ville (ex: Abidjan) ]
                        └── [ Commune (ex: Cocody, Yopougon, Plateau) ]
                              └── [ Quartier / Zone (ex: Riviera 3, Angré) ]
```

### Spécificités Régionales Prises en Charge
- **Côte d'Ivoire & UEMOA** : Support des découpages par Communes, Quartiers, NISA, NCC (Numéro de Compte Contribuable) et régimes fiscaux (Réel Simplifié, Réel Normal).
- **CEMAC & Zone Franc** : Gestion de la codification postale et administrative régionale.

---

# 6. Gestion financière commune

Tables de référence pour la gouvernance comptable et financière transversale :

- `devises` (`currencies`) : Code ISO (ex: XOF, XAF, EUR, USD), symbole, nombre de décimales.
- `taux_change` (`exchange_rates`) : Taux de conversion historiques datés entre devises avec devise de référence Tenant.
- `taxes` (`tax_rates`) : Régimes de TVA (ex: 18% UEMOA), retenues à la source, exonérations et codes comptables rattachés.
- `exercices` (`fiscal_years`) : Définition des exercices comptables (ex: Année civile du 01/01 au 31/12) avec statut (OPEN, CLOSED, LOCKED).
- `périodes` (`fiscal_periods`) : Découpage mensuel/trimestriel des exercices comptables pour la clôture Périodique.

---

# 7. Documents (Schéma GED)

Le sous-système documentaire repose sur 4 tables interconnectées :

1. `document_types` : Types de documents (Facture, Contrat, Bon de Livraison, Pièce d'Identité).
2. `documents` : Enregistrement logique rattaché à une entité métier via `(entity_type, entity_id)`.
3. `document_versions` : Historique des révisions du document avec numéro de version semver.
4. `document_attachments` : Liens et métadonnées d'accès au fichier binaire présent sur le stockage MinIO S3.

---

# 8. Audit (Traçabilité Immuable)

Le sous-système d'audit garantit l'intégrité comptable et légale :

- **Triggers PostgreSQL / Prisma Middleware** : Capture automatique des opérations `INSERT`, `UPDATE`, `DELETE`.
- **Format JSONB** : Capture des deltas entre `old_values` et `new_values`.
- **Immuabilité** : Revocation des privilèges `UPDATE` et `DELETE` sur la table `audit_logs` pour tous les rôles BDD d'application.

---

# 9. Relations avec les modules métiers

Chaque module métier s'appuie sur la base commune et étend le schéma via ses tables propres scopées par `tenant_id` :

- **KOBA BUSINESS** : Tables `clients`, `prospects`, `produits`, `devis`, `commandes_ventes`, `factures_ventes` (Liées à `companies`, `branches`, `documents`, `currencies`).
- **KOBA EDU** : Tables `étudiants`, `enseignants`, `niveaux`, `classes`, `inscriptions`, `bulletins`, `paiements_scolarité` (Liées à `branches`, `users`, `audit_logs`).
- **KOBA HEALTH** : Tables `patients`, `médecins`, `consultations`, `dossiers_médicaux`, `ordonnances`, `lits` (Liées à `branches`, `users`, `documents`).
- **KOBA RH** : Tables `employés`, `contrats_travail`, `bulletins_paie`, `demandes_congés`, `déclarations_sociales` (Liées à `departments`, `users`, `workflows`).
- **KOBA FINANCE** : Tables `comptes_comptables`, `écritures_comptables`, `journaux`, `règlements`, `comptes_bancaires` (Liées à `companies`, `fiscal_years`, `currencies`).
- **KOBA HOTEL** : Tables `chambres`, `catégories_chambres`, `réservations`, `sejours_checkin`, `factures_hotel` (Liées à `branches`, `clients`, `payments`).
- **KOBA LOGISTICS** : Tables `entrepôts`, `emplacements`, `mouvements_stock`, `bons_commande_achat`, `fournisseurs` (Liées à `branches`, `products`, `workflows`).
- **KOBA INDUSTRY** : Tables `ordres_fabrication`, `nomenclatures_bom`, `postes_charge`, `contrôles_qualité` (Liées à `branches`, `products`, `users`).
- **KOBA ADMIN** : Tables `subscriptions`, `invoices_saas`, `tenant_features`, `system_metrics` (Liées aux `tenants`).

---

# 10. Performance

- **Index Composite** : Création d'index B-Tree composites sur `(tenant_id, company_id, created_at DESC)` sur toutes les tables volumineuses.
- **Partitionnement** : Partitionnement par intervalle de dates (Range Partitioning par année/mois) des tables `audit_logs`, `activity_logs` et `écritures_comptables`.
- **Pagination Mandatory** : Stratégie de pagination par curseur (`cursor-based pagination`) pour les tables à fort volume.
- **Cache Redis** : Cache de deuxième niveau sur les référentiels peu mutables (`countries`, `cities`, `currencies`, `settings`, `permissions`).

---

# 11. Migration (Prisma ORM)

- **Prisma Schema** : Fichier central unique `database/prisma/schema.prisma`.
- **Migrations Versionnées** : Génération des migrations SQL via `npx prisma migrate dev` et application en production via `npx prisma migrate deploy`.
- **Seeders Idempotents** : Scripts d'initialisation des données de référence (Pays, Devises, Rôles système, Permissions).

---

# 12. Sécurité base de données

- **Permissions SGBD** : Utilisateur d'application à privilèges restreints (pas de droits `SUPERUSER` ni `DROP`).
- **Chiffrement en Transit** : Connexions SSL/TLS 1.3 obligatoires entre NestJS et PostgreSQL.
- **Chiffrement au Repos** : Chiffrement des volumes de stockages BDD (LUKS / AES-256) et chiffrement applicatif des colonnes sensibles (ex: jetons, clés API).
- **Sauvegarde & Restauration** : Sauvegardes automatisées quotidiennes `pg_dump` / WAL-G avec stockage chiffré multi-régions sur MinIO S3 et tests mensuels de restauration (PDR).
