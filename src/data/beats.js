// beats.js — the cinematic "beat" layer: full-stage scenes timed to the SPEECH-ALIGNED narration.
// c(n) = start of cue n, w(n, word) = estimated time the narrator says `word` inside cue n.
// Every ruler gets a portrait-hero beat the moment the narration names him, plus topic beats
// (facts, maps, landmarks, kinetic type …) for the rest of his part; base scenes show in the gaps.
import { cueStart as c, wordT as w } from "./narration";

const HERO_LEN = 3.6;
const heroStart = (cue, word, lead = 0.9) => w(cue, word) - lead;

// helper to build hero beats
const hero = (id, cue, word, extra = {}, len = HERO_LEN, lead = 0.9) => {
  const s = heroStart(cue, word, lead);
  return { id: `hero-${id}`, kind: "hero", from: s, to: s + len, props: { id, ...extra } };
};

const B = [];
const push = (b) => B.push(b);

// ───── Chapter B — the founders ─────
push(hero("osman1", 19, "ওসমান", { epithet: "প্রথম সুলতান", tags: ["ওসমান গাজী"] }, c(21) - heroStart(19, "ওসমান", 0.7), 0.7));
push({ id: "b-small-power", kind: "kinetic", from: c(21), to: c(23), props: { icon: "crescent", lines: ["ছোট এক রাজনৈতিক শক্তি", { text: "→ উসমানীয় সাম্রাজ্য", at: c(22) }], sub: "ওসমানের নেতৃত্বে উত্থান" } });
push({ id: "b-name-origin", kind: "kinetic", from: c(23), to: heroStart(24, "অরহান", 0.7), props: { lines: [{ text: "ওসমান", color: "#F4EBD3" }, { text: "উসমানীয়", at: w(23, "উসমানীয়") - 0.2 }, { text: "অটোমান", at: w(23, "অটোমান") - 0.2 }], sub: "তাঁর নাম থেকেই রাজবংশের পরিচয়" } });
push(hero("orhan", 24, "অরহান", { flip: true, tags: ["ওসমানের পুত্র"] }, c(26) + 1.2 - heroStart(24, "অরহান", 0.7), 0.7));
push({ id: "b-orhan-facts", kind: "facts", from: c(26) + 1.2, to: c(28), props: { title: "অরহানের শাসনামল", cards: [{ icon: "column", title: "সুসংহত প্রশাসনিক কাঠামো", t: w(26, "প্রশাসনিক") - 0.3 }, { icon: "map", title: "বাইজেন্টাইন ভূখণ্ডে প্রভাব বিস্তার", t: w(27, "বাইজেন্টাইন") - 0.3 }] } });
push(hero("murad1", 28, "মুরাদ", { tags: ["অরহানের পুত্র"] }, 3.4, 0.7));
{
  const s = heroStart(28, "মুরাদ", 0.7) + 3.4, e = c(33) - 0.6;
  push({ id: "b-balkans", kind: "map", from: s, to: e, props: { title: "প্রথম মুরাদের আমল", chips: [{ t: c(31), text: "সামরিক অভিযান" }, { t: c(31) + 2.2, text: "নতুন ভূখণ্ড দখল" }],
    map: { seed: 21, camera: [{ t: 0, lon: 31, lat: 40, zoom: 2.9 }, { t: s + 1.2, lon: 26, lat: 41.6, zoom: 2.5, dur: 3.2 }, { t: w(29, "বলকান") - 1, lon: 24, lat: 42.4, zoom: 3.0, dur: 3 }],
      stages: [{ id: "s1299", at: s + 0.3, dur: 1.2, fill: "#b04a4a", stroke: "#8E2F2F" }, { id: "s1362", at: s + 1.6, dur: 1.8 }, { id: "s1389", at: w(29, "বলকান") - 0.2, dur: 3.2, final: true }],
      markers: [{ place: "bursa", at: s + 1.8, label: "বুরসা", dx: -14, dy: 36, anchor: "end", size: 24, color: "#13594A" }, { place: "edirne", at: w(29, "বলকান") + 1, label: "এদির্ন", dx: -12, dy: -14, anchor: "end", size: 24, color: "#13594A" }],
      regions: [{ lonlat: [22.4, 43.0], label: "বলকান", at: w(29, "বলকান"), size: 38 }, { lonlat: [32.5, 38.4], label: "আনাতোলিয়া", at: s + 0.5, out: c(29) + 2, size: 34 }], label: "আনুমানিক বিস্তার · প্রতীকী মানচিত্র" } } });
}
push(hero("bayezid1", 34, "বায়েজিদ", { flip: true, epithet: "ইলদিরিম", tags: ["প্রথম মুরাদের পুত্র"] }, 3.4, 0.7));
push({ id: "b-speed", kind: "kinetic", from: heroStart(34, "বায়েজিদ", 0.7) + 3.4, to: c(37), props: { icon: "bolt", lines: ["দ্রুত সামরিক অভিযান"], sub: "বায়েজিদ ইলদিরিমের পরিচয়" } });

