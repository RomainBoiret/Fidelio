# Fidelio

Mobile app to scan, store, and find your loyalty cards - local-first, with cloud sync planned next.

## Stack

- Expo + React Native + TypeScript
- Expo Router (tabs + stack)
- SQLite (`expo-sqlite`) as the local source of truth
- Camera / barcode scan (`expo-camera`) - native + web (BarcodeDetector)
- Ticket-wallet identity (perforated cards, scan motifs), Plus Jakarta Sans

## Get started

```bash
npm install
npm start
```

Open on a **physical device** or a simulator (Expo Go / dev client).  
Web is for preview, not a performance target.

## Mobile perf (real target)

Lighthouse in Chrome measures the **Expo web bundle**, not the phone app.  
For Fidelio, the perf that matters is measured like this:

```bash
# Local release build
npx expo run:android --variant release
# or
npx expo run:ios --configuration Release
```

Then check on device:
- startup until the cards list feels smooth
- list scroll without jank
- Scan tab: camera only while the tab is active
- app in background: camera not running

Optimizations already in place:
- SQLite init after first paint (`InteractionManager`)
- lazy tabs + `freezeOnBlur`
- camera unmounted off focus
- virtualized list (window / batch)
- memoized tiles
- React Compiler enabled
- unused / web-only deps removed from the bundle

## Architecture

```text
src/
  app/                 # screens (Expo Router)
  components/          # UI + tabs + scan
  constants/           # theme
  data/
    local/             # SQLite repositories
    store/             # React context
  domain/              # types & business rules
```

## Roadmap

1. ~~Local core + manual add~~
2. ~~Camera scan (quick create)~~
3. ~~Fullscreen barcode display~~
4. ~~Search on cards list~~
5. Categories
6. Auth + Supabase sync
