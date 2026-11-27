'use strict';
// Observation room and transparent sprite-sheet export for every discovered Anima.
function animaLabDraw(m,back){
 screenBG('動きの 観察室　No.'+String(m.sp).padStart(4,'0'));
 const clip=m.previewClip||'idle',i=AnimaSpriteEngine.clips.indexOf(clip),p=animaRig(m.sp),name=SP[m.sp].name;
 win(4,18,232,133,'#e8f0f8');
 ctx.save();ctx.beginPath();ctx.rect(6,20,228,129);ctx.clip();
 const gradient=ctx.createLinearGradient(0,20,0,148);gradient.addColorStop(0,'#dce9ee');gradient.addColorStop(1,'#f6eee0');ctx.fillStyle=gradient;ctx.fillRect(6,20,228,129);
 ctx.strokeStyle='rgba(54,85,93,.13)';ctx.lineWidth=.5;for(let j=0;j<6;j++){ctx.beginPath();ctx.moveTo(6,29+j*19);ctx.lineTo(234,29+j*19);ctx.stroke();}
 ctx.fillStyle='rgba(36,59,69,.18)';ctx.beginPath();ctx.ellipse(120,132,36,7,0,0,6.3);ctx.fill();
 const c=back&&monBackCv(m.sp,m.shiny)||monCanvas(m.sp,m.shiny,back,false);
 drawIndividualMotion(ctx,m,c,71,28,98,1,0,0,back,null);ctx.restore();
 tx(name,11,24,'#28414c',11);SP[m.sp].types.forEach((t,j)=>typeTag(t,212-j*16,24));
 tx(back?(MONBACK[SP[m.sp].book]?'背面原画':'反転表示'):'正面',228,138,'#47606a',8,'right');
 win(4,153,232,51);tx(AnimaSpriteEngine.labels[i]+'　'+(i+1)+'/'+AnimaSpriteEngine.clips.length,120,159,'#254652',11,'center');
 tx('← → 動き　↑ ↓ 個体',120,175,'#405e65',8,'center');tx('A 再生　M 向き　B 戻る',120,189,'#405e65',8,'center');
}
function animaLabView(ids,index){
 return new Promise(res=>{let i=index,clip=0,back=false,m={sp:ids[i],shiny:false,st:null,previewClip:'idle',previewStart:G.t};
  function select(){m.sp=ids[i];m.previewClip=AnimaSpriteEngine.clips[clip];m.previewStart=G.t;monPreload(m.sp);}
  const w={type:'anima-motion-lab',key(k){
    if(k==='b'){popW(w);res(i);return;}
    if(k==='m')back=!back;else if(k==='a')m.previewStart=G.t;else if(k==='left')clip=(clip+AnimaSpriteEngine.clips.length-1)%AnimaSpriteEngine.clips.length;else if(k==='right')clip=(clip+1)%AnimaSpriteEngine.clips.length;else if(k==='up')i=(i+ids.length-1)%ids.length;else if(k==='down')i=(i+1)%ids.length;else return;select();sfx('sel');
   },tap(x,y){if(y>=153){if(y>=187){if(x<80)this.key('a');else if(x<160)this.key('m');else this.key('b');}else if(x<120)this.key('left');else this.key('right');}else this.key('a');return true;},draw(){animaLabDraw(m,back);}};
  select();UI.push(w);
 });
}
async function waitAnimaArtwork(id,back=false){
 const p=monPic(SP[id].book);if(p.st===0){try{await p.img.decode();if(p.img.naturalWidth)p.st=1;}catch(e){if(!p.img.naturalWidth)throw Error('artwork '+id);}}
 if(p.st!==1)throw Error('artwork '+id);
 if(back&&MONBACK[SP[id].book]){const q=pic(monAssetPath(SP[id].book,true));try{if(q.st!==1){await q.img.decode();if(q.img.naturalWidth)q.st=1;}}catch(e){}}
 return (back&&monBackCv(id,false))||monCanvas(id,false,back,false);
}
async function buildAnimaSheet(id,opts={}){
 const rig=animaRig(id),back=!!opts.back,source=await waitAnimaArtwork(id,back),n=opts.frames||8,clips=opts.clips||AnimaSpriteEngine.clips,cell=opts.cell||160,art=cell*.68;
 const sheet=document.createElement('canvas');sheet.width=cell*n;sheet.height=cell*clips.length;const g=sheet.getContext('2d');
 for(let row=0;row<clips.length;row++){
  const clip=clips[row];for(let col=0;col<n;col++){
   const phase=AnimaSpriteEngine.looped.has(clip)?col/n:col/(n-1),q=AnimaSpriteEngine.pose(rig,clip,phase);
   const f=AnimaSpriteEngine.getFrame(source,rig,clip,phase,{size:opts.size||144,steps:n,budget:8*1048576,mirror:back,allow:true}),margin=f.pad/f.n*art,dir=back?1:-1;
   g.save();g.beginPath();g.rect(col*cell,row*cell,cell,cell);g.clip();g.translate(col*cell+cell*.5+q.x*art/32*dir,row*cell+(cell+art)*.5+q.y*art/32);g.transform(q.sx,0,q.tilt*dir,q.sy,0,0);g.drawImage(f.c,-art/2-margin,-art-margin,art+2*margin,art+2*margin);g.restore();
  }
  if(opts.onProgress)opts.onProgress(row+1,clips.length);
  if(opts.yield!==false)await new Promise(r=>setTimeout(r,0));
 }return sheet;
}
async function downloadAnimaSheet(id,back){
 let progress=0,total=AnimaSpriteEngine.clips.length;
 const w=pushBG(()=>{screenBG('動きの 素材を つくる');win(20,65,200,74);tx(SP[id].name,120,77,'#28414c',11,'center');bar(32,108,176,7,progress/total,'#499b82');tx(progress+'/'+total+' 動作',120,120,'#405e65',8,'center');});
 try{
  const sheet=await buildAnimaSheet(id,{back,onProgress:(p,t)=>{progress=p;total=t;}});
  const blob=await new Promise(r=>sheet.toBlob(r,'image/png'));if(!blob)throw Error('PNG export');
  await showAnimaExport(blob,id,back);
 }catch(e){console.warn(e);await msg('素材を 作れなかった。もう一度 ためしてね。');}finally{popW(w);}
}
async function animaMotionLab(){
 const ids=Object.keys(S.seen).map(Number).filter(id=>id>0&&SP[id]).sort((a,b)=>a-b);if(!ids.length){await msg('まず アニマと 出会おう。');return;}
 let selected=0;
 for(;;){const i=await menu(['動きを 観察する','素材を PNGに 書き出す','もどる'],{x:14,y:44,w:212,title:'動きの 観察室',bg:()=>screenBG()});if(i<0||i===2)return;
  const j=await menu(ids.map(id=>({label:String(id).padStart(4,'0')+' '+SP[id].name,right:S.caught[id]?'●':'○'})),{x:4,y:4,w:232,rows:12,idx:selected,title:'アニマを 選ぶ',bg:()=>screenBG()});if(j<0)continue;selected=j;
  if(i===0)selected=await animaLabView(ids,j);else{const side=await menu(['正面','背面／反転'],{x:45,y:60,w:150,title:'素材の 向き'});if(side>=0)await downloadAnimaSheet(ids[j],side===1);}
 }
}

