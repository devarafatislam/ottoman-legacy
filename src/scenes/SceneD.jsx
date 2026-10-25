import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { useClock, prog, Reveal, window01 } from "../lib/anim";
import { Backdrop, Dust, GoldRule } from "../components/Atmosphere";
import { MapStage } from "../components/MapStage";
import { RulerSpotlight, EventBanner } from "../components/Blocks";
import { RulerCard } from "../components/RulerCard";
import { Skyline, Chip } from "../components/Art";
import { cueStart as C, SCENES } from "../data/narration";
import { BY_ID } from "../data/sultans";
import { toBn } from "../lib/time";

const c = theme.colors;
const S = SCENES[3].start, END = SCENES[4].start;

// ── D1: reign relay chart (Mehmed I → Murad II ⇄ Mehmed II): same identities, repeated reigns ──
const ROWS = [
  { id: "mehmed1", color: c.emeraldLight, bars: [{ from: 1413, to: 1421, at: C(49) }] },
  { id: "murad2", color: c.gold, bars: [{ from: 1421, to: 1444, at: C(53) + 0.5 }, { from: 1446, to: 1451, at: C(60) }] },
  { id: "mehmed2", color: "#7a9bd0", bars: [{ from: 1444, to: 1446, at: C(57) }, { from: 1451, to: 1481, at: C(61) }] },
];
const ReignChart = () => {
  const { t } = useClock();
  const X0 = 760, X1 = 1840, Y0 = 1410, Y1 = 1485;
  const xOf = (y) => X0 + ((y - Y0) / (Y1 - Y0)) * (X1 - X0);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {[1410, 1420, 1430, 1440, 1450, 1460, 1470, 1480].map((y) => (
        <g key={y}>
          <line x1={xOf(y)} x2={xOf(y)} y1={230} y2={690} stroke="rgba(199,160,74,0.18)" strokeWidth={1.2} />
          <text x={xOf(y)} y={722} textAnchor="middle" fontFamily={theme.fonts.bn} fontWeight={600} fontSize={22} fill={c.ivoryDim}>{toBn(y)}</text>
        </g>
      ))}
      {ROWS.map((r, ri) => {
        const y = 280 + ri * 140;
        const lab = prog(t, r.bars[0].at - 0.2, 0.7);
        return (
          <g key={r.id}>
            <text x={X0 - 22} y={y + 38} textAnchor="end" fontFamily={theme.fonts.bnSerif} fontWeight={700} fontSize={30} fill={c.ivory} opacity={lab}>{BY_ID[r.id].bn}</text>
            {r.bars.length > 1 && prog(t, r.bars[1].at, 0.5) > 0 && (
              <path d={`M${xOf(r.bars[0].to)},${y + 25} C${xOf(r.bars[0].to)},${y + 80} ${xOf(r.bars[1].from)},${y + 80} ${xOf(r.bars[1].from)},${y + 25}`} fill="none" stroke={r.color} strokeWidth={2.4} strokeDasharray="6 6" opacity={0.7 * prog(t, r.bars[1].at, 0.8)} />
            )}
            {r.bars.map((b, bi) => {
              const p = prog(t, b.at, 1.3, theme.ease.inOut);
              const w = (xOf(b.to) - xOf(b.from)) * p;
              return (
                <g key={bi}>
                  <rect x={xOf(b.from)} y={y} width={Math.max(w, 0)} height={52} rx={10} fill={r.color} opacity={0.92} />
                  {p > 0.95 && (xOf(b.to) - xOf(b.from) > 150
                    ? <text x={xOf(b.from) + (xOf(b.to) - xOf(b.from)) / 2} y={y + 35} textAnchor="middle" fontFamily={theme.fonts.bn} fontWeight={700} fontSize={22} fill={c.ink}>{toBn(b.from)}–{toBn(b.to)}</text>
                    : <text x={xOf(b.from) + (xOf(b.to) - xOf(b.from)) / 2} y={y + 76} textAnchor="middle" fontFamily={theme.fonts.bn} fontWeight={700} fontSize={21} fill={c.ivory}>{toBn(b.from)}–{toBn(b.to)}</text>)}
                </g>
              );
            })}
          </g>
        );
      })}
      {/* identity note */}
      <g opacity={prog(t, C(60) + 0.4, 0.8)}>
        <text x={X0 - 280} y={800} fontFamily={theme.fonts.bn} fontWeight={600} fontSize={27} fill={c.goldBright}>একই শাসক, দুই দফা শাসন — দ্বিতীয় মুরাদ ও দ্বিতীয় মুহাম্মদ নতুন সুলতান নন</text>
      </g>
    </svg>
  );
};

const Phase = ({ from, to, children }) => {
  const { t } = useClock();
  const v = window01(t, from, to, 0.9, 0.7);
  if (v <= 0.001) return null;
  return <AbsoluteFill style={{ opacity: v }}>{children}</AbsoluteFill>;
};

