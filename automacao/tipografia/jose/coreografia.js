// Short 16/11 — José (Gênesis 50:19–20). Voz: Will. Palavra em vermelho: BEM.
/* global SC, word, asc, measure, sair, partir, mascara, tl, sfx, COR, DURACAO */
const { t, a, COL } = SC;
DURACAO = SC.fim() + 2.2;
SC.fundo("../shorts/lote1/imagens/", [
  { id: "jose_01_poco", t: 0, z: [1.12, 1.04], f: [0.5, 0.65], amb: [["sol", 840, 600]] },
  { id: "jose_02_trono", t: t("agora") - 0.3, z: [1.03, 1.13], f: [0.5, 0.7], amb: [["luz", 540, 1100]] },
  { id: "jose_03_lagrimas", t: t("mas") - 0.3, z: [1.04, 1.14], f: [0.5, 0.6], amb: [["sol", 540, 760]] },
  { id: "jose_04_nilo", t: t("pior") - 0.3, z: [1.12, 1.03], f: [0.5, 0.55], amb: [["agua", 0, 1250, 350], ["sol", 760, 820]] },
], DURACAO);
{
  const l1 = SC.fixo(["JOSÉ", "TINHA", "O"], 560, COL * 0.75);
  const l2 = SC.fixo(["PODER"], 760, COL * 0.75);
  const ds = SC.pops(["DE", "SE"], [t("de", 1), t("se", 1)], 880, COL * 0.4);
  const vg = SC.grande("VINGAR.", a("vingar"), 1080, COL * 0.85);
  const us = SC.pops(["E", "NÃO", "USOU."], [t("e", 1), t("nao", 1), t("usou")], 1250, COL * 0.6);
  partir(vg, t("usou") + 0.1);
  sair([...l1, ...l2, ...ds, ...us], t("irmaos") - 0.45, "cima", { stagger: 0.02 });
}
{
  const oi = SC.pops(["OS", "IRMÃOS"], [t("irmaos") - 0.1, t("irmaos")], 760, COL * 0.7);
  const es = SC.grande("ESCRAVO.", a("escravo"), 980); sfx(t("escravo"), "taiko", 0.8); SC.punch(t("escravo"));
  sair([...oi, es], t("agora") - 0.2, "cima", { stagger: 0.02 });
  const ag = SC.pops(["AGORA", "ESTAVAM"], [t("agora"), t("estavam")], 760, COL * 0.75);
  const aj = SC.grande("AJOELHADOS", a("ajoelhados"), 960, COL, "medio");
  const gv = SC.pops(["DIANTE", "DO", "GOVERNADOR"], [t("frente"), t("governador") - 0.1, t("governador")], 1100, COL * 0.85);
  sair([...ag, aj, ...gv], t("uma", 1) - 0.2, "cima", { stagger: 0.02 });
  const up = SC.pops(["UMA", "PALAVRA", "DELE"], [t("uma", 1), t("palavra"), t("dele")], 800, COL * 0.75);
  const ac = SC.grande("E ACABAVA.", a("acabava"), 1000);
  sair([...up, ac], t("mas") - 0.2, "cima", { stagger: 0.02 });
}
{
  const jc = SC.pops(["JOSÉ", "CHOROU"], [t("jose", 2), t("chorou")], 720, COL * 0.7);
  const ee = SC.pops(["ESTOU", "EU"], [t("estou"), t("eu")], 860, COL * 0.45);
  const lu = SC.grande("NO LUGAR", a("lugar"), 1040, COL * 0.75, "medio");
  const dd = SC.grande("DE DEUS?", a("deus", 1), 1200, COL * 0.75);
  sair([...jc, ...ee, lu, dd], t("voces") - 0.2, "cima", { stagger: 0.02 });
  const vp = SC.pops(["VOCÊS", "PLANEJARAM", "O"], [t("voces"), t("planejaram"), t("mal") - 0.12], 760, COL * 0.85);
  const yM = 1100;
  const mal = SC.grande("MAL", a("mal"), yM, COL * 0.55);
  const bem = word("BEM.", { width: COL * 0.48, center: true, color: COR.destaque });
  const yB = yM - measure("MAL", mal.s).asc / 2 + asc(bem) / 2;
  tl.set(bem, { a: 1, y: yB + 320 }, t("deus", 2));
  tl.to(bem, { y: yB, duration: 0.45, ease: "power4.out" }, t("deus", 2) + 0.02);
  mascara(mal, yM, [bem], t("deus", 2), t("bem") + 0.02);
  SC.punch(t("bem") + 0.02, 0.08);
  sair([...vp, bem], t("pior") - 0.4, "cima", { stagger: 0.02 });
}
{
  const pc = SC.pops(["A", "PIOR", "COISA"], [t("pior") - 0.1, t("pior"), t("coisa")], 760, COL * 0.75);
  const nf = SC.grande("NÃO É O FIM", a("fim"), 960, COL, "medio");
  const sh = SC.pops(["DA", "SUA", "HISTÓRIA."], [t("historia") - 0.2, t("historia") - 0.1, t("historia")], 1100, COL * 0.8);
  sair([...pc, nf, ...sh], t("deus", 3) - 0.25, "cima", { stagger: 0.02 });
  SC.grande("DEUS ESCREVE", a("escreve", 1), 900);
  const rg = SC.grande("RASGAR.", a("rasgar"), 1080, COL * 0.7, "medio");
  partir(rg, t("rasgar") + 0.45);
  SC.fecho("COMENTA “DEUS ESCREVE”", "GÊNESIS 50:19–20  ·  SALMO E PIMENTA", a("comenta"), t("nisso"));
}
