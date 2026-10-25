import React from "react";
import { theme } from "../theme";
import { useClock, prog, window01, Reveal } from "../lib/anim";
import { MENTIONS } from "../data/narration";
import { RulerCard } from "./RulerCard";
import { Mosque, Tulip, DocCard } from "./Art";
import { toBn } from "../lib/time";
import { GoldRule } from "./Atmosphere";

const c = theme.colors;

// Swaps the big ruler card each time the narration names a new ruler inside [from,to).
export const RulerSpotlight = ({ from, to, size = "md", left = 60, top = 170, only }) => {
  const list = MENTIONS.filter((m) => m.t >= from - 0.01 && m.t < to && (!only || only.includes(m.id)));
  return list.map((m, i) => {
    const next = list[i + 1];
    return (
      <RulerCard key={m.id + m.cue + (m.dt || 0)} id={m.id} at={m.t - 0.2} out={next ? next.t - 0.05 : undefined} size={size} ret={m.ret}
        style={{ position: "absolute", left, top }} />
    );
  });
};

// Framed art panel that crossfades between items: {from,to,kind,...}
export const ArtPanel = ({ items, x = 360, y = 170, w = 320, h = 408 }) => {
  const { t } = useClock();
  const first = items[0].from, last = items[items.length - 1].to;
  const vis = window01(t, first, last, 0.9, 0.6);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: vis, transform: `translateY(${(1 - vis) * 24}px)`, borderRadius: 18, overflow: "hidden", border: `1.5px solid ${c.gold}`, background: `linear-gradient(170deg, ${c.navyMid}, ${c.navyDeep})`, boxShadow: "0 30px 60px -18px rgba(0,0,0,0.75)" }}>
      {items.map((it, i) => {
        const o = window01(t, it.from, it.to, 0.8, 0.6);
        if (o <= 0.001) return null;
        return <div key={i} style={{ position: "absolute", inset: 0, opacity: o, transform: `scale(${0.96 + 0.04 * o})` }}>{renderArt(it, w, h)}</div>;
      })}
    </div>
  );
};

const renderArt = (it, w, h) => {
  if (it.kind === "mosque") {
    return (
      <svg viewBox="0 0 700 890" width={w} height={h} preserveAspectRatio="xMidYMid slice">
        <defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0d1b36" /><stop offset="0.65" stopColor="#7a5f2c" /><stop offset="1" stopColor="#e1b862" /></linearGradient></defs>
        <rect width={700} height={890} fill="url(#pg)" />
        <Mosque cx={350} base={900} s={1.18} minarets={[-3.6, -3.0, -1.7, 1.7, 3.0, 3.6]} fill="#030a14" />
      </svg>
    );
  }
  if (it.kind === "tulips") {
    return (
      <svg viewBox="0 0 320 408" width={w} height={h}>
        <defs><radialGradient id="tg" cx="0.5" cy="0.35"><stop offset="0" stopColor="#4a1d2e" /><stop offset="1" stopColor="#0A1730" /></radialGradient></defs>
        <rect width={320} height={408} fill="url(#tg)" />
        {[[70, 400, 0.9, 0], [160, 404, 1.15, 0.3], [250, 400, 0.85, 0.6], [115, 404, 0.7, 0.9], [210, 404, 0.75, 1.1]].map(([x, y, s, d], i) => <Tulip key={i} x={x} y={y} s={s} delay={it.from + d} hue={i % 2 ? "#C14B3E" : c.crimson} />)}
      </svg>
    );
  }
  if (it.kind === "doc") {
    return (
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: `radial-gradient(circle at 50% 40%, ${c.emeraldMid}, ${c.navyDeep})` }}>
        <div style={{ transform: "scale(0.62)", transformOrigin: "50% 50%" }}><DocCard title={it.title} rot={it.rot ?? -2} /></div>
      </div>
    );
  }
  // text / date
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 26, textAlign: "center", background: `radial-gradient(circle at 50% 35%, ${c.emeraldMid}, ${c.navyDeep})` }}>
      {it.date && <div style={{ fontFamily: theme.fonts.bnSerif, fontWeight: 700, fontSize: it.dateSize ?? 96, color: c.goldBright, lineHeight: 1.1, textShadow: "0 6px 24px rgba(0,0,0,0.8)" }}>{it.date}</div>}
      <GoldRule width={220} style={{ margin: "12px 0" }} />
      <div style={{ fontFamily: theme.fonts.bnSerif, fontWeight: 700, fontSize: 36, lineHeight: 1.35, color: c.ivory }}>{it.title}</div>
      {it.sub && <div style={{ fontFamily: theme.fonts.bn, fontWeight: 400, fontSize: 24, color: c.ivoryDim, marginTop: 8, lineHeight: 1.4 }}>{it.sub}</div>}
    </div>
  );
};