// ───── Chapter C — Ankara & the interregnum ─────
push({ id: "c-crisis", kind: "kinetic", from: c(37), to: c(39), props: { tone: "crimson", icon: "broken", lines: ["এক গভীর সংকট"], sub: "বায়েজিদের শাসনামলেই" } });
push({ id: "c-ankara", kind: "event", from: c(39), to: c(41), props: { tone: "crimson", year: 1402, title: "আঙ্কারার যুদ্ধ", sub: "মধ্য এশিয়ার শাসক তৈমুরের কাছে বায়েজিদ পরাজিত ও বন্দী", art: "sword", portraitId: "bayezid1" } });
push({ id: "c-sweep", kind: "sweep", from: c(44), to: c(46), props: { from: 1402, to: 1413, label: "অটোমান ইন্টাররেগনাম", big: "রাজপুত্রদের প্রতিদ্বন্দ্বিতা" } });

// ───── Chapter D — consolidation, Constantinople, Egypt ─────
push(hero("mehmed1", 49, "মুহাম্মদ", { tags: ["বায়েজিদের পুত্র"] }, 3.4, 0.8));
push({ id: "d-steps", kind: "facts", from: heroStart(49, "মুহাম্মদ", 0.8) + 3.4, to: c(53), props: { title: "প্রথম মুহাম্মদের বিজয় ও পুনর্গঠন", flow: true, cards: [{ icon: "sword", title: "প্রতিদ্বন্দ্বীদের পরাজয়", t: w(49, "পরাজিত") }, { icon: "flag", title: "সাম্রাজ্যের পুনরেকত্রীকরণ", t: w(50, "পুনরেকত্রীকরণ") }, { icon: "shield", title: "স্থিতিশীলতার পথে ফেরা", t: w(51, "স্থিতিশীলতার") }] } });
push(hero("murad2", 54, "মুরাদ", { flip: true, tags: ["প্রথম মুহাম্মদের পুত্র", "দুই দফা শাসক"] }, 3.4, 0.8));
push({ id: "d-murad2-facts", kind: "facts", from: heroStart(54, "মুরাদ", 0.8) + 3.4, to: c(57), props: { title: "দ্বিতীয় মুরাদ", cards: [{ icon: "tower", title: "সামরিক শক্তি সুসংহত করা", t: w(55, "সামরিক") - 0.3 }, { icon: "map", title: "বলকানে প্রভাব ধরে রাখা", t: w(55, "বলকান") - 0.3 }] } });
push({ id: "d-fatih", kind: "hero", from: c(64), to: c(66), props: { id: "mehmed2", epithet: "আল-ফাতিহ", tags: ["বিজয়ী মুহাম্মদ"], badge: "দুই দফা শাসক", badgeAt: c(64) + 2.8 } });
push({ id: "d-crossroads", kind: "crossroads", from: c(69), to: c(72), props: { caption: "১৪৫৩ · কনস্টান্টিনোপলের পতন", lines: [{ t: c(69) + 0.6, text: "বহু শতাব্দীর বাইজেন্টাইন রাজধানী" }, { t: w(70, "ইউরোপ") - 0.2, text: "ইউরোপ ও এশিয়ার ইতিহাসে বড় পরিবর্তন", tone: "crimson" }] } });
push({ id: "d-legacy", kind: "kinetic", from: c(74), to: c(77), props: { icon: "crown", lines: ["শুধু সীমানা নয়", "বিশ্ব ইতিহাসের স্মরণীয় অধ্যায়"] } });
push({ id: "d-chain1", kind: "chain", from: heroStart(78, "বায়েজিদ", 0.9), to: c(80) + 3.4, props: { items: [{ id: "bayezid2", t: w(78, "বায়েজিদ"), note: "দ্বিতীয় মুহাম্মদের পুত্র" }, { id: "selim1", t: w(79, "সেলিম"), rel: "পুত্র", note: "মিশর ও সিরিয়া জয়ী" }] } });

