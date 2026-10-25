import { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";

// Local fonts only (no network). Bengali + Latin subsets share one family via unicode-range.
const BN_RANGE = "U+0951-0952,U+0964-0965,U+0980-09FE,U+1CD0,U+1CD2,U+1CD5-1CD6,U+1CD8,U+1CE1,U+1CEA,U+1CED,U+1CF2,U+1CF5-1CF7,U+200C-200D,U+20B9,U+25CC,U+A8F1";
const LATIN_RANGE = "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";

const FACES = [
  ...[400, 600, 700].flatMap((w) => [
    ["OL Noto Sans Bengali", `fonts/noto-sans-bengali-bengali-${w}-normal.woff2`, w, "normal", BN_RANGE],
    ["OL Noto Sans Bengali", `fonts/noto-sans-bengali-latin-${w}-normal.woff2`, w, "normal", LATIN_RANGE],
    ["OL Noto Serif Bengali", `fonts/noto-serif-bengali-bengali-${w}-normal.woff2`, w, "normal", BN_RANGE],
    ["OL Noto Serif Bengali", `fonts/noto-serif-bengali-latin-${w}-normal.woff2`, w, "normal", LATIN_RANGE],
    ["OL Cinzel", `fonts/cinzel-latin-${w}-normal.woff2`, w, "normal", LATIN_RANGE],
  ]),
  ...[400, 600].map((w) => ["OL Cormorant", `fonts/cormorant-garamond-latin-${w}-normal.woff2`, w, "normal", LATIN_RANGE]),
];

export const FontLoader = ({ children }) => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    Promise.all(
      FACES.map(([family, file, weight, style, unicodeRange]) => {
        const face = new FontFace(family, `url(${staticFile(file)}) format("woff2")`, { weight: String(weight), style, unicodeRange });
        return face.load().then((f) => document.fonts.add(f));
      })
    )
      .then(() => { setReady(true); continueRender(handle); })
      .catch((e) => { console.error("Font load failed", e); setReady(true); continueRender(handle); });
  }, [handle]);
  return ready ? children : null;
};
