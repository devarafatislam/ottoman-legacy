# Ottoman Legacy — 36 Sultans, One Empire (Remotion)

Composition id: **OttomanLegacy** · 1920×1080 · 30 fps · duration read from the real MP3 (`calculateMetadata`) → 807.706 s = **24 232 frames**.

## Run
```bash
npm install
npm run validate      # 36 unique sultans, reign continuity, interregnum, succession relations
npm run check:sync    # SRT parse, cue/audio coverage, narration-pause drift report (needs ffmpeg)
npm run studio        # Remotion Studio
npm run preview       # 5 s preview MP4 → out/preview.mp4
npm run render        # FULL render (H.264 + AAC) → out/ottoman-legacy.mp4   (not run yet)
```
Assets (unchanged): `public/voice_over.mp3`, `public/ottoman_36_sultans_bn_subtitles.srt`, `public/Tree-pic.jpg`
(portraits are cropped from it into `public/portraits/`). Fonts are local (`public/fonts`, Noto Sans/Serif Bengali, Cinzel, Cormorant).
Sound kit is synthesised (`scripts/make-sound.py`) — royalty-free, ≈ −24 LU under the narration.

## Structure
- `src/data/` sultans (identity, reigns, parentage) · successions (political edges ≠ biological `father`) · narration (SRT cue anchors) · mapStages
- `src/components/` Subtitles (SRT-driven), MapStage, SuccessionTree, Timeline, RulerCard, Blocks, Art, Atmosphere, AudioBed
- `src/scenes/` A Opening · B Founders · C Interregnum · D Constantinople/expansion · E Zenith · F 17th c. · G 18th c. · H Reform · I Final sultans · J Succession-tree finale

## Motion-graphics layer (src/components/FX.jsx + Documentary.jsx)
Diagonal gold-light scene wipes · slow push-in camera per scene · chapter title bands (B–J) · impact camera-shake + flash (1402, 1453, 1826, 1922, finale) · drifting light leak that swells at scene changes · rising gold embers · rotating Islamic geometric rosette · gold glint on ruler cards · travelling light pulses along succession edges and map routes.

## Sync (important)
The supplied `.srt` drifts from the voice (≈ −6 s at 4:00, ≈ −13 s near 9:00, re-converging at the end).
`npm run align` (scripts/align-subtitles.py) re-times the SAME text against the real speech/pauses of the MP3 and writes
`public/ottoman_36_sultans_bn_subtitles.aligned.srt` (used by the video) + `src/data/cueTimes.json` / `cueWords.json`.
The original SRT is untouched. Word-level times are estimates (±0.3–0.5 s).

## Beat layer (src/data/beats.js, src/components/Beats.jsx)
61 full-stage cinematic scenes (portrait heroes at the exact moment each sultan is named, facts, maps, landmarks, kinetic type, event stamps, pillars, comparisons…)
fill ~57 % of the runtime; the base scenes (maps/tree) show in the gaps.
