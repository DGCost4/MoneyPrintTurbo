// Short 30/11 — Pedro nas águas (Mateus 14:28–31). Voz: Gemini Charon. Dor: AFUNDOU, MEDO, ANSIEDADE. Esperança: ESTENDEU A MÃO.
/* global SC, word, asc, measure, sair, estilhacar, partir, tl, sfx, flash, anel, COR, W, DURACAO */
const { t, a, COL } = SC;
DURACAO = SC.fim() + 2.2;
const RED = (...ws) => ws.forEach((w) => { w.color = COR.destaque; });
const GOLD = (...ws) => ws.forEach((w) => { w.color = COR.esperanca; });
function acento(txt, palavra, n, y, w) {
  const wd = SC.grande(txt, a(palavra, n), y, w, "pesado", { cor: COR.esperanca, from: 1500, dur: 0.46 });
  const t0 = t(palavra, n);
  sfx(t0 + 0.05, "braam", 0.9); flash(t0 + 0.04, 0.3, 0.7); SC.punch(t0 + 0.04, 0.08);
  anel(t0 + 0.04, W / 2, y, 1100, "255,205,110");
  return wd;
}
const IMGS = "../shorts/lote4/imagens/";
SC.fundo(IMGS, [
  { id: "pedro_c1", t: 0, z: [1.1, 1.03], f: [0.5, 0.5], amb: [["agua", 0, 1500, 400]] },
  { id: "pedro_c2", t: t("ele", 1) - 0.3, z: [1.03, 1.12], f: [0.5, 0.55], amb: [["agua", 0, 1400, 500]] },
  { id: "pedro_c3", t: t("ele", 2) - 0.3, z: [1.04, 1.12], f: [0.5, 0.5], amb: [["agua", 0, 1400, 500]] },
  { id: "pedro_c1", t: t("medo") - 0.3, z: [1.15, 1.22], f: [0.5, 0.45] },
  { id: "pedro_c4", t: t("jesus", 2) - 0.3, z: [1.03, 1.1], f: [0.5, 0.5], amb: [["sol", 540, 380]] },
], DURACAO);
{
  const l1 = SC.fixo(["PEDRO", "NÃO", "AFUNDOU"], 630, COL * 0.95); RED(l1[2]);
  const l2 = SC.fixo(["POR", "CAUSA", "DO", "MAR."], 800, COL * 0.85);
  sair([...l1, ...l2], t("ele", 1) - 0.3, "cima", { stagger: 0.02 });
  const om = SC.grande("FOI OUTRO MOTIVO.", a("motivo"), 860, COL * 0.9, "medio");
  sair([om], t("ele", 2) - 0.2, "cima", {});
  const an = SC.pops(["ANDOU", "SOBRE", "A ÁGUA."], [t("andou"), t("sobre"), t("agua")], 640, COL * 0.85);
  const ol = SC.grande("TIROU OS OLHOS DE JESUS.", a("olhos"), 800, COL); RED(ol);
  const md = SC.grande("MEDO.", a("medo"), 960, COL * 0.5, "pesado"); RED(md);
  const af = SC.grande("AFUNDAR.", a("afundar"), 1100, COL * 0.65, "pesado"); RED(af);
  sair([...an, ol, md, af], t("gritou") - 0.2, "baixo", { stagger: 0.02 });
  const sv = SC.grande("SENHOR, SALVA-ME!", a("senhor"), 820, COL, "medio");
  sair([sv], t("jesus", 2) - 0.2, "cima", {});
  const em = acento("ESTENDEU A MÃO.", "estendeu", 1, 780, COL * 0.9);
  const ne = SC.pops(["NÃO", "ESPEROU", "ELE", "APRENDER."], [t("nao", 2), t("esperou"), t("ele", 3), t("aprender")], 940, COL * 0.95);
  const sp = SC.grande("SEGUROU PRIMEIRO.", a("segurou"), 1100, COL * 0.85, "pesado", { cor: COR.esperanca });
  sair([em, ...ne, sp], t("ansiedade") - 0.3, "cima", { stagger: 0.015 });
  const ax = SC.grande("ANSIEDADE", a("ansiedade"), 720, COL * 0.8); RED(ax);
  const pb = SC.pops(["PRA", "BAIXO?"], [t("pra"), t("baixo")], 860, COL * 0.55);
  const gr = SC.grande("GRITA.", a("grita"), 1000, COL * 0.55, "pesado");
  sair([ax, ...pb, gr], t("ele", 4) - 0.15, "cima", { stagger: 0.02 });
  SC.pops(["ELE", "AINDA"], [t("ele", 4), t("ainda")], 760, COL * 0.6);
  SC.grande("ESTENDE A MÃO.", a("estende"), 900, COL * 0.85, "pesado", { cor: COR.esperanca });
  SC.fecho("COMENTA “ME SEGURA”", "MATEUS 14:28–31  ·  SALMO E PIMENTA", a("comenta"), t("segura"));
  SC.virada(t("jesus", 2) - 0.2, t("segurou"));
}
