"""
Automação do canal religioso: gera um vídeo e, só depois de aprovado, publica no YouTube.

Uso (a partir da raiz do projeto):
    # 1) Gera o vídeo e deixa aguardando aprovação (NÃO publica):
    .venv/bin/python automacao/canal.py --formato short
    .venv/bin/python automacao/canal.py --formato longo
    .venv/bin/python automacao/canal.py --formato short --tema "Tema avulso"

    # 2) Depois que o vídeo foi assistido e aprovado, publica o último pendente:
    .venv/bin/python automacao/canal.py --publicar
    .venv/bin/python automacao/canal.py --publicar --privacidade private

Fluxo:
  1. Escolhe o próximo tema ainda não publicado (temas_shorts.txt / temas_longos.txt).
  2. Pede ao Gemini título, roteiro, descrição, tags e termos de busca de imagens.
  3. Chama o cli.py do MoneyPrinterTurbo para montar o vídeo (voz, legenda, música).
  4. Registra no historico.json com status "aguardando_aprovacao".
  5. Com --publicar, envia o vídeo pendente ao YouTube via Upload-Post.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import time
from datetime import datetime

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(AQUI)
sys.path.insert(0, RAIZ)
os.chdir(RAIZ)

from loguru import logger  # noqa: E402

from app.config import config  # noqa: E402
from app.services import llm  # noqa: E402
from app.services.upload_post import upload_post_service  # noqa: E402

HISTORICO = os.path.join(AQUI, "historico.json")
VOZ = "elevenlabs:nPczCjzI2devNBz1zQrb:Brian"
FONTE = "BeVietnamPro-Bold.ttf"
NOME_CANAL = "Salmo e Pimenta"
# Modelos de texto do Gemini, em ordem de preferência (usa o próximo se um estiver sobrecarregado).
MODELOS_GEMINI = ["gemini-3.5-flash", "gemini-3-flash-preview", "gemini-3.5-flash-lite", "gemini-flash-lite-latest"]

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
<TERMOS>8 a 12 termos de busca EM INGLÊS para vídeos de banco de imagens (Pixabay) que
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
        f"Você é roteirista do canal cristão brasileiro \"{NOME_CANAL}\" no YouTube. "
        f"Ao convidar para se inscrever, cite o nome do canal.\n\n"
        f"Tema: {tema}\n\n{FORMATOS[formato]['instrucoes']}\n{REGRAS_GERAIS}"
    )
    tentativas = len(MODELOS_GEMINI) * 2
    for tentativa in range(tentativas):
        # Alterna entre modelos: quando um está sobrecarregado, usa o próximo.
        modelo = MODELOS_GEMINI[tentativa % len(MODELOS_GEMINI)]
        app_config = dict(config.app)
        app_config["gemini_model_name"] = modelo
        resposta = llm._generate_response(prompt=prompt, app_config=app_config)
        if resposta.startswith("Error:"):
            temporario = any(c in resposta for c in ("500", "502", "503", "429", "UNAVAILABLE", "RESOURCE_EXHAUSTED", "Bad Gateway"))
            if temporario and tentativa < tentativas - 1:
                logger.warning(f"Modelo {modelo} sobrecarregado, tentando outro...")
                time.sleep(10)
                continue
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
    raise RuntimeError(f"A IA não retornou um roteiro válido após {tentativas} tentativas.")


def montar_video(formato: str, tema: str, conteudo: dict) -> str:
    cfg = FORMATOS[formato]
    cmd = [
        sys.executable, "cli.py",
        "--video-subject", tema,
        "--video-script", conteudo["roteiro"],
        "--video-terms", ",".join(conteudo["termos"]),
        "--video-language", "pt-BR",
        "--video-source", "coverr",
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
        erros = [l for l in (proc.stdout + proc.stderr).splitlines() if "ERROR" in l or "Traceback" in l]
        logger.error("\n".join(erros[-20:]) or (proc.stdout + proc.stderr)[-4000:])
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


def gerar(formato: str, tema_avulso: str | None) -> int:
    historico = carregar_historico()
    tema = tema_avulso or proximo_tema(formato, historico)
    logger.info(f"Formato: {formato} | Tema: {tema}")

    conteudo = gerar_conteudo(formato, tema)
    video = montar_video(formato, tema, conteudo)

    historico.append({
        "data": datetime.now().isoformat(timespec="seconds"),
        "formato": formato,
        "tema": tema,
        "titulo": conteudo["titulo"],
        "roteiro": conteudo["roteiro"],
        "descricao": conteudo["descricao"],
        "tags": conteudo["tags"],
        "video": video,
        "status": "aguardando_aprovacao",
        "publicado": False,
    })
    salvar_historico(historico)
    with open(os.path.splitext(video)[0] + "-roteiro.txt", "w", encoding="utf-8") as f:
        f.write(f"{conteudo['titulo']}\n\n{conteudo['roteiro']}\n\n---\n{conteudo['descricao']}\n")
    logger.success(f"Vídeo pronto, AGUARDANDO APROVAÇÃO (não publicado): {video}")
    logger.info("Depois de aprovar, publique com: .venv/bin/python automacao/canal.py --publicar")
    return 0


def publicar_pendente(privacidade: str) -> int:
    historico = carregar_historico()
    pendentes = [h for h in historico if h.get("status") == "aguardando_aprovacao"]
    if not pendentes:
        logger.error("Nenhum vídeo aguardando aprovação. Gere um com --formato short|longo.")
        return 1
    registro = pendentes[-1]
    if not os.path.exists(registro["video"]):
        logger.error(f"Arquivo do vídeo não encontrado: {registro['video']}")
        return 1
    if not upload_post_service.is_configured():
        logger.error("Upload-Post não configurado no config.toml: vídeo não foi publicado.")
        return 1

    logger.info(f"Publicando ({privacidade}): {registro['titulo']}")
    resultado = publicar(registro["formato"], registro, registro["video"], privacidade)
    registro["publicado"] = bool(resultado.get("success"))
    registro["resposta_upload"] = resultado
    registro["privacidade"] = privacidade
    if registro["publicado"]:
        registro["status"] = "publicado"
        registro["data_publicacao"] = datetime.now().isoformat(timespec="seconds")
        logger.success("Vídeo publicado.")
    else:
        logger.error(f"Falha ao publicar: {resultado}")
    salvar_historico(historico)
    return 0 if registro["publicado"] else 1


def main() -> int:
    p = argparse.ArgumentParser(
        description="Gera um vídeo do canal religioso (aguardando aprovação) ou publica o vídeo aprovado."
    )
    p.add_argument("--formato", choices=["short", "longo"], help="gera um vídeo novo deste formato")
    p.add_argument("--tema", help="tema avulso (ignora a lista de temas)")
    p.add_argument("--publicar", action="store_true",
                   help="publica o último vídeo aguardando aprovação (só depois de aprovado!)")
    p.add_argument("--privacidade", choices=["public", "unlisted", "private"], default="public")
    p.add_argument("--nao-postar", action="store_true", help=argparse.SUPPRESS)  # compatibilidade
    args = p.parse_args()

    if args.publicar:
        return publicar_pendente(args.privacidade)
    if not args.formato:
        p.error("informe --formato short|longo para gerar, ou --publicar para publicar o aprovado")
    return gerar(args.formato, args.tema)


if __name__ == "__main__":
    raise SystemExit(main())
