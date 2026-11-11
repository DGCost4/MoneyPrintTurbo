# Instruções para o Claude

## Idioma
- Sempre responda em português do Brasil, em todas as mensagens, explicações e perguntas ao usuário.
- Mensagens de commit, descrições de PR e comentários no código também devem ser em português, a menos que o usuário peça outro idioma.

## Aprovação obrigatória antes de publicar (canal "Salmo e Pimenta")
- NUNCA publique um vídeo sem a aprovação explícita do usuário nesta conversa.
- Fluxo obrigatório:
  1. Gere o vídeo SEM publicar: `.venv/bin/python automacao/canal.py --formato short` (ou `longo`).
     Esse comando só gera e deixa o vídeo com status `aguardando_aprovacao` no `automacao/historico.json`.
  2. Mostre o vídeo ao usuário aqui na conversa (envie o arquivo `.mp4` com a ferramenta de envio de arquivos),
     junto com o título, a descrição e as tags que serão usados.
  3. Só depois que o usuário disser claramente que aprova, publique:
     `.venv/bin/python automacao/canal.py --publicar` (acrescente `--privacidade private|unlisted` se pedido).
- Se o usuário pedir para "rodar", "gerar" ou "postar" um vídeo, isso NÃO conta como aprovação do vídeo:
  gere, mostre e espere a aprovação.
- Se o usuário pedir mudanças, gere de novo e mostre outra vez antes de publicar.
