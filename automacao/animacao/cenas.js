// Cenas ilustradas e animadas (estilo ilustração plana, tons coral e verde-água).
// Cada cena é uma função (ctx, t, d) que desenha o quadro no tempo t (segundos desde o
// início da cena), sabendo a duração d da cena. Tudo é determinístico: o mesmo t gera
// sempre o mesmo quadro, o que permite gravar o vídeo quadro a quadro.

const W = 1080, H = 1920;
const COR = {
  coral: "#e8735a", coralClaro: "#f29b7c", coralEscuro: "#c9553f",
  creme: "#f6e6cf", cremeEscuro: "#ead2b0", pele: "#e3a983", cabelo: "#3b2a20",
  mar1: "#2f8c86", mar2: "#1d5f5d", mar3: "#0b2b2f", dourado: "#ffd28a",
};

// ---------- utilidades ----------
function rng(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, k) => a + (b - a) * k;
const suave = (k) => { k = clamp(k, 0, 1); return k * k * (3 - 2 * k); };
const saidaSuave = (k) => 1 - Math.pow(1 - clamp(k, 0, 1), 3);

function gradV(ctx, y0, y1, cores) {
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  cores.forEach((c, i) => g.addColorStop(i / (cores.length - 1), c));
  return g;
}

function vinheta(ctx, forca = 0.45) {
  const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.75);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, `rgba(0,0,0,${forca})`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

function onda(x, t, base, amp, k, vel, fase) {
  return base + amp * Math.sin(x * k + t * vel + fase) + amp * 0.45 * Math.sin(x * k * 2.3 - t * vel * 1.4 + fase * 2);
}

function camadaOnda(ctx, t, base, amp, k, vel, fase, cor) {
  ctx.beginPath(); ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 12) ctx.lineTo(x, onda(x, t, base, amp, k, vel, fase));
  ctx.lineTo(W, H); ctx.closePath(); ctx.fillStyle = cor; ctx.fill();
}

