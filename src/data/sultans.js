// sultans.js — identity + reign data for the 36 UNIQUE Ottoman sultans.
// A ruler who returned to the throne is ONE identity with several `reigns` entries.
// Dates follow the modern scholarly consensus (e.g. Britannica / Encyclopaedia of Islam):
//   approx:true  -> traditional/uncertain date (Osman I's accession c.1299; Osman→Orhan c.1323/4).
// NOTE: the supplied reference image prints older traditional dates for the first three rulers
// (Orhan 1324–1361, Murad I 1360–1389). We use 1324–1362 / 1362–1389 and flag the difference.
export const SULTANS = [
  { id: "osman1", order: 1, en: "Osman I", bn: "প্রথম ওসমান", alias: "ওসমান গাজী", reigns: [{ from: 1299, to: 1324, approx: true }], father: null },
  { id: "orhan", order: 2, en: "Orhan", bn: "অরহান গাজী", reigns: [{ from: 1324, to: 1362, approx: true }], father: "osman1" },
  { id: "murad1", order: 3, en: "Murad I", bn: "প্রথম মুরাদ", reigns: [{ from: 1362, to: 1389 }], father: "orhan" },
  { id: "bayezid1", order: 4, en: "Bayezid I", bn: "প্রথম বায়েজিদ", alias: "ইলদিরিম", reigns: [{ from: 1389, to: 1402 }], father: "murad1" },
  { id: "mehmed1", order: 5, en: "Mehmed I", bn: "প্রথম মুহাম্মদ", alias: "চেলেবি", reigns: [{ from: 1413, to: 1421 }], father: "bayezid1" },
  { id: "murad2", order: 6, en: "Murad II", bn: "দ্বিতীয় মুরাদ", reigns: [{ from: 1421, to: 1444 }, { from: 1446, to: 1451 }], father: "mehmed1" },
  { id: "mehmed2", order: 7, en: "Mehmed II", bn: "দ্বিতীয় মুহাম্মদ", alias: "আল-ফাতিহ", reigns: [{ from: 1444, to: 1446 }, { from: 1451, to: 1481 }], father: "murad2" },
  { id: "bayezid2", order: 8, en: "Bayezid II", bn: "দ্বিতীয় বায়েজিদ", reigns: [{ from: 1481, to: 1512 }], father: "mehmed2" },
  { id: "selim1", order: 9, en: "Selim I", bn: "প্রথম সেলিম", reigns: [{ from: 1512, to: 1520 }], father: "bayezid2" },
  { id: "suleiman1", order: 10, en: "Suleiman I", bn: "প্রথম সুলাইমান", alias: "কানুনি", reigns: [{ from: 1520, to: 1566 }], father: "selim1" },
  { id: "selim2", order: 11, en: "Selim II", bn: "দ্বিতীয় সেলিম", reigns: [{ from: 1566, to: 1574 }], father: "suleiman1" },
  { id: "murad3", order: 12, en: "Murad III", bn: "তৃতীয় মুরাদ", reigns: [{ from: 1574, to: 1595 }], father: "selim2" },
  { id: "mehmed3", order: 13, en: "Mehmed III", bn: "তৃতীয় মুহাম্মদ", reigns: [{ from: 1595, to: 1603 }], father: "murad3" },
  { id: "ahmed1", order: 14, en: "Ahmed I", bn: "প্রথম আহমেদ", reigns: [{ from: 1603, to: 1617 }], father: "mehmed3" },
  { id: "mustafa1", order: 15, en: "Mustafa I", bn: "প্রথম মুস্তফা", reigns: [{ from: 1617, to: 1618 }, { from: 1622, to: 1623 }], father: "mehmed3" },
  { id: "osman2", order: 16, en: "Osman II", bn: "দ্বিতীয় ওসমান", alias: "তরুণ ওসমান", reigns: [{ from: 1618, to: 1622 }], father: "ahmed1" },
  { id: "murad4", order: 17, en: "Murad IV", bn: "চতুর্থ মুরাদ", reigns: [{ from: 1623, to: 1640 }], father: "ahmed1" },
  { id: "ibrahim", order: 18, en: "Ibrahim", bn: "ইব্রাহিম", reigns: [{ from: 1640, to: 1648 }], father: "ahmed1" },
  { id: "mehmed4", order: 19, en: "Mehmed IV", bn: "চতুর্থ মুহাম্মদ", reigns: [{ from: 1648, to: 1687 }], father: "ibrahim" },
  { id: "suleiman2", order: 20, en: "Suleiman II", bn: "দ্বিতীয় সুলাইমান", reigns: [{ from: 1687, to: 1691 }], father: "ibrahim" },
  { id: "ahmed2", order: 21, en: "Ahmed II", bn: "দ্বিতীয় আহমেদ", reigns: [{ from: 1691, to: 1695 }], father: "ibrahim" },
  { id: "mustafa2", order: 22, en: "Mustafa II", bn: "দ্বিতীয় মুস্তফা", reigns: [{ from: 1695, to: 1703 }], father: "mehmed4" },
  { id: "ahmed3", order: 23, en: "Ahmed III", bn: "তৃতীয় আহমেদ", reigns: [{ from: 1703, to: 1730 }], father: "mehmed4" },
  { id: "mahmud1", order: 24, en: "Mahmud I", bn: "প্রথম মাহমুদ", reigns: [{ from: 1730, to: 1754 }], father: "mustafa2" },
  { id: "osman3", order: 25, en: "Osman III", bn: "তৃতীয় ওসমান", reigns: [{ from: 1754, to: 1757 }], father: "mustafa2" },
  { id: "mustafa3", order: 26, en: "Mustafa III", bn: "তৃতীয় মুস্তফা", reigns: [{ from: 1757, to: 1774 }], father: "ahmed3" },
  { id: "abdulhamid1", order: 27, en: "Abdulhamid I", bn: "প্রথম আব্দুল হামিদ", reigns: [{ from: 1774, to: 1789 }], father: "ahmed3" },
  { id: "selim3", order: 28, en: "Selim III", bn: "তৃতীয় সেলিম", reigns: [{ from: 1789, to: 1807 }], father: "mustafa3" },
  { id: "mustafa4", order: 29, en: "Mustafa IV", bn: "চতুর্থ মুস্তফা", reigns: [{ from: 1807, to: 1808 }], father: "abdulhamid1" },
  { id: "mahmud2", order: 30, en: "Mahmud II", bn: "দ্বিতীয় মাহমুদ", reigns: [{ from: 1808, to: 1839 }], father: "abdulhamid1" },
  { id: "abdulmecid1", order: 31, en: "Abdulmecid I", bn: "প্রথম আব্দুল মজিদ", reigns: [{ from: 1839, to: 1861 }], father: "mahmud2" },
  { id: "abdulaziz", order: 32, en: "Abdulaziz", bn: "আব্দুল আজিজ", reigns: [{ from: 1861, to: 1876 }], father: "mahmud2" },
  { id: "murad5", order: 33, en: "Murad V", bn: "পঞ্চম মুরাদ", reigns: [{ from: 1876, to: 1876 }], father: "abdulmecid1" },
  { id: "abdulhamid2", order: 34, en: "Abdulhamid II", bn: "দ্বিতীয় আব্দুল হামিদ", reigns: [{ from: 1876, to: 1909 }], father: "abdulmecid1" },
  { id: "mehmed5", order: 35, en: "Mehmed V", bn: "পঞ্চম মুহাম্মদ", alias: "রেশাদ", reigns: [{ from: 1909, to: 1918 }], father: "abdulmecid1" },
  { id: "mehmed6", order: 36, en: "Mehmed VI", bn: "ষষ্ঠ মুহাম্মদ", alias: "ভাহিদেদ্দিন", reigns: [{ from: 1918, to: 1922 }], father: "abdulmecid1" },
];

