import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { useClock, prog, Reveal, window01 } from "../lib/anim";
import { Backdrop, Dust, GoldRule } from "../components/Atmosphere";
import { MapStage } from "../components/MapStage";
import { RulerSpotlight, EventBanner, Silhouette } from "../components/Blocks";
import { RulerCard } from "../components/RulerCard";
import { Chip } from "../components/Art";
import { cueStart as C, SCENES } from "../data/narration";

const c = theme.colors;
const S = SCENES[8].start, END = SCENES[9].start;

const CALIPH_AT = C(200);
const Caliph = () => (
  <Reveal at={CALIPH_AT} y={50} scale={0.92} style={{ position: "absolute", left: 980, top: 230 }}>
    <div style={{ width: 300, height: 440, borderRadius: 22, border: `2px dashed ${c.goldDim}`, background: `linear-gradient(170deg, ${c.emerald}E6, ${c.navy}F2)`, boxShadow: "0 30px 60px -18px rgba(0,0,0,0.75)", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 38 }}>
      <Silhouette w={170} h={208} />
      <div style={{ fontFamily: theme.fonts.bnSerif, fontWeight: 700, fontSize: 34, color: c.ivory, marginTop: 22, textAlign: "center", lineHeight: 1.3 }}>দ্বিতীয় আব্দুল মজিদ</div>
      <div style={{ fontFamily: theme.fonts.bn, fontWeight: 600, fontSize: 24, color: c.goldBright, marginTop: 8 }}>খলিফা · ১৯২২–১৯২৪</div>
      <div style={{ marginTop: 14, fontFamily: theme.fonts.bn, fontWeight: 600, fontSize: 20, color: c.ivoryDim, border: `1px solid ${c.goldDim}`, borderRadius: 8, padding: "3px 12px" }}>গণনাভুক্ত সুলতান নন</div>
    </div>
  </Reveal>
);

export const SceneI = () => {
  const { t } = useClock();
  const mapOut = C(197) - 0.3;
  return (
    <AbsoluteFill>
      <Backdrop tone="navy" />
      <MapStage
        x={700} y={150} w={1160} h={700} seed={13} appear={0.2} out={mapOut}
        camera={[{ t: 0, lon: 38, lat: 36, zoom: 1.9 }, { t: C(188), lon: 35, lat: 38.5, zoom: 2.5, dur: 4 }]}
        stages={[{ id: "s1914", at: C(179) + 0.5, dur: 2.4, final: true, fade: C(188) + 1 }]}
        showTurkey turkeyAt={C(191) + 2}
        markers={[
          { place: "ankara", at: C(189) + 1, big: true, pulse: true, label: "আঙ্কারা", dx: 16, dy: 34, size: 27 },
          { place: "constantinople", at: C(188), label: "কনস্টান্টিনোপল", dx: -14, dy: -12, anchor: "end", size: 22, color: c.emeraldMid },
        ]}
        label="১৯১৪ — আনুমানিক বিস্তার · ১৯২৩ — আধুনিক তুরস্কের সীমানা"
      />
      <RulerSpotlight from={S} to={C(197)} size="lg" left={110} top={170} />
      <Reveal at={C(185)} out={C(197)} y={20} style={{ position: "absolute", left: 130, top: 745 }}>
        <Chip big tone="crimson">শেষ সুলতান · ১৯১৮–১৯২২</Chip>
      </Reveal>

      <div style={{ position: "absolute", left: 720, top: 176, display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
        <Reveal at={C(179)} out={C(181)} y={20}><Chip big>প্রথম বিশ্বযুদ্ধে অংশগ্রহণ</Chip></Reveal>
      </div>
      {[["যুদ্ধের পরাজয়", C(181)], ["বিপুল প্রাণহানি", C(181) + 1.8], ["ভূখণ্ড হারানো", C(182) + 0.4]].map(([k, at], i) => (
        <Reveal key={k} at={at} out={C(184)} y={20} style={{ position: "absolute", left: 720, top: 176 + i * 62 }}><Chip big tone="crimson">{k}</Chip></Reveal>
      ))}
      <Reveal at={C(188)} out={C(193)} y={20} style={{ position: "absolute", left: 720, top: 176 }}><Chip big>প্রথম বিশ্বযুদ্ধের পরাজয়ের পর মিত্রশক্তির প্রভাব</Chip></Reveal>
      <Reveal at={C(189)} out={C(193)} y={20} style={{ position: "absolute", left: 720, top: 240 }}><Chip big>তুরস্কের জাতীয়তাবাদী আন্দোলন</Chip></Reveal>
      <Reveal at={C(191)} out={C(193)} y={20} style={{ position: "absolute", left: 720, top: 304 }}><Chip big tone="crimson">মুস্তফা কামাল আতাতুর্ক · নতুন রাষ্ট্রের পথে</Chip></Reveal>

      <EventBanner at={C(193)} out={C(197) - 0.3} year={1922} prefix="১ নভেম্বর" title="গ্র্যান্ড ন্যাশনাল অ্যাসেম্বলি সুলতানাত বিলুপ্ত ঘোষণা করে" sub="ওসমান গাজীর প্রতিষ্ঠিত রাজবংশের ছয় শতাব্দীরও বেশি সুলতানি শাসনের আনুষ্ঠানিক সমাপ্তি" roll={20} tone="crimson" />

      {/* aftermath */}
      <RulerCard id="mehmed6" at={C(197) + 0.2} size="md" badge="দেশত্যাগ" style={{ position: "absolute", left: 520, top: 230 }} />
      <Reveal at={C(200) - 0.2} y={0} style={{ position: "absolute", left: 830, top: 420 }}>
        <div style={{ fontFamily: theme.fonts.bn, fontWeight: 600, fontSize: 26, color: c.ivory, textAlign: "center", width: 140 }}>চাচাতো ভাই<div style={{ fontSize: 44, color: c.goldBright, lineHeight: 1 }}>→</div></div>
      </Reveal>
      <Caliph />
      <Reveal at={C(202)} y={24} style={{ position: "absolute", left: 1360, top: 330 }}>
        <div style={{ fontFamily: theme.fonts.bnSerif, fontWeight: 700, fontSize: 130, lineHeight: 1, color: "#E9A79B", textShadow: "0 8px 30px #000" }}>১৯২৪</div>
        <div style={{ fontFamily: theme.fonts.bn, fontWeight: 600, fontSize: 38, color: c.ivory, marginTop: 8 }}>খিলাফতও বিলুপ্ত</div>
      </Reveal>
      <Reveal at={C(203) + 0.3} y={30} style={{ position: "absolute", left: 360, top: 720, width: 1200, textAlign: "center" }}>
        <div style={{ fontFamily: theme.fonts.bnSerif, fontWeight: 700, fontSize: 54, color: c.ivory, textShadow: "0 4px 24px #000" }}>উসমানীয় রাজবংশের সুলতানি শাসনের অবসান</div>
      </Reveal>
      <Dust count={22} opacity={0.35} />
    </AbsoluteFill>
  );
};
