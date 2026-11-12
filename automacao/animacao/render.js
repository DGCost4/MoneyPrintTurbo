// Grava a animação quadro a quadro com o Chromium (Playwright) e entrega ao ffmpeg.
// Uso: node render.js config.json
// config: { segmentos: [{cena, inicio, fim}], duracao, fps, saida }
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

(async () => {
  const cfg = JSON.parse(fs.readFileSync(process.argv[2], "utf-8"));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto("file://" + path.join(__dirname, "pagina.html"));
  await page.evaluate((c) => window.configurar(c), cfg);

  const ff = spawn(cfg.ffmpeg || "ffmpeg", [
    "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(cfg.fps), "-c:v", "mjpeg", "-i", "-",
    "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", cfg.saida,
  ], { stdio: ["pipe", "inherit", "inherit"] });

  const total = Math.round(cfg.duracao * cfg.fps);
  for (let i = 0; i < total; i++) {
    const b64 = await page.evaluate((t) => window.quadro(t), i / cfg.fps);
    if (!ff.stdin.write(Buffer.from(b64, "base64"))) await new Promise((r) => ff.stdin.once("drain", r));
    if (i % 150 === 0) console.error(`quadro ${i}/${total}`);
  }
  ff.stdin.end();
  const codigo = await new Promise((r) => ff.on("close", r));
  await browser.close();
  process.exit(codigo);
})().catch((e) => { console.error(e); process.exit(1); });
