import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { useClock, prog, Reveal } from "../lib/anim";
import { cueStart as C, SCENES } from "../data/narration";
import { CenturyLayout } from "../components/CenturyLayout";
import { MapStage } from "../components/MapStage";
import { project } from "../lib/geo";
import { Chip } from "../components/Art";

const c = theme.colors;
const S = SCENES[6].start, END = SCENES[7].start;

// Pressure arrows (schematic) — appear while narration describes military/diplomatic challenges
const ARROWS = [
  { from: [36, 52.5], to: [33, 47.2], label: "রুশ সাম্রাজ্য", at: 0.4 },
  { from: [12, 50], to: [19, 45.8], label: "হ্যাবসবুর্গ", at: 1.4 },
  { from: [8, 41.5], to: [17, 38.8], label: "ইউরোপীয় শক্তি", at: 2.4 },
];

export const SceneG = () => {
  const { t } = useClock();
  const mapAt = C(140) - 0.2;
  return (
    <>
      <CenturyLayout
        from={S} to={END} treeOut={mapAt + 0.4}
        art={[
          { from: S, to: C(133), kind: "text", date: "১৭০৩–১৭৩০", dateSize: 56, title: "তৃতীয় আহমেদ" },
          { from: C(133), to: C(137), kind: "tulips" },
          { from: C(137), to: mapAt, kind: "text", date: "১৭৩০–১৭৮৯", dateSize: 56, title: "অষ্টাদশ শতাব্দীর সুলতানরা", sub: "পাঁচজন সুলতান" },
        ]}
        captions={[
          { from: S, to: C(135), title: "তিউলিপ যুগ", sub: "তৃতীয় আহমেদের শাসনামলের একটি সাংস্কৃতিক পর্ব" },
          { from: C(135), to: C(137), title: "শিল্প · স্থাপত্য · সাহিত্য", sub: "ইউরোপীয় সংস্কৃতির প্রতি আগ্রহ বৃদ্ধি" },
          { from: C(137), to: mapAt, title: "প্রথম মাহমুদ → তৃতীয় ওসমান → তৃতীয় মুস্তফা → প্রথম আব্দুল হামিদ", sub: "উত্তরাধিকারের ধারা চলতে থাকে" },
        ]}
      />
      {/* challenges map */}
      <MapStage
        x={700} y={150} w={1160} h={700} seed={11} appear={mapAt}
        camera={[{ t: 0, lon: 25, lat: 44, zoom: 1.05 }]}
        stages={[{ id: "s1566", at: mapAt + 0.3, dur: 2.0, final: true }]}
        routes={ARROWS.map((a) => ({ from: a.from, to: a.to, at: mapAt + 1 + a.at, dur: 1.6, curve: 20 }))}
        regions={ARROWS.map((a) => ({ lonlat: a.from, label: a.label, at: mapAt + 1.4 + a.at, size: 27 }))}
        label="রূপরেখা: ষোড়শ শতাব্দীর বিস্তার · চাপের দিক প্রতীকী"
      />
      <Reveal at={C(140)} y={24} style={{ position: "absolute", left: 60, top: 640 }}>
        <div style={{ borderLeft: `5px solid ${c.goldBright}`, paddingLeft: 24, width: 600 }}>
          <div style={{ fontFamily: theme.fonts.bnSerif, fontWeight: 700, fontSize: 40, lineHeight: 1.3, color: c.ivory }}>সামরিক ও কূটনৈতিক চ্যালেঞ্জ</div>
          <div style={{ fontFamily: theme.fonts.bn, fontSize: 27, lineHeight: 1.45, color: c.ivoryDim, marginTop: 8 }}>ইউরোপের পরিবর্তিত সামরিক ব্যবস্থা পুরোনো শাসনব্যবস্থার দুর্বলতা স্পষ্ট করে</div>
        </div>
      </Reveal>
    </>
  );
};
