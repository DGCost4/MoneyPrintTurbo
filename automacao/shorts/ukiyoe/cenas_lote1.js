// Gravuras do lote 1 de Shorts (14–17/11/2026): Elias, Salmo 23, José, Pedro.
/* global COR, W, H, blk, bokashi, nevoa, perfil, morro, campos, pastor, ovelha, tenda, pinheiro,
   sol, estrelas, agua, forma, linha, circulo, furoPapel, caminho, SEED, R, rnd */

// ---------- adereços
function fogo(x, y, w, h) {
  forma("vermelho", [[x - w / 2, y], [x - w * 0.42, y - h * 0.45], [x - w * 0.2, y - h * 0.7], [x - w * 0.08, y - h * 0.55], [x, y - h], [x + w * 0.14, y - h * 0.6], [x + w * 0.3, y - h * 0.78], [x + w * 0.4, y - h * 0.4], [x + w / 2, y]], COR.beni, 2.4);
  forma("ocre", [[x - w * 0.32, y], [x - w * 0.2, y - h * 0.4], [x - w * 0.05, y - h * 0.62], [x + w * 0.1, y - h * 0.42], [x + w * 0.22, y - h * 0.5], [x + w * 0.32, y]], COR.ocre, 0);
  forma("pele", [[x - w * 0.16, y], [x - w * 0.05, y - h * 0.3], [x + w * 0.06, y - h * 0.22], [x + w * 0.16, y]], COR.pessego, 0);
}
function lenha(x, y, w) {
  forma("ocre", [[x - w / 2, y], [x + w / 2, y - 14], [x + w / 2, y + 4], [x - w / 2, y + 18]], "#5a4030", 2);
  forma("ocre", [[x - w / 2, y - 12], [x + w / 2, y + 6], [x + w / 2, y + 22], [x - w / 2, y + 4]], "#4a3524", 2);
}
function asas(x, y, h, dir = 1) {
  const u = h / 100;
  for (const s of [-1, 1]) {
    const p = [[x + s * 4 * u, y - 80 * u], [x + s * 30 * u, y - 112 * u], [x + s * 40 * u, y - 96 * u], [x + s * 34 * u, y - 70 * u], [x + s * 22 * u, y - 52 * u], [x + s * 8 * u, y - 62 * u]];
    forma("pele", p, COR.papelClaro, 2.2);
    for (let k = 0; k < 4; k++) linha([[x + s * (10 + k * 6) * u, y - (66 + k * 4) * u], [x + s * (22 + k * 5) * u, y - (92 + k * 4) * u]], 1.2, { liso: false });
  }
}
function pao(x, y) { forma("ocre", [[x - 46, y], [x - 30, y - 26], [x + 30, y - 26], [x + 46, y], [x, y + 10]], COR.ocre, 2.2); linha([[x - 18, y - 18], [x - 8, y - 4]], 1.4); linha([[x + 6, y - 18], [x + 16, y - 4]], 1.4); }
function jarro(x, y) { forma("ocre", [[x - 22, y], [x - 30, y - 40], [x - 14, y - 66], [x - 12, y - 84], [x + 12, y - 84], [x + 14, y - 66], [x + 30, y - 40], [x + 22, y]], COR.couro, 2.2); }
function piramide(x, y, w, h) {
  forma("ocre", [[x - w / 2, y], [x, y - h], [x + w / 2, y]], COR.palha, 2.4, { liso: false });
  forma("ocre", [[x, y - h], [x + w / 2, y], [x + w * 0.08, y]], COR.ocre, 2.4, { liso: false });
}
function palmeira(x, y, h, dir = 1) {
  const topo = [x + dir * h * 0.18, y - h];
  linha([[x, y], [x + dir * h * 0.05, y - h * 0.5], topo], 10, { cor: "#5a4030" });
  for (let k = 0; k < 7; k++) {
    const a = -2.8 + k * 0.45, L = h * 0.42;
    const pt = [topo[0] + Math.cos(a) * L, topo[1] + Math.sin(a) * L * 0.6 + L * 0.25];
    const mid = [(topo[0] + pt[0]) / 2, Math.min(topo[1], pt[1]) - 20];
    forma("verde", [topo, mid, pt, [mid[0] + 8, mid[1] + 24]], COR.pinho, 2);
  }
}
function coluna(x, y, w, h) {
  forma("ocre", [[x - w / 2, y], [x - w / 2, y - h], [x + w / 2, y - h], [x + w / 2, y]], COR.palha, 2.4, { liso: false });
  for (const f of [0.12, 0.88]) forma("azul", [[x - w / 2, y - h * f - 14], [x + w / 2, y - h * f - 14], [x + w / 2, y - h * f + 14], [x - w / 2, y - h * f + 14]], COR.prussiaClara, 1.6, { liso: false });
  forma("ocre", [[x - w * 0.8, y - h], [x + w * 0.8, y - h], [x + w * 0.6, y - h - 40], [x - w * 0.6, y - h - 40]], COR.ocre, 2.4, { liso: false });
}
function poco(x, y, r) {
  forma("ocre", [[x - r, y - 40], [x - r, y + 120], [x + r, y + 120], [x + r, y - 40]], COR.cinza, 2.6, { liso: false });
  for (let yy = 0; yy < 120; yy += 40) linha([[x - r, y + yy], [x + r, y + yy]], 1.4, { liso: false });
  const borda = []; for (let i = 0; i < 24; i++) { const a = i / 24 * 6.283; borda.push([x + Math.cos(a) * r, y - 40 + Math.sin(a) * r * 0.3]); }
  forma("chave", borda, COR.sumi, 2.4);
}
function barco(x, y, w) {
  forma("ocre", [[x - w / 2, y - 30], [x + w / 2, y - 30], [x + w * 0.38, y + 20], [x - w * 0.4, y + 20]], COR.couro, 2.6, { liso: false });
  linha([[x, y - 30], [x, y - w * 0.9]], 3, { liso: false });
  forma("pele", [[x + 6, y - w * 0.85], [x + w * 0.42, y - w * 0.4], [x + 6, y - w * 0.36]], COR.papelClaro, 2.2, { liso: false });
}
function galo(x, y, s) {
  const u = s / 100;
  forma("chave", [[x - 40 * u, y - 60 * u], [x - 90 * u, y - 130 * u], [x - 70 * u, y - 60 * u], [x - 110 * u, y - 90 * u], [x - 60 * u, y - 40 * u]], COR.sumi, 0);
  forma("ocre", [[x - 50 * u, y - 40 * u], [x - 20 * u, y - 80 * u], [x + 20 * u, y - 82 * u], [x + 40 * u, y - 120 * u], [x + 60 * u, y - 116 * u], [x + 56 * u, y - 70 * u], [x + 30 * u, y - 30 * u], [x - 30 * u, y - 20 * u]], COR.ocre, 2.4);
  forma("vermelho", [[x + 40 * u, y - 122 * u], [x + 46 * u, y - 140 * u], [x + 54 * u, y - 128 * u], [x + 62 * u, y - 138 * u], [x + 62 * u, y - 116 * u]], COR.beni, 1.8);
  forma("chave", [[x + 60 * u, y - 108 * u], [x + 78 * u, y - 100 * u], [x + 60 * u, y - 96 * u]], COR.sumi, 0, { liso: false });
  for (const d of [-6, 10]) linha([[x + d * u, y - 24 * u], [x + d * u, y]], 2.4, { liso: false });
}
function penhasco(xBase, lado, yTopo, cor) {
  const pts = []; for (let y = yTopo; y <= H + 20; y += 60) pts.push([xBase + lado * (fbmX(y) * 160), y]);
  const poly = lado < 0 ? [[-40, yTopo - 40], ...pts, [-40, H + 40]] : [[W + 40, yTopo - 40], ...pts, [W + 40, H + 40]];
  forma("verde", poly, cor, 3);
}
const fbmX = (y) => 0.5 + 0.5 * Math.sin(y * 0.011) * Math.cos(y * 0.0043);

