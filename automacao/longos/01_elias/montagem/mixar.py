"""Mixagem do vídeo longo: narração reposicionada + trilha (com ducking) + efeitos. Saída: _audio.wav"""
import json, subprocess, os, numpy as np
SR = 44100
AQUI = os.path.dirname(os.path.abspath(__file__))
SFXD = [os.path.join(AQUI, "audio"), os.path.join(AQUI, "../../../tipografia/sfx")]
LJ = json.load(open(os.path.join(AQUI, "linha.json"))); EV = json.load(open(os.path.join(AQUI, "eventos.json")))
ORIG = json.load(open(os.path.join(AQUI, "../narracao/secoes.json")))
TOT = int(LJ["total"] * SR) + SR
def dec(arq, ss=None, dur=None, af=None):
    cmd = ["ffmpeg", "-v", "error"] + (["-ss", str(ss)] if ss is not None else []) + (["-t", str(dur)] if dur else []) + ["-i", arq]
    if af: cmd += ["-af", af]
    raw = subprocess.run(cmd + ["-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()
def soma(dst, src, t, g=1.0):
    i = int(t * SR); 
    if i < 0: src = src[-i:]; i = 0
    n = min(len(src), len(dst) - i)
    if n > 0: dst[i:i + n] += src[:n] * g
def rms_db(a): return 20 * np.log10(np.sqrt((a ** 2).mean()) + 1e-9)
# ---------- narração
nar = dec(os.path.join(AQUI, "../narracao/narracao.mp3"))
voz = np.zeros((TOT, 2), np.float32)
ini = [s["inicio"] for s in ORIG] + [len(nar) / SR]
for i, s in enumerate(LJ["secoes"]):
    soma(voz, nar[int(ini[i] * SR):int(ini[i + 1] * SR)], ini[i] + s["desl"])
# envelope da fala (para o ducking)
env = np.abs(voz[:, 0]); k = int(0.25 * SR)
env = np.convolve(env[::441], np.ones(25) / 25, mode="same")  # 100 Hz
fala = (env > 0.01).astype(float)
fala = np.convolve(fala, np.ones(60) / 60, mode="same")        # suaviza 0,6 s
fala = np.clip(fala * 2, 0, 1)
duck = np.repeat(fala, 441)[:TOT]
duck = np.pad(duck, (0, max(0, TOT - len(duck))))
# ---------- trilha
INS = {e["tipo"]: e for e in LJ["insercoes"]}
c2, c3, c4 = INS["cap2"]["t"], INS["cap3"]["t"], INS["cap4"]["t"]
def norm_rms(a, alvo=-20): return a * 10 ** ((alvo - rms_db(a)) / 20)
mus = np.zeros((TOT, 2), np.float32)
def trecho(arq, ss, dur, t0, fi=2.0, fo=3.0, af=None):
    a = norm_rms(dec(os.path.join(AQUI, "audio", arq), ss, dur, af))
    n = len(a); r = np.ones(n, np.float32)
    r[:int(fi * SR)] = np.linspace(0, 1, int(fi * SR))[:n]; r[-int(fo * SR):] *= np.linspace(1, 0, int(fo * SR))[-n:]
    soma(mus, a * r[:, None], t0)
# I: m1 do início até a cartela II (pausa durante título/vinheta)
v0 = INS["titulo"]["t"]
trecho("m1_seca.mp3", 0, v0 + 1.5, 0, fi=1.5, fo=1.5)
trecho("m1_seca.mp3", v0, c2 - INS["cap1"]["t"] + 2, INS["cap1"]["t"], fi=1.0, fo=3)
# II: m2 (o fogo) da cartela II até a III
trecho("m2_fogo.mp3", 0, c3 - c2 + 2.5, c2 - 0.5, fi=0.5, fo=3)
# III e IV: sem créditos para trilhas novas -> m1 transformada (mais lenta, abafada, com eco)
trecho("m1_seca.mp3", 150, (c4 - c3 + 3) * 0.88, c3 - 0.5, fi=2, fo=3, af="atempo=0.88,lowpass=f=2400,aecho=0.8:0.6:120:0.25")
trecho("m1_seca.mp3", 10, (LJ["total"] - c4 + 1) * 0.9, c4 - 0.5, fi=2, fo=5, af="atempo=0.9,lowpass=f=3200,aecho=0.8:0.5:90:0.2")
ganho_mus = 10 ** (-17 / 20) * (1 - duck * 0.6)      # mais baixa sob a voz
# sem trilha durante a vinheta (ela tem o próprio som)
v = INS["vinheta"]; a0, a1 = int((v["t"] - 0.3) * SR), int((v["t"] + v["dur"]) * SR); ganho_mus[a0:a1] *= 0.08
mus *= ganho_mus[:, None]
# ---------- efeitos
fx = np.zeros((TOT, 2), np.float32); cache = {}
def carrega(nome):
    if nome not in cache:
        if nome == "VINHETA": a = dec(os.path.join(AQUI, "../../vinheta/vinheta.mp4"))
        else:
            arq = next(os.path.join(d, nome + ".mp3") for d in SFXD if os.path.exists(os.path.join(d, nome + ".mp3")))
            a = dec(arq)
        pk = np.abs(a).max() + 1e-9; a = a / pk * 0.7
        cache[nome] = (a, int(np.abs(a).mean(1).argmax()))
    return cache[nome]
for e in EV["sfx"]:
    nome, modo = (e["nome"].split("@") + [None])[:2]
    a, pico = carrega(nome); t = e["t"] - (pico / SR if modo == "pico" else 0)
    if e.get("dur"):
        n = int(e["dur"] * SR); a = a[:n].copy() if len(a) >= n else np.tile(a, (n // len(a) + 1, 1))[:n].copy()
        f = min(int(0.8 * SR), n // 3); a[:f] *= np.linspace(0, 1, f)[:, None]; a[-f:] *= np.linspace(1, 0, f)[:, None]
        g = e["ganho"] * 0.5 * (1 - 0.35 * duck[int(t * SR):int(t * SR) + len(a)].mean() if t > 0 else 1)
    else: g = e["ganho"] * (1.4 if nome == "VINHETA" else 0.6)
    soma(fx, a, t, g)
mix = voz * 1.0 + mus + fx
pk = np.abs(mix).max(); print("pico", pk)
mix.astype(np.float32).tofile(os.path.join(AQUI, "_mix.f32"))
subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", os.path.join(AQUI, "_mix.f32"),
                "-af", "alimiter=limit=0.95:level=false,loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", "48000", os.path.join(AQUI, "_audio.wav")], check=True)
os.remove(os.path.join(AQUI, "_mix.f32")); print("áudio ok")