// ───── Chapter E — Suleiman ─────
push({ id: "e-suleiman", kind: "hero", from: heroStart(86, "সুলাইমান", 0.8), to: c(88), props: { id: "suleiman1", tags: ["কানুনি", "দ্য ম্যাগনিফিসেন্ট", "প্রথম সেলিমের পুত্র"] } });
push({ id: "e-pillars", kind: "pillars", from: c(88), to: c(91), props: { date: "১৫২০ – ১৫৬৬", title: "এক উচ্চ অবস্থানে উসমানীয় সাম্রাজ্য", pillars: [{ icon: "sword", label: "সামরিক শক্তি", t: w(89, "সামরিক") - 0.3 }, { icon: "column", label: "প্রশাসন", t: w(89, "প্রশাসন") - 0.3 }, { icon: "scales", label: "আইন", t: w(89, "আইন") - 0.3 }, { icon: "book", label: "সংস্কৃতি", t: w(89, "সংস্কৃতিতে") - 0.3 }] } });
push({ id: "e-peak", kind: "kinetic", from: c(93), to: c(95), props: { icon: "star", lines: ["অন্যতম শক্তিশালী পর্যায়"], sub: "উসমানীয় ইতিহাসে" } });
push({ id: "e-chain", kind: "chain", from: heroStart(96, "সেলিম", 0.9), to: c(98), props: { items: [{ id: "selim2", t: w(96, "সেলিম"), note: "সুলাইমানের পুত্র" }, { id: "murad3", t: w(97, "মুরাদ"), rel: "পুত্র" }, { id: "mehmed3", t: w(97, "মুহাম্মদ"), rel: "পুত্র" }] } });

