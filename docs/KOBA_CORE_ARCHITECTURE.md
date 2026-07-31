# 🏛️ SPÉCIFICATIONS ARCHITECTURALES — KOBA CORE (KOBA CORE ARCHITECTURE)

> **Document de Référence Technique & Fonctionnel**  
> **Projet** : KOBA ERP Cloud  
> **Composant** : KOBA CORE Engine (Moteur Central Commun)  
> **Rôle** : Architecte Logiciel Principal  
> **Version** : 1.0.0  
> **Statut** : Documentation Officielle de Référence  

---

# 1. Présentation de KOBA CORE

**KOBA CORE** est le moteur central, partagé et réutilisable qui constitue la colonne vertébrale SaaS de l'ensemble de la plateforme KOBA ERP Cloud. 

Toutes les capacités transversales applicatives (sécurité, authentification, isolation multi-tenant, gestion des utilisateurs, rôles, permissions, moteur de workflow, GED, audit, notifications, tableaux de bord, API Gateway et moteurs d'Intelligence Artificielle) sont centralisées dans KOBA CORE.

Chacun des **9 modules métiers verticaux** (*KOBA BUSINESS, KOBA EDU, KOBA HEALTH, KOBA FINANCE, KOBA RH, KOBA HOTEL, KOBA LOGISTICS, KOBA INDUSTRY, KOBA ADMIN*) s'appuie nativement sur KOBA CORE sans réinventer ni dupliquer ces services fondamentaux.

---

# 2. Architecture générale

KOBA CORE repose sur une architecture découplée et moderne structurée en 8 sous-systèmes principaux :

```text
+------------------------------------------------------------------------------------+
|                                FRONTEND (Next.js)                                  |
+------------------------------------------------------------------------------------+
                                         | (HTTPS / WSS)
                                         v
+------------------------------------------------------------------------------------+
|                                API GATEWAY (NestJS)                                |
|                        Rate Limiting | Routage | Versioning                        |
+------------------------------------------------------------------------------------+
                                         |
     +-----------------------------------+-----------------------------------+
     |                                   |                                   |
     v                                   v                                   v
+-----------------------+     +-----------------------+     +-----------------------+
|   SERVICES METIERS    |     |   KOBA CORE ENGINE    |     |  MOTEUR IA CENTRAL    |
|   (9 Modules ERP)     | <-> |  (Auth, Perms, GED,   | <-> | (Copilotes, RAG, OCR, |
|                       |     |   Workflow, Audit)    |     |    Analytics, IA)     |
+-----------------------+     +-----------------------+     +-----------------------+
     |                                   |                                   |
     v                                   v                                   v
+------------------------------------------------------------------------------------+
|                                COUCHE DE STOCKAGE                                  |
|   PostgreSQL (Prisma BDD)  |  Redis (Cache/In-Memory)  |  MinIO S3 (GED Documents) |
+------------------------------------------------------------------------------------+
```

1. **Frontend (Next.js + TypeScript)** : Interface utilisateur réactive, thématisable, adaptée au mobile et consommant les API REST et flux WebSocket du CORE.
2. **API Backend (NestJS + TypeScript)** : Gateway centralisée gérant le routage, le Rate Limiting, la validation des DTOs et le versionnement API.
3. **Services Métiers** : Ensemble des contrôleurs et cas d'usage réutilisables par les modules verticaux.
4. **Base de Données (PostgreSQL + Prisma ORM)** : Base relationnelle multi-tenant hautement structurée et indexée.
5. **Stockage Documentaire (MinIO S3)** : Serveur de stockage d'objets compatible S3 pour la Gestion Électronique de Documents (GED).
6. **Notifications** : Hub d'envoi multi-canal synchronisé en temps réel (WebSockets, Email, SMS, Push).
7. **IA (Intelligence Artificielle Centralisée)** : Moteur d'analyse prédictive, assistants virtuels, traitement OCR et RAG.
8. **Audit** : Registre immuable de traçabilité des accès et des mutations applicatives.

---

# 3. Gestion Multi-Tenant

La gestion du multi-tenancy dans KOBA CORE est fondée sur une hiérarchie organisationnelle à 6 niveaux garantissant l'étanchéité absolue des données et des accès :

```text
[ Tenant (Compte SaaS Client) ]
        │
        ├── [ Organisation (Holding / Groupe) ]
        │         │
        │         ├── [ Entreprise (Société juridique) ]
        │         │         │
        │         │         ├── [ Filiale / Établissement (Branch) ]
        │         │         │         │
        │         │         │         └── [ Département / Service ]
        │         │         │                   │
        │         │         │                   └── [ Utilisateur ]
```

### Isolation Obligatoire des Données
Toutes les entités et requêtes métiers en base de données PostgreSQL doivent obligatoirement porter et valider les clés d'isolation suivantes :
- `tenant_id` : Identifiant universel du compte SaaS client.
- `organization_id` : Identifiant de l'organisation ou du groupe d'entreprises.
- `company_id` : Identifiant de la société juridique concernée.
- `branch_id` : Identifiant de la filiale ou du site d'exploitation local.

⚠️ **Aucune requête SQL / Prisma ne peut s'exécuter sans filtrage préalable sur ces identifiants de contexte.**

---

# 4. Gestion des utilisateurs

### Modèle Fonctionnel
- **Utilisateur** : Compte physique (Nom, Prénom, Email, Téléphone, Photo, Statut, Langue).
- **Profil** : Préférences d'affichage, thème, fuseau horaire, paramètres de sécurité (MFA).
- **Rôle** : Ensemble de rôles attribués à l'utilisateur au niveau d'un Tenant, d'une Entreprise ou d'une Filiale.
- **Permission** : Droits d'accès fins atomiques rattachés aux rôles ou directement à l'utilisateur.
- **Groupe** : Regroupement d'utilisateurs par service ou équipe fonctionnelle pour l'attribution de tâches et workflows.

### Flux Utilisateurs Standardisés
1. **Création d'Utilisateur** : Saisie des informations de base par un administrateur du Tenant.
2. **Invitation par Email** : Envoi d'un jeton d'invitation à durée limitée avec lien sécurisé.
3. **Activation de Compte** : Définition du mot de passe initial, acceptation des conditions et activation MFA.
4. **Réinitialisation de Mot de Passe** : Procédure autonome sécurisée par OTP (One-Time Password) / Email.
5. **Connexion Sécurisée** : Authentification avec vérification MFA, enregistrement du Device et émission des tokens JWT.

---

# 5. Gestion des rôles et permissions

KOBA CORE implémente un modèle **RBAC (Role-Based Access Control)** et **ABAC (Attribute-Based Access Control)** hybride et dynamique.

### Rôles Standards Pré-configurés
- `SUPER_ADMIN` : Administrateur système KOBA SaaS (Gestion globale de la plateforme).
- `ADMIN_TENANT` : Administrateur principal d'un Tenant (Gestion intégrale de l'entreprise).
- `DIRECTEUR` : Accès étendu d'administration et d'approbation stratégique.
- `MANAGER` : Gestion d'équipe, de département et de validation de proximité.
- `COMPTABLE` : Accès spécialisé aux modules financiers, écritures et rapports.
- `VENDEUR` : Accès opérationnel aux opportunités, devis et clients.
- `UTILISATEUR` : Accès standard en lecture/écriture sur son périmètre opérationnel.

