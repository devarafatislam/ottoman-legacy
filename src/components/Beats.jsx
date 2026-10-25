import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { theme } from "../theme";
import { useClock, prog } from "../lib/anim";
import { Backdrop, GoldRule } from "./Atmosphere";
import { BY_ID, portrait } from "../data/sultans";
import { OvalPortrait, RulerCard } from "./RulerCard";
import { MapStage } from "./MapStage";
import { Mosque, Tulip, DocCard, Chip } from "./Art";
import { Silhouette } from "./Blocks";
import { Icon } from "./Icons";
import { toBn, spanBn } from "../lib/time";

const c = theme.colors;
const F = theme.fonts;

// ───────── small shared pieces ─────────
const Mask = ({ at, children, size = 64, color = c.ivory, align = "center", font = F.bnSerif, weight = 700, h, style, dur = 0.85 }) => {
  const { t } = useClock();
  const p = prog(t, at, dur, theme.ease.out);
  const H = h ?? Math.round(size * 1.55);
  return (
    <div style={{ overflow: "hidden", height: H, ...style }}>
      <div style={{ transform: `translateY(${(1 - p) * 115}%)`, opacity: Math.min(1, p * 3), fontFamily: font, fontWeight: weight, fontSize: size, lineHeight: `${H}px`, color, textAlign: align, whiteSpace: "nowrap", textShadow: "0 6px 26px rgba(0,0,0,0.85)" }}>{children}</div>
    </div>
  );
};
const Pop = ({ at, children, style, y = 60, rot = 0 }) => {
  const { t } = useClock();
  const p = prog(t, at, 0.9, theme.ease.out);
  return <div style={{ opacity: Math.min(1, p * 2.5), transform: `perspective(1200px) translateY(${(1 - p) * y}px) rotateX(${(1 - p) * rot}deg) scale(${0.92 + 0.08 * p})`, ...style }}>{children}</div>;
};
const Glow = ({ x, y, r = 520, color = "rgba(235,203,122,0.16)" }) => <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: `radial-gradient(circle, ${color}, transparent 66%)` }} />;
const Rays = ({ cx, cy, t0, color = "235,203,122", n = 18, len = 1000 }) => {
  const { frame } = useClock();
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <defs><radialGradient id={`rg${cx}`} gradientUnits="userSpaceOnUse" cx={cx} cy={cy} r={len}><stop offset="0" stopColor={`rgba(${color},0.26)`} /><stop offset="1" stopColor={`rgba(${color},0)`} /></radialGradient></defs>
      {Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2 + frame * 0.0016; const a2 = a + 0.075; return <polygon key={i} fill={`url(#rg${cx})`} points={`${cx},${cy} ${cx + Math.cos(a) * len},${cy + Math.sin(a) * len} ${cx + Math.cos(a2) * len},${cy + Math.sin(a2) * len}`} />; })}
    </svg>
  );
};
const Shell = ({ tone = "emerald", children }) => (
  <AbsoluteFill>
    <Backdrop tone={tone === "crimson" ? "navy" : tone} />
    {tone === "crimson" && <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(142,47,47,0.34), rgba(3,9,20,0) 70%)" }} />}
    {children}
  </AbsoluteFill>
);

// ───────── 1. Portrait hero ─────────
export const PortraitHero = ({ s, e, id, epithet, tags = [], flip = false, badge, badgeAt, tone }) => {
  const { t, frame } = useClock();
  const r = BY_ID[id];
  const px = flip ? 1400 : 520, cy = 510, tx = flip ? 130 : 880;
  const pIn = prog(t, s + 0.15, 1.3, theme.ease.out);
  const ringP = prog(t, s + 0.5, 2.2, theme.ease.inOut);
  const sz = r.bn.length > 16 ? 82 : 96;
  const words = r.bn.split(" ");
  return (
    <Shell tone={tone}>
      <Glow x={px} y={cy} r={640} />
      <Rays cx={px} cy={cy} />
      <Img src={staticFile(portrait(id))} style={{ position: "absolute", left: px - 360, top: cy - 440, width: 720, height: 880, objectFit: "cover", filter: "blur(22px) saturate(1.2)", opacity: 0.26 * pIn, transform: `scale(${1.05 + Math.sin(frame / 90) * 0.03})`, borderRadius: "50%" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <circle cx={px} cy={cy} r={262} fill="none" stroke={c.goldDim} strokeWidth={1.5} strokeDasharray="2 9" opacity={pIn} />
        {Array.from({ length: 36 }, (_, i) => {
          const a = (i / 36) * Math.PI * 2 - Math.PI / 2; const on = i + 1 <= r.order * ringP; const cur = i + 1 === r.order && ringP > 0.95;
          return <circle key={i} cx={px + Math.cos(a) * 262} cy={cy + Math.sin(a) * 262} r={cur ? 12 : on ? 6 : 3.5} fill={cur ? c.goldBright : on ? c.gold : "rgba(199,160,74,0.25)"} stroke={cur ? "#fff3c9" : "none"} strokeWidth={2} />;
        })}
      </svg>
      <div style={{ position: "absolute", left: px - 178, top: cy - 214 + Math.sin(frame / 50) * 6, opacity: pIn, transform: `scale(${0.88 + 0.12 * pIn})` }}>
        <OvalPortrait id={id} w={340} h={416} ring={8} active kb />
      </div>
      <div style={{ position: "absolute", left: tx, top: 250, width: 900 }}>
        <Pop at={s + 0.35} y={20}><div style={{ fontFamily: F.bn, fontWeight: 600, fontSize: 34, color: c.goldBright }}>সুলতান {toBn(r.order)} / {toBn(36)}</div></Pop>
        <div style={{ marginTop: 6 }}>
          {words.length > 2 ? [words.slice(0, 1).join(" "), words.slice(1).join(" ")] .map((w, i) => <Mask key={i} at={s + 0.5 + i * 0.18} size={sz} align="left">{w}</Mask>) : <Mask at={s + 0.5} size={sz} align="left">{r.bn}</Mask>}
        </div>
        <Pop at={s + 0.95} y={14}><div style={{ fontFamily: F.title, fontWeight: 600, fontSize: 34, letterSpacing: "0.14em", color: c.goldBright, marginTop: 4 }}>{r.en.toUpperCase()}</div></Pop>
        <Pop at={s + 1.15} y={14}>
          <div style={{ width: 520 * prog(t, s + 1.15, 1.0), height: 2, background: `linear-gradient(90deg, ${c.goldBright}, transparent)`, margin: "18px 0 14px" }} />
          <div style={{ fontFamily: F.bnSerif, fontWeight: 700, fontSize: 52, color: c.parchment }}>{spanBn(r.reigns)}</div>
        </Pop>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 26 }}>
          {[epithet, ...tags].filter(Boolean).map((tg, i) => <Pop key={i} at={s + 1.5 + i * 0.35} y={16}><Chip big>{tg}</Chip></Pop>)}
          {badge && <Pop at={badgeAt ?? s + 2.2} y={16}><Chip big tone="crimson">{badge}</Chip></Pop>}
        </div>
      </div>
    </Shell>
  );
};

