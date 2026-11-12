// Motor de tipografia cinética do canal Salmo e Pimenta.
// Palavras são objetos físicos desenhados em canvas; a timeline GSAP é "seekada"
// quadro a quadro pelo renderizador. Entradas: power4.out. Saídas: expo.out.
/* global gsap */
const W = 1080, H = 1920;
const COR = { fundo: "#070304", texto: "#ffffff", destaque: "#FF2A1A" };
const IN = "power4.out", OUT = "expo.out";
const LAND = 0.11;                 // instante em que o power4.out "toca" o destino
const FAMILIA = "Vietnam", PESO = 700;

const cv = document.getElementById("c");
const ctx = cv.getContext("2d");
function novoCanvas() { const c = document.createElement("canvas"); c.width = W; c.height = H; return [c, c.getContext("2d")]; }
const [tcv, tctx] = novoCanvas();   // camada de texto
const [mcv, mctx] = novoCanvas();   // máscara
const [fcv, fctx] = novoCanvas();   // cópias coloridas do glitch

// ---------------------------------------------------------------- utilidades
function rng(seed) {                 // mulberry32 determinístico
  return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
const R = rng(46);
const rand = (a, b) => a + (b - a) * R();

function setFont(c, s) { c.font = `${PESO} ${s}px ${FAMILIA}`; c.letterSpacing = `${(-0.02 * s).toFixed(2)}px`; }
const cacheM = new Map();
function measure(text, s) {
  const k = text + "|" + s.toFixed(3);
  let m = cacheM.get(k);
  if (!m) {
    setFont(ctx, s);
    const r = ctx.measureText(text);
    m = { w: r.width, asc: r.actualBoundingBoxAscent, desc: r.actualBoundingBoxDescent,
          left: r.actualBoundingBoxLeft, right: r.actualBoundingBoxRight };
    cacheM.set(k, m);
  }
  return m;
}
const inkW = (wd) => { const m = measure(wd.text, wd.s); return m.left + m.right; };
const asc = (wd) => measure(wd.text, wd.s).asc;
function fit(text, width) { const m = measure(text, 100); return 100 * width / (m.left + m.right); }

// ---------------------------------------------------------------- estado
const words = [];
const cam = { x: 0, y: 0 };
const fx = { flash: 0, glitch: 0, pulse: 0, rays: 0, raysX: W / 2, raysY: H / 2 };
const mask = { on: 0, scale: 1, ox: 0, oy: 0, fillTop: 0, outline: 0, w: null, content: [] };
const rings = [], bursts = [];
const SFX = [];
const tl = gsap.timeline({ paused: true });
let DURACAO = 30;

function word(text, o = {}) {
  const wd = { text, x: o.x ?? 0, y: -3000, s: o.s ?? 100, sx: 1, sy: 1, a: 0, rot: 0,
               color: o.color ?? COR.texto, split: 0, gap: 0, shT: 0, shards: null, alpha: o.alpha ?? 1 };
  if (o.width) wd.s = fit(text, o.width);
  if (o.center) wd.x = (W - inkW(wd)) / 2;
  words.push(wd);
  return wd;
}
// várias palavras numa linha, mesmo tamanho, justificadas em `width`
function row(texts, o = {}) {
  const SP = o.sp ?? 1.3, width = o.width ?? 920;
  let w100 = (texts.length - 1) * measure(" ", 100).w * SP;
  texts.forEach((t) => { const m = measure(t, 100); w100 += m.left + m.right; });
  const s = o.s ?? 100 * width / w100;
  const total = (w100 / 100) * s;
  let x = o.center ? (W - total) / 2 : (o.x ?? 80);
  const sp = measure(" ", s).w * SP;
  return texts.map((t, i) => {
    const wd = word(t, { s, color: (o.colors && o.colors[i]) || COR.texto });
    wd.x = x; x += inkW(wd) + sp;
    return wd;
  });
}
const rowAsc = (r) => Math.max(...r.map(asc));

function sfx(t, nome, ganho = 1) { SFX.push({ t: Math.max(0, t), nome, ganho }); }

// ---------------------------------------------------------------- efeitos
function shake(t, amp) {
  const sx = (R() < 0.5 ? -1 : 1) * amp * 0.35;
  tl.set(cam, { y: amp, x: sx }, t);
  tl.to(cam, { y: 0, x: 0, duration: 0.3, ease: IN }, t);
}
function land(t, targets, amt = 0.86) {
  targets.forEach((wd, i) => {
    const k = Math.min(1, amt + (1 - amt) * (i * 0.45));
    if (k >= 0.999) return;
    tl.set(wd, { sy: k, sx: 1 + (1 - k) * 0.35 }, t);
    tl.to(wd, { sy: 1, sx: 1, duration: 0.32, ease: IN }, t);
  });
}
function pulso(t, a) { tl.set(fx, { pulse: a }, t); tl.to(fx, { pulse: 0, duration: 0.9, ease: "power2.out" }, t); }
function glitch(t, a, d = 0.32) { tl.set(fx, { glitch: a }, t); tl.to(fx, { glitch: 0, duration: d, ease: "power2.out" }, t); }
function flash(t, a, d = 0.45) { tl.set(fx, { flash: a }, t); tl.to(fx, { flash: 0, duration: d, ease: "power2.out" }, t); }
function raios(t, x, y, dur) {
  tl.set(fx, { raysX: x, raysY: y }, t);
  tl.to(fx, { rays: 1, duration: 0.25, ease: IN }, t);
  tl.to(fx, { rays: 0, duration: 0.6, ease: OUT }, t + dur);
}
function anel(t, x, y, raio = 900, cor = "255,255,255") { rings.push({ t0: t, x, y, R: raio, dur: 0.75, cor }); }
function poeira(t, x0, x1, y, n = 30) {
  const parts = [];
  const cx = (x0 + x1) / 2;
  for (let i = 0; i < n; i++) {
    const x = rand(x0, x1), dir = Math.sign(x - cx) || 1;
    parts.push({ x, y: y + rand(-6, 4), vx: dir * rand(80, 700), vy: -rand(40, 420), life: rand(0.5, 1.2),
                 size: rand(2, 7), cor: "255,228,215", kind: "dust", drag: 3.2, g: 700 });
  }
  bursts.push({ t0: t, parts });
}
function faiscas(t, pts, n = 60, cor = "255,120,60") {
  const parts = [];
  for (let i = 0; i < n; i++) {
    const p = pts[Math.floor(R() * pts.length)], ang = rand(0, Math.PI * 2), v = rand(500, 1900);
    parts.push({ x: p[0], y: p[1], vx: Math.cos(ang) * v, vy: Math.sin(ang) * v - 300, life: rand(0.25, 0.8),
                 size: rand(1.5, 3.5), cor: R() < 0.3 ? "255,240,200" : cor, kind: "spark", drag: 2.2, g: 2400 });
  }
  bursts.push({ t0: t, parts });
}

// ---------------------------------------------------------------- movimentos
const IMPACTO = {
  pesado: { amp: 26, squash: 0.8, som: "impacto_pesado", poeira: 70 },
  medio: { amp: 12, squash: 0.86, som: "impacto_medio", poeira: 26 },
  clique: { amp: 4, squash: 0.94, som: "clique", poeira: 0 },
};
// a palavra cai até a linha de base y; o impacto (som, tremor, poeira) acontece em t + LAND
function drop(wd, t, y, o = {}) {
  const kind = o.impacto ?? "medio", I = IMPACTO[kind];
  const from = o.from ?? (kind === "clique" ? 260 : 1300), dur = o.dur ?? 0.42;
  tl.set(wd, { y: y - from, a: kind === "clique" ? 0 : wd.alpha, sx: 1, sy: 1 }, t - 0.0001);
  tl.to(wd, { y, duration: dur, ease: IN }, t);
  if (kind === "clique") tl.to(wd, { a: wd.alpha, duration: 0.07, ease: "none" }, t);
  const tc = t + LAND;
  shake(tc, I.amp * (o.forca ?? 1));
  land(tc, [wd, ...(o.sobre || [])], I.squash);
  sfx(tc - 0.015, I.som, o.ganho ?? 1);
  if (I.poeira) poeira(tc, wd.x, wd.x + inkW(wd), y, I.poeira);
  if (kind === "pesado") { anel(tc, wd.x + inkW(wd) / 2, y, 1000); glitch(tc, 0.9); pulso(tc, 1); }
  if (kind === "medio") { glitch(tc, 0.3, 0.2); pulso(tc, 0.35); }
}
// palavra aparece no lugar (pop curto) — para referências e assinaturas
function pop(wd, t, y, o = {}) { drop(wd, t, y, { impacto: "clique", from: 90, ...o }); }

function sair(lista, t, dir = "baixo", o = {}) {
  const dist = o.dist ?? 2300, dur = o.dur ?? 0.55;
  lista.forEach((wd, i) => {
    const ti = t + i * (o.stagger ?? 0.03);
    const p = dir === "baixo" ? { y: `+=${dist}` } : dir === "cima" ? { y: `-=${dist}` }
            : dir === "esq" ? { x: `-=${dist}` } : { x: `+=${dist}` };
    tl.to(wd, { ...p, duration: dur, ease: OUT }, ti);
    tl.set(wd, { a: 0 }, ti + dur + 0.02);
  });
  if (o.som !== false) sfx(t - 0.03, "whoosh", o.ganho ?? 0.8);
}

// estilhaça a palavra em cacos que caem com gravidade
function estilhacar(wd, t, o = {}) {
  const m = measure(wd.text, wd.s), w = m.left + m.right, h = m.asc + m.desc;
  const cols = o.cols ?? 6, rows = o.rows ?? 2, pad = 30;
  const gx = [], gy = [];
  const P = [];
  for (let j = 0; j <= rows; j++) {
    P[j] = [];
    for (let i = 0; i <= cols; i++) {
      let x = -pad + (w + 2 * pad) * i / cols, y = -m.asc - pad + (h + 2 * pad) * j / rows;
      if (i > 0 && i < cols) x += rand(-0.35, 0.35) * (w / cols);
      if (j > 0 && j < rows) y += rand(-0.3, 0.3) * (h / rows);
      P[j][i] = [x, y];
    }
  }
  const shards = [];
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const pts = [P[j][i], P[j][i + 1], P[j + 1][i + 1], P[j + 1][i]];
    const cx = pts.reduce((s, p) => s + p[0], 0) / 4, cy = pts.reduce((s, p) => s + p[1], 0) / 4;
    const dir = (cx - w / 2) / (w / 2);
    shards.push({ pts, cx, cy, vx: dir * rand(150, 520) + rand(-80, 80), vy: -rand(80, 520) * (j === 0 ? 1.2 : 0.6),
                  w: rand(-4, 4), g: 3200 });
  }
  wd.shards = shards;
  tl.set(wd, { shT: 0.0001 }, t);
  tl.to(wd, { shT: 1.6, duration: 1.6, ease: "none" }, t);
  tl.set(wd, { a: 0 }, t + 1.6);
  sfx(t - 0.03, "racha", 1);
  shake(t, 20); glitch(t, 0.8); pulso(t, 0.7);
  poeira(t, wd.x, wd.x + w, wd.y - m.asc / 2, 50);
}

