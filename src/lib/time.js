import { FPS } from "../theme";

export const secToFrame = (s) => Math.round(s * FPS);
export const frameToSec = (f) => f / FPS;

const BN = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
export const toBn = (v) => String(v).replace(/[0-9]/g, (d) => BN[+d]);

// Reign span helper: [{from:1299,to:1324}] -> "১২৯৯–১৩২৪"
export const spanBn = (reigns) =>
  reigns
    .map((r) => `${r.approx ? "আনু. " : ""}${toBn(r.from)}${r.from === r.to ? "" : "–" + toBn(r.to)}`)
    .join(" · ");
