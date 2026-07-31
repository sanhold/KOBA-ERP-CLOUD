# 📜 CHARTE DU PROJET — KOBA ERP CLOUD (PROJECT CHARTER)

> **Document de Référence Suprême / Constitution du Projet**  
> **Plateforme** : KOBA ERP Cloud  
> **Rôle** : Architecte Logiciel Principal  
> **Version** : 1.0.0  
> **Statut** : Approuvé & Verrouillé  

---

# Présentation du projet

**KOBA ERP Cloud** est une plateforme SaaS ERP multi-tenant de niveau entreprise, conçue spécifiquement pour répondre aux exigences stratégiques, opérationnelles et réglementaires des entreprises, institutions et organisations africaines et internationales. 

La vision de KOBA ERP Cloud repose sur un paradigme de **Moteur Commun (Core Engine)** réutilisable et d'un écosystème modulaire verticalisé. KOBA offre une expérience utilisateur haut de gamme, une étanchéité absolue des données multi-tenant, une scalabilité sans friction et un niveau d'intégration technologique digne des standards mondiaux les plus élevés.

---

# Mission

Créer **le meilleur ERP Cloud africain**, une référence continentale et internationale combinant puissance fonctionnelle, flexibilité modulaire, souveraineté des données, intelligence artificielle native et simplicité d'utilisation pour stimuler la croissance et l'efficacité opérationnelle des organisations.

---

# Objectifs

1. **Architecture Moderne** : Conception fondée sur des normes logicielles d'avant-garde, garantissant pérennité et agilité.
2. **Cloud Native** : Conçu pour s'exécuter dans des environnements conteneurisés et orchestrés de manière transparente.
3. **Multi-tenant** : Isolation absolue et étanche des données, configurations et sessions de chaque entreprise (Tenant).
4. **Haute Disponibilité** : Infrastructure résiliente avec tolérance aux pannes et taux de disponibilité cible de 99.99%.
5. **Sécurité** : Protection de bout en bout (Zero-Trust, chiffrement, RBAC/ABAC, traçabilité immuable).
6. **Performance** : Temps de réponse optimisés avec stratégie de mise en cache distribuée et requêtes SQL hautement indexées.
7. **Scalabilité** : Capacité de montée en charge horizontale automatique (Auto-scaling BDD, API et Microservices).
8. **Maintenance Simple** : Découplage strict des modules permettant des déploiements et des mises à jour sans interruption de service.
9. **Documentation Complète** : Traçabilité exhaustive de la vision, de l'architecture, du code, des API et des procédures opérationnelles.

---

# Produits

L'écosystème KOBA ERP Cloud est composé de **9 modules métiers spécialisés** greffés sur le Moteur Commun :

1. **KOBA BUSINESS** : Commercial, Ventes, Devis, Facturation, Clients & Gestion de la Relation Client (CRM).
2. **KOBA EDU** : Gestion des Établissements Scolaires et Universitaires, Inscriptions, Emplois du Temps, Notes & Scolarité.
3. **KOBA HEALTH** : Gestion des Hôpitaux, Cliniques & Centres de Santé, Dossiers Patients, Prescriptions & Soins.
4. **KOBA FINANCE** : Comptabilité Générale, Analytique, Auxiliary, Trésorerie, Rapprochements Bancaires & Budgets.
5. **KOBA RH** : Ressources Humaines, Gestion des Talents, Paie, Congés, Recrutements & Compétences.
6. **KOBA HOTEL** : Gestion Hôtelière, Réservations, Check-in/Check-out, Planning des Chambres & Room Service.
7. **KOBA LOGISTICS** : Chaîne d'Approvisionnement (Supply Chain), Gestion des Stocks Multi-entrepôts, Achats & Livraisons.
8. **KOBA INDUSTRY** : Gestion de la Production Industrielle (GPAO), Nomenclatures (BOM), Ordres de Fabrication & Qualité.
9. **KOBA ADMIN** : Administration Centrale SaaS, Provisionnement des Tenants, Suivi des Abonnements & Facturation SaaS.

---

# Technologies

| Domaine | Technologie Sélectionnée | Description & Usage |
| :--- | :--- | :--- |
| **Frontend** | **Next.js + React + TypeScript** | Framework React full-stack avec Server Components, SSR/SSG et typage strict. |
| **Backend** | **NestJS + TypeScript** | Framework Node.js d'entreprise modulaire, structuré et orienté injections de dépendances. |
| **Database** | **PostgreSQL + Prisma ORM** | SGBD relationnel robuste avec ORM type-safe pour la gestion de l'isolation multi-tenant. |
| **Cache** | **Redis** | In-memory Data Store pour la gestion de session, le cache de requêtes et le Rate Limiting. |
| **Storage** | **MinIO (S3 Compatible)** | Stockage d'objets haute performance pour la Gestion Électronique de Documents (GED). |
| **Conteneurisation** | **Docker & Docker Compose** | Environnements de développement et de staging isolés et réplicables. |
| **Orchestration** | **Kubernetes (K8s)** | Orchestration Cloud Native pour la production, l'auto-scaling et la haute disponibilité. |
| **CI/CD** | **GitHub Actions** | Pipelines d'intégration et de déploiement continus automatisés. |

