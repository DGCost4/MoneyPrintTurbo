// Short 25/11 — Lamentações 3:22–23. Voz: Carla. Dor em vermelho: DESABA, QUEIMADA, FOME. Esperança: MANHÃ.
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
  { id: "lamentacoes_c1", t: 0, z: [1.1, 1.03], f: [0.5, 0.7], amb: [["fogo", 300, 300]] },
  { id: "lamentacoes_c2", t: t("cidade", 1) - 0.3, z: [1.03, 1.12], f: [0.5, 0.6] },
  { id: "lamentacoes_c3", t: t("um") - 0.3, z: [1.04, 1.12], f: [0.5, 0.65] },
  { id: "lamentacoes_c4", t: t("misericordias") - 0.3, z: [1.03, 1.1], f: [0.5, 0.6], amb: [["sol", 860, 380]] },
], DURACAO);
{
  const l1 = SC.fixo(["QUANDO", "TUDO"], 600, COL * 0.75);
  const l2 = SC.fixo(["DESABA"], 790);
  RED(l2[0]);
  const de = SC.pops(["DE", "ONDE", "VEM", "A", "ESPERANÇA?"], [t("onde") - 0.1, t("onde"), t("vem"), t("esperanca", 1) - 0.1, t("esperanca", 1)], 930, COL * 0.85);
  sair([...l1, ...l2, ...de], t("livro") - 0.3, "cima", { stagger: 0.02 });
  const lm = SC.grande("LAMENTAÇÕES", a("lamentacoes"), 760, COL * 0.9, "medio");
  const er = SC.pops(["ESCRITO", "NAS", "RUÍNAS"], [t("escrito"), t("ruinas", 1) - 0.1, t("ruinas", 1)], 920, COL * 0.75);
  sair([lm, ...er], t("cidade", 1) - 0.2, "cima", { stagger: 0.02 });
  const qu = SC.grande("QUEIMADA.", a("queimada"), 820, COL * 0.75, "medio"); RED(qu);
  const lv = SC.grande("LEVADO.", a("levado"), 980, COL * 0.6, "medio");
  const fo = SC.grande("FOME.", a("fome"), 1140, COL * 0.45, "medio"); RED(fo);
  sair([qu, lv, fo], t("um") - 0.2, "baixo", { stagger: 0.02 });
  const tr = SC.pops(["UM", "DOS", "LIVROS", "MAIS", "TRISTES"], [t("um"), t("dos", 1), t("livros"), t("mais", 1), t("tristes")], 760, COL * 0.9);
  sair(tr, t("ali") - 0.25, "cima", { stagger: 0.02 });
  const ea = SC.pops(["E", "É", "ALI:"], [t("e", 1), t("e", 2), t("ali")], 700, COL * 0.4);
  const mi = SC.pops(["AS", "MISERICÓRDIAS"], [t("misericordias") - 0.1, t("misericordias")], 840, COL * 0.85);
  const rn = SC.pops(["SE", "RENOVAM", "A", "CADA"], [t("renovam") - 0.1, t("renovam"), t("cada") - 0.1, t("cada")], 980, COL * 0.75);
  const mh = acento("MANHÃ.", "manha", 1, 1160, COL * 0.75);
  sair([...ea, ...mi, ...rn, mh], t("esperanca", 2) - 0.2, "cima", { stagger: 0.015 });
  SC.pops(["A", "ESPERANÇA", "NÃO", "ESPEROU"], [t("esperanca", 2) - 0.1, t("esperanca", 2), t("nao"), t("esperou")], 760, COL * 0.9);
  SC.grande("NASCEU NAS RUÍNAS.", a("nasceu"), 960, COL, "medio");
  SC.fecho("COMENTA “MANHÃ”", "LAMENTAÇÕES 3:22–23  ·  SALMO E PIMENTA", a("comenta"), t("manha", 2));
  SC.virada(t("ali") - 0.2, t("manha", 1));
}
