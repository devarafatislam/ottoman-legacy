import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, Dust } from "./Atmosphere";
import { SuccessionTree } from "./SuccessionTree";
import { RulerSpotlight, ArtPanel, CaptionStack } from "./Blocks";

// Shared layout for the tree-driven chapters (F, G, H):
// left = ruler spotlight + art panel + caption, right = camera-following succession tree.
export const CenturyLayout = ({ from, to, art, captions, treeOut, overviewUntil, followZoom = 1.25, children }) => (
  <AbsoluteFill>
    <Backdrop tone="navy" />
    <SuccessionTree x={700} y={150} w={1160} h={700} appear={from + 0.2} out={treeOut} overviewUntil={overviewUntil} followZoom={followZoom} />
    <RulerSpotlight from={from} to={to} size="md" left={60} top={170} />
    <ArtPanel items={art} x={360} y={170} w={300} h={408} />
    <CaptionStack items={captions} x={60} y={618} w={600} />
    {children}
    <Dust count={20} opacity={0.35} />
  </AbsoluteFill>
);
