'use strict';
const ROUTE4_TRAINERS=[
 ['main',401,807,18,6,1,'木工見習い',[[609,10],[11,11]]],
 ['main',402,307,23,19,2,'渓流の観察員',[[528,10],[241,11]]],
 ['main',403,408,13,24,1,'昆虫研究員',[[424,11],[376,12]]],
 ['main',404,1507,19,27,3,'サイクリスト',[[717,11],[546,12]]],
 ['gorge',405,1807,17,8,3,'森の案内人',[[358,12],[654,13]]]
];
function r4Set(m,x,y,t){if(x>=0&&x<m.W&&y>=0&&y<m.H)m.t[y*m.W+x]=t;}
function r4Rect(m,x,y,w,h,t){for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)r4Set(m,i,j,t);}
function r4Path(m,x,y,x2,y2,n=1){for(let xx=Math.min(x,x2);xx<=Math.max(x,x2);xx++)for(let k=0;k<n;k++)r4Set(m,xx,y+k,T.PATH);for(let yy=Math.min(y,y2);yy<=Math.max(y,y2);yy++)for(let k=0;k<n;k++)r4Set(m,x2+k,yy,T.PATH);}
function r4Patch(m,cx,cy,rx,ry,r,flower=false){for(let y=cy-ry;y<=cy+ry;y++)for(let x=cx-rx;x<=cx+rx;x++){if(x<2||x>29||y<2||y>29||(m.t[y*32+x]!==T.GRASS&&(!flower||m.t[y*32+x]!==T.TALL))||((x-cx)/(rx+.4))**2+((y-cy)/(ry+.4))**2>1||!r.chance(flower?.78:.92))continue;r4Set(m,x,y,flower?T.FLOWER:T.TALL);}}
function r4Sign(m,x,y,s){r4Set(m,x,y,T.SIGN);m.signs[x+','+y]=s;}
function r4Site(m,x,y,kind,extra={}){m.route4Sites[x+','+y]={kind,...extra};}
function r4Prop(m,x,y,id,say){m.objs.push({k:'haruprop',id,x,y,say});}
function r4Item(m,x,y,item,iid){r4Set(m,x,y,T.GRASS);m.objs.push({k:'item',iid:'r4-'+iid,x,y,item});}
function r4Bridge(m,x,y0,y1){for(let y=y0;y<=y1;y++)for(let dx=0;dx<2;dx++){r4Set(m,x+dx,y,T.PATH);expPut(m,x+dx,y,{kind:'bridge',dir:0});}}
function r4Cliff(m,y,stairs){for(let x=2;x<=29;x++){r4Set(m,x,y,T.ROCK);expPut(m,x,y,{kind:'cliff'});}for(const x of stairs){r4Set(m,x,y,T.PATH);expPut(m,x,y,{kind:'stairs'});}}
function genRoute4(zone='main',cell=CELLS[ROUTE4_KEY]){
 if(cell.key!==ROUTE4_KEY)throw Error('route4 cell');
 const main=zone==='main',m=newMap(main?ROUTE4_KEY:ROUTE4_INNER,cell,32,32,T.GRASS),r=RNG('route4-v115:'+zone);
 m.route4=zone;m.pal='forest';m.name=main?'第4街道':'第4街道・渓流の奥地';m.border=T.TREE;m.exits=main?[1,0,1,0]:[0,0,0,0];m.enc={rate:main?10:9,bonus:0};m.adv={};m.elevation=new Uint8Array(1024);m.route4Sites={};m.r4Shrubs=[];m.r4Repair=[];m.advEnc={...cell,route4Zone:zone};
 if(!main)m.advArea='route4-gorge';
 for(let y=0;y<32;y++)for(let x=0;x<32;x++){if(x<2||x>29||y<2||y>29)r4Set(m,x,y,T.TREE);if(y<10)m.elevation[y*32+x]=1;}
 const riverY=main?12:15,riverEnd=main?16:18;
 for(let y=riverY;y<=riverEnd;y++)for(let x=2;x<=29;x++)r4Set(m,x,y,T.WATER);
 // Uneven banks while preserving the continuous water barrier and the bridge footprints.
 const crossings=main?[12,13,20,21]:[10,11,24,25];for(let x=5;x<=29;x++)if(!crossings.includes(x)){if(Math.sin(x*.73)>.68)r4Set(m,x,riverY,T.GRASS);if(Math.cos(x*.61)>.73)r4Set(m,x,riverEnd,T.GRASS);}
 // Waterfall is a real water tile, never a mandatory traversal gate.
 for(let y=riverY;y<=riverY+1;y++)for(let x=2;x<=4;x++)expPut(m,x,y,{kind:'fall',dir:2});
 if(main){
  r4Cliff(m,10,[12,13,20,21]);r4Rect(m,15,0,2,7,T.PATH);r4Path(m,15,6,20,11,2);r4Path(m,12,7,15,7,2);r4Rect(m,12,7,2,5,T.PATH);
  for(const x of [12,13]){r4Set(m,x,9,T.SHRUB);m.r4Shrubs.push([x,9]);}
  r4Bridge(m,20,12,16);r4Bridge(m,12,12,16);
  r4Path(m,20,17,15,24,2);r4Path(m,12,17,12,21,2);r4Path(m,12,21,15,21,2);r4Rect(m,15,24,2,8,T.PATH);
  r4Path(m,20,21,26,22,1);r4Set(m,26,22,T.MAT);m.warps['26,22']={map:ROUTE4_INNER,x:15,y:29,dir:0};
  r4Sign(m,13,3,'第4街道\n北：モミノキ街　南：ツユクサ野\n本道は 東の 木橋へ。');r4Sign(m,11,8,'木こりの 小道。先丸の 万能工具で 茂みを 開こう。');r4Sign(m,27,22,'渓流の 奥地への 小道');
  for(const p of [[7,4,4,2],[26,5,3,3],[6,23,3,3],[25,25,3,3],[10,28,3,2],[23,29,4,1]])r4Patch(m,...p,r);
  r4Patch(m,25,28,4,2,r,true);
  r4Prop(m,12,21,'bench','木漏れ日の 休憩所。');r4Site(m,12,21,'rest');
  r4Prop(m,8,6,'crate','木こりが 置いた 荷物。');r4Prop(m,23,24,'pot','渓流の 花。');r4Prop(m,19,4,'flag','川沿いの 道しるべ。');
  r4Item(m,4,4,'fuda',1);r4Item(m,25,4,'heal1',2);r4Item(m,8,27,'repel',3);
  r4Site(m,5,11,'hidden',{key:'bank',item:'I0009',label:'木橋の そば'});r4Prop(m,5,11,'well','古い 河原の 石。');
 }else{
  r4Cliff(m,10,[10,11,23,24]);r4Rect(m,15,23,2,8,T.PATH);r4Path(m,15,23,10,19,2);r4Rect(m,10,11,2,4,T.PATH);r4Bridge(m,10,15,18);r4Path(m,10,11,10,4,2);r4Path(m,10,5,23,5,2);r4Path(m,23,5,23,14,2);
  r4Path(m,15,23,24,19,2);
  for(let y=15;y<=18;y++)for(let x=24;x<=25;x++)m.r4Repair.push([x,y]);
  // The eastern bridge is a shortcut only. The western bridge works from the beginning.
  r4Rect(m,24,19,2,3,T.PATH);
  for(const p of [[5,5,3,3],[18,5,3,2],[26,7,3,2],[6,12,3,2],[19,12,3,2],[6,24,3,3],[22,26,4,2]])r4Patch(m,...p,r);
  r4Patch(m,25,28,3,2,r,true);
  expExit(m,15,31,{map:ROUTE4_KEY,x:25,y:22,dir:3});r4Set(m,15,30,T.PATH);
  r4Sign(m,14,28,'渓流の 奥地\n西の 橋は 通行可能。東の 橋は 修理できる。');
  r4Prop(m,21,22,'board','木橋の 修理の 案内板。');r4Site(m,21,22,'repair');
  for(const [j,[x,y]] of [[4,24],[20,24],[7,12]].entries()){r4Set(m,x,y,T.GRASS);r4Prop(m,x,y,'crate','修理用の 板材。');r4Site(m,x,y,'plank',{i:j});}
  r4Prop(m,18,4,'flag','渓流の 展望地点。');r4Site(m,18,4,'view');
  r4Item(m,26,5,'heal1',4);r4Site(m,27,28,'hidden',{key:'flower',item:'I0026',label:'花の かげ'});r4Prop(m,27,28,'pot','白い 花が 咲く。');
 }
 for(const [z,tid,pid,x,y,dir,cls,team] of ROUTE4_TRAINERS.filter(t=>t[0]===zone)){
  r4Set(m,x,y,T.GRASS);m.objs.push({k:'npc',role:'trainer',tid,pid,spr:pSpr(pid),name:pFull(pid),cls,x,y,dir,los:3,team:team.map(([sp,lv])=>({sp,lv})),money:team.at(-1)[1]*28});
 }
 for(const [x,y] of (main?[[3,8],[10,3],[28,8],[3,19],[9,19],[28,20],[4,29],[28,29]]:[[3,3],[28,3],[4,8],[27,11],[4,20],[28,21],[3,29],[29,29]]))if(m.t[y*32+x]===T.GRASS&&!occupied(m,x,y)&&!m.warps[x+','+y]&&!expAt(m,x,y))r4Set(m,x,y,T.TREE);
 m.r4Flowers=[];for(let y=2;y<30;y++)for(let x=2;x<30;x++)if(m.t[y*32+x]===T.FLOWER)m.r4Flowers.push([x,y,(x*7+y*13)%24]);
 return m;
}
function route4State(s=S){const p=HitokariUpgrade.progress(s);if(!p.route4||typeof p.route4!=='object'||Array.isArray(p.route4))p.route4={};return p.route4;}
function route4Restore(m){if(!m.route4||!S)return;const q=route4State();let dirty=false;for(const [x,y] of m.r4Shrubs){const v=q['cut:'+x+','+y]?T.PATH:T.SHRUB;if(m.t[y*32+x]!==v){r4Set(m,x,y,v);dirty=true;}}
 for(const [x,y] of m.r4Repair){const v=q.repaired?T.PATH:T.WATER;if(m.t[y*32+x]!==v){r4Set(m,x,y,v);dirty=true;}if(q.repaired)expPut(m,x,y,{kind:'bridge',dir:0});else delete m.adv[x+','+y];}
 if(dirty)m.rn=null;
}
function route4SafeSpawn(m,x,y){const ok=(a,b)=>Number.isInteger(a)&&Number.isInteger(b)&&a>=0&&b>=0&&a<32&&b<32&&!SOLID[m.t[b*32+a]]&&(m.t[b*32+a]!==T.WATER||S?.surf&&S.bag.k_surf&&expAt(m,a,b)?.kind!=='fall')&&!occupied(m,a,b);if(ok(x,y))return[x,y];return m.route4==='main'?[15,2]:[15,29];}
async function route4SiteTalk(m,a){
 const q=route4State();
 if(a.kind==='rest'){if(await confirmYN('ここで 相棒を 休ませる？')){S.party.forEach(healMon);sfx('heal');await msg('みんな 元気に なった！');saveGame();}return;}
 if(a.kind==='repair'){
  if(q.repaired){await msg('修理した 木橋が 使える。');return;}
  if((q.planks||[]).length===3){if(!await confirmYN('板材3枚で 東の 木橋を 修理する？'))return;q.repaired=true;route4Restore(m);S.money+=600;sfx('get');await msg('木橋を 修理した！ 600Gの お礼を もらった。');saveGame();return;}
  q.repairStarted=true;await msg('西の 橋は 安全だ。東の 橋を 直すため、奥地の 板材3枚を 集めよう。 '+(q.planks||[]).length+'/3');saveGame();return;
 }
 if(a.kind==='plank'){if(!q.repairStarted){await msg('修理の 案内板を 読んで みよう。');return;}q.planks=q.planks||[];if(!q.planks.includes(a.i)){q.planks.push(a.i);sfx('get');saveGame();}await msg('板材を 確認した。 '+q.planks.length+'/3');return;}
 if(a.kind==='hidden'){if(q['hidden:'+a.key]){await msg('ここは もう 調べた。');return;}q['hidden:'+a.key]=true;bagAdd(a.item);sfx('get');await msg(a.label+'から '+ITEMS[a.item].n+'を 見つけた！');saveGame();return;}
 if(a.kind==='view'){if(!q.view){q.view=true;const p=HitokariUpgrade.progress(S);(p.landmarks||(p.landmarks={}))[m.id]=1;sfx('get');await msg('渓流の 観察記録を つけた。滝の 音が ひびいている。');saveGame();}else await msg('風景を 楽しもう。');}
}
function route4Interact(m,x,y){if(!m.route4)return false;const a=m.route4Sites[x+','+y];if(!a)return false;run(()=>route4SiteTalk(m,a));return true;}
function drawRoute4Ground(g,m,camx,camy){
 g.save();const t=G.t,x0=Math.max(0,Math.floor(camx/16)),x1=Math.min(31,x0+17),y0=Math.max(0,Math.floor(camy/16)),y1=Math.min(31,y0+15);
 for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
  const v=m.t[y*32+x],px=x*16-camx,py=y*16-camy,idx=(x*7+y*13)%12;
  if(v===T.PATH&&!expAt(m,x,y))drawCell(g,'obj/route4/ground.svg',6,32,32,idx,px,py,16,16);
  if(v===T.FLOWER)drawCell(g,'obj/route4/ground.svg',6,32,32,12+idx,px,py,16,16);
  if(v===T.WATER&&!expAt(m,x,y)){g.fillStyle='rgba(89,164,186,.20)';g.fillRect(px,py,16,16);const f=reducedFx()?0:Math.sin(t/25-x*.8+y*.5);g.strokeStyle=dayPhase()===2?'rgba(255,220,164,.5)':'rgba(221,248,249,.5)';g.lineWidth=.65;g.beginPath();g.moveTo(px+1,py+7+f);g.quadraticCurveTo(px+7,py+5+f,px+15,py+7+f);g.stroke();}
 }
 if(m.route4==='main'){const x=26*16-camx,y=22*16-camy;g.fillStyle='#cce0b2';g.fillRect(x+3,y+3,10,10);g.fillStyle='#48764c';g.beginPath();g.moveTo(x+8,y+4);g.lineTo(x+4,y+11);g.lineTo(x+12,y+11);g.fill();}
 g.restore();
}
function drawRoute4Atmosphere(g,m,cx,cy){g.save();const night=dayPhase()===3;
 if(night){const spots=m.route4==='main'?[[27,6,358],[24,26,358]]:[[5,5,927],[20,12,927],[25,26,358]];for(const [x,y,id] of spots){const px=x*16-cx,py=y*16-cy;if(px<-30||py<-30||px>LW+30||py>LH+30)continue;const r=g.createRadialGradient(px+8,py+5,1,px+8,py+5,20);r.addColorStop(0,id===358?'rgba(255,190,70,.40)':'rgba(103,224,176,.30)');r.addColorStop(1,'rgba(200,230,180,0)');g.fillStyle=r;g.fillRect(px-12,py-15,40,40);const c=monCanvas(id,false,false,false);drawIndividualMotion(g,animaPreviewMon(id,false),c,px-3,py-12,22,1,0,0,false,'idle');}}
 if(reducedFx()){g.restore();return;}g.fillStyle=night?'rgba(255,205,103,.65)':'rgba(244,250,211,.5)';for(let j=0;j<12;j++){const x=((j*73+G.t*.26-cx)%(LW+32)+LW+32)%(LW+32)-16,y=((j*53+Math.sin(G.t/43+j)*9-cy)%(LH+24)+LH+24)%(LH+24)-12;g.beginPath();g.ellipse(x,y,night?1:.8,night?.8:.45,0,0,Math.PI*2);g.fill();}g.restore();}
