"""Gera as imagens de fundo de um Short no estilo Ukiyo-e (Gemini image, 9:16).
Uso: python3 gerar_imagens.py <pasta> <cenas.json>  -> <pasta>/imagens/<id>.png"""
import base64, json, os, sys, urllib.request
from concurrent.futures import ThreadPoolExecutor
MODELO = "gemini-3-pro-image"
ESTILO = (
    "Authentic Edo-period Japanese ukiyo-e woodblock print, vertical oban sheet. Flat areas of colour printed "
    "from separate woodblocks, slightly out of register with the black sumi key-block line; bold carved "
    "outlines with tapered, variable width; bokashi hand-wiped gradients in sky and water; warm washi paper "
    "texture visible everywhere, faint woodgrain and baren rubbing in large colour areas, fine specks. "
    "Limited pigment set: Prussian blue dominant for sky and water, pale blue, ochre/straw, muted greens, sumi "
    "black, and red used rarely. Paper is the white (mist, foam, light are unprinted paper). Depth only by "
    "stacked flat layers, long horizontal mist bands and bold cropping, no perspective rendering, no shading "
    "on forms. Figures dressed as ancient Israelites and Philistines of the Bible (simple tunics, cloaks, "
    "bronze armour), NOT samurai, NOT Japanese clothing. Original composition, not a copy of any famous print. "
    "No text, no letters, no calligraphy, no seals, no signature, no border cartouches, no watermark. "
    "Keep the middle third of the image calm and uncluttered (titles will be placed over it). "
)
def gerar(c, pasta):
    dest = os.path.join(pasta, "imagens", c["id"] + ".png")
    if os.path.exists(dest):
        return c["id"], "já existe"
    body = {"contents": [{"parts": [{"text": ESTILO + "Scene: " + c["cena"]}]}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "9:16"}}}
    req = urllib.request.Request(
        f"https://generativelanguage.googleapis.com/v1beta/models/{MODELO}:generateContent",
        data=json.dumps(body).encode(), headers={"Content-Type": "application/json", "x-goog-api-key": "injetada-pelo-proxy"})
    for tentativa in range(3):
        try:
            d = json.load(urllib.request.urlopen(req, timeout=300))
            for p in d["candidates"][0]["content"]["parts"]:
                if "inlineData" in p:
                    open(dest, "wb").write(base64.b64decode(p["inlineData"]["data"]))
                    return c["id"], "ok"
            return c["id"], "sem imagem: " + json.dumps(d)[:300]
        except urllib.error.HTTPError as e:
            erro = f"{e.code} {e.read()[:300]}"
        except Exception as e:
            erro = str(e)
    return c["id"], "erro: " + erro
pasta, cenas = sys.argv[1], json.load(open(sys.argv[2], encoding="utf-8"))
with ThreadPoolExecutor(4) as ex:
    for i, st in ex.map(lambda c: gerar(c, pasta), cenas):
        print(i, st)
