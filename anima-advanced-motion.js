'use strict';
// Move selection changes choreography only, not battle rules.
const ANIMA_MOVE_POSES=new WeakMap();
function animaMoveClip(m,mv){
 const r=animaRig(m.sp),n=mv.name||'',p=r[1],has=k=>mv.has&&mv.has(k);
 if(has('protect'))return'guard';if(has('heal')||!mv.pow&&has('mend'))return'recover';
 if(/ほうこう|さけび|いかく|うなり|おたけび/.test(n))return'roar';
 if(!mv.pow)return'cast';
 if(!mv.phys)return (/こうせん|せんこう|ビーム|レーザー|光線|とうけつこう|ひかり|ほうげき$/.test(n)||/ほう$/.test(n)&&!/かいほう$/.test(n))?'beam':/なみ|あらし|ばくはつ|はどう|ふぶき|いかり/.test(n)||mv.pow>=100?'pulse':'cast';
 if(/かみ|きば|がぶ|噛|牙/.test(n))return'bite';
 if(/しっぽ|おびれ|テール|尾/.test(n)&&(r[4]&4||[0,3,4,7,8].includes(p)))return'tailstrike';
 if(/つばさ|はね|ウイング|翼|羽/.test(n)&&(r[4]&1||[2,5].includes(p)))return'wingstrike';
 if(/つめ|きり|きる|やいば|れんざん|クロー|斬/.test(n))return'slash';
 if(/とび|はねる|おちる|跳|飛/.test(n))return'pounce';
 if(mv.prio||/とつげき|たいあたり|ぶつか|タックル|突進|いっせん/.test(n))return'dash';
 return p===3||p===4?'tailstrike':p===2||p===5?'wingstrike':p===1?'slash':p===0&&r[12]<100?'pounce':'attack';
}
function actorMotionForMove(m,mv){if(!m)return;const clip=animaMoveClip(m,mv);ANIMA_MOVE_POSES.set(m,{clip,at:G.t});startIndividualMotion(m,clip);}
function resumeActorMoveMotion(m){if(!m)return;const e=ANIMA_MOVE_POSES.get(m);if(e&&G.t-e.at<150)startIndividualMotion(m,e.clip);else startIndividualMotion(m,'attack');}
const ANIMA_TRAIL_CLIPS=['pounce','bite','slash','tailstrike','wingstrike','dash','beam','pulse','charge','dodge','roar','land','withdraw','recoil'];
function animaAdvancedFX(g,m,p,x,y,w,behind,al){
 const i=ANIMA_TRAIL_CLIPS.indexOf(p.clip);if(i<0||reducedFx()||w<22)return;
 const f=Math.max(0,Math.min(11,Math.floor(p.t*12))),sz=w*(i===6||i===7?1.22:1.02);
 if(behind!==[0,4,5,6,7,8,9,10,11,12].includes(i))return;
 g.save();g.globalAlpha=al*.76;
 if(p.direction===1){g.translate(x+w*.5,y+w*.55);g.scale(-1,1);drawCell(g,'mon/motion-v7/action-trails.svg',12,64,64,i*12+f,-sz*.5,-sz*.5,sz,sz);}
 else drawCell(g,'mon/motion-v7/action-trails.svg',12,64,64,i*12+f,x+w*.5-sz*.5,y+w*.55-sz*.5,sz,sz);
 g.restore();
}
const ANIMA_ATLAS_CACHE=new Map();
function animaBakedFrame(m,p,back,source){
 if(m.shiny||p.still)return null;
 const manifest=ANIMA_BAKED_MANIFEST,row=manifest.clips.indexOf(p.clip),entry=manifest.species[String(m.sp)];if(row<0||!entry)return null;
 const rear=source&&source._animaView==='rear',path=rear?entry.back:entry.front;if(!path)return null;
 let img=ANIMA_ATLAS_CACHE.get(path);if(!img){img=new Image();img.src=path;ANIMA_ATLAS_CACHE.set(path,img);while(ANIMA_ATLAS_CACHE.size>18)ANIMA_ATLAS_CACHE.delete(ANIMA_ATLAS_CACHE.keys().next().value);}
 if(!img.complete||!img.naturalWidth)return null;
 const n=manifest.size,pad=Math.ceil(n*.105),cell=n+2*pad,steps=manifest.frames,f=AnimaSpriteEngine.looped.has(p.clip)?Math.floor(((p.t%1+1)%1)*steps)%steps:Math.round(Math.max(0,Math.min(1,p.t))*(steps-1));
 if(img.naturalWidth!==cell*steps||img.naturalHeight!==cell*manifest.clips.length)return null;
 return{c:img,n,pad,flip:!!back&&!rear,rect:[f*cell,row*cell,cell,cell]};
}
