#!/usr/bin/env bash
# Prepara o projeto numa máquina nova: cria o config.toml do canal e instala as dependências.
# Não contém chaves: Gemini, Upload-Post, Coverr e ElevenLabs são injetadas pelo
# proxy do ambiente (no config.toml fica só um valor de marcação).
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -f config.toml ]; then
  cp config.example.toml config.toml
  sed -i \
    -e 's/^video_source = "pexels"/video_source = "coverr"/' \
    -e 's/^coverr_api_keys = \[\]/coverr_api_keys = ["chave-injetada-pelo-proxy"]/' \
    -e '/^\[elevenlabs\]/,/^\[/ s/^api_key = ""/api_key = "chave-injetada-pelo-proxy"/' \
    -e 's/^llm_provider = "moonshot"/llm_provider = "gemini"/' \
    -e 's/^gemini_api_key = ""/gemini_api_key = "chave-injetada-pelo-proxy"/' \
    -e 's/^gemini_model_name = ""/gemini_model_name = "gemini-3.5-flash"/' \
    -e 's/^upload_post_enabled = false/upload_post_enabled = true/' \
    -e 's/^upload_post_api_key = ""/upload_post_api_key = "chave-injetada-pelo-proxy"/' \
    -e 's/^upload_post_username = ""/upload_post_username = "default"/' \
    -e 's/^upload_post_platforms = \["tiktok", "instagram"\]/upload_post_platforms = ["youtube"]/' \
    config.toml
fi

export PATH="$HOME/.local/bin:$PATH"
command -v uv >/dev/null || pip install -q uv
[ -x .venv/bin/python ] || uv venv -q --python 3.11 .venv
uv pip install -q --python .venv/bin/python -r requirements.txt
echo "Projeto pronto."
