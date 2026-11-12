// Short 17/11 — Pedro (João 18:18; 21:9–17). Voz: Will. Palavra em vermelho: RECOMEÇO.
/* global SC, sair, estilhacar, partir, sfx, flash, anel, COR, W, DURACAO */
const { t, a, COL } = SC;
DURACAO = SC.fim() + 2.2;
SC.fundo("../shorts/lote1/imagens/", [
  { id: "pedro_01_fogueira", t: 0, z: [1.12, 1.04], f: [0.5, 0.75], amb: [["fogo", 540, 1500]] },
  { id: "pedro_02_galo", t: t("e", 1) - 0.25, z: [1.04, 1.12], f: [0.45, 0.7], amb: [["sol", 820, 1180]] },
  { id: "pedro_01_fogueira", t: t("repara") - 0.3, z: [1.05, 1.15], f: [0.5, 0.78], amb: [["fogo", 540, 1500]] },
  { id: "pedro_03_praia", t: t("depois") - 0.3, z: [1.04, 1.12], f: [0.45, 0.7], amb: [["agua", 0, 1000, 450], ["fogo", 420, 1600]] },
  { id: "pedro_04_mar", t: t("jesus", 5) - 0.3, z: [1.03, 1.12], f: [0.5, 0.75], amb: [["sol", 540, 960]] },
], DURACAO);
{
  const l1 = SC.fixo(["PEDRO", "NEGOU"], 600);
  const l2 = SC.fixo(["JESUS"], 770, COL * 0.7);
  const v1 = SC.grande("3 VEZES.", a("tres", 1), 990, COL * 0.75); sfx(t("tres", 1), "taiko", 0.8);
  sair([...l1, ...l2, v1], t("e", 1) - 0.15, "cima", { stagger: 0.02 });
  const jp = SC.pops(["JESUS", "PERGUNTOU"], [t("jesus", 2), t("perguntou")], 760, COL * 0.85);
  const v2 = SC.grande("3 VEZES.", a("tres", 2), 980, COL * 0.75); SC.punch(t("tres", 2));
  sair([...jp, v2], t("repara") - 0.2, "cima", { stagger: 0.02 });
  const rd = SC.pops(["REPARA", "NUM", "DETALHE"], [t("repara"), t("num"), t("detalhe")], 760, COL * 0.85);
  const br = SC.grande("BRASAS", a("brasas", 1), 1000); SC.punch(t("brasas", 1));
  sair([...rd, br], t("depois") - 0.25, "cima", { stagger: 0.02 });
}
{
  const dr = SC.pops(["DEPOIS", "DA", "RESSURREIÇÃO"], [t("depois"), t("ressurreicao") - 0.1, t("ressurreicao")], 720, COL * 0.9);
  const of = SC.grande("OUTRA FOGUEIRA", a("outra"), 920, COL, "medio");
  const db = SC.grande("DE BRASAS.", a("brasas", 2), 1090, COL * 0.75);
  sair([...dr, of, db], t("simao") - 0.2, "cima", { stagger: 0.02 });
  const si = SC.pops(["SIMÃO,"], [t("simao")], 760, COL * 0.4);
  const am = SC.grande("VOCÊ ME AMA?", a("ama"), 940, COL, "medio");
  const pc = SC.pops(["UMA", "PERGUNTA", "PARA", "CADA"], [t("pergunta") - 0.1, t("pergunta"), t("cada") - 0.1, t("cada")], 1080, COL * 0.85);
  const ng = SC.grande("NEGAÇÃO.", a("negacao"), 1250, COL * 0.85);
  estilhacar(ng, t("humilhar") - 0.3);
  sair([...si, am, ...pc], t("jesus", 5) - 0.2, "cima", { stagger: 0.02 });
}
{
  const hu = SC.grande("HUMILHAR", a("humilhar"), 920, COL, "medio");
  partir(hu, t("restaurar") - 0.3);
  const re = SC.grande("RESTAURAR.", a("restaurar"), 1100); SC.punch(t("restaurar"));
  sair([re], t("terminou") - 0.2, "cima");
  const um = SC.pops(["UMA", "MISSÃO:"], [t("missao") - 0.1, t("missao")], 760, COL * 0.6);
  const cd = SC.pops(["CUIDA", "DAS", "MINHAS"], [t("cuida"), t("minhas") - 0.1, t("minhas")], 900, COL * 0.8);
  const ov = SC.grande("OVELHAS.", a("ovelhas"), 1080, COL * 0.8, "medio");
  sair([...um, ...cd, ov], t("seu") - 0.3, "cima", { stagger: 0.02 });
  const fr = SC.pops(["O", "SEU", "PIOR", "FRACASSO"], [t("seu") - 0.1, t("seu"), t("pior"), t("fracasso")], 720, COL * 0.9);
  const nc = SC.grande("NÃO CANCELA", a("cancela"), 900, COL, "medio");
  const ch = SC.grande("SEU CHAMADO.", a("chamado"), 1070, COL * 0.85);
  sair([...fr, nc, ch], t("comenta") - 0.25, "cima", { stagger: 0.02 });
  SC.pops(["COMENTA"], [t("comenta")], 860, COL * 0.5);
  SC.grande("RECOMEÇO", a("recomeco"), 1080, COL * 0.9, "pesado", { cor: COR.destaque, from: 1500, dur: 0.46 });
  sfx(t("recomeco") + 0.05, "braam", 0.9); flash(t("recomeco") + 0.04, 0.3, 0.7); SC.punch(t("recomeco") + 0.04, 0.08);
  anel(t("recomeco") + 0.04, W / 2, 1080, 1100, "255,90,50");
  SC.pops(["SE", "VOCÊ", "PRECISA", "DE", "UM."], [t("se", 1), t("precisa") - 0.15, t("precisa"), t("um", 1) - 0.08, t("um", 1)], 1230, COL * 0.75);
  SC.pops(["JOÃO 21:15–17  ·  SALMO E PIMENTA"], [t("um", 1) + 0.4], 1500, COL * 0.62, 0.4);
}
