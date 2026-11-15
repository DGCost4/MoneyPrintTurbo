// Short 21/11 — Ana (1 Samuel 1:6–20). Voz: Carla. Palavra em vermelho: OUVIU.
/* global SC, word, asc, measure, sair, estilhacar, partir, mascara, tl, sfx, flash, anel, COR, W, DURACAO */
const { t, a, COL } = SC;
DURACAO = SC.fim() + 2.2;
function acento(txt, palavra, n, y, w) {
  const wd = SC.grande(txt, a(palavra, n), y, w, "pesado", { cor: COR.destaque, from: 1500, dur: 0.46 });
  const t0 = t(palavra, n);
  sfx(t0 + 0.05, "braam", 0.9); flash(t0 + 0.04, 0.3, 0.7); SC.punch(t0 + 0.04, 0.08);
  anel(t0 + 0.04, W / 2, y, 1100, "255,90,50");
  return wd;
}
SC.fundo("../shorts/lote2/imagens/", [
  { id: "ana_01_templo", t: 0, z: [1.12, 1.04], f: [0.5, 0.8], amb: [["luz", 540, 1500]] },
  { id: "ana_02_eli", t: t("sacerdote") - 0.3, z: [1.04, 1.12], f: [0.55, 0.75] },
  { id: "ana_04_samuel", t: t("deus", 1) - 0.3, z: [1.03, 1.12], f: [0.5, 0.65], amb: [["sol", 540, 900]] },
  { id: "ana_03_lamparina", t: t("tem") - 0.3, z: [1.04, 1.14], f: [0.5, 0.55], amb: [["fogo", 600, 1000]] },
], DURACAO);
{
  const l1 = SC.fixo(["CHOROU"], 620, COL * 0.75);
  const l2 = SC.fixo(["E", "NINGUÉM", "ENTENDEU?"], 730);
  sair([...l1, ...l2], t("ana") - 0.15, "cima", { stagger: 0.02 });
  const ac = SC.pops(["ANA", "CHORAVA"], [t("ana"), t("chorava")], 700, COL * 0.7);
  const ta = SC.grande("TODO ANO.", a("todo"), 900, COL * 0.75, "medio");
  const qf = SC.pops(["QUERIA", "UM", "FILHO"], [t("queria"), t("um"), t("filho")], 1050, COL * 0.75);
  sair([...ac, ta, ...qf], t("templo") - 0.4, "cima", { stagger: 0.02 });
  const sl = SC.pops(["SÓ", "OS", "LÁBIOS"], [t("so"), t("os"), t("labios")], 820, COL * 0.7);
  const sv = SC.grande("SEM VOZ", a("mexiam"), 1000, COL * 0.8); SC.punch(t("mexiam"));
  sair([...sl, sv], t("sacerdote") - 0.25, "cima", { stagger: 0.02 });
  const sa = SC.pops(["O", "SACERDOTE", "ACHOU:"], [t("sacerdote") - 0.1, t("sacerdote"), t("achou")], 780, COL * 0.8);
  const bb = SC.grande("BÊBADA?", a("bebada"), 960, COL * 0.75, "medio");
  estilhacar(bb, t("ninguem") + 0.6);
  const ne = SC.pops(["NINGUÉM", "ENTENDEU."], [t("ninguem"), t("entendeu")], 1120, COL * 0.75);
  sair([...sa, ...ne], t("deus", 1) - 0.2, "cima", { stagger: 0.02 });
  const md = SC.pops(["MAS", "DEUS"], [t("mas"), t("deus", 1)], 820, COL * 0.5);
  const ov = acento("OUVIU.", "ouviu", 1, 1000, COL * 0.7);
  sair([...md, ov], t("tem") - 0.2, "cima", { stagger: 0.02, som: false });
  const td = SC.pops(["TEM", "DOR", "QUE", "NÃO", "CABE"], [t("tem"), t("dor", 2), t("cabe") - 0.2, t("nao", 2), t("cabe")], 1180, COL * 0.85);
  const ep = SC.grande("EM PALAVRA.", a("palavra"), 1340, COL, "medio");
  sair([...td, ep], t("deus", 2) - 0.2, "baixo", { stagger: 0.02 });
  SC.grande("DEUS OUVE", a("ouve", 1), 1180);
  SC.pops(["ATÉ", "O", "QUE", "NÃO", "CONSEGUE", "DIZER."], [t("ate"), t("ate") + 0.12, t("voce") - 0.1, t("nao", 3), t("consegue"), t("dizer")], 1320, COL * 0.9);
  SC.fecho("COMENTA “DEUS OUVE”", "1 SAMUEL 1:6–20  ·  SALMO E PIMENTA", a("comenta"), t("ouve", 2));
}
