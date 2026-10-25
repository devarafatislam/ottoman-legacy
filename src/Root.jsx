import React from "react";
import { Composition } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { staticFile } from "remotion";
import { Documentary } from "./Documentary";
import { FPS, W, H } from "./theme";

export const AUDIO_FILE = "voice_over.mp3";
export const SRT_FILE = "ottoman_36_sultans_bn_subtitles.srt";

// Duration is read from the REAL mp3 — never assumed.
const calculateMetadata = async () => {
  const sec = await getAudioDurationInSeconds(staticFile(AUDIO_FILE));
  return { durationInFrames: Math.ceil(sec * FPS) };
};

export const Root = () => (
  <Composition
    id="OttomanLegacy"
    component={Documentary}
    width={W}
    height={H}
    fps={FPS}
    durationInFrames={24232}
    defaultProps={{}}
    calculateMetadata={calculateMetadata}
  />
);