function showAnimaExport(blob,id,back){
 return new Promise(res=>{const el=document.getElementById('animaExport'),img=document.getElementById('animaExportImage'),link=document.getElementById('animaExportLink'),share=document.getElementById('animaExportShare'),close=document.getElementById('animaExportClose'),url=URL.createObjectURL(blob),name='anima-'+String(id).padStart(4,'0')+(back?'-reverse':'-front')+'-motion.png';
  document.getElementById('animaExportTitle').textContent=SP[id].name+'・アニメーション素材';
  img.src=url;link.href=url;link.download=name;let file=null;try{file=new File([blob],name,{type:'image/png'});}catch(e){}
  let canShare=false;try{canShare=!!(file&&navigator.canShare&&navigator.canShare({files:[file]}));}catch(e){}
  share.style.display=canShare?'':'none';share.onclick=async()=>{if(canShare){try{await navigator.share({files:[file],title:SP[id].name+'・アニメーション素材'});}catch(e){if(e.name!=='AbortError')console.warn(e);}}};
  el.style.display='flex';close.onclick=()=>{el.style.display='none';img.removeAttribute('src');link.removeAttribute('href');share.onclick=null;close.onclick=null;setTimeout(()=>URL.revokeObjectURL(url),30000);res();};close.focus();
 });
}

async function buildAnimaRuntimeAtlas(id,opts={}){
 const rig=animaRig(id),back=!!opts.back,n=opts.size||80,steps=opts.frames||6,clips=opts.clips||['idle','walk','run','attack','pounce','dash','cast','beam','hit','celebrate'];
 if(!Number.isInteger(n)||n<48||n>192||!Number.isInteger(steps)||steps<2||steps>16||!clips.length||clips.some(k=>!AnimaSpriteEngine.clips.includes(k)))throw Error('atlas options');
 const src=await waitAnimaArtwork(id,back),pad=Math.ceil(n*.105),cell=n+2*pad,sheet=document.createElement('canvas');
 sheet.width=steps*cell;sheet.height=clips.length*cell;const g=sheet.getContext('2d');
 for(let row=0;row<clips.length;row++){const clip=clips[row];for(let f=0;f<steps;f++){
   const phase=AnimaSpriteEngine.looped.has(clip)?f/steps:f/(steps-1);
   const im=AnimaSpriteEngine.getFrame(src,rig,clip,phase,{size:n,steps,budget:8*1048576,mirror:back,allow:true});
   if(!im||im.c.width!==cell||im.c.height!==cell)throw Error('frame geometry');
   g.drawImage(im.c,f*cell,row*cell);
 }if(opts.yield!==false)await new Promise(r=>setTimeout(r,0));}
 return sheet;
}
