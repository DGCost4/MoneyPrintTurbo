"""
Automação do canal religioso: gera um vídeo e publica no YouTube.

Uso (a partir da raiz do projeto):
    .venv/bin/python automacao/canal.py --formato short
    .venv/bin/python automacao/canal.py --formato longo
    .venv/bin/python automacao/canal.py --formato short --nao-postar   # só gera
    .venv/bin/python automacao/canal.py --formato longo --privacidade private
    .venv/bin/python automacao/canal.py --formato short --tema "Tema avulso"

Fluxo:
  1. Escolhe o próximo tema ainda não usado (temas_shorts.txt / temas_longos.txt).
  2. Pede ao Gemini título, roteiro, descrição, tags e termos de busca de imagens.
  3. Chama o cli.py do MoneyPrinterTurbo para montar o vídeo (voz, legenda, música).
  4. Publica no YouTube via Upload-Post e registra no historico.json.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
from datetime import datetime

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(AQUI)
sys.path.insert(0, RAIZ)
os.chdir(RAIZ)

from loguru import logger  # noqa: E402

from app.services import llm  # noqa: E402
from app.services.upload_post import upload_post_service  # noqa: E402

HISTORICO = os.path.join(AQUI, "historico.json")
VOZ = "pt-BR-AntonioNeural-Male"
FONTE = "BeVietnamPro-Bold.ttf"

FORMATOS = {
    "short": {
        "temas": os.path.join(AQUI, "temas_shorts.txt"),
        "aspecto": "9:16",
        "duracao_clipe": "4",
        "velocidade_voz": "1.0",
        "posicao_legenda": "center",
        "tamanho_fonte": "60",
        "instrucoes": (
            "Escreva uma REFLEXÃO cristã curta para um YouTube Short de 45 a 55 segundos "
            "(entre 110 e 140 palavras). Comece com uma frase de impacto que prenda a "
            "atenção nos 3 primeiros segundos. Tom acolhedor, esperançoso e pessoal, "
            "falando diretamente com quem assiste (\"você\"). Termine com uma frase curta "
            "de encorajamento ou uma breve oração, e um convite simples para seguir o canal."
        ),
    },
    "longo": {
        "temas": os.path.join(AQUI, "temas_longos.txt"),
        "aspecto": "16:9",
        "duracao_clipe": "8",
        "velocidade_voz": "0.95",
        "posicao_legenda": "bottom",
        "tamanho_fonte": "48",
        "instrucoes": (
            "Escreva a narração de um vídeo longo para o YouTube contando esta HISTÓRIA "
            "BÍBLICA, com cerca de 8 a 10 minutos de fala (entre 1200 e 1500 palavras). "
            "Estrutura: (1) gancho inicial forte nos primeiros 15 segundos; (2) contexto "
            "histórico e quem são os personagens; (3) a história contada de forma "
            "envolvente e cronológica, como um narrador de documentário; (4) o que essa "
            "história ensina para a vida hoje; (5) encerramento com uma breve oração e um "
            "convite para se inscrever e comentar. Seja fiel ao texto bíblico: não invente "
            "fatos, nomes ou diálogos que não estão na Bíblia."
        ),
    },
}

REGRAS_GERAIS = """
Regras obrigatórias:
- Escreva em português do Brasil, linguagem simples e respeitosa, sem denominação específica.
- O roteiro será lido em voz alta por um narrador masculino: apenas o texto falado,
  sem títulos, marcações de cena, emojis, asteriscos, listas ou indicações como "[música]".
- NÃO cite versículos palavra por palavra e NÃO invente citações. Quando mencionar a
  Bíblia, cite apenas a referência (ex.: "como está em João 3:16") e parafraseie o sentido.
- Não faça promessas de cura, riqueza ou milagres garantidos.

