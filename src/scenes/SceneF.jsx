import React from "react";
import { cueStart as C, SCENES } from "../data/narration";
import { CenturyLayout } from "../components/CenturyLayout";

const S = SCENES[5].start, END = SCENES[6].start;
export const SceneF = () => (
  <CenturyLayout
    from={S} to={END} overviewUntil={S + 4.5}
    art={[
      { from: S, to: C(103), kind: "mosque" },
      { from: C(103), to: C(108), kind: "text", date: "ভাই → ভাই", dateSize: 62, title: "পুত্র নয়, ভাই", sub: "জ্যেষ্ঠ পুরুষ সদস্যের উত্তরাধিকার-প্রথা" },
      { from: C(108), to: C(113), kind: "text", date: "১৬২২", title: "জেনিসারি বাহিনীর সঙ্গে সংঘাত", sub: "দ্বিতীয় ওসমান নিহত" },
      { from: C(113), to: C(119), kind: "text", date: "১৬২২–১৬২৩", dateSize: 60, title: "প্রথম মুস্তফা ফিরে আসেন", sub: "একই শাসক · দ্বিতীয় দফা" },
      { from: C(119), to: C(124), kind: "text", date: "১৬৩৮", title: "বাগদাদ পুনরায় উসমানীয় নিয়ন্ত্রণে", sub: "চতুর্থ মুরাদ" },
      { from: C(124), to: C(131), kind: "text", date: "১৬৪৮–১৭০৩", dateSize: 60, title: "ইউরোপীয় শক্তির সঙ্গে দীর্ঘ যুদ্ধ", sub: "সামরিক চ্যালেঞ্জ ও অভ্যন্তরীণ পরিবর্তন" },
    ]}
    captions={[
      { from: S, to: C(103), title: "প্রথম আহমেদ · ১৬০৩–১৬১৭", sub: "ইস্তাম্বুলের সুলতান আহমেদ মসজিদ — ব্লু মস্ক" },
      { from: C(103), to: C(108), title: "ভাইয়ের পর ভাই", sub: "প্রথম আহমেদের পর পুত্র নয়, ভাই প্রথম মুস্তফা" },
      { from: C(108), to: C(113), title: "দ্বিতীয় ওসমান — তরুণ ওসমান", sub: "সামরিক ব্যবস্থায় পরিবর্তনের চেষ্টা" },
      { from: C(113), to: C(117), title: "প্রথম মুস্তফা আবার সিংহাসনে", sub: "নতুন সুলতান নয় — একই শাসকের দ্বিতীয় শাসনকাল" },
      { from: C(117), to: C(121), title: "চতুর্থ মুরাদ", sub: "কেন্দ্রীয় কর্তৃত্ব পুনঃপ্রতিষ্ঠার চেষ্টা" },
      { from: C(121), to: C(124), title: "ইব্রাহিম → চতুর্থ মুহাম্মদ", sub: "ভাইয়ের পর ভাই, তারপর পিতার পর পুত্র" },
      { from: C(124), to: C(126), title: "দ্বিতীয় সুলাইমান · দ্বিতীয় আহমেদ · দ্বিতীয় মুস্তফা", sub: "একে একে সিংহাসনে" },
      { from: C(126), to: END, title: "নতুন বাস্তবতার সঙ্গে মানিয়ে নেওয়া", sub: "উত্তরাধিকার চললেও সাম্রাজ্যকে বদলাতে হচ্ছিল" },
    ]}
  />
);
