// Short 19/11 — Paulo (Filipenses 1:13; 4:6–7). Voz: Carla. Palavra em vermelho: PAZ.
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
  { id: "paulo_01_cela", t: 0, z: [1.12, 1.04], f: [0.5, 0.4], amb: [["luz", 540, 500]] },
  { id: "paulo_02_escrevendo", t: t("paulo") - 0.3, z: [1.04, 1.12], f: [0.5, 0.7], amb: [["fogo", 845, 1280]] },
  { id: "paulo_03_correntes", t: t("ele") - 0.3, z: [1.04, 1.13], f: [0.5, 0.55], amb: [["luz", 540, 900]] },
  { id: "paulo_04_luz", t: t("paz", 1) - 0.3, z: [1.03, 1.12], f: [0.5, 0.5], amb: [["luz", 540, 420]] },
], DURACAO);
{
  const l1 = SC.fixo(["A", "ANSIEDADE"], 620);
  const l2 = SC.fixo(["NÃO", "TE", "DEIXA", "DORMIR?"], 780, COL * 0.85);
  sair([...l1, ...l2], t("paulo") - 0.15, "cima", { stagger: 0.02 });
  const pe = SC.pops(["PAULO", "ESCREVEU"], [t("paulo"), t("escreveu")], 700, COL * 0.7);
  const pr = SC.grande("DA PRISÃO", a("prisao", 1), 960, COL * 0.85); sfx(t("prisao", 1), "taiko", 0.8); SC.punch(t("prisao", 1));
  const vm = SC.pops(["VIVER", "OU", "MORRER?"], [t("viver"), t("ou"), t("morrer")], 1110, COL * 0.7);
  sair([...pe, pr, ...vm], t("ele") - 0.2, "cima", { stagger: 0.02 });
  const ed = SC.pops(["ELE", "NÃO", "DISSE:"], [t("ele"), t("nao", 2), t("disse", 1)], 760, COL * 0.6);
  const vc = SC.grande("VAI DAR TUDO CERTO", a("vai", 1), 960, COL, "medio");
  partir(vc, t("disse", 2) - 0.15);
  sair(ed, t("disse", 2), "cima", { stagger: 0.02, som: false });
  const na = SC.pops(["NÃO", "ANDEM"], [t("nao", 3), t("andem")], 780, COL * 0.5);
  const an = SC.grande("ANSIOSOS", a("ansiosos"), 940, COL, "medio");
  estilhacar(an, t("orem") - 0.2);
  const eo = SC.pops(["EM", "TUDO,", "OREM"], [t("tudo", 2) - 0.1, t("tudo", 2), t("orem")], 1080, COL * 0.7);
  const cg = SC.pops(["COM", "GRATIDÃO."], [t("gratidao") - 0.1, t("gratidao")], 1200, COL * 0.6);
  sair([...na, ...eo, ...cg], t("paz", 1) - 0.25, "cima", { stagger: 0.02 });
  acento("PAZ", "paz", 1, 940, COL * 0.55);
  const gc = SC.pops(["VAI", "GUARDAR", "O", "CORAÇÃO"], [t("guardar") - 0.1, t("guardar"), t("coracao") - 0.1, t("coracao")], 1090, COL * 0.85);
  sair(gc, t("paz", 2) - 0.25, "cima", { stagger: 0.02 });
  const pa = SC.pops(["A", "PRISÃO", "NÃO", "ABRIU."], [t("prisao", 2) - 0.1, t("prisao", 2), t("abriu") - 0.1, t("abriu")], 1240, COL * 0.85);
  sair(pa, t("veio", 2) - 0.2, "baixo", { stagger: 0.02, som: false });
  SC.grande("VEIO DENTRO DELA.", a("dentro", 2), 1250, COL, "medio");
  SC.fecho("COMENTA “PAZ”", "FILIPENSES 4:6–7  ·  SALMO E PIMENTA", a("comenta"), t("hoje"));
  l1[1].color = COR.destaque; an.color = COR.destaque;
  SC.virada(t("orem"), t("paz", 1));
}
