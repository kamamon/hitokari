'use strict';
// Battle sprites bypass low-resolution field/export atlases. Preserve original artwork,
// orientation and shiny color; deform at the backing-store pixel density.
const BATTLE_ART_CACHE=new Map();
const BATTLE_ART_STATS={gpu:0,cpu:0,direct:0,sourceBuilds:0,lastSize:0,lastTarget:0,backend:'not-used'};
let BATTLE_ART_BYTES=0,BATTLE_GPU=null,BATTLE_GPU_TRIED=false,BATTLE_ART_TICK=-1,BATTLE_ART_BAKES=0,BATTLE_CPU_NEXT=0,BATTLE_SCENE_DENSITY=false;
function syncBattleResolution(){
 const active=G.scene==='battle';
 if(active!==BATTLE_SCENE_DENSITY){BATTLE_SCENE_DENSITY=active;resize();}
}
function battleArtSize(w,g=null){
 const t=g&&g.getTransform?g.getTransform():null,scale=t?Math.max(Math.hypot(t.a,t.b),Math.hypot(t.c,t.d)):K;
 // Physical pixels, not CSS/logical pixels. Explicit lightweight mode retains its lower K.
 const target=Math.max(96,Math.ceil(w*scale)),limit=mobileQualityMode()==='low'?256:512;
 return {target,n:Math.min(limit,Math.max(128,Math.ceil(target/32)*32))};
}
function battleArtSource(mon,back,w,g=null){
 const sp=SP[mon.sp],rear=!!(back&&MONBACK[sp.book]),rp=rear?pic(monAssetPath(sp.book,true)):null;
 const P=rp&&rp.st===1?rp:monPic(sp.book),trueRear=rp===P&&rear,flip=!!back&&!trueRear;
 const {n,target}=battleArtSize(w,g),key=[mon.sp,+!!mon.shiny,+trueRear,+flip,n].join('|');
 let a=BATTLE_ART_CACHE.get(key);
 if(a&&a.image===P.img){BATTLE_ART_CACHE.delete(key);BATTLE_ART_CACHE.set(key,a);return a;}
 // Never cache a blank loading frame; as soon as art is ready, use it instead of the placeholder.
 if(P.st!==1){const c=(trueRear&&monBackCv(mon.sp,mon.shiny))||monCanvas(mon.sp,mon.shiny,back,false);return{canvas:c,n:c.width,target,view:'loading',sourceWidth:0,sourceHeight:0};}
 const c=document.createElement('canvas');c.width=c.height=n;const cg=c.getContext('2d',{willReadFrequently:true});cg.setTransform(n/32,0,0,n/32,0,0);
 drawMonPic(cg,sp,P,!!mon.shiny,flip);if(trueRear)c._animaView='rear';
 // Actual visible silhouette bounds for body deformation, without reading back a large texture.
 const probe=document.createElement('canvas');probe.width=probe.height=64;const pg=probe.getContext('2d',{willReadFrequently:true});pg.drawImage(c,0,0,64,64);
 const p=pg.getImageData(0,0,64,64).data;let l=64,r=-1,t=64,b=-1;
 for(let y=0;y<64;y++)for(let x=0;x<64;x++)if(p[(y*64+x)*4+3]>24){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}
 if(r<l){l=t=0;r=b=63;}
 a={canvas:c,image:P.img,n,target,view:trueRear?'rear':flip?'reflected':'front',sourceWidth:P.img.naturalWidth||P.img.width,sourceHeight:P.img.naturalHeight||P.img.height,bounds:[l/64,t/64,(r-l+1)/64,(b-t+1)/64],bytes:n*n*4};
 if(BATTLE_ART_CACHE.has(key))BATTLE_ART_BYTES-=BATTLE_ART_CACHE.get(key).bytes;
 BATTLE_ART_CACHE.set(key,a);BATTLE_ART_BYTES+=a.bytes;BATTLE_ART_STATS.sourceBuilds++;
 const cap=(isTouchDevice()?12:20)*1048576;while(BATTLE_ART_BYTES>cap&&BATTLE_ART_CACHE.size>1){const k=BATTLE_ART_CACHE.keys().next().value;BATTLE_ART_BYTES-=BATTLE_ART_CACHE.get(k).bytes;BATTLE_ART_CACHE.delete(k);}
 return a;
}
function makeBattleMeshGPU(){
 const c=document.createElement('canvas');c.width=c.height=640; // Fixed buffer: never reallocate it between differently sized battle actors.
 const gl=c.getContext('webgl',{alpha:true,antialias:false,depth:false,stencil:false,premultipliedAlpha:true,preserveDrawingBuffer:true});
 if(!gl)return null;
 function shader(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
 const vs=shader(gl.VERTEX_SHADER,'attribute vec2 aPos;attribute vec2 aUV;varying vec2 uv;void main(){gl_Position=vec4(aPos,0.,1.);uv=aUV;}');
 const fs=shader(gl.FRAGMENT_SHADER,'precision mediump float;varying vec2 uv;uniform sampler2D art;void main(){if(uv.x<0.0||uv.x>1.0||uv.y<0.0||uv.y>1.0){gl_FragColor=vec4(0.);return;}gl_FragColor=texture2D(art,uv);}');
 const program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
 gl.deleteShader(vs);gl.deleteShader(fs);const pos=gl.getAttribLocation(program,'aPos'),uv=gl.getAttribLocation(program,'aUV'),vb=gl.createBuffer(),ib=gl.createBuffer(),grid=12,side=grid+1,verts=new Float32Array(side*side*4),indices=[];
 for(let j=0;j<grid;j++)for(let i=0;i<grid;i++){const a=j*side+i,b=a+side;indices.push(a,b,a+1,a+1,b,b+1);}
 gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);
 const textures=new Map();let texBytes=0;
 function clear(){for(const v of textures.values())gl.deleteTexture(v.tex);textures.clear();texBytes=0;}
 function render(source,p,mirrored){
  if(gl.isContextLost())return null;
  const n=source.n,pad=Math.ceil(n*.105),out=n+2*pad;
  let v=textures.get(source.canvas);
  if(!v){
   const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
   gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
   gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,source.canvas);v={tex,bytes:n*n*4};textures.set(source.canvas,v);texBytes+=v.bytes;
  }else{textures.delete(source.canvas);textures.set(source.canvas,v);gl.bindTexture(gl.TEXTURE_2D,v.tex);}
  const cap=(isTouchDevice()?12:20)*1048576;while(texBytes>cap&&textures.size>1){const key=textures.keys().next().value,old=textures.get(key);gl.deleteTexture(old.tex);texBytes-=old.bytes;textures.delete(key);}
  const [l,t,bw,bh]=source.bounds;let k=0;
  for(let j=0;j<=grid;j++)for(let i=0;i<=grid;i++){const xx=(i*out/grid-pad)/n,yy=(j*out/grid-pad)/n,d=AnimaSpriteEngine.mesh(p.rig,p.clip,p.t,clamp((xx-l)/bw,0,1),clamp((yy-t)/bh,0,1),mirrored);
   verts[k++]=i/grid*2-1;verts[k++]=1-j/grid*2;verts[k++]=xx-d[0]*bw;verts[k++]=yy-d[1]*bh;}
  gl.viewport(0,c.height-out,out,out);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.disable(gl.BLEND);gl.useProgram(program);
  gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,v.tex);gl.uniform1i(gl.getUniformLocation(program,'art'),0);
  gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,verts,gl.DYNAMIC_DRAW);gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,16,0);gl.enableVertexAttribArray(uv);gl.vertexAttribPointer(uv,2,gl.FLOAT,false,16,8);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_SHORT,0);
  return{c,n,pad,rect:[0,0,out,out]};
 }
 return{render,clear,info:()=>({textures:textures.size,bytes:texBytes})};
}
function battleMeshGPU(){
 if(!BATTLE_GPU_TRIED){BATTLE_GPU_TRIED=true;try{BATTLE_GPU=makeBattleMeshGPU();}catch(e){BATTLE_GPU=null;}}
 return BATTLE_GPU;
}
function battleArtFrame(source,p,back,forceCPU=false){
 if(p.still||!source.bounds)return null;
 const gpu=forceCPU?null:battleMeshGPU();
 if(gpu){try{const f=gpu.render(source,p,!!back);if(f){BATTLE_ART_STATS.gpu++;BATTLE_ART_STATS.backend='webgl-hd';return f;}}catch(e){BATTLE_GPU=null;}}
 // No WebGL: same high-resolution source, separate bounded CPU cache; never use tiny atlases.
 // Keep frame generation within a one-bake-per-tick budget. Uncached poses use crisp root motion.
 if(BATTLE_ART_TICK!==G.t){BATTLE_ART_TICK=G.t;BATTLE_ART_BAKES=0;}
 const before=AnimaSpriteEngine.info().builds,n=source.n,steps=AnimaSpriteEngine.looped.has(p.clip)?8:10,started=performance.now();
 let a=null;try{a=AnimaSpriteEngine.getFrame(source.canvas,p.rig,p.clip,p.t,{size:n,steps,mirror:!!back,hd:true,budget:24*1048576,allow:forceCPU||(BATTLE_ART_BAKES<1&&G.t>=BATTLE_CPU_NEXT)});}catch(e){}
 const made=AnimaSpriteEngine.info().builds-before;BATTLE_ART_BAKES+=made;if(made){const elapsed=performance.now()-started;BATTLE_CPU_NEXT=G.t+Math.max(1,Math.min(8,Math.ceil(elapsed/6)));}
 if(a){BATTLE_ART_STATS.cpu++;BATTLE_ART_STATS.backend='cpu-hd';return a;}
 return null;
}
function battleSnap(g,x,y){
 // Snap only the root in backing-store pixels; do not round limb movements to whole game tiles.
 const t=g.getTransform(),det=t.a*t.d-t.b*t.c;if(!det)return[x,y];
 const X=t.a*x+t.c*y+t.e,Y=t.b*x+t.d*y+t.f,dx=Math.round(X)-X,dy=Math.round(Y)-Y;
 return[x+(t.d*dx-t.c*dy)/det,y+(-t.b*dx+t.a*dy)/det];
}
function drawBattleArt(g,m,x,y,w,back=false,al=1,sx=0,lit=0,forceCPU=false){
 if(al<=0)return;
 const source=battleArtSource(m,back,w,g),p=resolveIndividualMotion(m,null),s=w/32,dir=back?1:-1;p.direction=dir;
 BATTLE_ART_STATS.lastSize=source.n;BATTLE_ART_STATS.lastTarget=source.target;
 animaMotionFX(g,m,p,x,y,w,true,al);
 const a=battleArtFrame(source,p,back,forceCPU);
 if(!a){BATTLE_ART_STATS.direct++;BATTLE_ART_STATS.backend='direct-hd';}
 const q=battleSnap(g,x+w/2+dir*p.dx*s,y+w+p.dy*s);
 g.save();g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';g.translate(q[0],q[1]);g.transform(p.sx*(1+(sx||0)),0,p.lean*dir,p.sy*(1-(sx||0)),0,0);g.globalAlpha=al;
 const draw=()=>{if(a){const margin=a.pad/a.n*w;if(a.rect)g.drawImage(a.c,...a.rect,-w/2-margin,-w-margin,w+2*margin,w+2*margin);else g.drawImage(a.c,-w/2-margin,-w-margin,w+2*margin,w+2*margin);}else g.drawImage(source.canvas,-w/2,-w,w,w);};
 draw();
 // Hit lighting is a brief overlay, not a permanent duplicate that softens the image.
 if(lit>.05&&!reducedFx()){g.globalCompositeOperation='lighter';g.globalAlpha=Math.min(.25,lit*.25)*al;draw();}
 g.restore();animaMotionFX(g,m,p,x,y,w,false,al);
}
function clearBattleArt(){BATTLE_ART_CACHE.clear();BATTLE_ART_BYTES=0;if(BATTLE_GPU)BATTLE_GPU.clear();if(typeof AnimaSpriteEngine!=='undefined')AnimaSpriteEngine.clearHD();BATTLE_ART_TICK=-1;BATTLE_ART_BAKES=0;BATTLE_CPU_NEXT=0;}
function battleArtInfo(){return{...BATTLE_ART_STATS,sources:BATTLE_ART_CACHE.size,sourceBytes:BATTLE_ART_BYTES,textures:BATTLE_GPU?BATTLE_GPU.info():null,hdBytes:AnimaSpriteEngine.info().hdBytes};}
