import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FontLoader } from "./components/Fonts";
import { SrtProvider, Subtitles } from "./components/Subtitles";
import { Grade, Grain, Vignette } from "./components/Atmosphere";
import { SceneClock } from "./lib/anim";
import { SCENES, sceneEnd } from "./data/narration";
import { secToFrame, toBn } from "./lib/time";
import { SCENE_COMPONENTS } from "./scenes";
import { Timeline } from "./components/Timeline";
import { AudioBed, IMPACTS } from "./components/AudioBed";
import { LightLeak, ChapterCard } from "./components/FX";
import { BeatLayer } from "./components/BeatLayer";
import { theme } from "./theme";

const PRE = 22; // frames the incoming scene wipes in BEFORE its narration anchor

const CHAPTER_YEARS = { B: "১২৯৯ – ১৪০২", C: "১৪০২ – ১৪১৩", D: "১৪১৩ – ১৫২০", E: "১৫২০ – ১৬০৩", F: "১৬০৩ – ১৭০৩", G: "১৭০৩ – ১৭৮৯", H: "১৭৮৯ – ১৯০৯", I: "১৯০৯ – ১৯২২", J: "৩৬ জন সুলতান · এক উত্তরাধিকার" };

export const Documentary = () => {
  const { durationInFrames, fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const t = frame / fps;

  // impact shake + flash (After-Effects style "camera hit")
  let sx = 0, sy = 0, flash = 0;
  IMPACTS.forEach((it) => {
    const d = t - it;
    if (d >= -0.05 && d < 0.9) {
      const amp = 11 * Math.exp(-Math.max(d, 0) * 8);
      sx += Math.sin(d * 95) * amp; sy += Math.cos(d * 73) * amp * 0.6;
      flash = Math.max(flash, 0.28 * Math.exp(-Math.max(d, 0) * 11));
    }
  });
  const boosts = SCENES.slice(1).map((s) => s.start - 0.3);

  return (
    <FontLoader>
      <SrtProvider file="ottoman_36_sultans_bn_subtitles.aligned.srt">
        <AbsoluteFill style={{ background: "#020812" }}>
          <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px) scale(${1 + Math.abs(sx) * 0.0006})` }}>
            {SCENES.map((s, i) => {
              const Comp = SCENE_COMPONENTS[s.id];
              if (!Comp) return null;
              const startF = secToFrame(s.start);
              const endF = i + 1 < SCENES.length ? secToFrame(sceneEnd(i)) : durationInFrames;
              const from = Math.max(0, startF - (i === 0 ? 0 : PRE));
              return (
                <Sequence key={s.id} from={from} durationInFrames={endF - from} name={`Scene ${s.id} — ${s.title}`}>
                  <SceneClock.Provider value={{ from }}>
                    <SceneFade pre={i === 0 ? 0 : PRE} len={endF - from} last={i === SCENES.length - 1}>
                      <Comp start={s.start} end={sceneEnd(i)} />
                    </SceneFade>
                  </SceneClock.Provider>
                </Sequence>
              );
            })}
            <BeatLayer />
            <Timeline from={SCENES[1].start - 0.5} to={SCENES[9].start - 0.3} />
          </AbsoluteFill>
          <Grade />
          <LightLeak boosts={boosts} />
          <Grain />
          <Vignette />
          {SCENES.slice(1).map((s, i) => (
            <ChapterCard key={s.id} at={s.start - 0.25} no={toBn(i + 1)} title={s.title} years={CHAPTER_YEARS[s.id]} />
          ))}
          <AbsoluteFill style={{ background: "#ffe2a0", opacity: flash, mixBlendMode: "screen", pointerEvents: "none" }} />
          <Subtitles />
          <Audio src={staticFile("voice_over.mp3")} volume={1} />
          <AudioBed />
        </AbsoluteFill>
      </SrtProvider>
    </FontLoader>
  );
};

// Diagonal gold-light wipe in (instead of a plain crossfade), slow push-in "camera" across the scene,
// and a soft fade-to-black on the very last scene.
const SceneFade = ({ pre, len, last, children }) => {
  const f = useCurrentFrame();
  const q = Math.min(1, f / Math.max(len, 1));
  let clip, streak = null;
  if (pre) {
    const k = interpolate(f, [0, pre], [0, 1], { easing: theme.ease.inOut, extrapolateRight: "clamp" });
    const X = -24 + k * 154;
    if (k < 1) {
      clip = `polygon(0 0, ${X}% 0, ${X - 24}% 100%, 0 100%)`;
      const x1 = (X / 100) * 1920, x2 = ((X - 24) / 100) * 1080 * 1.78;
      streak = (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <line x1={x1} y1={0} x2={(X - 24) * 19.2} y2={1080} stroke="rgba(255,200,110,0.30)" strokeWidth={70} strokeLinecap="round" />
          <line x1={x1} y1={0} x2={(X - 24) * 19.2} y2={1080} stroke="#fff3c9" strokeWidth={4} />
        </svg>
      );
    }
  }
  const fadeOut = last ? interpolate(f, [len - 42, len - 4], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  return (
    <AbsoluteFill style={{ opacity: fadeOut, clipPath: clip }}>
      <AbsoluteFill style={{ transform: `scale(${1 + 0.035 * q}) translate(${-q * 14}px, ${-q * 7}px)` }}>{children}</AbsoluteFill>
      {streak}
    </AbsoluteFill>
  );
};
