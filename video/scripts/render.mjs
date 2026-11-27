// Rend les films finaux + affiches dans ../img/ : node scripts/render.mjs
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { openWithRetry } from "./stills.mjs";
import path from "node:path";
import os from "node:os";

// Priorité basse : Chrome et ffmpeg en héritent, le PC reste utilisable pendant le rendu.
try { os.setPriority(os.constants.priority.PRIORITY_BELOW_NORMAL); } catch {}

const OUT = path.resolve("../img");
const JOBS = [
  { id: "RoyalFilm", file: "film-16x9" },
  { id: "RoyalFilmPortrait", file: "film-4x5" },
];
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const browser = await openWithRetry();
for (const j of JOBS) {
  const composition = await selectComposition({ serveUrl, id: j.id, puppeteerInstance: browser, timeoutInMilliseconds: 240000 });
  await renderStill({ composition, serveUrl, frame: 166, output: path.join(OUT, `${j.file}.jpg`), imageFormat: "jpeg", jpegQuality: 82, puppeteerInstance: browser, timeoutInMilliseconds: 240000 });
  let last = -1;
  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    crf: 25,
    audioBitrate: "128k",
    x264Preset: "medium",
    concurrency: 1,
    puppeteerInstance: browser,
    timeoutInMilliseconds: 240000,
    outputLocation: path.join(OUT, `${j.file}.mp4`),
    onProgress: ({ progress }) => {
      const p = Math.floor(progress * 20) * 5;
      if (p !== last) { last = p; console.log(`${j.id} ${p}%`); }
    },
  });
  console.log("terminé", j.file);
}
await browser.close({ silent: true });
