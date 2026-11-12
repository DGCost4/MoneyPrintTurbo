// As 7 gravuras do Short "Davi e Golias" (reflexão). Cada função desenha uma folha.
/* global COR, W, H, blk, bokashi, nevoa, perfil, morro, campos, pastor, gigante, ovelha, tenda, pinheiro,
   sol, estrelas, chuva, agua, forma, linha, circulo, furoPapel, caminho, talho, SEED, R, rnd */
const CENAS = {
  // 1. Gancho: Davi pequeno, de costas, diante do gigante cortado pela borda
  "01_gancho"() {
    bokashi("ceu", 0, 0, W, 1500, COR.prussiaEsc, COR.prussiaClara, 0.55, 0.5, 30, 11);
    bokashi("ceu", 0, 1100, W, 1920, COR.azulPalido, COR.prussiaClara, 0.5, 0.6, 20, 12, 0, 1);
    nevoa(-60, 1180, 760, 70); nevoa(380, 1290, 820, 60, 0.9);
    gigante(640, 1600, 1500, { dir: -1 });
    const chao = perfil(-20, W + 20, 1660, 160, 0.004, 21).map(([x, y], i, a) => [x, y + (1 - i / a.length) * -120]);
    morro("verde", chao, H, COR.verdeEsc);
    campos(chao, H, "rgba(35,31,28,0.35)", -0.22, 30);
    SEED = 5;
    for (let i = 0; i < 9; i++) { const x = R(40, 1040), y = R(1690, 1860); forma("ocre", [[x - 30, y], [x - 18, y - 22], [x + 14, y - 26], [x + 34, y]], COR.cinza, 2.2); }
    pastor(300, 1655, 250, { costas: true, dir: 1, cajado: true });
  },

  // 2. Quarenta dias: o vale de Elá visto do alto, dois exércitos e o gigante sozinho
  "02_quarenta_dias"() {
    bokashi("ceu", 0, 0, W, 820, COR.prussia, COR.pessego, 0.55, 0.55, 30, 21);
    sol(820, 420, 70);
    const longe = perfil(-20, W + 20, 760, 220, 0.003, 4);
    morro("azul", longe, 1000, COR.azulPalido, 1.2);
    nevoa(-80, 700, 900, 80); nevoa(300, 790, 900, 70);
    // colina de Israel (esquerda) e dos filisteus (direita)
    const esq = [[-20, 760], [120, 780], [300, 860], [470, 1060], [560, 1250]];
    const dir = [[1100, 820], [930, 850], [760, 960], [620, 1150], [540, 1280]];
    morro("verde", esq, 1500, COR.verde); morro("verde", dir, 1500, COR.verdeEsc);
    campos(esq, 1500, "rgba(35,31,28,0.3)", -0.25, 28); campos(dir, 1500, "rgba(35,31,28,0.3)", 0.25, 28);
    SEED = 8;
    for (let i = 0; i < 14; i++) { const x = R(30, 380), y = 800 + (x - 30) * 0.32 + R(10, 60); tenda(x, y, R(34, 52)); }
    for (let i = 0; i < 14; i++) { const x = R(700, 1050), y = 860 + (1050 - x) * 0.4 + R(10, 60); tenda(x, y, R(34, 52), COR.ocre); }
    for (let i = 0; i < 40; i++) { const x = R(40, 420), y = 830 + (x - 40) * 0.33 + R(40, 130); linha([[x, y], [x + 2, y - R(30, 45)]], 1.3, { liso: false }); }
    for (let i = 0; i < 40; i++) { const x = R(690, 1050), y = 900 + (1050 - x) * 0.4 + R(40, 130); linha([[x, y], [x - 2, y - R(30, 45)]], 1.3, { liso: false }); }
    forma("vermelho", [[300, 790], [300, 740], [340, 752], [300, 765]], COR.beni, 1.6, { liso: false });
    linha([[300, 800], [300, 735]], 1.6, { liso: false });
    // vale e ribeiro
    bokashi("verde", 0, 1300, W, 1920, COR.verde, COR.verdeEsc, 0.5, 0.7, 20, 7);
    const rio = [[-20, 1500], [250, 1460], [480, 1560], [700, 1640], [900, 1600], [1100, 1680]];
    const rio2 = rio.map(([x, y]) => [x, y + 70]).reverse();
    forma("azul", [...rio, ...rio2], COR.prussiaClara, 2.4);
    furoPapel((c) => { c.lineWidth = 3; caminho(c, rio.map(([x, y]) => [x, y + 28]), false); c.stroke(); });
    nevoa(-60, 1290, 700, 90); nevoa(500, 1360, 700, 80, 0.9);
    gigante(540, 1440, 150, { dir: -1 });
  },

  // 3. Mediu Deus: o céu infinito acima de Davi; o gigante minúsculo lá embaixo
  "03_mediu_deus"() {
    bokashi("ceu", 0, 0, W, 1700, COR.fundo, COR.prussiaClara, 0.62, 0.55, 30, 31);
    estrelas(260, 40, 40, W - 40, 1150, 7);
    // raios de luz rompendo as nuvens (papel atravessando o céu)
    furoPapel((c) => {
      for (let i = 0; i < 9; i++) {
        const a = -1.2 + i * 0.3, g = c.createLinearGradient(540, 420, 540 + Math.sin(a) * 1500, 420 + Math.cos(a) * 1500);
        g.addColorStop(0, "rgba(0,0,0,0.55)"); g.addColorStop(1, "rgba(0,0,0,0)");
        c.fillStyle = g; c.beginPath(); c.moveTo(540, 420);
        c.lineTo(540 + Math.sin(a - 0.06) * 1700, 420 + Math.cos(a - 0.06) * 1700); c.lineTo(540 + Math.sin(a + 0.06) * 1700, 420 + Math.cos(a + 0.06) * 1700); c.fill();
      }
    });
    nevoa(120, 330, 840, 90); nevoa(-100, 470, 700, 70, 0.85); nevoa(520, 540, 700, 60, 0.8);
    // campo inimigo minúsculo lá embaixo
    const longe = perfil(-20, W + 20, 1730, 60, 0.006, 3);
    morro("azul", longe, 1900, COR.prussiaClara, 1);
    for (let x = 640; x < 1000; x += 34) tenda(x, 1712 + (x - 640) * 0.02, 16, COR.ocre);
    gigante(820, 1716, 46, { dir: -1 });
    // colina de Davi
    const colina = [[-20, 1500], [180, 1470], [330, 1520], [520, 1640], [700, 1760], [760, 1940]];
    morro("verde", colina, H, COR.pinho);
    campos(colina, H, "rgba(35,31,28,0.35)", -0.3, 26);
    pastor(250, 1480, 200, { dir: 1, olhaCima: true, cajado: true });
  },

  // 4. O seu gigante: figura solitária diante de um portão colossal, sob a chuva e a sombra do gigante
  "04_seu_gigante"() {
    bokashi("ceu", 0, 0, W, 900, COR.sumi, COR.cinza, 0.6, 0.6, 30, 41);
    // muralha de pedra
    bokashi("ocre", 0, 520, W, 1720, COR.cinzaEsc, COR.cinza, 0.5, 0.8, 20, 42);
    for (let y = 560; y < 1720; y += 70) for (let x = ((y / 70) % 2) * 60 - 60; x < W; x += 120) linha([[x, y], [x + 120, y]], 1.4, { liso: false, cor: "rgba(35,31,28,0.5)" }), linha([[x, y], [x, y + 70]], 1.4, { liso: false, cor: "rgba(35,31,28,0.5)" });
    linha([[0, 520], [W, 520]], 3, { liso: false });
    // portão
    const p = [[220, 1720], [220, 1020]];
    for (let i = 1; i < 24; i++) { const a = Math.PI + i / 24 * Math.PI; p.push([540 + Math.cos(a) * 320, 1020 + Math.sin(a) * 320]); }
    p.push([860, 1020], [860, 1720]);
    forma("ocre", p, COR.madeira, 3.4, { liso: false });
    for (let x = 300; x < 860; x += 80) linha([[x, 1720], [x, 1020 - Math.sqrt(Math.max(0, 320 ** 2 - (x - 540) ** 2)) + 6]], 1.8, { liso: false });
    linha([[540, 700], [540, 1720]], 3, { liso: false });
    for (const y of [1000, 1300, 1600]) { forma("chave", [[220, y], [860, y], [860, y + 22], [220, y + 22]], COR.sumi, 0, { liso: false }); for (let x = 250; x < 860; x += 55) circulo("chave", x, y - 24, 7, COR.sumi, 0); }
    // sombra do gigante sobre o portão
    gigante(780, 1800, 1500, { dir: -1, silhueta: true });
    // chão molhado
    bokashi("azul", 0, 1720, W, H, COR.prussiaClara, COR.prussia, 0.4, 0.8, 10, 43);
    furoPapel((c) => { c.lineWidth = 2; for (let y = 1750; y < 1900; y += 22) { c.globalAlpha = 0.5; c.beginPath(); c.moveTo(R(0, 300), y); c.lineTo(R(500, W), y); c.stroke(); } });
    pastor(540, 1760, 170, { costas: true });
    chuva(900, 0.12, 70, 3); chuva(500, 0.2, 90, 4, "rgba(35,31,28,0.35)");
  },

  // 5. Cinco pedras: close no ribeiro, a mão erguendo uma pedra lisa, a armadura largada na margem
  "05_cinco_pedras"() {
    bokashi("ceu", 0, 0, W, 700, COR.azulPalido, COR.pessego, 0.5, 0.8, 30, 51);
    const margem = [[-20, 640], [300, 600], [640, 660], [1100, 610]];
    morro("verde", margem, 1000, COR.verde);
    campos(margem, 1000, "rgba(35,31,28,0.3)", -0.15, 24);
    // armadura e elmo abandonados
    forma("ocre", [[90, 820], [130, 700], [260, 690], [300, 820], [200, 860]], COR.bronze, 2.6);
    for (let y = 720; y < 840; y += 18) linha([[120, y], [280, y]], 1.2, { liso: false });
    forma("ocre", [[330, 830], [340, 760], [400, 730], [460, 760], [470, 830]], COR.bronze, 2.6);
    forma("chave", [[380, 735], [400, 690], [440, 700], [415, 735]], COR.sumi, 0);
    // bolsa com quatro pedras
    forma("ocre", [[760, 900], [740, 760], [900, 740], [930, 900], [850, 940]], COR.couro, 2.6);
    for (const [x, y] of [[790, 770], [840, 760], [885, 772], [820, 790]]) forma("pele", [[x - 26, y], [x - 12, y - 18], [x + 14, y - 18], [x + 26, y], [x, y + 12]], "#c9c4b6", 2);
    // água do ribeiro
    agua(960, H, 52);
    SEED = 19;
    for (let i = 0; i < 12; i++) { const x = R(60, 1020), y = R(1450, 1860), r = R(22, 46); forma("pele", [[x - r, y], [x - r * 0.6, y - r * 0.55], [x + r * 0.6, y - r * 0.55], [x + r, y], [x, y + r * 0.4]], "#a9b3b6", 2); }
    // Davi com a água pelos tornozelos, uma pedra lisa na mão
    pastor(640, 1330, 420, { dir: -1 });
    forma("pele", [[560, 1110], [585, 1092], [612, 1106], [600, 1130], [570, 1130]], "#b9bfbf", 2.4);
    furoPapel((c) => { c.lineWidth = 4; c.globalAlpha = 0.9; for (const r of [40, 70, 100]) { c.beginPath(); c.ellipse(640, 1330, r * 1.6, r * 0.32, 0, 0, 6.28); c.stroke(); } });
  },

  // 6. A batalha é do Senhor: o gigante tomba como uma árvore; Davi ainda com a funda girando
  "06_batalha"() {
    bokashi("ceu", 0, 0, W, 1500, COR.prussiaClara, COR.pessego, 0.55, 0.7, 30, 61);
    sol(800, 420, 130);
    nevoa(-80, 900, 800, 70, 0.8);
    const chao = perfil(-20, W + 20, 1640, 50, 0.004, 63);
    morro("verde", chao, H, COR.palha);
    campos(chao, H, "rgba(35,31,28,0.3)", -0.12, 28);
    gigante(1030, 1630, 660, { dir: -1, ang: -1.2 });
    // lança voando solta
    forma("ocre", [[620, 380], [640, 368], [190, 760], [172, 750]], COR.madeira, 2, { liso: false });
    forma("pele", [[640, 368], [700, 330], [668, 386]], "#9aa3a8", 2, { liso: false });
    // poeira em faixas arredondadas
    SEED = 66;
    for (let i = 0; i < 6; i++) { const x = R(300, 900), y = R(1480, 1620), w = R(160, 320); forma("pele", [[x, y], [x + w * 0.2, y - 40], [x + w * 0.8, y - 46], [x + w, y], [x + w / 2, y + 22]], "#e7d6b4", 1.8); }
    // trajetória da pedra
    const c = blk("chave"); c.save(); c.setLineDash([14, 12]); c.strokeStyle = COR.sumi; c.lineWidth = 2.4;
    c.beginPath(); c.moveTo(220, 1420); c.quadraticCurveTo(300, 1250, 370, 1350); c.stroke(); c.restore();
    pastor(130, 1640, 230, { dir: 1, funda: true, girando: true });
  },

  // 7. Fecho: amanhecer em paz, Davi com o rebanho
  "07_fecho"() {
    bokashi("ceu", 0, 0, W, 1200, COR.azulPalido, COR.pessego, 0.6, 0.7, 30, 71);
    sol(700, 860, 150, "ceu");
    const m1 = perfil(-20, W + 20, 1000, 300, 0.003, 72);
    morro("azul", m1, 1300, COR.azulNevoa, 1);
    const m2 = perfil(-20, W + 20, 1120, 200, 0.004, 73);
    morro("azul", m2, 1400, COR.azulPalido, 1.6);
    nevoa(-60, 980, 800, 80); nevoa(380, 1080, 760, 70, 0.9);
    const colina = [[-20, 1350], [300, 1310], [700, 1380], [1100, 1330]];
    morro("verde", colina, H, COR.verde);
    campos(colina, H, "rgba(35,31,28,0.28)", -0.14, 26);
    SEED = 74;
    for (let i = 0; i < 9; i++) ovelha(R(380, 1000), R(1480, 1800), R(55, 80), rnd() < 0.5 ? 1 : -1);
    pastor(560, 1480, 230, { dir: -1, cajado: true });
    pinheiro(130, 1900, 900, 1);
  },
};
