// theme.js — single source of truth: palette, fonts, easings, spring presets, layout.
import { Easing } from "remotion";

export const FPS = 30;
export const W = 1920;
export const H = 1080;

export const theme = {
  colors: {
    emeraldDeep: "#04201A",
    emerald: "#0B3D31",
    emeraldMid: "#13594A",
    emeraldLight: "#2A8066",
    navyDeep: "#050C1A",
    navy: "#0A1730",
    navyMid: "#13264A",
    gold: "#C7A04A",
    goldBright: "#EBCB7A",
    goldDim: "#8B6F34",
    goldFaint: "rgba(199,160,74,0.28)",
    parchment: "#E6D5AC",
    parchmentLight: "#F0E4C4",
    parchmentDark: "#C9B27E",
    parchmentEdge: "#7A5E2C",
    ink: "#2A1D0C",
    ivory: "#F4EBD3",
    ivoryDim: "#C9BFA3",
    crimson: "#8E2F2F",
    sea: "#B7AE86",
  },
  fonts: {
    bn: '"OL Noto Sans Bengali", "Noto Sans Bengali", sans-serif',
    bnSerif: '"OL Noto Serif Bengali", "Noto Serif Bengali", serif',
    title: '"OL Cinzel", "Cinzel", serif',
    serif: '"OL Cormorant", "Cormorant Garamond", serif',
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.65, 0, 0.35, 1),
    inOutSlow: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  spring: {
    snappy: { damping: 15, stiffness: 150, mass: 0.7 },
    smooth: { damping: 22, stiffness: 80, mass: 1 },
    soft: { damping: 26, stiffness: 55, mass: 1.1 },
  },
  // Subtitle safe area (bottom) — nothing important is drawn below SAFE_BOTTOM.
  SAFE_BOTTOM: 868,
};