// Pessoa estilizada (Jonas): túnica creme, cabeça com olhos e barba.
// bracos: 0 = abaixados ao lado do corpo, 1 = erguidos para o alto (oração/louvor).
function pessoa(ctx, x, y, s, ang, bracos = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  const ombroY = -58;
  ctx.lineCap = "round";
  for (const lado of [-1, 1]) {
    const th = lerp(0.25, 2.55, bracos); // ângulo a partir de "para baixo", abrindo para fora
    const cx = lado * 24, cy = ombroY + 4;
    const mx = cx + lado * Math.sin(th) * 48, my = cy + Math.cos(th) * 48;
    const hx = cx + lado * Math.sin(th) * 92, hy = cy + Math.cos(th) * 92;
    ctx.strokeStyle = COR.cremeEscuro; ctx.lineWidth = 24; // manga
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(mx, my); ctx.stroke();
    ctx.strokeStyle = COR.pele; ctx.lineWidth = 14; // antebraço
    ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(hx, hy); ctx.stroke();
    ctx.fillStyle = COR.pele; ctx.beginPath(); ctx.arc(hx, hy, 10, 0, 7); ctx.fill();
  }
  // túnica
  ctx.fillStyle = COR.creme;
  ctx.beginPath(); ctx.moveTo(-28, ombroY - 6); ctx.quadraticCurveTo(0, ombroY - 16, 28, ombroY - 6);
  ctx.lineTo(44, 72); ctx.quadraticCurveTo(0, 84, -44, 72); ctx.closePath(); ctx.fill();
  ctx.fillStyle = COR.coral; ctx.fillRect(-30, -2, 60, 10); // faixa
  // cabeça
  const cy = ombroY - 36;
  ctx.fillStyle = COR.pele; ctx.beginPath(); ctx.arc(0, cy, 25, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = COR.cabelo;
  ctx.beginPath(); ctx.arc(0, cy - 4, 26, Math.PI * 1.08, Math.PI * 1.92); ctx.closePath(); ctx.fill(); // cabelo
  ctx.beginPath(); ctx.moveTo(-24, cy + 2); ctx.quadraticCurveTo(-22, cy + 34, 0, cy + 38); // barba
  ctx.quadraticCurveTo(22, cy + 34, 24, cy + 2); ctx.quadraticCurveTo(12, cy + 14, 0, cy + 13);
  ctx.quadraticCurveTo(-12, cy + 14, -24, cy + 2); ctx.fill();
  ctx.fillStyle = "#2b1a14"; // olhos
  ctx.beginPath(); ctx.arc(-9, cy - 3, 3.2, 0, 7); ctx.arc(9, cy - 3, 3.2, 0, 7); ctx.fill();
  ctx.restore();
}

// Grande peixe (baleia), virado para a esquerda. boca: 0 fechada .. 1 aberta. brilho: luz na barriga.
function baleia(ctx, x, y, s, t, boca = 0, brilho = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // cauda
  ctx.save(); ctx.translate(370, -5); ctx.rotate(Math.sin(t * 2.2) * 0.28);
  ctx.fillStyle = COR.coralEscuro;
  ctx.beginPath(); ctx.moveTo(0, 0);
  ctx.bezierCurveTo(60, -40, 120, -140, 190, -150); ctx.bezierCurveTo(160, -90, 150, -40, 110, 0);
  ctx.bezierCurveTo(150, 40, 160, 90, 190, 150); ctx.bezierCurveTo(120, 140, 60, 40, 0, 0);
  ctx.fill(); ctx.restore();
  // boca aberta (interior escuro + mandíbula)
  if (boca > 0.01) {
    ctx.save(); ctx.translate(-140, 35); ctx.rotate(boca * 0.55);
    ctx.fillStyle = "#5b1f24";
    ctx.beginPath(); ctx.moveTo(10, -10); ctx.lineTo(-250, -18); ctx.quadraticCurveTo(-140, 30, 10, 20); ctx.fill();
    ctx.fillStyle = COR.coral;
    ctx.beginPath(); ctx.moveTo(10, 5); ctx.lineTo(-245, 0);
    ctx.quadraticCurveTo(-200, 90, -20, 110); ctx.quadraticCurveTo(30, 80, 10, 5); ctx.fill();
    ctx.fillStyle = COR.creme;
    ctx.beginPath(); ctx.moveTo(-240, 4); ctx.quadraticCurveTo(-190, 80, -30, 100); ctx.lineTo(-30, 60);
    ctx.quadraticCurveTo(-150, 50, -240, 4); ctx.fill();
    ctx.restore();
  }
  // corpo
  const corpo = new Path2D();
  corpo.moveTo(-385, 15 - boca * 25);
  corpo.bezierCurveTo(-375, -190, -60, -235, 150, -150);
  corpo.bezierCurveTo(260, -110, 330, -50, 385, -28);
  corpo.lineTo(385, 18);
  corpo.bezierCurveTo(300, 60, 200, 150, 0, 160);
  corpo.bezierCurveTo(-150, 165, -120, boca > 0.01 ? 40 : 120, -140, 40);
  corpo.lineTo(-385, 15 - boca * 25);
  const g = ctx.createLinearGradient(0, -230, 0, 160);
  g.addColorStop(0, COR.coralClaro); g.addColorStop(0.55, COR.coral); g.addColorStop(1, COR.coralEscuro);
  ctx.fillStyle = g; ctx.fill(corpo);
  // barriga creme com sulcos
  ctx.save(); ctx.clip(corpo);
  ctx.fillStyle = COR.creme;
  ctx.beginPath(); ctx.moveTo(-400, 30); ctx.bezierCurveTo(-200, 70, 100, 90, 330, 30); ctx.lineTo(330, 300); ctx.lineTo(-400, 300); ctx.fill();
  ctx.strokeStyle = COR.cremeEscuro; ctx.lineWidth = 6;
  for (let i = 0; i < 6; i++) {
    ctx.beginPath(); ctx.moveTo(-300 + i * 20, 70 + i * 14); ctx.bezierCurveTo(-120, 95 + i * 14, 80, 100 + i * 12, 280, 60 + i * 10); ctx.stroke();
  }
  // manchas claras nas costas
  ctx.fillStyle = "rgba(255,230,210,0.35)";
  [[-60, -150, 18], [20, -165, 12], [90, -140, 15], [-130, -130, 10]].forEach(([a, b, r]) => { ctx.beginPath(); ctx.arc(a, b, r, 0, 7); ctx.fill(); });
  // luz dentro da barriga (oração de Jonas)
  if (brilho > 0.01) {
    const rg = ctx.createRadialGradient(40, 40, 0, 40, 40, 260);
    rg.addColorStop(0, `rgba(255,236,170,${0.9 * brilho})`);
    rg.addColorStop(1, "rgba(255,236,170,0)");
    ctx.fillStyle = rg; ctx.fillRect(-400, -250, 800, 450);
  }
  ctx.restore();
  // nadadeira
  ctx.save(); ctx.translate(-60, 115); ctx.rotate(0.5 + Math.sin(t * 2) * 0.25);
  ctx.fillStyle = COR.coralEscuro; ctx.beginPath(); ctx.ellipse(40, 0, 80, 26, 0, 0, 7); ctx.fill(); ctx.restore();
  // olho
  ctx.fillStyle = "#2b1a1a"; ctx.beginPath(); ctx.arc(-255, -45, 15, 0, 7); ctx.fill();
  ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(-250, -50, 5, 0, 7); ctx.fill();
  ctx.restore();
  if (brilho > 0.01) { // raios de luz saindo do peixe
    ctx.save(); ctx.translate(x + 40 * s, y + 40 * s); ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 + t * 0.25;
      ctx.rotate(0); ctx.fillStyle = `rgba(255,220,150,${0.08 * brilho})`;
      ctx.beginPath(); ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a - 0.06) * 700, Math.sin(a - 0.06) * 700); ctx.lineTo(Math.cos(a + 0.06) * 700, Math.sin(a + 0.06) * 700); ctx.fill();
    }
    ctx.restore();
  }
}

