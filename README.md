# Fidelio

App mobile pour scanner, ranger et retrouver tes cartes de fidélité — local-first, avec sync cloud prévue ensuite.

## Stack

- Expo + React Native + TypeScript
- Expo Router (tabs + stack)
- SQLite (`expo-sqlite`) comme source of truth locale
- Caméra / scan barcode (`expo-camera`) — natif + web (BarcodeDetector)
- Design bleu–mauve moderne, polices Outfit + DM Sans sur mobile

## Démarrer

```bash
npm install
npm start
```

Ouvre sur un **appareil physique** ou un simulateur (Expo Go / dev client).  
Le web sert de preview, pas de cible de perf.

## Perf mobile (cible réelle)

Lighthouse dans Chrome mesure le **bundle web Expo**, pas l’app téléphone.  
Pour Fidelio, la perf qui compte se mesure ainsi :

```bash
# Build de prod local
npx expo run:android --variant release
# ou
npx expo run:ios --configuration Release
```

Puis vérifier sur appareil :
- démarrage jusqu’à la liste de cartes fluide
- scroll liste sans saccades
- onglet Scan : caméra uniquement quand l’onglet est actif
- app en arrière-plan : pas de caméra qui tourne

Optimisations déjà en place :
- init SQLite après le premier paint (`InteractionManager`)
- tabs `lazy` + `freezeOnBlur`
- caméra démontée hors focus
- liste virtualisée (fenêtre / batch)
- tuiles mémoïsées
- React Compiler activé
- deps web-only / inutilisées retirées du bundle

## Architecture

```text
src/
  app/                 # écrans (Expo Router)
  components/          # UI + tabs + scan
  constants/           # thème
  data/
    local/             # SQLite repositories
    store/             # context React
  domain/              # types & règles métier
```

## Jalons

1. ~~Local core + ajout manuel~~
2. ~~Scan caméra (création rapide)~~
3. ~~Affichage barcode plein écran~~
4. Catégories + recherche
5. Auth + sync Supabase
