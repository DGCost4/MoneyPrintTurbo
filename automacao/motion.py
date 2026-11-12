"""
Estilo "motion design" para os vídeos do canal: texto animado palavra por palavra.

Recebe o vídeo sem legenda e o arquivo com o tempo de cada palavra (audio.palavras.json,
gerado pela voz da ElevenLabs) e desenha por cima, com ffmpeg + libass:
  - abertura animada com o título e uma linha dourada que cresce;
  - frases curtas (até 3 palavras) no centro da tela;
  - cada palavra entra "crescendo" no momento em que é falada, destacada em dourado;
  - as palavras já faladas ficam brancas e as próximas ficam invisíveis (o texto não "pula").
"""
from __future__ import annotations

import json
import os
import re
import subprocess

FONTE_FAMILIA = "Be Vietnam Pro"
DOURADO = "&H0047C8FF&"  # ASS usa BGR: #FFC847
BRANCO = "&H00FFFFFF&"
MAX_PALAVRAS = 3
MAX_CARACTERES = 18
PAUSA_QUEBRA = 0.35  # silêncio (s) que força uma nova frase na tela


def _tempo(segundos: float) -> str:
    cs = max(0, int(round(segundos * 100)))
    h, cs = divmod(cs, 360000)
    m, cs = divmod(cs, 6000)
    s, cs = divmod(cs, 100)
    return f"{h}:{m:02d}:{s:02d}.{cs:02d}"


def _limpar(palavra: str) -> str:
    palavra = re.sub(r"^[\"'“”‘’(«]+|[\"'“”‘’)»,.;:…]+$", "", palavra)
    return palavra.replace("{", "").replace("}", "").replace("\\", "").upper()


def _agrupar(palavras: list[dict]) -> list[list[dict]]:
    grupos, atual = [], []
    for i, p in enumerate(palavras):
        atual.append(p)
        texto = " ".join(_limpar(x["palavra"]) for x in atual)
        fim_frase = bool(re.search(r"[,.;:!?…]$", p["palavra"]))
        pausa = i + 1 < len(palavras) and palavras[i + 1]["inicio"] - p["fim"] > PAUSA_QUEBRA
        proxima = _limpar(palavras[i + 1]["palavra"]) if i + 1 < len(palavras) else ""
        estoura = len(texto) + 1 + len(proxima) > MAX_CARACTERES
        if fim_frase or pausa or len(atual) >= MAX_PALAVRAS or estoura:
            grupos.append(atual)
            atual = []
    if atual:
        grupos.append(atual)
    return grupos


def gerar_ass(palavras: list[dict], titulo: str, largura: int, altura: int, duracao: float,
              posicao_texto: float = 0.6) -> str:
    tam = round(altura * 0.055)  # ~105 px em 1920
    tam_titulo = round(altura * 0.04)
    cab = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {largura}
PlayResY: {altura}
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Palavra,{FONTE_FAMILIA},{tam},{BRANCO},{BRANCO},&H00000000,&H64000000,-1,0,0,0,100,100,0,0,1,6,3,5,60,60,0,1
Style: Titulo,{FONTE_FAMILIA},{tam_titulo},{BRANCO},{BRANCO},&H00000000,&H64000000,-1,0,0,0,100,100,1,0,1,5,2,5,80,80,0,1
Style: Linha,{FONTE_FAMILIA},10,{DOURADO},{DOURADO},&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,7,0,0,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    eventos = []
    cx, cy = largura // 2, round(altura * posicao_texto)

    # Abertura: título com fade + leve crescimento, e uma linha dourada que se abre.
    if titulo:
        ty = round(altura * 0.3)
        fim_titulo = min(3.0, duracao)
        texto_titulo = titulo.replace("{", "").replace("}", "").upper()
        eventos.append(
            f"Dialogue: 2,{_tempo(0)},{_tempo(fim_titulo)},Titulo,,0,0,0,,"
            f"{{\\pos({cx},{ty})\\fad(300,400)\\fscx85\\fscy85\\t(0,500,\\fscx100\\fscy100)}}{texto_titulo}"
        )
        larg_linha = round(largura * 0.35)
        ly = ty + round(tam_titulo * 1.6)
        eventos.append(
            f"Dialogue: 2,{_tempo(0.2)},{_tempo(fim_titulo)},Linha,,0,0,0,,"
            f"{{\\an5\\pos({cx},{ly})\\fad(0,400)\\fscx0\\t(0,600,\\fscx100)\\p1}}"
            f"m 0 0 l {larg_linha} 0 {larg_linha} 8 0 8{{\\p0}}"
        )

    grupos = _agrupar(palavras)
    for g, grupo in enumerate(grupos):
        inicio_prox = grupos[g + 1][0]["inicio"] if g + 1 < len(grupos) else duracao
        fim_grupo = min(grupo[-1]["fim"] + 0.6, inicio_prox)
        for k, p in enumerate(grupo):
            ini = p["inicio"]
            fim = grupo[k + 1]["inicio"] if k + 1 < len(grupo) else fim_grupo
            if fim <= ini:
                continue
            partes = []
            for j, q in enumerate(grupo):
                w = _limpar(q["palavra"])
                if j < k:
                    partes.append(f"{{\\alpha&H00&\\c{BRANCO}\\fscx100\\fscy100}}{w}")
                elif j == k:
                    partes.append(
                        f"{{\\alpha&H00&\\c{DOURADO}\\fscx60\\fscy60\\t(0,140,\\fscx112\\fscy112)"
                        f"\\t(140,240,\\fscx100\\fscy100)}}{w}"
                    )
                else:
                    partes.append(f"{{\\alpha&HFF&}}{w}")
            # A frase sobe levemente quando aparece pela primeira vez.
            movimento = (
                f"\\move({cx},{cy + 40},{cx},{cy},0,180)" if k == 0 else f"\\pos({cx},{cy})"
            )
            eventos.append(
                f"Dialogue: 1,{_tempo(ini)},{_tempo(fim)},Palavra,,0,0,0,,{{{movimento}}}" + " ".join(partes)
            )
    return cab + "\n".join(eventos) + "\n"


def aplicar(video_entrada: str, palavras_json: str, titulo: str, video_saida: str,
            largura: int, altura: int, duracao: float, pasta_fontes: str, ffmpeg: str = "ffmpeg",
            posicao_texto: float = 0.6) -> str:
    with open(palavras_json, encoding="utf-8") as f:
        palavras = json.load(f)
    ass_path = os.path.splitext(video_saida)[0] + ".ass"
    with open(ass_path, "w", encoding="utf-8") as f:
        f.write(gerar_ass(palavras, titulo, largura, altura, duracao, posicao_texto))

    def esc(caminho: str) -> str:
        return caminho.replace("\\", "/").replace(":", "\\:").replace("'", "\\'")

    filtro = f"ass='{esc(ass_path)}':fontsdir='{esc(pasta_fontes)}'"
    cmd = [ffmpeg, "-y", "-loglevel", "error", "-i", video_entrada, "-vf", filtro,
           "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
           "-c:a", "copy", "-movflags", "+faststart", video_saida]
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0:
        raise RuntimeError(f"ffmpeg falhou ao aplicar o texto animado: {proc.stderr[-2000:]}")
    return video_saida
