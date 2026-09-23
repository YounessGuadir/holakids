# Schéma SQL Server

```mermaid
erDiagram
  APP_USERS {
    bigint id PK
    varchar full_name
    varchar email UK
    varchar password
    varchar role
    bit enabled
    datetime2 created_at
    datetime2 updated_at
  }

  CATEGORIES {
    bigint id PK
    varchar slug UK
    varchar name_fr
    nvarchar name_ar
    varchar image_url
    int display_order
    bit active
  }

  PRODUCTS {
    bigint id PK
    varchar external_id
    varchar sku UK
    varchar slug UK
    bigint category_id FK
    varchar name_fr
    nvarchar name_ar
    decimal price
    decimal old_price
    int stock
    decimal rating
    int review_count
    bit active
  }

  PRODUCT_IMAGES {
    bigint id PK
    bigint product_id FK
    varchar url
    varchar alt_fr
    nvarchar alt_ar
    int position
  }

  PRODUCT_FEATURES {
    bigint id PK
    bigint product_id FK
    varchar text_fr
    nvarchar text_ar
    int position
  }

  PRODUCT_ATTRIBUTES {
    bigint id PK
    bigint product_id FK
    varchar name
    varchar value_fr
    nvarchar value_ar
    int position
  }

  CATEGORIES ||--o{ PRODUCTS : contient
  PRODUCTS ||--|{ PRODUCT_IMAGES : illustre
  PRODUCTS ||--o{ PRODUCT_FEATURES : décrit
  PRODUCTS ||--o{ PRODUCT_ATTRIBUTES : caractérise
```

Hibernate crée et met à jour ce schéma avec `spring.jpa.hibernate.ddl-auto=update`. Pour repartir sur un catalogue propre de 460 produits :

`external_id` est facultatif. Son unicité, lorsqu'il est renseigné, est contrôlée par le service d'import et le service produit ; `sku` et `slug` restent les clés uniques obligatoires en base.

```bash
docker compose down -v
docker compose up --build
```
