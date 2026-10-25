// Validates the sultan + succession data before any animation uses it.
import { SULTANS, SEGMENTS, BY_ID } from "../src/data/sultans.js";
import { SUCCESSIONS } from "../src/data/successions.js";

const errors = [];
const ok = (c, m) => { if (!c) errors.push(m); };

ok(SULTANS.length === 36, `expected 36 sultans, got ${SULTANS.length}`);
ok(new Set(SULTANS.map((s) => s.id)).size === 36, "duplicate ids");
SULTANS.forEach((s, i) => ok(s.order === i + 1, `order mismatch at ${s.id}`));
const required = ["osman1","orhan","murad1","bayezid1","mehmed1","murad2","mehmed2","bayezid2","selim1","suleiman1","selim2","murad3","mehmed3","ahmed1","mustafa1","osman2","murad4","ibrahim","mehmed4","suleiman2","ahmed2","mustafa2","ahmed3","mahmud1","osman3","mustafa3","abdulhamid1","selim3","mustafa4","mahmud2","abdulmecid1","abdulaziz","murad5","abdulhamid2","mehmed5","mehmed6"];
ok(JSON.stringify(SULTANS.map((s) => s.id)) === JSON.stringify(required), "id list differs from required 36");

// repeated reigns: exactly Murad II, Mehmed II, Mustafa I have two
const multi = SULTANS.filter((s) => s.reigns.length > 1).map((s) => s.id).sort().join(",");
ok(multi === "mehmed2,murad2,mustafa1", `multi-reign rulers: ${multi}`);
ok(SEGMENTS.length === 39, `expected 39 reign segments, got ${SEGMENTS.length}`);

// continuity of political timeline (interregnum 1402–1413 is the only allowed gap)
for (let i = 1; i < SEGMENTS.length; i++) {
  const a = SEGMENTS[i - 1], b = SEGMENTS[i];
  const gap = b.from - a.to;
  if (a.id === "bayezid1") ok(b.id === "mehmed1" && b.from - a.to === 11, "interregnum must be 1402→1413");
  else ok(gap === 0, `gap/overlap between ${a.id}(${a.to}) and ${b.id}(${b.from})`);
}

// succession edges
const ids = new Set(SULTANS.map((s) => s.id));
SUCCESSIONS.forEach((e) => {
  ok(ids.has(e.from) && ids.has(e.to), `edge refs unknown id ${e.from}->${e.to}`);
  const A = BY_ID[e.from], B = BY_ID[e.to];
  if (e.relation === "son") ok(B.father === A.id, `${e.to} is not son of ${e.from}`);
  if (e.relation === "father") ok(A.father === B.id, `${e.from} is not son of ${e.to}`);
  if (e.relation === "brother") ok(A.father === B.father && A.father, `${e.from}/${e.to} not brothers`);
  if (e.relation === "nephew") ok(BY_ID[B.father].father === A.father || BY_ID[B.father].id === A.father, `${e.to} not nephew of ${e.from}`);
  if (e.relation === "uncle") ok(BY_ID[A.father].father === B.father, `${e.to} not uncle of ${e.from}`);
  if (e.relation === "cousin") ok(BY_ID[A.father].father === BY_ID[B.father].father, `${e.from}/${e.to} not cousins`);
});
// every ruler except the first is reached by at least one primary/interregnum edge
SULTANS.slice(1).forEach((s) => ok(SUCCESSIONS.some((e) => e.to === s.id && e.type !== "return"), `${s.id} has no incoming succession`));
ok(SUCCESSIONS.filter((e) => e.type === "return").length === 2, "expected exactly 2 return edges (Murad II 1446, Mustafa I 1622)");

if (errors.length) { console.error("✗ DATA INVALID\n - " + errors.join("\n - ")); process.exit(1); }
console.log(`✓ ${SULTANS.length} unique sultans · ${SEGMENTS.length} reign segments · ${SUCCESSIONS.length} succession edges (${SUCCESSIONS.filter((e)=>e.type==="return").length} returns, interregnum 1402–1413)`);
console.log("✓ multi-reign rulers:", multi);
