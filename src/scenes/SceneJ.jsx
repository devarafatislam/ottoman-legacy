import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { useClock, prog, Reveal } from "../lib/anim";
import { Backdrop, Dust, GoldRule } from "../components/Atmosphere";
import { SuccessionTree, TreeLegend } from "../components/SuccessionTree";
import { GoldTitle } from "../components/Title";
import { Chip } from "../components/Art";
import { cueStart as C, SCENES, LAST_CUE_END } from "../data/narration";

const c = theme.colors;
const S = SCENES[9].start;

export const SceneJ = () => {
  const { t } = useClock();
  const closing = C(221);
  const dim = 1 - prog(t, closing - 0.3, 1.0, theme.ease.in) * 1;
  return (
    <AbsoluteFill>
      <Backdrop tone="navy" />
      <SuccessionTree
        mode="sequence" seqStart={S + 1.2} x={40} y={160} w={1840} h={700} appear={S + 0.1} out={closing}
        family={S + 19}
        camera={[{ t: 0, cx: 995, cy: 480, zoom: 0.76 }, { t: C(214), cx: 995, cy: 480, zoom: 0.78, dur: 22 }]}
      />
      <TreeLegend at={S + 17} x={60} y={104} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 104, display: "flex", justifyContent: "flex-end", paddingRight: 60, gap: 12, opacity: dim }}>
        {["উত্থান", "বিজয়", "সংকট", "সংস্কার", "পতন"].map((k, i) => (
          <Reveal key={k} at={C(206) + 0.3 + i * 0.55} y={18}><Chip>{k}</Chip></Reveal>
        ))}
      </div>

      {/* closing title */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", opacity: prog(t, closing, 1.2), background: `rgba(3,9,20,${0.55 * prog(t, closing, 1.2)})` }}>
        <GoldTitle text="OTTOMAN LEGACY" at={closing + 0.2} size={104} />
        <Reveal at={closing + 1.4} y={14} style={{ margin: "14px 0" }}><GoldRule width={560} /></Reveal>
        <Reveal at={closing + 1.8} y={22}><div style={{ fontFamily: theme.fonts.bnSerif, fontWeight: 600, fontSize: 52, color: c.ivory }}>৩৬ জন সুলতান, এক সাম্রাজ্য</div></Reveal>
        <Reveal at={closing + 2.6} y={14}><div style={{ fontFamily: theme.fonts.serif, fontStyle: "italic", fontWeight: 600, fontSize: 30, letterSpacing: "0.22em", color: c.goldBright, marginTop: 16 }}>1299 — 1922</div></Reveal>
        <Reveal at={closing + 3.6} y={10}><div style={{ fontFamily: theme.fonts.bn, fontWeight: 400, fontSize: 22, color: c.ivoryDim, marginTop: 40, textAlign: "center", lineHeight: 1.6 }}>প্রতিকৃতি: প্রদত্ত রেফারেন্স চিত্র · মানচিত্র ও চিত্রণ আনুমানিক ও প্রতীকী</div></Reveal>
      </AbsoluteFill>
      <Dust count={26} opacity={0.4} />
    </AbsoluteFill>
  );
};
