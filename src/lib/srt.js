// SRT parser — frame-accurate, BOM/CRLF safe. Timestamps are converted with Math.round(sec*fps).
export const parseTimestamp = (ts) => {
  const m = /^(\d+):(\d{2}):(\d{2})[,.](\d{1,3})$/.exec(ts.trim());
  if (!m) throw new Error(`Bad SRT timestamp: ${ts}`);
  return +m[1] * 3600 + +m[2] * 60 + +m[3] + +m[4].padEnd(3, "0") / 1000;
};

export const parseSrt = (raw, fps = 30) => {
  const text = raw.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").trim();
  return text
    .split(/\n{2,}/)
    .map((block) => {
      const lines = block.split("\n");
      const idx = lines.findIndex((l) => l.includes("-->"));
      if (idx < 0) return null;
      const [a, b] = lines[idx].split("-->");
      const startSec = parseTimestamp(a);
      const endSec = parseTimestamp(b);
      return {
        index: parseInt(lines[0], 10),
        startSec,
        endSec,
        startFrame: Math.round(startSec * fps),
        endFrame: Math.round(endSec * fps),
        text: lines.slice(idx + 1).join("\n").trim(),
      };
    })
    .filter(Boolean);
};