// a palavra se divide em duas por um corte diagonal; metades deslizam para longe
function partir(wd, t, o = {}) {
  tl.to(wd, { gap: 10, duration: 0.16, ease: IN }, t);
  tl.to(wd, { split: o.dist ?? 1500, duration: 0.8, ease: OUT }, t + 0.18);
  tl.set(wd, { a: 0 }, t + 1.0);
  sfx(t - 0.02, "corte", 1);
  const m = measure(wd.text, wd.s), w = m.left + m.right;
  const th = -9 * Math.PI / 180, pts = [];
  for (let i = 0; i <= 20; i++) { const u = i / 20; pts.push([wd.x + u * w, wd.y - m.asc / 2 + Math.tan(th) * (u - 0.5) * w]); }
  faiscas(t + 0.02, pts, 90);
  glitch(t, 0.7); shake(t, 10); flash(t + 0.02, 0.25, 0.3);
}
// as duas metades voltam de longe e se fecham
function juntar(wd, t, y) {
  tl.set(wd, { y, gap: 8, split: 1500, a: wd.alpha, sx: 1, sy: 1 }, t - 0.0001);
  tl.to(wd, { split: 0, duration: 0.55, ease: IN }, t);
  tl.to(wd, { gap: 0, duration: 0.2, ease: IN }, t + 0.3);
  sfx(t - 0.05, "whoosh", 0.6);
  sfx(t + 0.16, "fechamento", 1);
}

