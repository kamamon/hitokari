'use strict';
// Deformation bands for the existing original illustration layers; no external character artwork.
function creaturePose(m,plan,t,q,sc,lit,sx){
 if(reducedFx()||!q)return{dx:0,dy:0,sx:1,sy:1,lean:0};
 const phase=t*.055*q,fatigue=m.hp/maxHP(m)<.25?.45:1,hit=Math.max(0,lit||0);
 let dx=0,dy=0,xscale=1,yscale=1,lean=0;
 if(plan==='bird'||plan==='bug'){dy=Math.sin(phase*1.8)*sc*.65*fatigue;xscale+=Math.sin(phase*2.7)*.018;}
 if(plan==='biped'||plan==='quad'){lean=Math.sin(phase)*.012;dy-=Math.abs(Math.sin(phase))*sc*.22;}
 if(plan==='golem'){lean=Math.sin(phase*.5)*.007;}
 if(plan==='blob'){xscale+=Math.sin(phase)*.025;yscale-=Math.sin(phase)*.024;}
 if(plan==='plant'){lean=Math.sin(phase*.8)*.022;}
 if(m.st==='slp'){yscale*=.98;dy+=sc*.35;}
 if(hit>.1){lean+=(Math.sin(t*.65)*.025)*hit;xscale+=hit*.015;yscale-=hit*.02;}
 return{dx,dy,sx:xscale,sy:yscale,lean};
}
function drawCreatureBands(g,c,w,plan,t,q,sc,lit){
 const N=12,sh=MS/N,dh=w/N,phase=t*.07*q;let previous=0;
 for(let i=0;i<N;i++){const u=(i+.5)/N,v=1-u;let dx=0,sx=1;
  if(plan==='bird'||plan==='bug'){const a=Math.sin(phase*2+u*4)*Math.sin(Math.PI*u);sx+=a*.025;dx=a*sc*.23;}
  else if(plan==='plant'){dx=Math.sin(phase+u*1.8)*v*v*sc*.8;}
  else if(plan==='quad'||plan==='biped'){dx=Math.sin(phase+u*2)*v*sc*.34;}
  else if(plan==='golem'){dx=Math.sin(phase*.45)*v*sc*.19;}
  else if(plan==='blob'){sx+=Math.sin(phase+u*3)*.018;}
  const dw=w*sx;g.drawImage(c,0,i*sh,MS,sh,-dw/2+dx,-w+i*dh,dw,dh+.35);
 }}
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
