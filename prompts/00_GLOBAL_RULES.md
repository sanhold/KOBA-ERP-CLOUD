# 📜 00 - RÈGLES GLOBALES DU PROJET (GLOBAL RULES)

> **IMPORTANT** : Ce document constitue la charte suprême du projet **KOBA ERP Cloud**. Toutes les tâches, propositions d'architecture, lignes de code et modifications apportées par l'assistant IA (Gemini) doivent se conformer **strictement** aux règles ci-dessous.

---

## 🏛️ 1. Respect Inflexible de la Documentation Officielle
- **Source de Vérité Unique** : La documentation située dans le dossier `docs/` fait foi. Aucune architecture, technologie ou convention non validée dans ces documents ne doit être introduite.
- **Vérification Systématique** : Avant d'écrire du code ou de proposer un plan d'action, vérifier la cohérence avec les fichiers de référence (`01_Vision.md` à `14_Roadmap.md`).
- **Pas d'Invention d'Architecture** : Ne jamais improviser de modèle de données, de schéma d'API ou de pattern d'architecture alternatif sans approbation explicite du lead utilisateur.

---

## 🔐 2. Isolation Multi-Tenant & Sécurité Stricte
- **Multi-Tenancy** : Tout appel d'API, requête en base de données, cache ou tâche d'arrière-plan doit obligatoirement inclure et valider le contexte du `Tenant` (Tenant Isolation).
- **Zéro Fuite Inter-Tenant** : Il est formellement interdit d'exécuter des requêtes globales non scopées par Tenant, sauf sur la base d'administration système/SaaS centrale.
- **Sécurité & RBAC** : Vérifier les permissions et les rôles sur chaque endpoint et action. Ne jamais contourner le contrôle d'accès.
- **Traçabilité & Audit** : Chaque mutation sensible doit être traçable via les logs d'audit (User ID, Tenant ID, Action, Timestamp, IP).

---

## 🛠️ 3. Qualité du Code & Bonnes Pratiques ERP
- **Code Propre & Typé** : Utiliser un typage strict (TypeScript / DTOs / Schemas de validation).
- **Absence de "Patcher les Symptômes"** : En cas d'erreur ou de bug, identifier et corriger la cause racine (Root Cause Analysis). Ne pas masquer les exceptions ou renvoyer de fausses valeurs de secours.
- **Pas de Stubs/Placeholders non documentés** : Produire du code complet et fonctionnel pour chaque fonctionnalité engagée.

---

## 🎨 4. Design System & Expérience Utilisateur (Frontend)
- **Fidélité au Design System** : Suivre `docs/13_DesignSystem.md`. Utiliser une typographie moderne, une palette de couleurs harmonieuse, et des micro-animations fluides.
- **Expérience Enterprise SaaS** : L'interface doit être réactive, élégante, claire et intuitive avec une esthétique haut de gamme.
- **Accessibilité & Réactivité** : Interfaces 100% responsive et accessibles.

---

## 🧪 5. Validation & Vérification Obligatoire
- **Preuve Empirique** : Ne jamais déclarer un développement comme "terminé" sans avoir exécuté la compilation/build et les tests pour prouver la réussite fonctionnelle.
- **Tests Systématiques** : Chaque nouveau service ou composant critique doit comporter sa suite de tests (Unitaires / Intégration).

---

## 📝 6. Mises à Jour de la Documentation
- Toute évolution ou nouvelle décision validée doit être reportée dans le fichier `CHANGELOG.md` et dans le document `docs/` approprié.
