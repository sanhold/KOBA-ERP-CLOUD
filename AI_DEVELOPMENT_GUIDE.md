# 🤖 GUIDE DE DÉVELOPPEMENT POUR L'IA (AI DEVELOPMENT GUIDE)

> **Document de Référence pour les Assistants & Agents IA**  
> **Projet** : KOBA ERP Cloud  
> **Rôle** : Architecte IA Principal  
> **Version** : 1.0.0  
> **Statut** : Directive Obligatoire  

Ce document définit l'ensemble des règles, méthodologies et standards que toutes les Intelligences Artificielles (IA) intervenant sur le projet **KOBA ERP Cloud** doivent respecter avant et pendant toute génération de code ou proposition d'architecture.

---

# 1. Rôle de l'IA

L'IA agit avec l'exigence et l'expertise combinées des rôles suivants :
- **Architecte Logiciel** : Garant de l'alignement avec les patrons de conception et de la modularité.
- **Développeur Senior** : Auteur de code propre, élégant, typé et optimisé.
- **Expert Sécurité** : Protecteur contre les vulnérabilités, fuites de données et failles OWASP.
- **Expert Base de Données** : Modélisateur de schémas performants, indexés et étanches.
- **Expert UX/UI** : Designer d'interfaces réactives, esthétiques et intuitives.
- **Testeur** : Rédacteur méthodique de suites de tests unitaires, d'intégration et E2E.
- **Documentaliste** : Mainteneur rigoureux de la documentation technique et fonctionnelle.

⚠️ **Règle fondamentale** : **L'IA doit toujours analyser avant de coder.** Aucun code ne doit être produit à l'aveugle ou sans vérification préalable.

---

# 2. Méthode obligatoire de développement

Chaque nouvelle fonctionnalité ou module doit obligatoirement suivre cette séquence en 8 étapes :

- **Étape 1** : Comprendre le besoin métier.
- **Étape 2** : Proposer l'architecture.
- **Étape 3** : Définir les données nécessaires.
- **Étape 4** : Créer les règles métier.
- **Étape 5** : Développer le backend.
- **Étape 6** : Développer le frontend.
- **Étape 7** : Créer les tests.
- **Étape 8** : Documenter.

---

# 3. Architecture obligatoire

L'IA doit appliquer et faire respecter en permanence les principes architecturaux suivants :
- **Clean Architecture** : Découplage strict des couches applicatives, du domaine et de l'infrastructure.
- **SOLID** : Respect des 5 principes de conception orientée objet.
- **Domain-Driven Design (DDD)** : Centrage sur la logique métier et le langage omniprésent.
- **Modular Architecture** : Découplage des fonctionnalités en modules autonomes et réutilisables.
- **API First** : Définition et validation des contrats d'API (OpenAPI / Swagger) avant l'implémentation frontend.
- **Security First** : Intégration des contrôles de sécurité et d'accès dès le premier niveau de conception.
- **Mobile First** : Conception d'interfaces réactives adaptées à toutes les résolutions d'écran.

---

# 4. Organisation Backend

Le backend repose sur **NestJS**. Chaque module métier ou service core doit strictement respecter l'organisation de dossiers suivante :

```text
module/
├── controller/     # Points d'entrée REST / WebSocket & gestion des requêtes
├── service/        # Logique métier et cas d'usage (Use Cases)
├── repository/     # Accès aux données et requêtes Prisma ORM
├── dto/            # Data Transfer Objects & validation d'entrée (class-validator/zod)
├── entities/       # Modèles de domaine et entités
├── guards/         # Protection des routes (JWT, Roles, Multi-tenant)
├── interfaces/     # Contrats et interfaces TypeScript
└── tests/          # Suite de tests unitaires et d'intégration du module
```

---

# 5. Organisation Frontend

Le frontend repose sur **Next.js (App Router) + TypeScript**. Chaque module UI doit strictement respecter l'organisation de dossiers suivante :

```text
module/
├── components/     # Composants React réutilisables et sous-composants UI
├── pages/          # Vues principales et layouts de navigation
├── hooks/          # Hooks React personnalisés (état local, requêtes, cache)
├── services/       # Clients HTTP (fetch/axios) et appels d'API
├── types/          # Interfaces et types TypeScript du module
├── schemas/        # Schémas de validation des formulaires (Zod / Yup)
├── utils/          # Fonctions d'aide, formatteurs et utilitaires
└── tests/          # Tests de composants React et tests d'intégration UI
```

---

# 6. Base de données

La base de données repose sur **PostgreSQL** manipulée via **Prisma ORM**. 

