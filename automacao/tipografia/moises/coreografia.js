// Short 23/11 — Moisés (Êxodo 3:11–12; 4:1–13). Voz: Carla. Dor em vermelho: CAPAZ, DESCULPAS. Esperança: JUNTO.
/* global SC, word, asc, measure, sair, estilhacar, partir, tl, sfx, flash, anel, COR, W, DURACAO */
const { t, a, COL } = SC;
DURACAO = SC.fim() + 2.2;
const RED = (...ws) => ws.forEach((w) => { w.color = COR.destaque; });
function acento(txt, palavra, n, y, w) {
  const wd = SC.grande(txt, a(palavra, n), y, w, "pesado", { cor: COR.esperanca, from: 1500, dur: 0.46 });
  const t0 = t(palavra, n);
  sfx(t0 + 0.05, "braam", 0.9); flash(t0 + 0.04, 0.3, 0.7); SC.punch(t0 + 0.04, 0.08);
  anel(t0 + 0.04, W / 2, y, 1100, "255,205,110");
  return wd;
}
const IMGS = "../shorts/lote3/imagens/";
SC.fundo(IMGS, [
  { id: "moises_c1", t: 0, z: [1.1, 1.03], f: [0.45, 0.6] },
  { id: "moises_c2", t: t("quando") - 0.3, z: [1.03, 1.12], f: [0.4, 0.4], amb: [["fogo", 280, 300]] },
  { id: "moises_c3", t: t("quem") - 0.3, z: [1.04, 1.12], f: [0.5, 0.65] },
  { id: "moises_c4", t: t("deus", 3) - 0.3, z: [1.03, 1.1], f: [0.5, 0.6], amb: [["sol", 900, 450]] },
], DURACAO);
{
  const l1 = SC.fixo(["VOCÊ", "ACHA", "QUE"], 600, COL * 0.75);
  const l2 = SC.fixo(["NÃO", "É", "CAPAZ?"], 790);
  RED(l2[2]);
  sair([...l1, ...l2], t("moises") - 0.15, "cima", { stagger: 0.02 });
  const mt = SC.pops(["MOISÉS", "TAMBÉM", "ACHAVA."], [t("moises"), t("tambem"), t("achava")], 760, COL * 0.85);
  const de = SC.grande("DESCULPAS", a("desculpa", 1), 960, COL, "medio"); RED(de);
  sair([...mt, de], t("quem") - 0.2, "cima", { stagger: 0.02 });
  const d1 = SC.pops(["QUEM", "SOU", "EU?"], [t("quem"), t("sou"), t("eu", 1)], 700, COL * 0.55);
  const d2 = SC.pops(["NÃO", "VÃO", "ACREDITAR."], [t("nao", 2), t("vao"), t("acreditar")], 830, COL * 0.75);
  const d3 = SC.pops(["NÃO", "SEI", "FALAR."], [t("nao", 3), t("sei"), t("falar")], 960, COL * 0.6);
  const d4 = SC.pops(["MANDA", "OUTRA", "PESSOA."], [t("manda"), t("outra"), t("pessoa")], 1090, COL * 0.8);
  sair([...d1, ...d2, ...d3, ...d4], t("deus", 2) - 0.15, "cima", { stagger: 0.015 });
  const dr = SC.grande("DEUS RESPONDEU.", a("respondeu"), 900, COL, "medio");
  const el = SC.pops(["NÃO", "COM", "ELOGIOS."], [t("nao", 4), t("com", 1), t("elogios")], 1050, COL * 0.7);
  sair([dr, ...el], t("promessa") - 0.3, "cima", { stagger: 0.02 });
  const pr = SC.pops(["COM", "UMA", "PROMESSA:"], [t("com", 2), t("uma"), t("promessa")], 760, COL * 0.8);
  const es = SC.grande("EU ESTAREI COM VOCÊ.", a("estarei"), 960, COL, "medio");
  sair([...pr, es], t("deus", 3) - 0.2, "cima", { stagger: 0.02 });
  const dn = SC.pops(["DEUS", "NÃO", "ESPERA"], [t("deus", 3), t("nao", 5), t("espera")], 760, COL * 0.75);
  const cp = SC.grande("CAPAZ.", a("capaz", 2), 940, COL * 0.6); RED(cp);
  estilhacar(cp, t("ele", 2) - 0.15);
  SC.pops(["ELE", "VAI"], [t("ele", 2), t("vai")], 1060, COL * 0.4);
  acento("JUNTO.", "junto", 1, 1220, COL * 0.7);
  sair(dn, t("junto"), "cima", { stagger: 0.02, som: false });
  SC.fecho("COMENTA “EU VOU”", "ÊXODO 3:11–12  ·  SALMO E PIMENTA", a("comenta"), t("vou"));
  SC.virada(t("deus", 2) - 0.2, t("junto"));
}
