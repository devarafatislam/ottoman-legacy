import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { SceneClock } from "../lib/anim";
import { BEATS } from "../data/beats";
import { BEAT_KINDS } from "./Beats";
import { secToFrame } from "../lib/time";
import { theme } from "../theme";

const IN = 16, OUT = 14;
// AE-style shape-layer reveals: iris · horizontal shutter · diagonal wipe · vertical shutter (+ gold edge line)
const Shell = ({ idx, len, children }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [0, IN], [0, 1], { easing: theme.ease.inOut, extrapolateRight: "clamp" });
  const b = interpolate(f, [len - OUT, len], [1, 0], { easing: theme.ease.inOut, extrapolateLeft: "clamp" });
  const p = Math.min(a, b);
  const type = idx % 4;
  let clip, edge = null;
  if (type === 0) { clip = `circle(${p * 82}% at 50% 50%)`; if (p < 0.99) edge = <circle cx={960} cy={540} r={p * 0.82 * 1558} fill="none" stroke="#fff3c9" strokeWidth={5} opacity={0.9} />; }
  if (type === 1) { clip = `inset(0 ${(1 - p) * 50}% 0 ${(1 - p) * 50}%)`; if (p < 0.99) edge = <g stroke="#fff3c9" strokeWidth={4}><line x1={960 - 960 * p} x2={960 - 960 * p} y1={0} y2={1080} /><line x1={960 + 960 * p} x2={960 + 960 * p} y1={0} y2={1080} /></g>; }
  if (type === 2) { const X = p * 135; clip = `polygon(0 0, ${X}% 0, ${X - 26}% 100%, 0 100%)`; if (p < 0.99) edge = <line x1={X * 19.2} y1={0} x2={(X - 26) * 19.2} y2={1080} stroke="#fff3c9" strokeWidth={5} />; }
  if (type === 3) { clip = `inset(${(1 - p) * 50}% 0 ${(1 - p) * 50}% 0)`; if (p < 0.99) edge = <g stroke="#fff3c9" strokeWidth={4}><line y1={540 - 540 * p} y2={540 - 540 * p} x1={0} x2={1920} /><line y1={540 + 540 * p} y2={540 + 540 * p} x1={0} x2={1920} /></g>; }
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: clip }}>{children}</AbsoluteFill>
      {edge && <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 0 12px rgba(255,200,110,0.9))" }}>{edge}</svg>}
    </AbsoluteFill>
  );
};

export const BeatLayer = () =>
  BEATS.map((b) => {
    const Comp = BEAT_KINDS[b.kind];
    const f0 = secToFrame(b.from), f1 = secToFrame(b.to);
    if (!Comp || f1 <= f0) return null;
    return (
      <Sequence key={b.id} from={f0} durationInFrames={f1 - f0} name={`Beat ${b.idx} · ${b.id}`}>
        <SceneClock.Provider value={{ from: f0 }}>
          <Shell idx={b.idx} len={f1 - f0}><Comp s={b.from} e={b.to} {...b.props} /></Shell>
        </SceneClock.Provider>
      </Sequence>
    );
  });
