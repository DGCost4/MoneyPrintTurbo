// Módulo comum dos Shorts no estilo do canal (ver automacao/ESTILO_SHORTS.md):
// sincronia por palavra da narração e fundo de gravuras Ukiyo-e animadas.
/* global PALAVRAS, LAND, W, H, tl, sfx, rng, row, word, pop, drop */
const SC = (() => {
  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
  const T = (k) => PALAVRAS[k][1];
  // índice da n-ésima ocorrência de uma palavra na narração
  function i(palavra, n = 1) {
    const p = norm(palavra); let c = 0;
    for (let k = 0; k < PALAVRAS.length; k++) if (norm(PALAVRAS[k][0]) === p && ++c === n) return k;
    throw new Error(`palavra não encontrada na narração: "${palavra}" #${n}`);
  }
  const t = (p, n = 1) => T(i(p, n));               // início da palavra
  const a = (p, n = 1) => T(i(p, n)) - LAND;        // dispara a queda para o impacto cair na sílaba
  const fim = () => PALAVRAS[PALAVRAS.length - 1][2];

  // ------------------------------------------------------------ fundo
  const IMG = {}, cam = { punch: 0 };
  let CENAS = [], DUR = 60;
  const PASSO = 0.55, FOLGA = 70;
  const eio = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const q = (x, fps) => Math.floor(x * fps) / fps;
  const rr = rng(77);
  const PTS = Array.from({ length: 160 }, () => [rr(), rr(), rr() * 6.28, rr()]);

  function ambiente(ctx, c, t, t0) {
    const t8 = q(t, 8), t12 = q(t, 12);
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    for (let k = 0; k < 2; k++) {                   // névoa que corre
      const y = 760 + k * 520, x = ((t8 * (18 + k * 10) + k * 400) % 1600) - 500;
      const g = ctx.createLinearGradient(x, 0, x + 900, 0);
      g.addColorStop(0, "rgba(238,226,198,0)"); g.addColorStop(0.5, "rgba(238,226,198,0.14)"); g.addColorStop(1, "rgba(238,226,198,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x + 450, y, 450, 36, 0, 0, 6.28); ctx.fill();
    }
    for (const am of c.amb || []) {
      const [tipo, x0 = 540, y0 = 600, x1 = 0, y1 = 0] = am;
      if (tipo === "estrelas") for (const [u, v, ph, r] of PTS.slice(0, 60)) {
        const al = Math.max(0, Math.sin(t8 * 3 + ph)) * 0.9;
        ctx.fillStyle = `rgba(255,248,225,${al})`; ctx.beginPath(); ctx.arc(60 + u * 960, 60 + v * (y0 || 900), 1.5 + r * 2.5, 0, 6.28); ctx.fill();
      }
      if (tipo === "sol" || tipo === "luz" || tipo === "fogo") {
        const cor = tipo === "sol" ? "255,170,120" : tipo === "luz" ? "255,244,215" : "255,130,60";
        const pulso = tipo === "fogo" ? 0.1 * Math.sin(t12 * 9) + 0.06 * Math.sin(t12 * 23) : 0.06 * Math.sin(t * 1.3);
        const g = ctx.createRadialGradient(x0, y0, 0, x0, y0, tipo === "fogo" ? 420 : 560);
        g.addColorStop(0, `rgba(${cor},${0.26 + pulso})`); g.addColorStop(1, `rgba(${cor},0)`);
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        if (tipo === "fogo") for (const [u, v, ph, r] of PTS.slice(0, 40)) {      // fagulhas subindo
          const vida = ((t8 * (0.4 + r * 0.6) + v) % 1);
          ctx.fillStyle = `rgba(255,${150 + r * 80},80,${0.8 * (1 - vida)})`;
          ctx.beginPath(); ctx.arc(x0 + (u - 0.5) * 200 + Math.sin(ph + vida * 6) * 20, y0 - vida * 520, 1.5 + r * 2, 0, 6.28); ctx.fill();
        }
      }
      if (tipo === "agua") {                          // reflexos correndo numa faixa de água (y0..y1)
        ctx.strokeStyle = "rgba(238,226,198,0.5)"; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.beginPath();
        for (const [u, v, ph, r] of PTS.slice(0, 40)) {
          const xx = (u * 1200 + t12 * 60) % 1200 - 60, yy = y0 + v * (x1 || 300) + Math.sin(t12 * 2 + ph) * 4;
          ctx.moveTo(xx, yy); ctx.lineTo(xx + 40 + r * 80, yy);
        }
        ctx.stroke();
      }
    }
    ctx.restore();
  }
  function folha(ctx, k, t, dx) {
    const c = CENAS[k];
    const t1 = k + 1 < CENAS.length ? CENAS[k + 1].t + PASSO : DUR;
    const p = Math.max(0, Math.min(1, (t - c.t) / (t1 - c.t)));
    const [z0, z1] = c.z || [1.05, 1.13], [fx, fy] = c.f || [0.5, 0.5];
    const z = (z0 + (z1 - z0) * p) * (1 + cam.punch);
    ctx.save(); ctx.translate(dx, 0);
    ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip();
    ctx.translate(W * fx, H * fy); ctx.scale(z, z); ctx.translate(-W * fx, -H * fy);
    ctx.drawImage(IMG[c.id], 0, 0, W, H);
    ambiente(ctx, c, t, c.t);
    ctx.restore();
  }
  // cenas: [{ id, t, z:[z0,z1], f:[fx,fy], amb:[["sol",x,y], ["agua",0,y0,altura]], escuro }]
  function fundo(pasta, cenas, duracao) {
    CENAS = cenas; DUR = duracao;
    window.PRELOAD = Promise.all([...new Set(cenas.map((c) => c.id))].map((id) => new Promise((ok, erro) => {
      const im = new Image(); im.onload = ok; im.onerror = erro; im.src = pasta + id + ".png"; IMG[id] = im;
    })));
    window.BRILHO = "rgba(0,0,0,0.85)"; window.BRILHO_RAIO = 30;
    window.FUNDO = (t, ctx) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = "#c9b690"; ctx.fillRect(0, 0, W, H);
      let k = 0; while (k + 1 < CENAS.length && t >= CENAS[k + 1].t) k++;
      if (k > 0 && t < CENAS[k].t + PASSO) {
        const d = (W + FOLGA) * eio((t - CENAS[k].t) / PASSO);
        folha(ctx, k - 1, t, -d); folha(ctx, k, t, W + FOLGA - d);
      } else folha(ctx, k, t, 0);
      const e = CENAS[k].escuro ?? 1;
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, `rgba(8,6,10,${0.28 * e})`); g.addColorStop(0.35, `rgba(8,6,10,${0.52 * e})`);
      g.addColorStop(0.7, `rgba(8,6,10,${0.52 * e})`); g.addColorStop(1, `rgba(8,6,10,${0.3 * e})`);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    };
    cenas.slice(1).forEach((c) => sfx(c.t - 0.05, "pergaminho", 0.7));
  }
  function punch(t0, amt = 0.05) {
    tl.set(cam, { punch: amt }, t0);
    tl.to(cam, { punch: 0, duration: 0.6, ease: "power4.out" }, t0);
  }
  // ------------------------------------------------------------ atalhos de texto
  const COL = 920;
  function fixo(textos, y, w = COL) { const r = row(textos, { width: w, center: true }); r.forEach((wd) => { wd.y = y; wd.a = 1; }); return r; }
  function pops(textos, tempos, y, w = COL, ganho = 0.5) {
    const r = row(textos, { width: w, center: true });
    r.forEach((wd, k) => pop(wd, tempos[Math.min(k, tempos.length - 1)], y, { ganho }));
    return r;
  }
  function grande(txt, t0, y, w = COL, impacto = "pesado", o = {}) {
    const wd = word(txt, { width: w, center: true, color: o.cor });
    drop(wd, t0, y, { impacto, ...o });
    return wd;
  }
  function fecho(cta, ref, tCta, tRef) {
    pop(word(cta, { width: COL * 0.86, center: true }), tCta, 1430, { ganho: 0.5 });
    pop(word(ref, { width: COL * 0.62, center: true, alpha: 0.7 }), tRef, 1500, { ganho: 0.4 });
  }
  return { i, t, a, T, fim, fundo, punch, fixo, pops, grande, fecho, COL };
})();
