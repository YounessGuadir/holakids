# Dataset HOLAKIDS

`products.json` contient 460 fiches produit originales, bilingues et déterministes.

- Les libellés de catégories s’inspirent de la Shopify Standard Product Taxonomy, publiée sous licence MIT.
- Les noms, descriptions, SKU, prix de démonstration et marques fictives ont été créés pour HOLAKIDS. Ils ne sont pas extraits de Smyths Toys, Amazon ou d’un autre marchand.
- Les visuels locaux sont des créations originales HOLAKIDS ou une image de remplacement. Aucun visuel marchand n’est copié.
- Les prix et stocks sont des valeurs de démonstration. L’administrateur peut les remplacer ; l’import idempotent ne les écrase pas au redémarrage.

Pour régénérer le fichier :

```bash
node tools/generate-catalog-dataset.mjs
```

Source de taxonomie : https://github.com/Shopify/product-taxonomy

Licence : https://github.com/Shopify/product-taxonomy/blob/main/LICENSE
