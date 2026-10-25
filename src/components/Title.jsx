import React from "react";
import { theme } from "../theme";
import { useClock, Reveal } from "../lib/anim";
import { spring } from "remotion";
import { GoldRule } from "./Atmosphere";

const c = theme.colors;

// Letter-by-letter gold title with a slow light sweep.
export const GoldTitle = ({ text, at = 0, size = 150, per = 2.6, out }) => {
  const { frame, fps, t } = useClock();
  const outP = out != null ? Math.max(0, Math.min(1, (t - (out - 0.9)) / 0.9)) : 0;
  const sweep = ((frame - at * fps) % 240) / 240;
  return (
    <div style={{ display: "flex", justifyContent: "center", opacity: 1 - outP, transform: `translateY(${-outP * 50}px) scale(${1 + outP * 0.05})`, filter: outP ? `blur(${outP * 8}px)` : undefined }}>
      {text.split("").map((ch, i) => {
        const p = spring({ frame: frame - Math.round(at * fps) - i * per, fps, config: theme.spring.soft });
        const n = text.length;
        const hl = Math.max(0, 1 - Math.abs(sweep * 1.6 - 0.3 - i / (n - 1)) * 5); // travelling highlight
        const mix = (a, b, k) => Math.round(a + (b - a) * k);
        const col = `rgb(${mix(199, 255, hl)},${mix(160, 243, hl)},${mix(74, 201, hl)})`;
        return (
          <span
            key={i}
            style={{
              display: "inline-block", width: ch === " " ? size * 0.42 : undefined, fontFamily: theme.fonts.title, fontWeight: 700, fontSize: size, letterSpacing: "0.1em",
              opacity: Math.max(0, Math.min(1, p)), transform: `translateY(${(1 - p) * 46}px) scale(${0.9 + 0.1 * p})`,
              color: col, textShadow: "0 6px 26px rgba(0,0,0,0.8), 0 0 1px rgba(0,0,0,0.6)",
            }}
          >{ch}</span>
        );
      })}
    </div>
  );
};

export const Subhead = ({ children, at = 0, out, size = 54, color = c.ivory, style }) => (
  <Reveal at={at} out={out} y={26} scale={0.97} style={{ textAlign: "center", ...style }}>
    <div style={{ fontFamily: theme.fonts.bnSerif, fontWeight: 600, fontSize: size, color, textShadow: "0 4px 20px rgba(0,0,0,0.8)", lineHeight: 1.3 }}>{children}</div>
  </Reveal>
);

export { GoldRule };