// ---------- fundo do mar compartilhado ----------
function fundoMar(ctx, t, semente = 7) {
  ctx.fillStyle = gradV(ctx, 0, H, [COR.mar1, COR.mar2, COR.mar3]); ctx.fillRect(0, 0, W, H);
  // raios de luz vindos da superfície
  ctx.save(); ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 7; i++) {
    const x = 80 + i * 160 + Math.sin(t * 0.4 + i) * 40;
    const a = 0.05 + 0.035 * Math.sin(t * 0.9 + i * 1.7);
    const g = ctx.createLinearGradient(0, 0, 0, H * 0.8);
    g.addColorStop(0, `rgba(255,244,210,${a})`); g.addColorStop(1, "rgba(255,244,210,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - 30, 0); ctx.lineTo(x + 30, 0); ctx.lineTo(x + 170, H * 0.8); ctx.lineTo(x - 50, H * 0.8); ctx.fill();
  }
  ctx.restore();
  // partículas (plâncton brilhante)
  const r = rng(semente);
  for (let i = 0; i < 90; i++) {
    const px = r() * W, py0 = r() * H, v = 15 + r() * 30, tam = 2 + r() * 4;
    const py = ((py0 - t * v) % H + H) % H;
    ctx.fillStyle = `rgba(220,255,240,${0.25 + 0.25 * Math.sin(t * 2 + i)})`;
    ctx.beginPath(); ctx.arc(px + Math.sin(t + i) * 8, py, tam, 0, 7); ctx.fill();
  }
}

function fundoDoMarPedras(ctx, t) {
  ctx.fillStyle = "#082024";
  ctx.beginPath(); ctx.moveTo(0, H);
  ctx.lineTo(0, 1650); ctx.quadraticCurveTo(160, 1540, 330, 1630); ctx.quadraticCurveTo(520, 1500, 700, 1610);
  ctx.quadraticCurveTo(880, 1520, W, 1600); ctx.lineTo(W, H); ctx.fill();
  // algas balançando
  const r = rng(3);
  for (let i = 0; i < 14; i++) {
    const bx = r() * W, alt = 160 + r() * 260, cor = r() > 0.5 ? "#1f6b5c" : "#2a8a6e";
    ctx.strokeStyle = cor; ctx.lineWidth = 16 + r() * 8; ctx.lineCap = "round";
    const sw = Math.sin(t * 1.3 + i) * 40;
    ctx.beginPath(); ctx.moveTo(bx, H - 120);
    ctx.bezierCurveTo(bx + sw * 0.3, H - 120 - alt * 0.4, bx - sw * 0.5, H - 120 - alt * 0.7, bx + sw, H - 120 - alt);
    ctx.stroke();
  }
}

