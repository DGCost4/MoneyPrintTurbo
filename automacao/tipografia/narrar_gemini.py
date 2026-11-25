"""Narração com a voz do Gemini (TTS) + tempos por palavra estimados por alinhamento de pausas.
Uso: VOZ=Charon python3 narrar_gemini.py <pasta> "<texto>"  -> <pasta>/narracao.mp3 e palavras.json
O Gemini não devolve tempos: as pausas do áudio (silêncios) são casadas com a pontuação do texto
e, dentro de cada trecho, as palavras são distribuídas pelo número de sílabas."""
import json, base64, os, re, sys, subprocess, urllib.request
import numpy as np
pasta, texto = sys.argv[1], sys.argv[2]
VOZ = os.environ.get("VOZ", "Charon"); VEL = float(os.environ.get("VEL", "1.0"))
DIR = os.environ.get("DIRECAO", "Leia em português do Brasil, como um narrador de documentário cristão: voz calma, próxima e emocionada, ritmo natural e contínuo, sem pressa e sem pausas longas, com peso nas frases de impacto.")
os.makedirs(pasta, exist_ok=True)
body = {"contents": [{"parts": [{"text": DIR + "\n\n" + texto}]}], "generationConfig": {"responseModalities": ["AUDIO"],
        "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": VOZ}}}}}
req = urllib.request.Request("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent",
                             data=json.dumps(body).encode(), headers={"Content-Type": "application/json", "x-goog-api-key": "x"})
d = json.load(urllib.request.urlopen(req, timeout=300))
pcm = base64.b64decode(d["candidates"][0]["content"]["parts"][0]["inlineData"]["data"])
af = f"silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,atempo={VEL},apad=pad_dur=0.15"
mp3 = os.path.join(pasta, "narracao.mp3")
subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "s16le", "-ar", "24000", "-ac", "1", "-i", "-", "-af", af, "-ar", "44100", "-b:a", "160k", mp3], input=pcm, check=True)
# ---------- alinhamento
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", mp3, "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True).stdout
a = np.frombuffer(raw, np.float32); fr = 160
rms = np.sqrt(np.convolve(a ** 2, np.ones(fr) / fr, "same")[::fr])          # 10 ms
lim = max(0.012, np.percentile(rms, 95) * 0.06)
voz = rms > lim
segs, ini = [], None                                                          # trechos de fala
for i, v in enumerate(np.append(voz, False)):
    if v and ini is None: ini = i
    if not v and ini is not None:
        segs.append([ini, i]); ini = None
# junta trechos separados por menos de 0,16 s (não é pausa de pontuação)
uni = []
for s in segs:
    if uni and s[0] - uni[-1][1] < 16: uni[-1][1] = s[1]
    else: uni.append(s)
segs = [[s / 100, e / 100] for s, e in uni if e - s > 4]
pal = texto.split()
sil = lambda w: max(1, len(re.findall(r"[aeiouáéíóúâêôãõà]+", w.lower())))
peso = [sil(w) + 0.6 for w in pal]
forte = [bool(re.search(r"[.!?:;…,\"”]$", w)) for w in pal]
cand = [i for i in range(len(pal) - 1) if forte[i]]                           # pausas possíveis depois da palavra i
cum = np.cumsum(peso) / sum(peso)
fala = sum(e - s for s, e in segs); acc, gaps = 0, []
for s, e in segs[:-1]: acc += e - s; gaps.append(acc / fala)                  # posição relativa de cada pausa
# DP: casa cada pausa do áudio com uma pontuação, em ordem, minimizando a distância relativa
G, C = len(gaps), len(cand)
if G > C:  # mais pausas do que pontuação: descarta as pausas mais curtas
    dur = [segs[k + 1][0] - segs[k][1] for k in range(G)]
    keep = sorted(sorted(range(G), key=lambda k: -dur[k])[:C])
    segs2 = [segs[0][:]]
    for k in range(G):
        if k in keep: segs2.append(segs[k + 1][:])
        else: segs2[-1][1] = segs[k + 1][1]
    segs = segs2; fala = sum(e - s for s, e in segs); acc, gaps = 0, []
    for s, e in segs[:-1]: acc += e - s; gaps.append(acc / fala)
    G = len(gaps)
INF = 1e9; D = np.full((G + 1, C + 1), INF); D[0, :] = 0; P = {}
for g in range(1, G + 1):
    for c in range(g, C + 1):
        op1 = D[g, c - 1]; op2 = D[g - 1, c - 1] + abs(cum[cand[c - 1]] - gaps[g - 1])
        if op2 <= op1: D[g, c] = op2; P[(g, c)] = True
        else: D[g, c] = op1; P[(g, c)] = False
esc, g, c = [], G, C
while g > 0:
    if P[(g, c)]: esc.append(cand[c - 1]); g -= 1
    c -= 1
esc = sorted(esc)
grupos, ini = [], 0
for b in esc + [len(pal) - 1]: grupos.append(list(range(ini, b + 1))); ini = b + 1
out = []
for (s, e), gr in zip(segs, grupos):
    tot = sum(peso[i] for i in gr); t = s
    for i in gr:
        dt = (e - s) * peso[i] / tot; out.append([pal[i], round(t, 3), round(t + dt * 0.92, 3)]); t += dt
json.dump(out, open(os.path.join(pasta, "palavras.json"), "w"), ensure_ascii=False, indent=0)
print(f"{len(segs)} trechos, {len(out)} palavras, {len(a)/16000:.1f} s")
for w in out: print(f"{w[1]:6.2f} {w[0]}")
