# 08 - Sécurité, Authentification & Autorisations

## 📌 Vue d'Ensemble
Document décrivant la stratégie de sécurité entreprise, le modèle d'authentification (JWT + Refresh Token), le contrôle d'accès (RBAC/ABAC) et les logs d'audit.

---

## 🔑 Authentification & Tokens
- **Access Token** : JWT court (ex: 15min) transmis via en-tête Authorization Bearer.
- **Refresh Token** : Token sécurisé (HTTP-Only Cookie / Redis Session Store) pour le renouvellement sans réauthentification.
- **Multi-Tenant Claims** : Ingestion de l'identifiant Tenant (`tenant_id`) et du rôle utilisateur dans la charge utile du JWT.

---

## 🛡️ Autorisations et Matrice de Rôles (RBAC / ABAC)
*(En attente des spécifications officielles)*


---

## 🔒 Conformité & Traçabilité (Audit Logs, RGPD)
*(En attente des spécifications officielles)*
