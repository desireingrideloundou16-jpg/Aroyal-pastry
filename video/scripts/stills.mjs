// Rend des images fixes de contrôle : node scripts/stills.mjs <compositionId> <dossier> <frame,frame,...>
import { bundle } from "@remotion/bundler";
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";

export async function openWithRetry(tries = 5) {
  for (let i = 1; ; i++) {
    try {
      return await openBrowser("chrome", { chromiumOptions: { gl: "swangle" } });
    } catch (e) {
      if (i >= tries) throw e;
      console.log(`navigateur lent à démarrer, nouvel essai ${i + 1}/${tries}…`);
    }
  }
}

if (process.argv[1].endsWith("stills.mjs")) {
  const [id, outDir, framesArg] = process.argv.slice(2);
  const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
  const browser = await openWithRetry();
  const composition = await selectComposition({ serveUrl, id, puppeteerInstance: browser, timeoutInMilliseconds: 240000 });
  for (const f of framesArg.split(",").map(Number)) {
    await renderStill({ composition, serveUrl, frame: f, output: path.join(outDir, `${id}-${f}.jpg`), imageFormat: "jpeg", jpegQuality: 70, scale: 0.5, puppeteerInstance: browser, timeoutInMilliseconds: 240000 });
    console.log("ok", f);
  }
  await browser.close({ silent: true });
}
