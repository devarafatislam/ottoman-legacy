import React from "react";
import { Audio, Sequence, staticFile, interpolate, useVideoConfig } from "remotion";
import { cueStart as C, SCENES } from "../data/narration";
import { secToFrame } from "../lib/time";
import { BEATS } from "../data/beats";

// Narration stays at 1.0 (−18.9 LUFS source). Everything below is far quieter and never masks speech.
const MUSIC = 0.055;   // synthesised drone ≈ −24 LU under the voice
const SFX = { whoosh: 0.10, impact: 0.20, paper: 0.10 };

export const IMPACTS = [C(39), C(66), C(156), C(193), C(205)]; // 1402, 1453, 1826, 1 Nov 1922, final reveal
const PAPERS = [C(13), C(18)];

export const AudioBed = () => {
  const { durationInFrames, fps } = useVideoConfig();
  return (
    <>
      <Audio src={staticFile("audio/drone.wav")} loop volume={(f) => MUSIC * interpolate(f, [0, fps * 6, durationInFrames - fps * 8, durationInFrames - 20], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      {SCENES.slice(1).map((s) => (
        <Sequence key={s.id} from={Math.max(0, secToFrame(s.start) - 14)} durationInFrames={50} layout="none">
          <Audio src={staticFile("audio/whoosh.wav")} volume={SFX.whoosh} />
        </Sequence>
      ))}
      {BEATS.map((b) => (
        <Sequence key={`bw${b.id}`} from={Math.max(0, secToFrame(b.from) - 2)} durationInFrames={50} layout="none"><Audio src={staticFile("audio/whoosh.wav")} volume={0.06} /></Sequence>
      ))}
      {IMPACTS.map((t) => (
        <Sequence key={`i${t}`} from={secToFrame(t) - 3} durationInFrames={80} layout="none"><Audio src={staticFile("audio/impact.wav")} volume={SFX.impact} /></Sequence>
      ))}
      {PAPERS.map((t) => (
        <Sequence key={`p${t}`} from={secToFrame(t)} durationInFrames={40} layout="none"><Audio src={staticFile("audio/paper.wav")} volume={SFX.paper} /></Sequence>
      ))}
    </>
  );
};
