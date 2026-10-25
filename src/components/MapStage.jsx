import React from "react";
import { interpolate } from "remotion";
import { theme } from "../theme";
import { useClock, prog } from "../lib/anim";
import { Parchment } from "./Atmosphere";
import { PulseDot } from "./FX";
import { LAND_D, BORDERS_D, COAST_D, TURKEY_D, MAP_W, MAP_H, project, smoothRing } from "../lib/geo";
import { STAGES, PLACES } from "../data/mapStages";

const c = theme.colors;
// Solid fills — each stage is composited as ONE group (no darker overlaps / interior seams inside a stage)
const STAGE_FILL = { old: "#9a6a22", mid: "#c4912f", new: "#e6bb4f" };

const camAt = (t, kfs) => {
  let cur = kfs[0];
  for (let i = 1; i < kfs.length; i++) {
    const k = kfs[i];
    if (t < k.t) break;
    const prev = kfs[i - 1];
    const p = interpolate(t, [k.t, k.t + (k.dur ?? 3)], [0, 1], { easing: theme.ease.inOutSlow, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    cur = { lon: prev.lon + (k.lon - prev.lon) * p, lat: prev.lat + (k.lat - prev.lat) * p, zoom: prev.zoom * Math.pow(k.zoom / prev.zoom, p), _done: p >= 1 };
    if (p < 1) return cur;
    cur = { ...k };
  }
  return cur;
};

// Parchment map panel with camera keyframes, cumulative territory stages, markers and routes.
export const MapStage = ({
  x = 60, y = 150, w = MAP_W, h = MAP_H,
  camera, stages = [], markers = [], routes = [], appear = 0, out,
  regions = [], showTurkey, turkeyAt = 0, seed = 1, label,
}) => {
  const { t, frame } = useClock();
  const uid = `${seed}-${w}-${h}-${x}-${y}`;
  const cam = camAt(t, camera);
  const [cx, cy] = project([cam.lon, cam.lat]);
  const z = cam.zoom * (1 + Math.sin(frame / 240) * 0.004);
  const to = (lonlat) => { const [px, py] = project(lonlat); return [(px - cx) * z + w / 2, (py - cy) * z + h / 2]; };
  const gT = `translate(${w / 2} ${h / 2}) scale(${z}) translate(${-cx} ${-cy})`;
  const vis = prog(t, appear, 1.1) * (out != null ? 1 - prog(t, out - 0.6, 0.6, theme.ease.in) : 1);
  const sw = (k) => k / z;

  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: vis, transform: `translateY(${(1 - vis) * 26}px) scale(${0.985 + 0.015 * vis})`, filter: "drop-shadow(0 28px 36px rgba(0,0,0,0.55))" }}>
      <Parchment seed={seed} style={{ width: w, height: h, borderRadius: 10, border: `2px solid ${c.parchmentEdge}` }}>
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <clipPath id={`mapClip-${uid}`}><rect width={w} height={h} /></clipPath>
            <clipPath id={`land-${uid}`}><path d={LAND_D} /></clipPath>
            <filter id="rough"><feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="3" result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale="3" /></filter>
          </defs>
          <g clipPath={`url(#mapClip-${uid})`}>
            <rect width={w} height={h} fill="rgba(112,96,56,0.34)" />
            <g transform={gT}>
              {[...Array(13)].map((_, i) => <line key={`m${i}`} x1={-400} x2={MAP_W + 400} y1={(i - 3) * 90} y2={(i - 3) * 90} stroke="rgba(90,66,26,0.12)" strokeWidth={sw(1)} />)}
              <path d={LAND_D} fill="rgba(241,229,198,0.88)" />
              <path d={BORDERS_D} fill="none" stroke="rgba(90,62,24,0.32)" strokeWidth={sw(1)} strokeDasharray={`${sw(5)} ${sw(4)}`} />
              <path d={COAST_D} fill="none" stroke="rgba(70,48,18,0.72)" strokeWidth={sw(1.5)} />
              {showTurkey && <path d={TURKEY_D} fill={`rgba(214,168,60,${0.62 * prog(t, turkeyAt, 1.4)})`} stroke={c.goldDim} strokeWidth={sw(2.4)} opacity={prog(t, turkeyAt, 1.4)} />}
              <g clipPath={`url(#land-${uid})`}>
                {stages.map((st, i) => {
                  const def = STAGES[st.id];
                  const p = prog(t, st.at, st.dur ?? 1.8);
                  if (p <= 0) return null;
                  const fill = st.fill || (st.final ? STAGE_FILL.new : i === 0 ? STAGE_FILL.old : STAGE_FILL.mid);
                  const k = st.fade != null ? 1 - prog(t, st.fade, 1.4) : 1;
                  const rings = def.polys.map((ring) => smoothRing(ring));
                  const grow = 0.965 + 0.035 * p;
                  return (
                    <g key={st.id} opacity={Math.max(0, k) * p * (st.opacity ?? 0.6)}>
                      {rings.map((d, j) => <path key={`s${j}`} d={d} fill="none" stroke={st.stroke || c.goldDim} strokeWidth={sw(5.4)} strokeLinejoin="round" />)}
                      {rings.map((d, j) => <path key={`f${j}`} d={d} fill={fill} />)}
                    </g>
                  );
                })}
              </g>
            </g>
            {/* screen-space overlays: routes + markers keep constant line weight and text size */}
            {routes.map((r, i) => {
              const p = prog(t, r.at, r.dur ?? 1.8, theme.ease.inOut);
              if (p <= 0) return null;
              const A = to(r.from), B = to(r.to);
              const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2 - (r.curve ?? 60);
              const d = `M${A[0]},${A[1]} Q${mx},${my} ${B[0]},${B[1]}`;
              const fade = r.out != null ? 1 - prog(t, r.out, 0.8, theme.ease.in) : 1;
              return (
                <g key={i} opacity={fade}>
                  <path d={d} fill="none" stroke="rgba(40,26,8,0.5)" strokeWidth={6} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} strokeLinecap="round" />
                  <path d={d} fill="none" stroke={c.goldBright} strokeWidth={3.4} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} strokeLinecap="round" />
                  {p > 0.98 && <circle cx={B[0]} cy={B[1]} r={7} fill={c.goldBright} stroke={c.ink} strokeWidth={2} />}
                  {p >= 1 && <PulseDot d={d} t={t} phase={i * 0.21} speed={0.3} r={5.5} />}
                </g>
              );
            })}
            {markers.map((m, i) => {
              const p = prog(t, m.at, 0.7);
              if (p <= 0) return null;
              const ll = typeof m.place === "string" ? PLACES[m.place].lonlat : m.lonlat;
              const bn = m.label ?? PLACES[m.place]?.bn;
              const [px, py] = to(ll);
              if (px < -40 || px > w + 40 || py < -40 || py > h + 40) return null;
              const fade = m.out != null ? 1 - prog(t, m.out, 0.6, theme.ease.in) : 1;
              const dx = m.dx ?? 14, dy = m.dy ?? -14;
              return (
                <g key={i} opacity={p * fade} transform={`translate(${px} ${py})`}>
                  <circle r={m.big ? 11 : 7} fill={m.color || c.crimson} stroke={c.parchmentLight} strokeWidth={2.4} transform={`scale(${0.6 + 0.4 * p})`} />
                  {m.pulse && <circle r={11 + (frame % 60) * 0.5} fill="none" stroke={c.crimson} strokeWidth={2} opacity={1 - (frame % 60) / 60} />}
                  <text x={dx} y={dy} fontFamily={theme.fonts.bn} fontWeight={700} fontSize={m.size ?? 27} fill={m.light ? c.ivory : c.ink} stroke={m.light ? "rgba(3,9,20,0.95)" : c.parchmentLight} strokeWidth={5} paintOrder="stroke" textAnchor={m.anchor ?? "start"}>{bn}</text>
                </g>
              );
            })}
            {regions.map((r, i) => {
              const p = prog(t, r.at, 0.8);
              if (p <= 0) return null;
              const [px, py] = to(r.lonlat);
              return (
                <g key={i} opacity={p * (r.out != null ? 1 - prog(t, r.out, 0.6, theme.ease.in) : 1)} transform={`translate(${px} ${py})`}>
                  <text textAnchor="middle" fontFamily={theme.fonts.bnSerif} fontWeight={700} fontSize={r.size ?? 30} fill={r.light ? c.ivory : r.color || "rgba(70,48,18,0.85)"} stroke={r.light ? "rgba(3,9,20,0.95)" : c.parchmentLight} strokeWidth={5} paintOrder="stroke" letterSpacing="0.06em">{r.label}</text>
                </g>
              );
            })}
          </g>
        </svg>
        {label && (
          <div style={{ position: "absolute", left: 22, bottom: 16, fontFamily: theme.fonts.bn, fontWeight: 600, fontSize: 20, color: "rgba(60,40,14,0.85)", background: "rgba(240,228,196,0.82)", padding: "4px 14px", borderRadius: 8, border: `1px solid ${c.parchmentEdge}` }}>{label}</div>
        )}
      </Parchment>
    </div>
  );
};
