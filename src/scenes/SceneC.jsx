import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { useClock, prog, Reveal, window01 } from "../lib/anim";
import { Backdrop, Dust, GoldRule } from "../components/Atmosphere";
import { MapStage } from "../components/MapStage";
import { Silhouette, EventBanner } from "../components/Blocks";
import { OvalPortrait, RulerCard } from "../components/RulerCard";
import { Chip } from "../components/Art";
import { cueStart as C, SCENES } from "../data/narration";
import { INTERREGNUM } from "../data/sultans";

const c = theme.colors;
const END = SCENES[3].start;
const CAMERA = [
  { t: 0, lon: 29.5, lat: 40.2, zoom: 2.35 },
  { t: C(39), lon: 31.5, lat: 40.0, zoom: 3.0, dur: 3 },
  { t: C(42) - 0.5, lon: 30.0, lat: 40.6, zoom: 2.3, dur: 4 },
];

// Claimant card: dashed frame, NOT counted among the 36
const Claimant = ({ cl, at, state }) => {
  const { t } = useClock();
  const win = cl.becomes && state === "win";
  const dim = state === "lose";
  return (
    <Reveal at={at} y={30} style={{ marginBottom: 18 }}>
      <div style={{ width: 560, height: 128, borderRadius: 18, display: "flex", alignItems: "center", gap: 22, padding: "0 24px", background: "rgba(4,32,26,0.85)", border: win ? `2px solid ${c.goldBright}` : `2px dashed ${dim ? "rgba(199,160,74,0.35)" : c.goldDim}`, boxShadow: win ? `0 0 40px ${c.gold}88` : "0 14px 30px rgba(0,0,0,0.5)", opacity: dim ? 0.5 : 1 }}>
        {win ? <OvalPortrait id="mehmed1" w={68} h={84} ring={4} kb={false} /> : <Silhouette w={76} h={94} dim={dim} />}
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: theme.fonts.bnSerif, fontWeight: 700, fontSize: 34, color: win ? c.goldBright : c.ivory, lineHeight: 1.25 }}>{win ? "প্রথম মুহাম্মদ" : cl.bn}</div>
          <div style={{ fontFamily: theme.fonts.title, fontWeight: 600, fontSize: 15, letterSpacing: "0.08em", color: c.goldBright }}>{(win ? "Mehmed I" : cl.en).toUpperCase()}</div>
          <div style={{ fontFamily: theme.fonts.bn, fontWeight: 400, fontSize: 22, color: c.ivoryDim }}>{win ? "প্রতিদ্বন্দ্বীদের পরাজিত করে বিজয়ী" : `ঘাঁটি: ${cl.region}`}</div>
        </div>
        {!win && <div style={{ fontFamily: theme.fonts.bn, fontWeight: 600, fontSize: 17, color: c.ivoryDim, border: `1px solid ${c.goldDim}`, borderRadius: 8, padding: "3px 10px", textAlign: "center", lineHeight: 1.3 }}>গণনাভুক্ত<br />সুলতান নন</div>}
      </div>
    </Reveal>
  );
};

