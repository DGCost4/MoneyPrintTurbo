// Motor de gravura Ukiyo-e em canvas (1080x1920, folha vertical).
// Cada cor é um "bloco" (canvas próprio) texturizado e impresso levemente fora de registro;
// a linha-chave (sumi) vai por cima; o papel é o branco.
const W = 1080, H = 1920;
const COR = {
  papel: "#eee2c6", papelClaro: "#f4ead2",
  prussia: "#1d3a66", prussiaEsc: "#13284a", prussiaClara: "#4d6f98", fundo: "#0f2344",
  azulPalido: "#8db0c6", azulNevoa: "#bcd0d6",
  sumi: "#231f1c", cinza: "#8a8577", cinzaEsc: "#5d5a52",
  beni: "#b8412f", beniPalido: "#e3a08a", pessego: "#efc4a8",
  ocre: "#cf9f4a", palha: "#c9a45c", bronze: "#b08a3e", bronzeEsc: "#86652b", couro: "#7a5a2e", madeira: "#8b5a2b",
  verde: "#8aa152", verdeEsc: "#50703c", pinho: "#3e5a3a",
  indigo: "#2c4a70", indigoEsc: "#1d2c44", pele: "#ecc9a2",
};

// ---------------------------------------------------------------- ruído
function hash(x, y, s) {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s | 0, 1442695041)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}
function vnoise(x, y, s) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x, y, s = 0, o = 4) {
  let t = 0, a = 0.5, f = 1;
  for (let i = 0; i < o; i++) { t += a * vnoise(x * f, y * f, s + i * 17); f *= 2; a *= 0.5; }
  return t / (1 - Math.pow(0.5, o));
}
let SEED = 1;
function rnd() { SEED = (SEED * 16807) % 2147483647; return (SEED - 1) / 2147483646; }
const R = (a, b) => a + (b - a) * rnd();
function hex2rgb(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }

function novoCanvas(w = W, h = H) { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; }

// ---------------------------------------------------------------- texturas (uma vez)
const TEX = {};
function prepararTexturas() {
  // veio de madeira: iso-linhas de um campo de ruído deformado
  const gw = 540, gh = 960, g = novoCanvas(gw, gh), gc = g.getContext("2d"), img = gc.createImageData(gw, gh);
  for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) {
    const u = y * 0.07 + fbm(x * 0.008, y * 0.02, 3, 4) * 9 + 2.5 * Math.exp(-((x - 300) ** 2 + (y - 500) ** 2) / 9000);
    const f = u - Math.floor(u);
    let a = Math.abs(f - 0.5) > 0.42 ? 0.75 : 0;
    a += 0.18 * (0.5 + 0.5 * Math.sin(u * 0.9));
    const i = (y * gw + x) * 4;
    img.data[i] = 18; img.data[i + 1] = 18; img.data[i + 2] = 28; img.data[i + 3] = a * 255;
  }
  gc.putImageData(img, 0, 0);
  TEX.veio = novoCanvas(); TEX.veio.getContext("2d").drawImage(g, 0, 0, W, H);
  // baren: arcos circulares borrados + zigue-zagues
  TEX.baren = novoCanvas();
  const b = TEX.baren.getContext("2d");
  SEED = 77;
  b.filter = "blur(3px)"; b.strokeStyle = "#fff"; b.lineCap = "round";
  for (let i = 0; i < 260; i++) {
    b.globalAlpha = R(0.2, 0.7); b.lineWidth = R(4, 18);
    b.beginPath(); const a0 = R(0, 6.28); b.arc(R(0, W), R(0, H), R(40, 170), a0, a0 + R(0.6, 2.4)); b.stroke();
  }
  for (let i = 0; i < 40; i++) {
    b.globalAlpha = R(0.2, 0.5); b.lineWidth = R(3, 9);
    let x = R(0, W), y = R(0, H); b.beginPath(); b.moveTo(x, y);
    for (let k = 0; k < 8; k++) { x += R(20, 50); y += (k % 2 ? 1 : -1) * R(15, 40); b.lineTo(x, y); }
    b.stroke();
  }
  b.filter = "none"; b.globalAlpha = 1;
  // goma-zuri: pontinhos
  TEX.pontos = novoCanvas();
  const p = TEX.pontos.getContext("2d");
  p.fillStyle = "#fff";
  for (let i = 0; i < 9000; i++) { p.globalAlpha = R(0.4, 1); p.beginPath(); p.arc(R(0, W), R(0, H), R(0.4, 1.6), 0, 6.28); p.fill(); }
  // papel: base manchada + fibras
  TEX.papel = novoCanvas();
  const q = TEX.papel.getContext("2d");
  const pw = 270, ph = 480, pm = novoCanvas(pw, ph), pmc = pm.getContext("2d"), pi = pmc.createImageData(pw, ph);
  const base = hex2rgb(COR.papel);
  for (let y = 0; y < ph; y++) for (let x = 0; x < pw; x++) {
    const n = (fbm(x * 0.03, y * 0.03, 9, 4) - 0.5) * 0.07, i = (y * pw + x) * 4;
    pi.data[i] = base[0] * (1 + n); pi.data[i + 1] = base[1] * (1 + n); pi.data[i + 2] = base[2] * (1 + n * 1.3); pi.data[i + 3] = 255;
  }
  pmc.putImageData(pi, 0, 0);
  q.imageSmoothingQuality = "high"; q.drawImage(pm, 0, 0, W, H);
  TEX.fibras = novoCanvas();
  const f = TEX.fibras.getContext("2d");
  f.lineCap = "round";
  for (let i = 0; i < 3200; i++) {
    f.strokeStyle = rnd() < 0.6 ? "#fbf6e9" : "#c7b893"; f.lineWidth = R(0.4, 1);
    let x = R(0, W), y = R(0, H), a = R(0, 6.28); f.beginPath(); f.moveTo(x, y);
    for (let k = 0; k < 3; k++) { a += R(-0.4, 0.4); x += Math.cos(a) * R(2, 6); y += Math.sin(a) * R(2, 6); f.lineTo(x, y); }
    f.stroke();
  }
}

