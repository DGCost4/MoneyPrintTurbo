// Telas especiais: legenda da abertura, título, vinheta, cartelas, manuscrito, mito e encerramento.
function legenda(frase, { destaque = [], depois, ate } = {}) {
  const ts = tempos(frase, depois), pal = frase.split(/\s+/).filter((s) => norm(s)), D = destaque.map(norm);
  const t0 = ts[0] - 0.1, t1 = ate ?? TF(frase, depois) + 0.5;
  over(t0, t1, (t) => {
    const a = env(t, t0, t1, 0.2, 0.3), tam = 58;
    const g = x.createLinearGradient(0, H - 330, 0, H); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, `rgba(0,0,0,${0.7 * a})`); x.fillStyle = g; x.fillRect(0, H - 330, W, 330);
    x.save(); x.font = `700 ${tam}px V`; const esp = x.measureText(" ").width; x.restore();
    const linhas = [[]]; let lw = 0;
    pal.forEach((p, i) => { const w = largura(p, tam); if (lw + w > 1500 && linhas.at(-1).length) { linhas.push([]); lw = 0; } linhas.at(-1).push([p, w, i]); lw += w + esp; });
    linhas.forEach((ln, li) => {
      const tot = ln.reduce((s, [, w]) => s + w, 0) + esp * (ln.length - 1); let X = W / 2 - tot / 2; const Y = H - 150 - (linhas.length - 1 - li) * tam * 1.2;
      for (const [p, w, i] of ln) { const q = cl((t - ts[i] + 0.05) / 0.2); const dest = D.includes(norm(p));
        txt(p, X + w / 2, Y, { tam, cor: dest ? COR.vermelho : COR.creme, a: a * (0.25 + 0.75 * q) }); X += w + esp; }
    });
  }, 4);
}
// textos da thumbnail sobre a imagem da thumbnail ("BASTA, SENHOR." / linha / "DO FOGO AO DESERTO")
function tituloThumb(t0, tSub, t1) {
  sfx(t0, "transicao", 0.3); sfx(tSub, "anjo", 0.25);
  over(t0, t1, (t) => {
    const a = env(t, t0, t1, 0.6, 0.4), p = ease.o4(cl((t - t0) / 1.4)), q = ease.o4(cl((t - tSub) / 1.0));
    x.save(); x.globalAlpha = a;
    const g = x.createLinearGradient(0, 0, 0, 440); g.addColorStop(0, "rgba(0,0,0,.66)"); g.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = g; x.fillRect(0, 0, W, 440);
    txt("BASTA, SENHOR.", W / 2, 190 + (1 - p) * 18, { tam: 156, esp: lerp(24, 15, p), cor: COR.creme, a: p, sombra: 0.55 });
    x.fillStyle = COR.vermelho; x.fillRect(W / 2 - 120 * q, 240, 240 * q, 4);
    txt("DO FOGO AO DESERTO", W / 2, 325, { tam: 57, esp: lerp(20, 13, q), cor: COR.ouro, a: q, sombra: 0.5 });
    x.restore();
  }, 5);
}
function titulo(t0, dur) {
  const t1 = t0 + dur; sfx(t0, "braam@pico", 0.6); sfx(t0 + 0.1, "fogo_monte", 0.35, { dur: 3.4 });
  over(t0, t1 + 0.3, (t) => {
    const a = env(t, t0, t1 + 0.3, 0.3, 0.5), p = ease.o4(cl((t - t0) / 1.2));
    x.save(); x.globalAlpha = a; x.fillStyle = "rgba(8,5,4,.6)"; x.fillRect(0, 0, W, H);
    x.translate(W / 2, 520); x.scale(lerp(1.15, 1, p), lerp(1.15, 1, p));
    txt("ELIAS", 0, 0, { tam: 230, esp: lerp(60, 30, p), cor: COR.creme, a: p });
    x.fillStyle = COR.vermelho; x.fillRect(-260 * p, 50, 520 * p, 6);
    txt("DO FOGO AO DESERTO", 0, 130, { tam: 50, esp: 16, cor: COR.ouro, a: cl((t - t0 - 0.5) / 0.6) });
    x.restore();
  }, 5);
}
function vinheta(t0, dur) {
  sfx(t0, "VINHETA", 1);
  const o = { t0, t1: t0 + dur, camada: 9, clipe: "vinheta", n: 175, desenha: (t) => { const im = quadroClipe("vinheta", Math.min(175, 1 + Math.floor((t - t0) * FPS))); if (im.complete) x.drawImage(im, 0, 0, W, H); } };
  L.over.push(o);
}
const ROMANO = ["", "I", "II", "III", "IV"];
// Transição padrão de capítulo: respiro na cena anterior -> escurece -> cartela -> revela a cena nova -> narração.
const TR = { hold: 1.2, entra: 0.9, sai: 1.0, pos: 0.6 };
const revela = (ins, hold = TR.hold) => ins.t + hold + TR.entra + 0.05;   // instante em que a tela está toda escura
function cartela(t0, dur, n, nome, o = {}) {
  const est = window.ESTILO_CAP || "calma";
  return est === "calma" ? cartelaCalma(t0, dur, n, nome, o) : est === "vinheta" ? cartelaVinheta(t0, dur, n, nome, o) : cartelaAtual(t0, dur, n, nome, o);
}
function cartelaAtual(t0, dur, n, nome, { hold = TR.hold, doPreto = false } = {}) {
  const a0 = t0 + hold, a1 = t0 + dur - TR.pos, ent = doPreto ? 0.01 : TR.entra;
  sfx(a0, "transicao", 0.45); sfx(a0 + ent * 0.7, "taiko", 0.28); sfx(a1 - TR.sai, "transicao", 0.25);
  over(a0, a1, (t) => {
    const escuro = Math.min(cl((t - a0) / ent), cl((a1 - t) / TR.sai));
    const tx = Math.min(cl((t - a0 - ent * 0.6) / 0.7), cl((a1 - TR.sai * 0.6 - t) / 0.5));
    const p = ease.o4(cl((t - a0 - ent * 0.6) / 1.4));
    x.save(); x.fillStyle = `rgba(12,8,6,${0.97 * ease.sio(escuro)})`; x.fillRect(0, 0, W, H);
    if (tx > 0) {
      x.globalAlpha = tx;
      txt(n ? `CAPÍTULO ${ROMANO[n]}` : "", W / 2, 470, { tam: 40, esp: lerp(26, 18, p), cor: COR.ouro });
      x.fillStyle = COR.vermelho; x.fillRect(W / 2 - 140 * p, 505, 280 * p, 4);
      txt(nome.toUpperCase(), W / 2, 640 + (1 - p) * 24, { tam: 140, esp: lerp(22, 14, p) });
    }
    x.restore();
  }, 6);
}
// ---- A · tranquila: escurece devagar, luz dourada atravessa o título, poeira, revela num clarão suave
function cartelaCalma(t0, dur, n, nome, { hold = TR.hold, doPreto = false } = {}) {
  const a0 = t0 + hold, a1 = t0 + dur - TR.pos, ent = doPreto ? 0.01 : 1.1, sai = 1.2;
  sfx(a0, "silencio_fino", 0.55); sfx(a0 + ent * 0.8, "anjo", 0.35); sfx(a1 - sai, "transicao", 0.2);
  over(a0, a1, (t) => {
    const esc = ease.sio(Math.min(cl((t - a0) / ent), cl((a1 - t) / sai)));
    x.save();
    x.fillStyle = `rgba(16,11,8,${0.96 * esc})`; x.fillRect(0, 0, W, H);
    const lg = x.createRadialGradient(W / 2, 560, 0, W / 2, 560, 700); lg.addColorStop(0, `rgba(246,185,59,${0.16 * esc})`); lg.addColorStop(1, "rgba(246,185,59,0)");
    x.fillStyle = lg; x.fillRect(0, 0, W, H);
    for (const [u, v, r, q] of PT.slice(0, 80)) { x.fillStyle = `rgba(255,226,170,${(0.15 + 0.35 * r) * esc})`; x.beginPath(); x.arc((u * W + t * 12 * (r + 0.3)) % W, (v * H - t * 18 * (q + 0.2)) % H + (v * H - t * 18 * (q + 0.2) < 0 ? H : 0), 1 + r * 2.2, 0, 7); x.fill(); }
    const tin = a0 + ent * 0.7, tx = Math.min(cl((t - tin) / 0.9), cl((a1 - sai * 0.7 - t) / 0.7));
    if (tx > 0) {
      const p = ease.sio(cl((t - tin) / 1.8));
      x.globalAlpha = tx;
      if (n) txt(`CAPÍTULO ${ROMANO[n]}`, W / 2, 470, { tam: 38, esp: lerp(30, 20, p), cor: COR.ouro, sombra: 0 });
      x.fillStyle = COR.ouro; x.fillRect(W / 2 - 160 * p, 505, 320 * p, 2);
      // título revelado por uma faixa de luz que passa da esquerda para a direita
      const wT = largura(nome.toUpperCase(), 140, "V", 16), xr = W / 2 - wT / 2 - 80 + (wT + 160) * ease.sio(cl((t - tin - 0.2) / 1.6));
      x.save(); x.beginPath(); x.rect(0, 500, xr, 220); x.clip();
      txt(nome.toUpperCase(), W / 2, 650, { tam: 140, esp: 16, sombra: 0.3 }); x.restore();
      const g = x.createLinearGradient(xr - 120, 0, xr + 40, 0); g.addColorStop(0, "rgba(255,230,170,0)"); g.addColorStop(0.8, `rgba(255,230,170,${0.55 * (1 - p)})`); g.addColorStop(1, "rgba(255,230,170,0)");
      x.fillStyle = g; x.fillRect(xr - 120, 520, 160, 170);
    }
    // clarão suave na revelação
    const fl = cl(1 - Math.abs(t - (a1 - sai * 0.55)) / 0.5);
    if (fl > 0) { x.globalAlpha = 1; x.fillStyle = `rgba(255,238,205,${0.22 * fl})`; x.fillRect(0, 0, W, H); }
    x.restore();
  }, 6);
}
// ---- B · estilo vinheta: linha dourada corta, a tela abre como portas, número cai, letras caem girando, corte diagonal revela
const COPIA = document.createElement("canvas"); COPIA.width = W; COPIA.height = H;
function cartelaVinheta(t0, dur, n, nome, { hold = TR.hold, doPreto = false } = {}) {
  const a0 = t0 + hold, a1 = t0 + dur - TR.pos, abre = doPreto ? 0 : 0.75, tw = a1 - 0.55;
  if (!doPreto) { sfx(a0, "whoosh", 0.6); sfx(a0 + 0.25, "corte", 0.4); }
  sfx(a0 + abre + 0.1, "taiko", 0.6); sfx(a0 + abre + 0.1, "impacto_medio", 0.4);
  const letras = nome.toUpperCase().split(""); letras.forEach((_, i) => { if (i % 3 === 0) sfx(a0 + abre + 0.55 + i * 0.05, "clique", 0.25); });
  sfx(tw - 0.05, "whoosh", 0.55); sfx(tw + 0.1, "corte", 0.3);
  over(a0, a1, (t) => {
    x.save();
    const fundoEscuro = () => { const g = x.createRadialGradient(W / 2, H * 0.45, 0, W / 2, H * 0.45, 1150); g.addColorStop(0, "#3a2320"); g.addColorStop(1, "#0e0809"); x.fillStyle = g; x.fillRect(0, 0, W, H); };
    // 1) abre como portas (antes de tw)
    if (t < tw) {
      if (!doPreto && t < a0 + abre + 0.05) {
        const pl = ease.o4(cl((t - a0) / 0.3)), pa = ease.io(cl((t - a0 - 0.25) / (abre - 0.25)));
        COPIA.getContext("2d").drawImage(cv, 0, 0);
        fundoEscuro();
        const d = pa * H / 2;
        x.drawImage(COPIA, 0, 0, W, H / 2, 0, -d, W, H / 2); x.drawImage(COPIA, 0, H / 2, W, H / 2, 0, H / 2 + d, W, H / 2);
        x.fillStyle = COR.ouro; x.fillRect(W / 2 - W * pl / 2, H / 2 - 3 - d, W * pl, 6); if (d > 2) x.fillRect(0, H / 2 - 3 + d, W, 6);
      } else fundoEscuro();
      // cordas douradas vibrando
      const tc = a0 + abre + 0.1;
      for (let i = 0; i < 5; i++) { const y = 760 + i * 22, amp = t > tc ? 22 * Math.exp(-(t - tc - i * 0.05) * 3) : 0;
        x.strokeStyle = "rgba(246,185,59,.22)"; x.lineWidth = 2.5; x.beginPath(); for (let X = 160; X <= W - 160; X += 24) x.lineTo(X, y + Math.sin(((X - 160) / (W - 320)) * Math.PI) * Math.sin(t * 60 + i) * amp); x.stroke(); }
      // número que cai
      const pn = cl((t - tc) / 0.35), z = pn < 1 ? lerp(2.4, 1, ease.i3(pn)) : 1;
      if (n && t >= tc) { x.save(); x.translate(W / 2, 420); x.scale(z, z); txt(ROMANO[n], 0, 0, { tam: 110, cor: COR.ouro, a: cl(pn * 2) }); x.restore();
        if (pn >= 1) txt("CAPÍTULO", W / 2, 470, { tam: 30, esp: 18, cor: "rgba(255,236,205,.8)", sombra: 0, a: cl((t - tc - 0.35) / 0.3) }); }
      // letras do título caindo girando
      const tam = 140; let X = W / 2 - largura(nome.toUpperCase(), tam, "V", 12) / 2;
      letras.forEach((ch, i) => { const w = largura(ch, tam, "V", 12), p = ease.back(cl((t - tc - 0.45 - i * 0.05) / 0.45));
        if (p > 0) { x.save(); x.translate(X + w / 2, 650); x.rotate((1 - p) * (i % 2 ? 0.5 : -0.5)); x.scale(p, p); x.translate(0, (1 - p) * -120); txt(ch, 0, 0, { tam, cor: ch === " " ? COR.creme : COR.creme }); x.restore(); }
        X += w; });
      if (n) { const pl = ease.o4(cl((t - tc - 0.2) / 0.5)); x.fillStyle = COR.vermelho; x.fillRect(W / 2 - 150 * pl, 505, 300 * pl, 4); }
    }
    // 2) corte diagonal dourado revela a cena nova
    const pw = cl((t - tw) / 0.5);
    if (t >= tw) {
      const d = lerp(-700, W + 700, ease.o4(pw));
      x.save(); x.beginPath(); x.moveTo(d + 350, 0); x.lineTo(W + 800, 0); x.lineTo(W + 800, H); x.lineTo(d - 350, H); x.closePath(); x.clip(); fundoEscuro(); x.restore();
      x.strokeStyle = COR.ouro; x.lineWidth = 12; x.beginPath(); x.moveTo(d + 350, 0); x.lineTo(d - 350, H); x.stroke();
    }
    x.restore();
  }, 6);
}
// manuscrito: pergaminho, a pena escreve a frase (destaque em vermelho)
function manuscrito(t0, t1, linhas, { ref = "", tEscrita } = {}) {
  sfx(t0, "mapa", 0.6); sfx(t0 + 0.5, "pena", 0.8, { dur: 4 });
  const total = linhas.reduce((s, l) => s + l[0].length, 0), vel = total / (tEscrita || 3.2);
  over(t0, t1, (t) => {
    const a = env(t, t0, t1, 0.5, 0.5); x.save(); x.globalAlpha = a;
    const im = IMG.pergaminho, z = 1.12 + 0.05 * cl((t - t0) / (t1 - t0));
    pintaImagem(im, im.naturalWidth, im.naturalHeight, z, 0.42, 0.6);
    x.fillStyle = "rgba(0,0,0,.15)"; x.fillRect(0, 0, W, H);
    let n = Math.floor((t - t0 - 0.6) * vel), Y = 440, ponta = [800, 440];
    for (const [s, cor] of linhas) {
      const vis = s.slice(0, Math.max(0, n)); n -= s.length;
      x.font = "700 92px Charm"; x.textAlign = "left"; x.fillStyle = cor || "#3a2414"; const X0 = 800;
      x.fillText(vis, X0, Y); if (vis.length) ponta = [X0 + x.measureText(vis).width, Y];
      Y += 120;
    }
    if (ref) txt(ref, 1400, Y + 10, { tam: 30, cor: "rgba(90,50,20,.8)", esp: 4, sombra: 0, a: cl((t - t0 - 0.6 - total / vel) / 0.6) });
    // pena vetorial: a ponta segue o fim do texto
    const escrevendo = (t - t0 - 0.6) * vel < total, mv = escrevendo ? Math.sin(t * 38) * 5 : 0;
    x.save(); x.translate(ponta[0] + 6 + mv, ponta[1] - 6 - (escrevendo ? Math.abs(Math.sin(t * 19)) * 6 : 26)); x.rotate(-0.85);
    x.fillStyle = "rgba(0,0,0,.18)"; x.beginPath(); x.ellipse(170, 40, 190, 26, 0, 0, 7); x.fill();
    x.fillStyle = "#2a1a10"; x.beginPath(); x.moveTo(0, 0); x.lineTo(46, -7); x.lineTo(46, 7); x.closePath(); x.fill();
    x.fillStyle = "#f3ead8"; x.beginPath(); x.moveTo(40, 0); x.bezierCurveTo(120, -46, 280, -58, 380, -20); x.bezierCurveTo(300, 10, 150, 28, 40, 0); x.fill();
    x.fillStyle = "#d9cbb0"; x.beginPath(); x.moveTo(60, 2); x.bezierCurveTo(160, 22, 300, 8, 380, -20); x.bezierCurveTo(280, 30, 140, 30, 60, 2); x.fill();
    x.strokeStyle = "#a8957a"; x.lineWidth = 3; x.beginPath(); x.moveTo(40, 0); x.quadraticCurveTo(220, -14, 390, -22); x.stroke();
    x.restore();
    x.restore();
  }, 7);
}
// "mito": lista que vai sendo riscada e carimbo MITO
function mito(t0, t1, pergunta, itens, tCarimbo) {
  over(t0, t1, (t) => {
    const a = env(t, t0, t1, 0.4, 0.5);
    x.save(); x.globalAlpha = a; x.fillStyle = "rgba(10,7,5,.78)"; x.fillRect(0, 0, W, H);
    txt(pergunta, W / 2, 260, { tam: 62, esp: 2, cor: COR.ouro });
    itens.forEach(([s, ti], i) => {
      const q = ease.o4(cl((t - ti) / 0.4)), Y = 430 + i * 130;
      if (q <= 0) return;
      txt("✗", 640, Y, { tam: 80, cor: COR.vermelho, a: q });
      txt(s, 720, Y - 4, { tam: 64, alin: "left", a: q });
      const r = cl((t - ti - 0.5) / 0.4); if (r > 0) { x.fillStyle = COR.vermelho; x.fillRect(715, Y - 26, (largura(s, 64) + 10) * r, 7); }
    });
    x.restore();
  }, 6);
  carimbo(tCarimbo, t1, "MITO", { X: 1420, Y: 820, rot: -0.14, tam: 120 });
}
function encerramento(t0, t1, palavra, tPal) {
  over(tPal, t1, (t) => {
    const a = env(t, tPal, t1, 0.4, 0.6), p = ease.back(cl((t - tPal) / 0.6));
    x.save(); x.globalAlpha = a;
    const g = x.createLinearGradient(0, H - 380, 0, H); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,.75)"); x.fillStyle = g; x.fillRect(0, H - 380, W, 380);
    txt("COMENTA", W / 2, H - 200, { tam: 44, esp: 14, cor: COR.creme });
    x.translate(W / 2, H - 100); x.scale(p, p); txt(`“${palavra.toUpperCase()}”`, 0, 0, { tam: 110, esp: 8, cor: COR.ouro });
    x.restore();
  }, 6);
  sfx(tPal, "anjo", 0.5);
}
function fim(t0, t1) {
  sfx(t0, "transicao", 0.5);
  over(t0, t1, (t) => {
    const a = env(t, t0, t1, 0.8, 0.01), p = ease.o4(cl((t - t0 - 0.4) / 0.8));
    x.save(); x.globalAlpha = a; x.fillStyle = "#120a0c"; x.fillRect(0, 0, W, H);
    const tam = 110, ws = largura("SALMO", tam, "V", 6), wp = largura("PIMENTA", tam, "V", 6), we = largura("e", 64), X0 = W / 2 - (ws + wp + we + 60) / 2;
    txt("SALMO", X0 + ws / 2, 540, { tam, esp: 6, a: p }); txt("e", X0 + ws + 30 + we / 2, 532, { tam: 64, cor: COR.ouro, a: p }); txt("PIMENTA", X0 + ws + we + 60 + wp / 2, 540, { tam, esp: 6, cor: COR.vermelho, a: p });
    txt("NO PRÓXIMO VÍDEO, OUTRA HISTÓRIA", W / 2, 640, { tam: 36, esp: 12, cor: "rgba(255,236,205,.85)", a: cl((t - t0 - 1) / 0.6) });
    x.restore(); if (t > t1 - 1.2) { x.fillStyle = `rgba(0,0,0,${cl((t - t1 + 1.2) / 1.2)})`; x.fillRect(0, 0, W, H); }
  }, 8);
}