// ───────── 2. Fact / step cards ─────────
export const FactCards = ({ s, e, title, cards, flow = false, tone, hue }) => {
  const { t } = useClock();
  const n = cards.length;
  const cw = n <= 2 ? 580 : n === 3 ? 520 : 410, ch = 400, gap = n <= 2 ? 90 : 56;
  const x0 = (1920 - (n * cw + (n - 1) * gap)) / 2, y0 = title ? 330 : 280;
  const step = Math.min(2.4, Math.max(0.7, (e - s - 2) / n));
  return (
    <Shell tone={tone}>
      <Glow x={960} y={520} r={760} color="rgba(235,203,122,0.10)" />
      {title && <div style={{ position: "absolute", left: 0, right: 0, top: 190 }}><Mask at={s + 0.2} size={62}>{title}</Mask><Pop at={s + 0.5} y={0} style={{ display: "flex", justifyContent: "center" }}><GoldRule width={560} /></Pop></div>}
      {flow && cards.slice(1).map((_, i) => { const at = (cards[i + 1].t ?? s + 0.9 + (i + 1) * step) - 0.2; const p = prog(t, at, 0.7); const xa = x0 + i * (cw + gap) + cw, xb = xa + gap; return <svg key={i} width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M${xa + 8} ${y0 + ch / 2} H${xa + 8 + (gap - 16) * p} M${xb - 22} ${y0 + ch / 2 - 12} L${xb - 8} ${y0 + ch / 2} L${xb - 22} ${y0 + ch / 2 + 12}`} stroke={c.goldBright} strokeWidth={4} fill="none" strokeLinecap="round" opacity={p} /></svg>; })}
      {cards.map((cd, i) => {
        const at = cd.t ?? s + 0.9 + i * step;
        const p = prog(t, at, 0.95, theme.ease.out);
        return (
          <div key={i} style={{ position: "absolute", left: x0 + i * (cw + gap), top: y0, width: cw, height: ch, opacity: Math.min(1, p * 2.5), transform: `perspective(1400px) translateY(${(1 - p) * 90}px) rotateX(${(1 - p) * 38}deg) rotateY(${(i % 2 ? 1 : -1) * (1 - p) * 14}deg)`, borderRadius: 24, background: `linear-gradient(170deg, ${hue || c.emerald}F0, ${c.navy}F5)`, border: `1.5px solid ${c.gold}`, boxShadow: `0 40px 70px -20px rgba(0,0,0,0.8), 0 0 ${40 * p}px ${c.gold}33, inset 0 0 0 7px rgba(4,32,26,0.9), inset 0 0 0 8px rgba(199,160,74,0.3)`, display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 30px", textAlign: "center" }}>
            {flow && <div style={{ position: "absolute", top: -22, left: -22, width: 56, height: 56, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, ${c.goldBright}, ${c.goldDim})`, color: c.ink, fontFamily: F.bn, fontWeight: 700, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>{toBn(i + 1)}</div>}
            <Icon name={cd.icon || "star"} size={n >= 4 ? 96 : 118} draw={prog(t, at + 0.25, 1.1, theme.ease.inOut)} />
            <div style={{ fontFamily: F.bnSerif, fontWeight: 700, fontSize: n >= 4 ? 40 : 46, lineHeight: 1.35, color: c.ivory, marginTop: 26 }}>{cd.title}</div>
            {cd.sub && <div style={{ fontFamily: F.bn, fontWeight: 400, fontSize: 27, lineHeight: 1.45, color: c.ivoryDim, marginTop: 12 }}>{cd.sub}</div>}
          </div>
        );
      })}
    </Shell>
  );
};