// ---------------------------------------------------------------- blocos
const ORDEM = ["ceu", "azul", "verde", "ocre", "pele", "vermelho", "sombra", "chave"];
const REG = { ceu: [0, 0], azul: [2.2, -1.3], verde: [-1.8, 1.9], ocre: [-1.2, -1.6], pele: [1.0, 1.4],
              vermelho: [1.5, 2.2], sombra: [0, 0], chave: [0, 0] };
const VEIO = { ceu: 0.08, azul: 0.08, verde: 0.07, ocre: 0.08, pele: 0.04, vermelho: 0.06, sombra: 0.1 };
let BL = {};
function novaFolha() { BL = {}; BL.nevoa = novoCanvas().getContext("2d"); }
function blk(nome) { if (!BL[nome]) BL[nome] = novoCanvas().getContext("2d"); return BL[nome]; }

function imprimir(out) {
  out.globalCompositeOperation = "source-over"; out.globalAlpha = 1;
  out.drawImage(TEX.papel, 0, 0);
  for (const nome of ORDEM) {
    const c = BL[nome]; if (!c) continue;
    const cv = c.canvas;
    c.save();
    if (nome !== "chave") {
      c.globalCompositeOperation = "source-atop"; c.globalAlpha = VEIO[nome]; c.drawImage(TEX.veio, 0, 0);
      c.globalCompositeOperation = "destination-out"; c.globalAlpha = nome === "ceu" || nome === "azul" ? 0.14 : 0.1; c.drawImage(TEX.baren, 0, 0);
      c.globalAlpha = 0.3; c.drawImage(TEX.pontos, 0, 0);
      c.globalAlpha = 1; c.drawImage(BL.nevoa.canvas, 0, 0);       // névoa: o papel aparece
    } else {
      c.globalCompositeOperation = "destination-out"; c.globalAlpha = 0.12; c.drawImage(TEX.pontos, 0, 0);
      c.globalAlpha = 0.85; c.drawImage(BL.nevoa.canvas, 0, 0);
    }
    c.restore();
    out.drawImage(cv, REG[nome][0], REG[nome][1]);
  }
  out.globalAlpha = 0.06; out.drawImage(TEX.fibras, 0, 0); out.globalAlpha = 1;
  // borda de tinta grossa + fina e margem de papel
  out.save();
  out.fillStyle = COR.papel; out.globalAlpha = 1;
  out.beginPath(); out.rect(0, 0, W, H); out.rect(24, 24, W - 48, H - 48); out.fill("evenodd");
  out.globalAlpha = 0.6; out.drawImage(TEX.fibras, 0, 0);
  out.globalAlpha = 1; out.strokeStyle = COR.sumi;
  out.lineWidth = 4.5; out.strokeRect(26, 26, W - 52, H - 52);
  out.lineWidth = 1.6; out.strokeRect(15, 15, W - 30, H - 30);
  out.restore();
}