---

# Principes d'architecture

- **Clean Architecture** : Séparation stricte des responsabilités entre la couche Domaine, Application, Infrastructure et Présentation.
- **SOLID** : Application rigoureuse des 5 principes de conception orientée objet (Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion).
- **DDD (Domain-Driven Design)** : Modélisation pilotée par le domaine métier et ubiquité du langage entre experts métiers et développeurs.
- **Modular Monolith évolutif vers Microservices** : Architecture initiale en monolithe modulaire hautement découplé dans NestJS, facilitant l'extraction future de microservices autonomes sans réécriture du code métier.
- **API First** : Conception des contrats d'API (REST / OpenAPI) en amont du développement des interfaces clients.
- **Event Driven** : Moteur événementiel (Event Emitter / Redis PubSub) pour la communication asynchrone entre modules et la réactivité des workflows.
- **Multi-Tenant** : Isolation étanche du contexte entreprise sur chaque transaction, requête BDD, session de cache et tâche d'arrière-plan.

---

# Qualité

- **Code Lisible** : Code auto-documenté, concis, expressif et conforme aux standards ESLint et Prettier.
- **Code Documenté** : Commentaires JSDoc/TSDoc sur l'ensemble des méthodes publiques, services, interfaces et DTOs.
- **Tests Unitaires** : Couverture par tests unitaires (Jest) sur l'ensemble des services métiers et calculateurs.
- **Tests d'Intégration** : Validation automatisée des flux BDD, des middlewares multi-tenant et des contrôleurs API.
- **Convention de Nommage** : Respect des règles de nommage standardisées (`kebab-case` pour fichiers/dossiers, `PascalCase` pour classes/interfaces, `camelCase` pour variables/méthodes, `snake_case` pour la BDD).
- **Revue de Code** : Validation systématique de toute modification par revue de code (Pull Request) avant fusion sur la branche `main`.

---

# Sécurité

- **JWT + Refresh Token** : Authentification stateless avec Access Tokens courts et Refresh Tokens sécurisés.
- **RBAC / ABAC** : Contrôle d'accès basé sur les rôles et les attributs du Tenant, de la Filiale et de la ressource.
- **Audit** : Journalisation d'audit immuable de toutes les actions, accès et mutations de données sensibles.
- **Logs** : Traçabilité centralisée des logs structurés (JSON) intégrant `tenant_id`, `user_id` et `correlation_id`.
- **Permissions** : Matrice fine de droits d'accès évaluée sur chaque endpoint via des Guards NestJS.
- **Chiffrement** : Chiffrement des données en transit (TLS 1.3) et au repos (AES-256 pour les données sensibles et BDD).
- **Sauvegardes** : Stratégie de sauvegarde automatisée, chiffrée, multi-régions avec plan de reprise d'activité (PRA).

---

# Performance

- **Redis** : Cache de deuxième niveau pour les requêtes fréquemment consultées et les sessions utilisateurs.
- **Optimisation SQL** : Analyse systématique des plans d'exécution, suppression des requêtes N+1 via Prisma et vues optimisées.
- **Lazy Loading** : Chargement différé des composants frontend et des relations de données non immédiates.
- **Pagination** : Pagination obligatoire (Cursor-based ou Offset-based) sur l'ensemble des listes et tableaux de données API.
- **Indexation** : Indexation stratégique des clés étrangères, des colonnes `tenant_id`, des dates et des champs de recherche.

---

# Documentation

Toute fonctionnalité, service, module, API ou schéma de données **doit impérativement être documenté** avant d'être considéré comme achevé. La documentation située dans `docs/` est la référence vivante du projet.

---

# IA

Toutes les fonctionnalités et données de KOBA ERP Cloud devront être **compatibles avec un Moteur IA Central** (Copilotes métiers, assistants conversationnels, analyse prédictive, RAG et automatisation des workflows) tout en garantissant l'étanchéité stricte des données de chaque Tenant.

---

# Évolution

Le projet est conçu pour être **évolutif et extensible à l'infini**. L'architecture permet l'ajout de nouveaux modules métiers, d'intégrations tierces et de fonctionnalités personnalisées par Tenant **sans modification majeure de l'architecture existante ni régression du Moteur Commun**.
