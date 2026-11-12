// Short "Davi e Golias" (reflexão) — gravuras Ukiyo-e animadas ao fundo + tipografia cinética.
// Sincronizado com davi_golias/palavras.json (narração ElevenLabs, voz Will, velocidade 1.08).
/* global PALAVRAS, word, row, rowAsc, asc, inkW, drop, pop, sair, estilhacar, mascara, tl, sfx, flash,
   glitch, pulso, anel, COR, W, H, LAND, measure, DURACAO, rng */
const T = (i) => PALAVRAS[i][1];
const ANTES = (i) => T(i) - LAND;
const COL = 920, MX = 80;
const gap = (wd) => wd.s * 0.1;
DURACAO = 47;
window.BRILHO = "rgba(0,0,0,0.85)";
window.BRILHO_RAIO = 30;

// ===================================================================== FUNDO
const PASTA = "../shorts/davi_golias/imagens/";
const CENAS = [
  // id, início, zoom inicial→final, foco (x,y em 0..1)
  ["01_gancho", 0, 1.16, 1.06, 0.45, 0.42],
  ["02_quarenta_dias", T(7) - 0.3, 1.05, 1.15, 0.5, 0.62],
  ["03_mediu_deus", T(26) - 0.3, 1.18, 1.04, 0.5, 0.3],
  ["04_seu_gigante", T(38) - 0.3, 1.04, 1.14, 0.5, 0.5],
  ["05_cinco_pedras", T(67) - 0.3, 1.06, 1.16, 0.55, 0.6],
  ["06_batalha", T(77) - 0.3, 1.14, 1.05, 0.45, 0.7],
  ["07_fecho", T(82) - 0.3, 1.04, 1.12, 0.5, 0.55],
];
const IMG = {};
window.PRELOAD = Promise.all(CENAS.map(([id]) => new Promise((ok, erro) => {
  const im = new Image(); im.onload = ok; im.onerror = erro; im.src = PASTA + id + ".png"; IMG[id] = im;
})));
const PASSO = 0.55, FOLGA = 70;                       // deslize do pergaminho e faixa de montagem entre folhas
const eio = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const q = (t, fps) => Math.floor(t * fps) / fps;      // passo de 8 ou 12 fps para a natureza
const camF = { punch: 0 };
const rr = rng(2024);
const GOTAS = Array.from({ length: 160 }, () => [rr() * 1300 - 100, rr() * 1920, 60 + rr() * 60]);
const BRILHOS = Array.from({ length: 50 }, () => [80 + rr() * 920, 80 + rr() * 900, rr() * 6.28, 1.5 + rr() * 2.5]);
const ONDAS = Array.from({ length: 40 }, () => [rr() * 1080, 1000 + rr() * 880, 40 + rr() * 90, rr() * 6.28]);
const POEIRA = Array.from({ length: 50 }, () => [250 + rr() * 750, 1500 + rr() * 150, rr() * 6.28, 20 + rr() * 50]);

