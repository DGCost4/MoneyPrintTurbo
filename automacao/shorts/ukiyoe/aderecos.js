// Adereços reutilizáveis das gravuras (fogo, barco, colunas, asas, etc.)
/* global COR, W, H, forma, linha, circulo, fbm */
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

