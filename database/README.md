# 🗄️ KOBA ERP Cloud — Module Base de Données

Ce dossier contient la configuration, les schémas ORM, les diagrammes d'architecture et les migrations de la base de données PostgreSQL de **KOBA ERP Cloud**.

---

## 📂 Structure du Dossier

```text
database/
├── diagrams/     # Schemas et diagrammes entity-relationship (ERD)
├── prisma/       # Schéma Prisma officiel (schema.prisma) et seeders
├── migrations/   # Migrations SQL versionnées générées par Prisma
└── README.md     # Documentation du module base de données
```

---

## 📌 Normes de Modélisation BDD
- Toutes les tables métiers doivent intégrer l'isolation Multi-Tenant (`tenant_id`, `company_id`).
- La référence d'architecture est disponible dans [`docs/DATABASE_ARCHITECTURE.md`](file:///d:/PROGRAMATION/Application%20web/Koba%20projet%20vrai/docs/DATABASE_ARCHITECTURE.md).