Responda EXATAMENTE neste formato, com as marcações:
<TITULO>título chamativo para o YouTube, até 90 caracteres, sem clickbait enganoso</TITULO>
<ROTEIRO>texto completo da narração</ROTEIRO>
<DESCRICAO>descrição do vídeo em 3 a 6 linhas, incluindo as referências bíblicas usadas</DESCRICAO>
<TAGS>8 a 12 palavras-chave separadas por vírgula</TAGS>
<TERMOS>8 a 12 termos de busca EM INGLÊS para vídeos de banco de imagens (Pexels) que
combinem com o roteiro, visuais e respeitosos, sem pessoas famosas, separados por vírgula.
Exemplos: sunrise over mountains, ancient desert, candle light, open bible, wheat field,
stormy sea, shepherd with sheep, light through clouds</TERMOS>
"""


def carregar_historico() -> list[dict]:
    if not os.path.exists(HISTORICO):
        return []
    with open(HISTORICO, encoding="utf-8") as f:
        return json.load(f)


def salvar_historico(historico: list[dict]) -> None:
    with open(HISTORICO, "w", encoding="utf-8") as f:
        json.dump(historico, f, ensure_ascii=False, indent=2)


def proximo_tema(formato: str, historico: list[dict]) -> str:
    usados = {h["tema"] for h in historico if h["formato"] == formato and h.get("publicado")}
    with open(FORMATOS[formato]["temas"], encoding="utf-8") as f:
        temas = [l.strip() for l in f if l.strip() and not l.startswith("#")]
    for tema in temas:
        if tema not in usados:
            return tema
    raise SystemExit(
        f"Todos os temas de '{formato}' já foram usados. "
        f"Adicione novos temas em {FORMATOS[formato]['temas']}."
    )


def _campo(texto: str, nome: str) -> str:
    m = re.search(rf"<{nome}>(.*?)</{nome}>", texto, re.DOTALL | re.IGNORECASE)
    return m.group(1).strip() if m else ""


def gerar_conteudo(formato: str, tema: str) -> dict:
    prompt = (
        f"Você é roteirista de um canal cristão brasileiro no YouTube.\n\n"
        f"Tema: {tema}\n\n{FORMATOS[formato]['instrucoes']}\n{REGRAS_GERAIS}"
    )
    for tentativa in range(3):
        resposta = llm._generate_response(prompt=prompt)
        if resposta.startswith("Error:"):
            raise RuntimeError(f"Falha ao chamar a IA: {resposta}")
        conteudo = {
            "titulo": _campo(resposta, "TITULO"),
            "roteiro": _campo(resposta, "ROTEIRO"),
            "descricao": _campo(resposta, "DESCRICAO"),
            "tags": [t.strip() for t in _campo(resposta, "TAGS").split(",") if t.strip()],
            "termos": [t.strip() for t in _campo(resposta, "TERMOS").split(",") if t.strip()],
        }
        minimo = 80 if formato == "short" else 700
        if conteudo["titulo"] and len(conteudo["roteiro"].split()) >= minimo and conteudo["termos"]:
            return conteudo
        logger.warning(f"Resposta incompleta da IA (tentativa {tentativa + 1}), tentando de novo...")
    raise RuntimeError("A IA não retornou um roteiro válido após 3 tentativas.")


def montar_video(formato: str, tema: str, conteudo: dict) -> str:
    cfg = FORMATOS[formato]
    cmd = [
        sys.executable, "cli.py",
        "--video-subject", tema,
        "--video-script", conteudo["roteiro"],
        "--video-terms", ",".join(conteudo["termos"]),
        "--video-language", "pt-BR",
        "--video-source", "pexels",
        "--video-aspect", cfg["aspecto"],
        "--video-clip-duration", cfg["duracao_clipe"],
        "--video-transition-mode", "fade-in",
        "--voice-name", VOZ,
        "--voice-rate", cfg["velocidade_voz"],
        "--bgm-type", "random",
        "--bgm-volume", "0.15",
        "--font-name", FONTE,
        "--font-size", cfg["tamanho_fonte"],
        "--subtitle-position", cfg["posicao_legenda"],
    ]
    logger.info(f"Montando vídeo '{formato}' sobre: {tema}")
    proc = subprocess.run(cmd, cwd=RAIZ, capture_output=True, text=True)
    if proc.returncode != 0:
        logger.error(proc.stderr[-4000:])
        raise RuntimeError(f"Falha ao montar o vídeo (código {proc.returncode}).")
    ultima_linha = [l for l in proc.stdout.splitlines() if l.strip()][-1]
    resultado = json.loads(ultima_linha)["result"]
    return resultado["videos"][0]


def publicar(formato: str, conteudo: dict, video: str, privacidade: str) -> dict:
    titulo = conteudo["titulo"][:100]
    descricao = conteudo["descricao"]
    tags = conteudo["tags"]
    if formato == "short":
        if "#shorts" not in titulo.lower():
            titulo = (titulo[:92] + " #shorts").strip()
        descricao += "\n\n#shorts #fé #reflexão #Deus"
    else:
        descricao += "\n\n#históriasbíblicas #Bíblia #fé #Deus"
    return upload_post_service.upload_video(
        video_path=video,
        title=titulo,
        platforms=["youtube"],
        youtube_extra={
            "youtube_title": titulo,
            "youtube_description": descricao,
            "tags": tags,
            "privacyStatus": privacidade,
        },
    )


def main() -> int:
    p = argparse.ArgumentParser(description="Gera e publica um vídeo do canal religioso.")
    p.add_argument("--formato", choices=["short", "longo"], required=True)
    p.add_argument("--tema", help="tema avulso (ignora a lista de temas)")
    p.add_argument("--nao-postar", action="store_true", help="só gera o vídeo, sem publicar")
    p.add_argument("--privacidade", choices=["public", "unlisted", "private"], default="public")
    args = p.parse_args()

    historico = carregar_historico()
    tema = args.tema or proximo_tema(args.formato, historico)
    logger.info(f"Formato: {args.formato} | Tema: {tema}")

    conteudo = gerar_conteudo(args.formato, tema)
    video = montar_video(args.formato, tema, conteudo)
    logger.success(f"Vídeo pronto: {video}")

    registro = {
        "data": datetime.now().isoformat(timespec="seconds"),
        "formato": args.formato,
        "tema": tema,
        "titulo": conteudo["titulo"],
        "video": video,
        "publicado": False,
    }

    if args.nao_postar:
        logger.info("Opção --nao-postar ativa: vídeo não foi publicado.")
    elif not upload_post_service.is_configured():
        logger.warning("Upload-Post não configurado no config.toml: vídeo não foi publicado.")
    else:
        resultado = publicar(args.formato, conteudo, video, args.privacidade)
        registro["publicado"] = bool(resultado.get("success"))
        registro["resposta_upload"] = resultado
        if not registro["publicado"]:
            logger.error(f"Falha ao publicar: {resultado}")

    historico.append(registro)
    salvar_historico(historico)
    with open(os.path.splitext(video)[0] + "-roteiro.txt", "w", encoding="utf-8") as f:
        f.write(f"{conteudo['titulo']}\n\n{conteudo['roteiro']}\n\n---\n{conteudo['descricao']}\n")
    return 0 if (registro["publicado"] or args.nao_postar) else 1


if __name__ == "__main__":
    raise SystemExit(main())
