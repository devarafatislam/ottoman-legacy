import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { useClock, prog, Reveal, window01 } from "../lib/anim";
import { Backdrop, Dust } from "../components/Atmosphere";
import { MapStage } from "../components/MapStage";
import { RulerSpotlight } from "../components/Blocks";
import { OvalPortrait } from "../components/RulerCard";
import { Chip } from "../components/Art";
import { cueStart as C, sceneEnd, SCENES } from "../data/narration";
import { RELATION_BN } from "../data/successions";

const c = theme.colors;
const END = SCENES[2].start;
const CAMERA = [
  { t: 0, lon: 30.6, lat: 40.2, zoom: 3.7 },
  { t: C(29) - 0.6, lon: 26.5, lat: 41.6, zoom: 2.6, dur: 3.6 },
  { t: C(33) + 1, lon: 27.2, lat: 41.2, zoom: 2.15, dur: 4.5 },
];

// Dynasty chain (Osman → Orhan → Murad I → Bayezid I): grows as each ruler is introduced
const CHAIN = [["osman1", 19], ["orhan", 24], ["murad1", 28], ["bayezid1", 33]];
const Chain = () => {
  const { t } = useClock();
  const X0 = 790, DX = 345, Y = 800;
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {CHAIN.slice(1).map(([id, cue], i) => {
          const p = prog(t, C(cue) - 0.2, 0.9, theme.ease.inOut);
          const x1 = X0 + i * DX + 46, x2 = X0 + (i + 1) * DX - 46;
          return (
            <g key={id} opacity={p > 0 ? 1 : 0}>
              <line x1={x1} y1={Y - 12} x2={x1 + (x2 - x1) * p} y2={Y - 12} stroke={c.goldBright} strokeWidth={3.4} strokeLinecap="round" />
              {p > 0.7 && <text x={(x1 + x2) / 2} y={Y - 26} textAnchor="middle" fontFamily={theme.fonts.bn} fontWeight={600} fontSize={20} fill={c.ivory} stroke="rgba(3,9,20,0.9)" strokeWidth={4} paintOrder="stroke">{RELATION_BN.son}</text>}
            </g>
          );
        })}
      </svg>
      {CHAIN.map(([id, cue], i) => (
        <Reveal key={id} at={C(cue)} y={30} style={{ position: "absolute", left: X0 + i * DX - 50, top: Y - 70 }}>
          <OvalPortrait id={id} w={70} h={86} ring={4} kb={false} />
        </Reveal>
      ))}
    </>
  );
};

export const SceneB = () => {
  const { t } = useClock();
  return (
    <AbsoluteFill>
      <Backdrop />
      <MapStage
        x={700} y={150} w={1160} h={560} seed={3} appear={0.2} camera={CAMERA}
        stages={[
          { id: "s1299", at: C(18) + 2.2, dur: 2.2, stroke: c.crimson, fill: "#b04a4a" },
          { id: "s1362", at: C(26) + 0.4, dur: 2.6 },
          { id: "s1389", at: C(29) + 1.0, dur: 3.0 },
          { id: "s1402", at: C(33) + 2.5, dur: 3.2, final: true },
        ]}
        markers={[
          { place: "soguet", at: C(18) + 0.6, pulse: true, big: true, label: "সগুত · আনু. ১২৯৯", dx: 16, dy: 34, size: 25 },
          { place: "bursa", at: C(24) + 1.6, label: "বুরসা", dx: -14, dy: 36, anchor: "end", size: 23, color: c.emeraldMid },
          { place: "edirne", at: C(29) + 2.4, label: "এদির্ন", dx: -12, dy: -14, anchor: "end", size: 23, color: c.emeraldMid },
        ]}
        regions={[
          { lonlat: [32, 38.6], label: "আনাতোলিয়া", at: C(18) + 0.2, out: C(29), size: 32 },
          { lonlat: [27.2, 41.9], label: "বাইজেন্টাইন ভূখণ্ড", at: C(27), out: C(29) + 1, size: 22 },
          { lonlat: [22.5, 42.0], label: "বলকান", at: C(29) + 3.4, size: 32 },
        ]}
        label="আনুমানিক বিস্তার · প্রতীকী মানচিত্র"
      />
      <RulerSpotlight from={C(18)} to={END} size="md" left={150} top={165} only={["osman1", "orhan", "murad1", "bayezid1"]} />
      <Chain />

      <Reveal at={C(23)} out={C(24)} y={24} style={{ position: "absolute", left: 60, top: 660 }}>
        <Chip big>ওসমান → উসমানীয় · অটোমান</Chip>
      </Reveal>
      <Reveal at={C(26)} out={C(28)} y={24} style={{ position: "absolute", left: 60, top: 660 }}>
        <Chip big>সুসংহত প্রশাসনিক কাঠামো</Chip>
      </Reveal>
      <Reveal at={C(31)} out={C(33)} y={24} style={{ position: "absolute", left: 60, top: 660 }}>
        <Chip big>সামরিক অভিযান ও নতুন ভূখণ্ড দখল</Chip>
      </Reveal>
      <Reveal at={C(35)} out={END - 0.2} y={24} style={{ position: "absolute", left: 60, top: 660 }}>
        <Chip big>বায়েজিদ ইলদিরিম — দ্রুত সামরিক অভিযান</Chip>
      </Reveal>
      <Dust count={26} opacity={0.4} />
    </AbsoluteFill>
  );
};