export const BY_ID = Object.fromEntries(SULTANS.map((s) => [s.id, s]));
export const portrait = (id) => `portraits/${id}.jpg`;

// Reign SEGMENTS in strict political order (40 segments for 36 unique rulers).
export const SEGMENTS = SULTANS.flatMap((s) => s.reigns.map((r, i) => ({ id: s.id, from: r.from, to: r.to, nth: i + 1, of: s.reigns.length })))
  .sort((a, b) => a.from - b.from || (a.id === "murad5" ? -1 : 0) || 0);
// Murad V (1876) and Abdulaziz (…1876) / Abdulhamid II (1876…) share the year; fix the exact order explicitly:
const ORDER_FIX = ["abdulaziz", "murad5", "abdulhamid2"];
SEGMENTS.sort((a, b) => {
  if (a.from === b.from && ORDER_FIX.includes(a.id) && ORDER_FIX.includes(b.id)) return ORDER_FIX.indexOf(a.id) - ORDER_FIX.indexOf(b.id);
  return a.from - b.from;
});

// Interregnum — shown distinctly; claimants are NOT counted among the 36.
export const INTERREGNUM = {
  from: 1402,
  to: 1413,
  claimants: [
    { id: "suleiman-c", bn: "সুলাইমান চেলেবি", en: "Süleyman Çelebi", region: "রুমেলি (এদির্ন)", lonlat: [26.56, 41.68] },
    { id: "isa-c", bn: "ঈসা চেলেবি", en: "İsa Çelebi", region: "বুরসা", lonlat: [29.06, 40.19] },
    { id: "mehmed-c", bn: "মুহাম্মদ চেলেবি", en: "Mehmed Çelebi", region: "আমাসিয়া", lonlat: [35.83, 40.65], becomes: "mehmed1" },
    { id: "musa-c", bn: "মুসা চেলেবি", en: "Musa Çelebi", region: "বলকান", lonlat: [24.0, 42.6] },
  ],
};
