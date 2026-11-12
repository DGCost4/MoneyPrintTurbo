// Salmo 46:1 — "Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia."
// Sincronizado com salmo46/palavras.json (narração ElevenLabs, voz Will, velocidade 1.1).
/* global PALAVRAS, word, row, rowAsc, asc, inkW, drop, pop, sair, estilhacar, partir, juntar,
   mascara, tl, sfx, flash, raios, glitch, pulso, anel, COR, W, LAND, measure */
const T = (i) => PALAVRAS[i][1];          // início da palavra i na narração
const ANTES = (i) => T(i) - LAND;         // dispara a queda para o impacto cair na sílaba
const COL = 920, MX = 80;
const gap = (wd) => wd.s * 0.08;
DURACAO = 32;

// ================= GANCHO (0 – 4.6 s) — "o chão sumiu" ======================
{
  const se = row(["SE", "HOJE", "PARECE", "QUE"], { width: COL * 0.8, center: true });
  se.forEach((wd, i) => pop(wd, Math.max(0.02, ANTES(i)), 620, { ganho: 0.5 }));
  const chao = word("O CHÃO", { width: COL }); chao.x = MX;
  const yChao = 1150;
  drop(chao, ANTES(5), yChao, { impacto: "pesado", from: 1700, dur: 0.5 });
  const sumiu = word("SUMIU", { width: COL * 0.62 }); sumiu.x = MX;
  drop(sumiu, ANTES(6), yChao - asc(chao) - gap(sumiu), { sobre: [chao] });
  estilhacar(chao, T(7) + 0.05);
  sair(se, T(7) + 0.08, "cima", { som: false, stagger: 0.02 });                       // o chão racha em "debaixo"
  sair([sumiu], T(7) + 0.1, "baixo", { som: false, dur: 0.7 });
  sfx(T(7) + 0.12, "whoosh", 0.7);

  const escuta = word("ESCUTA", { width: COL * 0.8, center: true });
  const isso = word("ISSO.", { width: COL * 0.5, center: true });
  drop(escuta, ANTES(11), 880, { impacto: "medio" });
  drop(isso, ANTES(12), 880 + gap(isso) + asc(isso) + 20, { impacto: "medio" });
  sair([escuta, isso], 4.5, "cima");
}

// ================= VERSÍCULO (4.8 – 13 s) ==================================
{
  // DEUS é o chão; o resto cai em cima
  const deus = word("DEUS", { width: COL }); deus.x = MX;
  const yDeus = 1330;
  drop(deus, ANTES(13), yDeus, { impacto: "pesado", from: 1700, dur: 0.5 });
  const linha = row(["É", "O", "NOSSO"], { width: COL });
  const yLinha = yDeus - asc(deus) - gap(linha[2]) - 6;
  drop(linha[0], ANTES(14), yLinha, { impacto: "clique", sobre: [deus] });
  drop(linha[1], ANTES(15), yLinha, { impacto: "clique" });
  drop(linha[2], ANTES(16), yLinha, { impacto: "medio", sobre: [deus] });
  const refugio = word("REFÚGIO", { width: COL }); refugio.x = MX;
  const yRef = yLinha - rowAsc(linha) - gap(refugio) - 4;
  drop(refugio, ANTES(17), yRef, { impacto: "medio", sobre: [...linha, deus] });

  // REFÚGIO vira máscara e revela FORTALEZA
  const forte = word("FORTALEZA,", { width: COL - 30 }); forte.x = MX + 15;
  const meio = yRef - measure("REFUGIO", refugio.s).asc / 2;
  const yForte = meio + measure("FORTALEZA", forte.s).asc / 2;
  sair([deus, ...linha], T(17) + 0.42, "baixo", { stagger: 0.02 });
  tl.set(forte, { a: 1, y: yForte + 300 }, T(17) + 0.5);
  tl.to(forte, { y: yForte, duration: 0.45, ease: "power4.out" }, T(17) + 0.52);
  mascara(refugio, yRef, [forte], T(17) + 0.5, T(19) + 0.05);
  tl.to(forte, { y: 640, duration: 0.45, ease: "power4.out" }, T(19) + 0.6);

  // SOCORRO BEM PRESENTE NA ANGÚSTIA.
  sair([forte], ANTES(20) - 0.02, "cima", { ganho: 0.6 });
  const socorro = word("SOCORRO", { width: COL }); socorro.x = MX;
  const ySoc = 820;
  drop(socorro, ANTES(20), ySoc);
  const bpn = row(["BEM", "PRESENTE", "NA"], { width: COL });
  const yBpn = ySoc + gap(bpn[0]) + rowAsc(bpn) + 16;
  drop(bpn[0], ANTES(21), yBpn, { impacto: "clique" });
  drop(bpn[1], ANTES(22), yBpn, { impacto: "medio" });
  drop(bpn[2], ANTES(23), yBpn, { impacto: "clique" });
  const ang = word("ANGÚSTIA.", { width: COL, color: COR.destaque }); ang.x = MX;
  const yAng = yBpn + gap(ang) + asc(ang) + 24;
  drop(ang, ANTES(24), yAng, { impacto: "pesado", from: 1500, dur: 0.46 });

  // a angústia se parte em duas e vai embora
  partir(ang, T(24) + 0.62);
  sair([socorro, ...bpn], T(25) - 0.05, "baixo", { stagger: 0.025 });

  // referência
  const ref = word("SALMO 46:1", { width: 700, center: true });
  pop(ref, T(25) + 0.05, 1000);
  flash(T(25) + 0.1, 0.18, 0.4);
  sair([ref], T(30) + 0.5, "cima", { ganho: 0.5 });
}