// `mw` vira estêncil: por dentro das letras sobe `content`; depois a máscara explode
function mascara(mw, y, content, t, tExplode) {
  const m = measure(mw.text, mw.s);
  const y0 = mw.y; mw.y = y;
  const pt = pontoFundo(mw);
  mw.y = y0;
  mask.w = mw; mask.content = content;
  tl.set(mask, { on: 1, scale: 1, ox: pt.x, oy: pt.y, fillTop: y - m.asc - 30, outline: 1 }, t);
  tl.to(mask, { fillTop: y + 40, duration: 0.4, ease: OUT }, t + 0.02);
  tl.to(mask, { scale: 90, duration: 0.75, ease: OUT }, tExplode);
  tl.to(mask, { outline: 0, duration: 0.2, ease: OUT }, tExplode + 0.12);
  tl.set(mask, { on: 0 }, tExplode + 0.8);
  tl.set(mw, { a: 0 }, tExplode + 0.8);
  flash(tExplode + 0.04, 0.6, 0.55); glitch(tExplode, 0.6); pulso(tExplode, 1);
  anel(tExplode, pt.x, pt.y, 1300, "255,150,120");
  sfx(tExplode, "explosao_luz@pico", 1);
}
function pontoFundo(wd) {
  const m = measure(wd.text, wd.s);
  const [c, g] = novoCanvas();
  setFont(g, wd.s); g.fillStyle = "#fff";
  g.fillText(wd.text, wd.x + m.left, wd.y);
  const d = g.getImageData(0, 0, W, H).data;
  const on = (x, y) => x >= 0 && y >= 0 && x < W && y < H && d[(y * W + x) * 4 + 3] > 128;
  let best = { x: wd.x + 40, y: wd.y - m.asc / 2 }, bs = -1;
  for (let y = Math.floor(wd.y - m.asc); y < wd.y; y += 3)
    for (let x = Math.floor(wd.x); x < wd.x + m.left + m.right; x += 3) {
      if (!on(x, y)) continue;
      let l = 0, r = 0, u = 0, dn = 0;
      while (on(x - l, y)) l++; while (on(x + r, y)) r++;
      while (on(x, y - u)) u++; while (on(x, y + dn)) dn++;
      const sc = Math.min(l / (x + 1), r / (W - x), u / (y + 1), dn / (H - y));
      if (sc > bs) { bs = sc; best = { x, y }; }
    }
  return best;
}