function bolhas(ctx, t, x0, y0, n, semente, inicio = 0) {
  const r = rng(semente);
  for (let i = 0; i < n; i++) {
    const atraso = r() * 3, vel = 120 + r() * 160, tam = 6 + r() * 14, desvio = (r() - 0.5) * 80;
    const tt = t - inicio - atraso; if (tt < 0) continue;
    const ciclo = tt % 3.2, y = y0 - ciclo * vel;
    const x = x0 + desvio + Math.sin(tt * 3 + i) * 12;
    ctx.strokeStyle = `rgba(230,255,250,${0.7 * (1 - ciclo / 3.2)})`; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(x, y, tam, 0, 7); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.beginPath(); ctx.arc(x - tam * 0.35, y - tam * 0.35, tam * 0.25, 0, 7); ctx.fill();
  }
}

// ---------- cenas ----------
const CENAS = {};

// Tempestade no mar: céu escuro, nuvens, chuva, raios, ondas e o barco balançando.
CENAS.tempestade = function (ctx, t, d) {
  const raios = [1.0, 3.6, 6.2, 9.0, 11.5].filter((x) => x < d);
  let flash = 0; let ultimo = -1;
  raios.forEach((rt, i) => { if (t >= rt) { const f = Math.exp(-(t - rt) * 7); if (f > flash) { flash = f; ultimo = i; } } });
  ctx.fillStyle = gradV(ctx, 0, H * 0.65, ["#141f2b", "#22394a", "#2f5560"]); ctx.fillRect(0, 0, W, H);
  if (flash > 0.02) { ctx.fillStyle = `rgba(220,235,255,${flash * 0.55})`; ctx.fillRect(0, 0, W, H); }
  // raio
  if (flash > 0.25 && ultimo >= 0) {
    const r = rng(100 + ultimo); let x = 200 + r() * 680, y = 0;
    ctx.save(); ctx.strokeStyle = `rgba(255,250,220,${flash})`; ctx.lineWidth = 9; ctx.shadowColor = "#fff6c8"; ctx.shadowBlur = 40;
    ctx.beginPath(); ctx.moveTo(x, y);
    while (y < 900) { x += (r() - 0.5) * 140; y += 60 + r() * 70; ctx.lineTo(x, y); }
    ctx.stroke(); ctx.restore();
  }
  // nuvens
  const rn = rng(11);
  for (let c = 0; c < 9; c++) {
    const cx = ((rn() * 1500 + t * (25 + c * 4)) % 1600) - 260, cy = 120 + rn() * 520, s = 0.8 + rn() * 0.9;
    ctx.fillStyle = c % 2 ? "#1b2a36" : "#26394a";
    for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.arc(cx + (k - 2) * 75 * s, cy + Math.sin(k * 1.7) * 25 * s, (70 + (k % 2) * 30) * s, 0, 7); ctx.fill(); }
  }
  // mar de fundo
  camadaOnda(ctx, t, 1180, 38, 0.006, 1.6, 0, "#2b6e70");
  // barco sobre a onda do meio
  const bx = 540, by = onda(bx, t, 1250, 55, 0.0065, 2.1, 1.3) - 8;
  const incl = Math.atan2(onda(bx + 20, t, 1250, 55, 0.0065, 2.1, 1.3) - onda(bx - 20, t, 1250, 55, 0.0065, 2.1, 1.3), 40) + Math.sin(t * 1.7) * 0.1;
  ctx.save(); ctx.translate(bx, by); ctx.rotate(incl);
  ctx.fillStyle = "#4e3326"; ctx.fillRect(-8, -330, 16, 330); // mastro
  ctx.fillStyle = COR.creme; ctx.beginPath(); ctx.moveTo(10, -320);
  ctx.quadraticCurveTo(150 + Math.sin(t * 3) * 25, -190, 12, -60); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-10, -300); ctx.quadraticCurveTo(-120 - Math.sin(t * 3) * 20, -200, -12, -80); ctx.closePath(); ctx.fill();
  pessoa(ctx, -70, -60, 0.55, Math.sin(t * 2) * 0.1, 0.2);
  pessoa(ctx, 60, -60, 0.5, -Math.sin(t * 2.3) * 0.1, 0.6);
  ctx.fillStyle = COR.coralEscuro; ctx.beginPath(); ctx.moveTo(-190, -40); ctx.lineTo(190, -40); ctx.lineTo(140, 40); ctx.lineTo(-140, 40); ctx.closePath(); ctx.fill();
  ctx.fillStyle = COR.coral; ctx.fillRect(-190, -48, 380, 16);
  ctx.restore();
  camadaOnda(ctx, t, 1250, 55, 0.0065, 2.1, 1.3, "#1d5458");
  camadaOnda(ctx, t, 1380, 70, 0.005, 2.6, 2.2, "#123c40");
  // espuma nas cristas
  ctx.strokeStyle = "rgba(235,250,250,0.55)"; ctx.lineWidth = 6;
  for (let x = 30; x < W; x += 140) { const y = onda(x, t, 1380, 70, 0.005, 2.6, 2.2); ctx.beginPath(); ctx.arc(x, y + 14, 22, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
  // chuva
  const rc = rng(21); ctx.strokeStyle = "rgba(200,230,240,0.35)"; ctx.lineWidth = 3;
  for (let i = 0; i < 240; i++) {
    const x0 = rc() * (W + 400), y0 = rc() * H, v = 1300 + rc() * 600;
    const y = (y0 + t * v) % H, x = x0 - y * 0.28;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 12, y + 44); ctx.stroke();
  }
  vinheta(ctx, 0.55);
};