export const SceneC = () => {
  const { t } = useClock();
  const state = t > C(48) + 0.5 ? "win" : "open";
  const loseState = t > C(48) + 0.5 ? "lose" : "open";
  return (
    <AbsoluteFill>
      <Backdrop tone="navy" />
      <MapStage
        x={60} y={150} w={1180} h={700} seed={5} appear={0.2} camera={CAMERA}
        stages={[
          { id: "s1402", at: 0.4, dur: 1.2, final: true, fade: C(41) + 2.2 },
          { id: "regIsa", at: C(42) + 0.3, dur: 1.4, fill: "#6f9fc2", stroke: "#3b6d8f" },
          { id: "regMehmed", at: C(42) + 0.9, dur: 1.4, fill: "#4fa07f", stroke: "#1f6b4f" },
          { id: "regSuleiman", at: C(42) + 1.5, dur: 1.4, fill: "#b95a52", stroke: c.crimson },
        ]}
        routes={[{ from: [44.8, 40.3], to: [32.86, 39.93], at: C(40) - 0.4, dur: 1.8, curve: 40, out: C(41) }]}
        markers={[
          { place: "ankara", at: C(39), pulse: true, big: true, label: "আঙ্কারা", dx: 16, dy: 34, size: 28 },
          { place: "bursa", at: C(42) + 1.6, label: "ঈসা · বুরসা", dx: -14, dy: 34, anchor: "end", size: 22, color: "#3b6d8f" },
          { place: "amasya", at: C(42) + 2.1, label: "মুহাম্মদ · আমাসিয়া", dx: 16, dy: -16, size: 22, color: "#1f6b4f" },
          { place: "edirne", at: C(42) + 2.6, label: "সুলাইমান · এদির্ন", dx: -14, dy: -16, anchor: "end", size: 22 },
        ]}
        regions={[{ lonlat: [41.3, 40.0], label: "তৈমুরের বাহিনী", at: C(40) - 0.2, out: C(41), size: 23, color: "rgba(120,30,30,0.9)" }]}
        label="আনুমানিক ঘাঁটি · প্রতীকী মানচিত্র"
      />

      {/* Battle of Ankara banner (small, over the map) */}
      <Reveal at={C(39)} out={C(41) + 2} y={26} style={{ position: "absolute", left: 90, top: 178 }}>
        <div style={{ padding: "12px 28px", borderRadius: 16, background: "rgba(142,47,47,0.92)", border: `1.5px solid ${c.goldBright}`, fontFamily: theme.fonts.bnSerif, fontWeight: 700, fontSize: 40, color: c.ivory, boxShadow: "0 14px 34px rgba(0,0,0,0.55)" }}>১৪০২ · আঙ্কারার যুদ্ধ</div>
      </Reveal>
      <Reveal at={C(40) + 0.3} out={C(42)} y={28} style={{ position: "absolute", left: 90, top: 262 }}>
        <div style={{ padding: "10px 22px", borderRadius: 16, background: "rgba(4,32,26,0.9)", border: `1px solid ${c.gold}`, fontFamily: theme.fonts.bn, fontWeight: 600, fontSize: 26, color: c.ivory, lineHeight: 1.35 }}>তৈমুর — মধ্য এশিয়ার শাসক<br /><span style={{ color: c.ivoryDim, fontWeight: 400, fontSize: 22 }}>বায়েজিদ পরাজিত ও বন্দী</span></div>
      </Reveal>
      <RulerCard id="bayezid1" at={C(38)} out={C(42) - 0.2} size="md" badge="পরাজিত ও বন্দী · ১৪০২" style={{ position: "absolute", left: 1400, top: 200 }} />
      <Reveal at={C(41)} out={C(44)} y={24} style={{ position: "absolute", left: 90, top: 262 }}>
        <Chip big tone="crimson">কেন্দ্রীয় কর্তৃত্ব দুর্বল — সিংহাসন নিয়ে সংঘাত</Chip>
      </Reveal>

      {/* Interregnum band */}
      <Reveal at={C(44)} y={30} style={{ position: "absolute", left: 90, top: 178 }}>
        <div style={{ padding: "12px 28px", borderRadius: 16, background: `repeating-linear-gradient(45deg, ${c.crimson}, ${c.crimson} 10px, #6f2020 10px, #6f2020 20px)`, border: `1.5px solid ${c.goldBright}`, fontFamily: theme.fonts.bnSerif, fontWeight: 700, fontSize: 38, color: c.ivory, boxShadow: "0 14px 34px rgba(0,0,0,0.55)" }}>অটোমান ইন্টাররেগনাম · ১৪০২–১৪১৩</div>
      </Reveal>
      <Reveal at={C(46)} y={20} style={{ position: "absolute", left: 90, top: 262 }}>
        <div style={{ fontFamily: theme.fonts.bn, fontWeight: 600, fontSize: 26, color: c.ivory, background: "rgba(4,32,26,0.88)", border: `1px solid ${c.goldDim}`, padding: "8px 20px", borderRadius: 12 }}>কোনো একক সুলতান নয় — রাজপুত্রদের প্রতিদ্বন্দ্বিতা</div>
      </Reveal>

      {/* Claimants */}
      <div style={{ position: "absolute", left: 1290, top: 160 }}>
        <Reveal at={C(42)} y={20} style={{ marginBottom: 14 }}><div style={{ fontFamily: theme.fonts.bn, fontWeight: 600, fontSize: 26, color: c.goldBright }}>বায়েজিদের পুত্রদের মধ্যে প্রতিদ্বন্দ্বিতা</div></Reveal>
        {INTERREGNUM.claimants.map((cl, i) => (
          <Claimant key={cl.id} cl={cl} at={C(46) + i * 1.0} state={cl.becomes ? state : loseState} />
        ))}
      </div>
      <Reveal at={C(48) + 0.8} y={24} style={{ position: "absolute", left: 1290, top: 748 }}>
        <div style={{ fontFamily: theme.fonts.bn, fontWeight: 600, fontSize: 28, color: c.goldBright }}>↓ ১৪১৩ — সাম্রাজ্যের পুনরেকত্রীকরণ</div>
      </Reveal>
      <Dust count={26} opacity={0.4} />
    </AbsoluteFill>
  );
};
