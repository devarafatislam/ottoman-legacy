import React, { createContext, useContext } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

// Scenes are mounted inside <Sequence from=...>. SceneClock lets every component
// work in ABSOLUTE narration time (seconds) so beats can be pinned to SRT cue times.
export const SceneClock = createContext({ from: 0 });
export const useClock = () => {
  const local = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { from } = useContext(SceneClock);
  const frame = local + from;
  return { frame, t: frame / fps, local, fps };
};

export const clamp01 = (v) => Math.max(0, Math.min(1, v));

// Eased 0..1 progress starting at absolute second `at`, lasting `dur` seconds.
export const prog = (t, at, dur = 0.8, easing = theme.ease.out) =>
  interpolate(t, [at, at + dur], [0, 1], { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// 0..1..0 window: in at `a`, out finishing at `b`
export const window01 = (t, a, b, inDur = 0.7, outDur = 0.45) =>
  Math.min(prog(t, a, inDur), 1 - prog(t, b - outDur, outDur, theme.ease.in));

// Spring-driven entrance (opacity + rise + scale) — never a lone fade.
export const Reveal = ({ at = 0, out, y = 34, scale = 0.95, cfg = theme.spring.smooth, style, children, blur = 0 }) => {
  const { t, frame, fps } = useClock();
  const p = spring({ frame: frame - Math.round(at * fps), fps, config: cfg });
  const o = out != null ? 1 - prog(t, out - 0.4, 0.4, theme.ease.in) : 1;
  const k = Math.max(0, Math.min(1, p));
  return (
    <div
      style={{
        opacity: k * o,
        transform: `translateY(${(1 - p) * y}px) scale(${scale + (1 - scale) * p})`,
        filter: blur ? `blur(${(1 - k) * blur}px)` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Gold path drawn on (uses pathLength=1 normalisation)
export const DrawPath = ({ d, at, dur = 1.2, stroke = theme.colors.goldBright, width = 3, dash, opacity = 1, markerEnd, style }) => {
  const { t } = useClock();
  const p = prog(t, at, dur, theme.ease.inOut);
  return (
    <path
      d={d}
      pathLength={1}
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
      strokeDasharray={dash ? undefined : "1 1"}
      strokeDashoffset={dash ? undefined : 1 - p}
      opacity={p > 0 ? opacity : 0}
      markerEnd={markerEnd}
      style={style}
    />
  );
};
