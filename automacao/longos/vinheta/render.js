const {chromium}=require("playwright"),{spawn,execFileSync}=require("child_process"),fs=require("fs"),path=require("path");
const A=__dirname,SFX=path.resolve(A,"../../tipografia/sfx"),FPS=30;
const quadros=process.argv[2];
(async()=>{const b=await chromium.launch({args:["--allow-file-access-from-files"]});const p=await b.newPage({viewport:{width:1920,height:1080}});
p.on("pageerror",e=>console.error(e));await p.goto("file://"+path.join(A,"vinheta.html"));await p.waitForFunction(()=>window.READY);
const dur=await p.evaluate(()=>DURATION),ev=await p.evaluate(()=>SFX);
const grab=f=>p.evaluate(t=>{seek(t);return document.getElementById("c").toDataURL("image/png")},f/FPS);
if(quadros){for(const f of quadros.split(",").map(Number))fs.writeFileSync(path.join(A,`q${f}.png`),Buffer.from((await grab(f)).split(",")[1],"base64"));return b.close();}
const ff=spawn("ffmpeg",["-y","-loglevel","error","-f","image2pipe","-framerate",""+FPS,"-c:v","png","-i","-","-c:v","libx264","-crf","17","-pix_fmt","yuv420p",path.join(A,"_v.mp4")],{stdio:["pipe","inherit","inherit"]});
for(let f=0;f<Math.round(dur*FPS);f++){const buf=Buffer.from((await grab(f)).split(",")[1],"base64");if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once("drain",r));}
ff.stdin.end();await new Promise(r=>ff.on("close",r));await b.close();
const ent=[],fil=[],lab=[];ev.forEach((e,k)=>{const[n,m]=e.nome.split("@");const arq=path.join(SFX,n+".mp3");
 let off=0;if(m==="pico"){const raw=execFileSync("ffmpeg",["-v","error","-i",arq,"-ac","1","-ar","8000","-f","s16le","-"]);let mx=0,im=0;for(let i=0;i<raw.length/2;i++){const v=Math.abs(raw.readInt16LE(i*2));if(v>mx){mx=v;im=i}}off=im/8000;}
 ent.push("-i",arq);const ms=Math.max(0,Math.round((e.t-off)*1000));fil.push(`[${k+1}:a]aresample=48000,volume=${e.ganho},adelay=${ms}|${ms}[s${k}]`);lab.push(`[s${k}]`);});
fil.push(`${lab.join("")}amix=inputs=${lab.length}:normalize=0,atrim=0:${dur},afade=t=out:st=${(dur-0.4).toFixed(2)}:d=0.4,alimiter=limit=0.89,loudnorm=I=-14:TP=-1[a]`);
execFileSync("ffmpeg",["-y","-loglevel","error","-i",path.join(A,"_v.mp4"),...ent,"-filter_complex",fil.join(";"),"-map","0:v","-map","[a]","-c:v","copy","-c:a","aac","-b:a","192k","-shortest",path.join(A,"vinheta.mp4")]);
console.log("ok");})();
