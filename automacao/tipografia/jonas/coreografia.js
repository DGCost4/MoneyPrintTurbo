// Short 18/11 — Jonas (Jonas 4:2–4). Voz: Will. Palavra em vermelho: GRAÇA.
/* global SC, word, asc, measure, sair, estilhacar, partir, mascara, tl, sfx, flash, anel, COR, W, DURACAO */
const { t, a, COL } = SC;
DURACAO = SC.fim() + 2.2;
function acento(txt, palavra, n, y, w) {
  const wd = SC.grande(txt, a(palavra, n), y, w, "pesado", { cor: COR.esperanca, from: 1500, dur: 0.46 });
  const t0 = t(palavra, n);
  sfx(t0 + 0.05, "braam", 0.9); flash(t0 + 0.04, 0.3, 0.7); SC.punch(t0 + 0.04, 0.08);
  anel(t0 + 0.04, W / 2, y, 1100, "255,205,110");
  return wd;
}
SC.fundo("../shorts/lote2/imagens/", [
  { id: "jonas_01_tempestade", t: 0, z: [1.12, 1.04], f: [0.5, 0.5], amb: [["agua", 0, 1050, 800]] },
  { id: "jonas_02_peixe", t: t("sabia") - 0.3, z: [1.04, 1.13], f: [0.5, 0.6] },
  { id: "jonas_03_ninive", t: t("queria") - 0.3, z: [1.04, 1.12], f: [0.5, 0.6], amb: [["sol", 800, 700]] },
  { id: "jonas_04_colina", t: t("perguntou") - 0.3, z: [1.03, 1.12], f: [0.4, 0.65], amb: [["sol", 220, 620]] },
], DURACAO);
{
  const l1 = SC.fixo(["ABENÇOAR"], 620, COL * 0.9);
  const l2 = SC.fixo(["QUEM", "TE", "MACHUCOU?"], 730);
  const ra = SC.grande("RAIVA", a("raiva", 1), 1000, COL * 0.7);
  sair([...l1, ...l2, ra], t("jonas") - 0.15, "cima", { stagger: 0.02 });
  const js = SC.pops(["JONAS", "SENTIU."], [t("jonas"), t("sentiu", 2)], 700, COL * 0.7);
  const fu = SC.grande("FUGIU", a("fugiu"), 900, COL * 0.6, "medio");
  const mi = SC.grande("MISERICORDIOSO", a("misericordioso"), 1080);
  sair([...js, fu, mi], t("queria") - 0.3, "cima", { stagger: 0.02 });
  const ni = SC.grande("NÍNIVE", a("ninive"), 900, COL * 0.75, "medio");
  const ci = SC.pops(["A", "CIDADE", "INIMIGA"], [t("cidade") - 0.1, t("cidade"), t("inimiga")], 1060, COL * 0.75);
  sair([ni, ...ci], t("deus", 3) - 0.2, "cima", { stagger: 0.02 });
  const dp = SC.grande("DEUS PERDOOU", a("perdoou"), 900);
  const ma = SC.pops(["MESMO", "ASSIM."], [t("mesmo"), t("assim")], 1050, COL * 0.6);
  sair([dp, ...ma], t("perguntou") - 0.2, "cima", { stagger: 0.02 });
  const vr = SC.pops(["VOCÊ", "TEM", "RAZÃO"], [t("voce"), t("tem"), t("razao")], 820, COL * 0.7);
  const tr = SC.grande("TANTA RAIVA?", a("raiva", 2), 1000);
  estilhacar(tr, t("graca", 1) - 0.3);
  sair(vr, t("graca", 1) - 0.25, "cima", { stagger: 0.02, som: false });
  acento("GRAÇA", "graca", 1, 960, COL * 0.8);
  SC.pops(["QUE", "TE", "ALCANÇOU."], [t("alcancou") - 0.15, t("te", 2), t("alcancou")], 1120, COL * 0.75);
  SC.fecho("COMENTA “GRAÇA”", "JONAS 4:2–4  ·  SALMO E PIMENTA", a("comenta"), t("graca", 2));
  ra.color = COR.destaque; tr.color = COR.destaque;
  SC.virada(t("deus", 3), t("graca", 1));
}
