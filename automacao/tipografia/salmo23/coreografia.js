// Short 15/11 — Salmo 23:4. Voz: Carla. Palavra em vermelho: COMIGO.
/* global SC, word, asc, measure, sair, estilhacar, mascara, tl, sfx, COR, DURACAO */
const { t, a, COL } = SC;
DURACAO = SC.fim() + 2.2;
SC.fundo("../shorts/lote1/imagens/", [
  { id: "salmo23_01_pastos", t: 0, z: [1.12, 1.04], f: [0.5, 0.6], amb: [["agua", 0, 1400, 130]] },
  { id: "salmo23_02_vale", t: t("ele") - 0.3, z: [1.03, 1.14], f: [0.5, 0.55], escuro: 0.7 },
  { id: "salmo23_03_cajado", t: t("diferenca") - 0.3, z: [1.04, 1.13], f: [0.5, 0.75], amb: [["luz", 540, 300]] },
  { id: "salmo23_04_saida", t: t("mesmo") - 0.3, z: [1.03, 1.12], f: [0.5, 0.5], amb: [["sol", 540, 820]] },
], DURACAO);
{
  const l1 = SC.fixo(["O", "SALMO", "23"], 600, COL * 0.75);
  const p = SC.pops(["NÃO", "PROMETE", "UMA", "VIDA"], [t("nao", 1), t("promete"), t("uma"), t("vida")], 760, COL * 0.85);
  const sv = SC.grande("SEM VALE.", a("sem"), 990);
  sair([...l1, ...p, sv], t("ele") - 0.25, "cima", { stagger: 0.02 });
}
{
  const aq = SC.pops(["AINDA", "QUE", "EU", "ANDE"], [t("ainda", 1), t("ainda", 1) + 0.15, t("eu"), t("ande")], 760, COL * 0.8);
  const so = SC.grande("SOMBRA", a("sombra", 1), 1000);
  const m = SC.pops(["DA", "MORTE."], [t("morte") - 0.1, t("morte")], 1140, COL * 0.5);
  sair([...aq, so, ...m], t("ainda", 2) - 0.2, "baixo", { stagger: 0.02 });
  const aq2 = SC.grande("AINDA QUE.", a("ainda", 2), 980); sfx(t("ainda", 2), "taiko", 0.8); SC.punch(t("ainda", 2));
  sair([aq2], t("davi") - 0.2, "cima");
  const ds = SC.pops(["DAVI", "SABIA:"], [t("davi"), t("sabia")], 780, COL * 0.55);
  const vv = SC.grande("O VALE VEM.", a("vale", 3), 980, COL, "medio");
  sair([...ds, vv], t("diferenca") - 0.3, "cima", { stagger: 0.02 });
}
{
  const df = SC.pops(["A", "DIFERENÇA"], [t("diferenca") - 0.15, t("diferenca")], 700, COL * 0.7);
  const pt = SC.pops(["PORQUE", "TU", "ESTÁS"], [t("porque"), t("tu"), t("estas")], 820, COL * 0.75);
  const yS = 1120;
  const sombra = SC.grande("SOMBRA", a("seguinte"), yS);
  const com = word("COMIGO.", { width: COL * 0.82, center: true, color: COR.destaque });
  const yC = yS - measure("SOMBRA", sombra.s).asc / 2 + asc(com) / 2;
  tl.set(com, { a: 1, y: yC + 320 }, t("porque"));
  tl.to(com, { y: yC, duration: 0.45, ease: "power4.out" }, t("porque") + 0.02);
  mascara(sombra, yS, [com], t("porque"), t("comigo", 1) + 0.02);
  SC.punch(t("comigo", 1) + 0.02, 0.08);
  sair([...df, ...pt, com], t("promessa") - 0.35, "cima", { stagger: 0.02 });
  const au = SC.grande("AUSÊNCIA", a("ausencia"), 900, COL, "medio");
  estilhacar(au, t("presenca") - 0.15);
  const pr = SC.grande("PRESENÇA", a("presenca"), 1080);
  const dp = SC.pops(["DO", "PASTOR"], [t("pastor", 1) - 0.1, t("pastor", 1)], 1220, COL * 0.6);
  sair([pr, ...dp], t("se", 1) - 0.2, "cima", { stagger: 0.02 });
}
{
  const at = SC.pops(["ATRAVESSANDO", "UM", "VALE"], [t("atravessando", 1), t("vale", 4) - 0.1, t("vale", 4)], 760, COL * 0.9);
  const vn = SC.pops(["VOCÊ", "NÃO", "ESTÁ"], [t("voce", 2), t("nao", 3), t("sozinho") - 0.1], 880, COL * 0.65);
  const soz = SC.grande("SOZINHO", a("sozinho"), 1070, COL, "medio");
  estilhacar(soz, t("nele") + 0.25);
  sair([...at, ...vn], t("mesmo") - 0.25, "cima", { stagger: 0.02 });
  SC.pops(["O", "MESMO", "PASTOR"], [t("mesmo") - 0.1, t("mesmo"), t("pastor", 2)], 760, COL * 0.8);
  SC.grande("CAMINHA COM VOCÊ", a("caminha"), 960, COL, "medio");
  SC.grande("NO ESCURO.", a("escuro"), 1130, COL * 0.8);
  SC.fecho("COMENTA “COMIGO”", "SALMO 23:4  ·  SALMO E PIMENTA", a("comenta"), t("atravessando", 2));
}
