// Short 28/11 — Marta (Lucas 10:38–42). Voz: Gemini Sulafat. Dor: ANSIOSA, COSTAS, MUITAS COISAS. Esperança: UMA SÓ É NECESSÁRIA, PARE.
/* global SC, word, asc, measure, sair, estilhacar, partir, tl, sfx, flash, anel, COR, W, DURACAO */
const { t, a, COL } = SC;
DURACAO = SC.fim() + 2.2;
const RED = (...ws) => ws.forEach((w) => { w.color = COR.destaque; });
const GOLD = (...ws) => ws.forEach((w) => { w.color = COR.esperanca; });
function acento(txt, palavra, n, y, w) {
  const wd = SC.grande(txt, a(palavra, n), y, w, "pesado", { cor: COR.esperanca, from: 1500, dur: 0.46 });
  const t0 = t(palavra, n);
  sfx(t0 + 0.05, "braam", 0.9); flash(t0 + 0.04, 0.3, 0.7); SC.punch(t0 + 0.04, 0.08);
  anel(t0 + 0.04, W / 2, y, 1100, "255,205,110");
  return wd;
}
const IMGS = "../shorts/lote4/imagens/";
SC.fundo(IMGS, [
  { id: "marta_c1", t: 0, z: [1.1, 1.03], f: [0.5, 0.5] },
  { id: "marta_c2", t: t("casa") - 0.3, z: [1.03, 1.12], f: [0.5, 0.55] },
  { id: "marta_c3", t: t("jesus", 3) - 0.3, z: [1.04, 1.12], f: [0.5, 0.5], amb: [["luz", 540, 500]] },
  { id: "marta_c4", t: t("pediu", 2) - 0.3, z: [1.03, 1.1], f: [0.5, 0.55], amb: [["luz", 540, 400]] },
], DURACAO);
{
  const l1 = SC.fixo(["JESUS", "CORRIGIU"], 620, COL * 0.85);
  const l2 = SC.fixo(["QUEM", "SERVIA."], 800, COL * 0.7); RED(l2[1]);
  sair([...l1, ...l2], t("ela", 2) - 0.3, "cima", { stagger: 0.02 });
  const tc = SC.grande("TUDO CERTO.", a("certo"), 760, COL * 0.75, "medio");
  const an = SC.grande("ANSIOSA DEMAIS.", a("ansiosa"), 920, COL * 0.9); RED(an);
  sair([tc, an], t("casa") - 0.2, "cima", { stagger: 0.02 });
  const cc = SC.pops(["A", "CASA", "CHEIA."], [t("casa") - 0.12, t("casa"), t("cheia")], 700, COL * 0.7);
  const co = SC.grande("TUDO NAS COSTAS DELA.", a("costas"), 860, COL, "pesado"); RED(co);
  const re = SC.grande("ELA RECLAMOU.", a("reclamou"), 1010, COL * 0.7, "clique");
  sair([...cc, co, re], t("jesus", 3) - 0.2, "cima", { stagger: 0.02 });
  const mm = SC.pops(["MARTA,", "MARTA..."], [t("marta", 2), t("marta", 3)], 640, COL * 0.7);
  const mc = SC.grande("MUITAS COISAS.", a("muitas"), 800, COL * 0.8, "medio"); RED(mc);
  const us = SC.grande("UMA SÓ É NECESSÁRIA.", a("so"), 980, COL, "pesado", { cor: COR.esperanca });
  sair([...mm, mc, us], t("ele") - 0.2, "cima", { stagger: 0.02 });
  const np = SC.pops(["NÃO", "PEDIU"], [t("nao"), t("pediu", 1)], 700, COL * 0.6);
  const ma = SC.grande("MAIS.", a("mais", 1), 860, COL * 0.45); RED(ma); estilhacar(ma, t("pediu", 2) - 0.1);
  const pa = acento("PEDIU QUE ELA PARASSE.", "parasse", 1, 1000, COL);
  sair([...np, pa], t("talvez") - 0.2, "cima", { stagger: 0.02 });
  const sp = SC.pops(["SENTAR", "PERTO", "DELE."], [t("sentar"), t("perto"), t("dele")], 900, COL * 0.8); GOLD(...sp);
  SC.fecho("COMENTA “PAUSA”", "LUCAS 10:38–42  ·  SALMO E PIMENTA", a("comenta"), t("pausa"));
  SC.virada(t("ele") - 0.2, t("parasse"));
}
