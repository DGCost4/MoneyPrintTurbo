// Short 26/11 — Abraão (Gênesis 21:1–2). Voz: Gemini Charon. Dor: 25 ANOS, ERROU, DEMORA, ERRO. Esperança: ISAQUE NASCEU.
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
  { id: "abraao_c1", t: 0, z: [1.1, 1.03], f: [0.5, 0.45], amb: [["estrelas"]] },
  { id: "abraao_c2", t: t("cansado") - 0.3, z: [1.03, 1.12], f: [0.5, 0.6] },
  { id: "abraao_c3", t: t("talvez") - 0.3, z: [1.04, 1.12], f: [0.5, 0.5], amb: [["estrelas"]] },
  { id: "abraao_c4", t: t("isaque") - 0.3, z: [1.03, 1.1], f: [0.5, 0.55], amb: [["sol", 540, 420]] },
], DURACAO);
{
  const l1 = SC.fixo(["DEUS", "FEZ", "ABRAÃO"], 620, COL * 0.85);
  const l2 = SC.fixo(["ESPERAR", "25", "ANOS"], 800); RED(l2[1], l2[2]);
  sair([...l1, ...l2], t("meio") - 0.35, "cima", { stagger: 0.02 });
  const me = SC.pops(["NO", "MEIO", "DA", "ESPERA,"], [t("no", 1), t("meio"), t("da", 1), t("espera")], 760, COL * 0.8);
  const er = SC.grande("ELE ERROU.", a("errou"), 920, COL * 0.8); RED(er);
  sair([...me, er], t("cansado") - 0.2, "cima", { stagger: 0.02 });
  const ca = SC.pops(["CANSADO", "DE", "ESPERAR,"], [t("cansado"), t("de", 1), t("esperar", 2)], 720, COL * 0.8);
  const jd = SC.grande("DO JEITO DELE.", a("jeito"), 900, COL * 0.85, "medio"); RED(jd);
  estilhacar(jd, t("talvez") - 0.2);
  sair(ca, t("talvez") - 0.2, "cima", { stagger: 0.02 });
  const vc = SC.pops(["VOCÊ", "TAMBÉM", "ESPERA?"], [t("voce"), t("tambem"), t("esperando")], 600, COL * 0.8);
  const li = [["UM EMPREGO", "emprego", 760], ["UMA CURA", "cura", 880], ["UMA FAMÍLIA", "familia", 1000], ["UMA RESPOSTA", "resposta", 1120]]
    .map(([s, p, y]) => { const w = SC.grande(s, a(p), y, COL * 0.62, "clique"); RED(w); return w; });
  sair([...vc, ...li], t("mas", 1) - 0.2, "cima", { stagger: 0.015 });
  const dn = SC.pops(["DEUS", "NÃO", "CANCELOU"], [t("deus", 2), t("nao", 1), t("cancelou")], 700, COL * 0.85);
  const pr = SC.grande("A PROMESSA.", a("promessa"), 860, COL * 0.75, "medio");
  const dm = SC.grande("DEMORA", a("demora"), 1010, COL * 0.6); RED(dm); estilhacar(dm, t("nem") - 0.1);
  const eo = SC.grande("ERRO", a("erro"), 1010, COL * 0.45); RED(eo); estilhacar(eo, t("isaque") - 0.2);
  sair([...dn, pr], t("isaque") - 0.25, "cima", { stagger: 0.02 });
  const is = acento("ISAQUE NASCEU.", "nasceu", 1, 860, COL * 0.95);
  const nt = SC.pops(["NO", "TEMPO", "DE", "DEUS."], [t("no", 2), t("tempo"), t("de", 2), t("deus", 3)], 1020, COL * 0.8);
  sair([is, ...nt], t("demorar") - 0.2, "cima", { stagger: 0.02 });
  SC.grande("DEMORAR", a("demorar"), 760, COL * 0.7, "medio");
  SC.grande("NÃO É ESQUECER.", a("esquecer"), 920, COL * 0.9, "pesado", { cor: COR.esperanca });
  SC.fecho("COMENTA “EU ESPERO”", "GÊNESIS 21:1–2  ·  SALMO E PIMENTA", a("comenta"), t("espero"));
  SC.virada(t("mas", 1) - 0.2, t("nasceu"));
}
