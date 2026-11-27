'use strict';
// Every original species has nine independent data-backed motion timelines.
const INDIVIDUAL_MOTION_EVENTS=new WeakMap();
function motionProfile(id){return SORANE_MOTION_DATA[id-1]||SORANE_MOTION_DATA[0];}
function motionClipIndex(name){const i=SORANE_MOTION_CLIPS.indexOf(name);return i<0?0:i;}
function startIndividualMotion(m,clip){if(!m||!m.sp)return;INDIVIDUAL_MOTION_EVENTS.set(m,{clip,start:G.t});}
function motionSample(id,clip,frame,loop=false){
 const p=motionProfile(id),i=motionClipIndex(clip),duration=p[10][i],frames=p[11][i],t=loop?((frame%duration)+duration)%duration/duration:clamp(frame/duration,0,1),z=t*(frames.length-1),a=Math.min(frames.length-2,Math.floor(z)),v=z-a,e=v*v*(3-2*v);
 const q=frames[a].map((x,j)=>x+(frames[a+1][j]-x)*e);
 return {dx:q[0]/100,dy:q[1]/100,sx:1+q[2]/1000,sy:1+q[3]/1000,lean:q[4]/1000,warp:q[5]/100,t,profile:p};
}
function resolveIndividualMotion(m,preferred){
 if(reducedFx()||m.st==='frz')return{dx:0,dy:0,sx:1,sy:1,lean:0,warp:0,t:0,profile:motionProfile(m.sp)};
 const ev=INDIVIDUAL_MOTION_EVENTS.get(m),p=motionProfile(m.sp),age=ev?G.t-ev.start:0;
 if(ev&&age<=p[10][motionClipIndex(ev.clip)])return motionSample(m.sp,ev.clip,age);
 if(ev)INDIVIDUAL_MOTION_EVENTS.delete(m);
 const name=m.st==='slp'?'sleep':preferred||'idle';
 return motionSample(m.sp,name,G.t+p[6],true);
}
function drawIndividualMotion(g,m,c,x,y,w,al=1,sx=0,lit=0,back=false,preferred=null){
 if(!c||!c.width||!c.height)return;const p=resolveIndividualMotion(m,preferred),s=w/32,dir=back?1:-1,px=dir*p.dx*s,py=p.dy*s;
 g.save();g.translate(x+w/2+px,y+w+py);g.transform(p.sx*(1+sx),0,p.lean*dir,p.sy*(1-sx),0,0);g.globalAlpha=al;
 const sourceW=c.width,sourceH=c.height,axis=p.profile[4],bands=Math.min(p.profile[5],typeof mobileMotionBands==='function'?mobileMotionBands():12);
 const draw=()=>{
   if(Math.abs(p.warp)<.03||bands<2||reducedFx()||sourceW<32||sourceH<32){g.drawImage(c,-w/2,-w,w,w);return;}
   for(let i=0;i<bands;i++){
    const u=(i+.5)/bands,phase=p.t*Math.PI*2+u*(p.profile[2]==='serpent'?5:3)+p.profile[6]*Math.PI/180;
    const wave=Math.sin(phase)*p.warp*s*(axis?Math.sin(Math.PI*u):(1-u));
    if(axis){const sw=sourceW/bands,dw=w/bands;g.drawImage(c,i*sw,0,sw,sourceH,-w/2+i*dw,-w+wave,dw+.25,w);}
    else{const sh=sourceH/bands,dh=w/bands;g.drawImage(c,0,i*sh,sourceW,sh,-w/2+wave*dir,-w+i*dh,w,dh+.3);}
   }
 };
 draw();if(lit>.05&&!reducedFx()){g.globalCompositeOperation='lighter';g.globalAlpha=Math.min(.7,lit)*al;draw();}
 g.restore();
}
const INDIVIDUAL_PREVIEWS=new Map();
function drawIndividualPreview(id,x,y,w){let m=INDIVIDUAL_PREVIEWS.get(id);if(!m){m={sp:id,shiny:false,st:null};INDIVIDUAL_PREVIEWS.set(id,m);if(INDIVIDUAL_PREVIEWS.size>20)INDIVIDUAL_PREVIEWS.delete(INDIVIDUAL_PREVIEWS.keys().next().value);}drawIndividualMotion(ctx,m,monCanvas(id,false,false),x,y,w,1,0,0,false,'idle');}
function enhancedSkillCue(A,T,mv,tier){
 if(reducedFx())return;const col=TCOL_RGB[Math.max(0,mv.type)]||'230,230,230';
 if(mv.pow===0){ring(A.x,A.y+9,col,{dr:1.4,w:1.5,life:13,max:13,flat:.48});return;}
 if(mv.phys){const ang=Math.atan2(T.y-A.y,T.x-A.x);slash(A.x+Math.cos(ang)*9,A.y+Math.sin(ang)*9,ang,14+tier*3,col,1.3,8);}
 else{ring(A.x,A.y,col,{dr:.8+tier*.22,w:1.1,life:13,max:13});for(let i=0;i<3+tier;i++){const a=i*6.28/(3+tier);P({s:'glow:'+col,x:A.x+Math.cos(a)*8,y:A.y+Math.sin(a)*8,vx:Math.cos(a)*.3,vy:Math.sin(a)*.3,r:1.8,life:12,add:true});}}
}
function enhancedImpact(T,mv,tier){
 if(reducedFx())return;const col=TCOL_RGB[Math.max(0,mv.type)]||'230,230,230';ring(T.x,T.y,col,{dr:2+tier*.35,w:1.2,life:13,max:13,flat:.72});
 if(tier>=2){for(let i=0;i<6;i++){const a=i*Math.PI/3+G.t*.02;P({s:'glow:'+col,x:T.x+Math.cos(a)*6,y:T.y+Math.sin(a)*6,vx:Math.cos(a)*2,vy:Math.sin(a)*2,r:2.1,life:13,add:true});}}
}
