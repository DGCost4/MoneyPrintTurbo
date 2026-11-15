// Short 20/11 — Gideão (Juízes 6:11–16). Voz: Will. Palavra em vermelho: VALENTE.
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
  { id: "gideao_01_lagar", t: 0, z: [1.12, 1.04], f: [0.5, 0.72] },
  { id: "gideao_02_anjo", t: t("ali") - 0.3, z: [1.04, 1.12], f: [0.4, 0.7], amb: [["luz", 330, 1150]] },
  { id: "gideao_03_medo", t: t("gideao", 2) - 0.3, z: [1.04, 1.12], f: [0.5, 0.75], amb: [["estrelas", 0, 800]] },
  { id: "gideao_04_amanhecer", t: t("voce", 3) - 0.3, z: [1.03, 1.12], f: [0.5, 0.6], amb: [["sol", 540, 900]] },
], DURACAO);
{
  const l1 = SC.fixo(["FRACO"], 640, COL * 0.75);
  const l2 = SC.fixo(["DEMAIS?"], 800, COL * 0.85);
  sair([...l1, ...l2], t("gideao", 1) - 0.15, "cima", { stagger: 0.02 });
  const gt = SC.pops(["GIDEÃO", "TAMBÉM."], [t("gideao", 1), t("tambem")], 700, COL * 0.75);
  const es = SC.grande("ESCONDIDO", a("escondido"), 920, COL, "medio");
  const cm = SC.pops(["COM", "MEDO"], [t("medo", 1) - 0.1, t("medo", 1)], 1060, COL * 0.5);
  sair([...gt, es, ...cm], t("ali") - 0.25, "cima", { stagger: 0.02 });
  const sc = SC.pops(["O", "SENHOR", "ESTÁ", "CONTIGO,"], [t("senhor") - 0.1, t("senhor"), t("esta", 2), t("contigo")], 820, COL * 0.85);
  const va = acento("VALENTE", "valente", 1, 1010, COL);
  sair([...sc, va], t("gideao", 2) - 0.2, "cima", { stagger: 0.02 });
  const es2 = SC.pops(["EU", "SOU", "O"], [t("eu", 1), t("sou"), t("menor") - 0.1], 760, COL * 0.5);
  const me = SC.grande("MENOR", a("menor"), 960, COL * 0.8, "medio");
  const cp = SC.pops(["DA", "CASA", "DO", "MEU", "PAI."], [t("casa") - 0.1, t("casa"), t("pai") - 0.2, t("pai") - 0.1, t("pai")], 1100, COL * 0.75);
  estilhacar(me, t("discutiu"));
  sair([...es2, ...cp], t("disse", 2) - 0.1, "cima", { stagger: 0.02 });
  const ee = SC.grande("EU ESTAREI COM VOCÊ.", a("estarei"), 980, COL, "medio");
  sair([ee], t("voce", 3) - 0.25, "cima");
  const vs = SC.pops(["VOCÊ", "VÊ", "O", "SEU"], [t("voce", 3), t("ve", 1), t("seu") - 0.1, t("seu")], 760, COL * 0.6);
  const md = SC.grande("MEDO.", a("medo", 2), 920, COL * 0.55, "medio");
  partir(md, t("deus", 2) - 0.1);
  SC.pops(["DEUS", "VÊ"], [t("deus", 2), t("ve", 2)], 1040, COL * 0.5);
  SC.grande("QUEM VOCÊ VAI SER.", a("ser"), 1200);
  sair(vs, t("ser"), "cima", { stagger: 0.02, som: false });
  SC.fecho("COMENTA “VALENTE”", "JUÍZES 6:11–16  ·  SALMO E PIMENTA", a("comenta"), t("valente", 2));
}