// Jonas afundando até o fundo do mar, com raios de luz, bolhas e algas.
CENAS.fundo = function (ctx, t, d) {
  fundoMar(ctx, t, 7);
  fundoDoMarPedras(ctx, t);
  const k = saidaSuave(t / Math.max(d, 0.1));
  const jy = lerp(260, 1150, k), jx = 540 + Math.sin(t * 0.8) * 40;
  bolhas(ctx, t, jx, jy - 80, 14, 5);
  pessoa(ctx, jx, jy, 1.25, Math.sin(t * 0.7) * 0.35 + 0.2, 0.9);
  vinheta(ctx, 0.5);
};

// O grande peixe chega, abre a boca e engole Jonas; depois brilha uma luz (a oração).
CENAS.peixe = function (ctx, t, d) {
  fundoMar(ctx, t, 9);
  fundoDoMarPedras(ctx, t);
  const chegada = saidaSuave(t / (d * 0.45));
  const wx = lerp(W + 520, 640, chegada), wy = 980 + Math.sin(t * 0.9) * 22;
  const tAbre = d * 0.32, tCome = d * 0.48, tFecha = d * 0.56;
  let boca = 0;
  if (t > tAbre && t < tFecha) boca = Math.sin(Math.PI * (t - tAbre) / (tFecha - tAbre));
  const brilho = suave((t - d * 0.62) / (d * 0.15)) * (0.75 + 0.25 * Math.sin(t * 3));
  // Jonas boiando até ser engolido
  if (t < tCome) {
    const puxa = suave((t - tAbre) / (tCome - tAbre));
    const jx = lerp(260, wx - 330 * 0.95, puxa), jy = lerp(900 + Math.sin(t) * 20, wy + 10, puxa);
    pessoa(ctx, jx, jy, lerp(0.9, 0.2, puxa), Math.sin(t * 0.8) * 0.3, 0.8);
  }
  baleia(ctx, wx, wy, 0.95, t, boca, brilho);
  bolhas(ctx, t, wx - 330, wy - 40, 22, 13, tCome - 0.3);
  vinheta(ctx, 0.5);
};

