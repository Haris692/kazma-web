# kazma-web

L'application de statistiques de Kazma SC, consultable par le club.

**Le site ne contient que des chiffres calculés.** Les XML du fournisseur ne sont
jamais publiés : ils restent sur le PC, dans `kazma-bdd`. Personne d'autre ne peut
alimenter le site — il faut un accès en écriture à ce dépôt.

## Publier un match

1. Déposer le dossier du match dans `Downloads` (les fichiers XML du fournisseur).
2. Charger et publier :

```bash
cd ../kazma-bdd
python charge_instat.py      # les XML entrent dans kazma.db
python publie.py --push      # kazma.db -> JSON -> GitHub Pages
```

Le site est à jour une minute plus tard.

## Ce qu'il y a dedans

```
index.html      la coquille
app.js          les vues et le routage (aucune dépendance)
style.css       le thème sombre
crest.png       le blason
data/           les JSON produits par publie.py — ne pas éditer à la main
```

Tout est statique : le navigateur télécharge des fichiers, il n'écrit nulle part.
C'est ce qui rend le site sûr par construction — il n'y a pas de formulaire, pas
de base accessible, rien à pirater.

## Navigation

| Adresse | Contenu |
|---|---|
| `#/` | Vue d'ensemble : cumuls de la saison, liste des matchs, tableau des joueurs |
| `#/match/<id>` | Un match : statistiques comparées, tirs, passes progressives, schéma de passes, dernier tiers, joueurs |
| `#/joueur/<numéro>` | Une fiche : cumuls, position médiane par match, détail match par match |

## À savoir sur les données

- **« Passe progressive »** est la classification du fournisseur. Les catégories
  sont emboîtées — progressives ⊂ vers l'avant ⊂ passes — elles ne s'additionnent
  jamais.
- **Le schéma de passes est reconstruit.** Le fournisseur ne donne pas le
  destinataire : on prend le joueur suivant à toucher le ballon dans la même
  possession. La couverture réelle est affichée sur chaque page de match.
- **Aucune flèche de passe.** Le fournisseur donne une seule coordonnée par
  action, jamais la destination du ballon.
- **Le détail par joueur ne couvre que Kazma**, l'adversaire est au niveau équipe.

## Accès

Le site est public mais non référencé (`noindex`). Pour le restreindre vraiment,
il faudra soit un dépôt privé avec GitHub Pages (compte payant), soit un
hébergeur avec contrôle d'accès.
