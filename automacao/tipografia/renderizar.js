// Renderiza uma peça de tipografia (pasta com coreografia.js, palavras.json, narracao.mp3)
// e mixa narração + música + efeitos sonoros. Saída: <pasta>/video.mp4
// Uso: node renderizar.js salmo46 [--musica resource/songs/output003.mp3] [--frames 60,300]
const { chromium } = require("playwright");
const { spawn, execFileSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const FPS = 60;
const AQUI = __dirname, RAIZ = path.resolve(AQUI, "../..");
const peca = process.argv[2];
const arg = (n) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : null; };
const pasta = path.join(AQUI, peca);
const palavras = JSON.parse(fs.readFileSync(path.join(pasta, "palavras.json"), "utf8"));

// início real (primeira amostra audível) e pico de cada efeito sonoro
function analisar(arquivo) {
  const raw = execFileSync("ffmpeg", ["-v", "error", "-i", arquivo, "-ac", "1", "-ar", "8000", "-f", "s16le", "-"]);
  const n = raw.length / 2;
  let max = 0, iMax = 0;
  for (let i = 0; i < n; i++) { const v = Math.abs(raw.readInt16LE(i * 2)); if (v > max) { max = v; iMax = i; } }
  let ini = 0;
  for (let i = 0; i < n; i++) if (Math.abs(raw.readInt16LE(i * 2)) > max * 0.08) { ini = i; break; }
  return { inicio: ini / 8000, pico: iMax / 8000 };
}

(async () => {
  const browser = await chromium.launch({ args: ["--allow-file-access-from-files"] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on("console", (m) => console.log("[página]", m.text()));
  page.on("pageerror", (e) => console.error("[erro na página]", e));
  await page.addInitScript((p) => { window.PALAVRAS = p; }, palavras);
  await page.goto("file://" + path.join(AQUI, "pagina.html") + "?peca=" + encodeURIComponent(peca));
  await page.waitForFunction(() => window.READY === true, null, { timeout: 60000 });
  const duracao = await page.evaluate(() => window.DURATION);
  const eventos = await page.evaluate(() => window.SFX_EVENTOS);
  const grab = (f) => page.evaluate((t) => { window.seek(t); return document.getElementById("c").toDataURL("image/png"); }, f / FPS);

  const frames = arg("--frames");
  if (frames) {
    for (const f of frames.split(",").map(Number)) {
      fs.writeFileSync(path.join(pasta, `quadro_${String(f).padStart(4, "0")}.png`), Buffer.from((await grab(f)).split(",")[1], "base64"));
    }
    await browser.close();
    return;
  }

  // 1) vídeo (--so-audio reaproveita o _video.mp4 já renderizado)
  const soVideo = path.join(pasta, "_video.mp4");
  if (!(process.argv.includes("--so-audio") && fs.existsSync(soVideo))) {
  const total = Math.round(duracao * FPS);
  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "png", "-i", "-",
    "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p", "-profile:v", "high", soVideo],
    { stdio: ["pipe", "inherit", "inherit"] });
  for (let f = 0; f < total; f++) {
    const buf = Buffer.from((await grab(f)).split(",")[1], "base64");
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    if (f % 300 === 0) console.log(`quadro ${f}/${total}`);
  }
  ff.stdin.end();
  await new Promise((r) => ff.on("close", r));
  }
  await browser.close();

  // 2) áudio: narração + música + efeitos
  const musica = arg("--musica") || path.join(RAIZ, "resource/songs/output003.mp3");
  const entradas = ["-i", path.join(pasta, "narracao.mp3"), "-i", musica];
  const filtros = [
    `[1:a]aresample=48000,volume=1.0[voz]`,
    `[2:a]aresample=48000,atrim=0:${duracao},afade=t=in:d=1.5,afade=t=out:st=${duracao - 2.5}:d=2.5,volume=0.16[mus]`,
  ];
  const info = {};
  const rot = [];
  eventos.forEach((e, k) => {
    const [nome, modo] = e.nome.split("@");
    const arq = path.join(AQUI, "sfx", nome + ".mp3");
    info[nome] ||= analisar(arq);
    // alinha o início audível (ou o pico, para swells) com o instante do evento
    const ref = modo === "pico" ? info[nome].pico : info[nome].inicio;
    const inicio = Math.max(0, e.t - (ref - info[nome].inicio));
    entradas.push("-i", arq);
    const idx = k + 3, ms = Math.round(inicio * 1000);
    filtros.push(`[${idx}:a]aresample=48000,atrim=start=${info[nome].inicio.toFixed(3)},asetpts=PTS-STARTPTS,` +
                 `volume=${(0.55 * e.ganho).toFixed(3)},adelay=${ms}|${ms}[s${k}]`);
    rot.push(`[s${k}]`);
  });
  filtros.push(`[voz][mus]${rot.join("")}amix=inputs=${rot.length + 2}:normalize=0:duration=longest,` +
               `atrim=0:${duracao},alimiter=limit=0.95,loudnorm=I=-14:TP=-1.5:LRA=11[a]`);
  const saida = path.join(pasta, "video.mp4");
  execFileSync("ffmpeg", ["-y", "-v", "error", "-i", soVideo, ...entradas, "-filter_complex", filtros.join(";"),
    "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
    "-movflags", "+faststart", "-t", String(duracao), saida], { stdio: "inherit" });
  fs.unlinkSync(soVideo);
  console.log("ok:", saida, `(${eventos.length} efeitos sonoros)`);
})();
