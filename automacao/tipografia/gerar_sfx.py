"""Gera os efeitos sonoros da tipografia no ElevenLabs (uma vez; ficam em sfx/)."""
import json, os, sys, urllib.request
from concurrent.futures import ThreadPoolExecutor
AQUI = os.path.dirname(os.path.abspath(__file__))
SFX = {
    "impacto_pesado": ("Deep heavy cinematic impact, massive stone slab slamming onto the ground, sub bass boom, short tail", 1.2),
    "impacto_medio": ("Short punchy thud of a heavy wooden block dropped on concrete, tight and dry", 0.6),
    "clique": ("Crisp short mechanical click, tight dry tick, like a heavy key press", 0.5),
    "whoosh": ("Fast short air whoosh swish passing by", 0.7),
    "racha": ("Stone ground cracking and shattering, rocks crumbling and falling, short", 1.5),
    "explosao_luz": ("Reverse cymbal swell into a bright soft cinematic boom with glittering shimmer tail", 2.0),
    "corte": ("Sharp blade slash, metallic schwing with crackling sparks", 1.0),
    "fechamento": ("Two heavy metal pieces sliding and locking together, solid mechanical clunk", 0.8),
    "taiko": ("Single deep Japanese taiko drum hit, powerful, wooden resonance, short tail", 1.5),
    "pergaminho": ("Old paper scroll sliding and unrolling quickly across a wooden table, soft paper swish", 1.0),
    "braam": ("Deep cinematic trailer braam hit with sub bass drop, warm and powerful, long tail", 3.0),
}
def gerar(item):
    nome, (texto, dur) = item
    dest = os.path.join(AQUI, "sfx", nome + ".mp3")
    if os.path.exists(dest):
        return nome, "já existe"
    body = json.dumps({"text": texto, "duration_seconds": dur, "prompt_influence": 0.6}).encode()
    req = urllib.request.Request("https://api.elevenlabs.io/v1/sound-generation", data=body,
        headers={"Content-Type": "application/json", "xi-api-key": "injetada-pelo-proxy"})
    try:
        open(dest, "wb").write(urllib.request.urlopen(req, timeout=180).read())
        return nome, "ok"
    except urllib.error.HTTPError as e:
        return nome, f"erro {e.code}: {e.read()[:200]}"
with ThreadPoolExecutor(4) as ex:
    for nome, st in ex.map(gerar, SFX.items()):
        print(nome, st)
