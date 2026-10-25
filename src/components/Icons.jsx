import React from "react";
import { theme } from "../theme";

const star8 = (() => {
  const pts = [];
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2 - Math.PI / 2; const r = i % 2 ? 11 : 24; pts.push(`${(32 + Math.cos(a) * r).toFixed(1)},${(32 + Math.sin(a) * r).toFixed(1)}`); }
  return pts.join(" ");
})();
const gear = (() => {
  let d = "";
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; d += `M${(32 + Math.cos(a) * 16).toFixed(1)} ${(32 + Math.sin(a) * 16).toFixed(1)} L${(32 + Math.cos(a) * 24).toFixed(1)} ${(32 + Math.sin(a) * 24).toFixed(1)} `; }
  return d;
})();

const ICONS = {
  sword: <><path d="M14 50 L46 18 M50 50 L18 18" /><path d="M9 45 L19 55 M55 45 L45 55" /><path d="M46 18 L53 11 M18 18 L11 11" /></>,
  scroll: <><path d="M16 12 H46 a6 6 0 0 1 6 6 V46 a6 6 0 0 1 -6 6 H22 a6 6 0 0 1 -6 -6 Z" /><path d="M24 24 H44 M24 32 H44 M24 40 H38" /></>,
  gear: <><circle cx="32" cy="32" r="14" /><circle cx="32" cy="32" r="5" /><path d={gear} /></>,
  column: <path d="M12 14 H52 M18 14 V20 M46 14 V20 M20 20 H44 M25 20 V46 M32 20 V46 M39 20 V46 M18 46 H46 M12 52 H52" />,
  scales: <path d="M32 10 V52 M20 52 H44 M12 20 H52 M12 20 L6 38 H18 Z M52 20 L46 38 H58 Z" />,
  book: <path d="M8 14 H29 Q32 14 32 17 V51 Q32 48 29 48 H8 Z M56 14 H35 Q32 14 32 17 V51 Q32 48 35 48 H56 Z" />,
  tower: <path d="M14 54 V24 H50 V54 M14 24 V14 H21 V19 H28 V14 H36 V19 H43 V14 H50 V24 M27 54 V42 a5 5 0 0 1 10 0 V54" />,
  crescent: <><path d="M42 12 A21 21 0 1 0 52 44 A17 17 0 1 1 42 12 Z" /><polygon points="50,18 52,24 58,24 53,28 55,34 50,30 45,34 47,28 42,24 48,24" /></>,
  pin: <><path d="M32 56 C20 40 15 33 15 25 a17 17 0 0 1 34 0 C49 33 44 40 32 56 Z" /><circle cx="32" cy="25" r="6" /></>,
  crown: <path d="M10 46 L14 20 L24 33 L32 13 L40 33 L50 20 L54 46 Z M12 54 H52" />,
  arrow: <path d="M8 32 H52 M38 18 L52 32 L38 46" />,
  people: <><circle cx="32" cy="21" r="8" /><path d="M16 54 C16 38 48 38 48 54" /><circle cx="13" cy="27" r="5" /><circle cx="51" cy="27" r="5" /></>,
  star: <polygon points={star8} />,
  flag: <path d="M15 56 V10 M15 12 H50 L43 23 L50 34 H15" />,
  shield: <path d="M32 9 L51 16 V32 C51 45 41 53 32 57 C23 53 13 45 13 32 V16 Z" />,
  bolt: <path d="M37 7 L17 37 H30 L26 57 L47 26 H34 Z" />,
  map: <path d="M8 16 L23 11 L41 18 L56 13 V48 L41 53 L23 46 L8 51 Z M23 11 V46 M41 18 V53" />,
  coin: <><circle cx="32" cy="32" r="21" /><path d="M32 18 V46 M23 27 H41 M23 37 H41" /></>,
  broken: <path d="M10 10 L30 30 L22 34 L42 54 M30 30 L52 18" />,
  hourglass: <path d="M16 10 H48 M16 54 H48 M18 10 C18 28 30 28 32 32 C34 28 46 28 46 10 M18 54 C18 38 30 36 32 32 C34 36 46 38 46 54" />,
  swap: <path d="M10 22 H50 M40 12 L50 22 L40 32 M54 42 H14 M24 32 L14 42 L24 52" />,
  lamp: <><path d="M32 8 V16 M20 30 a12 12 0 0 1 24 0 V44 H20 Z M24 44 V52 H40 V44" /></>,
};

export const Icon = ({ name, size = 64, color = theme.colors.goldBright, sw = 2.6, draw = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ overflow: "visible", filter: draw > 0.95 ? `drop-shadow(0 0 8px ${theme.colors.gold}66)` : undefined }}>
    <g strokeDasharray={260} strokeDashoffset={(1 - Math.max(0, Math.min(1, draw))) * 260}>{ICONS[name] || ICONS.star}</g>
  </svg>
);
