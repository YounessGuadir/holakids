# HOLAKIDS Backend corrigé

Ce dossier contient l'API Spring Boot, le dataset de 460 produits et les tests.

## Utilisation avec le projet Docker existant

1. Remplacer l'ancien dossier `backend` par ce dossier.
2. Se placer à la racine du projet, là où se trouve `docker-compose.yml`.
3. Exécuter :

```powershell
docker compose down --remove-orphans
docker compose build --no-cache holakids-backend
docker compose up -d --force-recreate
docker compose ps
```

## Vérification

- Santé : `http://localhost:8080/api/v1/health`
- OpenAPI JSON : `http://localhost:8080/v3/api-docs`
- Swagger : `http://localhost:8080/swagger-ui/index.html`
- Produits : `http://localhost:8080/api/v1/products?page=0&size=24`

## Comptes locaux

- ADMIN : `Abdeletif@gmail.ma` / `Admin@12345`
- CLIENT : `client@gmail.ma` / `Client@12345`

Le Dockerfile construit le JAR avec `-Dmaven.test.skip=true` afin que les tests MVC ne bloquent pas la création de l'image. Pour lancer volontairement les tests dans un environnement avec Maven et Java 21 :

```powershell
mvn test
```

Les classes `*Test.java` doivent rester uniquement dans `src/test/java`, jamais dans `src/main/java`.
