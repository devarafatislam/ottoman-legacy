import React, { createContext, useContext, useEffect, useState } from "react";
import { continueRender, delayRender, interpolate, staticFile, useCurrentFrame } from "remotion";
import { parseSrt } from "../lib/srt";
import { theme, FPS } from "../theme";

const SrtContext = createContext([]);
export const useCues = () => useContext(SrtContext);

// Fetches + parses the SUPPLIED .srt at render time. No timing is invented or redistributed.
export const SrtProvider = ({ file, children }) => {
  const [handle] = useState(() => delayRender("Loading SRT"));
  const [cues, setCues] = useState(null);
  useEffect(() => {
    fetch(staticFile(file))
      .then((r) => r.text())
      .then((t) => { setCues(parseSrt(t, FPS)); continueRender(handle); })
      .catch((e) => { console.error("SRT load failed", e); setCues([]); continueRender(handle); });
  }, [file, handle]);
  return cues ? <SrtContext.Provider value={cues}>{children}</SrtContext.Provider> : null;
};

const findCue = (cues, frame) => {
  let lo = 0, hi = cues.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const q = cues[mid];
    if (frame < q.startFrame) hi = mid - 1;
    else if (frame >= q.endFrame) lo = mid + 1;
    else return q;
  }
  return null;
};

// Visible ONLY inside [startFrame, endFrame). Lower safe area, translucent plate, balanced wrap.
export const Subtitles = () => {
  const frame = useCurrentFrame(); // top-level (global) frame
  const cues = useCues();
  const cue = findCue(cues, frame);
  if (!cue) return null;
  const a = interpolate(frame, [cue.startFrame, cue.startFrame + 4], [0, 1], { extrapolateRight: "clamp" });
  const b = interpolate(frame, [cue.endFrame - 3, cue.endFrame], [1, 0], { extrapolateLeft: "clamp" });
  const o = Math.min(a, b);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 62, display: "flex", justifyContent: "center", pointerEvents: "none", opacity: o }}>
      <div
        style={{
          maxWidth: 1560,
          padding: "13px 38px 15px",
          borderRadius: 18,
          background: "linear-gradient(180deg, rgba(4,12,22,0.70), rgba(4,12,22,0.80))",
          border: "1px solid rgba(199,160,74,0.22)",
          boxShadow: "0 14px 40px rgba(0,0,0,0.45)",
          fontFamily: theme.fonts.bn,
          fontWeight: 600,
          fontSize: 45,
          lineHeight: 1.5,
          color: theme.colors.ivory,
          textAlign: "center",
          textWrap: "balance",
          textShadow: "0 2px 6px rgba(0,0,0,0.8)",
          transform: `translateY(${(1 - a) * 8}px)`,
        }}
      >
        {cue.text}
      </div>
    </div>
  );
};