// ---------------------------------------------------------------- desenho
function drawWord(c, wd, alphaMul = 1) {
  const a = wd.a * alphaMul;
  if (a <= 0.003 || wd.y < -2500) return;
  const m = measure(wd.text, wd.s);
  const w = m.left + m.right;
  c.save();
  c.globalAlpha = a;
  setFont(c, wd.s);
  c.fillStyle = wd.color;
  if (wd.color === COR.destaque) { c.shadowColor = "rgba(255,40,20,0.85)"; c.shadowBlur = 38; }
  if (wd.shT > 0 && wd.shards) {               // cacos
    const T = wd.shT;
    c.globalAlpha = a * Math.max(0, 1 - T / 1.4);
    for (const s of wd.shards) {
      c.save();
      c.translate(wd.x + s.cx + s.vx * T, wd.y + s.cy + s.vy * T + 0.5 * s.g * T * T);
      c.rotate(s.w * T);
      c.translate(-s.cx, -s.cy);
      c.beginPath(); s.pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.closePath();
      c.clip();
      c.fillText(wd.text, m.left, 0);
      c.restore();
    }
    c.restore();
    return;
  }
  c.translate(wd.x + w / 2, wd.y);
  c.rotate(wd.rot);
  c.scale(wd.sx, wd.sy);
  const tx = -w / 2 + m.left;
  if (wd.split === 0 && wd.gap === 0) {
    c.fillText(wd.text, tx, 0);
  } else {
    const th = -9 * Math.PI / 180, dx = Math.cos(th), dy = Math.sin(th), nx = dy, ny = -dx;
    const midY = -m.asc / 2, L = 4000;
    for (const side of [1, -1]) {
      c.save();
      c.translate(-side * dx * wd.split + side * nx * wd.gap, -side * dy * wd.split + side * ny * wd.gap);
      c.beginPath();
      c.moveTo(-L * dx, midY - L * dy); c.lineTo(L * dx, midY + L * dy);
      c.lineTo(L * dx + side * nx * L, midY + L * dy + side * ny * L);
      c.lineTo(-L * dx + side * nx * L, midY - L * dy + side * ny * L);
      c.closePath(); c.clip();
      c.fillText(wd.text, tx, 0);
      c.restore();
    }
  }
  c.restore();
}