function drawRoute4HUD(m){if(UI.length||G.banner&&G.banner.t>0)return;ctx.fillStyle='rgba(34,65,45,.82)';ctx.fillRect(4,4,134,15);tx((m.route4==='main'?'木漏れ日の 渓流街道 Lv9～12':'渓流の 奥地 Lv11～13'),8,7,'#fff5d5',8);}
let R4_SOUND_MAP='',R4_SOUND_NEXT=0;
function route4AmbientAudio(){if(!S||!G.map?.route4||G.scene!=='world'||G.busy||!SND||!AC)return;if(R4_SOUND_MAP!==G.map.id){R4_SOUND_MAP=G.map.id;R4_SOUND_NEXT=G.t+80;}if(G.t<R4_SOUND_NEXT)return;R4_SOUND_NEXT=G.t+160+(G.t%90);sfx(dayPhase()===3?'r4Chime':Math.abs(G.pl.y-(G.map.route4==='main'?14:16))<5?'haruWater':'haruBird');}

async function route4TrainerTalk(o){
 if(o.beaten){if(await trainerRematch(o))return;await msg('「木漏れ日の 道を 楽しんでね。」');return;}
 if(!S.party.some(m=>m.hp>0))return;
 await msg('「渓流を 渡る前に 腕を ためそう！」');
 const result=await battle({trainer:{name:o.cls+'の '+o.name,team:mkTeam(o.team,10),money:o.money,spr:o.spr}});
 if(result==='lose'){await blackout();return;}if(result!=='win')return;
 const key='t:'+G.map.id+':'+o.tid;S.flags[key]=1;o.beaten=true;HitokariUpgrade.noteMatch(S,key);saveGame();
}
