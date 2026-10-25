// Verifies: SRT parses, matches cueTimes.json (used for visual anchors), covers the MP3 duration,
// and reports how well cue boundaries line up with real pauses in the narration (needs ffmpeg).
import fs from "fs";
import { execSync } from "child_process";
import { parseSrt } from "../src/lib/srt.js";

const orig = parseSrt(fs.readFileSync("public/ottoman_36_sultans_bn_subtitles.srt", "utf8"), 30);
const srt = parseSrt(fs.readFileSync("public/ottoman_36_sultans_bn_subtitles.aligned.srt", "utf8"), 30); // the SRT the video uses
console.log("text identical to supplied SRT:", orig.every((c, i) => c.text === srt[i].text) && orig.length === srt.length);
const cueTimes = JSON.parse(fs.readFileSync("src/data/cueTimes.json", "utf8"));
const dur = parseFloat(execSync('ffprobe -v error -show_entries format=duration -of csv=p=0 public/voice_over.mp3').toString());
let bad = 0;
srt.forEach((c) => { const t = cueTimes[c.index]; if (!t || Math.abs(t[0] - c.startSec) > 0.002 || Math.abs(t[1] - c.endSec) > 0.002) bad++; });
console.log(`cues: ${srt.length} · cueTimes.json mismatches: ${bad}`);
console.log(`audio: ${dur.toFixed(3)} s → ${Math.ceil(dur * 30)} frames @30fps · last cue ends ${srt.at(-1).endSec.toFixed(3)} s (Δ ${(dur - srt.at(-1).endSec).toFixed(3)} s)`);
let overlaps = 0, gaps = 0; for (let i = 1; i < srt.length; i++) { if (srt[i].startSec < srt[i - 1].endSec - 0.001) overlaps++; if (srt[i].startSec - srt[i - 1].endSec > 0.05) gaps++; }
console.log(`overlaps: ${overlaps} · gaps >50ms: ${gaps}`);

// pause analysis
const log = execSync(`ffmpeg -hide_banner -nostats -i public/voice_over.mp3 -af silencedetect=noise=-36dB:d=0.28 -f null - 2>&1 | grep silence_ || true`).toString().split("\n");
const st = [], en = [];
log.forEach((l) => { if (l.includes("silence_start")) st.push(+l.split("silence_start:")[1]); if (l.includes("silence_end")) en.push(+l.split("silence_end:")[1].split("|")[0]); });
const sil = st.map((a, i) => [a, en[i]]).filter((x) => x[1] && x[1] - x[0] >= 0.3);
const offs = [];
srt.filter((c) => /[।?]$/.test(c.text.trim())).forEach((c) => {
  const near = sil.filter((x) => Math.abs(x[0] - c.endSec) < 4);
  if (near.length) { const b = near.reduce((p, q) => (Math.abs((q[0] + q[1]) / 2 - c.endSec) < Math.abs((p[0] + p[1]) / 2 - c.endSec) ? q : p)); offs.push((b[0] + b[1]) / 2 - c.endSec); }
});
const abs = offs.map(Math.abs).sort((a, b) => a - b);
console.log(`sentence-end cues matched to a pause: ${offs.length} · median |offset| ${abs[abs.length >> 1]?.toFixed(2)} s · >1 s: ${abs.filter((x) => x > 1).length} · >2 s: ${abs.filter((x) => x > 2).length}`);
console.log("NOTE: heuristic (pause ≠ always sentence end). Spot-check by ear, e.g. 0:26–0:34 and 3:00–3:12.");
