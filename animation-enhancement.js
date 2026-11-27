'use strict';
// Every original species has nine independent data-backed motion timelines.
const INDIVIDUAL_MOTION_EVENTS=new WeakMap();
function motionProfile(id){return SORANE_MOTION_DATA[id-1]||SORANE_MOTION_DATA[0];}
function motionClipIndex(name){const i=SORANE_MOTION_CLIPS.indexOf(name);return i<0?0:i;}
function animaRig(id){return ANIMA_RIG_DATA[id-1]||ANIMA_RIG_DATA[0];}
function startIndividualMotion(m,clip){if(!m||!m.sp)return;INDIVIDUAL_MOTION_EVENTS.set(m,{clip:AnimaSpriteEngine.clips.includes(clip)?clip:'idle',start:G.t});}
function animaBattleActor(sd){if(!BT)return null;if(BT.double)return BT.pair&&BT.pair[sd]?BT.pair[sd].mon:null;return bmon(BT,sd);}

function motionSample(id,clip,frame,loop=false){
 const p=motionProfile(id),i=motionClipIndex(clip),duration=p[10][i],frames=p[11][i],t=loop?((frame%duration)+duration)%duration/duration:clamp(frame/duration,0,1),z=t*(frames.length-1),a=Math.min(frames.length-2,Math.floor(z)),v=z-a,e=v*v*(3-2*v);
 const q=frames[a].map((x,j)=>x+(frames[a+1][j]-x)*e);
 return {dx:q[0]/100,dy:q[1]/100,sx:1+q[2]/1000,sy:1+q[3]/1000,lean:q[4]/1000,warp:q[5]/100,t,profile:p};
}
function animaClipDuration(id,clip){const p=motionProfile(id),i=SORANE_MOTION_CLIPS.indexOf(clip);return AnimaSpriteEngine.duration(animaRig(id),clip,i>=0?p[10][i]:undefined);}
function resolveIndividualMotion(m,preferred){
 const profile=motionProfile(m.sp),rig=animaRig(m.sp);
 if(reducedFx())return{clip:'idle',t:0,rig,profile,dx:0,dy:0,sx:1,sy:1,lean:0,energy:0,still:true};
 if(m.st==='frz'&&!m.previewClip)return{clip:'status',t:0,rig,profile,dx:0,dy:0,sx:1,sy:1,lean:0,energy:.25,still:true};
 const ev=INDIVIDUAL_MOTION_EVENTS.get(m),age=ev?Math.max(0,G.t-ev.start):0;
 let clip=m.previewClip||preferred||'idle',phase;
 if(m.previewClip){const d=animaClipDuration(m.sp,clip);phase=AnimaSpriteEngine.looped.has(clip)?((G.t-(m.previewStart||0))%d+d)%d/d:Math.min(1,Math.max(0,G.t-(m.previewStart||0))/d);}
 else if(ev&&age<=animaClipDuration(m.sp,ev.clip)){clip=ev.clip;phase=age/animaClipDuration(m.sp,clip);}
 else{if(ev)INDIVIDUAL_MOTION_EVENTS.delete(m);if(m.st==='slp')clip='sleep';const d=animaClipDuration(m.sp,clip);phase=((G.t+rig[10])%d+d)%d/d;}
 const q=AnimaSpriteEngine.pose(rig,clip,phase);
 // Blend original species-specific root timeline lightly, retaining each ID's timing and personality.
 const i=SORANE_MOTION_CLIPS.indexOf(clip),old=i<0?null:motionSample(m.sp,clip,phase*profile[10][i]);
 return{clip,t:phase,rig,profile,dx:q.x+(old?old.dx*.24:0),dy:q.y+(old?old.dy*.22:0),sx:q.sx*(old?1+(old.sx-1)*.23:1),sy:q.sy*(old?1+(old.sy-1)*.23:1),lean:q.tilt+(old?old.lean*.2:0),energy:q.energy,still:false};
}
let ANIMA_BAKE_TICK=-1,ANIMA_BAKE_COUNT=0;
function animaRenderSettings(w){
 const low=typeof mobileQualityMode==='function'&&(mobileQualityMode()==='low'||(mobileQualityMode()==='auto'&&MOBILE_QA.adaptive));
 const touch=typeof isTouchDevice==='function'&&isTouchDevice();
 // Small sprites need fewer source pixels; keep GPU/CPU work bounded on mobile.
 const high=typeof mobileQualityMode==='function'&&mobileQualityMode()==='high';return{size:low?72:w<40?80:w<65?(touch?112:144):high?(touch?160:192):touch?128:160,steps:low?8:touch?10:12,budget:(low?4:touch?7:12)*1048576,perTick:low?1:touch?2:3};
}
function animaFrame(g,atlas,index,x,y,w,h=w){return drawCell(g,'mon/motion-v6/'+atlas+'.svg',8,64,64,index,x,y,w,h);}
function animaMotionFX(g,m,p,x,y,w,behind,al){
 if(reducedFx()||w<18||p.still||!p.rig)return;
 const clip=p.clip,t=p.t,r=p.rig,frame=Math.min(7,Math.max(0,Math.floor(t*8))),ground=['walk','enter','attack','swim','celebrate'].includes(clip);
 g.save();g.globalAlpha=al;
 if(behind&&ground&&clip!=='walk'||behind&&clip==='walk'&&w>=24){const f=clip==='walk'?Math.floor((t*2%1)*8):frame,sz=w*.79;g.globalAlpha=al*(clip==='walk'?.55:.85);animaFrame(g,'contact',r[1]*8+Math.min(7,f),x+w*.5-sz*.5,y+w*.83-sz*.5,sz,sz);}
 if(behind&&['cast','levelup','guard'].includes(clip)){const sz=w*(clip==='guard'?.85:1.15),type=r[2];g.globalAlpha=al*Math.min(.88,.25+p.energy*.5);animaFrame(g,'type-energy',type*8+frame,x+w*.5-sz*.5,y+w*.5-sz*.5,sz);}
 if(!behind){
  const symbol={celebrate:0,recover:1,sleep:2,alert:3,guard:4,inspect:5}[clip];
  if(symbol!==undefined&&(clip!=='sleep'||w>45||Math.floor(G.t/80)%2===0)){const sz=Math.max(9,w*.27);g.globalAlpha=al*.88;animaFrame(g,'emotions',symbol*8+frame,x+w*.73-sz*.5,y+w*.09-sz*.5,sz);}
 }
 g.restore();
}
function drawIndividualMotion(g,m,c,x,y,w,al=1,sx=0,lit=0,back=false,preferred=null){
 if(!c||!c.width||!c.height||al<=0)return;const p=resolveIndividualMotion(m,preferred),s=w/32,dir=back?1:-1,px=dir*p.dx*s,py=p.dy*s;
 animaMotionFX(g,m,p,x,y,w,true,al);
 g.save();g.translate(x+w/2+px,y+w+py);g.transform(p.sx*(1+(sx||0)),0,p.lean*dir,p.sy*(1-(sx||0)),0,0);g.globalAlpha=al;
 let asset=null;
 if(!p.still&&c.width>=32&&w>=18){
  const q=animaRenderSettings(w);if(ANIMA_BAKE_TICK!==G.t){ANIMA_BAKE_TICK=G.t;ANIMA_BAKE_COUNT=0;}
  const before=AnimaSpriteEngine.info().builds;
  try{asset=AnimaSpriteEngine.getFrame(c,p.rig,p.clip,p.t,{size:q.size,steps:q.steps,budget:q.budget,mirror:!!back,allow:ANIMA_BAKE_COUNT<q.perTick});}catch(e){asset=null;}
  ANIMA_BAKE_COUNT+=AnimaSpriteEngine.info().builds-before;
 }
 const draw=()=>{if(asset){const margin=asset.pad/asset.n*w;g.drawImage(asset.c,-w/2-margin,-w-margin,w+2*margin,w+2*margin);}else g.drawImage(c,-w/2,-w,w,w);};
 draw();if(lit>.05&&!reducedFx()){g.globalCompositeOperation='lighter';g.globalAlpha=Math.min(.35,lit*.35)*al;draw();}
 g.restore();animaMotionFX(g,m,p,x,y,w,false,al);
}
const INDIVIDUAL_PREVIEWS=new Map();
function animaPreviewMon(id,shiny=false){const k=id+':'+Number(shiny);let m=INDIVIDUAL_PREVIEWS.get(k);if(!m){m={sp:id,shiny,st:null};INDIVIDUAL_PREVIEWS.set(k,m);if(INDIVIDUAL_PREVIEWS.size>24)INDIVIDUAL_PREVIEWS.delete(INDIVIDUAL_PREVIEWS.keys().next().value);}return m;}
function drawIndividualPreview(id,x,y,w,shiny=false,clip='idle'){const m=animaPreviewMon(id,shiny);drawIndividualMotion(ctx,m,monCanvas(id,shiny,false),x,y,w,1,0,0,false,clip);}
function drawAnimaWorldPreview(g,id,x,y,w){const m=animaPreviewMon(id,false);drawIndividualMotion(g,m,monCanvas(id,false,false),x,y,w,1,0,0,false,'idle');}

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