### Matrix de Permissions Granulaires
Chaque action sur une ressource KOBA est soumise à une évaluation de permission atomique :
- **Créer** (`CREATE`) : Droit d'instancier une nouvelle entité.
- **Lire** (`READ`) : Droit d'accéder et consulter les données.
- **Modifier** (`UPDATE`) : Droit d'éditer les informations existantes.
- **Supprimer** (`DELETE`) : Droit d'archiver ou supprimer une entité.
- **Exporter** (`EXPORT`) : Droit de télécharger des rapports, exports Excel/PDF ou extractions BDD.
- **Approuver** (`APPROVE`) : Droit de valider une étape d'un workflow opérationnel ou financier.

---

# 6. Authentification

Le sous-système d'authentification de KOBA CORE garantit un niveau de sécurité entreprise Zero-Trust :

- **JWT (JSON Web Token)** : En-tête standard `Authorization: Bearer <token>` sur chaque requête API.
- **Access Token** : Jeton cryptographique à courte durée de vie (ex: 15 minutes) contenant les claims du Tenant et des Rôles.
- **Refresh Token** : Jeton sécurisé à longue durée de vie (ex: 7 jours) stocké dans un Cookie HTTP-Only Sécurisé ou managé via Redis avec possibilité de révocation instantanée.
- **Sessions** : Suivi des sessions actives en mémoire Redis avec possibilité de déconnexion à distance.
- **Double Authentification (MFA / 2FA)** : Support d'authentification TOTP (Google Authenticator, Authy) et SMS/Email OTP.
- **Historique de Connexion** : Enregistrement de chaque tentative de connexion (Date, Heure, Adresse IP, User-Agent, Résultat, Geolocation approximative).

