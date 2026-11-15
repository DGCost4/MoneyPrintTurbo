// Short 22/11 — Davi (1 Samuel 17:48). Voz: Will. Dor em vermelho: MEDO. Esperança em dourado: CORREU.
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
  { id: "davi_c1", t: 0, z: [1.1, 1.03], f: [0.5, 0.75] },
  { id: "davi_c2", t: t("um") - 0.3, z: [1.03, 1.12], f: [0.5, 0.6] },
  { id: "davi_c3", t: t("quando") - 0.3, z: [1.04, 1.12], f: [0.5, 0.55] },
  { id: "davi_c4", t: t("coragem") - 0.3, z: [1.03, 1.1], f: [0.5, 0.5], amb: [["luz", 820, 560]] },
], DURACAO);
{
  const l1 = SC.fixo(["O", "MEDO"], 620, COL * 0.7);
  const l2 = SC.fixo(["TE", "PARALISA?"], 790, COL * 0.9);
  RED(l1[1]);
  sair([...l1, ...l2], t("um") - 0.15, "cima", { stagger: 0.02 });
  const qd = SC.grande("40 DIAS", a("quarenta"), 900, COL * 0.7); sfx(t("quarenta"), "taiko", 0.8);
  const nm = SC.pops(["NINGUÉM", "SE", "MEXIA."], [t("ninguem", 1), t("se"), t("mexia")], 1060, COL * 0.75);
  sair([qd, ...nm], t("ai") - 0.2, "cima", { stagger: 0.02 });
  const cd = SC.pops(["AÍ", "CHEGOU", "DAVI."], [t("ai"), t("chegou"), t("davi", 1)], 760, COL * 0.75);
  const dt = SC.grande("UM DETALHE", a("detalhe"), 940, COL * 0.75, "medio");
  sair([...cd, dt], t("quando") - 0.2, "cima", { stagger: 0.02 });
  const qg = SC.pops(["QUANDO", "O", "GIGANTE", "AVANÇOU,"], [t("quando"), t("gigante") - 0.1, t("gigante"), t("avancou")], 760, COL * 0.9);
  const co = acento("CORREU.", "correu", 1, 980, COL);
  const nd = SC.pops(["NA", "DIREÇÃO", "DELE."], [t("direcao", 1) - 0.1, t("direcao", 1), t("dele")], 1140, COL * 0.6);
  sair([...qg, co, ...nd], t("coragem") - 0.2, "cima", { stagger: 0.02 });
  const cg = SC.grande("CORAGEM", a("coragem"), 860, COL, "medio");
  const ns = SC.pops(["NÃO", "É", "NÃO", "SENTIR"], [t("nao", 1), t("nao", 1) + 0.1, t("nao", 2), t("sentir")], 1010, COL * 0.75);
  const md = SC.grande("MEDO.", a("medo", 2), 1170, COL * 0.5); RED(md);
  estilhacar(md, t("correr") - 0.1);
  sair([cg, ...ns], t("correr") - 0.15, "cima", { stagger: 0.02, som: false });
  SC.pops(["CORRER", "NA", "DIREÇÃO"], [t("correr"), t("direcao", 2) - 0.1, t("direcao", 2)], 820, COL * 0.85);
  SC.grande("CERTA.", a("certa"), 1000, COL * 0.6, "medio");
  SC.pops(["SABENDO", "QUEM", "VAI", "COM", "VOCÊ."], [t("sabendo"), t("quem"), t("vai"), t("voce") - 0.1, t("voce")], 1150, COL * 0.85);
  SC.fecho("COMENTA “EU CORRO”", "1 SAMUEL 17:48  ·  SALMO E PIMENTA", a("comenta"), t("corro"));
  SC.virada(t("davi", 2) - 0.3, t("correu", 1));
}