// ───────── 3. Kinetic typography ─────────
export const Kinetic = ({ s, e, lines, sub, tone, queue, icon }) => {
  const { t, frame } = useClock();
  const total = lines.length;
  const startY = 520 - total * 78 - (sub ? 40 : 0);
  return (
    <Shell tone={tone}>
      <Glow x={960} y={500} r={800} color={tone === "crimson" ? "rgba(214,100,90,0.14)" : "rgba(235,203,122,0.13)"} />
      {[0, 1].map((k) => <div key={k} style={{ position: "absolute", left: k ? "auto" : 0, right: k ? 0 : "auto", top: k ? 800 : 172, height: 2, width: 1500 * prog(t, s + 0.2, 1.4, theme.ease.inOut), background: `linear-gradient(${k ? 270 : 90}deg, ${c.goldBright}, transparent)` }} />)}
      {icon && <div style={{ position: "absolute", left: 960 - 60, top: 176, opacity: prog(t, s + 0.3, 0.8) }}><Icon name={icon} size={120} draw={prog(t, s + 0.3, 1.4, theme.ease.inOut)} /></div>}
      <div style={{ position: "absolute", left: 0, right: 0, top: Math.max(startY, icon ? 330 : 250) }}>
        {lines.map((ln, i) => {
          const L = typeof ln === "string" ? { text: ln } : ln;
          const at = L.at ?? s + 0.5 + i * Math.min(1.6, (e - s - 1.5) / total);
          const col = L.color || (i % 2 ? c.goldBright : c.ivory);
          return <Mask key={i} at={at} size={L.size ?? (total > 2 ? 92 : 112)} color={col} style={{ transform: `translateX(${Math.sin(frame / 70 + i) * 6}px)` }}>{L.text}</Mask>;
        })}
        {sub && <Pop at={s + 0.8 + total * 0.7} y={20} style={{ textAlign: "center", marginTop: 26 }}><div style={{ fontFamily: F.bn, fontWeight: 400, fontSize: 36, color: c.ivoryDim }}>{sub}</div></Pop>}
      </div>
      {queue && (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 7 }, (_, i) => { const p = prog(t, s + 0.8 + i * 0.25, 0.7); const x = 480 + i * 160; const first = i === 0; const hl = prog(t, s + 3.2, 0.8); return (
            <g key={i} opacity={p} transform={`translate(${x} ${790 - (first ? 14 * hl : 0)})`}>
              <circle r={first ? 26 : 20} fill={first ? c.goldBright : "rgba(199,160,74,0.35)"} cy={-34} /><path d={`M${-34} 20 C${-34} -20 34 -20 34 20 Z`} fill={first ? c.goldBright : "rgba(199,160,74,0.35)"} />
              {i < 6 && <path d={`M52 -6 H108 M96 -16 L108 -6 L96 4`} stroke={c.goldDim} strokeWidth={3} fill="none" />}
            </g>); })}
        </svg>
      )}
    </Shell>
  );
};

// ───────── 4. Event stamp ─────────
export const EventStamp = ({ s, e, year, title, sub, art = "sword", tone, prefix, portraitId }) => {
  const { t, frame } = useClock();
  const slam = prog(t, s + 0.35, 0.55, theme.ease.out);
  const shown = Math.round(year - 40 * (1 - prog(t, s + 0.3, 1.6)));
  return (
    <Shell tone={tone}>
      <Glow x={1300} y={470} r={620} color={tone === "crimson" ? "rgba(214,100,90,0.18)" : "rgba(235,203,122,0.16)"} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {[0, 1, 2].map((k) => { const ph = ((t - s) * 0.6 + k / 3) % 1; return <circle key={k} cx={1330} cy={490} r={140 + ph * 260} fill="none" stroke={tone === "crimson" ? "#E9A79B" : c.goldBright} strokeWidth={2.5} opacity={(1 - ph) * 0.55 * prog(t, s + 0.4, 0.6)} />; })}
      </svg>
      <div style={{ position: "absolute", left: 1330 - 130, top: 490 - 130, opacity: prog(t, s + 0.4, 0.7), transform: `scale(${1.6 - 0.6 * slam}) rotate(${(1 - slam) * -14}deg)` }}>
        <Icon name={art} size={260} sw={2.2} draw={prog(t, s + 0.45, 1.6, theme.ease.inOut)} color={tone === "crimson" ? "#F1B8AD" : c.goldBright} />
      </div>
      {portraitId && <div style={{ position: "absolute", left: 1200, top: 650, opacity: prog(t, s + 1.2, 0.8) }}><OvalPortrait id={portraitId} w={86} h={106} ring={4} kb={false} /></div>}
      <div style={{ position: "absolute", left: 110, top: 260, width: 1000 }}>
        <div style={{ fontFamily: F.bnSerif, fontWeight: 700, fontSize: 250, lineHeight: 1.05, color: tone === "crimson" ? "#E9A79B" : c.goldBright, textShadow: "0 10px 50px rgba(0,0,0,0.9)", transform: `translateX(${(1 - slam) * -120}px)`, opacity: Math.min(1, slam * 2), display: "flex", alignItems: "baseline", gap: 24 }}>
          {prefix && <span style={{ fontSize: 80, color: c.ivory }}>{prefix}</span>}{toBn(shown)}
        </div>
        <Pop at={s + 1.0} y={0}><GoldRule width={720} style={{ margin: "4px 0" }} /></Pop>
        <Mask at={s + 1.1} size={62} align="left">{title}</Mask>
        {sub && <Pop at={s + 1.6} y={18}><div style={{ fontFamily: F.bn, fontWeight: 400, fontSize: 34, lineHeight: 1.45, color: c.ivoryDim, marginTop: 10, width: 860 }}>{sub}</div></Pop>}
      </div>
    </Shell>
  );
};

