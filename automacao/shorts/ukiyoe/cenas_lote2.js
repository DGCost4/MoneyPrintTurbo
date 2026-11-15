// Gravuras do lote 2 de Shorts (18–21/11/2026): Jonas, Paulo, Gideão, Ana.
/* global COR, W, H, blk, bokashi, nevoa, perfil, morro, campos, pastor, tenda, sol, estrelas, agua, chuva,
   forma, linha, circulo, furoPapel, SEED, R, rnd, fogo, barco, coluna, asas, jarro, penhasco */

// ---------- adereços novos
function arvore(x, y, h) {
  linha([[x, y], [x - 10, y - h * 0.4], [x + 6, y - h * 0.62]], 22, { cor: "#5a4030" });
  linha([[x - 4, y - h * 0.45], [x - h * 0.25, y - h * 0.7]], 12, { cor: "#5a4030" });
  SEED = Math.round(x + y);
  for (let i = 0; i < 9; i++) {
    const cx = x + R(-h * 0.38, h * 0.38), cy = y - h * R(0.62, 0.98), r = h * R(0.12, 0.2);
    forma("verde", [[cx - r, cy], [cx - r * 0.7, cy - r * 0.45], [cx + r * 0.7, cy - r * 0.45], [cx + r, cy], [cx, cy + r * 0.3]], i % 2 ? COR.verdeEsc : COR.pinho, 2);
  }
}
function peixe(x, y, w) {
  forma("azul", [[x - w / 2, y], [x - w * 0.3, y - w * 0.22], [x + w * 0.2, y - w * 0.2], [x + w * 0.42, y - w * 0.05],
    [x + w * 0.62, y - w * 0.22], [x + w * 0.58, y], [x + w * 0.62, y + w * 0.2], [x + w * 0.42, y + w * 0.06], [x + w * 0.2, y + w * 0.16], [x - w * 0.3, y + w * 0.14]], COR.prussiaClara, 4);
  circulo("chave", x - w * 0.36, y - w * 0.06, w * 0.02, COR.papelClaro, 2);
  linha([[x - w / 2, y + w * 0.02], [x - w * 0.3, y + w * 0.06]], 2.4);
}
function cidade(x0, x1, y) {
  forma("ocre", [[x0, y], [x0, y - 70], [x1, y - 70], [x1, y]], COR.palha, 2.4, { liso: false });
  for (let x = x0 + 20; x < x1 - 20; x += 90) forma("ocre", [[x, y - 60], [x, y - 140], [x + 40, y - 140], [x + 40, y - 60]], COR.ocre, 2.2, { liso: false });
  for (let x = x0; x < x1; x += 22) forma("ocre", [[x, y - 70], [x, y - 84], [x + 12, y - 84], [x + 12, y - 70]], COR.palha, 1.4, { liso: false });
}
function lamparina(x, y, s = 1) {
  forma("ocre", [[x - 40 * s, y], [x - 30 * s, y - 22 * s], [x + 34 * s, y - 22 * s], [x + 56 * s, y - 34 * s], [x + 44 * s, y - 10 * s], [x + 30 * s, y]], COR.couro, 2);
  forma("vermelho", [[x + 46 * s, y - 34 * s], [x + 54 * s, y - 70 * s], [x + 62 * s, y - 34 * s]], COR.ocre, 1.4);
}
function correntes(x, y, n = 8) {
  for (let i = 0; i < n; i++) circulo("chave", x + i * 26, y + (i % 2) * 4, 12, "rgba(0,0,0,0)", 3);
}
function grades(x, y, w, h) {
  forma("pele", [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], COR.papelClaro, 3, { liso: false });
  for (let k = 1; k < 4; k++) linha([[x + (w * k) / 4, y], [x + (w * k) / 4, y + h]], 6, { liso: false });
}
function paredePedra(y0, y1, cor = COR.cinzaEsc) {
  forma("ocre", [[0, y0], [W, y0], [W, y1], [0, y1]], cor, 0, { liso: false });
  for (let y = y0; y < y1; y += 70) for (let x = ((y / 70) % 2) * 60 - 60; x < W; x += 120) {
    linha([[x, y], [x + 120, y]], 1.4, { liso: false, cor: "rgba(35,31,28,0.55)" });
    linha([[x, y], [x, y + 70]], 1.4, { liso: false, cor: "rgba(35,31,28,0.55)" });
  }
}
function lagar(x, y, w) {
  forma("ocre", [[x - w / 2, y - 120], [x + w / 2, y - 120], [x + w / 2, y], [x - w / 2, y]], COR.cinza, 2.6, { liso: false });
  for (let k = 0; k < 3; k++) linha([[x - w / 2, y - 120 + k * 40], [x + w / 2, y - 120 + k * 40]], 1.4, { liso: false });
}
function trigo(x, y, n = 12) {
  SEED = Math.round(x);
  for (let i = 0; i < n; i++) { const xx = x + R(-90, 90), yy = y - R(0, 60); forma("ocre", [[xx - 14, yy], [xx, yy - 10], [xx + 14, yy], [xx, yy + 8]], COR.ocre, 1.2); }
}
const ANA = { tunica: COR.beniPalido, manto: COR.indigo, faixa: false, veu: COR.indigoEsc };
const PAULO = { tunica: "#d8cfb8", manto: COR.couro, faixa: false, barba: true };
const GIDEAO = { tunica: COR.palha, manto: COR.verdeEsc, faixa: false, barba: true };
const JONAS = { tunica: "#d8cfb8", manto: COR.indigo, faixa: false, barba: true };