// Caption block below the left column — crossfades between {from,to,title,sub}
export const CaptionStack = ({ items, x = 60, y = 612, w = 620 }) => {
  const { t } = useClock();
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: 240 }}>
      {items.map((it, i) => {
        const o = window01(t, it.from, it.to, 0.7, 0.5);
        if (o <= 0.001) return null;
        return (
          <div key={i} style={{ position: "absolute", inset: 0, opacity: o, transform: `translateY(${(1 - o) * 18}px)`, borderLeft: `5px solid ${c.goldBright}`, paddingLeft: 24 }}>
            <div style={{ fontFamily: theme.fonts.bnSerif, fontWeight: 700, fontSize: 40, lineHeight: 1.3, color: c.ivory, textShadow: "0 3px 14px #000" }}>{it.title}</div>
            {it.sub && <div style={{ fontFamily: theme.fonts.bn, fontWeight: 400, fontSize: 27, lineHeight: 1.45, color: c.ivoryDim, marginTop: 8 }}>{it.sub}</div>}
          </div>
        );
      })}
    </div>
  );
};

// Full-stage cinematic date banner with rolling year counter
export const EventBanner = ({ at, out, year, prefix, title, sub, roll = 36, tone }) => {
  const { t } = useClock();
  const v = window01(t, at, out, 0.9, 0.7);
  if (v <= 0.001) return null;
  const k = prog(t, at + 0.2, 1.6, theme.ease.out);
  const shown = Math.round(year - roll * (1 - k));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 120, height: 760, opacity: v, background: `radial-gradient(ellipse at 50% 45%, rgba(3,9,20,0.95), rgba(3,9,20,0.98))`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${0.985 + 0.015 * v})` }}>
      <div style={{ fontFamily: theme.fonts.bnSerif, fontWeight: 700, fontSize: 220, lineHeight: 1, color: tone === "crimson" ? "#E9A79B" : c.goldBright, textShadow: "0 10px 50px rgba(0,0,0,0.9)", display: "flex", alignItems: "baseline", gap: 24 }}>
        {prefix && <span style={{ fontSize: 96, color: c.ivory }}>{prefix}</span>}
        <span>{toBn(shown)}</span>
      </div>
      <Reveal at={at + 0.7} y={16} style={{ margin: "10px 0 6px" }}><GoldRule width={680} /></Reveal>
      <Reveal at={at + 0.9} y={24}><div style={{ fontFamily: theme.fonts.bnSerif, fontWeight: 700, fontSize: 64, color: c.ivory, textAlign: "center", lineHeight: 1.3, textShadow: "0 4px 20px #000" }}>{title}</div></Reveal>
      {sub && <Reveal at={at + 1.3} y={20}><div style={{ fontFamily: theme.fonts.bn, fontWeight: 400, fontSize: 36, color: c.ivoryDim, marginTop: 10, textAlign: "center" }}>{sub}</div></Reveal>}
    </div>
  );
};

// Stand-in for claimants / non-counted figures (designed silhouette, no fake portrait)
export const Silhouette = ({ w = 90, h = 110, dim }) => (
  <svg width={w} height={h} viewBox="0 0 90 110" style={{ filter: dim ? "grayscale(1) brightness(0.7)" : undefined }}>
    <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1d4a40" /><stop offset="1" stopColor="#0A1730" /></linearGradient></defs>
    <ellipse cx={45} cy={55} rx={43} ry={53} fill="url(#sg)" stroke={c.goldDim} strokeWidth={2.4} />
    <path d="M24 38 C24 20 66 20 66 38 C66 46 60 50 45 50 C30 50 24 46 24 38 Z" fill={c.goldDim} opacity={0.75} />
    <circle cx={45} cy={50} r={13} fill={c.goldDim} opacity={0.55} />
    <path d="M12 100 C16 74 74 74 78 100 Z" fill={c.goldDim} opacity={0.55} />
  </svg>
);
