# Tests Postman

1. Importer `postman/HOLAKIDS_API.postman_collection.json`.
2. Importer `postman/HOLAKIDS_LOCAL.postman_environment.json`.
3. Choisir l'environnement **HOLAKIDS Local**.
4. Lancer le dossier **Authentification** : l'inscription utilise un e-mail unique et les deux connexions enregistrent automatiquement les JWT.
5. Lancer le dossier **Catalogue public** : les requêtes enregistrent automatiquement un produit et une catégorie valides, puis lancer **Administration**.
6. Terminer par **Sécurité — CLIENT interdit sur ADMIN** : le résultat attendu est `403 Forbidden`.

Les requêtes d'ajout enregistrent automatiquement `createdProductId`, utilisé ensuite par PUT, PATCH et DELETE.
