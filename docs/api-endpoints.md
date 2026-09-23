# Endpoints REST

URL locale : `http://localhost:8080/api/v1`

Les mêmes routes principales existent aussi sans `/v1` pour compatibilité, par exemple `/api/products`.

## Public / client

| Méthode | Route | Fonction |
|---|---|---|
| POST | `/auth/register` | Créer un compte CLIENT |
| POST | `/auth/login` | Se connecter et recevoir un JWT |
| GET | `/auth/me` | Profil connecté |
| GET | `/products` | Catalogue paginé et filtré |
| GET | `/products/{id-ou-slug}` | Détail produit |
| GET | `/products/search?q=...` | Recherche paginée |
| GET | `/products/category/{categoryId}` | Produits d'une catégorie |
| GET | `/products/featured` | Produits mis en avant |
| GET | `/products/popular` | Produits populaires |
| GET | `/products/promotions` | Promotions |
| GET | `/products/{slug}/related` | Produits similaires |
| GET | `/products/meta` | Marques et tranches d'âge |
| GET | `/categories` | Catégories actives |
| GET | `/files/{filename}` | Image téléversée |

Paramètres de `GET /products` : `search`, `category`, `age`, `brand`, `promotion`, `newProduct`, `featured`, `available`, `maxPrice`, `page`, `size`, `sort`.

## ADMIN — JWT avec rôle ADMIN obligatoire

| Méthode | Route | Fonction |
|---|---|---|
| GET | `/admin/products` | Catalogue complet, y compris inactifs |
| GET | `/admin/products/{id}` | Détail administration |
| POST | `/admin/products` | Ajouter |
| PUT | `/admin/products/{id}` | Modifier |
| PATCH | `/admin/products/{id}/stock` | Modifier le stock |
| PATCH | `/admin/products/{id}/price` | Modifier prix/promotion |
| PATCH | `/admin/products/{id}/availability` | Activer/désactiver |
| DELETE | `/admin/products/{id}` | Supprimer |
| GET | `/admin/categories` | Toutes les catégories |
| POST | `/admin/categories` | Ajouter une catégorie |
| PUT | `/admin/categories/{id}` | Modifier une catégorie |
| DELETE | `/admin/categories/{id}` | Désactiver une catégorie |
| POST | `/admin/files` | Téléverser JPG/PNG/WEBP |

Swagger : `http://localhost:8080/swagger-ui.html`.