export const SceneD = () => {
  const { t } = useClock();
  const P1 = [S, C(66) - 0.5], P2 = [C(66) - 0.7, C(77) - 0.2], P3 = [C(77) - 0.4, END];
  return (
    <AbsoluteFill>
      <Backdrop />
      {/* D1 — relay chart */}
      <Phase from={P1[0]} to={P1[1]}>
        <RulerSpotlight from={S} to={C(64)} size="md" left={90} top={190} only={["mehmed1", "murad2", "mehmed2"]} />
        <ReignChart />
      </Phase>

      {/* D2 — 1453 */}
      <Phase from={P2[0]} to={P2[1]}>
        <div style={{ position: "absolute", left: 0, top: 150, width: 1920, height: 720, overflow: "hidden" }}>
          <Skyline top={200} height={520} kind="classic" dim={0.95} />
          <svg width={1920} height={720} style={{ position: "absolute", inset: 0 }}>
            {/* Theodosian-style wall motif (symbolic) */}
            <rect x={0} y={600} width={1920} height={120} fill="#050f1d" />
            {Array.from({ length: 48 }).map((_, i) => <rect key={i} x={i * 42 + 6} y={586} width={26} height={18} fill="#050f1d" />)}
            {[160, 560, 960, 1360, 1760].map((x) => <rect key={x} x={x - 30} y={520} width={60} height={90} fill="#050f1d" />)}
          </svg>
        </div>
        <RulerCard id="mehmed2" at={C(64) - 0.3} out={C(77) - 0.5} size="lg" badge="আল-ফাতিহ · বিজয়ী মুহাম্মদ" style={{ position: "absolute", left: 110, top: 170 }} />
        <div style={{ position: "absolute", left: 640, top: 190, width: 1200 }}>
          <Reveal at={C(66)} y={30}><div style={{ fontFamily: theme.fonts.bnSerif, fontWeight: 700, fontSize: 230, lineHeight: 1, color: c.goldBright, textShadow: "0 10px 50px rgba(0,0,0,0.9)" }}>{toBn(Math.round(1453 - 30 * (1 - prog(t, C(66) + 0.2, 1.8))))}</div></Reveal>
          <Reveal at={C(66) + 0.7} y={16}><GoldRule width={720} style={{ margin: "6px 0" }} /></Reveal>
          <Reveal at={C(68)} y={28}><div style={{ fontFamily: theme.fonts.bnSerif, fontWeight: 700, fontSize: 70, color: c.ivory, textShadow: "0 4px 24px #000" }}>কনস্টান্টিনোপল বিজয়</div></Reveal>
          <Reveal at={C(69)} out={C(72)} y={24} style={{ marginTop: 16 }}><Chip big>বাইজেন্টাইন সাম্রাজ্যের রাজধানী · বহু শতাব্দী</Chip></Reveal>
          <Reveal at={C(70)} out={C(72)} y={24} style={{ marginTop: 14 }}><Chip big>ইউরোপ ও এশিয়ার ইতিহাসে গুরুত্বপূর্ণ পরিবর্তন</Chip></Reveal>
          <Reveal at={C(72)} y={24} style={{ marginTop: 16 }}><Chip big tone="crimson">উসমানীয় সাম্রাজ্যের রাজনৈতিক ও সাংস্কৃতিক কেন্দ্র</Chip></Reveal>
        </div>
        <Reveal at={C(74)} y={24} style={{ position: "absolute", left: 640, top: 690 }}>
          <div style={{ fontFamily: theme.fonts.bn, fontWeight: 600, fontSize: 30, color: c.ivory, textShadow: "0 3px 12px #000" }}>শুধু সীমানা নয় — শাসনামলই এক স্মরণীয় অধ্যায়</div>
        </Reveal>
      </Phase>

      {/* D3 — Bayezid II, Selim I, Egypt 1517 */}
      <Phase from={P3[0]} to={P3[1]}>
        <MapStage
          x={380} y={150} w={1480} h={700} seed={7} appear={P3[0] + 0.1}
          camera={[{ t: 0, lon: 30, lat: 39, zoom: 1.9 }, { t: C(80), lon: 36, lat: 34, zoom: 2.2, dur: 4 }, { t: C(83) - 0.5, lon: 38.5, lat: 25.5, zoom: 2.15, dur: 4 }]}
          stages={[{ id: "s1481", at: C(77) + 0.4, dur: 1.8 }, { id: "s1520", at: C(80) + 0.8, dur: 3.0, final: true }]}
          routes={[{ from: [29.0, 41.0], to: [31.24, 30.04], at: C(81) + 0.2, dur: 2.2, curve: 120, out: C(83) }, { from: [31.24, 30.04], to: [39.7, 22.5], at: C(83) + 0.2, dur: 2.2, curve: 70 }]}
          markers={[
            { place: "constantinople", at: C(79), label: "কনস্টান্টিনোপল", dx: -14, dy: -14, anchor: "end", size: 24, color: c.emeraldMid },
            { place: "damascus", at: C(80) + 2.5, label: "সিরিয়া", dx: 14, dy: -10, size: 24, color: c.emeraldMid },
            { place: "cairo", at: C(82), label: "মিশর · কায়রো", dx: -14, dy: 34, anchor: "end", size: 25, big: true, pulse: true },
            { place: "mecca", at: C(83) + 1.2, label: "মক্কা", dx: 14, dy: 8, size: 26 },
            { place: "medina", at: C(83) + 1.6, label: "মদিনা", dx: 14, dy: 8, size: 26 },
          ]}
          label="আনুমানিক বিস্তার · প্রতীকী মানচিত্র"
        />
        <RulerSpotlight from={C(77) - 0.05} to={END} size="md" left={70} top={190} only={["bayezid2", "selim1"]} />
        <Reveal at={C(82)} y={26} style={{ position: "absolute", left: 400, top: 176 }}>
          <div style={{ padding: "12px 28px", borderRadius: 16, background: "rgba(142,47,47,0.92)", border: `1.5px solid ${c.goldBright}`, fontFamily: theme.fonts.bnSerif, fontWeight: 700, fontSize: 38, color: c.ivory }}>১৫১৭ · মামলুক শাসনের অবসান</div>
        </Reveal>
        <Reveal at={C(83) + 0.4} y={24} style={{ position: "absolute", left: 400, top: 262 }}><Chip big>পবিত্র নগরীগুলোর ওপর উসমানীয় কর্তৃত্ব</Chip></Reveal>
      </Phase>
      <Dust count={24} opacity={0.4} />
    </AbsoluteFill>
  );
};