function drawMask(c) {
  const mw = mask.w, m = measure(mw.text, mw.s);
  const setT = (g) => {
    g.setTransform(1, 0, 0, 1, cam.x, cam.y);
    g.translate(mask.ox, mask.oy); g.scale(mask.scale, mask.scale); g.translate(-mask.ox, -mask.oy);
  };
  mctx.setTransform(1, 0, 0, 1, 0, 0);
  mctx.globalCompositeOperation = "source-over";
  mctx.clearRect(0, 0, W, H);
  mctx.setTransform(1, 0, 0, 1, cam.x, cam.y);
  mask.content.forEach((wd) => drawWord(mctx, wd));
  setT(mctx);
  mctx.fillStyle = COR.texto;
  mctx.fillRect(-200, mask.fillTop, W + 400, mw.y + 60 - mask.fillTop);
  mctx.globalCompositeOperation = "destination-in";
  setFont(mctx, mw.s); mctx.fillStyle = "#fff";
  mctx.fillText(mw.text, mw.x + m.left, mw.y);
  mctx.globalCompositeOperation = "source-over";
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(mcv, 0, 0); c.restore();
  if (mask.outline > 0) {
    c.save(); setT(c);
    c.globalAlpha = mask.outline; setFont(c, mw.s);
    c.strokeStyle = COR.texto; c.lineWidth = 3 / mask.scale;
    c.strokeText(mw.text, mw.x + m.left, mw.y);
    c.restore();
  }
}

// fundo animado: manchas de luz vermelha/vinho, brasas subindo
const BRASAS = Array.from({ length: 90 }, () => ({
  x: rand(0, W), y0: rand(0, H + 300), v: rand(40, 170), sz: rand(1, 4.2), f: rand(0.3, 1.4), ph: rand(0, 6.28),
  amp: rand(10, 60), cor: R() < 0.7 ? "255,90,40" : "255,190,120", z: rand(0.3, 1) }));