// ───── Chapter F — the seventeenth century ─────
{
  const hs = heroStart(98, "আহমেদ", 0.9);
  push({ id: "hero-ahmed1", kind: "hero", from: hs, to: hs + 3.4, props: { id: "ahmed1", flip: true, tags: ["তৃতীয় মুহাম্মদের পুত্র"] } });
  push({ id: "f-mosque", kind: "landmark", from: hs + 3.4, to: c(101), props: { title: "সুলতান আহমেদ মসজিদ — ব্লু মস্ক", sub: "ইস্তাম্বুল · প্রথম আহমেদের শাসনামলের স্মারক" } });
}
push({ id: "f-change", kind: "kinetic", from: c(101), to: c(103), props: { icon: "swap", lines: ["উত্তরাধিকারে", "একটি গুরুত্বপূর্ণ পরিবর্তন"] } });
push({ id: "f-swap", kind: "swap", from: c(103), to: c(105) + 1.4, props: { a: "ahmed1", b: "mustafa1", label: "ভাই", skip: "পুত্রের পরিবর্তে" } });
push({ id: "f-principle", kind: "kinetic", from: c(105) + 1.4, to: c(108), props: { queue: true, lines: ["জ্যেষ্ঠ পুরুষ সদস্য", { text: "সিংহাসনের উত্তরাধিকারী", at: w(106, "সিংহাসনে") - 0.4 }], sub: "প্রথা ক্রমশ গুরুত্বপূর্ণ হয়ে ওঠে" } });
push(hero("osman2", 108, "ওসমান", { tags: ["তরুণ ওসমান", "প্রথম আহমেদের পুত্র"] }, c(110) + 0.6 - heroStart(108, "ওসমান", 0.9), 0.9));
push({ id: "f-1622", kind: "event", from: c(110) + 0.6, to: c(113), props: { tone: "crimson", year: 1622, title: "জেনিসারি সংঘাত ও পরিণতি", sub: "সামরিক ব্যবস্থায় পরিবর্তনের চেষ্টা → সংঘাত → নিহত", art: "sword", portraitId: "osman2" } });
push({ id: "f-loop", kind: "loop", from: c(113), to: c(117), props: { id: "mustafa1", r1: [1617, 1618], r2: [1622, 1623], note: "একই শাসক · দুই দফা শাসন" } });
push(hero("murad4", 118, "মুরাদ", { flip: true, tags: ["প্রথম আহমেদের আরেক পুত্র"] }, 3.5, 0.8));
{
  const s = heroStart(118, "মুরাদ", 0.8) + 3.5, e = c(121);
  push({ id: "f-baghdad", kind: "map", from: s, to: e, props: { title: "চতুর্থ মুরাদ", chips: [{ t: c(119) + 0.4, text: "কেন্দ্রীয় কর্তৃত্ব পুনঃপ্রতিষ্ঠার চেষ্টা" }, { t: w(120, "বাগদাদ") - 0.2, text: "১৬৩৮ · বাগদাদ পুনরায় উসমানীয় নিয়ন্ত্রণে", tone: "crimson" }],
    map: { seed: 23, camera: [{ t: 0, lon: 38, lat: 36.5, zoom: 2.0 }, { t: s + 1.0, lon: 43, lat: 34.5, zoom: 3.6, dur: 3 }], stages: [{ id: "s1566", at: s + 0.3, dur: 1.2, final: true }],
      routes: [{ from: [28.98, 41.01], to: [44.37, 33.31], at: w(120, "বাগদাদ") - 0.4, dur: 2.4, curve: 150 }],
      markers: [{ place: "constantinople", at: s + 0.8, label: "কনস্টান্টিনোপল", dx: 14, dy: -14, size: 24, color: "#13594A" }, { place: "baghdad", at: w(120, "বাগদাদ"), label: "বাগদাদ", dx: 16, dy: 34, big: true, pulse: true, size: 30 }], label: "আনুমানিক বিস্তার · প্রতীকী মানচিত্র" } } });
}
push({ id: "f-chain-ibrahim", kind: "chain", from: heroStart(121, "ইব্রাহিম", 0.9), to: c(124), props: { items: [{ id: "ibrahim", t: w(121, "ইব্রাহিম"), note: "চতুর্থ মুরাদের ভাই" }, { id: "mehmed4", t: w(123, "মুহাম্মদ"), rel: "পুত্র", note: "ইব্রাহিমের পুত্র" }] } });
push({ id: "f-chain-three", kind: "chain", from: c(124), to: c(126), props: { items: [{ id: "suleiman2", t: w(124, "সুলাইমান") }, { id: "ahmed2", t: w(125, "আহমেদ"), rel: "ভাই" }, { id: "mustafa2", t: w(125, "মুস্তফা"), rel: "ভাতিজা" }] } });
push({ id: "f-pressures", kind: "facts", from: c(126), to: c(129), props: { title: "নতুন বাস্তবতার মুখোমুখি", cards: [{ icon: "sword", title: "ইউরোপীয় শক্তির সঙ্গে দীর্ঘ যুদ্ধ", t: w(126, "ইউরোপীয়") - 0.3 }, { icon: "tower", title: "সামরিক চ্যালেঞ্জ", t: w(127, "সামরিক") - 0.3 }, { icon: "scroll", title: "অভ্যন্তরীণ রাজনৈতিক পরিবর্তন", t: w(127, "অভ্যন্তরীণ") - 0.3 }] } });
push({ id: "f-adapt", kind: "kinetic", from: c(129), to: c(131), props: { icon: "hourglass", lines: ["উত্তরাধিকার চলতে থাকে", "কিন্তু নতুন বাস্তবতা"], sub: "ক্রমাগত মানিয়ে নেওয়ার সংগ্রাম" } });

// ───── Chapter G — the eighteenth century ─────
{
  const hs = heroStart(132, "আহমেদ", 0.9);
  push({ id: "hero-ahmed3", kind: "hero", from: hs, to: hs + 3.4, props: { id: "ahmed3", tags: ["দ্বিতীয় মুস্তফার ভাই"] } });
  push({ id: "g-tulips", kind: "tulips", from: hs + 3.4, to: c(137), props: { chips: [{ t: w(135, "শিল্প") - 0.3, text: "শিল্প" }, { t: w(135, "স্থাপত্য") - 0.3, text: "স্থাপত্য" }, { t: w(135, "সাহিত্য") - 0.3, text: "সাহিত্য" }, { t: w(135, "ইউরোপীয়") - 0.3, text: "ইউরোপীয় সংস্কৃতির প্রতি আগ্রহ" }] } });
}
push({ id: "g-chain", kind: "chain", from: heroStart(137, "মাহমুদ", 0.9), to: c(140), props: { items: [{ id: "mahmud1", t: w(137, "মাহমুদ"), note: "তৃতীয় আহমেদের ভাতিজা" }, { id: "osman3", t: w(138, "ওসমান"), rel: "ভাই" }, { id: "mustafa3", t: w(138, "মুস্তফা"), rel: "চাচাতো ভাই" }, { id: "abdulhamid1", t: w(139, "আব্দুল"), rel: "ভাই" }] } });
push({ id: "g-challenges", kind: "facts", from: c(140), to: c(142), props: { tone: "navy", title: "অষ্টাদশ শতাব্দীর শেষভাগ", cards: [{ icon: "hourglass", title: "শতাব্দীর শেষভাগ", t: w(140, "অষ্টাদশ") }, { icon: "tower", title: "ক্রমবর্ধমান সামরিক চ্যালেঞ্জ", t: w(140, "সামরিক") }, { icon: "scroll", title: "কূটনৈতিক চ্যালেঞ্জ", t: w(141, "কূটনৈতিক") }] } });

