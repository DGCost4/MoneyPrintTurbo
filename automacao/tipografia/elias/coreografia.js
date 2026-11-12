// Short 14/11 — Elias (1 Reis 19:4–8). Voz: Carla. Palavra em vermelho: DESCANSAR.
/* global SC, rowAsc, sair, estilhacar, sfx, flash, anel, COR, W, DURACAO */
const { t, a, COL } = SC;
DURACAO = SC.fim() + 2.2;
SC.fundo("../shorts/lote1/imagens/", [
  { id: "elias_01_fogo", t: 0, z: [1.14, 1.05], f: [0.5, 0.5], amb: [["fogo", 540, 1000]] },
  { id: "elias_02_zimbro", t: t("dia") - 0.3, z: [1.04, 1.13], f: [0.5, 0.62], amb: [["sol", 820, 820]] },
  { id: "elias_03_anjo", t: t("sabe") - 0.3, z: [1.12, 1.03], f: [0.55, 0.65], amb: [["estrelas", 0, 900], ["luz", 600, 1150]] },
  { id: "elias_04_estrada", t: t("talvez") - 0.3, z: [1.03, 1.12], f: [0.5, 0.7], amb: [["sol", 300, 700]] },
], DURACAO);
{
  const l1 = SC.fixo(["O", "PROFETA", "MAIS"], 560, COL * 0.8);
  const l2 = SC.fixo(["CORAJOSO"], 745);
  const p = SC.pops(["PEDIU", "PRA", "MORRER."], [t("pediu"), t("pra"), t("morrer")], 890, COL * 0.75);
  sair([...l1, ...l2, ...p], t("elias") - 0.25, "cima", { stagger: 0.02 });
  const fogo = SC.grande("FOGO", a("fogo"), 1000, COL * 0.7); sfx(t("fogo"), "taiko", 0.8); SC.punch(t("fogo"));
  const c = SC.pops(["CAIU", "DO", "CÉU."], [t("cair"), t("do"), t("ceu")], 1150, COL * 0.6);
  sair([fogo, ...c], t("dia") - 0.3, "baixo", { stagger: 0.02 });
}
{
  const s = SC.pops(["SENTOU", "E", "DISSE:"], [t("sentou"), t("disse") - 0.1, t("disse")], 760, COL * 0.6);
  const basta = SC.grande("BASTA.", a("basta"), 1000, COL * 0.8);
  const v = SC.pops(["TIRA", "A", "MINHA", "VIDA."], [t("tira"), t("tira") + 0.12, t("minha"), t("vida")], 1150, COL * 0.7);
  estilhacar(basta, t("sabe") - 0.15);
  sair([...s, ...v], t("sabe") - 0.1, "cima", { stagger: 0.02, som: false });
}
{
  const q = SC.pops(["SABE", "O", "QUE", "DEUS", "FEZ?"], [t("sabe"), t("sabe") + 0.12, t("deus") - 0.1, t("deus"), t("fez")], 720, COL * 0.75);
  const b = SC.pops(["NÃO", "DEU", "BRONCA."], [t("nao", 1), t("deu", 1), t("bronca")], 860, COL * 0.7);
  const s = SC.pops(["NÃO", "DEU", "SERMÃO."], [t("nao", 2), t("deu", 2), t("sermao")], 990, COL * 0.75);
  sair([...q, ...b, ...s], t("deu", 3) - 0.25, "cima", { stagger: 0.02 });
  const pao = SC.grande("PÃO.", a("pao"), 860, COL * 0.45, "medio");
  const ag = SC.grande("ÁGUA.", a("agua"), 1040, COL * 0.55, "medio");
  const so = SC.grande("SONO.", a("dormir"), 1220, COL * 0.55, "medio");
  const d = SC.pops(["2", "VEZES"], [t("duas"), t("vezes")], 1370, COL * 0.4);
  sair([pao, ag, so, ...d], t("porque") - 0.2, "baixo", { stagger: 0.02 });
  const cm = SC.pops(["O", "CAMINHO", "ERA"], [t("caminho") - 0.1, t("caminho"), t("era")], 800, COL * 0.7);
  const lg = SC.grande("LONGO DEMAIS.", a("longo"), 1000, COL, "medio");
  sair([...cm, lg], t("talvez") - 0.25, "cima", { stagger: 0.02 });
}
{
  const f = SC.pops(["NO", "FIM", "DAS", "FORÇAS"], [t("fim") - 0.1, t("fim"), t("das"), t("forcas")], 780, COL * 0.85);
  const v = SC.pops(["DEPOIS", "DE", "UMA", "VITÓRIA."], [t("depois"), t("vitoria") - 0.25, t("vitoria") - 0.12, t("vitoria")], 900, COL * 0.85);
  sair([...f, ...v], t("cansaco") - 0.2, "cima", { stagger: 0.02 });
  const ca = SC.grande("CANSAÇO", a("cansaco"), 980); sfx(t("cansaco"), "taiko", 0.7);
  const fe = SC.pops(["NÃO", "É", "FALTA", "DE", "FÉ."], [t("nao", 3), t("falta") - 0.1, t("falta"), t("fe") - 0.1, t("fe")], 1130, COL * 0.8);
  sair([ca, ...fe], t("as") - 0.2, "cima", { stagger: 0.02 });
  const pp = SC.pops(["O", "PRÓXIMO", "PASSO"], [t("proximo") - 0.1, t("proximo"), t("passo")], 760, COL * 0.75);
  sair(pp, t("comer") - 0.25, "cima", { stagger: 0.02, som: false });
  SC.grande("COMER", a("comer"), 900, COL * 0.6, "medio");
  SC.grande("DESCANSAR.", a("descansar"), 1110, COL, "pesado", { cor: COR.destaque, from: 1500, dur: 0.46 });
  sfx(t("descansar") + 0.05, "braam", 0.9); flash(t("descansar") + 0.04, 0.3, 0.7); SC.punch(t("descansar") + 0.04, 0.08);
  anel(t("descansar") + 0.04, W / 2, 1110, 1100, "255,90,50");
  SC.fecho("COMENTA “DESCANSO”", "1 REIS 19:4–8  ·  SALMO E PIMENTA", a("comenta"), t("hoje"));
}
