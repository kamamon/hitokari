'use strict';
// Research table and starter selection share the same capsule design and order.
// Logical canvas is 240 x 208. No generic dialogue/menu overlays this scene.
const STARTER_UI_COLORS=['#d85a3c','#428acb','#64a34f'];
const STARTER_UI_DARK=['#8b372c','#245a8e','#376b35'];
const STARTER_UI_LIGHT=['#ffe9d6','#dcefff','#e7f4d9'];
const STARTER_UI_TYPES=['ほのお','みず','くさ'];
const STARTER_UI_DESCRIPTIONS=[
 ['小さな 翼を 持つ 炎の竜。','すばやい 攻撃が 得意。'],
 ['水滴と 遊ぶ 水辺の ラッコ。','特殊攻撃と 支援が 得意。'],
 ['額に 芽が 生えた 子グマ。','打たれ強く 力もち。']
];
const STARTER_UI_BALL_X=[44,120,196];
const STARTER_UI_REGIONS={balls:{x:6,y:27,w:228,h:49},left:{x:6,y:179,w:111,h:25},right:{x:123,y:179,w:111,h:25}};
function isStarterDeskTile(m,x,y){const d=m.starterDesk;return !!d&&y===d.y&&x>=d.x&&x<d.x+d.count;}
function starterEllipse(g,x,y,rx,ry,fill,stroke=null,lw=1){g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);if(fill){g.fillStyle=fill;g.fill();}if(stroke){g.strokeStyle=stroke;g.lineWidth=lw;g.stroke();}}
function starterRounded(g,x,y,w,h,r,fill,stroke=null,lw=1){
 g.beginPath();g.moveTo(x+r,y);g.lineTo(x+w-r,y);g.quadraticCurveTo(x+w,y,x+w,y+r);g.lineTo(x+w,y+h-r);g.quadraticCurveTo(x+w,y+h,x+w-r,y+h);g.lineTo(x+r,y+h);g.quadraticCurveTo(x,y+h,x,y+h-r);g.lineTo(x,y+r);g.quadraticCurveTo(x,y,x+r,y);g.closePath();
 if(fill){g.fillStyle=fill;g.fill();}if(stroke){g.strokeStyle=stroke;g.lineWidth=lw;g.stroke();}
}
function drawStarterCapsule(g,x,y,r,index,selected=false){
 const color=STARTER_UI_COLORS[index],dark=STARTER_UI_DARK[index];g.save();
 if(selected){starterEllipse(g,x,y,r+2.1,r+2.1,'rgba(255,223,141,.35)','#ffe3a1',.65);}
 starterEllipse(g,x,y,r,r,'#f8f5ea','#263745',Math.max(.65,r*.12));
 g.save();g.beginPath();g.arc(x,y,r-.5,0,Math.PI*2);g.clip();
 const gr=g.createLinearGradient(x,y-r,x,y);gr.addColorStop(0,color);gr.addColorStop(1,dark);g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r);
 g.fillStyle='#364450';g.fillRect(x-r,y-r*.13,r*2,r*.25);
 starterEllipse(g,x-r*.32,y-r*.48,r*.24,r*.13,'rgba(255,255,255,.62)');
 g.restore();
 starterEllipse(g,x,y,r*.31,r*.31,'#f8faf7','#263745',Math.max(.45,r*.09));
 starterEllipse(g,x,y,r*.13,r*.13,'#b8d5e2');
 g.restore();
}
function drawStarterDesk(g,x,y,empty){
 // One 48 px table, one tabletop, three equidistant 16 px positions.
 g.save();
 starterEllipse(g,x+24,y+13,23,3,'rgba(23,39,49,.18)');
 g.fillStyle='#526572';g.fillRect(x+3,y+5,4,10);g.fillRect(x+41,y+5,4,10);
 starterRounded(g,x+.5,y-3,47,15,2.4,'#718a96','#354b59',.65);
 starterRounded(g,x+.5,y-5,47,12,2.4,'#e6e9e5','#526b78',.65);
 g.fillStyle='#b6c6c7';g.fillRect(x+2,y+6,44,2);
 g.fillStyle='#4d626e';g.fillRect(x+7,y+9,34,1.3);
 for(let i=0;i<3;i++){
  const cx=x+8+i*16;starterEllipse(g,cx,y+2.2,6.5,3,'#93a8ae','#607b84',.45);
  starterEllipse(g,cx,y+2.0,4.3,1.7,'#536b76');
  if(!empty){drawStarterCapsule(g,cx,y-1.8,5.45,i);}
  g.fillStyle=STARTER_UI_COLORS[i];g.fillRect(cx-1.7,y+9.5,3.4,1.1);
 }
 g.restore();
}
function starterHit(x,y,b){return x>=b.x&&x<b.x+b.w&&y>=b.y&&y<b.y+b.h;}
function starterButton(x,y,w,h,text,color,selected=false){
 const g=ctx;starterRounded(g,x,y,w,h,3,color,selected?'#f4d38b':'#637e87',selected?1.5:.8);
 tx(text,x+w/2,y+7,'#fffdf4',10,'center');
}
function drawStarterTrio(selected,confirm=false,yes=true){
 const g=ctx,r=STARTER_TRIO[selected],id=r.ids[0],c=STARTER_UI_COLORS[selected],dark=STARTER_UI_DARK[selected],light=STARTER_UI_LIGHT[selected];
 g.save();g.globalAlpha=1;
 const bg=g.createLinearGradient(0,0,0,LH);bg.addColorStop(0,'#e9f1f1');bg.addColorStop(1,'#c1d2d8');g.fillStyle=bg;g.fillRect(0,0,LW,LH);
 // A lab message header, with its own space. No speaker portrait or generic confirm box.
 g.fillStyle='#263f4a';g.fillRect(0,0,LW,24);g.fillStyle='#8facb3';g.fillRect(0,23,LW,1);
 tx('ハクノ博士',8,3,'#c9e5dc',7);
 tx(confirm?SP[id].name+'を 相棒にするかい？':'さあ、相棒を えらぼう。',8,11,'#fffdf1',10);
 // Close-up of the shared selection bench.
 starterRounded(g,8,29,224,33,5,'#8fa7af','#647e89',.9);
 starterRounded(g,8,27,224,27,5,'#d9e3e1','#68838c',.9);
 g.fillStyle='#b3c5c7';g.fillRect(13,54,214,3);
 for(let i=0;i<3;i++){
  const x=STARTER_UI_BALL_X[i],on=i===selected;
  starterEllipse(g,x,48,18,5,on?'#f0d8a5':'#a5babd',on?'#b58d49':'#7f989f',.8);
  drawStarterCapsule(g,x,40-(on&&!reducedFx()?1+Math.sin(G.t/12)*1.2:0),10.5,i,on);
  if(on){g.fillStyle=STARTER_UI_DARK[i];g.beginPath();g.moveTo(x-3,59);g.lineTo(x+3,59);g.lineTo(x,63);g.fill();}
  starterRounded(g,x-32,65,64,11,3,on?STARTER_UI_COLORS[i]:'#e7edec',on?STARTER_UI_DARK[i]:'#b1c2c4',.65);
  tx(STARTER_UI_TYPES[i],x,66,on?'#fff':'#4f646b',8,'center');
 }
 // One selected creature; preview and details are independently clipped.
 starterRounded(g,5,81,109,93,5,'#f8fbf7','#79949c',.9);
 g.save();g.beginPath();g.rect(6,82,107,91);g.clip();
 const grad=g.createLinearGradient(6,82,113,173);grad.addColorStop(0,'#fcfdf7');grad.addColorStop(1,light);g.fillStyle=grad;g.fillRect(6,82,107,91);
 starterEllipse(g,59.5,163.5,38,6,'rgba(38,59,62,.13)');
 drawIndividualPreview(id,-5,43,129);
 g.restore();
 tx('Lv.5',10,86,dark,8);
 starterRounded(g,118,81,117,93,5,'#fbfcf8','#79949c',.9);
 g.fillStyle=c;g.fillRect(123,86,3,13);tx(SP[id].name,130,87,'#253d47',11);
 starterRounded(g,123,103,46,13,3,light,c,.75);tx(STARTER_UI_TYPES[selected],146,105,dark,8,'center');
 tx('特性 '+ABIL[r.ability].n,123,120,'#344d55',9);
 tx(STARTER_UI_DESCRIPTIONS[selected][0],123,137,'#344d55',8);
 tx(STARTER_UI_DESCRIPTIONS[selected][1],123,148,'#344d55',8);
 tx(confirm?'はい／いいえ を 選ぶ':'← → または カプセルを タッチ',120,169,'#425d66',7,'center');
 if(confirm){
  starterButton(6,179,111,25,'B / いいえ','#647e87',!yes);
  starterButton(123,179,111,25,'A / はい',dark,yes);
 }else{
  starterButton(6,179,111,25,'B / もどる','#647e87');
  starterButton(123,179,111,25,'A / この子を選ぶ',dark);
 }
 g.restore();
}
function chooseStarter(initial){
 for(const id of STARTERS)monPreload(id);
 return new Promise(resolve=>{
  const w={type:'starter-select',i:clamp(initial|0,0,STARTERS.length-1),confirm:false,yes:true,closed:false,
   finish(i){if(this.closed)return;this.closed=true;popW(this);pressQ.length=0;resolve(i);},
   select(i){if(i!==this.i){this.i=i;sfx('sel');}},
   key(k){
    if(this.closed)return;
    if(this.confirm){
      if(k==='b'||k==='m'){this.confirm=false;sfx('cancel');return;}
      if(k==='left'||k==='up'||k==='right'||k==='down'){const next=k==='right'||k==='down';if(this.yes!==next){this.yes=next;sfx('sel');}return;}
      if(k==='a'){if(this.yes){sfx('ok');this.finish(this.i);}else{this.confirm=false;sfx('cancel');}return;}
      return;
    }
    if(k==='left'||k==='up')this.select((this.i+STARTERS.length-1)%STARTERS.length);
    else if(k==='right'||k==='down')this.select((this.i+1)%STARTERS.length);
    else if(k==='a'){this.confirm=true;this.yes=true;sfx('ok');}
    else if(k==='b'||k==='m'){sfx('cancel');this.finish(-1);}
   },
   tap(x,y){
     if(this.closed)return true;
     if(starterHit(x,y,STARTER_UI_REGIONS.left)){this.key('b');return true;}
     if(starterHit(x,y,STARTER_UI_REGIONS.right)){if(this.confirm)this.yes=true;this.key('a');return true;}
     if(!this.confirm&&starterHit(x,y,STARTER_UI_REGIONS.balls))this.select(clamp(Math.floor((x-6)/76),0,2));
     return true;
   },
   draw(){drawStarterTrio(this.i,this.confirm,this.yes);}
  };
  UI.push(w);
 });
}