function folha(ctx, i, t, dx) {
  const [id, t0, z0, z1, fx, fy] = CENAS[i];
  const t1 = i + 1 < CENAS.length ? CENAS[i + 1][1] + PASSO : DURACAO;
  const p = Math.max(0, Math.min(1, (t - t0) / (t1 - t0)));
  const z = (z0 + (z1 - z0) * p) * (1 + camF.punch);
  ctx.save();
  ctx.translate(dx, 0);
  ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip();
  ctx.translate(W * fx, H * fy); ctx.scale(z, z); ctx.translate(-W * fx, -H * fy);
  ctx.drawImage(IMG[id], 0, 0, W, H);
  ambiente(ctx, id, t, t0);
  ctx.restore();
}
// pequenas ações de cada gravura (a natureza anda a 8/12 fps; a câmera, contínua)
function ambiente(ctx, id, t, t0) {
  const t8 = q(t, 8), t12 = q(t, 12);
  ctx.save();
  // névoa que desliza
  ctx.globalCompositeOperation = "screen";
  for (let k = 0; k < 2; k++) {
    const y = 760 + k * 520, x = ((t8 * (18 + k * 10) + k * 400) % 1600) - 500;
    const g = ctx.createLinearGradient(x, 0, x + 900, 0);
    g.addColorStop(0, "rgba(238,226,198,0)"); g.addColorStop(0.5, "rgba(238,226,198,0.16)"); g.addColorStop(1, "rgba(238,226,198,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x + 450, y, 450, 38, 0, 0, 6.28); ctx.fill();
  }
  if (id === "03_mediu_deus") {
    for (const [x, y, ph, r] of BRILHOS) {
      const a = Math.max(0, Math.sin(t8 * 3 + ph)) * 0.9;
      ctx.fillStyle = `rgba(255,248,225,${a})`; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.28); ctx.fill();
    }
    const g = ctx.createRadialGradient(540, 420, 0, 540, 420, 700);
    g.addColorStop(0, `rgba(255,240,200,${0.18 + 0.08 * Math.sin(t * 1.5)})`); g.addColorStop(1, "rgba(255,240,200,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  if (id === "04_seu_gigante") {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = "rgba(220,225,235,0.35)"; ctx.lineWidth = 2; ctx.beginPath();
    for (const [x, y, l] of GOTAS) { const yy = (y + t12 * 1400) % 2000 - 80; ctx.moveTo(x + yy * 0.12, yy); ctx.lineTo(x + yy * 0.12 + l * 0.12, yy + l); }
    ctx.stroke();
    const raio = Math.max(0, 1 - Math.abs(t - (T(51) + 0.05)) / 0.12);          // relâmpago em "porta"
    if (raio > 0) { ctx.globalCompositeOperation = "screen"; ctx.fillStyle = `rgba(230,235,255,${raio * 0.5})`; ctx.fillRect(0, 0, W, H); }
  }
  if (id === "05_cinco_pedras") {
    ctx.strokeStyle = "rgba(238,226,198,0.5)"; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.beginPath();
    for (const [x, y, l, ph] of ONDAS) { const xx = (x + t12 * 60) % 1200 - 60; ctx.moveTo(xx, y + Math.sin(t12 * 2 + ph) * 4); ctx.lineTo(xx + l, y + Math.sin(t12 * 2 + ph) * 4); }
    ctx.stroke();
  }
  if (id === "06_batalha") {
    const dt = Math.max(0, t - t0);
    for (const [x, y, ph, r] of POEIRA) {
      const yy = y - q(dt, 8) * 60, a = Math.max(0, 0.35 - dt * 0.05);
      ctx.fillStyle = `rgba(231,214,180,${a})`; ctx.beginPath(); ctx.ellipse(x + Math.sin(ph + dt) * 20, yy, r * 1.6, r * 0.5, 0, 0, 6.28); ctx.fill();
    }
  }
  if (id === "07_fecho") {
    const g = ctx.createRadialGradient(700, 860, 0, 700, 860, 520);
    g.addColorStop(0, `rgba(255,170,120,${0.22 + 0.06 * Math.sin(t * 1.2)})`); g.addColorStop(1, "rgba(255,170,120,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  ctx.restore();
}

window.FUNDO = (t, ctx) => {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = "#c9b690"; ctx.fillRect(0, 0, W, H);                // montagem do rolo
  let i = 0; while (i + 1 < CENAS.length && t >= CENAS[i + 1][1]) i++;
  const prox = i + 1 < CENAS.length ? CENAS[i + 1][1] : Infinity;
  if (t >= CENAS[i][1] && t < CENAS[i][1] + PASSO && i > 0) {
    // deslize da direita para a esquerda, como um pergaminho
    const p = eio((t - CENAS[i][1]) / PASSO), d = (W + FOLGA) * p;
    folha(ctx, i - 1, t, -d);
    folha(ctx, i, t, W + FOLGA - d);
  } else {
    folha(ctx, i, t, 0);
  }
  // escurece para as palavras lerem bem
  const k = CENAS[i][0] === "04_seu_gigante" ? 0.55 : 1;
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, `rgba(8,6,10,${0.28 * k})`); g.addColorStop(0.35, `rgba(8,6,10,${0.52 * k})`);
  g.addColorStop(0.7, `rgba(8,6,10,${0.52 * k})`); g.addColorStop(1, `rgba(8,6,10,${0.3 * k})`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
};
CENAS.slice(1).forEach(([, t0]) => sfx(t0 - 0.05, "pergaminho", 0.7));
function punch(t, a = 0.05) {
  tl.set(camF, { punch: a }, t);
  tl.to(camF, { punch: 0, duration: 0.6, ease: "power4.out" }, t);
}

// ===================================================================== PALAVRAS
// A — gancho: o primeiro quadro já mostra a frase
{
  const l1 = row(["DAVI", "NÃO"], { width: COL * 0.78, center: true });
  const l2 = row(["VENCEU", "GOLIAS"], { width: COL, center: true });
  const y1 = 560, y2 = y1 + gap(l2[0]) + rowAsc(l2) + 6;
  l1.forEach((wd) => { wd.y = y1; wd.a = 1; });
  l2.forEach((wd) => { wd.y = y2; wd.a = 1; });
  const r1 = [...l1, ...l2];
  const r2 = row(["PORQUE", "ERA"], { width: COL * 0.5, center: true });
  r2.forEach((wd, k) => pop(wd, ANTES(4 + k), y2 + 130, { ganho: 0.5 }));
  const cor = word("CORAJOSO.", { width: COL, center: true });
  drop(cor, ANTES(6), 1180, { impacto: "pesado" });
  sfx(T(6), "taiko", 0.7);
  estilhacar(cor, T(6) + 0.75);
  sair([...r1, ...r2], T(6) + 0.85, "cima", { stagger: 0.02, som: false });
}
// B — quarenta dias / grande demais
{
  const d40 = word("40 DIAS.", { width: COL * 0.85, center: true });
  drop(d40, ANTES(7), 900, { impacto: "pesado" });
  sfx(T(7), "taiko", 0.8); punch(T(7));
  const ex = row(["UM", "EXÉRCITO", "INTEIRO"], { width: COL * 0.8, center: true });
  ex.forEach((wd, k) => pop(wd, ANTES(9 + k), 900 + 140, { ganho: 0.5 }));
  sair([d40, ...ex], T(16) - 0.2, "cima", { stagger: 0.02 });
  const conta = row(["TODOS", "FIZERAM", "A", "MESMA", "CONTA:"], { width: COL * 0.9, center: true });
  conta.forEach((wd, k) => pop(wd, ANTES(17 + k), 780, { ganho: 0.45 }));
  const gr = word("GRANDE", { width: COL * 0.8, center: true });
  const de = word("DEMAIS.", { width: COL, center: true });
  drop(gr, ANTES(24), 1000, { impacto: "medio" });
  drop(de, ANTES(25), 1000 + gap(de) + asc(de) + 10, { impacto: "pesado", sobre: [gr] });
  sair([...conta, gr, de], T(26) - 0.25, "baixo", { stagger: 0.02 });
}
// C — GIGANTE vira máscara e revela DEUS
{
  const fez = row(["DAVI", "FEZ", "OUTRA", "CONTA."], { width: COL * 0.85, center: true });
  fez.forEach((wd, k) => pop(wd, ANTES(26 + k), 720, { ganho: 0.5 }));
  sair(fez, T(30) - 0.15, "cima", { stagger: 0.02, som: false });
  const nm = row(["ELE", "NÃO", "MEDIU", "O"], { width: COL * 0.7, center: true });
  nm.forEach((wd, k) => pop(wd, ANTES(30 + k), 860, { ganho: 0.5 }));
  const gig = word("GIGANTE.", { width: COL, center: true });
  const yG = 1120;
  drop(gig, ANTES(34), yG, { impacto: "pesado" });
  sfx(T(34), "taiko", 0.7);
  sair(nm, T(35) - 0.1, "cima", { stagger: 0.02, som: false });
  const em = row(["ELE", "MEDIU"], { width: COL * 0.5, center: true });
  em.forEach((wd, k) => pop(wd, ANTES(35 + k), 860, { ganho: 0.5 }));
  const deus = word("DEUS.", { width: COL * 0.86, center: true });
  const meio = yG - measure("GIGANTE", gig.s).asc / 2;
  const yD = meio + asc(deus) / 2;
  tl.set(deus, { a: 1, y: yD + 320 }, T(36));
  tl.to(deus, { y: yD, duration: 0.45, ease: "power4.out" }, T(36) + 0.02);
  mascara(gig, yG, [deus], T(36), T(37) + 0.02);
  punch(T(37) + 0.02, 0.08);
  sair([...em, deus], T(38) - 0.32, "cima", { stagger: 0.02 });
}
// D — o seu gigante tem nome
{
  const nome = row(["O", "SEU", "GIGANTE", "TEM", "NOME."], { width: COL * 0.9, center: true });
  [38, 39, 40, 42, 43].forEach((i, k) => pop(nome[k], ANTES(i), 640, { ganho: 0.45 }));
  const lista = [["DÍVIDA.", 0.55, 45], ["DIAGNÓSTICO.", 0.86, 47], ["ANSIEDADE.", 0.72, 49], ["PORTA FECHADA.", 0.92, 51]];
  let y = 700;
  const ws = lista.map(([txt, w, i]) => {
    const wd = word(txt, { width: COL * w, center: true });
    y += asc(wd) + gap(wd) + 6;
    drop(wd, ANTES(i), y, { impacto: "medio" });
    return wd;
  });
  sair([...nome, ...ws], T(55) - 0.1, "baixo", { stagger: 0.02 });
  const qd = row(["40", "DIAS", "OLHANDO", "SÓ", "O"], { width: COL * 0.8, center: true });
  [58, 59, 62, 63, 64].forEach((i, k) => pop(qd[k], ANTES(i), 860, { ganho: 0.45 }));
  const tam = word("TAMANHO.", { width: COL, center: true });
  drop(tam, ANTES(65), 1110, { impacto: "pesado" });
  punch(T(65), 0.06);
  sair([...qd, tam], T(67) - 0.3, "cima", { stagger: 0.02 });
}
// E — armadura se quebra; cinco pedras; a batalha é do Senhor
{
  const dn = row(["DAVI", "NÃO", "TINHA"], { width: COL * 0.6, center: true });
  dn.forEach((wd, k) => pop(wd, ANTES(67 + k), 760, { ganho: 0.5 }));
  const arm = word("ARMADURA.", { width: COL, center: true });
  drop(arm, ANTES(70), 980, { impacto: "medio" });
  estilhacar(arm, T(71) - 0.05);
  sair(dn, T(71), "cima", { som: false, stagger: 0.02 });
  const cp = word("5 PEDRAS", { width: COL * 0.8, center: true });
  drop(cp, ANTES(72), 1000, { impacto: "pesado" });
  sfx(T(72), "taiko", 0.8);
  const cz = row(["E", "UMA", "CERTEZA:"], { width: COL * 0.6, center: true });
  cz.forEach((wd, k) => pop(wd, ANTES(74 + k), 1000 + 150, { ganho: 0.45 }));
  sair([cp, ...cz], T(77) - 0.2, "cima", { stagger: 0.02 });

  const ab = row(["A", "BATALHA"], { width: COL * 0.8, center: true });
  drop(ab[0], ANTES(77), 880, { impacto: "clique" });
  drop(ab[1], ANTES(78), 880, { impacto: "medio" });
  const ed = row(["É", "DO"], { width: COL * 0.28, center: true });
  ed.forEach((wd, k) => pop(wd, ANTES(79 + k), 880 + 150, { ganho: 0.5 }));
  const sen = word("SENHOR.", { width: COL, center: true, color: COR.destaque });
  drop(sen, ANTES(81), 1300, { impacto: "pesado", from: 1500, dur: 0.46 });
  sfx(T(81) + 0.05, "braam", 0.9);
  flash(T(81) + 0.04, 0.35, 0.7); punch(T(81) + 0.04, 0.1);
  anel(T(81) + 0.04, W / 2, 1300, 1100, "255,90,50");
  sair([...ab, ...ed, sen], T(82) - 0.25, "cima", { stagger: 0.02 });
}
// F — para de medir o gigante / mede quem luta por você / chamada
{
  const pm = row(["PARA", "DE", "MEDIR"], { width: COL * 0.7, center: true });
  pm.forEach((wd, k) => pop(wd, ANTES(82 + k), 720, { ganho: 0.5 }));
  const og = word("O GIGANTE.", { width: COL * 0.85, center: true });
  drop(og, ANTES(86), 860, { impacto: "medio" });
  const mq = row(["MEDE", "QUEM", "LUTA"], { width: COL * 0.75, center: true });
  mq.forEach((wd, k) => pop(wd, ANTES(87 + k), 1040, { ganho: 0.5 }));
  const pv = word("POR VOCÊ.", { width: COL * 0.9, center: true });
  drop(pv, ANTES(90), 1040 + 40 + asc(pv), { impacto: "pesado", sobre: mq });
  sfx(T(90), "taiko", 0.8); punch(T(90), 0.06);
  const cta = word("COMENTA O NOME DO SEU GIGANTE", { width: COL * 0.86, center: true });
  pop(cta, ANTES(92), 1430, { ganho: 0.5 });
  const ref = word("1 SAMUEL 17:47  ·  SALMO E PIMENTA", { width: COL * 0.62, center: true, alpha: 0.7 });
  pop(ref, ANTES(97), 1500, { ganho: 0.4 });
  tl.set({}, {}, DURACAO);
}
