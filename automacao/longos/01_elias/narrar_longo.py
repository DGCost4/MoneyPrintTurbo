"""Narração do vídeo longo em blocos (ElevenLabs v3, voz Will), com ritmo uniforme.
- um pedido por seção do roteiro (com tempos por caractere);
- corta silêncio nas pontas, encurta pausas internas longas;
- iguala a velocidade de fala de todos os blocos (atempo leve) e junta com respiro fixo.
Saída: narracao/narracao.mp3, narracao/palavras.json, narracao/secoes.json"""
import json, base64, re, os, sys, subprocess, urllib.request, concurrent.futures as cf
import numpy as np
VOZ, SR = "IKpiSijWzlhOL6uX83EH", 44100
PAUSA_MAX, PAUSA_NOVA = 0.75, 0.5     # pausas internas acima de 0,75 s viram 0,5 s
RESPIRO = 0.6                         # silêncio entre blocos
OUT = "narracao"
TAGS = [
 ("Por que o homem que fez cair fogo", "[curious] Por que o homem que fez cair fogo"),
 ("Essa é a história de Elias.", "[serious] Essa é a história de Elias."),
 ("tão certo como vive o Senhor", "[firmly] tão certo como vive o Senhor"),
 ("O deus da chuva ia ser julgado", "[serious] O deus da chuva ia ser julgado"),
 ("E a chuva parou.", "[serious] E a chuva parou."),
 ("eu não tenho pão.", "[sad] eu não tenho pão."),
 ("A gente vai comer… e depois esperar a morte.", "[sad] A gente vai comer… e depois esperar a morte."),
 ("e o menino voltou a respirar.", "[softly] e o menino voltou a respirar."),
 ("então é você, o perturbador", "[sarcastic] então é você, o perturbador"),
 ("até quando vocês vão ficar mancando", "[firmly] até quando vocês vão ficar mancando"),
 ("gritem mais alto.", "[sarcastic] gritem mais alto."),
 ("Se fosse truque, aquilo ficava impossível.", "[serious] Se fosse truque, aquilo ficava impossível."),
 ("E o fogo caiu.", "[awe] E o fogo caiu."),
 ("o Senhor é Deus! O Senhor é Deus!", "[excited] o Senhor é Deus! O Senhor é Deus!"),
 ("E é exatamente aqui que a história vira.", "[serious] E é exatamente aqui que a história vira."),
 ("Uma frase. Escrita por uma pessoa.", "[serious] Uma frase. Escrita por uma pessoa."),
 ("Basta, Senhor. Tira", "[sighs] [sad] Basta, Senhor. Tira"),
 ("Não deu bronca.", "[gently] Não deu bronca."),
 ("levanta e come, porque o caminho", "[gently] levanta e come, porque o caminho"),
 ("E depois do fogo… veio um sussurro.", "[whispers] E depois do fogo… veio um sussurro."),
 ("Sete mil. Elias achava", "[warmly] Sete mil. Elias achava"),
 ("Talvez você esteja aí", "[softly] Talvez você esteja aí"),
 ("Deus não desistiu de Elias", "[warmly] Deus não desistiu de Elias"),
]

rot = open("roteiro.md").read()
nar = rot[rot.index("## Narração"):rot.index("---\n**Referências")]
secoes = []
USADAS = set()
for bloco in re.split(r"^### ", nar, flags=re.M)[1:]:
    tit, *linhas = bloco.split("\n")
    txt = " ".join(l.strip() for l in linhas if l.strip() and not l.startswith("["))
    for a, b in TAGS:
        if a in txt: txt = txt.replace(a, b, 1); USADAS.add(a)
    secoes.append((tit.strip(), txt))

falt = [a for a, _ in TAGS if a not in USADAS]
if falt: sys.exit(f'marcações sem lugar: {falt}')