// ================= REFLEXÃO (13.3 – 25 s) ===================================
{
  const sal = row(["O", "SALMISTA", "NÃO", "DIZ"], { width: COL * 0.86, center: true });
  const ySal = 700;
  sal.forEach((wd, i) => pop(wd, ANTES([31, 32, 33, 34][i]), ySal, { ganho: 0.55 }));
  const aAng = row(["A", "ANGÚSTIA"], { width: COL, colors: [COR.texto, COR.destaque] });
  const yA = 960;
  drop(aAng[0], ANTES(36), yA, { impacto: "clique" });
  drop(aAng[1], ANTES(37), yA, { impacto: "pesado", forca: 0.7 });
  const nv = row(["NÃO", "VEM."], { width: COL * 0.85, center: true });
  const yNv = yA + gap(nv[0]) + rowAsc(nv) + 30;
  drop(nv[0], ANTES(38), yNv, { impacto: "medio" });
  drop(nv[1], ANTES(39), yNv, { impacto: "medio" });
  // o "NÃO" se estilhaça: a angústia VEM.
  estilhacar(nv[0], T(39) + 0.42, { cols: 4 });
  tl.to(nv[1], { x: (W - inkW(nv[1])) / 2, duration: 0.4, ease: "power4.out" }, T(39) + 0.55);
  sair([...sal, ...aAng, nv[1]], T(40) + 0.55, "baixo", { stagger: 0.02 });

  // QUANDO ELA CHEGA, — DEUS JÁ ESTÁ LÁ.
  const q = row(["QUANDO", "ELA", "CHEGA,"], { width: COL });
  const yQ = 760;
  drop(q[0], ANTES(43), yQ, { impacto: "clique" });
  drop(q[1], ANTES(44), yQ, { impacto: "clique" });
  drop(q[2], ANTES(45), yQ, { impacto: "medio" });
  sair(q, ANTES(46) - 0.04, "cima", { stagger: 0.02, ganho: 0.5 });
  const deus2 = word("DEUS", { width: COL }); deus2.x = MX;
  const yD2 = 1300;
  drop(deus2, ANTES(46), yD2, { impacto: "pesado", from: 1700, dur: 0.5 });
  const jel = row(["JÁ", "ESTÁ", "LÁ."], { width: COL });
  const yJel = yD2 - asc(deus2) - gap(jel[0]) - 8;
  drop(jel[0], ANTES(47), yJel, { impacto: "clique", sobre: [deus2] });
  drop(jel[1], ANTES(48), yJel, { impacto: "clique", sobre: [deus2] });
  drop(jel[2], ANTES(49), yJel, { impacto: "medio", sobre: [deus2] });
  sair([deus2, ...jel], T(50) - 0.28, "baixo", { stagger: 0.02 });

  // PRESENTE.
  const pres = word("PRESENTE.", { width: COL, center: true });
  drop(pres, ANTES(50), 1040, { impacto: "pesado" });
  raios(T(50), W / 2, 960, 0.9);
  flash(T(50) + 0.02, 0.45, 0.6);
  sair([pres], T(51) - 0.25, "cima");

  // REFÚGIO PRA DESCANSAR. / FORTALEZA PRA NÃO CAIR.
  const r1 = word("REFÚGIO", { width: COL * 0.78 }); r1.x = MX;
  const yR1 = 700;
  drop(r1, ANTES(51), yR1);
  const pd = row(["PRA", "DESCANSAR."], { width: COL });
  const yPd = yR1 + gap(pd[1]) + rowAsc(pd) + 14;
  drop(pd[0], ANTES(52), yPd, { impacto: "clique" });
  drop(pd[1], ANTES(53), yPd, { impacto: "medio" });
  const f1 = word("FORTALEZA", { width: COL * 0.86 }); f1.x = MX;
  const yF1 = yPd + gap(f1) + asc(f1) + 70;
  drop(f1, ANTES(54), yF1);
  const pnc = row(["PRA", "NÃO", "CAIR."], { width: COL });
  const yPnc = yF1 + gap(pnc[2]) + rowAsc(pnc) + 14;
  drop(pnc[0], ANTES(55), yPnc, { impacto: "clique" });
  drop(pnc[1], ANTES(56), yPnc, { impacto: "clique" });
  drop(pnc[2], ANTES(57), yPnc, { impacto: "pesado", forca: 0.6 });
  sair([r1, ...pd, f1, ...pnc], T(57) + 0.5, "baixo", { stagger: 0.018 });
}

