import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { theme } from "../theme";
import { useClock, prog, Reveal, window01, DrawPath } from "../lib/anim";
import { Backdrop, Dust, GoldRule } from "../components/Atmosphere";
import { MapStage } from "../components/MapStage";
import { Skyline } from "../components/Art";
import { GoldTitle, Subhead } from "../components/Title";
import { RulerCard } from "../components/RulerCard";
import { cueStart as C } from "../data/narration";
import { toBn } from "../lib/time";

const c = theme.colors;
const CAMERA = [
  { t: 0, lon: 33, lat: 37, zoom: 0.92 },
  { t: 3, lon: 32, lat: 38, zoom: 1.08, dur: 22 },
  { t: C(7) - 0.4, lon: 30.4, lat: 39.8, zoom: 3.6, dur: 3.6 },
  { t: C(9), lon: 29, lat: 36, zoom: 1.5, dur: 5 },
  { t: C(11) + 1, lon: 32, lat: 38, zoom: 1.0, dur: 5 },
];
const DIM = [[0, 0.58], [9, 0.62], [C(4) - 0.2, 0.86], [C(6) + 4.5, 0.86], [C(7) - 0.2, 0.36], [C(9), 0.32], [C(11), 0.6], [C(13) - 0.5, 0.88], [80, 0.88]];
const dimAt = (t) => {
  for (let i = 0; i < DIM.length - 1; i++) if (t < DIM[i + 1][0]) return interpolate(t, [DIM[i][0], DIM[i + 1][0]], [DIM[i][1], DIM[i + 1][1]], { extrapolateLeft: "clamp", easing: theme.ease.inOut });
  return DIM[DIM.length - 1][1];
};

const Ring36 = ({ at, cx = 960, cy = 470, r = 205 }) => {
  const { t } = useClock();
  const n = Math.min(36, Math.floor(prog(t, at + 0.2, 5.6, theme.ease.inOut) * 36.99));
  const wrap = prog(t, at - 0.4, 1.0);
  return (
    <div style={{ position: "absolute", left: cx - 300, top: cy - 300, width: 600, height: 600, opacity: wrap * (1 - prog(t, C(7) - 1.4, 1, theme.ease.in)), transform: `scale(${0.9 + 0.1 * wrap})` }}>
      <svg width={600} height={600}>
        <circle cx={300} cy={300} r={r + 34} fill="none" stroke={c.goldDim} strokeWidth={1.2} strokeDasharray="2 8" opacity={0.7} />
        {Array.from({ length: 36 }).map((_, i) => {
          const a = (i / 36) * Math.PI * 2 - Math.PI / 2;
          const on = i < n;
          return <circle key={i} cx={300 + Math.cos(a) * r} cy={300 + Math.sin(a) * r} r={on ? 11 : 6} fill={on ? c.goldBright : "rgba(199,160,74,0.2)"} stroke={on ? "#fff3c9" : "none"} strokeWidth={1.5} />;
        })}
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: theme.fonts.bnSerif, fontWeight: 700, fontSize: 168, lineHeight: 1, color: c.goldBright, textShadow: "0 8px 30px rgba(0,0,0,0.8)" }}>{toBn(Math.max(n, 0))}</div>
        <div style={{ fontFamily: theme.fonts.bn, fontWeight: 600, fontSize: 34, color: c.ivory, marginTop: 6 }}>স্বতন্ত্র সুলতান</div>
      </div>
    </div>
  );
};

const KEYWORDS = ["বিজয়", "রাজনৈতিক সংঘাত", "ক্ষমতার পালাবদল", "ঐতিহাসিক পরিবর্তন"];

const Question = ({ at, out, children, y = 330, size = 78 }) => (
  <Reveal at={at} out={out} y={40} scale={0.94} style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center" }}>
    <div style={{ fontFamily: theme.fonts.bnSerif, fontWeight: 700, fontSize: size, color: c.ivory, textShadow: "0 6px 30px rgba(0,0,0,0.9)", lineHeight: 1.3 }}>{children}</div>
  </Reveal>
);