def tts(i):
    arq = f"{OUT}/b{i:02d}.json"
    if os.path.exists(arq): return json.load(open(arq))
    body = json.dumps({"text": secoes[i][1], "model_id": "eleven_v3", "language_code": "pt",
                       "voice_settings": {"stability": 0.5, "similarity_boost": 0.75}}).encode()
    req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{VOZ}/with-timestamps?output_format=mp3_44100_128",
                                 data=body, headers={"Content-Type": "application/json", "xi-api-key": "x"})
    d = json.load(urllib.request.urlopen(req, timeout=300)); json.dump(d, open(arq, "w")); print("ok", i, flush=True); return d
with cf.ThreadPoolExecutor(2) as ex: res = list(ex.map(tts, range(len(secoes))))

def palavras(al):
    ws, cur, st, pe, dentro = [], "", None, None, False
    for ch, s, e in zip(al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]):
        if ch == "[": dentro = True
        if dentro:
            if ch == "]": dentro = False
            continue
        if ch.isspace():
            if cur: ws.append([cur, st, pe]); cur = ""
        else:
            if not cur: st = s
            cur += ch; pe = e
    if cur: ws.append([cur, st, pe])
    return ws

def decodifica(b64):
    open(f"{OUT}/_t.mp3", "wb").write(base64.b64decode(b64))
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f"{OUT}/_t.mp3", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.float32)

def atempo(x, f):
    p = subprocess.run(["ffmpeg", "-v", "error", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", "-af", f"atempo={f:.4f}", "-f", "f32le", "-"],
                       input=x.tobytes(), capture_output=True)
    return np.frombuffer(p.stdout, np.float32)

blocos = []
for (tit, _), d in zip(secoes, res):
    x, ws = decodifica(d["audio_base64"]), palavras(d["alignment"])
    # recorta: do início da 1ª palavra ao fim da última, encurtando pausas longas
    pedacos, novas, t_out = [], [], 0.0
    ini = max(0, ws[0][1] - 0.05)
    seg_ini = ini
    for k, w in enumerate(ws):
        if k and w[1] - ws[k-1][2] > PAUSA_MAX:
            fim = ws[k-1][2] + PAUSA_NOVA / 2
            pedacos.append(x[int(seg_ini*SR):int(fim*SR)]); t_out += fim - seg_ini
            seg_ini = w[1] - PAUSA_NOVA / 2
        novas.append([w[0], w[1] - seg_ini + t_out, w[2] - seg_ini + t_out])
    fim = ws[-1][2] + 0.12
    pedacos.append(x[int(seg_ini*SR):int(fim*SR)])
    y = np.concatenate(pedacos)
    fala = sum(w[2] - w[1] for w in novas)
    blocos.append({"tit": tit, "audio": y, "ws": novas, "taxa": len(novas) / (len(y) / SR)})

med = float(np.median([b["taxa"] for b in blocos]))
out, todas, secs, t = [], [], [], 0.0
for b in blocos:
    f = min(1.06, max(0.94, med / b["taxa"]))
    y = atempo(b["audio"], f) if abs(f - 1) > 0.02 else b["audio"]
    esc = len(y) / len(b["audio"])
    print(f'{b["tit"][:42]:42s} {b["taxa"]*60:5.0f} palavras/min  ajuste x{f:.3f}')
    secs.append({"titulo": b["tit"], "inicio": round(t, 3)})
    todas += [[w, round(t + s*esc, 3), round(t + e*esc, 3)] for w, s, e in b["ws"]]
    out += [y, np.zeros(int(RESPIRO*SR), np.float32)]; t += len(y)/SR + RESPIRO
a = np.concatenate(out)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", "-af", "afade=t=in:d=0.02",
                "-c:a", "libmp3lame", "-b:a", "192k", f"{OUT}/narracao.mp3"], input=a.tobytes())
json.dump(todas, open(f"{OUT}/palavras.json", "w"), ensure_ascii=False)
json.dump(secs, open(f"{OUT}/secoes.json", "w"), ensure_ascii=False, indent=1)
os.remove(f"{OUT}/_t.mp3")
print(f"total {t:.1f} s ({t/60:.1f} min), {len(todas)} palavras, mediana {med*60:.0f} palavras/min")