const CENAS = {
  // ===================== ELIAS
  elias_01_fogo() {
    bokashi("ceu", 0, 0, W, 1300, COR.sumi, COR.beni, 0.55, 0.6, 30, 101);
    furoPapel((c) => { const g = c.createLinearGradient(540, 0, 540, 1100); g.addColorStop(0, "rgba(0,0,0,0.75)"); g.addColorStop(1, "rgba(0,0,0,0.2)"); c.fillStyle = g; c.beginPath(); c.moveTo(470, 0); c.lineTo(610, 0); c.lineTo(640, 1080); c.lineTo(440, 1080); c.fill(); });
    const monte = [[-20, 1500], [250, 1300], [440, 1150], [640, 1150], [860, 1320], [1100, 1460]];
    morro("verde", monte, H, COR.pinho);
    campos(monte, H, "rgba(35,31,28,0.3)", -0.2, 26);
    forma("ocre", [[420, 1160], [660, 1160], [640, 1080], [440, 1080]], COR.cinza, 2.6, { liso: false });
    fogo(540, 1090, 300, 420);
    pastor(250, 1400, 180, { dir: 1, bracosAbertos: true, barba: true, tunica: "#d8cfb8", manto: COR.couro, faixa: false });
    nevoa(-60, 1620, 700, 70); nevoa(500, 1700, 700, 60);
  },
  elias_02_zimbro() {
    bokashi("ceu", 0, 0, W, 1300, COR.prussiaClara, COR.pessego, 0.6, 0.7, 30, 102);
    sol(820, 820, 110, "ceu");
    const chao = perfil(-20, W + 20, 1250, 80, 0.004, 103);
    morro("ocre", chao, H, COR.palha);
    campos(chao, H, "rgba(35,31,28,0.25)", -0.12, 30);
    // zimbro (arbusto do deserto): galhos finos e almofadas pequenas
    linha([[560, 1330], [540, 1150], [480, 1000]], 8, { cor: "#5a4030" }); linha([[540, 1150], [640, 1010]], 6, { cor: "#5a4030" }); linha([[520, 1080], [400, 1020]], 5, { cor: "#5a4030" });
    SEED = 21;
    for (let i = 0; i < 14; i++) { const x = R(360, 720), y = R(940, 1110), r = R(26, 44); forma("verde", [[x - r, y], [x - r * 0.6, y - r * 0.35], [x + r * 0.6, y - r * 0.35], [x + r, y], [x, y + r * 0.25]], COR.verdeEsc, 1.8); }
    pastor(700, 1340, 200, { dir: 1, ang: -1.5708, barba: true, tunica: "#d8cfb8", manto: COR.couro, faixa: false });
    nevoa(-60, 1480, 760, 60, 0.8);
  },
  elias_03_anjo() {
    bokashi("ceu", 0, 0, W, 1400, COR.fundo, COR.prussiaClara, 0.6, 0.6, 30, 104);
    estrelas(160, 40, 40, W - 40, 900, 11);
    const chao = perfil(-20, W + 20, 1380, 60, 0.004, 105);
    morro("ocre", chao, H, COR.ocre);
    furoPapel((c) => { const g = c.createRadialGradient(600, 1150, 20, 600, 1150, 420); g.addColorStop(0, "rgba(0,0,0,0.6)"); g.addColorStop(1, "rgba(0,0,0,0)"); c.fillStyle = g; c.fillRect(0, 0, W, H); });
    asas(640, 1420, 420);
    pastor(640, 1420, 420, { dir: -1, tunica: COR.papelClaro, manto: COR.azulNevoa, faixa: COR.ocre });
    pastor(380, 1560, 190, { dir: 1, ang: -1.5708, barba: true, tunica: "#d8cfb8", manto: COR.couro, faixa: false });
    pao(560, 1600); jarro(680, 1610);
  },
  elias_04_estrada() {
    bokashi("ceu", 0, 0, W, 1100, COR.azulPalido, COR.pessego, 0.6, 0.7, 30, 106);
    sol(300, 700, 120, "ceu");
    morro("azul", perfil(-20, W + 20, 900, 340, 0.003, 107), 1200, COR.azulNevoa, 1);
    morro("azul", perfil(-20, W + 20, 1050, 220, 0.004, 108), 1300, COR.azulPalido, 1.6);
    nevoa(-60, 920, 800, 80); nevoa(380, 1020, 760, 70);
    const chao = perfil(-20, W + 20, 1240, 60, 0.004, 109);
    morro("ocre", chao, H, COR.palha);
    const estrada = [[460, 1240], [560, 1400], [420, 1600], [640, 1920]];
    forma("pele", [...estrada, ...estrada.map(([x, y]) => [x + 40 + (y - 1240) * 0.25, y]).reverse()], "#e2cfa5", 2);
    pastor(540, 1420, 170, { dir: -1, cajado: true, barba: true, tunica: "#d8cfb8", manto: COR.couro, faixa: false });
  },

  // ===================== SALMO 23
  salmo23_01_pastos() {
    bokashi("ceu", 0, 0, W, 1000, COR.azulPalido, COR.papel, 0.6, 0.7, 30, 201);
    morro("azul", perfil(-20, W + 20, 820, 200, 0.003, 202), 1100, COR.azulNevoa, 1);
    nevoa(-60, 800, 800, 70);
    const campo = [[-20, 1000], [400, 960], [800, 1010], [1100, 980]];
    morro("verde", campo, H, COR.verde);
    campos(campo, H, "rgba(35,31,28,0.22)", -0.1, 28);
    const rio = [[-20, 1420], [300, 1380], [640, 1450], [1100, 1400]];
    forma("azul", [...rio, ...rio.map(([x, y]) => [x, y + 120]).reverse()], COR.prussiaClara, 2.4);
    furoPapel((c) => { c.lineWidth = 3; for (const d of [30, 60, 90]) { c.beginPath(); c.moveTo(0, 1400 + d); c.bezierCurveTo(300, 1380 + d, 640, 1450 + d, 1080, 1410 + d); c.stroke(); } });
    SEED = 23;
    for (let i = 0; i < 10; i++) ovelha(R(120, 980), R(1100, 1330), R(55, 75), rnd() < 0.5 ? 1 : -1);
    pastor(820, 1300, 220, { dir: -1, cajado: true });
    pinheiro(110, 1800, 700, 1);
  },
  salmo23_02_vale() {
    bokashi("ceu", 0, 0, W, 900, COR.sumi, COR.prussia, 0.5, 0.7, 30, 203);
    forma("verde", [[200, 900], [880, 900], [880, H + 20], [200, H + 20]], "#26331f", 0, { liso: false });
    forma("ocre", [[520, 900], [560, 900], [700, H + 20], [380, H + 20]], "#4a3f30", 2, { liso: false });
    penhasco(400, -1, -40, COR.pinho);
    penhasco(680, 1, -40, "#2f4530");
    nevoa(200, 1250, 700, 70, 0.6);
  },
  salmo23_03_cajado() {
    bokashi("ceu", 0, 0, W, 1000, COR.fundo, COR.prussia, 0.4, 0.7, 30, 205);
    forma("verde", [[100, 950], [980, 950], [980, H + 20], [100, H + 20]], COR.verdeEsc, 0, { liso: false });
    penhasco(260, -1, -40, COR.pinho);
    penhasco(820, 1, -40, "#2f4530");
    furoPapel((c) => { const g = c.createLinearGradient(540, 0, 540, 1700); g.addColorStop(0, "rgba(0,0,0,0.6)"); g.addColorStop(1, "rgba(0,0,0,0)"); c.fillStyle = g; c.beginPath(); c.moveTo(470, 0); c.lineTo(610, 0); c.lineTo(760, 1700); c.lineTo(320, 1700); c.fill(); });
    pastor(540, 1500, 300, { dir: 1, cajado: true });
    SEED = 31;
    for (let i = 0; i < 7; i++) ovelha(R(280, 520), R(1560, 1800), R(55, 70), 1);
  },
  salmo23_04_saida() {
    bokashi("ceu", 0, 0, W, 1200, COR.pessego, COR.beniPalido, 0.5, 0.8, 30, 207);
    sol(540, 820, 170, "ceu");
    morro("azul", perfil(-20, W + 20, 1000, 200, 0.004, 208), 1300, COR.azulNevoa, 1);
    nevoa(-60, 980, 800, 80); nevoa(380, 1080, 760, 70);
    penhasco(140, -1, 300, COR.pinho);
    penhasco(940, 1, 300, "#2f4530");
    const campo = [[-20, 1300], [540, 1260], [1100, 1300]];
    morro("verde", campo, H, COR.verde);
    campos(campo, H, "rgba(35,31,28,0.22)", -0.1, 28);
    pastor(540, 1480, 220, { dir: 1, cajado: true, costas: true });
    SEED = 41;
    for (let i = 0; i < 6; i++) ovelha(R(320, 760), R(1560, 1780), R(55, 70), rnd() < 0.5 ? 1 : -1);
  },

  // ===================== JOSÉ
  jose_01_poco() {
    bokashi("ceu", 0, 0, W, 1200, COR.prussiaClara, COR.pessego, 0.6, 0.7, 30, 301);
    sol(840, 600, 100);
    const chao = perfil(-20, W + 20, 1150, 70, 0.004, 302);
    morro("ocre", chao, H, COR.palha);
    campos(chao, H, "rgba(35,31,28,0.22)", -0.1, 30);
    for (let x = 700; x < 1040; x += 70) tenda(x, 1130, 60);
    poco(540, 1360, 190);
    const irmaos = [[260, 1400, 1], [340, 1330, 1], [760, 1330, -1], [840, 1410, -1]];
    irmaos.forEach(([x, y, d], i) => pastor(x, y, 200, { dir: d, barba: true, tunica: [COR.palha, COR.couro, COR.ocre, "#d8cfb8"][i], manto: [COR.indigo, COR.verdeEsc, COR.couro, COR.indigo][i], faixa: false }));
    furoPapel((c) => { c.globalAlpha = 0.4; c.fillRect(380, 1290, 320, 30); });
  },
  jose_02_trono() {
    bokashi("ceu", 0, 0, W, H, COR.ocre, COR.couro, 0.5, 0.9, 30, 303);
    for (const x of [130, 950]) coluna(x, 1500, 120, 1100);
    forma("azul", [[300, 1500], [780, 1500], [780, 1440], [300, 1440]], COR.prussia, 2.4, { liso: false });
    forma("ocre", [[400, 1440], [400, 1000], [680, 1000], [680, 1440]], COR.bronze, 2.6, { liso: false });
    pastor(540, 1420, 360, { dir: -1, tunica: COR.papelClaro, manto: COR.prussiaClara, faixa: COR.ocre });
    bokashi("ocre", 0, 1500, W, H, COR.palha, COR.ocre, 0.4, 0.8, 20, 304);
    for (let k = 0; k < 4; k++) pastor(150 + k * 120, 1760, 190, { dir: 1, ang: 0.55, barba: true, tunica: [COR.palha, COR.couro, COR.ocre, "#d8cfb8"][k], manto: COR.indigo, faixa: false });
  },
  jose_03_lagrimas() {
    bokashi("ceu", 0, 0, W, H, COR.beniPalido, COR.couro, 0.45, 0.9, 30, 305);
    sol(540, 760, 150);
    for (const x of [200, 880]) coluna(x, 1600, 140, 1300);
    morro("azul", perfil(220, 860, 1100, 60, 0.01, 306), 1300, COR.azulPalido, 1.4);
    piramide(420, 1120, 260, 180); piramide(640, 1120, 200, 130);
    forma("ocre", [[0, 1600], [W, 1600], [W, H], [0, H]], COR.couro, 2.6, { liso: false });
    pastor(540, 1640, 420, { dir: 1, costas: true, tunica: COR.papelClaro, manto: COR.prussiaClara, faixa: COR.ocre });
  },
  jose_04_nilo() {
    bokashi("ceu", 0, 0, W, 1150, COR.prussiaClara, COR.pessego, 0.65, 0.7, 30, 307);
    sol(760, 820, 140, "ceu");
    piramide(380, 1150, 560, 420); piramide(760, 1150, 380, 280);
    forma("ocre", [[-20, 1150], [1100, 1150], [1100, 1250], [-20, 1250]], COR.palha, 2, { liso: false });
    agua(1250, 1600, 308);
    forma("verde", [[-20, 1600], [1100, 1600], [1100, H], [-20, H]], COR.verde, 2.4, { liso: false });
    palmeira(160, 1800, 520, 1); palmeira(920, 1760, 460, -1);
    nevoa(-60, 1060, 700, 60, 0.7);
  },

  // ===================== PEDRO
  pedro_01_fogueira() {
    bokashi("ceu", 0, 0, W, 900, COR.fundo, COR.prussia, 0.5, 0.7, 30, 401);
    estrelas(90, 40, 40, W - 40, 600, 13);
    forma("ocre", [[-20, 700], [1100, 700], [1100, 1300], [-20, 1300]], COR.cinzaEsc, 2.6, { liso: false });
    for (let y = 760; y < 1300; y += 60) linha([[0, y], [W, y]], 1.2, { liso: false, cor: "rgba(35,31,28,0.5)" });
    bokashi("ocre", 0, 1300, W, H, COR.couro, "#3b2a1c", 0.3, 0.8, 20, 402);
    lenha(540, 1560, 200); fogo(540, 1550, 230, 300);
    furoPapel((c) => { const g = c.createRadialGradient(540, 1450, 20, 540, 1450, 520); g.addColorStop(0, "rgba(0,0,0,0.35)"); g.addColorStop(1, "rgba(0,0,0,0)"); c.fillStyle = g; c.fillRect(0, 0, W, H); });
    pastor(300, 1640, 260, { dir: 1, barba: true, tunica: COR.couro, manto: COR.indigoEsc, faixa: false, veu: COR.indigoEsc });
    pastor(800, 1620, 240, { dir: -1, barba: true, tunica: COR.palha, manto: COR.verdeEsc, faixa: false });
  },
  pedro_02_galo() {
    bokashi("ceu", 0, 0, W, 1400, COR.prussia, COR.beniPalido, 0.7, 0.6, 30, 403);
    sol(820, 1180, 110, "ceu");
    morro("azul", perfil(-20, W + 20, 1260, 120, 0.004, 404), 1500, COR.prussiaClara, 1.4);
    forma("ocre", [[-20, 1400], [1100, 1400], [1100, H], [-20, H]], COR.cinzaEsc, 2.6, { liso: false });
    for (let y = 1460; y < H; y += 60) linha([[0, y], [W, y]], 1.2, { liso: false, cor: "rgba(35,31,28,0.5)" });
    galo(460, 1400, 330);
  },
  pedro_03_praia() {
    bokashi("ceu", 0, 0, W, 1000, COR.azulPalido, COR.pessego, 0.6, 0.7, 30, 405);
    morro("azul", perfil(-20, W + 20, 900, 160, 0.004, 406), 1050, COR.azulNevoa, 1);
    nevoa(-60, 880, 800, 70);
    agua(1000, 1450, 407);
    barco(760, 1250, 300);
    const praia = [[-20, 1450], [500, 1420], [1100, 1470]];
    morro("ocre", praia, H, COR.palha);
    lenha(420, 1680, 180); fogo(420, 1670, 170, 200);
    forma("pele", [[520, 1690], [590, 1670], [640, 1690], [590, 1704]], "#9aa3a8", 1.8);
    forma("pele", [[540, 1730], [610, 1712], [660, 1730], [610, 1744]], "#9aa3a8", 1.8);
  },
  pedro_04_mar() {
    bokashi("ceu", 0, 0, W, 1100, COR.pessego, COR.beniPalido, 0.5, 0.8, 30, 408);
    sol(540, 960, 160, "ceu");
    morro("azul", perfil(-20, W + 20, 1050, 120, 0.004, 409), 1150, COR.azulNevoa, 1);
    agua(1150, 1500, 410);
    const praia = [[-20, 1500], [540, 1480], [1100, 1500]];
    morro("ocre", praia, H, COR.palha);
    pastor(440, 1720, 320, { dir: 1, costas: true, barba: true, tunica: COR.palha, manto: COR.indigo, faixa: false });
    pastor(640, 1720, 330, { dir: 1, costas: true, tunica: COR.papelClaro, manto: COR.beni, faixa: false });
  },
};