Chaque modification du schéma de données doit obligatoirement inclure :
1. **Schema** : Définition claire des modèles dans `schema.prisma`.
2. **Migration** : Génération et validation des fichiers de migration SQL.
3. **Index** : Stratégie d'indexation explicite sur `tenant_id`, clés étrangères et champs de recherche.
4. **Relations** : Contraintes de clés étrangères et intégrité référentielle.
5. **Documentation** : Description des tables, colonnes et relations dans les documents BDD.

---

# 7. Règles Multi-Tenant

L'isolation des données est une priorité absolue. Toutes les données métiers doivent obligatoirement être associées et scopées par les identifiants de contexte suivants :
- `tenant_id` (Identifiant du Tenant racine / Compte SaaS)
- `company_id` (Identifiant de l'Entreprise)
- `branch_id` (Identifiant de la Filiale / Établissement)
- `user_id` (Identifiant de l'Utilisateur créateur / modificateur)

⚠️ **L'isolation des données doit être obligatoire et étanche** sur chaque requête BDD, cache Redis et endpoint d'API.

---

# 8. Sécurité

Toute fonctionnalité backend et frontend doit appliquer :
- **JWT** : Authentification par jeton Bearer de courte durée.
- **Refresh Token** : Mécanisme sécurisé de renouvellement de session.
- **RBAC / ABAC** : Contrôle d'accès basé sur les rôles et les attributs.
- **Validation des entrées** : Filtrage et assainissement strict de toutes les données entrantes.
- **Protection API** : Rate limiting, CORS, doted headers et prévention CSRF/XSS.
- **Audit Log** : Journalisation immuable de chaque action sensible ou modification de données.
- **Gestion des erreurs** : Normalisation des erreurs HTTP sans fuite d'informations système (RFC 7807).

---

# 9. Qualité du code

Tout code généré par l'IA doit être :
- **Maintenable** : Découpé en fonctions courtes à responsabilité unique.
- **Lisible** : Nommage clair, expressif et auto-documenté.
- **Testable** : Injectable, sans effets de bord masqués ni couplage fort.
- **Documenté** : Accompagné de commentaires TSDoc/JSDoc explicatifs.
- **Optimisé** : Sans requêtes N+1, boucles inefficaces ou fuites mémoire.
- **TypeScript strict** : Respect strict du mode `strict` sans utilisation d'aucun type `any`.

---

# 10. Communication avec le développeur

Avant d'effectuer une modification importante ou de générer un module :
1. **Présenter un plan d'action** clair et détaillé.
2. **Expliquer la liste des fichiers concernés** (créations, modifications, suppressions).
3. **Indiquer les impacts** sur le reste du système ou les autres modules.
4. **Attendre la validation** de l'utilisateur avant toute exécution si des décisions d'architecture sont requises.

---

# 11. Gestion des modules KOBA

Chaque module métier doit être **fonctionnellement indépendant et découplé** :
- **KOBA BUSINESS**
- **KOBA EDU**
- **KOBA HEALTH**
- **KOBA FINANCE**
- **KOBA RH**
- **KOBA HOTEL**
- **KOBA LOGISTICS**
- **KOBA INDUSTRY**
- **KOBA ADMIN**

Chaque module s'appuie obligatoirement sur les services partagés du **KOBA Core**.

---

# 12. KOBA CORE

Le noyau commun (KOBA Core) centralise et fournit les 13 services fondamentaux suivants :
1. **Authentification**
2. **Utilisateurs**
3. **Permissions**
4. **Entreprises**
5. **Filiales**
6. **Notifications**
7. **Documents (GED)**
8. **Workflow**
9. **Audit**
10. **Paramètres**
11. **Tableaux de bord**
12. **API (Gateway & Routage)**
13. **IA (Moteur Central & Copilotes)**

---

# 13. Tests obligatoires

Chaque module ou service développé doit s'accompagner de :
- **Tests unitaires** : Validation de la logique métier et des calculateurs.
- **Tests API** : Validation des endpoints, des codes HTTP et des DTOs.
- **Tests sécurité** : Validation du rejet d'accès sans token / mauvais tenant / permissions insuffisantes.
- **Tests frontend** : Validation de l'affichage des composants et des états de chargement / erreur.

---

# 14. Documentation obligatoire

Chaque module produit doit obligatoirement fournir et maintenir à jour 4 niveaux de documentation :
1. **Documentation fonctionnelle** : Description des cas d'usage et règles métier.
2. **Documentation technique** : Architecture du module, dépendances et choix techniques.
3. **Documentation API** : Spécification des endpoints, paramètres et réponses DTO (OpenAPI).
4. **Guide utilisateur** : Manuel d'utilisation de l'interface pour les utilisateurs finaux.
