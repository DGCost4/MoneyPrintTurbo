// Short 27/11 — Rute (Rute 2; 4:17). Voz: Gemini Sulafat. Dor: CHÃO, PERDIDO, SOZINHA. Esperança: BISAVÓ DO REI DAVI, NAS SOBRAS.
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
  { id: "rute_c1", t: 0, z: [1.1, 1.03], f: [0.5, 0.55] },
  { id: "rute_c2", t: t("rute", 1) - 0.3, z: [1.03, 1.12], f: [0.5, 0.5] },
  { id: "rute_c3", t: t("foi", 1) - 0.3, z: [1.04, 1.12], f: [0.45, 0.55] },
  { id: "rute_c4", t: t("rute", 2) - 0.3, z: [1.03, 1.1], f: [0.5, 0.5], amb: [["sol", 760, 380]] },
], DURACAO);
// abertura forte: impacto + zoom no instante 0 (o Short não começa parado nem mudo)
sfx(0.02, "impacto_pesado", 0.8); sfx(0.02, "braam", 0.35); SC.punch(0.02, 0.06);
{
  const l1 = SC.fixo(["ELA", "CATAVA"], 600, COL);
  const l2 = SC.fixo(["RESTO", "DE", "COMIDA"], 770, COL);
  const l3 = SC.fixo(["NO", "CHÃO."], 940, COL); RED(l3[1]);
  sair([...l1, ...l2, ...l3], t("rute", 1) - 0.3, "cima", { stagger: 0.02 });
  const pe = SC.grande("ELA PERDEU", a("perdido"), 640, COL * 0.7, "medio");
  const pl = [["O MARIDO", "marido", 790], ["A TERRA", "terra", 900], ["O FUTURO", "futuro", 1010]]
    .map(([s, p, y]) => { const w = SC.grande(s, a(p), y, COL * 0.55, "clique"); RED(w); return w; });
  sair([pe, ...pl], t("foi", 1) - 0.2, "cima", { stagger: 0.015 });
  const sz = [["ESTRANGEIRA.", "estrangeira", 700], ["POBRE.", "pobre", 830], ["SOZINHA.", "sozinha", 960]]
    .map(([s, p, y], i) => { const w = SC.grande(s, a(p), y, COL * (i === 0 ? 0.85 : 0.5), i === 2 ? "pesado" : "medio"); if (i === 2) RED(w); return w; });
  sair(sz, t("foi", 2) - 0.2, "cima", { stagger: 0.02 });
  const ns = SC.grande("NAS SOBRAS,", a("sobras", 1), 760, COL * 0.8, "medio");
  const dc = SC.pops(["DEUS", "COMEÇOU", "A ESCREVER."], [t("deus", 1), t("comecou", 2), t("escrever")], 920, COL * 0.85);
  sair([ns, ...dc], t("rute", 2) - 0.2, "cima", { stagger: 0.02 });
  const bv = acento("BISAVÓ DO REI DAVI.", "bisavo", 2, 900, COL);
  sair([bv], t("vezes") - 0.3, "cima", {});
  const rc = SC.grande("O RECOMEÇO", a("recomeco", 1), 700, COL * 0.75, "medio");
  const pq = SC.pops(["PARECE", "PEQUENO", "DEMAIS."], [t("parece"), t("pequeno"), t("demais")], 850, COL * 0.85); RED(pq[1]);
  const dt = SC.pops(["MAS", "DEUS", "TRABALHA"], [t("mas"), t("deus", 2), t("trabalha")], 1020, COL * 0.8);
  acento("NAS SOBRAS.", "sobras", 2, 1180, COL * 0.75);
  sair([rc, ...pq], t("comenta") - 0.3, "cima", { stagger: 0.015, som: false });
  SC.fecho("COMENTA “RECOMEÇO”", "RUTE 2 E 4:17  ·  SALMO E PIMENTA", a("comenta"), t("recomeco", 2));
  SC.virada(t("foi", 2) - 0.2, t("bisavo", 2));
  void dt;
}
