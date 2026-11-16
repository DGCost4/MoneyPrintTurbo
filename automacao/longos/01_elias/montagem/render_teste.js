// node render_longo.js teste 10,50,90     -> quadros de teste (segundos)
// node render_longo.js video [nWorkers]   -> _video.mp4 (sem áudio) + eventos.json
const { chromium } = require("playwright"), { spawn } = require("child_process"), fs = require("fs"), path = require("path");
const A = __dirname, FPS = 30, modo = process.argv[2];
async function abrir(b) {
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on("pageerror", (e) => console.error("[erro]", e.message)); p.on("console", (m) => m.type() === "error" && console.error("[console]", m.text()));
  if (process.env.ESTILO) await p.addInitScript((e) => { window.ESTILO_CAP = e; }, process.env.ESTILO);
  await p.goto("file://" + path.join(A, process.env.PAGINA || "pagina.html"));
  await p.waitForFunction(() => window.READY || window.ERRO, null, { timeout: 120000 });
  const erro = await p.evaluate(() => window.ERRO); if (erro) { console.error(erro); process.exit(1); }
  return p;
}
const grab = (p, t) => p.evaluate(async (t) => { await window.seek(t); return document.getElementById("c").toDataURL("image/jpeg", 0.93); }, t);
(async () => {
  const b = await chromium.launch({ args: ["--allow-file-access-from-files", "--disable-web-security"] });
  if (modo === "trecho") {
    const p = await abrir(b), [a, z] = process.argv.slice(3, 5).map(Number), out = path.join(A, process.argv[5]);
    if (process.env.EVENTOS) fs.writeFileSync(path.join(A, process.env.EVENTOS), JSON.stringify({ dur: await p.evaluate(() => DURATION), sfx: await p.evaluate(() => SFX) }));
    const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", "30", "-c:v", "mjpeg", "-i", "-", "-c:v", "libx264", "-crf", "20", "-pix_fmt", "yuv420p", out], { stdio: ["pipe", "inherit", "inherit"] });
    for (let f = Math.round(a * 30); f < Math.round(z * 30); f++) { const buf = Buffer.from((await grab(p, f / 30)).split(",")[1], "base64"); if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r)); }
    ff.stdin.end(); await new Promise((r) => ff.on("close", r)); return b.close();
  }
  if (modo === "teste") {
    const p = await abrir(b);
    if (process.env.EVENTOS) fs.writeFileSync(path.join(A, process.env.EVENTOS), JSON.stringify({ dur: await p.evaluate(() => DURATION), sfx: await p.evaluate(() => SFX) }));
    for (const s of process.argv[3].split(",").map(Number)) fs.writeFileSync(path.join(A, process.argv[4] || "teste", `t${String(s).padStart(6, "0")}.jpg`), Buffer.from((await grab(p, s)).split(",")[1], "base64"));
    return b.close();
  }
  const p0 = await abrir(b);
  const dur = await p0.evaluate(() => DURATION), ev = await p0.evaluate(() => SFX); await p0.close();
  fs.writeFileSync(path.join(A, "eventos.json"), JSON.stringify({ dur, sfx: ev }));
  const total = Math.round(dur * FPS), N = Number(process.argv[3] || 4), parte = Math.ceil(total / N);
  await Promise.all(Array.from({ length: N }, async (_, w) => {
    const ini = w * parte, fim = Math.min(total, ini + parte), arq = path.join(A, `_parte${w}.mp4`);
    const p = await abrir(b);
    const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
      "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", arq], { stdio: ["pipe", "inherit", "inherit"] });
    for (let f = ini; f < fim; f++) {
      const buf = Buffer.from((await grab(p, f / FPS)).split(",")[1], "base64");
      if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
      if ((f - ini) % 900 === 0) console.log(`parte ${w}: ${f - ini}/${fim - ini}`);
    }
    ff.stdin.end(); await new Promise((r) => ff.on("close", r)); await p.close();
  }));
  await b.close();
  fs.writeFileSync(path.join(A, "_partes.txt"), Array.from({ length: N }, (_, w) => `file '_parte${w}.mp4'`).join("\n"));
  require("child_process").execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", path.join(A, "_partes.txt"), "-c", "copy", path.join(A, "_video.mp4")]);
  console.log("vídeo ok", dur);
})();
