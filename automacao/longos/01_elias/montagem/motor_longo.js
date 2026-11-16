// Motor dos vídeos longos (16:9): tudo é função do tempo t (sem estado), para renderizar quadro a quadro.
const W = 1920, H = 1080, FPS = 30;
const cv = document.getElementById("c"), x = cv.getContext("2d");
const COR = { creme: "#fff3dc", vermelho: "#FF2A1A", ouro: "#F6B93B", tinta: "#2a1a10", escuro: "#120c0a" };
const L = { pal: [], cenas: [], over: [], sfx: [], total: 60 };
window.SFX = L.sfx;
// ---------------------------------------------------------------- utilidades
const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, p) => a + (b - a) * p;
const ease = { o4: (p) => 1 - Math.pow(1 - p, 4), o2: (p) => 1 - (1 - p) * (1 - p), io: (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
  sio: (p) => -(Math.cos(Math.PI * p) - 1) / 2, back: (p) => { const c1 = 1.7, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); }, i3: (p) => p * p * p };
const env = (t, t0, t1, fi = 0.4, fo = 0.4) => (t < t0 || t > t1 ? 0 : Math.min(fi ? cl((t - t0) / fi) : 1, fo ? cl((t1 - t) / fo) : 1));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
function rng(s) { return () => (s = (s * 16807) % 2147483647) / 2147483647; }
// ---------------------------------------------------------------- sincronia com a narração
let CURSOR = 0;   // procura sempre a partir do último ponto achado (as âncoras vêm em ordem)
function achar(frase, depois) {
  const alvo = frase.split(/\s+/).map(norm).filter(Boolean);
  const ini = depois != null ? L.pal.findIndex((w) => w[1] >= depois - 0.01) : Math.max(0, CURSOR - 40);
  for (let k = Math.max(0, ini); k <= L.pal.length - alvo.length; k++) {
    let ok = true; for (let j = 0; j < alvo.length; j++) if (norm(L.pal[k + j][0]) !== alvo[j]) { ok = false; break; }
    if (ok) { CURSOR = k; return k; }
  }
  throw new Error(`não achei na narração: "${frase}" (a partir de ${L.pal[Math.max(0, ini)]?.[1]})`);
}
const T = (frase, depois) => L.pal[achar(frase, depois)][1];              // início da 1ª palavra
const TF = (frase, depois) => { const k = achar(frase, depois); return L.pal[k + frase.split(/\s+/).filter((s) => norm(s)).length - 1][2]; }; // fim da última
const tempos = (frase, depois) => { const k = achar(frase, depois); return frase.split(/\s+/).filter((s) => norm(s)).map((_, j) => L.pal[k + j][1]); };
function sfx(t, nome, ganho = 1, o = {}) { L.sfx.push({ t: +t.toFixed(3), nome, ganho, ...o }); }
// ---------------------------------------------------------------- imagens e clipes
const IMG = {}; const CLIPE = {};
function carregar(ids, pasta) {
  return Promise.all(ids.map((id) => new Promise((ok, erro) => { const im = new Image(); im.onload = ok; im.onerror = () => erro(id); im.src = `${pasta}/${id}.jpg`; IMG[id] = im; })));
}
const cacheQ = new Map();
function quadroClipe(nome, i) {
  const k = `${nome}/${i}`;
  if (!cacheQ.has(k)) { const im = new Image(); im.src = `clipes/${nome}/${String(i).padStart(4, "0")}.jpg`; cacheQ.set(k, im); if (cacheQ.size > 120) cacheQ.delete(cacheQ.keys().next().value); }
  return cacheQ.get(k);
}
// ---------------------------------------------------------------- cenas (fundo)
// cena(id, t0, {de:[zoom, fx, fy], para:[...], trans: "fade"|"corte"|"branco", tdur, amb:[...], escuro, clipe:{nome, n, vel}})
function cena(id, t0, o = {}) { L.cenas.push({ id, t0, de: o.de || [1.08, 0.5, 0.5], para: o.para || [1.16, 0.5, 0.5], trans: o.trans || "fade", tdur: o.tdur ?? 0.7, amb: o.amb || [], escuro: o.escuro ?? 0, clipe: o.clipe, mapa: o.mapa, cor: o.cor }); }
function clipe(nome, t0, o = {}) { cena(nome, t0, { ...o, clipe: { nome, n: o.n || 235, vel: o.vel || 1 }, de: o.de || [1, 0.5, 0.5], para: o.para || [1.06, 0.5, 0.5] }); }
function pintaImagem(im, iw, ih, z, fx, fy) {
  const s = Math.max(W / iw, H / ih) * z;
  let cx = fx * iw, cy = fy * ih;
  cx = cl(cx, W / (2 * s), iw - W / (2 * s)); cy = cl(cy, H / (2 * s), ih - H / (2 * s));
  x.setTransform(s, 0, 0, s, W / 2 - cx * s + TREM.dx, H / 2 - cy * s + TREM.dy);
  x.drawImage(im, 0, 0, iw, ih);
  x.setTransform(1, 0, 0, 1, 0, 0);
}
function pintaCena(c, t, fim) {
  const p = ease.sio(cl((t - c.t0) / Math.max(0.1, fim - c.t0)));
  const z = lerp(c.de[0], c.para[0], p), fx = lerp(c.de[1], c.para[1], p), fy = lerp(c.de[2], c.para[2], p);
  if (c.mapa) { MAPA.pinta(c, t, p); }
  else if (c.clipe) {
    const i = Math.min(c.clipe.n, 1 + Math.floor((t - c.t0) * FPS * c.clipe.vel));
    const im = quadroClipe(c.clipe.nome, i);
    if (im.complete && im.naturalWidth) pintaImagem(im, im.naturalWidth, im.naturalHeight, z, fx, fy);
  } else { const im = IMG[c.id]; pintaImagem(im, im.naturalWidth, im.naturalHeight, z, fx, fy); }
  if (c.cor) { x.fillStyle = c.cor; x.fillRect(0, 0, W, H); }
  for (const a of c.amb) AMB[a[0]]?.(t, a);
  if (c.escuro) { x.fillStyle = `rgba(10,6,4,${c.escuro})`; x.fillRect(0, 0, W, H); }
}
function fundo(t) {
  const C = L.cenas; let k = -1;
  for (let i = 0; i < C.length; i++) if (C[i].t0 <= t) k = i;
  x.fillStyle = "#000"; x.fillRect(0, 0, W, H);
  if (k < 0) return;
  const c = C[k], fim = C[k + 1] ? C[k + 1].t0 + C[k + 1].tdur : L.total;
  const pt = c.trans === "corte" ? 1 : cl((t - c.t0) / c.tdur);
  if (k > 0 && pt < 1) {
    pintaCena(C[k - 1], t, c.t0 + c.tdur);
    if (c.trans === "branco") { x.fillStyle = `rgba(255,244,225,${Math.sin(pt * Math.PI)})`; x.fillRect(0, 0, W, H); if (pt < 0.5) return; }
    x.globalAlpha = c.trans === "branco" ? 1 : ease.sio(pt);
  }
  pintaCena(c, t, fim);
  x.globalAlpha = 1;
}
// ---------------------------------------------------------------- ambientes (partículas)
const R = rng(11), PT = Array.from({ length: 220 }, () => [R(), R(), R(), R()]);
const AMB = {
  poeira(t, [, f = 1]) { x.save(); for (const [u, v, r, q] of PT.slice(0, 70)) { const X = (u * W + t * (20 + r * 40)) % W, Y = (v * H + Math.sin(t * 0.6 + q * 9) * 30); x.fillStyle = `rgba(255,236,200,${(0.18 + r * 0.25) * f})`; x.beginPath(); x.arc(X, Y, 1.2 + r * 2.4, 0, 7); x.fill(); } x.restore(); },
  chuva(t, [, f = 1]) { x.save(); x.strokeStyle = `rgba(210,225,240,${0.35 * f})`; x.lineWidth = 2; x.beginPath(); for (const [u, v, r] of PT) { const Y = (v * H + t * (1400 + r * 600)) % (H + 80) - 40, X = (u * (W + 300) - Y * 0.25 + t * 30) % (W + 300) - 150; x.moveTo(X, Y); x.lineTo(X - 9, Y + 34 + r * 20); } x.stroke(); x.restore(); },
  brasas(t, [, cx = 960, cy = 700, f = 1]) { x.save(); x.globalCompositeOperation = "screen"; for (const [u, v, r] of PT.slice(0, 90)) { const vida = (t * (0.25 + r * 0.35) + v) % 1; x.fillStyle = `rgba(255,${140 + r * 100},60,${(1 - vida) * 0.85 * f})`; x.beginPath(); x.arc(cx + (u - 0.5) * 900 + Math.sin(vida * 7 + r * 20) * 40, cy - vida * 800, 1.5 + r * 3, 0, 7); x.fill(); } x.restore(); },
  estrelas(t) { x.save(); for (const [u, v, r, q] of PT.slice(0, 80)) { x.fillStyle = `rgba(255,250,230,${0.25 + 0.5 * Math.max(0, Math.sin(t * 2 + q * 20))})`; x.fillRect(u * W, v * H * 0.45, 2 + r * 2, 2 + r * 2); } x.restore(); },
  luz(t, [, cx = 960, cy = 300, f = 1]) { x.save(); x.globalCompositeOperation = "screen"; const g = x.createRadialGradient(cx, cy, 0, cx, cy, 900); g.addColorStop(0, `rgba(255,214,140,${(0.3 + 0.05 * Math.sin(t * 1.5)) * f})`); g.addColorStop(1, "rgba(255,200,120,0)"); x.fillStyle = g; x.fillRect(0, 0, W, H); x.restore(); },
  calor(t, [, f = 1]) { x.save(); x.globalCompositeOperation = "soft-light"; x.fillStyle = `rgba(255,170,60,${0.25 * f})`; x.fillRect(0, 0, W, H); x.restore(); },
  frio(t, [, f = 1]) { x.save(); x.globalCompositeOperation = "soft-light"; x.fillStyle = `rgba(60,110,200,${0.3 * f})`; x.fillRect(0, 0, W, H); x.restore(); },
};
// ---------------------------------------------------------------- tremor e clarão
const TREM = { dx: 0, dy: 0 }; const TREMS = [], FLASH = [];
function tremor(t0, dur = 0.8, amp = 14) { TREMS.push([t0, dur, amp]); }
function clarao(t0, dur = 0.5, cor = "255,240,210", a = 0.8) { FLASH.push([t0, dur, cor, a]); }
function calcTremor(t) { TREM.dx = TREM.dy = 0; for (const [t0, d, a] of TREMS) if (t >= t0 && t < t0 + d) { const k = a * (1 - (t - t0) / d); TREM.dx += Math.sin(t * 91) * k; TREM.dy += Math.cos(t * 77) * k; } }
// ---------------------------------------------------------------- sobreposições
function over(t0, t1, desenha, camada = 1) { L.over.push({ t0, t1, desenha, camada }); }
function txt(s, X, Y, { tam = 60, cor = COR.creme, fonte = "V", peso = 700, alin = "center", esp = 0, sombra = 0.45, a = 1 } = {}) {
  x.save(); x.globalAlpha *= a; x.font = `${peso} ${tam}px ${fonte}`; x.textAlign = alin; x.textBaseline = "alphabetic"; x.letterSpacing = esp + "px";
  if (sombra) { x.fillStyle = `rgba(0,0,0,${sombra})`; x.fillText(s, X + 3, Y + 5); }
  x.fillStyle = cor; x.fillText(s, X, Y); x.restore();
}
function largura(s, tam, fonte = "V", esp = 0) { x.save(); x.font = `700 ${tam}px ${fonte}`; x.letterSpacing = esp + "px"; const w = x.measureText(s).width; x.restore(); return w; }
// etiqueta de lugar/personagem (canto inferior esquerdo)
function etiqueta(t0, t1, titulo, sub = "", { X = 110, Y = 900 } = {}) {
  sfx(t0, "transicao", 0.35);
  over(t0, t1, (t) => {
    const a = env(t, t0, t1, 0.5, 0.4), p = ease.o4(cl((t - t0) / 0.6));
    const w = Math.max(largura(titulo, 54, "V", 4), sub ? largura(sub, 30, "V", 2) : 0) + 70;
    x.save(); x.globalAlpha = a;
    x.fillStyle = "rgba(18,12,10,.72)"; x.fillRect(X, Y - 70, w * p, sub ? 120 : 84);
    x.fillStyle = COR.vermelho; x.fillRect(X, Y - 70, 8, sub ? 120 : 84);
    x.beginPath(); x.rect(X, Y - 80, w * p, 140); x.clip();
    txt(titulo, X + 34, Y - 8, { tam: 54, alin: "left", esp: 4, sombra: 0 });
    if (sub) txt(sub, X + 36, Y + 36, { tam: 30, alin: "left", esp: 2, cor: COR.ouro, sombra: 0 });
    x.restore();
  });
}
// carimbo de data
function carimbo(t0, t1, s, { X = 1500, Y = 210, rot = -0.08, cor = "#d62a1a", tam = 64 } = {}) {
  sfx(t0 + 0.12, "carimbo", 0.9);
  over(t0, t1, (t) => {
    const p = cl((t - t0) / 0.18), a = env(t, t0, t1, 0.05, 0.5), z = lerp(1.9, 1, ease.i3(p));
    const w = largura(s, tam, "V", 6) + 70;
    x.save(); x.globalAlpha = a * (0.3 + 0.7 * p); x.translate(X, Y); x.rotate(rot); x.scale(z, z);
    x.strokeStyle = cor; x.lineWidth = 7; x.strokeRect(-w / 2, -tam * 0.95, w, tam * 1.45); x.lineWidth = 2.5; x.strokeRect(-w / 2 + 10, -tam * 0.95 + 10, w - 20, tam * 1.45 - 20);
    txt(s, 0, tam * 0.3, { tam, cor, esp: 6, sombra: 0 });
    // falhas de tinta
    x.globalCompositeOperation = "destination-out"; const r = rng(s.length * 31);
    for (let i = 0; i < 60; i++) { x.beginPath(); x.arc((r() - 0.5) * w, (r() - 0.6) * tam * 1.4, 1 + r() * 4, 0, 7); x.fill(); }
    x.restore();
  }, 2);
}
// fala/citação: palavras aparecem quando são ditas (caixa central)
function fala(frase, { depois, destaque = [], cor = COR.vermelho, tam = 76, Y = 540, larg = 1500, ate, escurece = 0.55, aspas = false } = {}) {
  const ts = tempos(frase, depois), pal = frase.split(/\s+/).filter((s) => norm(s));
  const t0 = ts[0] - 0.15, t1 = ate ?? TF(frase, depois) + 1.4;
  const D = destaque.map(norm);
  over(t0, t1, (t) => {
    const a = env(t, t0, t1, 0.3, 0.45);
    x.save(); x.globalAlpha = a * escurece; x.fillStyle = "#0a0604"; x.fillRect(0, 0, W, H); x.restore();
    // quebra em linhas
    x.save(); x.font = `700 ${tam}px V`; const esp = x.measureText(" ").width; x.restore();
    const linhas = [[]]; let lw = 0;
    pal.forEach((p, i) => { const w = largura(p, tam); if (lw + w > larg && linhas.at(-1).length) { linhas.push([]); lw = 0; } linhas.at(-1).push([p, w, i]); lw += w + esp; });
    linhas.forEach((ln, li) => {
      const tot = ln.reduce((s, [, w]) => s + w, 0) + esp * (ln.length - 1); let X = W / 2 - tot / 2;
      const Yl = Y + (li - (linhas.length - 1) / 2) * tam * 1.25;
      for (const [p, w, i] of ln) {
        const q = ease.o4(cl((t - ts[i] + 0.05) / 0.35));
        if (q > 0) txt(p, X + w / 2, Yl + (1 - q) * 30, { tam, cor: D.includes(norm(p)) ? cor : COR.creme, a: a * q });
        X += w + esp;
      }
    });
  }, 3);
  return t1;
}
// texto grande avulso (número, palavra-chave)
function grande(t0, t1, s, { sub = "", cor = COR.creme, tam = 150, Y = 560, escurece = 0.45, som = "batida_tensao" } = {}) {
  if (som) sfx(t0, som, 0.6);
  over(t0, t1, (t) => {
    const a = env(t, t0, t1, 0.25, 0.45), p = ease.back(cl((t - t0) / 0.5));
    x.save(); x.globalAlpha = a * escurece; x.fillStyle = "#0a0604"; x.fillRect(0, 0, W, H); x.restore();
    x.save(); x.translate(W / 2, Y); x.scale(lerp(0.6, 1, p), lerp(0.6, 1, p)); txt(s, 0, 0, { tam, cor, a, esp: 4 }); x.restore();
    if (sub) txt(sub, W / 2, Y + 80, { tam: 40, cor: COR.ouro, esp: 6, a: a * cl((t - t0 - 0.3) / 0.4) });
  }, 3);
}
// contador (1, 2, 3 ... / 450 vs 1)
function contador(t0, t1, de, ate, { sub = "", Y = 540, tam = 180, cor = COR.creme, dur = 1.2, sep = "." } = {}) {
  over(t0, t1, (t) => {
    const a = env(t, t0, t1, 0.25, 0.4), v = Math.round(lerp(de, ate, ease.o2(cl((t - t0) / dur))));
    x.save(); x.globalAlpha = a * 0.45; x.fillStyle = "#0a0604"; x.fillRect(0, 0, W, H); x.restore();
    txt(v.toLocaleString("pt-BR").replace(".", sep), W / 2, Y, { tam, cor, a, esp: 4 });
    if (sub) txt(sub, W / 2, Y + 80, { tam: 42, cor: COR.ouro, esp: 6, a });
  }, 3);
}
// vinheta escura + grão, sempre por cima
const GRAO = document.createElement("canvas"); GRAO.width = 512; GRAO.height = 512;
{ const g = GRAO.getContext("2d"), d = g.createImageData(512, 512), r = rng(5); for (let i = 0; i < d.data.length; i += 4) { const v = r() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 18; } g.putImageData(d, 0, 0); }
function acabamento(t) {
  const v = x.createRadialGradient(W / 2, H / 2, H * 0.42, W / 2, H / 2, H * 1.02);
  v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,0,.5)"); x.fillStyle = v; x.fillRect(0, 0, W, H);
  const f = Math.floor(t * 12); x.save(); x.globalCompositeOperation = "overlay"; x.translate(-(f * 97) % 512, -(f * 53) % 512);
  x.fillStyle = x.createPattern(GRAO, "repeat"); x.fillRect(0, 0, W + 512, H + 512); x.restore();
}
function desenhar(t) {
  calcTremor(t);
  fundo(t);
  const ativos = L.over.filter((o) => t >= o.t0 && t <= o.t1).sort((a, b) => a.camada - b.camada);
  for (const o of ativos) { x.save(); o.desenha(t); x.restore(); }
  for (const [t0, d, cor, a] of FLASH) if (t >= t0 && t < t0 + d) { x.fillStyle = `rgba(${cor},${a * (1 - (t - t0) / d)})`; x.fillRect(0, 0, W, H); }
  acabamento(t);
}
async function seek(t) {
  // garante que o quadro do clipe ativo (e o da cena anterior, na transição) esteja carregado
  const C = L.cenas; const prec = [];
  for (let i = 0; i < C.length; i++) { const c = C[i]; const fim = C[i + 1] ? C[i + 1].t0 + C[i + 1].tdur : L.total;
    if (c.clipe && t >= c.t0 && t <= fim) { const n = Math.min(c.clipe.n, 1 + Math.floor((t - c.t0) * FPS * c.clipe.vel)); prec.push(quadroClipe(c.clipe.nome, n)); quadroClipe(c.clipe.nome, Math.min(c.clipe.n, n + 2)); } }
  // sobreposições que usam clipe (vinheta)
  for (const o of L.over) if (o.clipe && t >= o.t0 && t <= o.t1) prec.push(quadroClipe(o.clipe, Math.min(o.n, 1 + Math.floor((t - o.t0) * FPS))));
  await Promise.all(prec.map((im) => (im.complete && im.naturalWidth) ? 0 : new Promise((r) => { im.onload = r; im.onerror = r; })));
  desenhar(t);
}
window.seek = seek;
