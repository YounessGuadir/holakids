# HOLAKIDS — E-commerce de jouets

Application full-stack bilingue **Français / Arabe** pour un magasin familial de jouets : React, Spring Boot, PostgreSQL, JWT et Docker Compose.

Le design actuel est conservé. Le catalogue n'est plus défini dans React : **460 produits** sont importés depuis `backend/src/main/resources/datasets/products.json`, enregistrés dans PostgreSQL puis servis par l'API REST.

## Fonctionnalités

### Catalogue client

- 460 produits et 22 catégories ;
- pagination serveur (24 produits par page) ;
- recherche, catégorie, marque, âge, prix, disponibilité et promotions ;
- tris recommandé, populaire, nouveauté et prix ;
- page produit avec galerie, ancien prix, remise, stock, note, attributs et similaires ;
- images avec fallback automatique ;
- contact WhatsApp, sans paiement en ligne ;
- interface responsive et RTL en arabe.

### Authentification

- inscription CLIENT ;
- connexion ADMIN/CLIENT ;
- JWT stateless avec mot de passe BCrypt ;
- endpoints `/admin/**` protégés par le rôle `ADMIN` ;
- un CLIENT reçoit `403 Forbidden` sur les routes ADMIN.

### Administration

- tableau de bord avec total, disponibles et ruptures ;
- recherche et filtre du catalogue complet ;
- CRUD produits ;
- prix, promotions, stock, activation/désactivation ;
- galerie multi-images et téléversement JPG/PNG/WEBP ;
- CRUD catégories ;
- changements persistés dans PostgreSQL.

### Import dataset

Pipeline :

```text
products.json → DatasetImportService → validation/nettoyage
              → ProductImportService → PostgreSQL → API REST → React
```

L'import est idempotent : `sku`, `slug` et `externalId` empêchent les doublons. Les produits déjà présents ne sont pas écrasés, donc les prix et stocks modifiés par l'administrateur restent permanents.

La taxonomie des catégories s'inspire de la **Shopify Standard Product Taxonomy** (MIT). Les fiches, descriptions, marques de démonstration et visuels HOLAKIDS sont originaux ; aucun catalogue Smyths/Amazon n'est copié.

## Lancement complet avec Docker

Prérequis : Docker Desktop avec Docker Compose, ports `3000`, `8080` et `5432` disponibles.

Pour obtenir exactement le nouveau dataset de 460 produits, supprimer l'ancien volume de démonstration une fois :

```bash
docker compose down -v
docker compose up --build --force-recreate
```

Puis ouvrir :

- frontend : <http://localhost:3000>
- Swagger : <http://localhost:8080/swagger-ui.html>
- health : <http://localhost:8080/api/v1/health>

Aux prochains lancements :

```bash
docker compose up --build
```

Les volumes `holakids-postgres-data` et `holakids-uploads` conservent la base et les images téléversées.

## Comptes de test

| Rôle | E-mail | Mot de passe |
|---|---|---|
| ADMIN | `AbdelatifMada@gmail.com` | défini par `ADMIN_PASSWORD` |
| CLIENT | `client@holakids.ma` | `Client@12345` |

Ces identifiants sont réservés au développement local. Modifiez-les dans `.env` avant un déploiement réel.

## Développement local

Backend (JDK 21 + Maven) :

```bash
cd backend
mvn spring-boot:run
```

Frontend (Node 22) :

```bash
cd frontend
npm ci
npm run dev
```

Le proxy Vite envoie `/api` vers `http://localhost:8080`.

Pour le backend hors Docker, PostgreSQL doit déjà fonctionner et les variables `DB_URL`, `DB_USERNAME` et `DB_PASSWORD` doivent être définies dans le terminal. Le fichier `.env` est lu automatiquement par Docker Compose, pas par la commande Maven seule.

## Dépannage Docker Desktop

Depuis le dossier racine, reconstruire PostgreSQL et l'API avec :

```bash
docker compose down -v --remove-orphans
docker compose pull holakids-postgres
docker compose up --build --force-recreate
```

## Tests

```bash
cd backend
mvn test

cd ../frontend
npm run build
```

Tests manuels : importer les deux fichiers du dossier `postman/`. L'ordre conseillé est décrit dans `docs/postman-guide.md`.

## Documentation

- diagramme de classes : `docs/class-diagram.md` ;
- schéma PostgreSQL : `docs/database-schema.md` ;
- endpoints : `docs/api-endpoints.md` ;
- compte exact par catégorie : `docs/catalog-report.md` ;
- tests Postman : `docs/postman-guide.md` ;
- Swagger interactif : `/swagger-ui.html`.

## Structure principale

```text
holakids/
├── backend/
│   └── src/main/
│       ├── java/ma/holakids/
│       │   ├── auth/
│       │   ├── catalog/
│       │   ├── importer/
│       │   ├── security/
│       │   └── user/
│       └── resources/datasets/products.json
├── database/
├── docs/
├── frontend/
├── postman/
├── tools/generate-catalog-dataset.mjs
└── docker-compose.yml
```

## Régénérer le dataset

```bash
node tools/generate-catalog-dataset.mjs
```

Le script vérifie automatiquement que le résultat contient exactement 460 produits.

## Déploiement gratuit

Le guide prêt pour **Google Cloud Run + Supabase PostgreSQL + GitHub Pages** est
dans `deploy/google-cloud/README.md`. Les mots de passe restent dans les
variables Cloud Run et ne doivent jamais être publiés dans GitHub.