const MANCHAS = [
  { cor: "150,12,8", a: 0.55, r: 1100, fx: 0.11, fy: 0.07, ph: 0.0, px: 0.3, py: 0.25 },
  { cor: "90,6,30", a: 0.6, r: 1300, fx: 0.08, fy: 0.12, ph: 2.1, px: 0.7, py: 0.7 },
  { cor: "255,60,20", a: 0.16, r: 700, fx: 0.17, fy: 0.13, ph: 4.0, px: 0.5, py: 0.5 },
];
const GRAOS = Array.from({ length: 6 }, (_, k) => {
  const c = document.createElement("canvas"); c.width = 540; c.height = 960;
  const g = c.getContext("2d"), img = g.createImageData(540, 960), r = rng(100 + k);
  for (let i = 0; i < img.data.length; i += 4) { const v = r() * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
  g.putImageData(img, 0, 0); return c;
});
const VINHETA = (() => {
  const [c, g] = novoCanvas();
  const gr = g.createRadialGradient(W / 2, H * 0.45, H * 0.25, W / 2, H * 0.5, H * 0.75);
  gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(0,0,0,0.85)");
  g.fillStyle = gr; g.fillRect(0, 0, W, H); return c;
})();

function drawFundo(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = COR.fundo; ctx.fillRect(0, 0, W, H);
  ctx.translate(cam.x * 0.3, cam.y * 0.3);
  ctx.globalCompositeOperation = "lighter";
  for (const b of MANCHAS) {
    const x = W * (b.px + 0.35 * Math.sin(t * b.fx * 6.28 + b.ph));
    const y = H * (b.py + 0.25 * Math.sin(t * b.fy * 6.28 + b.ph * 1.7));
    const a = b.a * (0.75 + 0.25 * Math.sin(t * 0.9 + b.ph)) * (1 + fx.pulse * 0.9);
    const g = ctx.createRadialGradient(x, y, 0, x, y, b.r);
    g.addColorStop(0, `rgba(${b.cor},${a})`); g.addColorStop(1, `rgba(${b.cor},0)`);
    ctx.fillStyle = g; ctx.fillRect(-100, -100, W + 200, H + 200);
  }
  if (fx.rays > 0.01) {
    ctx.save(); ctx.translate(fx.raysX, fx.raysY); ctx.rotate(t * 0.25);
    for (let i = 0; i < 16; i++) {
      ctx.rotate(Math.PI * 2 / 16);
      const g = ctx.createLinearGradient(0, 0, 1600, 0);
      g.addColorStop(0, `rgba(255,120,70,${0.32 * fx.rays})`); g.addColorStop(1, "rgba(255,80,40,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(1600, -90); ctx.lineTo(1600, 90); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }
  for (const e of BRASAS) {
    const y = H + 150 - ((e.y0 + t * e.v * (1 + fx.pulse * 0.8)) % (H + 300));
    const x = e.x + Math.sin(t * e.f + e.ph) * e.amp;
    const fl = 0.45 + 0.55 * Math.abs(Math.sin(t * 3 * e.f + e.ph));
    ctx.fillStyle = `rgba(${e.cor},${0.55 * fl * e.z})`;
    ctx.beginPath(); ctx.arc(x, y, e.sz * e.z * 1.6, 0, 6.28); ctx.fill();
    ctx.fillStyle = `rgba(${e.cor},${0.12 * fl * e.z})`;
    ctx.beginPath(); ctx.arc(x, y, e.sz * e.z * 6, 0, 6.28); ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";
}

function drawParticulas(t) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, cam.x, cam.y);
  ctx.globalCompositeOperation = "lighter";
  for (const r of rings) {
    const p = (t - r.t0) / r.dur;
    if (p < 0 || p > 1) continue;
    const e = 1 - Math.pow(2, -10 * p), rad = r.R * e;
    ctx.strokeStyle = `rgba(${r.cor},${0.55 * (1 - p)})`;
    ctx.lineWidth = 16 * (1 - p) + 1;
    ctx.beginPath(); ctx.ellipse(r.x, r.y, rad, rad * 0.22, 0, 0, 6.28); ctx.stroke();
  }
  for (const b of bursts) {
    const dt0 = t - b.t0;
    if (dt0 < 0 || dt0 > 1.6) continue;
    for (const p of b.parts) {
      if (dt0 > p.life) continue;
      const k = (1 - Math.exp(-p.drag * dt0)) / p.drag;
      const x = p.x + p.vx * k, y = p.y + p.vy * k + 0.5 * p.g * dt0 * dt0 * 0.5;
      const life = 1 - dt0 / p.life;
      if (p.kind === "spark") {
        const vx = p.vx * Math.exp(-p.drag * dt0), vy = p.vy * Math.exp(-p.drag * dt0) + p.g * dt0 * 0.5;
        ctx.strokeStyle = `rgba(${p.cor},${life})`; ctx.lineWidth = p.size;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - vx * 0.025, y - vy * 0.025); ctx.stroke();
      } else {
        ctx.fillStyle = `rgba(${p.cor},${0.5 * life})`;
        ctx.beginPath(); ctx.arc(x, y, p.size * (1 + dt0), 0, 6.28); ctx.fill();
      }
    }
  }
  ctx.restore();
}

const PROPS = ["x", "y", "s", "sx", "sy", "a", "split", "gap", "shT", "rot"];
function render(t) {
  // amostras anteriores para borrão de movimento (obturador ~1/45 s)
  const N = 6, span = 1 / 40, amostras = [];
  for (let k = N; k >= 1; k--) {
    tl.time(Math.max(0, t - span * k / N), true);
    amostras.push(words.map((wd) => { const o = {}; PROPS.forEach((p) => (o[p] = wd[p])); return o; }));
  }
  tl.time(t, true);
  drawFundo(t);

  // camada de texto
  tctx.setTransform(1, 0, 0, 1, 0, 0);
  tctx.clearRect(0, 0, W, H);
  tctx.setTransform(1, 0, 0, 1, cam.x, cam.y);
  words.forEach((wd, i) => {
    if (mask.on && (wd === mask.w || mask.content.includes(wd))) return;
    for (const am of amostras) {
      const s = am[i];
      const mov = Math.abs(s.x - wd.x) + Math.abs(s.y - wd.y) + Math.abs(s.split - wd.split);
      if (mov > 5 && s.a > 0) drawWord(tctx, Object.assign(Object.create(wd), s), 0.15);
    }
    drawWord(tctx, wd);
  });
  if (mask.on) drawMask(tctx);

  // composição com glitch RGB + brilho quente
  const g = fx.glitch;
  if (g > 0.02) {
    const d = 26 * g;
    for (const [cor, off] of [["rgb(255,30,60)", -d], ["rgb(0,220,255)", d]]) {
      fctx.setTransform(1, 0, 0, 1, 0, 0); fctx.globalCompositeOperation = "source-over";
      fctx.clearRect(0, 0, W, H); fctx.drawImage(tcv, 0, 0);
      fctx.globalCompositeOperation = "source-in"; fctx.fillStyle = cor; fctx.fillRect(0, 0, W, H);
      ctx.save(); ctx.setTransform(1, 0, 0, 1, off, 0); ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = Math.min(1, g * 1.2); ctx.drawImage(fcv, 0, 0); ctx.restore();
    }
  }
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.shadowColor = "rgba(255,70,40,0.55)"; ctx.shadowBlur = 34;
  ctx.drawImage(tcv, 0, 0);
  ctx.restore();
  if (g > 0.35) {
    const r = rng(Math.floor(t * 60) + 7);
    for (let i = 0; i < 5; i++) {
      const by = r() * H, bh = 8 + r() * 50, dx = (r() - 0.5) * 120 * g;
      ctx.drawImage(tcv, 0, by, W, bh, dx, by, W, bh);
    }
  }
  drawParticulas(t);

  // clarão, grão de filme e vinheta
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (fx.flash > 0.01) {
    const gr = ctx.createRadialGradient(W / 2, H * 0.45, 0, W / 2, H * 0.45, H * 0.8);
    gr.addColorStop(0, `rgba(255,235,220,${fx.flash})`); gr.addColorStop(1, `rgba(255,120,80,${fx.flash * 0.3})`);
    ctx.globalCompositeOperation = "screen"; ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
  }
  ctx.globalCompositeOperation = "overlay"; ctx.globalAlpha = 0.16;
  ctx.drawImage(GRAOS[Math.floor(t * 24) % GRAOS.length], 0, 0, W, H);
  ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
  ctx.drawImage(VINHETA, 0, 0);
}

window.seek = (t) => render(t);
