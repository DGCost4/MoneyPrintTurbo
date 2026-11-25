// Short 29/11 — Zacarias (Lucas 1:5–25). Voz: Gemini Charon. Dor: SILÊNCIO, NÃO ACREDITOU. Esperança: DEUS NÃO TINHA ESQUECIDO.
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
  { id: "zacarias_c1", t: 0, z: [1.1, 1.03], f: [0.5, 0.45], amb: [["luz", 540, 300]] },
  { id: "zacarias_c2", t: t("zacarias") - 0.3, z: [1.03, 1.12], f: [0.5, 0.55] },
  { id: "zacarias_c3", t: t("quando") - 0.3, z: [1.04, 1.12], f: [0.5, 0.45], amb: [["luz", 540, 500]] },
  { id: "zacarias_c4", t: t("filho", 2) - 0.3, z: [1.03, 1.1], f: [0.5, 0.5], amb: [["sol", 760, 420]] },
], DURACAO);
// abertura forte: impacto + zoom no instante 0 (o Short não começa parado nem mudo)
sfx(0.02, "impacto_pesado", 0.8); sfx(0.02, "braam", 0.35); SC.punch(0.02, 0.06);
{
  const l1 = SC.fixo(["400", "ANOS"], 630, COL);
  const l2 = SC.fixo(["DE", "SILÊNCIO"], 810, COL); RED(l2[1]);
  sair([...l1, ...l2], t("quebrou") - 0.3, "cima", { stagger: 0.02 });
  const qb = SC.grande("QUEBROU O SILÊNCIO", a("quebrou"), 720, COL, "medio");
  const na = SC.pops(["COM", "QUEM", "NÃO", "ACREDITOU."], [t("homem") - 0.1, t("homem"), t("nao", 1), t("acreditou", 1)], 880, COL * 0.95); RED(na[3]);
  sair([qb, ...na], t("zacarias") - 0.2, "cima", { stagger: 0.02 });
  const zi = SC.pops(["ZACARIAS", "E", "ISABEL"], [t("zacarias"), t("isabel") - 0.15, t("isabel")], 700, COL * 0.9);
  const vi = SC.grande("A VIDA INTEIRA.", a("inteira"), 860, COL * 0.8); RED(vi);
  sair([...zi, vi], t("quando") - 0.2, "cima", { stagger: 0.02 });
  const aj = SC.grande("O ANJO CHEGOU.", a("anjo"), 760, COL * 0.85, "medio"); flash(t("anjo"), 0.25, 0.5);
  const nc = SC.grande("NEM ACREDITOU.", a("acreditou", 2), 920, COL * 0.8); RED(nc); estilhacar(nc, t("mas") - 0.1);
  sair([aj], t("mas") - 0.2, "cima", {});
  const es = acento("DEUS NÃO TINHA ESQUECIDO.", "esquecido", 1, 900, COL);
  sair([es], t("filho", 2) - 0.2, "cima", {});
  const jb = SC.grande("JOÃO BATISTA", a("joao"), 760, COL * 0.8, "medio");
  const pc = SC.pops(["PREPAROU", "O", "CAMINHO"], [t("preparou"), t("caminho") - 0.12, t("caminho")], 900, COL * 0.85);
  sair([jb, ...pc], t("silencio", 2) - 0.2, "cima", { stagger: 0.02 });
  const si = SC.grande("SILÊNCIO", a("silencio", 2), 720, COL * 0.75); RED(si);
  SC.grande("NÃO É AUSÊNCIA.", a("ausencia"), 880, COL * 0.85, "pesado", { cor: COR.esperanca });
  const dp = SC.pops(["DEUS", "PREPARANDO", "A RESPOSTA."], [t("deus", 3), t("preparando"), t("resposta")], 1060, COL * 0.95); GOLD(...dp);
  SC.fecho("COMENTA “EU CREIO”", "LUCAS 1:5–25  ·  SALMO E PIMENTA", a("comenta"), t("creio"));
  SC.virada(t("mas") - 0.2, t("esquecido"));
}
