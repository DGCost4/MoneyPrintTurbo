# Estilo dos Shorts — Salmo e Pimenta

Padrão oficial de todos os Shorts do canal. Referência viva: **Davi e Golias**
(`automacao/tipografia/davi_golias/`, agendado para 13/11/2026). Na dúvida, copie o que ele faz.

> Shorts = **reflexão** tirada de uma história ou versículo, com **gancho viral**, palavras
> caindo (tipografia cinética) sobre **gravuras Ukiyo-e animadas**.
> Vídeos longos são outra coisa: a **história narrada** com muitas imagens, trilha e efeitos,
> e palavras animadas só nos momentos-chave.

## 1. Roteiro

- **Não reconta a história: tira uma reflexão dela** e aplica à vida de quem assiste ("você").
- **Duração:** 35–50 s de narração (máx. 60 s). Frases curtas, uma ideia por frase.
- **Estrutura:**
  1. **Gancho (0–3 s):** contraria o esperado, abre uma pergunta que o vídeo responde.
     Ex.: "Davi não venceu Golias porque era corajoso." Escolher com a skill
     `social-media-skills:hook-writer` (gerar 5+ ganchos com mecanismos diferentes, pontuar,
     ficar com o que passa em *Verdade* e *Puxada*). Nunca isca que o vídeo não paga.
  2. **Tensão:** o problema visto pelo jeito comum ("40 dias… grande demais").
  3. **Virada:** o que a Bíblia mostra de diferente ("ele não mediu o gigante, mediu Deus").
  4. **Aplicação:** o "gigante" de quem assiste, com nomes concretos (dívida, diagnóstico,
     ansiedade, porta fechada).
  5. **Fecho + verso:** a frase-tese (ex.: "a batalha é do Senhor") e uma ordem curta
     ("Para de medir o gigante. Mede quem luta por você.").
  6. **Chamada para comentar** que gere conversa ("Comenta o nome do seu gigante, que a gente
     ora junto."), não só "se inscreve".
- **Fidelidade bíblica:** fatos conferidos no texto; falas e versos em **paráfrase**, com a
  referência (livro cap:vers) na tela e na descrição. Nunca inventar citação.
- Roteiro vai para aprovação do usuário **antes** de produzir.

## 2. Visual

### Fundo: gravuras Ukiyo-e animadas (estilo 08 do lemo-opuscar)
- **6–8 gravuras**, uma por bloco do roteiro, desenhadas em código pelo motor
  `automacao/shorts/ukiyoe/gravura.js` (papel washi, um bloco por cor com veio de madeira,
  baren e pontinhos, cores levemente fora de registro, bokashi por pixel, linha-chave talhada,
  faixas de névoa, borda de tinta). Cenas em `automacao/shorts/<tema>/` +
  `ukiyoe/cenas_<tema>.js`.
- **Pigmentos:** azul-prússia dominante (céu e água), ocre/palha, verdes, sumi; **vermelho
  raro** (sol, faixa do protagonista). Papel é o branco. Roupas bíblicas, nunca samurai.
- **Prancha de revisão** (`prancha.py`) com todas as gravuras + a fala de cada uma vai para
  aprovação **antes** do motion.
- **Motion do fundo:** troca de cena como **pergaminho deslizando** da direita para a esquerda
  (0,55 s, com faixa de montagem `#c9b690`) uns 0,3 s antes da fala; **zoom lento** em cada
  folha; uma ou duas ações por cena (névoa que corre, estrelas piscando, chuva e relâmpago,
  água correndo, poeira, sol pulsando). Natureza a **8/12 fps**, câmera contínua.
  **"Punch"** de zoom nas batidas fortes. Fundo escurecido (~50% no meio) para o texto ler.

### Tipografia cinética (motor `automacao/tipografia/motor.js`)
- Fonte do canal: **Be Vietnam Pro Bold**, caixa alta, branco com sombra escura.
- **Uma única palavra em vermelho pimenta** (`#FF2A1A`) no vídeo inteiro: a palavra-tese
  (ex.: SENHOR).
- Entradas `power4.out`, saídas `expo.out`. Cada palavra **cai na sílaba falada**
  (sincronizada pelos tempos da narração).
- **Primeiro quadro já mostra o gancho em letra grande** (vira thumbnail e funciona no mudo).
- Repertório de efeitos físicos (usar os que o roteiro pedir):
  - palavra pesada que cai com tremor, poeira e onda de choque;
  - palavra que **se estilhaça** quando é negada (CORAJOSO, ARMADURA);
  - palavra que vira **máscara** e revela a próxima (GIGANTE → DEUS);
  - palavra que **se parte em duas** e as metades deslizam;
  - frases pequenas em cliques rápidos; listas que se empilham (DÍVIDA / DIAGNÓSTICO …).
- Final: frase-tese segurada + chamada para comentar + **"LIVRO CAP:VERS · SALMO E PIMENTA"**.
- Glitch RGB, borrão de movimento e clarão só nos impactos; nada fica tremendo à toa.

## 3. Som
- **Voz:** ElevenLabs, **Will – Slow, Confident and Distant** (`IKpiSijWzlhOL6uX83EH`),
  `eleven_multilingual_v2`, velocidade **1.08**, com tempo por palavra
  (`automacao/tipografia/narrar.py`).
- **Trilha:** original, gerada no ElevenLabs Music (instrumental, sem voz), clima japonês:
  shakuhachi, shamisen, koto e taiko em batida de coração que cresce até ~75% e resolve
  calma. Duração = vídeo + 1 s. Mixada bem abaixo da voz (`--vol-musica 0.18`; a narração sempre na frente).
- **Efeitos** (`automacao/tipografia/sfx/`): impacto pesado/médio, clique, whoosh, racha,
  explosão de luz, corte, fechamento, braam, **taiko** nas batidas fortes e **pergaminho** em
  cada troca de cena.
- Volume final ≈ −14 a −16 LUFS, pico ≤ −1 dBFS.

## 4. Produção (receita)
```
# 1. narração com tempos por palavra
VEL=1.08 python3 automacao/tipografia/narrar.py automacao/tipografia/<tema> "<roteiro>"
# 2. trilha (ElevenLabs Music) → automacao/tipografia/<tema>/musica.mp3
# 3. gravuras → automacao/shorts/<tema>/imagens/ + prancha para aprovação
node automacao/shorts/ukiyoe/desenhar.js automacao/shorts/ukiyoe/cenas_<tema>.js automacao/shorts/<tema>/imagens
python3 automacao/shorts/ukiyoe/prancha.py automacao/shorts/<tema>/imagens automacao/shorts/<tema>/cenas.json automacao/shorts/<tema>/prancha.jpg
# 4. coreografia em automacao/tipografia/<tema>/coreografia.js (partir de davi_golias/)
# 5. render 1080x1920 30 fps + mixagem
cd automacao/tipografia && node renderizar.js <tema> --fps=30 --musica <tema>/musica.mp3 --vol-musica 0.18
ffmpeg -i <tema>/video.mp4 -c:v libx264 -preset slow -crf 23 -c:a copy -movflags +faststart <tema>/video_final.mp4
```

## 5. Aprovação e publicação
1. Roteiro aprovado → 2. prancha de gravuras aprovada → 3. vídeo mostrado com título,
   descrição e tags → 4. **só publica/agenda depois do "aprovado" explícito do usuário.**
- Publicação: YouTube do @salmoepimenta via Upload-Post, **agendado** (padrão 18h de
  Brasília = 21:00 UTC), `privacyStatus=public`, `containsSyntheticMedia=true`.
- **Título:** a frase do gancho, curta, + `#shorts`. **Descrição:** 2–3 linhas da reflexão,
  verso em paráfrase com referência, pergunta para comentar, "Siga o Salmo e Pimenta",
  hashtags `#shorts #fé #reflexão #Deus`. **Tags:** 8–10 (tema, livro e capítulo, fé…).
- Registrar no `automacao/historico.json` (formato `tipografia`, `agendado_para`,
  `upload_post_job_id`).
- Evitar produção em massa repetitiva (política de conteúdo inautêntico do YouTube): cada
  Short tem roteiro próprio e gravuras próprias.
