"""Trilha (ElevenLabs Music) e efeitos de cena (ElevenLabs SFX) do vídeo longo do Elias."""
import json, os, urllib.request
from concurrent.futures import ThreadPoolExecutor
A = os.path.join(os.path.dirname(os.path.abspath(__file__)), "audio")
BASE = ("Instrumental cinematic documentary underscore for a biblical history narration, ancient Middle East, "
        "no vocals, no choir words, steady and continuous, sits under a spoken voice, no sudden stops. ")
MUSICA = {
 "m1_seca": (BASE + "Mysterious and tense: soft oud phrases, ney flute, low string drone, gentle frame drum pulse, "
             "a sense of a kingdom drifting away from God and a coming drought; warm, earthy, slowly evolving.", 300000),
 "m2_fogo": (BASE + "Epic confrontation on a mountain: starts restrained with low strings and frame drums, steadily builds "
             "tension with darbuka and deep percussion and brass swells, reaches a powerful triumphant climax around two thirds, "
             "then a release with rain-like shimmering strings.", 235000),
 "m3_deserto": (BASE + "Melancholic and intimate: solo duduk, sparse low strings, distant desert wind texture, sorrowful but "
                "tender, exhaustion and loneliness, then a gentle warm turn with soft harp near the end.", 165000),
 "m4_voz": (BASE + "Quiet, intimate and hopeful: soft sustained strings, gentle piano and harp, airy pads, a calm stillness "
            "after a storm, slowly growing into warm golden resolution at the end.", 185000),
}
SFX = {
 "corvos": ("Several ravens flapping wings and cawing in a rocky canyon, natural, close", 8),
 "riacho": ("Small gentle brook flowing over stones, calm water trickle ambience", 15),
 "vento_deserto": ("Hot dry desert wind ambience, soft gusts, sand hiss, lonely", 20),
 "seca": ("Dry cracked land ambience, cicadas buzzing in heat, faint wind, barren", 15),
 "multidao": ("Large ancient crowd murmuring outdoors on a hillside, tense anticipation, many voices indistinct", 15),
 "profetas_baal": ("Frenzied crowd of men chanting and shouting rhythmically, stomping and dancing around an altar, ritual frenzy, no clear words", 12),
 "fogo_ceu": ("A massive column of fire roaring down from the sky and slamming onto a stone altar, huge whoosh, roaring flames, steam hiss", 7),
 "povo_clama": ("Huge crowd gasping and falling to the ground then shouting together in awe, outdoor, epic", 6),
 "agua_jarros": ("Large jars of water being poured over wood and stones, splashing water running into a trench", 6),
 "chuva_trovao": ("Heavy rain starting to pour with rolling thunder and strong wind, storm", 18),
 "carruagem": ("Horses galloping and a wooden chariot rattling on a dirt road in heavy rain, passing", 10),
 "vento_forte": ("Tremendous violent wind tearing through mountains, rocks breaking and falling, howling", 8),
 "terremoto": ("Deep earthquake rumble, ground cracking open, rocks crumbling, low frequency shaking", 8),
 "fogo_monte": ("Great fire burning on a mountainside, roaring crackling flames, intense", 7),
 "silencio_fino": ("After a storm, total stillness, a very soft airy breath of wind, a delicate high shimmer, peaceful", 7),
 "caverna": ("Night inside a mountain cave, small campfire crackling softly, distant wind at the cave mouth, crickets", 15),
 "pena": ("Quill pen scratching on parchment, writing a short sentence, close and intimate", 4),
 "carimbo": ("Heavy rubber stamp slammed onto paper on a wooden desk, solid thud", 1),
 "mapa": ("Old paper map unfolding and sliding on a table, soft paper rustle", 2),
 "tracejado": ("Soft pencil line drawn quickly across paper, light scratch", 2),
 "coracao": ("Slow heavy heartbeat, deep and tense, cinematic", 6),
 "bois_arado": ("Oxen pulling a wooden plow in a field, soft hooves, soil, birds in the morning, calm countryside", 12),
 "manto": ("Heavy wool cloak thrown through the air and landing on shoulders, fabric whoosh", 2),
 "anjo": ("Soft angelic shimmer, gentle warm magical chime swell, subtle and holy", 4),
 "pao": ("Bread being torn apart by hands, crust crackling, close", 2),
 "porta_palacio": ("Large wooden palace door closing with echo in a stone hall", 3),
 "batida_tensao": ("Single deep cinematic low boom hit with a short reverb tail, documentary tension accent", 3),
 "transicao": ("Soft cinematic whoosh transition with a light airy swell", 2),
}
def post(url, body, dest):
    if os.path.exists(dest) and os.path.getsize(dest) > 5000: return "já existe"
    req = urllib.request.Request(url, data=json.dumps(body).encode(), headers={"Content-Type": "application/json", "xi-api-key": "x"})
    try:
        d = urllib.request.urlopen(req, timeout=600).read()
        if d[:1] == b"{": return "erro " + d[:200].decode()
        open(dest, "wb").write(d); return "ok"
    except urllib.error.HTTPError as e: return f"erro {e.code}: {e.read()[:300]}"
tarefas = [(n, lambda n=n, p=p, l=l: post("https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128",
            {"prompt": p, "music_length_ms": l, "force_instrumental": True}, f"{A}/{n}.mp3")) for n, (p, l) in MUSICA.items()]
tarefas += [(n, lambda n=n, p=p, d=d: post("https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128",
            {"text": p, "duration_seconds": d, "prompt_influence": 0.5}, f"{A}/{n}.mp3")) for n, (p, d) in SFX.items()]
with ThreadPoolExecutor(2) as ex:
    for n, r in zip([t[0] for t in tarefas], ex.map(lambda t: t[1](), tarefas)): print(n, r, flush=True)