const AxisTimeline = ({ at }) => {
  const { t } = useClock();
  const X0 = 220, X1 = 1700, Y = 640;
  const xOf = (yr) => X0 + ((yr - 1299) / (1922 - 1299)) * (X1 - X0);
  const lineP = prog(t, at, 8, theme.ease.inOut);
  const dots = Math.floor(prog(t, C(16) + 0.6, 4.4, theme.ease.inOut) * 36.99);
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={X0} x2={X0 + (X1 - X0) * lineP} y1={Y} y2={Y} stroke={c.goldBright} strokeWidth={4} strokeLinecap="round" />
        {[1300, 1400, 1500, 1600, 1700, 1800, 1900].map((y) => {
          const p = prog(t, at + ((y - 1299) / 623) * 8 - 0.2, 0.6);
          return (
            <g key={y} opacity={p}>
              <line x1={xOf(y)} x2={xOf(y)} y1={Y - 14} y2={Y + 14} stroke={c.gold} strokeWidth={2} />
              <text x={xOf(y)} y={Y + 52} textAnchor="middle" fontFamily={theme.fonts.bn} fontWeight={600} fontSize={26} fill={c.ivoryDim}>{toBn(y)}</text>
            </g>
          );
        })}
        {Array.from({ length: 36 }).map((_, i) => {
          const x = X0 + 30 + (i / 35) * (X1 - X0 - 60);
          return i < dots ? <circle key={i} cx={x} cy={Y} r={8} fill={c.goldBright} stroke="#fff3c9" strokeWidth={1.4} /> : null;
        })}
        <text x={X0} y={Y - 36} textAnchor="middle" fontFamily={theme.fonts.bnSerif} fontWeight={700} fontSize={40} fill={c.goldBright} opacity={prog(t, at + 0.2, 0.8)}>{toBn(1299)}</text>
        <text x={X1} y={Y - 36} textAnchor="middle" fontFamily={theme.fonts.bnSerif} fontWeight={700} fontSize={40} fill={c.goldBright} opacity={prog(t, at + 7.6, 0.8)}>{toBn(1922)}</text>
      </svg>
      <RulerCard id="osman1" at={C(15)} size="sm" style={{ position: "absolute", left: X0 - 98, top: 160 }} />
      <RulerCard id="mehmed6" at={C(16) + 0.4} size="sm" style={{ position: "absolute", left: X1 - 98, top: 160 }} />
      <Reveal at={C(17) + 0.2} y={30} style={{ position: "absolute", left: 0, right: 0, top: 740, textAlign: "center" }}>
        <div style={{ fontFamily: theme.fonts.bnSerif, fontWeight: 700, fontSize: 52, color: c.ivory, textShadow: "0 4px 20px #000" }}>উসমান গাজী থেকে ষষ্ঠ মুহাম্মদ — <span style={{ color: c.goldBright }}>{toBn(36)} জন সুলতান</span></div>
      </Reveal>
    </>
  );
};

