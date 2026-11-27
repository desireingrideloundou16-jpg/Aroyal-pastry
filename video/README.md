# Film ARoyal Pastry (Remotion)

Film de présentation d'environ 1 min 15, avec voix off féminine, en deux formats :
`img/film-16x9.mp4` (ordinateur) et `img/film-4x5.mp4` (mobile).

## Modifier le film

```bash
cd video
npm install
npm run dev          # aperçu dans Remotion Studio
```

- Scènes : `src/Scenes.tsx` · montage, durées et transitions : `src/RoyalFilm.tsx` · style : `src/kit.tsx`
- Photos : `public/img/` (copies de `../img/`)

## Régénérer les sons

```bash
# Voix off (voix neuronale Microsoft « Vivienne »), texte dans scripts/voix.mjs
npm i --no-save msedge-tts@2
node scripts/voix.mjs public/voice fr-FR-VivienneMultilingualNeural

# Musique de fond originale synthétisée (libre de droits)
node scripts/musique.mjs public/music.wav 78
```

Si le texte de la voix off change, adapter les durées `dur` des scènes dans `src/RoyalFilm.tsx`
(durée de la voix en secondes × 30 + environ 32 images).

## Rendre les vidéos du site

```bash
node scripts/render.mjs   # écrit ../img/film-16x9.mp4, film-4x5.mp4 et leurs affiches .jpg
```

Licence : Remotion est gratuit pour les entreprises de 3 personnes maximum.
