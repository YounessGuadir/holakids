# Déploiement HOLAKIDS sur Google Cloud Run + Supabase

Cette configuration garde le frontend sur GitHub Pages, publie Spring Boot sur
Google Cloud Run et utilise la base PostgreSQL Supabase déjà créée.

## 1. Récupérer les paramètres Supabase

Dans Supabase, ouvrir **Connect**, choisir **Session pooler**, puis noter :

- Host ;
- User (`postgres.PROJECT_REF`) ;
- mot de passe de la base ;
- port `5432` et base `postgres`.

Le backend construit lui-même l'URL JDBC sécurisée avec `sslmode=require`.

## 2. Déployer depuis Google Cloud Shell

Google Cloud demande un compte de facturation, même lorsque l'utilisation reste
dans le quota gratuit. Garder `min instances = 0` et `max instances = 1` limite
le risque de coût.

1. Créer un projet dans Google Cloud Console et ouvrir Cloud Shell.
2. Cloner le dépôt GitHub puis entrer dans le dossier :

   ```bash
   git clone https://github.com/YounessGuadir/holakids.git
   cd holakids
   ```

3. Exécuter :

   ```bash
   chmod +x deploy/google-cloud/deploy.sh
   ./deploy/google-cloud/deploy.sh
   ```

4. Le script demande le Project ID, le host/user/password Supabase et le mot de
   passe ADMIN. Pour ADMIN, utiliser l'adresse `AbdelatifMada@gmail.com` et le
   mot de passe privé choisi pour le propriétaire du magasin.

Le script affiche à la fin une URL proche de :

```text
https://holakids-api-xxxxx-ew.a.run.app
```

## 3. Vérifier le backend

Remplacer `BACKEND_URL` :

- `BACKEND_URL/api/v1/health` doit retourner `status: UP` ;
- `BACKEND_URL/api/v1/products?page=0&size=24` doit retourner les produits ;
- `BACKEND_URL/swagger-ui/index.html` ouvre Swagger.

Au premier démarrage, l'import des 460 produits peut prendre un peu de temps.
L'import est idempotent et ne duplique pas les produits aux redémarrages.

## 4. Relier GitHub Pages au backend

Dans GitHub :

1. ouvrir **Settings > Secrets and variables > Actions > Variables** ;
2. créer `VITE_API_URL` ;
3. valeur : `BACKEND_URL/api/v1` ;
4. ouvrir **Actions > Deploy HolaKids Frontend > Run workflow**.

Le CORS du backend autorise déjà l'origine
`https://younessguadir.github.io`. Il ne faut pas ajouter `/holakids/` dans
`CORS_ALLOWED_ORIGINS`, car une origine contient seulement le protocole et le
domaine.

## 5. Important pour les images ajoutées par ADMIN

Le disque de Cloud Run est temporaire. Les images déjà incluses dans le
frontend restent disponibles, mais un fichier téléversé dans `/tmp` peut être
perdu après un redémarrage. Pour des uploads permanents, utiliser ensuite un
bucket Supabase Storage ou Google Cloud Storage et enregistrer son URL dans le
produit.

## Dépannage rapide

- `status DOWN` : vérifier `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` dans Cloud Run.
- erreur PostgreSQL : utiliser le **Session pooler** (port 5432), pas l'URI brute.
- erreur CORS : garder exactement `https://younessguadir.github.io`.
- frontend sans produits : vérifier la variable GitHub `VITE_API_URL`, puis
  relancer le workflow Pages.
- ADMIN ne se connecte pas après une ancienne création : supprimer ou modifier
  cet utilisateur dans PostgreSQL, car le seeder ne remplace pas le mot de passe
  d'un compte déjà existant.