export const SceneA = () => {
  const { t } = useClock();
  const dim = dimAt(t);
  const open = prog(t, 0, 2.4, theme.ease.inOut);
  const sky = 1 - prog(t, C(4) - 0.4, 1.4, theme.ease.in);
  return (
    <AbsoluteFill>
      <Backdrop tone="navy" />
      <div style={{ position: "absolute", inset: 0, opacity: open }}>
        <MapStage
          x={0} y={0} w={1920} h={1080} seed={2} appear={0.1} camera={CAMERA}
          stages={[
            { id: "s1299", at: C(9) - 1.2, dur: 1.4, stroke: c.crimson, fill: "#b04a4a" },
            { id: "s1566", at: C(9) + 0.8, dur: 4.2, final: true, fade: C(11) + 2.5 },
          ]}
          markers={[{ place: "soguet", at: C(7) + 0.4, out: C(9) - 1, pulse: true, big: true, label: "সগুত, আনাতোলিয়া", dx: 18, dy: 52, size: 34, light: true }]}
          regions={[
            { lonlat: [20, 49], label: "ইউরোপ", at: C(10) - 0.6, out: C(11) + 1, size: 44, light: true },
            { lonlat: [50, 41], label: "এশিয়া", at: C(10) - 0.3, out: C(11) + 1, size: 44, light: true },
            { lonlat: [16, 28], label: "আফ্রিকা", at: C(10), out: C(11) + 1, size: 44, light: true },
          ]}
        />
        <div style={{ position: "absolute", inset: 0, background: `rgba(3,9,20,${dim})` }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 45%, transparent 30%, rgba(2,6,14,0.7) 100%)" }} />
      </div>

      <div style={{ opacity: sky }}><Skyline top={560} height={520} kind="six" dim={0.95} /></div>
      <Dust count={46} opacity={0.65} />

      {/* ── Title sequence ── */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 285 }}>
        <GoldTitle text="OTTOMAN LEGACY" at={1.8} size={126} out={12.9} />
        <Reveal at={3.9} out={12.9} y={12} style={{ display: "flex", justifyContent: "center", marginTop: 16 }}><GoldRule width={620} /></Reveal>
        <Subhead at={4.5} out={12.9} size={58} color={c.ivory} style={{ marginTop: 14 }}>৩৬ জন সুলতান, এক সাম্রাজ্য</Subhead>
        <Reveal at={6.4} out={12.9} y={14} style={{ textAlign: "center", marginTop: 20 }}>
          <div style={{ fontFamily: theme.fonts.serif, fontStyle: "italic", fontWeight: 600, fontSize: 30, letterSpacing: "0.22em", color: c.goldBright }}>1299 — 1922</div>
        </Reveal>
      </div>

      {/* ── 36 sultans / six centuries ── */}
      <Reveal at={C(4) + 0.1} out={C(7) - 1.2} y={30} style={{ position: "absolute", left: 90, top: 380, width: 470 }}>
        <div style={{ fontFamily: theme.fonts.bn, fontWeight: 600, fontSize: 30, color: c.ivoryDim }}>প্রায়</div>
        <div style={{ fontFamily: theme.fonts.bnSerif, fontWeight: 700, fontSize: 84, color: c.ivory, lineHeight: 1.15 }}>ছয় শতাব্দীরও <span style={{ color: c.goldBright }}>বেশি</span></div>
      </Reveal>
      <Ring36 at={C(4) + 0.2} />
      <div style={{ position: "absolute", left: 1360, top: 330, width: 520 }}>
        {KEYWORDS.map((k, i) => (
          <Reveal key={k} at={C(6) + 0.2 + i * 1.15} out={C(7) - 1.2} y={26} style={{ marginBottom: 20 }}>
            <div style={{ display: "inline-block", padding: "10px 28px", borderRadius: 14, borderLeft: `5px solid ${c.goldBright}`, background: "rgba(4,32,26,0.82)", fontFamily: theme.fonts.bnSerif, fontWeight: 700, fontSize: 40, color: c.ivory, boxShadow: "0 12px 30px rgba(0,0,0,0.5)" }}>{k}</div>
          </Reveal>
        ))}
      </div>

      {/* ── Questions ── */}
      <Question at={C(7) + 0.1} out={C(8) + 1.3} y={250}>কিন্তু এই দীর্ঘ ইতিহাসের শুরু কোথায়?</Question>
      <Question at={C(8) + 0.2} out={C(9) - 0.2} y={140} size={64}>একজন সুলতানের পর কে বসেছিলেন সিংহাসনে?</Question>
      <Question at={C(9) + 0.4} out={C(11) - 0.4} y={150} size={60}>ছোট এক শক্তি → তিন মহাদেশের সাম্রাজ্য</Question>
      <Question at={C(11) + 0.3} out={C(13) - 0.3} y={400} size={72}>আর শেষ পর্যন্ত — কীভাবে অবসান?</Question>

      {/* ── 1299 → 1922 ── */}
      <AxisTimeline at={C(13) + 0.1} />
    </AbsoluteFill>
  );
};
