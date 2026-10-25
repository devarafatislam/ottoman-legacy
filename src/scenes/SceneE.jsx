import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { useClock, prog, Reveal, window01 } from "../lib/anim";
import { Backdrop, Dust } from "../components/Atmosphere";
import { MapStage } from "../components/MapStage";
import { RulerSpotlight } from "../components/Blocks";
import { RulerCard } from "../components/RulerCard";
import { Chip } from "../components/Art";
import { cueStart as C, SCENES } from "../data/narration";
import { RELATION_BN } from "../data/successions";

const c = theme.colors;
const S = SCENES[4].start, END = SCENES[5].start;

// Row of successor cards connected with gold arrows (father → son)
const CHAIN = [["suleiman1", 85], ["selim2", 95], ["murad3", 97, 0], ["mehmed3", 97, 2.3]];
const Chain = ({ at }) => {
  const { t } = useClock();
  const X0 = 270, DX = 440, Y = 440;
  const times = [S, C(95), C(97), C(97) + 2.3];
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {[1, 2, 3].map((i) => {
          const p = prog(t, times[i] - 0.1, 0.9, theme.ease.inOut);
          const x1 = X0 + (i - 1) * DX + 8 + 148, x2 = X0 + i * DX + 8 - 148;
          return (
            <g key={i}>
              <line x1={x1} y1={Y} x2={x1 + (x2 - x1 - 16) * p} y2={Y} stroke={c.goldBright} strokeWidth={4} strokeLinecap="round" />
              {p > 0.9 && <polygon points={`${x2 - 18},${Y - 10} ${x2},${Y} ${x2 - 18},${Y + 10}`} fill={c.goldBright} />}
              {p > 0.7 && <text x={(x1 + x2) / 2} y={Y - 22} textAnchor="middle" fontFamily={theme.fonts.bn} fontWeight={600} fontSize={24} fill={c.ivory} stroke="rgba(3,9,20,0.9)" strokeWidth={5} paintOrder="stroke">{RELATION_BN.son}</text>}
            </g>
          );
        })}
      </svg>
      {CHAIN.map(([id, cue, dt], i) => (
        <RulerCard key={id} id={id} at={times[i] - 0.1} size="md" style={{ position: "absolute", left: X0 + i * DX - 130 + 20 - 20, top: 250, transform: "none" }} />
      ))}
    </>
  );
};

export const SceneE = () => {
  const { t } = useClock();
  const mapOut = C(95) - 0.4;
  const chainVis = prog(t, C(95) - 0.2, 0.9);
  return (
    <AbsoluteFill>
      <Backdrop />
      <MapStage
        x={560} y={150} w={1300} h={700} seed={9} appear={0.2} out={mapOut}
        camera={[{ t: 0, lon: 30, lat: 40, zoom: 1.5 }, { t: C(91), lon: 24, lat: 38, zoom: 1.15, dur: 5 }]}
        stages={[{ id: "s1520", at: 0.3, dur: 0.8 }, { id: "s1566", at: C(88) + 0.5, dur: 3.5, final: true }]}
        routes={[
          { from: [29.0, 41.0], to: [31.24, 30.04], at: C(89), dur: 2.2, curve: 90 },
          { from: [29.0, 41.0], to: [44.37, 33.31], at: C(90), dur: 2.2, curve: 60 },
          { from: [29.0, 41.0], to: [19.0, 47.5], at: C(90) + 0.8, dur: 2.0, curve: 40 },
          { from: [29.0, 41.0], to: [3.0, 36.7], at: C(91), dur: 2.6, curve: 90 },
        ]}
        markers={[
          { place: "constantinople", at: S + 0.6, label: "কনস্টান্টিনোপল", dx: 14, dy: -14, size: 24, big: true },
          { place: "cairo", at: C(89) + 1.6, label: "কায়রো", dx: 12, dy: 28, size: 23, color: c.emeraldMid },
          { place: "baghdad", at: C(90) + 1.6, label: "বাগদাদ", dx: 12, dy: 28, size: 23, color: c.emeraldMid },
        ]}
        regions={[
          { lonlat: [19, 48.2], label: "ইউরোপ", at: C(91) + 0.5, out: mapOut, size: 30 },
          { lonlat: [48, 38], label: "এশিয়া", at: C(91) + 1.0, out: mapOut, size: 30 },
          { lonlat: [14, 29], label: "উত্তর আফ্রিকা", at: C(91) + 1.5, out: mapOut, size: 30 },
        ]}
        label="আনুমানিক বিস্তার · বাণিজ্য ও যোগাযোগের প্রতীকী পথ"
      />
      <RulerSpotlight from={S} to={C(95)} size="lg" left={110} top={170} only={["suleiman1"]} />
      <Reveal at={C(88)} out={mapOut} y={30} style={{ position: "absolute", left: 80, top: 750 }}>
        <div style={{ fontFamily: theme.fonts.bnSerif, fontWeight: 700, fontSize: 72, color: c.goldBright, textShadow: "0 6px 24px #000" }}>১৫২০ – ১৫৬৬</div>
      </Reveal>
      <div style={{ position: "absolute", left: 580, top: 760, display: "flex", gap: 14 }}>
        {["সামরিক শক্তি", "প্রশাসন", "আইন", "সংস্কৃতি"].map((k, i) => (
          <Reveal key={k} at={C(89) + 0.3 + i * 0.9} out={mapOut} y={20}><Chip big>{k}</Chip></Reveal>
        ))}
      </div>
      <Reveal at={C(93)} out={mapOut} y={24} style={{ position: "absolute", left: 580, top: 700 }}>
        <Chip big tone="crimson">উসমানীয় ইতিহাসের অন্যতম শক্তিশালী পর্যায়</Chip>
      </Reveal>
      <div style={{ opacity: chainVis }}><Chain /></div>
      <Reveal at={C(96)} y={24} style={{ position: "absolute", left: 270, top: 720 }}>
        <div style={{ fontFamily: theme.fonts.bn, fontWeight: 600, fontSize: 32, color: c.ivory }}>দ্বিতীয় সেলিম → তৃতীয় মুরাদ → তৃতীয় মুহাম্মদ</div>
      </Reveal>
      <Dust count={24} opacity={0.4} />
    </AbsoluteFill>
  );
};
