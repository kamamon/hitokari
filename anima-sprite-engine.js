'use strict';
// Original art, continuous inverse mesh deformation, cached transparent raster frames.
// No new biological details are invented for source art. Body-plan masks control movement.
const AnimaSpriteEngine=(()=>{
 const clips=['idle','enter','attack','cast','hit','faint','walk','celebrate','sleep','guard','recover','alert','swim','inspect','recoil','status','levelup','run','pounce','bite','slash','tailstrike','wingstrike','dash','beam','pulse','charge','dodge','tired','roar','withdraw','land'];
 const labels=['待機','登場','物理攻撃','特殊攻撃','被弾','戦闘不能','歩行','喜び','睡眠','防御','回復','警戒','遊泳','観察','反動','状態異常','成長','疾走','飛びかかり','噛みつき','斬撃','尾撃','翼撃','突進','光線','波動','溜め','回避','疲労','咆哮','退場','着地'];
 const plans=['quad','biped','bird','fish','serpent','bug','blob','ghost','plant','golem'];
 const looped=new Set(['idle','walk','sleep','swim','run','tired']);
 const durations={idle:100,enter:29,attack:34,cast:43,hit:20,faint:26,walk:26,celebrate:39,sleep:108,guard:32,recover:42,alert:29,swim:32,inspect:48,recoil:24,status:38,levelup:50,run:18,pounce:31,bite:27,slash:28,tailstrike:34,wingstrike:32,dash:26,beam:45,pulse:40,charge:34,dodge:23,tired:92,roar:42,withdraw:26,land:21};
 const saturate=x=>Math.max(0,Math.min(1,x)),smooth=x=>{x=saturate(x);return x*x*(3-2*x);},mix=(a,b,t)=>a+(b-a)*t;
 const bump=(x,c,w)=>Math.max(0,1-Math.abs(x-c)/w),TAU=2*Math.PI;
 function duration(r,clip,base){if(clip==='walk')return r[11];if(clip==='run')return Math.max(12,Math.round(r[11]*.62));if(clip==='swim')return Math.max(18,r[11]+4);return Math.max(12,Math.round((base||durations[clip]||30)*(r[12]>105&&['attack','enter','faint'].includes(clip)?1.12:1)));}
 function pose(r,clip,p){
  p=saturate(p);const t=p*TAU,beat=Math.sin(t),b2=Math.sin(t*2),heavy=Math.max(.65,Math.min(1.25,92/r[12])),limb=r[8]/100,secondary=r[9]/100;
  const anticipation=bump(p,.19,.19),strike=bump(p,.44,.20),follow=bump(p,.70,.30),land=bump(p,.57,.16);
  let x=0,y=0,sx=1,sy=1,tilt=0,energy=.1,flap=0,stride=0,tail=0,head=0,fold=0;
  switch(clip){
   case 'idle':y=-.28*beat*heavy;sx+=.014*beat;sy-=.018*beat;head=.19*Math.sin(t+r[10]*Math.PI/180);tail=.25*beat;flap=.20*b2;break;
   case 'walk':y=-.72*Math.abs(beat)*heavy;sx+=.012*b2;sy-=.025*b2;tilt=.018*beat;stride=beat;tail=.55*beat;head=.30*b2;flap=.46*b2;energy=.5;break;
   case 'swim':y=-.45*beat;x=.25*b2;tail=1.1*beat;flap=.8*b2;head=.25*beat;energy=.7;break;
   case 'attack':x=-1.5*anticipation+3.8*strike-.9*follow;y=.7*anticipation-1.3*strike;sx+=-.08*anticipation+.10*strike;sy+=.09*anticipation-.065*strike;tilt=.055*strike-.032*anticipation;stride=strike-anticipation*.5;tail=.9*strike-.65*follow;head=.75*strike;flap=strike-.6*anticipation;energy=strike;break;
   case 'cast':y=-1.4*bump(p,.46,.46);sx+=.03*bump(p,.5,.4);sy+=.065*bump(p,.4,.4);tilt=.018*beat;head=.70*anticipation;flap=.85*Math.sin(t*1.4)*Math.sin(Math.PI*p);tail=.8*beat*Math.sin(Math.PI*p);energy=Math.sin(Math.PI*p);break;
   case 'enter':y=-3.1*bump(p,.26,.3)*heavy;sx+=.06*land;sy-=.12*land;head=.6*land;flap=.8*bump(p,.3,.3);stride=.7*land;energy=1-p;break;
   case 'hit':x=-2.9*bump(p,.18,.18)+.65*bump(p,.50,.32);y=.55*bump(p,.2,.25);sx+=.09*bump(p,.2,.22);sy-=.105*bump(p,.2,.23);tilt=-.065*bump(p,.22,.3);head=-.8*bump(p,.2,.25);tail=-.9*bump(p,.25,.3);flap=-.55*bump(p,.2,.3);energy=1-p;break;
   case 'faint':y=3.5*smooth(p);sx+=.1*smooth(p);sy-=.31*smooth(p);tilt=-.085*smooth(p);fold=.85*smooth(p);head=-.75*smooth(p);energy=1-p;break;
   case 'celebrate':y=-2.5*Math.abs(Math.sin(t))*heavy;sx+=.035*b2;sy-=.04*b2;flap=Math.sin(t*2);tail=.9*beat;head=.65*b2;stride=.8*beat;energy=Math.sin(Math.PI*p);break;
   case 'sleep':y=.35;sx+=.016*beat;sy-=.045+.02*beat;fold=.30;head=-.23;tail=.08*beat;break;
   case 'guard':fold=.9*bump(p,.43,.43);sx+=.07*fold;sy-=.12*fold;head=-fold;tail=-.3*fold;energy=fold;break;
   case 'recover':y=-1.1*Math.sin(Math.PI*p);sy+=.04*Math.sin(Math.PI*p);head=.65*Math.sin(Math.PI*p);flap=.55*Math.sin(Math.PI*p);energy=Math.sin(Math.PI*p);break;
   case 'alert':y=-1.9*bump(p,.35,.35);head=.9*bump(p,.4,.4);sy+=.065*bump(p,.4,.4);tail=.55*head;energy=head;break;
   case 'inspect':head=.8*beat*Math.sin(Math.PI*p);tilt=.035*beat*Math.sin(Math.PI*p);tail=.5*b2;break;
   case 'recoil':x=-2.4*bump(p,.25,.25);tilt=-.07*bump(p,.25,.3);sx+=.04*bump(p,.3,.3);sy-=.07*bump(p,.3,.3);head=-.7*bump(p,.25,.3);tail=-head;energy=1-p;break;
   case 'status':x=.32*Math.sin(t*4)*Math.sin(Math.PI*p);y=.25*b2;head=.8*Math.sin(t*3)*Math.sin(Math.PI*p);tail=.6*b2;fold=.3*Math.sin(Math.PI*p);energy=Math.sin(Math.PI*p);break;
   case 'levelup':y=-1.6*Math.abs(Math.sin(t*2));flap=.65*b2;head=.4*beat;tail=.7*beat;energy=Math.sin(Math.PI*p);break;
   case 'run':x=.34*b2;y=-1.05*Math.abs(beat)*heavy;sx+=.032*b2;sy-=.055*b2;tilt=.04+.018*beat;stride=1.45*beat;tail=.85*beat;head=.4*b2;flap=.85*b2;energy=.65;break;
   case 'pounce':x=-.9*anticipation+3.2*strike;y=1.2*anticipation-3.6*bump(p,.43,.25)+.8*land;sx+=.10*anticipation-.03*strike+.07*land;sy-=.13*anticipation;sy+=.10*strike-.09*land;tilt=.07*strike;stride=1.3*strike;flap=1.1*strike;tail=.9*strike;head=.7*strike;energy=strike;break;
   case 'bite':x=-.7*anticipation+3.5*strike;y=.35*anticipation-.65*strike;sx+=.09*strike;sy-=.045*strike;head=-.8*anticipation+1.6*strike;tail=.65*follow;stride=.55*strike;energy=strike;break;
   case 'slash':x=-.8*anticipation+2.8*strike;y=-.95*strike;sx+=.05*strike;sy+=.045*strike;tilt=-.10*anticipation+.12*strike-.025*follow;flap=1.4*strike-.8*anticipation;stride=.85*strike;head=.52*strike;tail=-.75*follow;energy=strike;break;
   case 'tailstrike':x=-.7*strike;y=-.5*strike;tilt=-.065*strike+.045*anticipation;tail=-1.35*anticipation+1.8*strike-.55*follow;head=-.65*strike;stride=.58*strike;energy=strike;break;
   case 'wingstrike':y=-2.5*bump(p,.43,.35);x=1.4*strike;flap=-1.1*anticipation+1.55*strike-.75*follow;tail=.9*follow;head=.6*strike;sy+=.055*strike;energy=strike;break;
   case 'dash':x=-1.4*anticipation+4.7*strike-.65*follow;y=.4*anticipation-.85*strike;sx+=.17*strike;sy-=.095*strike;tilt=.065*strike;stride=1.5*strike;tail=-1.1*strike;head=.65*strike;energy=strike;break;
   case 'beam':x=-.8*bump(p,.55,.35);y=-.6*bump(p,.42,.42);sx+=.08*strike;sy+=.05*anticipation-.055*strike;head=.4*anticipation+1.3*strike;tail=-.8*strike;flap=.5*strike;energy=Math.sin(Math.PI*p);break;
   case 'pulse':y=-1.15*bump(p,.5,.44);sx+=.12*strike;sy+=.12*strike;head=.65*strike;flap=.65*b2*Math.sin(Math.PI*p);tail=.75*b2;energy=Math.sin(Math.PI*p);break;
   case 'charge':y=.8*bump(p,.45,.45);sx+=.055*bump(p,.5,.5);sy-=.085*bump(p,.5,.5);head=-.5*Math.sin(Math.PI*p);fold=.55*Math.sin(Math.PI*p);tail=.55*b2;energy=Math.sin(Math.PI*p);break;
   case 'dodge':x=-3.3*bump(p,.43,.43);y=-1.35*bump(p,.42,.38);tilt=-.12*bump(p,.43,.43);sx+=.055*strike;sy-=.05*strike;stride=-.8*strike;flap=.65*strike;tail=.72*follow;energy=strike;break;
   case 'tired':y=.64+.18*beat;sx+=.035*beat;sy-=.075+.034*beat;head=-.48+.1*beat;fold=.25;tail=.13*beat;break;
   case 'roar':x=-.35*anticipation;y=-.9*bump(p,.45,.4);sy+=.11*strike;sx+=.045*strike;head=-.7*anticipation+1.25*strike;flap=.68*strike;tail=.85*strike;energy=Math.sin(Math.PI*p);break;
   case 'withdraw':x=-1.25*smooth(p);y=-1.65*bump(p,.32,.32);sx-=.23*smooth(p);sy-=.20*smooth(p);fold=.8*smooth(p);head=-.55*smooth(p);energy=1-p;break;
   case 'land':y=-2.4*(1-smooth(p))+.8*land;sx+=.1*land;sy-=.12*land;stride=.5*land;flap=.55*(1-p);head=-.5*land;tail=.48*follow;energy=land;break;
  }
  if([2,3,5,7].includes(r[1])&&['idle','cast','walk','run','swim'].includes(clip)){y-=.6*beat*secondary;flap+=.28*b2;}
  return{x:x*heavy,y:y*heavy,sx,sy,tilt,energy,flap:flap*limb,stride:stride*limb,tail:tail*secondary,head:head*r[7]/100,fold};
 }
 // Inverse displacement in normalized artwork bounds. Each plan has independently moving regions.
 function mesh(r,clip,p,u,v,mirrored=false){
  const q=pose(r,clip,p);if(mirrored)u=1-u;
  const cx=r[5]/100,cy=r[6]/100,t=p*TAU,front=smooth((cx+.17-u)/.50),rear=smooth((u-cx+.16)/.50),top=smooth((cy+.14-v)/.56),foot=smooth((v-cy+.13)/.46),edge=smooth(Math.abs(u-cx)/.46),mid=1-edge,tail=rear*rear,ear=front*top,phase=r[10]*Math.PI/180;
  let dx=0,dy=0;
  switch(r[1]){
   case 0: // quadruped: alternating fore/hind paws, head/ear, rear tail
    dx+=q.stride*.055*foot*(front-rear);dy+=.042*foot*(front*Math.max(0,q.stride)+rear*Math.max(0,-q.stride));
    dy+=q.head*.027*ear+q.tail*.048*tail*(.4+.6*top);dx+=q.head*.026*ear;break;
   case 1: // biped: arms and opposite leg swing, core holds its position
    dx+=q.stride*.052*foot*Math.sign(u-cx)*edge;dy+=q.stride*.045*foot*Math.sign(u-cx)*edge;
    dy+=q.flap*.044*edge*(1-foot)*(1-top);dx+=q.head*.032*top*mid;dy+=q.head*.022*top;break;
   case 2: // wings fold/lift outside the stable thorax
    dy+=q.flap*.105*edge*(.55+.45*top);dx+=Math.sign(u-cx)*edge*(q.flap*.024-q.fold*.072);dy+=q.head*.024*front*top;dy+=q.tail*.04*rear*foot;break;
   case 3: // fins and tail beat against a stable head
    dy+=q.tail*.09*tail+q.flap*.056*foot*edge;dx+=q.tail*.026*tail*Math.sin(u*3+t+phase);dy+=q.head*.018*front;break;
   case 4: // serpentine traveling wave, greatest toward the tail
    dy+=q.tail*.078*Math.sin(u*6.2-t+phase*.2)*(.22+.78*rear);dx+=q.stride*.035*foot*Math.sin(u*7-t);dy+=q.head*.021*front*top;break;
   case 5: // insect wing, antenna and alternating feet
    dy+=q.flap*.085*edge*top;dx+=Math.sign(u-cx)*q.flap*.035*edge*top;dx+=q.stride*.038*foot*Math.cos(u*13);dy+=q.stride*.025*foot*Math.sin(u*13);dy+=q.head*.038*ear;break;
   case 6: // elastic blob, bottom stays grounded
    dx+=(u-cx)*(.045*Math.sin(t)+.07*q.fold+.055*q.head)*top;dy+=(v-cy)*(.065*q.stride-.07*q.fold)*top;break;
   case 7: // drifting lower fringe independent of the upper body
    dx+=(q.tail*.06+q.flap*.025)*foot*Math.sin(v*4.6+phase+t);dy+=q.flap*.042*edge*foot;dx+=q.head*.02*top;break;
   case 8: // leaves, petals and upper stems around the rooted base
    dx+=(q.head*.052+q.tail*.045*Math.sin(t+u*3+phase))*top*top;dy+=q.flap*.035*top*edge;dx+=q.stride*.02*foot;break;
   case 9: // heavy plates and grounded feet
    dx+=q.stride*.037*foot*(front-rear);dy+=q.stride*.025*foot*(front-rear);dx+=q.head*.022*top;dy+=q.fold*.025*edge*top;break;
  }
  if(r[4]&2)dx+=q.head*.013*ear;
  if(r[4]&4)dy+=q.tail*.022*tail;
  if(r[4]&8)dx+=q.tail*.012*top*edge;
  if(r[4]&16){dx*=.79;dy*=.79;}
  if(clip==='guard'||clip==='faint'||clip==='charge'||clip==='withdraw'){dx+=(cx-u)*q.fold*.04*edge;dy+=q.fold*.024*top;}
  if(clip==='bite'||clip==='roar'){dx-=q.head*.037*front*top;dy+=q.head*.024*front*(1-top);}
  if(clip==='slash'){dx+=q.flap*.034*front*foot;dy+=q.flap*.033*edge*foot;}
  if(clip==='wingstrike'&&(r[1]===2||r[1]===5||r[4]&1))dy+=q.flap*.035*edge*top;
  dx=Math.max(-.24,Math.min(.24,dx));dy=Math.max(-.24,Math.min(.24,dy));return[mirrored?-dx:dx,dy];
 }
 // Bounded, alpha-aware inverse sampling. No seams between strips or holes at joints.
 function canvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
 let sourceCounter=0;const sources=new WeakMap(),frames=new Map(),hdFrames=new Map();let bytes=0,hdBytes=0,builds=0,hits=0,misses=0,approximate=0;
 function snapshot(c,n){
  let m=sources.get(c);if(!m){m=new Map();sources.set(c,m);}if(m.has(n))return m.get(n);
  const s=c.width===n&&c.height===n&&typeof c.getContext==='function'?c:canvas(n,n),g=s.getContext('2d',{willReadFrequently:true});if(s!==c){g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';g.drawImage(c,0,0,n,n);}
  const pixels=g.getImageData(0,0,n,n).data;let l=n,t=n,r=-1,b=-1;
  for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(pixels[(y*n+x)*4+3]>24){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}
  if(r<l){l=t=0;r=b=n-1;}
  const a={id:++sourceCounter,n,pixels,l,t,w:Math.max(1,r-l+1),h:Math.max(1,b-t+1)};m.set(n,a);return a;
 }
 function raster(src,rig,clip,p,mirrored){
  const n=src.n,pad=Math.ceil(n*.105),out=n+pad*2,c=canvas(out,out),g=c.getContext('2d'),im=g.createImageData(out,out),dst=im.data,px=src.pixels,grid=8,side=grid+1;
  const X=new Float32Array(side*side),Y=new Float32Array(side*side);
  for(let j=0;j<=grid;j++)for(let i=0;i<=grid;i++){
   const x=i*out/grid-pad,y=j*out/grid-pad,u=saturate((x-src.l)/src.w),v=saturate((y-src.t)/src.h),d=mesh(rig,clip,p,u,v,mirrored);X[j*side+i]=d[0]*src.w;Y[j*side+i]=d[1]*src.h;
  }
  const xi=new Int16Array(out),xf=new Float32Array(out);
  for(let x=0;x<out;x++){const z=x*grid/out;xi[x]=Math.min(grid-1,Math.floor(z));xf[x]=z-xi[x];}
  for(let y=0;y<out;y++){
   const z=y*grid/out,j=Math.min(grid-1,Math.floor(z)),fy=z-j,row=j*side;
   for(let x=0;x<out;x++){
    const i=xi[x],fx=xf[x],a=row+i,b=a+side;
    const sx=x-pad-mix(mix(X[a],X[a+1],fx),mix(X[b],X[b+1],fx),fy),sy=y-pad-mix(mix(Y[a],Y[a+1],fx),mix(Y[b],Y[b+1],fx),fy);
    if(sx<0||sy<0||sx>=n-1||sy>=n-1)continue;
    const u=sx|0,v=sy|0,du=sx-u,dv=sy-v,k=(v*n+u)*4,j0=k+4,j1=k+n*4,j2=j1+4;
    const w0=(1-du)*(1-dv)*px[k+3],w1=du*(1-dv)*px[j0+3],w2=(1-du)*dv*px[j1+3],w3=du*dv*px[j2+3],alpha=w0+w1+w2+w3;if(alpha<.5)continue;
    const o=(y*out+x)*4;dst[o]=(px[k]*w0+px[j0]*w1+px[j1]*w2+px[j2]*w3)/alpha;dst[o+1]=(px[k+1]*w0+px[j0+1]*w1+px[j1+1]*w2+px[j2+1]*w3)/alpha;dst[o+2]=(px[k+2]*w0+px[j0+2]*w1+px[j1+2]*w2+px[j2+2]*w3)/alpha;dst[o+3]=alpha;
   }
  }
  g.putImageData(im,0,0);builds++;return{c,pad,n,bytes:out*out*4};
 }
 function getFrame(c,rig,clip,phase,opt={}){
  const n=opt.size||112,steps=opt.steps||12,loop=looped.has(clip),f=loop?Math.floor((phase%1+1)%1*steps)%steps:Math.round(saturate(phase)*(steps-1)),p=loop?f/steps:f/(steps-1),src=snapshot(c,n),key=src.id+'|'+rig[0]+'|'+clip+'|'+f+'|'+steps+'|'+(opt.mirror?1:0);
  const pool=opt.hd?hdFrames:frames;let v=pool.get(key);if(v){pool.delete(key);pool.set(key,v);hits++;return v;}misses++;
  if(opt.allow===false){
   // During a busy double battle, use the closest already baked pose instead of jumping back to the still artwork.
   const prefix=src.id+'|'+rig[0]+'|'+clip+'|',suffix='|'+steps+'|'+(opt.mirror?1:0);let nearest=null,distance=Infinity;
   for(const [k,v] of pool){if(!k.startsWith(prefix)||!k.endsWith(suffix))continue;const frame=Number(k.slice(prefix.length,k.length-suffix.length));let d=Math.abs(frame-f);if(loop)d=Math.min(d,steps-d);if(d<distance){distance=d;nearest=v;}}
   if(nearest&&distance<=2){approximate++;return nearest;}return null;
  }
  v=raster(src,rig,clip,p,!!opt.mirror);pool.set(key,v);if(opt.hd)hdBytes+=v.bytes;else bytes+=v.bytes;
  const cap=opt.budget||8*1024*1024;while((opt.hd?hdBytes:bytes)>cap&&pool.size>1){const k=pool.keys().next().value,old=pool.get(k);if(opt.hd)hdBytes-=old.bytes;else bytes-=old.bytes;pool.delete(k);}
  return v;
 }
 function clearHD(){hdFrames.clear();hdBytes=0;}
 function clear(){frames.clear();bytes=0;clearHD();}
 function info(){return{frames:frames.size,bytes,hdFrames:hdFrames.size,hdBytes,builds,hits,misses,approximate};}
 return{clips,labels,plans,looped,duration,pose,mesh,getFrame,clearHD,clear,info};
})();
if(typeof module==='object'&&module.exports)module.exports=AnimaSpriteEngine;
