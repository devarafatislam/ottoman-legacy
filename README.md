# Ottoman Legacy — ৩৬ জন সুলতান, এক সাম্রাজ্য

**A cinematic Bengali documentary about the Ottoman Empire — 36 sultans, 623 years, one legacy.**

Built entirely in code with [Remotion](https://www.remotion.dev/) · Full HD · Voice-synced subtitles · Animated maps & portraits

---

## Watch the film

<video src="out/ottoman-legacy.mp4" width="100%" controls playsinline>
  Your browser does not support the video tag.
</video>

> **Output file:** [`out/ottoman-legacy.mp4`](out/ottoman-legacy.mp4)  
> If the player above doesn't load (e.g. on GitHub), open the file locally after render, or download it from the repo.

```bash
# Generate the full film
npm run render
# → writes out/ottoman-legacy.mp4
```

---

## What is this project?

**Ottoman Legacy** is a **programmatic documentary** — a full-length history film made as a React + Remotion composition, not edited in Premiere or After Effects.

It tells the story of the **Ottoman Empire (c. 1299 – 1922)** in **Bengali narration**, covering all **36 unique sultans** from Osman I to Mehmed VI. Visuals are driven frame-by-frame by the voice-over and subtitle cues: when the narrator names a ruler, that sultan's portrait, reign years, and map stage appear in sync.

| | |
|---|---|
| **Language** | বাংলা (Bengali narration + subtitles) |
| **Subject** | Ottoman Empire · 36 Sultans · 1299–1922 |
| **Format** | 1920×1080 · 30 fps · H.264 + AAC |
| **Runtime** | ~ voice-over length (duration read from `voice_over.mp3`) |
| **Engine** | [Remotion 4](https://www.remotion.dev/) + React 18 |
| **Style** | Emerald / navy / gold cinematic grade, film grain, vignette, chapter cards |

---

## Story chapters (10 scenes)

| # | ID | Chapter | Era |
|---|----|---------|-----|
| ১ | **A** | সূচনা — Opening | — |
| ২ | **B** | প্রতিষ্ঠাতা রাজবংশ — Founding dynasty | ১২৯৯ – ১৪০২ |
| ৩ | **C** | ইন্টাররেগনাম — Interregnum | ১৪০২ – ১৪১৩ |
| ৪ | **D** | কনস্টান্টিনোপল ও সম্প্রসারণ — Constantinople & expansion | ১৪১৩ – ১৫২০ |
| ৫ | **E** | সাম্রাজ্যের শিখর — Apex of empire | ১৫২০ – ১৬০৩ |
| ৬ | **F** | সপ্তদশ শতাব্দীর অস্থিরতা — 17th-century unrest | ১৬০৩ – ১৭০৩ |
| ৭ | **G** | অষ্টাদশ শতাব্দী — 18th century | ১৭০৩ – ১৭৮৯ |
| ৮ | **H** | সংস্কার ও রূপান্তর — Reform & transformation | ১৭৮৯ – ১৯০৯ |
| ৯ | **I** | শেষ সুলতানরা — The last sultans | ১৯০৯ – ১৯২২ |
| ১০ | **J** | উত্তরাধিকার — Legacy | ৩৬ জন সুলতান · এক উত্তরাধিকার |

Scene boundaries are pinned to **SRT cue numbers** so picture always follows speech.

---

## Features

- **36 sultan identities** with reign segments, Bengali/English names, aliases, and father links (`src/data/sultans.js`)
- **Portrait cards** for every ruler (`public/portraits/`)
- **Animated world map stages** (d3-geo + topojson / world-atlas) showing empire growth
- **Succession tree** and **century layouts** for dynasty overview
- **Top timeline** scrubbing years as narration names rulers and events
- **Bengali subtitles** from aligned SRT, rendered in-composition
- **Voice-over bed** + cinematic SFX (whoosh, impact, paper, drone)
- **Chapter cards**, gold diagonal wipes, camera shake on impacts, light leaks, grain & vignette
- **Data validation & A/V sync checks** (`npm run validate`, `npm run check:sync`)

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Video framework | Remotion 4 |
| UI | React 18 |
| Maps | `d3-geo`, `topojson-client`, `world-atlas` |
| Fonts | Cinzel, Cormorant Garamond, Noto Sans/Serif Bengali |
| Audio | `voice_over.mp3` + `public/audio/*` |
| Subtitles | SRT (aligned via Python script) |
| Render | H.264 / CRF 17 / AAC |

---

## Quick start

### Requirements

- **Node.js** 18+
- **npm**
- Optional: **Python 3** (only for subtitle alignment)

### Install

```bash
npm install
```

### Remotion Studio (live preview)

```bash
npm run studio
```

Opens the Remotion editor so you can scrub scenes, inspect sequences, and preview before a full render.

### Preview render (first ~15 s)

```bash
npm run preview
# → out/preview.mp4  (frames 0–449)
```

### Full documentary render

```bash
npm run render
# → out/ottoman-legacy.mp4
```

Composition id: **`OttomanLegacy`** · entry: `src/index.js`

---

## npm scripts

| Script | What it does |
|--------|----------------|
| `npm run studio` | Remotion Studio — interactive timeline |
| `npm run preview` | Short H.264 preview (`out/preview.mp4`) |
| `npm run render` | **Full film** → `out/ottoman-legacy.mp4` |
| `npm run validate` | Validate sultan / narration data |
| `npm run check:sync` | Verify cue times vs SRT; refresh sync report |
| `npm run align` | Python word-level subtitle alignment |

---

## Project structure

```
ottoman-legacy/
├── out/
│   └── ottoman-legacy.mp4          ← final rendered documentary
├── public/
│   ├── voice_over.mp3              ← master narration
│   ├── ottoman_36_sultans_bn_subtitles.srt
│   ├── ottoman_36_sultans_bn_subtitles.aligned.srt
│   ├── portraits/                  ← 36 sultan portraits
│   ├── audio/                      ← whoosh, impact, paper, drone
│   ├── fonts/                      ← self-hosted woff2
│   └── Tree-pic.jpg
├── src/
│   ├── index.js                    ← Remotion entry
│   ├── Root.jsx                    ← Composition (duration from MP3)
│   ├── Documentary.jsx             ← main timeline: scenes + FX + audio
│   ├── theme.js                    ← colors, fonts, FPS, 1920×1080
│   ├── components/                 ← UI: map, cards, subtitles, timeline…
│   ├── scenes/                     ← SceneA … SceneJ
│   ├── data/
│   │   ├── sultans.js              ← 36 rulers
│   │   ├── narration.js            ← scenes, mentions, year keys
│   │   ├── mapStages.js
│   │   ├── beats.js
│   │   ├── successions.js
│   │   ├── cueTimes.json
│   │   └── cueWords.json
│   └── lib/                        ← time, srt, geo, animation helpers
├── scripts/
│   ├── validate-data.mjs
│   ├── check-sync.mjs
│   ├── align-subtitles.py
│   ├── make-sound.py
│   └── frames.sh
├── docs/
│   └── sync-report.json
├── remotion.config.js
└── package.json
```

---

## How picture locks to speech

1. **SRT cues** define when each line of Bengali narration is spoken.
2. `npm run check:sync` builds **`cueTimes.json`** from the SRT.
3. **Scenes** start on specific cue numbers (`narration.js` → `SCENES`).
4. **Ruler mentions** use word-level times (`cueWords.json` / align script) so portraits hit on the spoken name.
5. **Composition duration** is computed from the real `voice_over.mp3` length — never hard-coded as the source of truth.

```text
voice_over.mp3  +  aligned SRT  →  cue times  →  scenes / beats / map / cards
```

---

## Design language

- **Palette:** deep emerald, midnight navy, imperial gold, parchment ivory
- **Type:** Cinzel (Latin titles) · Cormorant Garamond · Noto Sans/Serif Bengali
- **Motion:** soft springs, diagonal gold wipes, impact camera hits, light leaks
- **Grade:** cinematic color, film grain, vignette — applied as global layers over every scene

Defined once in `src/theme.js` and reused everywhere.

---

## The 36 sultans

From **Osman I (c. 1299)** through the Interregnum, the conquest of Constantinople (**Mehmed II, 1453**), the age of **Suleiman the Magnificent**, the long centuries of reform, to **Mehmed VI (1918–1922)** and the end of the sultanate.

Data lives in `src/data/sultans.js` (unique identities; dual reigns like Murad II / Mehmed II / Mustafa I are one person with multiple `reigns` entries).

---

## Output

| File | Description |
|------|-------------|
| [`out/ottoman-legacy.mp4`](out/ottoman-legacy.mp4) | **Final documentary** (full render) |
| `out/preview.mp4` | Short smoke-test render |

```bash
npm run render
```

Codec settings (from `package.json`): **H.264** · **AAC** · **CRF 17** · pixel format `yuv420p`.

---

## License & credits

- **Project:** Ottoman Legacy — educational / documentary visualization
- **Framework:** [Remotion](https://www.remotion.dev/)
- **Map data:** [world-atlas](https://github.com/topojson/world-atlas)
- **Fonts:** Cinzel, Cormorant Garamond, Noto Sans Bengali, Noto Serif Bengali
- Historical dates follow modern scholarly consensus (e.g. Britannica / Encyclopaedia of Islam); early reign years marked `approx` where traditional.

---

<p align="center">
  <strong>৩৬ জন সুলতান · এক উত্তরাধিকার</strong><br/>
  <em>36 Sultans · One Legacy</em>
</p>

<p align="center">
  <code>npm run studio</code> &nbsp;·&nbsp; <code>npm run render</code> &nbsp;·&nbsp; <code>out/ottoman-legacy.mp4</code>
</p>
