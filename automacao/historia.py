"""
Gera um short de HISTÓRIA BÍBLICA no estilo ilustração animada (cenas desenhadas por código).

Uso (a partir da raiz do projeto):
    .venv/bin/python automacao/historia.py automacao/historias/jonas.json

O arquivo da história traz título, descrição, tags e a lista de segmentos
({"cena": nome_da_cena, "texto": narração}). As cenas disponíveis estão em
automacao/animacao/cenas.js.

Fluxo:
  1. Narração com a voz da ElevenLabs (com o tempo de cada palavra).
  2. Cada cena fica na tela enquanto o seu trecho é narrado (troca suave entre cenas).
  3. A animação é gravada quadro a quadro (Chromium) e recebe narração + música.
  4. Texto animado palavra por palavra por cima (automacao/motion.py).
  5. Registra no historico.json como "aguardando_aprovacao" (NÃO publica).
     Depois de aprovado: .venv/bin/python automacao/canal.py --publicar
"""
from __future__ import annotations

import json
import os
import random
import subprocess
import sys
import uuid
from datetime import datetime

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(AQUI)
sys.path.insert(0, RAIZ)
sys.path.insert(0, AQUI)
os.chdir(RAIZ)

from loguru import logger  # noqa: E402

import canal  # noqa: E402
import motion  # noqa: E402
from app.services import voice  # noqa: E402

FPS = 30
CAUDA = 1.2  # segundos de imagem depois da última palavra
ANTECIPA = 0.35  # a troca de cena começa um pouco antes da primeira palavra do trecho


def tempos_dos_segmentos(segmentos: list[dict], palavras: list[dict], duracao: float) -> list[dict]:
    contagens = [len(s["texto"].split()) for s in segmentos]
    if sum(contagens) == len(palavras):
        inicios, i = [], 0
        for c in contagens:
            inicios.append(palavras[i]["inicio"])
            i += c
    else:  # reserva: divide proporcionalmente ao tamanho do texto
        logger.warning("Contagem de palavras não bateu; dividindo as cenas pelo tamanho do texto.")
        total = sum(len(s["texto"]) for s in segmentos)
        inicios, acumulado = [], 0
        for s in segmentos:
            inicios.append(duracao * acumulado / total)
            acumulado += len(s["texto"])
    resultado = []
    for k, s in enumerate(segmentos):
        inicio = 0.0 if k == 0 else max(0.0, inicios[k] - ANTECIPA)
        fim = duracao if k == len(segmentos) - 1 else max(0.0, inicios[k + 1] - ANTECIPA)
        resultado.append({"cena": s["cena"], "inicio": round(inicio, 3), "fim": round(fim, 3)})
    return resultado


def executar(cmd: list[str]) -> None:
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0:
        raise RuntimeError(f"Falhou: {' '.join(cmd[:3])}...\n{(proc.stdout + proc.stderr)[-3000:]}")


def gerar(arquivo_historia: str) -> str:
    with open(arquivo_historia, encoding="utf-8") as f:
        historia = json.load(f)
    pasta = os.path.join(RAIZ, "storage", "tasks", f"historia-{uuid.uuid4().hex[:8]}")
    os.makedirs(pasta, exist_ok=True)
    texto = " ".join(s["texto"].strip() for s in historia["segmentos"])

    logger.info(f"História: {historia['titulo']} | narrando...")
    audio = os.path.join(pasta, "audio.mp3")
    if not voice.tts(texto, canal.VOZ, 1.0, audio):
        raise RuntimeError("Falha na narração.")
    arquivo_palavras = os.path.join(pasta, "audio.palavras.json")
    with open(arquivo_palavras, encoding="utf-8") as f:
        palavras = json.load(f)
    duracao = palavras[-1]["fim"] + CAUDA

    segmentos = tempos_dos_segmentos(historia["segmentos"], palavras, duracao)
    mudo = os.path.join(pasta, "animacao.mp4")
    config = {"segmentos": segmentos, "duracao": duracao, "fps": FPS, "saida": mudo}
    config_path = os.path.join(pasta, "render.json")
    with open(config_path, "w", encoding="utf-8") as f:
        json.dump(config, f, ensure_ascii=False, indent=1)
    logger.info(f"Gravando a animação ({duracao:.1f}s, {len(segmentos)} cenas)...")
    executar(["node", os.path.join(AQUI, "animacao", "render.js"), config_path])

    musicas = sorted(os.listdir(os.path.join(RAIZ, "resource", "songs")))
    musica = os.path.join(RAIZ, "resource", "songs", random.choice(musicas))
    com_audio = os.path.join(pasta, "com-audio.mp4")
    executar([
        "ffmpeg", "-y", "-loglevel", "error", "-i", mudo, "-i", audio, "-stream_loop", "-1", "-i", musica,
        "-filter_complex",
        f"[1:a]apad[n];[2:a]volume=0.15,afade=t=out:st={max(0, duracao - 2):.2f}:d=2[m];"
        "[n][m]amix=inputs=2:duration=first:normalize=0[a]",
        "-map", "0:v", "-map", "[a]", "-t", f"{duracao:.2f}", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", com_audio,
    ])

    logger.info("Aplicando texto animado...")
    final = os.path.join(pasta, "final-historia.mp4")
    motion.aplicar(com_audio, arquivo_palavras, historia["titulo"], final, 1080, 1920, duracao,
                   os.path.join(RAIZ, "resource", "fonts"), posicao_texto=0.8)

    historico = canal.carregar_historico()
    for h in historico:
        if h.get("status") == "aguardando_aprovacao":
            h["status"] = "substituido"
    historico.append({
        "data": datetime.now().isoformat(timespec="seconds"),
        "formato": "short",
        "tema": historia["titulo"],
        "estilo": "animacao",
        "titulo": historia["titulo"],
        "roteiro": texto,
        "descricao": historia["descricao"],
        "tags": historia["tags"],
        "video": final,
        "status": "aguardando_aprovacao",
        "publicado": False,
    })
    canal.salvar_historico(historico)
    logger.success(f"Vídeo pronto, AGUARDANDO APROVAÇÃO (não publicado): {final}")
    return final


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("Uso: .venv/bin/python automacao/historia.py automacao/historias/<historia>.json")
    gerar(sys.argv[1])
