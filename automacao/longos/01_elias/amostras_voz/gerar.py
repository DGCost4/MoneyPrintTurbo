import json,sys,urllib.request
VOZ="IKpiSijWzlhOL6uX83EH"
txt2="""No fim do dia, ele sentou debaixo de um zimbro, um arbusto baixo, que mal faz sombra. E pediu para morrer. Basta, Senhor. Tira a minha vida. Pensa no que isso significa. Poucos dias antes, ele tinha visto fogo descer do céu. E agora estava ali, sem forças nem para continuar querendo viver. E o que Deus fez? Não deu bronca. Não fez um sermão. Elias deitou e dormiu. E um anjo tocou nele e disse: levanta e come."""
txt3="""No fim do dia, ele sentou debaixo de um zimbro… um arbusto baixo, que mal faz sombra. [pause] E pediu para morrer. [sighs] [softly] Basta, Senhor. Tira a minha vida. [pause] Pensa no que isso significa. Poucos dias antes, ele tinha visto fogo descer do céu. E agora estava ali… sem forças nem para continuar querendo viver. [pause] E o que Deus fez? [gently] Não deu bronca. Não fez um sermão. Elias deitou e dormiu. [whispers] E um anjo tocou nele e disse: levanta… e come."""
def tts(nome,txt,modelo,vs):
    body=json.dumps({"text":txt,"model_id":modelo,"voice_settings":vs}).encode()
    r=urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{VOZ}?output_format=mp3_44100_128",data=body,headers={"Content-Type":"application/json","xi-api-key":"x"})
    d=urllib.request.urlopen(r,timeout=180).read(); open(nome,"wb").write(d); print(nome,len(d))
tts("A_voz_atual_v2.mp3",txt2,"eleven_multilingual_v2",{"stability":0.5,"similarity_boost":0.75,"style":0.0,"speed":1.0})
tts("B_voz_nova_v3.mp3",txt3,"eleven_v3",{"stability":0.5,"similarity_boost":0.75})
