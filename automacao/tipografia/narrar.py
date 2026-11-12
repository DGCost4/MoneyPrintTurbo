"""Gera a narração no ElevenLabs (voz Will) com o tempo de cada palavra.
Uso: python3 narrar.py <pasta> "<texto>"  -> <pasta>/narracao.mp3 e <pasta>/palavras.json"""
import json, base64, sys, urllib.request, os
VOZ = os.environ.get("VOZ", "IKpiSijWzlhOL6uX83EH")   # padrão: Will - Slow, Confident and Distant (pt-BR)
pasta, texto = sys.argv[1], sys.argv[2]
body = json.dumps({"text": texto, "model_id": os.environ.get("MODELO", "eleven_multilingual_v2"), "language_code": "pt",
    "voice_settings": {"stability": float(os.environ.get("ESTAB", "0.55")), "similarity_boost": 0.8, "style": float(os.environ.get("ESTILO", "0.15")),
                       "use_speaker_boost": True, "speed": float(os.environ.get("VEL", "1.0"))}}).encode()
req = urllib.request.Request(
    f"https://api.elevenlabs.io/v1/text-to-speech/{VOZ}/with-timestamps?output_format=mp3_44100_128",
    data=body, headers={"Content-Type": "application/json", "xi-api-key": "injetada-pelo-proxy"})
try:
    d = json.load(urllib.request.urlopen(req, timeout=180))
except urllib.error.HTTPError as e:
    sys.exit(f"ElevenLabs {e.code}: {e.read()[:400]}")
open(os.path.join(pasta, "narracao.mp3"), "wb").write(base64.b64decode(d["audio_base64"]))
al = d["alignment"]
words, cur, st, pe = [], "", None, None
for ch, s, e in zip(al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]):
    if ch.isspace():
        if cur: words.append([cur, st, pe]); cur = ""
    else:
        if not cur: st = s
        cur += ch; pe = e
if cur: words.append([cur, st, pe])
json.dump(words, open(os.path.join(pasta, "palavras.json"), "w"), ensure_ascii=False, indent=0)
for i, w in enumerate(words): print(f"{i:3d} {w[1]:6.2f}-{w[2]:6.2f} {w[0]}")