// ───────── 5. Map focus (wraps MapStage with cinematic chips) ─────────
export const MapFocus = ({ s, e, map, chips = [], title }) => {
  const { t } = useClock();
  return (
    <Shell tone="navy">
      <MapStage x={60} y={160} w={1800} h={700} seed={map.seed ?? 4} appear={s + 0.1} {...map} />
      {title && <Pop at={s + 0.6} y={20} style={{ position: "absolute", left: 100, top: 190 }}><Chip big>{title}</Chip></Pop>}
      {chips.map((ch, i) => <Pop key={i} at={ch.t} y={22} style={{ position: "absolute", left: 100, top: 270 + i * 74 }}><Chip big tone={ch.tone}>{ch.text}</Chip></Pop>)}
    </Shell>
  );
};

// ───────── 6. Crossroads: Europe | Asia ─────────
export const Crossroads = ({ s, e, caption, lines = [] }) => {
  const { t, frame } = useClock();
  const p = prog(t, s + 0.2, 1.4, theme.ease.out);
  return (
    <Shell tone="navy">
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs><linearGradient id="land" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c.parchmentLight} /><stop offset="1" stopColor={c.parchmentDark} /></linearGradient><linearGradient id="strait" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1d4a6f" /><stop offset="1" stopColor="#0b2a47" /></linearGradient></defs>
        <path d={`M0 190 H${790 - (1 - p) * 300} Q${850 - (1 - p) * 300} 330 ${800 - (1 - p) * 300} 470 Q${760 - (1 - p) * 300} 640 ${840 - (1 - p) * 300} 860 H0 Z`} fill="url(#land)" stroke={c.parchmentEdge} strokeWidth={3} opacity={0.95} />
        <path d={`M1920 190 H${1130 + (1 - p) * 300} Q${1070 + (1 - p) * 300} 330 ${1120 + (1 - p) * 300} 470 Q${1160 + (1 - p) * 300} 640 ${1090 + (1 - p) * 300} 860 H1920 Z`} fill="url(#land)" stroke={c.parchmentEdge} strokeWidth={3} opacity={0.95} />
        <path d={`M${800 - (1 - p) * 300} 190 Q${850 - (1 - p) * 300} 330 ${800 - (1 - p) * 300} 470 Q${760 - (1 - p) * 300} 640 ${840 - (1 - p) * 300} 860 L${1090 + (1 - p) * 300} 860 Q${1160 + (1 - p) * 300} 640 ${1120 + (1 - p) * 300} 470 Q${1070 + (1 - p) * 300} 330 ${1130 + (1 - p) * 300} 190 Z`} fill="url(#strait)" opacity={0.9} />
        {[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M${900 + k * 24} ${240 + k * 110} q30 -14 60 0 t60 0`} stroke="rgba(200,230,255,0.4)" strokeWidth={2} fill="none" transform={`translate(${Math.sin(frame / 20 + k) * 10} 0)`} />)}
        <path d="M720 520 H1200" stroke={c.goldBright} strokeWidth={5} strokeDasharray="14 12" opacity={prog(t, s + 1.4, 1)} strokeDashoffset={-frame * 0.8} />
        <circle cx={960} cy={520} r={16 + Math.sin(frame / 8) * 3} fill={c.crimson} stroke={c.parchmentLight} strokeWidth={4} opacity={prog(t, s + 1.0, 0.6)} />
        <circle cx={960} cy={520} r={30 + (frame % 50)} fill="none" stroke={c.crimson} strokeWidth={2.4} opacity={(1 - (frame % 50) / 50) * prog(t, s + 1.0, 0.6)} />
      </svg>
      <Pop at={s + 0.7} style={{ position: "absolute", left: 160, top: 480 }}><div style={{ fontFamily: F.bnSerif, fontWeight: 700, fontSize: 86, color: c.ink }}>ইউরোপ</div></Pop>
      <Pop at={s + 0.9} style={{ position: "absolute", right: 170, top: 480 }}><div style={{ fontFamily: F.bnSerif, fontWeight: 700, fontSize: 86, color: c.ink }}>এশিয়া</div></Pop>
      <Pop at={s + 1.2} y={20} style={{ position: "absolute", left: 0, right: 0, top: 570, textAlign: "center" }}><div style={{ display: "inline-block", fontFamily: F.bnSerif, fontWeight: 700, fontSize: 46, color: c.ivory, background: "rgba(3,9,20,0.78)", padding: "6px 30px", borderRadius: 14, border: `1.5px solid ${c.gold}` }}>কনস্টান্টিনোপল</div></Pop>
      <div style={{ position: "absolute", left: 0, right: 0, top: 690, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        {lines.map((l, i) => <Pop key={i} at={l.t} y={18}><Chip big tone={l.tone}>{l.text}</Chip></Pop>)}
      </div>
      {caption && <Pop at={s + 0.4} y={14} style={{ position: "absolute", left: 0, right: 0, top: 172, textAlign: "center" }}><div style={{ fontFamily: F.bn, fontWeight: 600, fontSize: 30, color: c.goldBright }}>{caption}</div></Pop>}
    </Shell>
  );
};

// ───────── 7. Landmark (mosque silhouette rising) ─────────
export const Landmark = ({ s, e, title, sub, minarets = [-3.6, -3.0, -1.7, 1.7, 3.0, 3.6] }) => {
  const { t, frame } = useClock();
  const rise = prog(t, s + 0.2, 2.6, theme.ease.out);
  return (
    <Shell tone="navy">
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs><linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="rgba(10,23,48,0)" /><stop offset="0.55" stopColor="rgba(199,160,74,0.26)" /><stop offset="1" stopColor="rgba(235,203,122,0.6)" /></linearGradient>
          <radialGradient id="sun"><stop offset="0" stopColor="rgba(255,226,160,0.6)" /><stop offset="1" stopColor="rgba(255,226,160,0)" /></radialGradient>
          <clipPath id="ground"><rect x={0} y={150} width={1920} height={720} /></clipPath></defs>
        <rect x={0} y={150} width={1920} height={720} fill="url(#sky2)" />
        <circle cx={960} cy={560} r={360} fill="url(#sun)" opacity={0.9 * rise} />
        <g clipPath="url(#ground)" transform={`translate(0 ${(1 - rise) * 380})`}>
          <g opacity={0.5}><Mosque cx={330} base={900} s={0.8} minarets={[-2.5, 2.5]} fill={c.navyMid} /><Mosque cx={1600} base={900} s={0.86} minarets={[-2.6, 2.6]} fill={c.navyMid} /></g>
          <Mosque cx={960} base={930} s={1.5} minarets={minarets} fill="#030a14" glow="rgba(235,203,122,0.3)" />
        </g>
        {Array.from({ length: 26 }, (_, i) => { const r = (n) => { const x = Math.sin(i * 12.9 + n * 7.7) * 4375.85; return x - Math.floor(x); }; return <circle key={i} cx={r(1) * 1920} cy={170 + r(2) * 330} r={1 + r(3) * 2.2} fill="#fff3c9" opacity={(0.4 + 0.5 * Math.sin(frame / 12 + i)) * prog(t, s + 0.5, 1)} />; })}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 178 }}>
        <Mask at={s + 1.0} size={62}>{title}</Mask>
        {sub && <Pop at={s + 1.7} y={14}><div style={{ textAlign: "center", fontFamily: F.bn, fontWeight: 400, fontSize: 34, color: c.ivory, textShadow: "0 3px 14px #000" }}>{sub}</div></Pop>}
      </div>
    </Shell>
  );
};

// ───────── 8. Ruler chain (2–4 cards with relation arrows) ─────────
export const TriCards = ({ s, e, items, size = "md", tone }) => {
  const { t } = useClock();
  const n = items.length;
  const cw = size === "md" ? 276 : 196, gap = n >= 4 ? 120 : 190;
  const x0 = (1920 - (n * cw + (n - 1) * gap)) / 2, y0 = 220;
  return (
    <Shell tone={tone}>
      <Glow x={960} y={470} r={760} color="rgba(235,203,122,0.10)" />
      {items.slice(1).map((it, i) => {
        const p = prog(t, it.t - 0.1, 0.9, theme.ease.inOut);
        const xa = x0 + i * (cw + gap) + cw + 12, xb = xa + gap - 24, yy = y0 + 200;
        return (
          <svg key={i} width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <line x1={xa} y1={yy} x2={xa + (xb - xa) * p} y2={yy} stroke={c.goldBright} strokeWidth={4.5} strokeLinecap="round" />
            {p > 0.92 && <polygon points={`${xb - 18},${yy - 11} ${xb},${yy} ${xb - 18},${yy + 11}`} fill={c.goldBright} />}
            {p > 0.6 && <text x={(xa + xb) / 2} y={yy - 20} textAnchor="middle" fontFamily={F.bn} fontWeight={600} fontSize={26} fill={c.ivory} stroke="rgba(3,9,20,0.9)" strokeWidth={5} paintOrder="stroke" opacity={p}>{it.rel}</text>}
          </svg>
        );
      })}
      {items.map((it, i) => <RulerCard key={it.id} id={it.id} at={it.t - 0.25} size={size} ret={false} badge={it.badge} style={{ position: "absolute", left: x0 + i * (cw + gap), top: y0 }} />)}
      {items.map((it, i) => it.note && <Pop key={`n${i}`} at={it.t + 0.8} y={14} style={{ position: "absolute", left: x0 + i * (cw + gap) - 60, width: cw + 120, top: y0 + 470, textAlign: "center" }}><div style={{ fontFamily: F.bn, fontWeight: 600, fontSize: 28, color: c.goldBright }}>{it.note}</div></Pop>)}
    </Shell>
  );
};

// ───────── 9. Succession swap: brother instead of son ─────────
export const Swap = ({ s, e, a, b, label = "ভাই", skip = "পুত্র নয়" }) => {
  const { t, frame } = useClock();
  const ax = 480, bx = 1440, my = 480;
  const p = prog(t, s + 1.6, 1.4, theme.ease.inOut);
  return (
    <Shell tone="navy">
      <Glow x={960} y={500} r={760} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <path d={`M${ax + 190} ${my - 40} Q960 ${my - 330} ${bx - 190} ${my - 40}`} fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth={9} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} strokeLinecap="round" />
        <path d={`M${ax + 190} ${my - 40} Q960 ${my - 330} ${bx - 190} ${my - 40}`} fill="none" stroke={c.goldBright} strokeWidth={5} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} strokeLinecap="round" />
        {p > 0.95 && <polygon points={`${bx - 200},${my - 70} ${bx - 176},${my - 36} ${bx - 214},${my - 30}`} fill={c.goldBright} />}
        <g opacity={prog(t, s + 1.0, 0.7)}>
          <circle cx={960} cy={my + 40} r={92} fill="rgba(4,32,26,0.85)" stroke={c.goldDim} strokeWidth={3} strokeDasharray="8 8" />
          <circle cx={960} cy={my + 20} r={22} fill="rgba(199,160,74,0.45)" /><path d={`M920 ${my + 90} C920 ${my + 40} 1000 ${my + 40} 1000 ${my + 90} Z`} fill="rgba(199,160,74,0.45)" />
          <path d={`M900 ${my - 20} L1020 ${my + 100} M1020 ${my - 20} L900 ${my + 100}`} stroke="#E08A7E" strokeWidth={7} strokeLinecap="round" strokeDasharray={1} pathLength={1} strokeDashoffset={1 - prog(t, s + 1.3, 0.6)} />
        </g>
      </svg>
      <div style={{ position: "absolute", left: ax - 178, top: my - 214 }}><Pop at={s + 0.2} y={40}><OvalPortrait id={a} w={340} h={416} ring={7} /></Pop></div>
      <div style={{ position: "absolute", left: bx - 178, top: my - 214 }}><Pop at={s + 2.2} y={40}><OvalPortrait id={b} w={340} h={416} ring={7} active /></Pop></div>
      <div style={{ position: "absolute", left: ax - 200, width: 400, top: my + 240, textAlign: "center", fontFamily: F.bnSerif, fontWeight: 700, fontSize: 44, color: c.ivory, opacity: prog(t, s + 0.5, 0.7) }}>{BY_ID[a].bn}</div>
      <div style={{ position: "absolute", left: bx - 200, width: 400, top: my + 240, textAlign: "center", fontFamily: F.bnSerif, fontWeight: 700, fontSize: 44, color: c.goldBright, opacity: prog(t, s + 2.4, 0.7) }}>{BY_ID[b].bn}</div>
      <Pop at={s + 1.1} y={16} style={{ position: "absolute", left: 0, right: 0, top: my + 150, textAlign: "center" }}><div style={{ display: "inline-block", fontFamily: F.bn, fontWeight: 600, fontSize: 30, color: "#F1B8AD", background: "rgba(3,9,20,0.8)", padding: "4px 20px", borderRadius: 10 }}>{skip}</div></Pop>
      <Pop at={s + 2.6} y={16} style={{ position: "absolute", left: 0, right: 0, top: my - 330, textAlign: "center" }}><div style={{ display: "inline-block", fontFamily: F.bnSerif, fontWeight: 700, fontSize: 60, color: c.goldBright, textShadow: "0 4px 20px #000" }}>{label}</div></Pop>
    </Shell>
  );
};

// ───────── 10. Return loop (same ruler, two reigns) ─────────
export const ReturnLoop = ({ s, e, id, r1, r2, note }) => {
  const { t, frame } = useClock();
  const p1 = prog(t, s + 0.8, 1.2, theme.ease.inOut), p2 = prog(t, s + 2.8, 1.6, theme.ease.inOut);
  return (
    <Shell tone="navy">
      <Glow x={960} y={480} r={720} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <path d="M300 640 H760" stroke={c.goldBright} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p1} />
        <path d="M760 640 H1100" stroke="#E08A7E" strokeWidth={4} strokeDasharray="10 12" opacity={prog(t, s + 1.8, 0.8)} />
        <path d="M1100 640 H1620" stroke={c.goldBright} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p2} />
        <path d="M1500 610 C1500 380 420 380 420 610" fill="none" stroke={c.goldBright} strokeWidth={4} strokeDasharray="14 10" opacity={prog(t, s + 3.8, 0.8)} strokeDashoffset={-frame} />
        {[[300, r1[0]], [760, r1[1]], [1100, r2[0]], [1620, r2[1]]].map(([x, y], i) => <g key={i} opacity={prog(t, s + 0.9 + i * 0.9, 0.6)}><circle cx={x} cy={640} r={13} fill={c.goldBright} stroke="#fff3c9" strokeWidth={2} /><text x={x} y={700} textAnchor="middle" fontFamily={F.bnSerif} fontWeight={700} fontSize={36} fill={c.ivory}>{toBn(y)}</text></g>)}
        <text x={530} y={600} textAnchor="middle" fontFamily={F.bn} fontWeight={600} fontSize={30} fill={c.parchment} opacity={prog(t, s + 1.5, 0.6)}>প্রথম দফা</text>
        <text x={1360} y={600} textAnchor="middle" fontFamily={F.bn} fontWeight={600} fontSize={30} fill={c.parchment} opacity={prog(t, s + 3.6, 0.6)}>দ্বিতীয় দফা</text>
        <text x={930} y={625} textAnchor="middle" fontFamily={F.bn} fontWeight={600} fontSize={26} fill="#F1B8AD" opacity={prog(t, s + 2.0, 0.6)}>অন্য শাসক</text>
      </svg>
      <div style={{ position: "absolute", left: 960 - 170, top: 180 + Math.sin(frame / 45) * 5 }}><Pop at={s + 0.2} y={40}><OvalPortrait id={id} w={300} h={366} ring={7} active /></Pop></div>
      <Pop at={s + 4.2} y={20} style={{ position: "absolute", left: 0, right: 0, top: 760, textAlign: "center" }}><div style={{ display: "inline-block", fontFamily: F.bnSerif, fontWeight: 700, fontSize: 48, color: c.ivory, background: "rgba(142,47,47,0.9)", padding: "8px 36px", borderRadius: 16, border: `1.5px solid ${c.goldBright}` }}>{note || "একই শাসক · দুই দফা শাসন"}</div></Pop>
    </Shell>
  );
};

// ───────── 11. Tulip era ─────────
export const TulipEra = ({ s, e, chips = [] }) => {
  const { t } = useClock();
  const spots = [140, 330, 520, 700, 880, 1040, 1220, 1400, 1580, 1760];
  return (
    <Shell tone="navy">
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 90%, rgba(120,40,60,0.55), rgba(3,9,20,0) 65%)" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {spots.map((x, i) => <Tulip key={i} x={x + (i % 2) * 24} y={900 + (i % 3) * 14} s={1.25 + (i % 3) * 0.28} delay={s + 0.6 + i * 0.32} hue={i % 3 === 0 ? "#C14B3E" : i % 3 === 1 ? c.crimson : "#D9733F"} />)}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 190 }}>
        <Mask at={s + 0.4} size={108}>তিউলিপ যুগ</Mask>
        <Pop at={s + 1.0} y={0} style={{ display: "flex", justifyContent: "center" }}><GoldRule width={640} /></Pop>
        <Pop at={s + 1.2} y={14}><div style={{ textAlign: "center", fontFamily: F.bn, fontWeight: 600, fontSize: 36, color: c.goldBright, marginTop: 6 }}>তৃতীয় আহমেদের শাসনামলের সাংস্কৃতিক পর্ব</div></Pop>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 480, display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", padding: "0 160px" }}>
        {chips.map((ch, i) => <Pop key={i} at={ch.t} y={20}><Chip big>{ch.text}</Chip></Pop>)}
      </div>
    </Shell>
  );
};

// ───────── 12. Pillars (rising columns with icons) ─────────
export const FourPillars = ({ s, e, title, date, pillars, tone }) => {
  const { t } = useClock();
  const n = pillars.length;
  const gap = n === 4 ? 360 : 440, x0 = 960 - ((n - 1) * gap) / 2;
  return (
    <Shell tone={tone}>
      <Glow x={960} y={560} r={800} color="rgba(235,203,122,0.12)" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 176 }}>
        {date && <Mask at={s + 0.2} size={70} color={c.goldBright}>{date}</Mask>}
        <Mask at={s + 0.45} size={54}>{title}</Mask>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <rect x={160} y={830} width={1600} height={10} fill={c.goldDim} opacity={prog(t, s + 0.3, 0.8)} />
        {pillars.map((pl, i) => {
          const at = pl.t ?? s + 1.0 + i * 1.0;
          const p = prog(t, at, 1.3, theme.ease.out);
          const h = 360 * p, x = x0 + i * gap;
          return (
            <g key={i}>
              <rect x={x - 70} y={830 - h} width={140} height={h} fill="url(#pil)" stroke={c.gold} strokeWidth={2} />
              <rect x={x - 92} y={830 - h - 22} width={184} height={22} fill={c.goldDim} stroke={c.goldBright} strokeWidth={1.5} opacity={p > 0.02 ? 1 : 0} />
              {[-40, -13, 14, 41].map((dx) => <line key={dx} x1={x + dx} x2={x + dx} y1={830 - h + 10} y2={830 - 14} stroke="rgba(235,203,122,0.25)" strokeWidth={3} />)}
            </g>
          );
        })}
        <defs><linearGradient id="pil" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={c.emerald} /><stop offset="0.5" stopColor={c.emeraldMid} /><stop offset="1" stopColor={c.emerald} /></linearGradient></defs>
      </svg>
      {pillars.map((pl, i) => {
        const at = pl.t ?? s + 1.0 + i * 1.0; const p = prog(t, at + 0.6, 0.8);
        const x = x0 + i * gap;
        return (
          <div key={i} style={{ position: "absolute", left: x - 200, width: 400, top: 830 - 360 - 22 - 190, textAlign: "center", opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
            <div style={{ display: "flex", justifyContent: "center" }}><Icon name={pl.icon} size={104} draw={prog(t, at + 0.7, 1.0, theme.ease.inOut)} /></div>
            <div style={{ fontFamily: F.bnSerif, fontWeight: 700, fontSize: 48, color: c.ivory, marginTop: 10, textShadow: "0 4px 18px #000" }}>{pl.label}</div>
          </div>
        );
      })}
    </Shell>
  );
};

// ───────── 13. Reform document + bullet points ─────────
export const DocReform = ({ s, e, docTitle, bullets, heading }) => {
  const { t } = useClock();
  const p = prog(t, s + 0.3, 1.2, theme.ease.out);
  return (
    <Shell tone="navy">
      <Glow x={560} y={520} r={600} />
      <div style={{ position: "absolute", left: 250, top: 205, opacity: p, transform: `translateX(${(1 - p) * -160}px) rotate(${(1 - p) * -10}deg) scale(${0.9 + 0.1 * p})` }}><DocCard title={docTitle} rot={-3} w={470} h={600} /></div>
      <div style={{ position: "absolute", left: 880, top: 220, width: 940 }}>
        <Mask at={s + 0.6} size={70} align="left" color={c.goldBright}>{heading}</Mask>
        <Pop at={s + 0.9} y={0}><div style={{ width: 640 * prog(t, s + 0.9, 1.0), height: 2, background: `linear-gradient(90deg, ${c.goldBright}, transparent)`, margin: "6px 0 30px" }} /></Pop>
        {bullets.map((b, i) => {
          const at = b.t ?? s + 1.4 + i * 1.8;
          return (
            <Pop key={i} at={at} y={30} style={{ display: "flex", alignItems: "center", gap: 26, marginBottom: 28, padding: "20px 30px", borderRadius: 18, background: "rgba(4,32,26,0.85)", border: `1px solid ${c.gold}`, boxShadow: "0 18px 40px rgba(0,0,0,0.5)" }}>
              <Icon name={b.icon || "gear"} size={74} draw={prog(t, at + 0.2, 1, theme.ease.inOut)} />
              <div style={{ fontFamily: F.bnSerif, fontWeight: 700, fontSize: 46, color: c.ivory, lineHeight: 1.3 }}>{b.text}</div>
            </Pop>
          );
        })}
      </div>
    </Shell>
  );
};

// ───────── 14. Compare ─────────
export const Compare = ({ s, e, left, right, tl, tr }) => {
  const { t } = useClock();
  const a = prog(t, s + 0.3, 1.1, theme.ease.out), b = prog(t, tr ?? s + 2.6, 1.1, theme.ease.out);
  const panel = (side, d, p, tone) => (
    <div style={{ position: "absolute", [side]: 90, top: 240, width: 780, height: 520, opacity: Math.min(1, p * 2), transform: `translateX(${(side === "left" ? -1 : 1) * (1 - p) * 300}px)`, borderRadius: 26, background: `linear-gradient(170deg, ${tone === "crimson" ? "#4a1d24" : c.emerald}F2, ${c.navy}F7)`, border: `2px solid ${tone === "crimson" ? "#E08A7E" : c.gold}`, boxShadow: "0 40px 70px -20px rgba(0,0,0,0.8)", padding: "46px 44px", textAlign: "center" }}>
      <Icon name={d.icon} size={120} draw={p} color={tone === "crimson" ? "#F1B8AD" : c.goldBright} />
      <div style={{ fontFamily: F.bnSerif, fontWeight: 700, fontSize: 54, lineHeight: 1.35, color: c.ivory, marginTop: 24 }}>{d.title}</div>
      <div style={{ fontFamily: F.bn, fontSize: 30, lineHeight: 1.5, color: c.ivoryDim, marginTop: 14 }}>{d.sub}</div>
    </div>
  );
  return (
    <Shell tone="navy">
      {panel("left", left, a, "gold")}
      {panel("right", right, b, "crimson")}
      <div style={{ position: "absolute", left: 960 - 56, top: 460, width: 112, height: 112, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, ${c.goldBright}, ${c.goldDim})`, color: c.ink, fontFamily: F.title, fontWeight: 700, fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 30px rgba(0,0,0,0.6)", opacity: b, transform: `scale(${0.5 + 0.5 * b})` }}>VS</div>
    </Shell>
  );
};

// ───────── 15. Year sweep (interregnum) ─────────
export const YearSweep = ({ s, e, from, to, label, big }) => {
  const { t } = useClock();
  const p = prog(t, s + 0.6, Math.min(6, e - s - 1.6), theme.ease.inOut);
  const X0 = 240, X1 = 1680, n = to - from;
  const x = X0 + (X1 - X0) * p;
  const yr = Math.round(from + n * p);
  return (
    <Shell tone="crimson">
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs><pattern id="hatch2" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="4" height="9" fill={c.crimson} /></pattern></defs>
        <rect x={X0} y={600} width={(X1 - X0) * p} height={46} fill="url(#hatch2)" stroke={c.crimson} strokeWidth={2} />
        <line x1={X0} x2={X1} y1={623} y2={623} stroke={c.goldDim} strokeWidth={2} />
        {Array.from({ length: n + 1 }, (_, i) => { const xx = X0 + ((X1 - X0) * i) / n; return <g key={i} opacity={prog(t, s + 0.3 + i * 0.1, 0.5)}><line x1={xx} x2={xx} y1={588} y2={658} stroke={c.gold} strokeWidth={i % 11 === 0 ? 3 : 1.6} /><text x={xx} y={706} textAnchor="middle" fontFamily={F.bn} fontWeight={600} fontSize={26} fill={c.ivoryDim}>{toBn(from + i)}</text></g>; })}
        <line x1={x} x2={x} y1={520} y2={680} stroke={c.goldBright} strokeWidth={4} /><polygon points={`${x - 14},510 ${x + 14},510 ${x},536`} fill={c.goldBright} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 210, textAlign: "center", fontFamily: F.bnSerif, fontWeight: 700, fontSize: 210, lineHeight: 1, color: "#E9A79B", textShadow: "0 10px 46px #000" }}>{toBn(yr)}</div>
      <Pop at={s + 0.4} y={14} style={{ position: "absolute", left: 0, right: 0, top: 430, textAlign: "center" }}><div style={{ fontFamily: F.bnSerif, fontWeight: 700, fontSize: 52, color: c.ivory }}>{label}</div></Pop>
      {big && <Pop at={s + (e - s) * 0.7} y={30} style={{ position: "absolute", left: 0, right: 0, top: 740, textAlign: "center" }}><div style={{ display: "inline-block", fontFamily: F.bnSerif, fontWeight: 700, fontSize: 60, color: c.goldBright, textShadow: "0 4px 20px #000" }}>{big}</div></Pop>}
    </Shell>
  );
};

// ───────── dispatcher ─────────
export const BEAT_KINDS = { hero: PortraitHero, facts: FactCards, kinetic: Kinetic, event: EventStamp, map: MapFocus, crossroads: Crossroads, landmark: Landmark, chain: TriCards, swap: Swap, loop: ReturnLoop, tulips: TulipEra, pillars: FourPillars, doc: DocReform, compare: Compare, sweep: YearSweep };
