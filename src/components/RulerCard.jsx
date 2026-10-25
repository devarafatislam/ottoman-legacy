import React from "react";
import { Img, staticFile, interpolate } from "remotion";
import { theme } from "../theme";
import { Reveal, useClock, prog } from "../lib/anim";
import { BY_ID, portrait } from "../data/sultans";
import { spanBn, toBn } from "../lib/time";

const c = theme.colors;
const SIZES = {
  lg: { w: 380, h: 560, pw: 250, ph: 306, name: 40, sub: 22, years: 28 },
  md: { w: 276, h: 436, pw: 182, ph: 222, name: 29, sub: 17, years: 22 },
  sm: { w: 196, h: 290, pw: 128, ph: 156, name: 21, sub: 13, years: 17 },
};

// Gold oval frame around a cropped portrait with slow Ken Burns.
export const OvalPortrait = ({ id, w, h, active = false, dim = false, kb = true, ring = 6 }) => {
  const { t, local } = useClock();
  const s = kb ? 1.03 + Math.min(local / 420, 1) * 0.07 : 1;
  return (
    <div
      style={{
        width: w + ring * 2, height: h + ring * 2, borderRadius: "50%", padding: ring,
        background: `conic-gradient(from 210deg, ${c.goldBright}, ${c.goldDim}, ${c.goldBright}, #fff2c4, ${c.goldDim}, ${c.goldBright})`,
        boxShadow: active ? `0 0 38px ${c.gold}88, 0 14px 30px rgba(0,0,0,0.55)` : "0 14px 30px rgba(0,0,0,0.5)",
        filter: dim ? "saturate(0.55) brightness(0.7)" : undefined,
      }}
    >
      <div style={{ width: w, height: h, borderRadius: "50%", overflow: "hidden", background: c.emeraldDeep, boxShadow: "inset 0 0 18px rgba(0,0,0,0.6)" }}>
        <Img src={staticFile(portrait(id))} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s})` }} />
      </div>
    </div>
  );
};

const Glint = ({ at }) => {
  const { t } = useClock();
  const p = prog(t, at + 0.55, 1.3, theme.ease.inOut);
  return (
    <div style={{ position: "absolute", inset: 0, borderRadius: 22, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: -40, bottom: -40, width: 90, left: `${-30 + p * 160}%`, transform: "skewX(-18deg)", background: "linear-gradient(90deg, transparent, rgba(255,243,201,0.38), transparent)", opacity: p > 0 && p < 1 ? 1 : 0 }} />
    </div>
  );
};

export const RulerCard = ({ id, at, out, size = "md", ret = false, caption, badge, style }) => {
  const s = SIZES[size];
  const r = BY_ID[id];
  return (
    <Reveal at={at} out={out} y={50} scale={0.92} cfg={theme.spring.smooth} style={style}>
      <div
        style={{
          width: s.w, height: s.h, borderRadius: 22, position: "relative",
          background: `linear-gradient(170deg, ${c.emerald}F2, ${c.navy}F7)`,
          border: `1.5px solid ${c.gold}`,
          boxShadow: "0 30px 60px -18px rgba(0,0,0,0.75), inset 0 0 0 6px rgba(4,32,26,0.9), inset 0 0 0 7px rgba(199,160,74,0.35)",
          display: "flex", flexDirection: "column", alignItems: "center", paddingTop: size === "sm" ? 22 : 32,
        }}
      >
        <OvalPortrait id={id} w={s.pw} h={s.ph} active ring={size === "sm" ? 4 : 6} />
        <Glint at={at} />
        <div style={{ marginTop: size === "sm" ? 12 : 20, textAlign: "center", padding: "0 10px" }}>
          <div style={{ fontFamily: theme.fonts.bnSerif, fontWeight: 700, fontSize: s.name, lineHeight: 1.3, color: c.ivory }}>{r.bn}</div>
          <div style={{ fontFamily: theme.fonts.title, fontWeight: 600, fontSize: s.sub, letterSpacing: "0.08em", color: c.goldBright, marginTop: 4 }}>{r.en.toUpperCase()}</div>
          <div style={{ width: s.pw * 0.55, height: 1, margin: "10px auto 8px", background: `linear-gradient(90deg, transparent, ${c.gold}, transparent)` }} />
          <div style={{ fontFamily: theme.fonts.bn, fontWeight: 600, fontSize: r.reigns.length > 1 ? s.years - 5 : s.years, color: c.parchment }}>{spanBn(r.reigns)}</div>
          {caption && <div style={{ fontFamily: theme.fonts.bn, fontWeight: 400, fontSize: s.sub + 3, color: c.ivoryDim, marginTop: 6 }}>{caption}</div>}
        </div>
        <div style={{ position: "absolute", top: -14, left: -14, width: size === "sm" ? 40 : 52, height: size === "sm" ? 40 : 52, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, ${c.goldBright}, ${c.goldDim})`, color: c.ink, fontFamily: theme.fonts.bn, fontWeight: 700, fontSize: size === "sm" ? 19 : 25, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 14px rgba(0,0,0,0.5)" }}>
          {toBn(r.order)}
        </div>
        {(ret || badge) && (
          <div style={{ position: "absolute", bottom: -16, left: "50%", transform: "translateX(-50%)", padding: "5px 18px", borderRadius: 999, background: c.crimson, border: `1px solid ${c.goldBright}`, fontFamily: theme.fonts.bn, fontWeight: 600, fontSize: 17, color: c.ivory, whiteSpace: "nowrap" }}>
            {badge || "পুনরায় সিংহাসনে"}
          </div>
        )}
      </div>
    </Reveal>
  );
};