// ───── Chapter H — reform & transformation ─────
{
  const hs = heroStart(145, "সেলিম", 0.9);
  push({ id: "hero-selim3", kind: "hero", from: hs, to: hs + 3.4, props: { id: "selim3", flip: true, tags: ["প্রথম আব্দুল হামিদের ভাতিজা"] } });
  push({ id: "h-nizam", kind: "doc", from: hs + 3.4, to: c(150), props: { docTitle: "নিজাম-ই জাদিদ", heading: "সামরিক সংস্কার কর্মসূচি", bullets: [{ icon: "sword", text: "সেনাবাহিনীকে আধুনিক করা", t: w(148, "আধুনিক") - 0.3 }, { icon: "shield", text: "সামরিক সক্ষমতা বাড়ানো", t: w(149, "সক্ষমতা") - 0.3 }] } });
}
push({ id: "h-opposition", kind: "kinetic", from: c(150), to: c(151), props: { tone: "crimson", icon: "broken", lines: ["সংস্কারের বিরোধিতা", { text: "ক্ষমতাচ্যুত", color: "#F1B8AD", at: w(150, "ক্ষমতাচ্যুত") - 0.3 }] } });
push(hero("mustafa4", 151, "মুস্তফা", { tags: ["প্রথম আব্দুল হামিদের পুত্র"] }, c(153) - 0.2 - heroStart(151, "মুস্তফা", 0.8), 0.8));
push(hero("mahmud2", 153, "মাহমুদ", { flip: true, tags: ["১৮০৮", "সামরিক ও প্রশাসনিক পরিবর্তন"] }, c(155) + 2.0 - heroStart(153, "মাহমুদ", 0.9), 0.9));
{
  const hs = heroStart(161, "আব্দুল", 0.9);
  push({ id: "hero-abdulmecid1", kind: "hero", from: hs, to: hs + 3.4, props: { id: "abdulmecid1", tags: ["দ্বিতীয় মাহমুদের পুত্র"] } });
  push({ id: "h-tanzimat", kind: "pillars", from: hs + 3.4, to: c(165), props: { title: "তানজিমাত সংস্কার", pillars: [{ icon: "gear", label: "প্রশাসন", t: w(163, "প্রশাসন") - 0.3 }, { icon: "scales", label: "আইন", t: w(163, "আইন") - 0.3 }, { icon: "book", label: "শিক্ষা", t: w(163, "শিক্ষা") - 0.3 }, { icon: "flag", label: "রাষ্ট্র পরিচালনা", t: w(163, "রাষ্ট্র") - 0.3 }] } });
}
push({ id: "h-three", kind: "chain", from: heroStart(166, "আব্দুল", 0.9), to: c(169), props: { items: [{ id: "abdulaziz", t: w(166, "আব্দুল"), note: "প্রথম আব্দুল মজিদের ভাই" }, { id: "murad5", t: w(168, "মুরাদ"), rel: "ভাতিজা", note: "মাত্র কয়েক মাস · ১৮৭৬" }] } });
{
  const hs = heroStart(170, "আব্দুল", 0.9);
  push({ id: "hero-abdulhamid2", kind: "hero", from: hs, to: hs + 3.4, props: { id: "abdulhamid2", flip: true, tags: ["পঞ্চম মুরাদের ভাই"] } });
  push({ id: "h-constitution", kind: "facts", from: hs + 3.4, to: c(174), props: { title: "দীর্ঘ শাসনামলের গুরুত্বপূর্ণ প্রশ্ন", cards: [{ icon: "scroll", title: "সংবিধান", t: w(171, "সংবিধান") - 0.3 }, { icon: "column", title: "সংসদ", t: w(171, "সংসদ") - 0.3 }, { icon: "crown", title: "কেন্দ্রীয় শাসন", t: w(171, "কেন্দ্রীয়") - 0.3 }, { icon: "swap", title: "রাজনৈতিক বিরোধ", t: w(172, "রাজনৈতিক") - 0.3 }] } });
}
push({ id: "h-compare", kind: "compare", from: c(174), to: c(177), props: { tr: w(175, "অন্যদিকে") - 0.3, left: { icon: "gear", title: "আধুনিক রাষ্ট্রব্যবস্থা", sub: "তার সঙ্গে মানিয়ে নেওয়ার চেষ্টা" }, right: { icon: "broken", title: "জাতীয়তাবাদী আন্দোলন ও ভূখণ্ড হারানো", sub: "একই সঙ্গে সংকট মোকাবিলা" } } });

