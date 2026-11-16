// Mapa do antigo Israel em vetor plano, com câmera, rota de Elias e marcadores.
const MAPA = (() => {
  const LUG = {
    Sidom: [35.37, 33.56], Sarepta: [35.29, 33.46], Samaria: [35.19, 32.28], "Tisbé": [35.72, 32.4], Querite: [35.6, 32.12],
    Carmelo: [35.07, 32.66], Jezreel: [35.33, 32.56], "Jerusalém": [35.23, 31.78], Berseba: [34.8, 31.25], Horebe: [33.97, 28.54],
  };
  const MED = [[35.47, 34.5], [35.37, 33.56], [35.19, 33.27], [35.07, 32.92], [34.97, 32.83], [34.9, 32.5], [34.75, 32.08], [34.55, 31.68], [34.45, 31.5], [34.2, 31.32], [33.8, 31.13], [33.2, 31.08], [32.3, 31.26], [31.0, 31.5], [30.0, 34.5]];
  const SUEZ = [[32.53, 30.0], [32.62, 29.95], [32.75, 29.6], [33.3, 28.9], [34.0, 28.0], [34.27, 27.73], [33.8, 27.55], [33.2, 28.1], [32.7, 28.95], [32.52, 29.6]];
  const AQABA = [[34.9, 29.55], [35.0, 29.52], [34.8, 28.95], [34.6, 28.3], [34.45, 27.9], [34.27, 27.73], [34.3, 28.1], [34.5, 28.6], [34.65, 29.1]];
  const MAR_VERMELHO = [[34.27, 27.73], [34.0, 28.0], [33.6, 27.3], [34.5, 26.0], [35.6, 26.6], [34.45, 27.9]];
  const MORTO = [[35.48, 31.77], [35.58, 31.75], [35.6, 31.5], [35.55, 31.2], [35.45, 31.1], [35.38, 31.3], [35.42, 31.6]];
  const GALILEIA = [[35.53, 32.88], [35.64, 32.86], [35.65, 32.75], [35.6, 32.7], [35.54, 32.76]];
  const JORDAO = [[35.62, 33.2], [35.6, 33.0], [35.58, 32.88], [35.57, 32.7], [35.56, 32.55], [35.54, 32.35], [35.55, 32.1], [35.52, 31.9], [35.5, 31.77]];
  const LAT0 = 31.5, K0 = Math.cos(LAT0 * Math.PI / 180);
  let cam = { lon: 35.2, lat: 32.4, z: 1 };
  // z = 1 mostra ~2,4° de latitude na altura da tela
  const esc = () => (H / 2.4) * cam.z;
  const P = (lon, lat) => [W / 2 + (lon - cam.lon) * K0 * esc() + TREM.dx, H / 2 - (lat - cam.lat) * esc() + TREM.dy];
  function poli(pts, cor, fecha = true) { x.beginPath(); pts.forEach(([lo, la], i) => { const [X, Y] = P(lo, la); i ? x.lineTo(X, Y) : x.moveTo(X, Y); }); if (fecha) { x.closePath(); x.fillStyle = cor; x.fill(); } }
  const R = rng(3), MORROS = Array.from({ length: 140 }, () => [33 + R() * 3.4, 28 + R() * 6, 0.05 + R() * 0.12, R()]);
  const ROTA = [];      // {de, para, t0, dur}
  const PINOS = [];     // {nome, t0, t1, sub}
  function base(t) {
    x.fillStyle = "#e6d3a6"; x.fillRect(0, 0, W, H);
    // relevo suave
    for (const [lo, la, r, q] of MORROS) { const [X, Y] = P(lo, la); const s = r * esc(); x.fillStyle = q > 0.5 ? "rgba(196,164,108,.35)" : "rgba(214,188,135,.45)"; x.beginPath(); x.ellipse(X, Y, s * 1.6, s * 0.7, 0, 0, 7); x.fill(); }
    // vales férteis do norte
    x.fillStyle = "rgba(150,170,100,.28)"; const [gx, gy] = P(35.3, 32.6); x.beginPath(); x.ellipse(gx, gy, 0.5 * esc(), 0.35 * esc(), -0.4, 0, 7); x.fill();
    const mar = "#3f6f8f";
    for (const m of [MED, SUEZ, AQABA, MAR_VERMELHO]) poli(m, mar);
    // ondulação na costa
    x.strokeStyle = "rgba(255,255,255,.18)"; x.lineWidth = 3; x.setLineDash([18, 14]); poli(MED.slice(0, 12), null, false); x.stroke(); x.setLineDash([]);
    poli(MORTO, mar); poli(GALILEIA, mar);
    x.strokeStyle = mar; x.lineWidth = Math.max(3, 0.012 * esc()); x.lineJoin = "round"; poli(JORDAO, null, false); x.stroke();
    // nomes de regiões
    const reg = (s, lo, la, tam = 30, a = 0.45) => { const [X, Y] = P(lo, la); txt(s, X, Y, { tam, cor: `rgba(90,60,30,${a})`, esp: 10, sombra: 0 }); };
    reg("MAR MEDITERRÂNEO", 33.9, 32.5, 34, 0.5); reg("ISRAEL", 35.35, 32.85, 30); reg("JUDÁ", 35.0, 31.55, 30); reg("FENÍCIA", 35.55, 33.75, 26);
    reg("GILEADE", 36.0, 32.25, 26); reg("DESERTO", 34.6, 30.4, 28); reg("SINAI", 33.8, 29.2, 28);
  }
  function rota(t) {
    for (const r of ROTA) {
      if (t < r.t0) continue;
      const ult2 = ROTA.filter((q) => q.t0 <= t).at(-1), velho = r !== ult2;
      const p = ease.io(cl((t - r.t0) / r.dur)), [a, b] = [LUG[r.de], LUG[r.para]];
      // curva suave entre os pontos
      const mx = (a[0] + b[0]) / 2 + (b[1] - a[1]) * 0.15, my = (a[1] + b[1]) / 2 - (b[0] - a[0]) * 0.15;
      x.save(); x.globalAlpha = velho ? 0.3 : 1; x.strokeStyle = COR.vermelho; x.lineWidth = velho ? 5 : 7; x.setLineDash([16, 12]); x.lineCap = "round"; x.beginPath();
      let ult;
      for (let i = 0; i <= 60 * p; i++) { const u = i / 60, lo = (1 - u) ** 2 * a[0] + 2 * u * (1 - u) * mx + u * u * b[0], la = (1 - u) ** 2 * a[1] + 2 * u * (1 - u) * my + u * u * b[1]; const q = P(lo, la); i ? x.lineTo(...q) : x.moveTo(...q); ult = q; }
      x.stroke(); x.restore();
      if (p < 1 && ult) { x.fillStyle = COR.vermelho; x.beginPath(); x.arc(ult[0], ult[1], 13, 0, 7); x.fill(); x.strokeStyle = "#fff"; x.lineWidth = 4; x.stroke(); }
    }
  }
  function pinos(t) {
    for (const n of PINOS) {
      if (t < n.t0 || t > n.t1) continue;
      const a = env(t, n.t0, n.t1, 0.3, 0.4), p = ease.back(cl((t - n.t0) / 0.45)), [X, Y] = P(...LUG[n.nome]);
      x.save(); x.globalAlpha = a; x.translate(X, Y); x.scale(p, p);
      x.fillStyle = n.cor || COR.tinta; x.beginPath(); x.arc(0, 0, 12, 0, 7); x.fill(); x.strokeStyle = "#fff4dc"; x.lineWidth = 4; x.stroke();
      const lado = n.lado || 1, w = largura(n.nome.toUpperCase(), 34, "V", 4) + 36;
      x.fillStyle = "rgba(42,26,16,.86)"; x.fillRect(lado > 0 ? 24 : -24 - w, -26, w, 50);
      txt(n.nome.toUpperCase(), lado > 0 ? 24 + w / 2 : -24 - w / 2, 9, { tam: 34, esp: 4, sombra: 0 });
      if (n.sub) txt(n.sub, lado > 0 ? 24 + w / 2 : -24 - w / 2, 58, { tam: 26, cor: "#7a3b1a", sombra: 0, esp: 1 });
      x.restore();
    }
  }
  return {
    LUG, ROTA, PINOS,
    pinta(c, t, p) {
      const [a, b] = [c.mapa.de, c.mapa.para || c.mapa.de];
      cam = { lon: lerp(a[0], b[0], p), lat: lerp(a[1], b[1], p), z: lerp(a[2], b[2], p) };
      base(t); rota(t); pinos(t);
      // moldura de papel
      x.strokeStyle = "rgba(90,60,30,.35)"; x.lineWidth = 3; x.strokeRect(40, 40, W - 80, H - 80);
    },
    leg(de, para, t0, dur = 2.2) { ROTA.push({ de, para, t0, dur }); sfx(t0, "tracejado", 0.6); },
    pino(nome, t0, t1, o = {}) { PINOS.push({ nome, t0, t1, ...o }); sfx(t0, "clique", 0.3); },
  };
})();