// ================= FINAL (25.2 – 32 s): o versículo inteiro, mantido =========
{
  const linhas = [["DEUS", "É", "O", "NOSSO"], ["REFÚGIO", "E"], ["FORTALEZA,"],
                  ["SOCORRO", "BEM"], ["PRESENTE", "NA"], ["ANGÚSTIA."]];
  const rs = linhas.map((l) => row(l, { width: COL, colors: l.map((t) => (t === "ANGÚSTIA." ? COR.destaque : COR.texto)) }));
  let total = 0;
  rs.forEach((r, i) => { total += rowAsc(r) + (i ? r[0].s * 0.14 : 0); });
  let y = 820 - total / 2;
  const ys = rs.map((r, i) => (y += rowAsc(r) + (i ? r[0].s * 0.14 : 0)));
  let t = T(57) + 0.95;                               // logo após "cair."
  const passo = 0.085;
  rs.forEach((r, i) => r.forEach((wd) => {
    if (wd.text === "ANGÚSTIA.") return;
    drop(wd, t, ys[i], { impacto: "clique", from: 220, ganho: 0.45 });
    t += passo;
  }));
  const ang = rs[5][0];
  juntar(ang, t + 0.05, ys[5]);
  const tFecha = t + 0.05 + 0.3;
  sfx(tFecha, "braam", 0.9);
  anel(tFecha, W / 2, ys[5], 1100, "255,90,50"); glitch(tFecha, 0.8); pulso(tFecha, 1.2);
  flash(tFecha, 0.3, 0.7);
  tl.to({}, { duration: 0.01 }, tFecha);

  const yBase = ys[5] + 150;
  const ref = word("SALMO 46:1", { width: 440, center: true });
  pop(ref, tFecha + 0.35, yBase, { ganho: 0.5 });
  const canal = word("SALMO E PIMENTA", { width: 400, center: true, alpha: 0.65 });
  pop(canal, ANTES(65), yBase + 90, { ganho: 0.4 });
  tl.set({}, {}, DURACAO);
}
