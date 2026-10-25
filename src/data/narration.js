// narration.js — everything that pins visuals to the supplied SRT.
// Cue times come from cueTimes.json (generated from the supplied SRT by `npm run check:sync`,
// which also verifies the file still matches the SRT). Subtitles themselves are parsed at runtime.
import CUES from "./cueTimes.json";

export const cueStart = (n) => CUES[n][0];
export const cueEnd = (n) => CUES[n][1];
export const LAST_CUE_END = cueEnd(224);

// Scene boundaries = start of the cue where the narration changes subject.
export const SCENES = [
  { id: "A", title: "সূচনা", cue: 1 },
  { id: "B", title: "প্রতিষ্ঠাতা রাজবংশ", cue: 18 },
  { id: "C", title: "ইন্টাররেগনাম", cue: 37 },
  { id: "D", title: "কনস্টান্টিনোপল ও সম্প্রসারণ", cue: 49 },
  { id: "E", title: "সাম্রাজ্যের শিখর", cue: 85 },
  { id: "F", title: "সপ্তদশ শতাব্দীর অস্থিরতা", cue: 98 },
  { id: "G", title: "অষ্টাদশ শতাব্দী", cue: 131 },
  { id: "H", title: "সংস্কার ও রূপান্তর", cue: 145 },
  { id: "I", title: "শেষ সুলতানরা", cue: 178 },
  { id: "J", title: "উত্তরাধিকার", cue: 205 },
].map((s) => ({ ...s, start: cueStart(s.cue) }));

export const sceneEnd = (i) => (i + 1 < SCENES.length ? SCENES[i + 1].start : LAST_CUE_END);

// Word-level time inside a cue (estimated from the speech-aligned timing; see scripts/align-subtitles.py)
import WORDS from "./cueWords.json";
export const wordT = (cue, needle, nth = 0) => {
  const list = WORDS[cue] || [];
  const hits = list.filter((w) => w[0].includes(needle));
  return hits[nth] ? hits[nth][1] : cueStart(cue);
};

// Moments when the narration NAMES a ruler (cue + the spoken word inside that cue).
export const MENTIONS = [
  { id: "osman1", cue: 19, w: "ওসমান" }, { id: "orhan", cue: 24, w: "অরহান" }, { id: "murad1", cue: 28, w: "মুরাদ" },
  { id: "bayezid1", cue: 34, w: "বায়েজিদ" }, { id: "mehmed1", cue: 49, w: "মুহাম্মদ" }, { id: "murad2", cue: 54, w: "মুরাদ" },
  { id: "mehmed2", cue: 58, w: "মুহাম্মদ" }, { id: "murad2", cue: 60, w: "আবার", ret: true }, { id: "mehmed2", cue: 61, w: "দ্বিতীয়", ret: true },
  { id: "bayezid2", cue: 78, w: "বায়েজিদ" }, { id: "selim1", cue: 79, w: "সেলিম" }, { id: "suleiman1", cue: 86, w: "সুলাইমান" },
  { id: "selim2", cue: 96, w: "সেলিম" }, { id: "murad3", cue: 97, w: "মুরাদ" }, { id: "mehmed3", cue: 97, w: "মুহাম্মদ" },
  { id: "ahmed1", cue: 98, w: "আহমেদ" }, { id: "mustafa1", cue: 104, w: "মুস্তফা" }, { id: "osman2", cue: 108, w: "ওসমান" },
  { id: "mustafa1", cue: 113, w: "মুস্তফা", ret: true }, { id: "murad4", cue: 118, w: "মুরাদ" }, { id: "ibrahim", cue: 121, w: "ইব্রাহিম" },
  { id: "mehmed4", cue: 123, w: "মুহাম্মদ" }, { id: "suleiman2", cue: 124, w: "সুলাইমান" }, { id: "ahmed2", cue: 125, w: "আহমেদ" },
  { id: "mustafa2", cue: 125, w: "মুস্তফা" }, { id: "ahmed3", cue: 132, w: "আহমেদ" }, { id: "mahmud1", cue: 137, w: "মাহমুদ" },
  { id: "osman3", cue: 138, w: "ওসমান" }, { id: "mustafa3", cue: 138, w: "মুস্তফা" }, { id: "abdulhamid1", cue: 139, w: "আব্দুল" },
  { id: "selim3", cue: 145, w: "সেলিম" }, { id: "mustafa4", cue: 151, w: "মুস্তফা" }, { id: "mahmud2", cue: 153, w: "মাহমুদ" },
  { id: "abdulmecid1", cue: 161, w: "আব্দুল" }, { id: "abdulaziz", cue: 166, w: "আব্দুল" }, { id: "murad5", cue: 168, w: "মুরাদ" },
  { id: "abdulhamid2", cue: 170, w: "আব্দুল" }, { id: "mehmed5", cue: 178, w: "মুহাম্মদ" }, { id: "mehmed6", cue: 184, w: "ষষ্ঠ" },
].map((m) => ({ ...m, t: wordT(m.cue, m.w) }));

export const mentionTime = (id, nth = 0) => MENTIONS.filter((m) => m.id === id)[nth]?.t ?? null;
export const activeRuler = (t) => {
  let cur = null;
  for (const m of MENTIONS) if (m.t <= t) cur = m; else break;
  return cur;
};
const mt = mentionTime;

// Year marker keyframes [seconds, year] — drives the top timeline (rulers: when named; events: cue start).
export const YEAR_KEYS = [
  [cueStart(18), 1299], [mt("orhan"), 1324], [mt("murad1"), 1362], [mt("bayezid1"), 1389],
  [cueStart(39) + 1.2, 1402], [cueStart(45), 1413], [mt("mehmed1"), 1413.2], [mt("murad2", 0), 1421], [mt("mehmed2", 0), 1444],
  [mt("murad2", 1), 1446], [mt("mehmed2", 1), 1451], [cueStart(66), 1453], [mt("bayezid2"), 1481], [mt("selim1"), 1512],
  [cueStart(82), 1517], [mt("suleiman1"), 1520], [mt("selim2"), 1566], [mt("murad3"), 1574], [mt("mehmed3"), 1595],
  [mt("ahmed1"), 1603], [mt("mustafa1", 0), 1617], [mt("osman2"), 1618], [mt("mustafa1", 1), 1622], [mt("murad4"), 1623],
  [mt("ibrahim"), 1640], [mt("mehmed4"), 1648], [mt("suleiman2"), 1687], [mt("ahmed2"), 1691], [mt("mustafa2"), 1695],
  [mt("ahmed3"), 1703], [mt("mahmud1"), 1730], [mt("osman3"), 1754], [mt("mustafa3"), 1757], [mt("abdulhamid1"), 1774],
  [mt("selim3"), 1789], [mt("mustafa4"), 1807], [mt("mahmud2"), 1808], [cueStart(156), 1826], [mt("abdulmecid1"), 1839],
  [mt("abdulaziz"), 1861], [mt("murad5"), 1876], [cueStart(177), 1909], [mt("mehmed6"), 1918], [cueStart(193), 1922],
  [cueStart(202), 1924],
];