---

# 7. Gestion documentaire (GED KOBA)

KOBA CORE intègre une solution de Gestion Électronique de Documents (GED) centralisée s'appuyant sur **MinIO S3** :

### Types de Documents Pris en Charge
- **Documents & Pièces Jointes** : PDF, Word, Excel, CSV, TXT.
- **Médias & Images** : PNG, JPEG, WebP, SVG (Photos de profil, logos, pièces d'identité).
- **Documents Officiels** : Contrats, Factures, Bons de commande, Bulletins de paie.
- **Archives** : Fichiers zippés et historiques documentaires.

### Fonctionnalités GED KOBA CORE
- Stockage d'objets haute performance compatible S3 via MinIO.
- Chiffrement automatique des fichiers au repos (AES-256).
- Versionnage des documents et conservation des historiques de modifications.
- Génération d'URLs de téléchargement présignées (Presigned URLs) à durée limitée.
- Association dynamique de documents à n'importe quelle entité métier (ex: Facture #1024, Dossier Patient #58).

---

# 8. Système de notifications

Le moteur de notifications de KOBA CORE assure une distribution multi-canal réactive :

- **Email** : Modèles HTML thématiques réactifs gérés par le moteur de templates (SendGrid / SMTP / Mailgun).
- **SMS** : Intégration de passerelles SMS régionales et internationales (Twilio, Infobip, passerelles locales).
- **Push Mobile** : Notifications push en arrière-plan pour applications mobiles via Firebase Cloud Messaging (FCM).
- **Notifications Internes (In-App)** : Notifications en temps réel diffusées via WebSockets (Socket.io) avec centre de notifications interactif, marquage lu/non lu et filtres.

---

# 9. Workflow Engine (Moteur de Processus Métier)

KOBA CORE fournit un moteur de workflows personnalisable permettant d'automatiser les circuits de décision et d'approbation :

### Fonctionnalités du Workflow Engine
- Définition d'états dynamiques (ex: `BROUILLON` -> `EN_ATTENTE_VALIDATION` -> `VALIDE` -> `REJETE`).
- Affectation des étapes de validation à des rôles, groupes ou utilisateurs spécifiques.
- Prise en charge des signatures électroniques et horodatées.
- Relances automatiques et délais d'expiration configurables.

### Exemples d'Applications
- **Validation de Facture** : Circuit d'approbation comptable et financière selon des seuils de montant.
- **Validation de Congé** : Approbation à deux niveaux (Manager direct -> Responsable RH).
- **Validation d'Achat** : Circuit de validation d'un Bon de Commande fournisseur.

---

# 10. Audit et historique

Le sous-système d'audit garantit la non-répudiation et la conformité légale (RGPD, normes comptables) en traçant **100% des mutations de données** :

### Éléments Traçés dans l'Audit Log
- **Utilisateur** : `user_id` et identité de l'auteur de l'action.
- **Tenant & Filiale** : `tenant_id`, `company_id`, `branch_id`.
- **Action** : Type d'opération (`CREATE`, `UPDATE`, `DELETE`, `LOGIN`, `EXPORT`, `APPROVE`).
- **Ressource** : Nom de la table ou de l'entité affectée + ID de l'enregistrement.
- **Date & Heure** : Horodatage précis à la milliseconde (UTC).
- **Adresse IP & Agent** : Adresse IP d'origine et signature du navigateur/client.
- **Ancienne Valeur** : Instantané JSON de l'état de l'entité avant modification.
- **Nouvelle Valeur** : Instantané JSON de l'état de l'entité après modification.

⚠️ **Les logs d'audit sont stockés dans des tables en lecture seule et ne peuvent être ni modifiés ni supprimés.**

---

# 11. Tableau de bord central

KOBA CORE offre un moteur de tableaux de bord dynamique et hautement personnalisable :

- **KPIs en Temps Réel** : Indicateurs clés de performance calculés instantanément ou servis via le cache Redis.
- **Graphiques Interactifs** : Visualisations de données (courbes, histogrammes, camemberts) alimentées par des API dédiées.
- **Alertes et Jalons** : Indicateurs visuels sur les seuils critiques (stocks bas, factures impayées, échéances de contrats).
- **Personnalisation par Rôle** : Tableaux de bord sur-mesure ajustés selon le profil de l'utilisateur (Dashboard Directeur, Dashboard Comptable, Dashboard Vendeur).

---

# 12. API Gateway

KOBA CORE orchestre toutes les communications externes et internes via son API Gateway :

- **API REST** : Architecture d'API RESTful normée, prévisible et utilisant les verbes HTTP standards.
- **Documentation Swagger / OpenAPI** : Documentation interactive générée automatiquement sur `/api/docs`.
- **Versioning API** : Prise en charge du versionnement explicite des routes (ex: `/api/v1/...`).
- **WebSockets** : Gateways temps réel pour la diffusion des événements, notifications et données en direct.
- **Rate Limiting & Throttling** : Protection de l'infrastructure contre les abus et attaques DoS via Redis.

---

# 13. Intelligence Artificielle (Moteur Central IA)

KOBA CORE embarque des capacités d'IA centralisées mises à disposition de tous les modules métiers :

- **Assistant Intelligent (Copilote KOBA)** : Assistant conversationnel d'aide à la décision et à la navigation dans l'ERP.
- **Analyse Automatique** : Détection d'anomalies financières, de ruptures de stock prévisionnelles et d'écarts budgétaires.
- **Rapports & Synthèses Automatisés** : Génération de résumés exécutifs en langage naturel.
- **Prévisions (Predictive Analytics)** : Algorithmes de prévision des ventes, de la trésorerie et de la demande.
- **OCR (Reconnaissance Optique de Caractères)** : Extraction automatique de données depuis des factures scannées, reçus et cartes d'identité.
- **Recherche Inteligente (Vector / OpenSearch)** : Recherche sémantique unifiée à travers l'ensemble des documents et données de l'ERP.

---

# 14. Paramètres système

Le module de configuration centrale de KOBA CORE permet d'adapter l'ERP à chaque contexte national et d'entreprise :

- **Pays & Localisation** : Gestion des pays, fuseaux horaires et règles régionales (ex: zone OHADA, UEMOA, CEMAC, International).
- **Langues** : Support multi-langues complet (Français, Anglais, Portugais, Arabe, etc.).
- **Devises** : Multi-devises natives avec taux de change dynamiques (FCFA, EUR, USD, NGN, KES, etc.).
- **Taxes & Régimes Fiscaux** : Moteur de calcul de TVA, retenues à la source et règles fiscales d'entreprise.
- **Formats de Documents** : Personnalisation des modèles d'impression PDF (en-têtes, pieds de page, logos, numérotation).
- **Configurations Entreprise** : Paramétrage des règles de gestion globales, thèmes visuels et préférences du Tenant.

---

# 15. Relations avec les modules métiers

Chacun des 9 modules verticaux réutilise directement les briques de KOBA CORE sans les réimplémenter :

```text
+------------------+------------------------------------------------------------------+
| Module Métier    | Services KOBA CORE Utilisés Nativement                           |
+------------------+------------------------------------------------------------------+
| KOBA BUSINESS    | Clients/Users, Produits/GED, Factures/Workflow, Sales Dashboard  |
| KOBA EDU         | Élèves/Users, Bulletins/GED, Inscriptions/Workflow, SMS Notifs   |
| KOBA HEALTH      | Patients/Users, Prescriptions/GED, Visites/Workflow, Audit Logs  |
| KOBA FINANCE     | Écritures/Audit, Validations/Workflow, Documents/GED, Devise/TVA |
| KOBA RH          | Employés/Users, Paie/Workflow, Contrats/GED, Absences/Approval   |
| KOBA HOTEL       | Clients/Users, Réservations/Workflow, Factures/GED, Dashboards   |
| KOBA LOGISTICS   | Stocks/Index, Achats/Workflow, Fournisseurs/GED, Notifications   |
| KOBA INDUSTRY    | OF/Workflow, Nomenclatures/GED, Métriques/Dashboards, Audit      |
| KOBA ADMIN       | Tenants/Multi-Tenant, Abonnements/API, Licences/Audit, Global AI |
+------------------+------------------------------------------------------------------+
```

---

# 16. Règles de développement

Tout développeur ou agent IA intervenant sur KOBA ERP Cloud doit impérativement respecter les 3 consignes absolues suivantes :

1. **Réutiliser KOBA CORE** : Toute fonction transversale (auth, droits, GED, notifs, audit) doit impérativement utiliser le service KOBA CORE existant.
2. **Éviter les duplications (DRY)** : Interdiction stricte de réécrire un système d'authentification, de gestion de fichiers ou de logs au sein d'un module métier vertical.
3. **Respecter l'architecture modulaire** : Les modules métiers communiquent avec KOBA CORE via des interfaces TypeScript et des injections de dépendances NestJS rigoureusement typées.
