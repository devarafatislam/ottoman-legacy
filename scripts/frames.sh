#!/bin/sh
# usage: scripts/frames.sh name:seconds name:seconds ...   (renders stills for visual QA)
BR=${BROWSER:-/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell}
for a in "$@"; do
  n=${a%%:*}; s=${a##*:}; f=$(node -e "console.log(Math.round($s*30))")
  npx remotion still src/index.js OttomanLegacy out/$n.png --frame $f --browser-executable=$BR 2>&1 | grep -E "rror" 
done
