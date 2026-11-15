// Short 24/11 — Jó (Jó 1; 2:11–13; 42:7). Voz: Will. Dor em vermelho: EXPLICAR. Esperança: PRESENÇA.
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
  { id: "jo_c1", t: 0, z: [1.1, 1.03], f: [0.5, 0.6] },
  { id: "jo_c2", t: t("amigos") - 0.3, z: [1.03, 1.12], f: [0.5, 0.7], amb: [["estrelas", 0, 700]] },
  { id: "jo_c3", t: t("problema") - 0.3, z: [1.04, 1.12], f: [0.5, 0.6] },
  { id: "jo_c4", t: t("quem", 1) - 0.3, z: [1.03, 1.1], f: [0.5, 0.65], amb: [["luz", 540, 450]] },
], DURACAO);
{
  const l1 = SC.fixo(["EXPLICAR"], 620, COL * 0.85);
  const l2 = SC.fixo(["A", "SUA", "DOR?"], 770, COL * 0.6);
  RED(l1[0]);
  sair([...l1, ...l2], t("jo") - 0.15, "cima", { stagger: 0.02 });
  const jp = SC.pops(["JÓ", "PERDEU"], [t("jo"), t("perdeu")], 760, COL * 0.6);
  const td = SC.grande("TUDO.", a("tudo"), 940, COL * 0.6); sfx(t("tudo"), "taiko", 0.8);
  const ud = SC.pops(["EM", "UM", "DIA."], [t("dia") - 0.2, t("dia") - 0.1, t("dia")], 1080, COL * 0.4);
  sair([...jp, td, ...ud], t("amigos") - 0.3, "cima", { stagger: 0.02 });
  const am = SC.pops(["OS", "AMIGOS"], [t("amigos") - 0.1, t("amigos")], 740, COL * 0.6);
  const sd = SC.grande("7 DIAS", a("sete"), 920, COL * 0.6, "medio");
  const si = SC.pops(["EM", "SILÊNCIO."], [t("silencio") - 0.1, t("silencio")], 1060, COL * 0.6);
  const ac = SC.grande("ACERTARAM.", a("acertaram"), 1230, COL * 0.75, "medio");
  sair([...am, sd, ...si, ac], t("problema") - 0.25, "cima", { stagger: 0.02 });
  const pc = SC.pops(["O", "PROBLEMA", "COMEÇOU"], [t("problema") - 0.1, t("problema"), t("comecou")], 760, COL * 0.85);
  const ex = SC.grande("EXPLICAR", a("explicar", 2), 960); RED(ex);
  const so = SC.pops(["O", "SOFRIMENTO."], [t("sofrimento") - 0.1, t("sofrimento")], 1100, COL * 0.7);
  estilhacar(ex, t("quem", 1) - 0.15);
  sair([...pc, ...so], t("quem", 1) - 0.1, "cima", { stagger: 0.02, som: false });
  const qs = SC.pops(["QUEM", "SOFRE", "NEM", "SEMPRE"], [t("quem", 1), t("sofre"), t("nem"), t("sempre")], 760, COL * 0.85);
  const pr = SC.pops(["PRECISA", "DE", "RESPOSTA."], [t("precisa", 1), t("resposta") - 0.1, t("resposta")], 880, COL * 0.8);
  sair([...qs, ...pr], t("precisa", 2) - 0.15, "cima", { stagger: 0.02 });
  SC.pops(["PRECISA", "DE"], [t("precisa", 2), t("presenca") - 0.1], 820, COL * 0.5);
  acento("PRESENÇA.", "presenca", 1, 1000, COL);
  SC.fecho("COMENTA QUEM PRECISA DE VOCÊ", "JÓ 2:11–13  ·  SALMO E PIMENTA", a("comenta"), t("hoje"));
  SC.virada(t("quem", 1), t("presenca"));
}
