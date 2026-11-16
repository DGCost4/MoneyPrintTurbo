"""Linha do tempo final: insere título, vinheta e cartelas de capítulo entre os blocos da narração."""
import json
P = json.load(open("../narracao/palavras.json")); S = json.load(open("../narracao/secoes.json"))
TITULO, VINHETA, CARTELA, FIM = 3.4, 5.833, 3.2, 6.0
# inserções antes do bloco i: (duração, tipo)
INS = {1: [("titulo", TITULO), ("vinheta", VINHETA), ("cap1", CARTELA)], 3: [("cap2", CARTELA)], 4: [("cap3", CARTELA)], 6: [("cap4", CARTELA)]}
inicio = [s["inicio"] for s in S] + [1e9]
desl, eventos, extra = [], [], 0.0
for i in range(len(S)):
    for nome, d in INS.get(i, []):
        t0 = inicio[i] + extra - 0.6 + 0.6   # depois do respiro do bloco anterior
        eventos.append({"tipo": nome, "t": round(inicio[i] + extra, 3), "dur": d}); extra += d
    desl.append(extra)
pal = []
for w, s, e in P:
    i = max(k for k in range(len(S)) if s >= inicio[k] - 0.01)
    pal.append([w, round(s + desl[i], 3), round(e + desl[i], 3)])
secs = [{"titulo": S[i]["titulo"], "inicio": round(S[i]["inicio"] + desl[i], 3), "desl": round(desl[i], 3)} for i in range(len(S))]
total = round(pal[-1][2] + FIM, 2)
json.dump({"palavras": pal, "secoes": secs, "insercoes": eventos, "total": total}, open("linha.json", "w"), ensure_ascii=False)
for e in eventos: print(e)
for s in secs: print(s)
print("total", total)
open("linha.js","w").write("window.LINHA = " + json.dumps({"palavras": pal, "secoes": secs, "insercoes": eventos, "total": total}, ensure_ascii=False) + ";")