// ───── Chapter I — the last sultans ─────
push(hero("mehmed5", 178, "মুহাম্মদ", { tags: ["দ্বিতীয় আব্দুল হামিদের ভাই"] }, 3.4, 0.9));
push({ id: "i-ww1", kind: "facts", from: c(181), to: c(184), props: { tone: "crimson", title: "প্রথম বিশ্বযুদ্ধের পর", hue: "#4a1d24", cards: [{ icon: "sword", title: "যুদ্ধের পরাজয়", t: w(181, "পরাজয়") - 0.3 }, { icon: "broken", title: "বিপুল প্রাণহানি", t: w(181, "প্রাণহানি") - 0.3 }, { icon: "map", title: "বিভিন্ন ভূখণ্ড হারানো", t: w(181, "ভূখণ্ড") - 0.3 }] } });
push({ id: "i-last", kind: "hero", from: heroStart(184, "ষষ্ঠ", 0.9), to: c(186), props: { id: "mehmed6", flip: true, tags: ["পঞ্চম মুহাম্মদের ভাই"], badge: "শেষ সুলতান", badgeAt: w(185, "শেষ") - 0.2 } });
push({ id: "i-future", kind: "kinetic", from: c(186), to: c(188), props: { tone: "crimson", icon: "hourglass", lines: ["রাজনৈতিক ভবিষ্যৎ", "দ্রুত পরিবর্তিত"] } });
push({ id: "i-newstate", kind: "kinetic", from: c(191), to: c(193), props: { icon: "flag", lines: ["জাতীয়তাবাদী আন্দোলন", { text: "→ নতুন রাষ্ট্র", at: w(192, "নতুন") - 0.4 }], sub: "মুস্তফা কামাল আতাতুর্কের নেতৃত্বে" } });
push({ id: "i-end", kind: "kinetic", from: c(203), to: c(205), props: { tone: "crimson", icon: "crescent", lines: ["একটি ছোট শক্তি থেকে শুরু", { text: "সুলতানি শাসনের অবসান", at: w(204, "অবসান") - 1.4 }] } });

// ───── Chapter J — reflection ─────
push({ id: "j-stories", kind: "facts", from: c(208), to: c(214), props: { title: "ছত্রিশ জন সুলতান — ছত্রিশটি অধ্যায়", cards: [{ icon: "map", title: "সীমানা বিস্তার", t: c(208) }, { icon: "sword", title: "যুদ্ধ ও বিদ্রোহ", t: c(209) }, { icon: "gear", title: "পুরোনো ব্যবস্থার সংস্কার", t: c(210) }, { icon: "hourglass", title: "পতন ঠেকানো কঠিন", t: c(211) }] } });
push({ id: "j-lesson", kind: "kinetic", from: c(214), to: c(218), props: { lines: ["কোনো সাম্রাজ্য শুধু", "শাসকদের নামে গঠিত নয়", { text: "উত্তরাধিকার · রাজনৈতিক সিদ্ধান্ত", at: w(216, "উত্তরাধিকার") - 0.3 }, { text: "যুদ্ধ · সংস্কৃতি · মানিয়ে নেওয়ার সংগ্রাম", at: w(217, "সংস্কৃতি") - 0.8, size: 80 }] } });

export const BEATS = B.map((b, i) => ({ ...b, idx: i }));