const CENAS = {
  // ===================== JONAS
  jonas_01_tempestade() {
    bokashi("ceu", 0, 0, W, 1200, COR.sumi, COR.cinzaEsc, 0.5, 0.7, 30, 501);
    furoPapel((c) => { c.lineWidth = 7; c.beginPath(); c.moveTo(760, 120); c.lineTo(700, 380); c.lineTo(780, 400); c.lineTo(690, 700); c.stroke(); });
    agua(1000, H, 502);
    for (let k = 0; k < 4; k++) forma("azul", [[-20 + k * 300, 1080], [120 + k * 300, 900], [240 + k * 300, 1000], [300 + k * 300, 1100]], COR.prussiaEsc, 2.6);
    barco(520, 1050, 360);
    pastor(470, 1010, 120, { ...JONAS, dir: 1 });
    chuva(700, 0.25, 90, 5);
  },
  jonas_02_peixe() {
    bokashi("ceu", 0, 0, W, 500, COR.prussiaClara, COR.prussia, 0.5, 0.6, 20, 503);
    bokashi("azul", 0, 400, W, H, COR.prussia, COR.fundo, 0.4, 0.8, 30, 504);
    furoPapel((c) => { c.globalAlpha = 0.6; c.lineWidth = 3; for (let y = 420; y < 520; y += 28) { c.beginPath(); c.moveTo(0, y); c.bezierCurveTo(300, y - 20, 700, y + 20, W, y); c.stroke(); } });
    peixe(560, 1250, 900);
    pastor(380, 1020, 130, { ...JONAS, dir: 1, ang: 2.4 });
    SEED = 7; furoPapel((c) => { for (let i = 0; i < 40; i++) { c.globalAlpha = 0.5; c.beginPath(); c.arc(R(100, 900), R(600, 1100), R(4, 12), 0, 6.28); c.stroke(); } });
  },
  jonas_03_ninive() {
    bokashi("ceu", 0, 0, W, 1200, COR.pessego, COR.beniPalido, 0.5, 0.7, 30, 505);
    sol(800, 700, 120, "ceu");
    cidade(100, 980, 1150);
    const chao = perfil(-20, W + 20, 1200, 60, 0.004, 506);
    morro("ocre", chao, H, COR.palha);
    campos(chao, H, "rgba(35,31,28,0.22)", -0.1, 30);
    nevoa(-60, 1120, 800, 60, 0.8);
    pastor(540, 1700, 300, { ...JONAS, dir: 1, costas: true, cajado: true });
  },
  jonas_04_colina() {
    bokashi("ceu", 0, 0, W, 1300, COR.prussiaClara, COR.pessego, 0.6, 0.7, 30, 507);
    sol(220, 620, 110);
    forma("ceu", [[-20, 1300], [1100, 1300], [1100, H], [-20, H]], COR.palha, 0, { liso: false });
    cidade(380, 1060, 1300);
    morro("verde", [[-20, 1250], [300, 1180], [600, 1420], [1100, 1600]], H, COR.verdeEsc);
    linha([[180, 1380], [180, 1180]], 6, { cor: "#5a4030" }); linha([[380, 1380], [380, 1180]], 6, { cor: "#5a4030" });
    forma("verde", [[140, 1190], [420, 1190], [440, 1150], [120, 1150]], COR.verde, 2, { liso: false });
    pastor(280, 1400, 180, { ...JONAS, dir: 1 });
  },

  // ===================== PAULO
  paulo_01_cela() {
    paredePedra(0, H, COR.cinzaEsc);
    grades(420, 360, 240, 220);
    furoPapel((c) => { const g = c.createLinearGradient(540, 470, 540, 1700); g.addColorStop(0, "rgba(0,0,0,0.6)"); g.addColorStop(1, "rgba(0,0,0,0)"); c.fillStyle = g; c.beginPath(); c.moveTo(420, 580); c.lineTo(660, 580); c.lineTo(820, 1700); c.lineTo(260, 1700); c.fill(); });
    forma("ocre", [[0, 1700], [W, 1700], [W, H], [0, H]], "#3b2a1c", 2, { liso: false });
    correntes(300, 1760, 9);
  },
  paulo_02_escrevendo() {
    paredePedra(0, 1500, "#4a4640");
    forma("ocre", [[0, 1500], [W, 1500], [W, H], [0, H]], "#3b2a1c", 2, { liso: false });
    furoPapel((c) => { const g = c.createRadialGradient(640, 1250, 10, 640, 1250, 520); g.addColorStop(0, "rgba(0,0,0,0.55)"); g.addColorStop(1, "rgba(0,0,0,0)"); c.fillStyle = g; c.fillRect(0, 0, W, H); });
    forma("ocre", [[420, 1340], [900, 1340], [900, 1380], [420, 1380]], COR.madeira, 2.4, { liso: false });
    linha([[460, 1380], [460, 1600]], 10, { cor: "#4a3524", liso: false }); linha([[860, 1380], [860, 1600]], 10, { cor: "#4a3524", liso: false });
    forma("pele", [[540, 1338], [720, 1338], [710, 1316], [550, 1316]], COR.papelClaro, 1.8, { liso: false });
    lamparina(790, 1336, 1);
    pastor(330, 1600, 380, { ...PAULO, dir: 1 });
  },
  paulo_03_correntes() {
    forma("ocre", [[0, 0], [W, 0], [W, H], [0, H]], "#3b2a1c", 0, { liso: false });
    furoPapel((c) => { const g = c.createRadialGradient(540, 900, 10, 540, 900, 700); g.addColorStop(0, "rgba(0,0,0,0.5)"); g.addColorStop(1, "rgba(0,0,0,0)"); c.fillStyle = g; c.fillRect(0, 0, W, H); });
    forma("pele", [[260, 980], [820, 940], [840, 1060], [280, 1100]], COR.papelClaro, 2.4);
    for (let k = 0; k < 6; k++) linha([[320, 1000 + k * 16], [760, 970 + k * 16]], 1.2, { liso: false, cor: "rgba(35,31,28,0.6)" });
    correntes(180, 1300, 14);
    lamparina(820, 920, 1.3);
  },
  paulo_04_luz() {
    paredePedra(0, H, COR.cinza);
    grades(400, 260, 280, 260);
    furoPapel((c) => { const g = c.createLinearGradient(540, 400, 540, 1900); g.addColorStop(0, "rgba(0,0,0,0.85)"); g.addColorStop(1, "rgba(0,0,0,0.25)"); c.fillStyle = g; c.beginPath(); c.moveTo(400, 520); c.lineTo(680, 520); c.lineTo(980, H); c.lineTo(100, H); c.fill(); });
    pastor(540, 1700, 420, { ...PAULO, dir: 1, costas: true });
  },

  // ===================== GIDEÃO
  gideao_01_lagar() {
    bokashi("ceu", 0, 0, W, 1200, COR.prussia, COR.beniPalido, 0.6, 0.7, 30, 601);
    const chao = perfil(-20, W + 20, 1150, 60, 0.004, 602);
    morro("ocre", chao, H, COR.palha);
    pastor(540, 1560, 300, { ...GIDEAO, dir: -1 });
    lagar(540, 1560, 640);
    trigo(540, 1430, 16);
    forma("ocre", [[-20, 1560], [1100, 1560], [1100, H], [-20, H]], COR.ocre, 2.4, { liso: false });
  },
  gideao_02_anjo() {
    bokashi("ceu", 0, 0, W, 1250, COR.azulPalido, COR.pessego, 0.6, 0.7, 30, 603);
    const chao = perfil(-20, W + 20, 1250, 60, 0.004, 604);
    morro("verde", chao, H, COR.verde);
    arvore(300, 1450, 900);
    asas(330, 1460, 300);
    pastor(330, 1460, 300, { dir: 1, tunica: COR.papelClaro, manto: COR.azulNevoa, faixa: COR.ocre });
    pastor(800, 1600, 230, { ...GIDEAO, dir: -1 });
    lagar(800, 1600, 360);
  },
  gideao_03_medo() {
    bokashi("ceu", 0, 0, W, 1300, COR.fundo, COR.prussia, 0.6, 0.6, 30, 605);
    estrelas(120, 40, 40, W - 40, 800, 17);
    morro("azul", perfil(-20, W + 20, 1260, 80, 0.004, 606), 1500, COR.prussiaClara, 1.4);
    for (let x = 60; x < 1060; x += 46) tenda(x, 1290 + Math.sin(x) * 10, 34, COR.ocre);
    morro("verde", [[-20, 1500], [400, 1460], [700, 1560], [1100, 1520]], H, COR.pinho);
    pastor(540, 1720, 260, { ...GIDEAO, dir: 1, costas: true });
  },
  gideao_04_amanhecer() {
    bokashi("ceu", 0, 0, W, 1250, COR.pessego, COR.beniPalido, 0.5, 0.8, 30, 607);
    sol(540, 900, 180, "ceu");
    morro("azul", perfil(-20, W + 20, 1100, 200, 0.004, 608), 1400, COR.azulNevoa, 1);
    nevoa(-60, 880, 800, 50); nevoa(380, 930, 760, 44);
    morro("verde", [[-20, 1500], [540, 1380], [1100, 1500]], H, COR.verde);
    campos([[-20, 1500], [540, 1380], [1100, 1500]], H, "rgba(35,31,28,0.22)", -0.1, 28);
    pastor(540, 1420, 360, { ...GIDEAO, dir: 1, cajado: true });
  },

  // ===================== ANA
  ana_01_templo() {
    forma("ocre", [[0, 0], [W, 0], [W, H], [0, H]], "#4a2a22", 0, { liso: false });
    for (const x of [140, 940]) coluna(x, 1650, 130, 1300);
    forma("vermelho", [[300, 300], [780, 300], [760, 1500], [320, 1500]], COR.beni, 2.6, { liso: false });
    for (let x = 340; x < 760; x += 60) linha([[x, 320], [x - 6, 1480]], 1.4, { liso: false });
    furoPapel((c) => { const g = c.createRadialGradient(540, 1500, 10, 540, 1500, 500); g.addColorStop(0, "rgba(0,0,0,0.4)"); g.addColorStop(1, "rgba(0,0,0,0)"); c.fillStyle = g; c.fillRect(0, 0, W, H); });
    forma("ocre", [[0, 1650], [W, 1650], [W, H], [0, H]], COR.couro, 2.4, { liso: false });
    pastor(540, 1740, 300, { ...ANA, dir: 1, ang: 0.35 });
    lamparina(820, 1650, 1);
  },
  ana_02_eli() {
    forma("ocre", [[0, 0], [W, 0], [W, H], [0, H]], "#4a2a22", 0, { liso: false });
    coluna(780, 1650, 150, 1350);
    forma("ocre", [[0, 1650], [W, 1650], [W, H], [0, H]], COR.couro, 2.4, { liso: false });
    pastor(860, 1700, 420, { dir: -1, barba: true, tunica: COR.papelClaro, manto: COR.prussiaClara, faixa: COR.ocre });
    pastor(300, 1720, 200, { ...ANA, dir: 1, ang: 0.35 });
  },
  ana_03_lamparina() {
    forma("ocre", [[0, 0], [W, 0], [W, H], [0, H]], "#2e1c18", 0, { liso: false });
    furoPapel((c) => { const g = c.createRadialGradient(560, 900, 10, 560, 900, 600); g.addColorStop(0, "rgba(0,0,0,0.6)"); g.addColorStop(1, "rgba(0,0,0,0)"); c.fillStyle = g; c.fillRect(0, 0, W, H); });
    forma("ocre", [[200, 1100], [880, 1100], [880, 1160], [200, 1160]], COR.madeira, 2.4, { liso: false });
    lamparina(480, 1098, 2.6);
  },
  ana_04_samuel() {
    bokashi("ceu", 0, 0, W, 1300, COR.pessego, COR.beniPalido, 0.5, 0.8, 30, 701);
    sol(540, 900, 170, "ceu");
    morro("azul", perfil(-20, W + 20, 1150, 180, 0.004, 702), 1400, COR.azulNevoa, 1);
    nevoa(-60, 1120, 800, 70);
    morro("verde", [[-20, 1450], [540, 1400], [1100, 1450]], H, COR.verde);
    pastor(540, 1720, 440, { ...ANA, dir: -1 });
    forma("pele", [[470, 1460], [560, 1420], [600, 1450], [520, 1500]], COR.papelClaro, 2.4);
    circulo("pele", 590, 1430, 18, COR.pele, 2);
  },
};
