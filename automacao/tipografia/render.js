// Renderiza peca.html quadro a quadro e gera o MP4 (1080x1920, 60fps, 12s).
// Uso: node render.js [saida.mp4] [--frames 0,90,300 para PNGs de checagem]
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const FPS = 60;
const out = path.resolve(process.argv[2] || "tipografia_cinetica.mp4");
const fi = process.argv.indexOf("--frames");
const stills = fi > 0 ? process.argv[fi + 1].split(",").map(Number) : null;

(async () => {
  const browser = await chromium.launch({ args: ["--allow-file-access-from-files"] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on("console", (m) => console.log("[page]", m.text()));
  page.on("pageerror", (e) => console.error("[page error]", e));
  await page.goto("file://" + path.join(__dirname, "peca.html"));
  await page.waitForFunction(() => window.READY === true);
  console.log("layout:", JSON.stringify(await page.evaluate(() => window.__layout)));
  const grab = (f) => page.evaluate((t) => { window.seek(t); return document.getElementById("c").toDataURL("image/png"); }, f / FPS);

  if (stills) {
    for (const f of stills) {
      const b64 = (await grab(f)).split(",")[1];
      fs.writeFileSync(`${out}_${String(f).padStart(4, "0")}.png`, Buffer.from(b64, "base64"));
    }
    await browser.close();
    return;
  }
  const total = Math.round(await page.evaluate(() => window.DURATION) * FPS);
  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error",
    "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "png", "-i", "-",
    "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=48000",
    "-shortest", "-c:v", "libx264", "-preset", "slow", "-crf", "16",
    "-pix_fmt", "yuv420p", "-profile:v", "high", "-c:a", "aac", "-b:a", "64k",
    "-movflags", "+faststart", out], { stdio: ["pipe", "inherit", "inherit"] });
  for (let f = 0; f < total; f++) {
    const buf = Buffer.from((await grab(f)).split(",")[1], "base64");
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    if (f % 120 === 0) console.log(`quadro ${f}/${total}`);
  }
  ff.stdin.end();
  await new Promise((r) => ff.on("close", r));
  await browser.close();
  console.log("ok:", out);
})();