// ---------------------------------------------------------------- desenho
function suave(pts, fechado = false, n = 8) {
  const P = fechado ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]];
  const out = [];
  for (let i = 1; i < P.length - 2; i++) {
    const [p0, p1, p2, p3] = [P[i - 1], P[i], P[i + 1], P[i + 2]];
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t;
      out.push([0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
                0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)]);
    }
  }
  if (!fechado) out.push(pts[pts.length - 1]);
  return out;
}
function caminho(c, pts, fechado = true, liso = true) {
  const P = liso && pts.length > 2 ? suave(pts, fechado) : pts;
  c.beginPath(); c.moveTo(P[0][0], P[0][1]);
  for (let i = 1; i < P.length; i++) c.lineTo(P[i][0], P[i][1]);
  if (fechado) c.closePath();
}
// linha talhada: largura variável, afinando nas pontas
function talho(pts, w, o = {}) {
  const c = o.ctx || blk("chave");
  const P = o.liso === false ? pts : suave(pts, !!o.fechado);
  if (o.fechado) P.push(P[0]);
  const L = [0];
  for (let i = 1; i < P.length; i++) L.push(L[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
  const tot = L[L.length - 1] || 1, esq = [], dir = [], sd = o.seed ?? Math.floor(rnd() * 1000);
  for (let i = 0; i < P.length; i++) {
    const a = P[Math.max(0, i - 1)], b = P[Math.min(P.length - 1, i + 1)];
    let nx = -(b[1] - a[1]), ny = b[0] - a[0]; const nl = Math.hypot(nx, ny) || 1; nx /= nl; ny /= nl;
    const t = L[i] / tot;
    const tap = o.fechado || o.afinar === false ? 1 : Math.pow(Math.min(1, t / 0.15, (1 - t) / 0.15), 0.6);
    const jit = 1 + (fbm(L[i] * 0.012, 0, sd, 2) - 0.5) * 0.6;
    const ww = Math.max(0.35, w * tap * jit) / 2;
    esq.push([P[i][0] + nx * ww, P[i][1] + ny * ww]); dir.push([P[i][0] - nx * ww, P[i][1] - ny * ww]);
  }
  c.fillStyle = o.cor || COR.sumi;
  c.beginPath(); c.moveTo(esq[0][0], esq[0][1]);
  for (const p of esq) c.lineTo(p[0], p[1]);
  for (let i = dir.length - 1; i >= 0; i--) c.lineTo(dir[i][0], dir[i][1]);
  c.closePath(); c.fill();
}
// forma: preenche no bloco de cor e contorna na chave
function forma(bloco, pts, cor, lw = 2.6, o = {}) {
  const c = blk(bloco);
  const liso = o.liso ?? pts.length > 4;
  c.fillStyle = cor; caminho(c, pts, true, liso); c.fill();
  if (lw > 0) talho(pts, lw, { fechado: true, liso, cor: o.corLinha });
}
function linha(pts, lw = 2.6, o = {}) { talho(pts, lw, o); }
function circulo(bloco, x, y, r, cor, lw = 2.4) {
  const pts = []; for (let i = 0; i < 24; i++) pts.push([x + Math.cos(i / 24 * 6.283) * r, y + Math.sin(i / 24 * 6.283) * r]);
  forma(bloco, pts, cor, lw);
}
// bokashi por pixel: c0 em cima → c1 embaixo, borda serpenteando por coluna
function bokashi(bloco, x0, y0, x1, y1, c0, c1, borda = 0.5, suav = 0.25, vaguear = 26, seed = 5, a0 = 1, a1 = 1) {
  const w = Math.round(x1 - x0), h = Math.round(y1 - y0), t = novoCanvas(w, h), tc = t.getContext("2d"), img = tc.createImageData(w, h);
  const A = hex2rgb(c0), B = hex2rgb(c1);
  for (let x = 0; x < w; x++) {
    const e = borda * h + (fbm(x * 0.006, 0.5, seed, 3) - 0.5) * 2 * vaguear;
    for (let y = 0; y < h; y++) {
      let k = (y - e) / (suav * h) + 0.5; k = Math.max(0, Math.min(1, k)); k = k * k * (3 - 2 * k);
      const i = (y * w + x) * 4;
      img.data[i] = A[0] + (B[0] - A[0]) * k; img.data[i + 1] = A[1] + (B[1] - A[1]) * k; img.data[i + 2] = A[2] + (B[2] - A[2]) * k;
      img.data[i + 3] = 255 * (a0 + (a1 - a0) * k);
    }
  }
  tc.putImageData(img, 0, 0);
  blk(bloco).drawImage(t, x0, y0);
}
// faixa de névoa (suyari-gasumi): papel aparece; some nas pontas
function nevoa(x, y, w, h, alfa = 0.92) {
  const c = BL.nevoa;
  c.save(); c.filter = "blur(9px)";
  const g = c.createLinearGradient(x, 0, x + w, 0);
  g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(0.12, `rgba(0,0,0,${alfa})`);
  g.addColorStop(0.88, `rgba(0,0,0,${alfa})`); g.addColorStop(1, "rgba(0,0,0,0)");
  c.fillStyle = g;
  c.beginPath(); c.moveTo(x + h / 2, y); c.lineTo(x + w - h / 2, y); c.arc(x + w - h / 2, y + h / 2, h / 2, -1.57, 1.57);
  c.lineTo(x + h / 2, y + h); c.arc(x + h / 2, y + h / 2, h / 2, 1.57, 4.71); c.fill();
  c.restore();
}
function furoPapel(fn) { const c = BL.nevoa; c.save(); c.fillStyle = "#000"; c.strokeStyle = "#000"; fn(c); c.restore(); }
// perfil de morro
function perfil(x0, x1, yBase, amp, freq, seed, passo = 12) {
  const pts = [];
  for (let x = x0; x <= x1 + 0.1; x += passo) pts.push([x, yBase - amp * fbm(x * freq, 0.3, seed, 4)]);
  return pts;
}
function morro(bloco, pts, yFundo, cor, lw = 2.6) {
  const poly = [...pts, [pts[pts.length - 1][0], yFundo], [pts[0][0], yFundo]];
  const c = blk(bloco); c.fillStyle = cor; caminho(c, poly, true, false); c.fill();
  if (lw > 0) talho(pts, lw);
}
// linhas de campo paralelas e inclinadas dentro de um polígono
function campos(pts, yFundo, cor, inclin = -0.18, esp = 26, lw = 1.6) {
  const c = blk("chave");
  c.save(); const poly = [...pts, [pts[pts.length - 1][0], yFundo], [pts[0][0], yFundo]];
  caminho(c, poly, true, false); c.clip();
  for (let y = 0; y < H + 400; y += esp) talho([[0, y], [W, y + W * inclin]], lw, { cor, liso: false, ctx: c });
  c.restore();
}

// ---------------------------------------------------------------- figuras
// transformação local: unidades (u = altura/100), pés na origem, x para a frente
function T(x0, y0, h, dir = 1, ang = 0) {
  const u = h / 100, ca = Math.cos(ang), sa = Math.sin(ang);
  return (p) => { const x = p[0] * u * dir, y = p[1] * u; return [x0 + x * ca - y * sa, y0 + x * sa + y * ca]; };
}
const mapa = (t, pts) => pts.map(t);

function pastor(x, y, h, o = {}) {
  const t = T(x, y, h, o.dir ?? 1, o.ang ?? 0), u = h / 100, lw = Math.max(1.4, 3.2 * u / 2.2);
  const costas = o.costas;
  // pernas
  for (const s of [-1, 1]) forma("pele", mapa(t, [[s * 3 - 2.6, -40], [s * 3 + 2.6, -40], [s * 4 + 2.4, -2], [s * 4 - 2.6, -2]]), COR.pele, lw * 0.8);
  for (const s of [-1, 1]) forma("chave", mapa(t, [[s * 4 - 3.5, -3], [s * 4 + 5, -3], [s * 4 + 5.5, 0], [s * 4 - 3.5, 0]]), COR.sumi, 0);
  // braço de trás
  if (!o.funda) forma("pele", mapa(t, [[-9, -76], [-6, -77], [-8, -50], [-11, -51]]), COR.pele, lw * 0.8);
  // túnica
  forma("ocre", mapa(t, [[-10, -80], [10, -80], [15, -36], [3, -34], [-14, -36]]), o.tunica || COR.palha, lw);
  // manto sobre o ombro
  if (o.manto !== false) forma("azul", mapa(t, [[-11, -81], [3, -82], [-2, -64], [-13, -46], [-15, -60]]), o.manto || COR.indigo, lw);
  // faixa vermelha (o raro vermelho de Davi)
  if (o.faixa !== false) forma("vermelho", mapa(t, [[-11, -57], [12, -57], [12.5, -52], [-12, -52]]), o.faixa || COR.beni, lw * 0.7);
  // bolsa de pastor
  forma("ocre", mapa(t, [[8, -56], [15, -55], [15, -45], [8, -46]]), COR.couro, lw * 0.8);
  // braço da frente
  if (o.bracosAbertos) {
    forma("pele", mapa(t, [[7, -78], [10, -79], [24, -104], [21, -106]]), COR.pele, lw * 0.8);
    forma("pele", mapa(t, [[-7, -78], [-10, -79], [-22, -104], [-19, -106]]), COR.pele, lw * 0.8);
  } else if (o.funda) {
    forma("pele", mapa(t, [[7, -78], [10, -79], [22, -104], [19, -106]]), COR.pele, lw * 0.8);
    const cordao = o.girando ? [[20, -106], [30, -122], [42, -118], [38, -104], [24, -106]] : [[20, -106], [26, -96], [30, -84]];
    linha(mapa(t, cordao), lw * 0.55, { afinar: false });
    if (!o.girando) circulo("ocre", ...t([30, -82]), 2.2 * u, COR.couro, lw * 0.6);
  } else {
    forma("pele", mapa(t, [[6, -77], [9, -78], [12, -52], [9, -51]]), COR.pele, lw * 0.8);
  }
  if (o.cajado) linha(mapa(t, [[11.5, 0], [12.5, -50], [14, -95], [17, -102], [21, -100]]), lw * 0.9, { cor: "#4a3524" });
  // pescoço e cabeça
  const cy = o.olhaCima ? -90 : -89, cx = o.olhaCima ? 1 : 2;
  forma("pele", mapa(t, [[-2, -82], [3, -82], [3, -86], [-2, -86]]), COR.pele, 0);
  const cab = []; for (let i = 0; i < 18; i++) { const a = i / 18 * 6.283; cab.push([cx + Math.cos(a) * 7, cy + Math.sin(a) * 8]); }
  forma("pele", mapa(t, cab), COR.pele, lw * 0.9);
  // cabelo cacheado (de costas cobre a cabeça toda)
  forma("chave", mapa(t, costas ? cab : [[cx - 7.5, cy + 4], [cx - 8, cy - 4], [cx - 4, cy - 9], [cx + 3, cy - 9.5], [cx + 7.5, cy - 5], [cx + 3, cy - 4], [cx - 1, cy - 2], [cx - 2, cy + 5]]), COR.sumi, 0);
  if (!costas) linha(mapa(t, [[cx + 3, cy - 1], [cx + 5.5, cy - 1.3]]), lw * 0.6, { liso: false });
  if (o.barba && !costas) forma("chave", mapa(t, [[cx - 1, cy + 2], [cx + 7, cy + 2], [cx + 5, cy + 9], [cx + 1, cy + 9]]), COR.sumi, 0);
  if (o.veu) forma("chave", mapa(t, [[cx - 8, cy + 9], [cx - 8.5, cy - 5], [cx - 3, cy - 10.5], [cx + 4, cy - 10], [cx + 6, cy - 6], [cx - 2, cy - 5], [cx - 4, cy + 10]]), o.veu, 0);
}

function gigante(x, y, h, o = {}) {
  const t = T(x, y, h, o.dir ?? -1, o.ang ?? 0), u = h / 100, lw = Math.max(1.6, 1.25 * u);
  const sil = o.silhueta;   // só a sombra
  const B = (bloco) => (sil ? "sombra" : bloco);
  const C = (cor) => (sil ? "rgba(15,20,35,0.55)" : cor);
  const L = sil ? 0 : lw;
  // lança (atrás)
  forma(B("ocre"), mapa(t, [[20.5, -128], [23, -128], [21, 0], [18.5, 0]]), C(COR.madeira), L, { liso: false });
  forma(B("pele"), mapa(t, [[21.7, -146], [25.5, -132], [21.7, -124], [18, -132]]), C("#9aa3a8"), L);
  // escudo (atrás)
  const esc = []; for (let i = 0; i < 24; i++) { const a = i / 24 * 6.283; esc.push([-16 + Math.cos(a) * 14, -62 + Math.sin(a) * 14]); }
  forma(B("ocre"), mapa(t, esc), C(COR.bronzeEsc), L);
  if (!sil) { const e2 = esc.map(([a, b]) => [-16 + (a + 16) * 0.65, -62 + (b + 62) * 0.65]); talho(mapa(t, e2), lw * 0.7, { fechado: true }); circulo("ocre", ...t([-16, -62]), 2.5 * u, COR.bronze, lw * 0.7); }
  // pernas com grevas
  for (const [s, d] of [[-1, -6], [1, 5]]) {
    forma(B("pele"), mapa(t, [[d - 4, -50], [d + 4, -50], [d + 4.5, -28], [d - 3.5, -28]]), C(COR.pele), L);
    forma(B("ocre"), mapa(t, [[d - 4, -30], [d + 4.8, -30], [d + 5, -4], [d - 3.4, -4]]), C(COR.bronze), L);
    forma(B("chave"), mapa(t, [[d - 4, -4], [d + 8, -4], [d + 8.5, 0], [d - 4, 0]]), C(COR.sumi), 0);
  }
  // saiote de tiras de couro
  forma(B("ocre"), mapa(t, [[-13, -60], [13, -60], [15, -42], [-15, -42]]), C(COR.couro), L, { liso: false });
  if (!sil) for (let k = -12; k <= 12; k += 4) linha(mapa(t, [[k, -58], [k * 1.12, -43]]), lw * 0.6, { liso: false });
  // tronco com cota de escamas
  const tronco = [[-15, -83], [15, -83], [12, -58], [-12, -58]];
  forma(B("ocre"), mapa(t, tronco), C(COR.bronze), L, { liso: false });
  if (!sil) {
    const c = blk("chave"); c.save(); caminho(c, mapa(t, tronco), true, false); c.clip();
    for (let yy = -82; yy < -58; yy += 3.2) for (let xx = -16 + ((yy * 10) % 2); xx < 16; xx += 3.4) {
      const p = []; for (let i = 0; i <= 6; i++) { const a = Math.PI * i / 6; p.push([xx + Math.cos(a) * 1.7, yy + Math.sin(a) * 1.9]); }
      talho(mapa(t, p), lw * 0.45, { afinar: false });
    }
    c.restore();
  }
  // braço da lança
  forma(B("pele"), mapa(t, [[11, -82], [16, -82], [22, -64], [18, -61]]), C(COR.pele), L);
  forma(B("ocre"), mapa(t, [[17.5, -70], [22.5, -68], [22.5, -62], [18, -61]]), C(COR.bronze), L);
  // pescoço, cabeça, barba, elmo
  forma(B("pele"), mapa(t, [[-3, -83], [5, -83], [5, -88], [-3, -88]]), C(COR.pele), 0);
  forma(B("pele"), mapa(t, [[-6, -88], [6, -90], [9.5, -93], [8, -95], [9, -98], [3, -101], [-6, -99]]), C(COR.pele), L);
  forma(B("chave"), mapa(t, [[1, -90], [9, -91], [7.5, -84], [3, -82], [-1, -85]]), C(COR.sumi), 0);   // barba
  forma(B("ocre"), mapa(t, [[-8, -94], [-7, -101], [-2, -105.5], [5, -105], [8.5, -100], [7, -98], [-1, -98], [-3, -93]]), C(COR.bronze), L);
  forma(B("chave"), mapa(t, [[-4, -105], [0, -112], [6, -113], [10, -110], [4, -108], [1, -105]]), C(COR.sumi), 0);   // crista
  if (!sil) { linha(mapa(t, [[4, -96.5], [7, -96]]), lw * 0.8, { liso: false }); linha(mapa(t, [[3, -98], [7.5, -98.4]]), lw * 0.9, { liso: false }); }
}

function ovelha(x, y, s, dir = 1) {
  const t = T(x, y, s * 3.2, dir), lw = 2.2;
  for (const d of [-6, -2, 3, 7]) linha(mapa(t, [[d, -12], [d, 0]]), lw, { liso: false });
  const corpo = []; for (let i = 0; i < 14; i++) { const a = i / 14 * 6.283; const r = 1 + 0.12 * Math.sin(i * 2.7); corpo.push([Math.cos(a) * 12 * r, -16 + Math.sin(a) * 7.5 * r]); }
  forma("pele", mapa(t, corpo), COR.papelClaro, lw);
  forma("chave", mapa(t, [[10, -20], [16, -21], [18, -16], [13, -14]]), COR.sumi, 0);
}
function tenda(x, y, w, cor = COR.palha) {
  forma("ocre", [[x - w / 2, y], [x, y - w * 0.62], [x + w / 2, y]], cor, 2, { liso: false });
  linha([[x, y - w * 0.62], [x, y]], 1.4, { liso: false });
  linha([[x, y - w * 0.62], [x, y - w * 0.8]], 1.6, { liso: false });
}
function pinheiro(x, y, h, dir = 1) {
  const t = T(x, y, h, dir);
  forma("ocre", mapa(t, [[-3, 0], [3, 0], [5, -40], [-2, -70], [6, -100], [2, -100], [-6, -70], [0, -40]]), "#5a4030", 2.4);
  const pads = [[6, -100, 22], [-14, -78, 20], [14, -64, 19], [-8, -50, 17]];
  for (const [px, py, r] of pads) {
    const p = [[px - r, py], [px - r * 0.8, py - r * 0.28], [px, py - r * 0.36], [px + r * 0.8, py - r * 0.28], [px + r, py], [px + r * 0.5, py + r * 0.22], [px - r * 0.5, py + r * 0.22]];
    forma("verde", mapa(t, p), COR.pinho, 2.4);
    for (let k = -0.8; k <= 0.8; k += 0.2) linha(mapa(t, [[px + k * r, py - r * 0.25], [px + k * r * 1.1, py + r * 0.15]]), 1.1, { liso: false });
  }
}
function sol(x, y, r, bloco = "vermelho") { circulo(bloco, x, y, r, COR.beni, 0); }
function estrelas(n, x0, y0, x1, y1, seed = 3) {
  SEED = seed;
  furoPapel((c) => {
    for (let i = 0; i < n; i++) {
      const x = R(x0, x1), y = R(y0, y1), r = rnd() < 0.08 ? R(4, 7) : R(1.2, 3);
      c.globalAlpha = R(0.6, 1); c.beginPath(); c.arc(x, y, r, 0, 6.28); c.fill();
      if (r > 4) { c.lineWidth = 1.5; c.beginPath(); c.moveTo(x - r * 3, y); c.lineTo(x + r * 3, y); c.moveTo(x, y - r * 3); c.lineTo(x, y + r * 3); c.stroke(); }
    }
  });
}
function chuva(n, ang, comp, seed = 9, cor = "rgba(35,31,28,0.6)") {
  SEED = seed; const c = blk("chave"); c.strokeStyle = cor; c.lineWidth = 2.1;
  c.beginPath();
  for (let i = 0; i < n; i++) { const x = R(-200, W + 200), y = R(0, H); c.moveTo(x, y); c.lineTo(x + Math.sin(ang) * comp, y + Math.cos(ang) * comp); }
  c.stroke();
}
function agua(y0, y1, seed = 4) {
  // faixas azuis com bokashi entre elas e linhas de fluxo de papel
  bokashi("azul", 0, y0, W, y1, COR.prussiaClara, COR.prussia, 0.45, 0.6, 20, seed);
  SEED = seed;
  for (let k = 0; k < 9; k++) {
    const y = y0 + (y1 - y0) * (k + 0.5) / 9;
    const pts = []; for (let x = -40; x <= W + 40; x += 60) pts.push([x, y + Math.sin(x * 0.012 + k) * 10 + R(-4, 4)]);
    furoPapel((c) => { c.lineWidth = R(2, 4); c.lineCap = "round"; caminho(c, pts, false); c.stroke(); });
    talho(pts.map(([a, b]) => [a, b + 7]), 1.2, { cor: COR.prussiaEsc });
  }
}