// Amanhecer na praia: sol nascendo, mar brilhando, o peixe soltando um jato d'água e
// Jonas em terra firme erguendo as mãos.
CENAS.praia = function (ctx, t, d) {
  ctx.fillStyle = gradV(ctx, 0, 1080, ["#f4a983", "#fbd3a8", "#fff0d4"]); ctx.fillRect(0, 0, W, H);
  const sy = lerp(1080, 860, saidaSuave(t / d));
  ctx.save(); ctx.translate(540, sy); ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2 + t * 0.12;
    ctx.fillStyle = "rgba(255,240,200,0.12)";
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a - 0.05) * 1100, Math.sin(a - 0.05) * 1100); ctx.lineTo(Math.cos(a + 0.05) * 1100, Math.sin(a + 0.05) * 1100); ctx.fill();
  }
  ctx.restore();
  const gs = ctx.createRadialGradient(540, sy, 0, 540, sy, 420);
  gs.addColorStop(0, "rgba(255,248,220,1)"); gs.addColorStop(0.25, "rgba(255,214,140,0.9)"); gs.addColorStop(1, "rgba(255,200,140,0)");
  ctx.fillStyle = gs; ctx.beginPath(); ctx.arc(540, sy, 420, 0, 7); ctx.fill();
  ctx.fillStyle = "#fff6e0"; ctx.beginPath(); ctx.arc(540, sy, 120, 0, 7); ctx.fill();
  // mar
  ctx.fillStyle = gradV(ctx, 1080, 1560, ["#8fd0c6", "#4aa3a0", "#2f8086"]); ctx.fillRect(0, 1080, W, 520);
  // reflexo do sol
  const rr = rng(31);
  for (let i = 0; i < 60; i++) {
    const y = 1100 + rr() * 420, larg = 20 + rr() * 90 * (1 - (y - 1100) / 600), x = 540 + (rr() - 0.5) * (120 + (y - 1080) * 0.6);
    ctx.fillStyle = `rgba(255,250,225,${0.35 + 0.35 * Math.sin(t * 3 + i)})`; ctx.fillRect(x - larg / 2, y, larg, 4);
  }
  // peixe ao longe com jato d'água
  const wx = 800, wy = 1230 + Math.sin(t * 1.1) * 10;
  baleia(ctx, wx, wy, 0.42, t, 0, 0);
  ctx.fillStyle = "#4aa3a0"; ctx.fillRect(0, 1262, W, 400);
  camadaOnda(ctx, t, 1262, 8, 0.02, 1.5, 0, "#4aa3a0");
  const rj = rng(41);
  for (let i = 0; i < 70; i++) {
    const fase = rj(), vel = 0.8 + rj() * 0.6, ang = -Math.PI / 2 + (rj() - 0.5) * 0.5;
    const tt = (t * vel + fase * 2) % 2, v0 = 520 + rj() * 160;
    const x = wx - 120 + Math.cos(ang) * v0 * tt * 0.5, y = wy - 70 + Math.sin(ang) * v0 * tt + 320 * tt * tt;
    if (y > 1262) continue;
    ctx.fillStyle = `rgba(240,255,255,${0.85 - tt * 0.35})`; ctx.beginPath(); ctx.arc(x, y, 5 + rj() * 6, 0, 7); ctx.fill();
  }
  // areia e espuma
  const foam = Math.sin(t * 1.2) * 20;
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.beginPath(); ctx.moveTo(0, 1500 + foam); ctx.quadraticCurveTo(540, 1420 + foam, W, 1470 + foam); ctx.lineTo(W, 1500 + foam); ctx.quadraticCurveTo(540, 1450 + foam, 0, 1530 + foam); ctx.fill();
  ctx.fillStyle = gradV(ctx, 1480, H, ["#f0cf9c", "#e7bb80"]);
  ctx.beginPath(); ctx.moveTo(0, 1530); ctx.quadraticCurveTo(540, 1460, W, 1500); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
  // pássaros
  ctx.strokeStyle = "#7a4a3a"; ctx.lineWidth = 5;
  for (let i = 0; i < 4; i++) {
    const bx = ((t * 70 + i * 260) % (W + 200)) - 100, by = 420 + i * 70 + Math.sin(t * 2 + i) * 15, asa = Math.sin(t * 8 + i) * 12;
    ctx.beginPath(); ctx.moveTo(bx - 22, by - asa); ctx.quadraticCurveTo(bx - 8, by - 8, bx, by); ctx.quadraticCurveTo(bx + 8, by - 8, bx + 22, by - asa); ctx.stroke();
  }
  // Jonas na areia, erguendo as mãos aos poucos
  pessoa(ctx, 330, 1640, 1.15, 0, suave((t - 0.6) / 2));
  vinheta(ctx, 0.3);
};

// ---------- linha do tempo (cenas em sequência com transição suave) ----------
const TRANSICAO = 0.7;
function desenharLinhaDoTempo(ctx, t, segmentos) {
  let i = segmentos.findIndex((s) => t < s.fim);
  if (i < 0) i = segmentos.length - 1;
  const s = segmentos[i];
  CENAS[s.cena](ctx, t - s.inicio, s.fim - s.inicio);
  const prox = segmentos[i + 1];
  if (prox && t > s.fim - TRANSICAO) {
    ctx.save(); ctx.globalAlpha = suave((t - (s.fim - TRANSICAO)) / TRANSICAO);
    CENAS[prox.cena](ctx, Math.max(0, t - prox.inicio), prox.fim - prox.inicio);
    ctx.restore();
  }
}

if (typeof module !== "undefined") module.exports = { CENAS, desenharLinhaDoTempo, W, H };
