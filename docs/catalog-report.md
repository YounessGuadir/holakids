# Rapport du dataset

Nombre total exact : **460 produits** dans **22 catégories**.

| Catégorie | Produits |
|---|---:|
| LEGO & jeux de construction | 40 |
| Voitures & véhicules | 34 |
| Circuits | 22 |
| Poupées | 34 |
| Figurines | 28 |
| Jeux de société | 32 |
| Jeux éducatifs | 30 |
| Jeux scientifiques | 22 |
| Peluches | 24 |
| Jouets bébé & éveil | 34 |
| Puzzles | 22 |
| Dessin & activités créatives | 28 |
| Jeux d'extérieur | 13 |
| Ballons & sport | 10 |
| Vélos enfants | 16 |
| Trottinettes | 14 |
| Draisiennes | 9 |
| Tricycles | 7 |
| Voitures électriques enfants | 9 |
| Casques & protections | 6 |
| Accessoires vélos & trottinettes | 6 |
| Autres jouets populaires | 20 |
| **Total** | **460** |

Répartition demandée :

- jouets et jeux : 370 ;
- vélos, trottinettes, draisiennes, tricycles et voitures électriques : 55 ;
- plein air, sport, casques et accessoires : 35.

Le générateur se trouve dans `tools/generate-catalog-dataset.mjs`. L'import est idempotent grâce à `sku`, `slug` et `externalId`. Un redémarrage ne duplique pas les produits et n'écrase pas les prix/stock modifiés par l'administrateur.
