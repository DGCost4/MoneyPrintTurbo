"""Monta a prancha de revisão com todas as gravuras e a fala de cada uma."""
import json, sys, os
from PIL import Image, ImageDraw, ImageFont
pasta, cenas_json, saida = sys.argv[1:4]
cenas = json.load(open(cenas_json, encoding="utf-8"))
F = "/home/user/MoneyPrintTurbo/resource/fonts/BeVietnamPro-Bold.ttf"
f1, f2 = ImageFont.truetype(F, 22), ImageFont.truetype(F, 34)
TW, TH, cols = 360, 640, 4
rows = (len(cenas) + cols - 1) // cols
S = Image.new("RGB", (cols * (TW + 20) + 20, 90 + rows * (TH + 140)), (24, 20, 18))
d = ImageDraw.Draw(S)
d.text((20, 26), sys.argv[4] if len(sys.argv) > 4 else "Gravuras de fundo (Ukiyo-e)", font=f2, fill=(238, 226, 198))
for i, c in enumerate(cenas):
    x, y = 20 + (i % cols) * (TW + 20), 90 + (i // cols) * (TH + 140)
    im = Image.open(os.path.join(pasta, c["id"] + ".png")).convert("RGB").resize((TW, TH), Image.LANCZOS)
    S.paste(im, (x, y))
    d.text((x, y + TH + 10), c["id"].replace("_", " ", 1), font=f1, fill=(232, 160, 138))
    words, line, ly = c["fala"].split(), "", y + TH + 40
    for w in words:
        if d.textlength(line + " " + w, font=f1) > TW: d.text((x, ly), line.strip(), font=f1, fill=(220, 214, 200)); ly += 28; line = ""
        line += " " + w
    d.text((x, ly), line.strip(), font=f1, fill=(220, 214, 200))
S.save(saida, quality=88)
