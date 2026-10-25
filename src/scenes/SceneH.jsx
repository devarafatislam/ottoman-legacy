import React from "react";
import { cueStart as C, SCENES } from "../data/narration";
import { CenturyLayout } from "../components/CenturyLayout";
import { EventBanner } from "../components/Blocks";

const S = SCENES[7].start, END = SCENES[8].start;
export const SceneH = () => (
  <CenturyLayout
    from={S} to={END}
    art={[
      { from: S, to: C(150), kind: "doc", title: "নিজাম-ই জাদিদ" },
      { from: C(150), to: C(156), kind: "text", date: "১৮০৭–১৮০৮", dateSize: 54, title: "সংস্কারের বিরোধিতা", sub: "তৃতীয় সেলিম ক্ষমতাচ্যুত" },
      { from: C(160), to: C(165), kind: "doc", title: "তানজিমাত", rot: 2 },
      { from: C(165), to: C(171), kind: "text", date: "১৮৬১–১৮৭৬", dateSize: 54, title: "তিন সুলতান", sub: "ভাই, ভাতিজা, ভাই" },
      { from: C(171), to: C(178), kind: "doc", title: "সংবিধান ও সংসদ", rot: -1 },
    ]}
    captions={[
      { from: S, to: C(150), title: "তৃতীয় সেলিম · নিজাম-ই জাদিদ", sub: "উসমানীয় সেনাবাহিনীকে আধুনিক করার সংস্কার কর্মসূচি" },
      { from: C(150), to: C(153), title: "চতুর্থ মুস্তফা", sub: "তাঁর শাসনও দীর্ঘস্থায়ী হয়নি" },
      { from: C(153), to: C(156), title: "দ্বিতীয় মাহমুদ · ১৮০৮", sub: "সামরিক ও প্রশাসনিক ব্যবস্থায় গুরুত্বপূর্ণ পরিবর্তন" },
      { from: C(160), to: C(165), title: "প্রথম আব্দুল মজিদ · তানজিমাত", sub: "প্রশাসন, আইন, শিক্ষা ও রাষ্ট্র পরিচালনায় আধুনিকায়ন" },
      { from: C(165), to: C(171), title: "আব্দুল আজিজ → পঞ্চম মুরাদ → দ্বিতীয় আব্দুল হামিদ", sub: "১৮৭৬ সালে অল্প সময়ের জন্য পঞ্চম মুরাদ" },
      { from: C(171), to: C(174), title: "সংবিধান · সংসদ · কেন্দ্রীয় শাসন", sub: "রাজনৈতিক বিরোধের গুরুত্বপূর্ণ প্রশ্ন" },
      { from: C(174), to: END, title: "আধুনিকায়ন বনাম সংকট", sub: "জাতীয়তাবাদী আন্দোলন ও ভূখণ্ড হারানোর চাপ" },
    ]}
  >
    <EventBanner at={C(156)} out={C(160) - 0.3} year={1826} title="জেনিসারি বাহিনী বিলুপ্ত" sub="বহু শতাব্দীর সামরিক ব্যবস্থার অবসান · দ্বিতীয় মাহমুদ" />
    <EventBanner at={C(177) + 0.1} out={END + 0.4} year={1909} title="দ্বিতীয় আব্দুল হামিদের শাসনের অবসান" />
  </CenturyLayout>
);
