// Desenha as gravuras de uma peça em PNG. Uso: node desenhar.js <cenas.js> <pasta-saida> [ids...]
const { chromium } = require("playwright");
const path = require("path"), fs = require("fs");
(async () => {
  const [cenas, saida, ...ids] = process.argv.slice(2);
  fs.mkdirSync(saida, { recursive: true });
  const b = await chromium.launch({ args: ["--allow-file-access-from-files"] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on("pageerror", (e) => console.error("[erro]", e.message));
  await p.goto("file://" + path.join(__dirname, "gravuras.html") + "?cenas=" + encodeURIComponent(path.relative(__dirname, path.resolve(cenas))));
  await p.waitForFunction(() => window.PRONTO, null, { timeout: 120000 });
  for (const id of ids.length ? ids : await p.evaluate(() => window.IDS)) {
    const t0 = Date.now();
    const url = await p.evaluate((i) => window.desenhar(i), id);
    fs.writeFileSync(path.join(saida, id + ".png"), Buffer.from(url.split(",")[1], "base64"));
    console.log(id, `${Date.now() - t0} ms`);
  }
  await b.close();
})();
