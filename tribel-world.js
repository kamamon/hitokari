'use strict';
const TRIBEL_MAPS={main:TRIBEL_KEY,lake:'a:tribel-lake:0,0',hill:'a:tribel-hill:0,0'};
const TRIBEL_LABELS={meadow:'中央草原',deep:'草原の奥地',rock:'岩石地帯',flowers:'花畑',lake:'しずく湖',hill:'風見の丘'};
const TRIBEL_TRAINERS=[
 ['main',201,103,18,25,'草原ランナー',[[546,7],[711,8]]],['main',202,203,25,9,'岩石の観察員',[[265,8],[765,9]]],
 ['main',203,1403,21,22,'草原の双戦組',[[1188,8]],'grass'],['main',204,1404,24,22,'草原の双戦組',[[190,8]],'grass'],
 ['lake',205,303,23,7,'水辺の観察員',[[334,8],[717,9]]],['lake',206,403,24,24,'花畑の探索者',[[190,9],[283,10]]],
 ['hill',207,1503,10,6,'風見の双戦組',[[1062,10]],'hill'],['hill',208,1504,13,6,'風見の双戦組',[[546,11]],'hill']
];
function tribelSet(m,x,y,t){if(x>=0&&x<m.W&&y>=0&&y<m.H)m.t[y*m.W+x]=t;}
function tribelRect(m,x,y,w,h,t){for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)tribelSet(m,i,j,t);}
function tribelEllipse(m,cx,cy,rx,ry,t,r){for(let y=Math.max(2,Math.floor(cy-ry));y<=Math.min(29,Math.ceil(cy+ry));y++)for(let x=Math.max(2,Math.floor(cx-rx));x<=Math.min(29,Math.ceil(cx+rx));x++)if(((x-cx)/rx)**2+((y-cy)/ry)**2<1+(r?r()*.15:0))tribelSet(m,x,y,t);}
function tribelPath(m,x,y,x2,y2,width=1){for(let a=Math.min(x,x2);a<=Math.max(x,x2);a++)for(let j=0;j<width;j++)tribelSet(m,a,y+j,T.PATH);for(let b=Math.min(y,y2);b<=Math.max(y,y2);b++)for(let j=0;j<width;j++)tribelSet(m,x2+j,b,T.PATH);}
function tribelSite(m,x,y,kind,label,extra={}){m.tribelSites[x+','+y]={kind,label,...extra};}
function tribelSign(m,x,y,text){tribelSet(m,x,y,T.SIGN);m.signs[x+','+y]=text;}
function tribelPortal(m,x,y,zone){tribelSet(m,x,y,T.MAT);m.warps[x+','+y]={map:TRIBEL_MAPS[zone],x:15,y:29,dir:0};tribelSite(m,x,y,'portal',zone==='lake'?'しずく湖':'風見の丘');}
function tribelItem(m,x,y,item,iid){tribelSet(m,x,y,T.GRASS);m.objs.push({k:'item',iid:'tribel-'+iid,x,y,item});}
function tribelBlock(m,x,y,id,say){m.objs.push({k:'haruprop',id,x,y,say});}
function tribelFloralPatch(m,cx,cy,rx,ry,r){for(let y=cy-ry;y<=cy+ry;y++)for(let x=cx-rx;x<=cx+rx;x++){if(x<2||y<2||x>29||y>29||m.t[y*32+x]!==T.GRASS||((x-cx)/(rx+.4))**2+((y-cy)/(ry+.4))**2>1)continue;if(r.chance(.7)){tribelSet(m,x,y,T.FLOWER);m.tribelFlowers.push([x,y,(x*13+y*7)%24]);}}}
function genTribelMap(zone,cell=CELLS[TRIBEL_KEY]){
 if(!TRIBEL_MAPS[zone]||cell.key!==TRIBEL_KEY)throw Error('tribel map');
 const m=newMap(TRIBEL_MAPS[zone],cell,32,32,T.GRASS),r=RNG('tribel-v112:'+zone);m.tribel=zone;m.border=T.TREE;m.exits=zone==='main'?[0,1,1,0]:[0,0,0,0];m.adv={};m.elevation=new Uint8Array(1024);m.tribelSites={};m.tribelFlowers=[];m.enc={rate:zone==='hill'?12:9,bonus:0};
 if(zone!=='main')m.advArea='tribel-'+zone;m.name=zone==='main'?'トリベル平原':zone==='lake'?'トリベル平原・しずく湖':'トリベル平原・風見の丘';
 m.advEnc={...cell,tribelZone:zone==='main'?'meadow':zone,water:[]};
 for(let y=0;y<32;y++)for(let x=0;x<32;x++)if(x<2||y<2||x>29||y>29)tribelSet(m,x,y,T.TREE);
 if(zone==='main'){
  for(const [x,y,rx,ry] of [[7,7,5,5],[16,6,4,3],[25,9,4,5],[7,24,5,4],[25,23,4,3]])tribelEllipse(m,x,y,rx,ry,T.TALL,r);
  tribelEllipse(m,7,15,4.6,5.5,T.WATER,r);
  for(const [x,y,rx,ry] of [[24,5,2,2],[27,11,2,2],[5,4,1,1],[11,27,1,1]])tribelEllipse(m,x,y,rx,ry,T.ROCK,r);
  tribelFloralPatch(m,25,26,4,3,r);tribelFloralPatch(m,13,10,2,3,r);tribelFloralPatch(m,8,21,2,2,r);
  tribelRect(m,15,15,2,17,T.PATH);tribelRect(m,15,15,17,2,T.PATH);
  tribelPath(m,15,15,13,9,2);tribelPath(m,13,9,13,4);tribelPath(m,15,21,12,21);tribelPath(m,12,21,12,17);
  tribelPath(m,15,16,20,10);tribelPath(m,20,10,20,4);tribelPath(m,16,25,22,25);
  for(let x=7;x<=12;x++){const water=m.t[17*32+x]===T.WATER;tribelSet(m,x,17,T.PATH);if(water)expPut(m,x,17,{kind:'bridge',dir:1});}
  for(let y=17;y<=20;y++){const water=m.t[y*32+7]===T.WATER;tribelSet(m,7,y,T.PATH);if(water)expPut(m,7,y,{kind:'bridge',dir:0});}
  tribelPortal(m,5,20,'lake');tribelPath(m,5,21,7,21);tribelPortal(m,20,4,'hill');
  tribelSign(m,14,29,'トリベル平原\n南：第2街道　東：第3街道\nしずく湖は 西、風見の丘は 北東。');
  tribelSign(m,6,21,'しずく湖への 小道');tribelSign(m,19,4,'風見の丘への 小道');tribelSign(m,27,14,'第3街道・モミノキ街へ');
  tribelBlock(m,13,23,'bench','旅人の 休憩所。');tribelBlock(m,11,23,'pot','花が きれいだ。');tribelSite(m,13,23,'rest','休憩所');
  tribelSite(m,24,4,'hidden','石の すきま',{item:'I0009',key:'rock'});tribelItem(m,10,7,'heal1',1);tribelItem(m,25,27,'fuda',2);
  m.objs.push({k:'npc',role:'tribelguide',guide:'double',pid:104,spr:pSpr(104),x:12,y:24,dir:2});
  m.herd={y:27,x0:4,x1:10,ids:[546,546,547]};for(let x=4;x<=10;x++)tribelSet(m,x,27,T.GRASS);
 }else if(zone==='lake'){
  tribelEllipse(m,12,12,9,8,T.WATER,r);tribelEllipse(m,9,12,2,1.6,T.ROCK,r);
  for(const [x,y,rx,ry] of [[6,5,3,3],[24,10,4,5],[8,24,4,3],[26,24,3,4]])for(let yy=y-ry;yy<=y+ry;yy++)for(let xx=x-rx;xx<=x+rx;xx++)if(xx>=2&&yy>=2&&xx<=29&&yy<=29&&m.t[yy*32+xx]===T.GRASS&&((xx-x)/rx)**2+((yy-y)/ry)**2<1)tribelSet(m,xx,yy,T.TALL);
  tribelFloralPatch(m,24,23,5,5,r);tribelFloralPatch(m,8,23,3,3,r);tribelFloralPatch(m,24,6,4,3,r);
  tribelPath(m,15,29,15,21,2);tribelPath(m,15,21,23,21);tribelPath(m,23,21,23,6);
  for(let x=3;x<=23;x++){const water=m.t[16*32+x]===T.WATER;tribelSet(m,x,16,T.PATH);if(water)expPut(m,x,16,{kind:'bridge',dir:1});}
  tribelPath(m,3,16,3,24);tribelPath(m,3,24,15,24);expExit(m,15,31,{map:TRIBEL_KEY,x:5,y:21,dir:2});tribelSet(m,15,30,T.PATH);
  tribelSign(m,14,28,'しずく湖\n水辺の アニマを 観察しよう。釣り場は 準備中。');
  tribelBlock(m,21,20,'bench','しずく湖を 見わたせる。');tribelSite(m,21,20,'view','湖の 観察記録',{key:'lake'});tribelItem(m,5,6,'repel',3);tribelSite(m,25,27,'hidden','花の かげ',{item:'heal1',key:'lake-flower'});
 }else{
  for(let y=2;y<=29;y++)for(let x=2;x<=29;x++)m.elevation[y*32+x]=y<10?2:y<18?1:0;
  for(const [x,y,rx,ry] of [[7,5,4,3],[25,5,4,3],[7,14,4,3],[25,14,4,3],[7,24,4,3],[25,24,4,3]])tribelEllipse(m,x,y,rx,ry,T.TALL,r);
  for(const [x,y] of [[6,7],[26,7],[6,16],[25,16]])tribelEllipse(m,x,y,1.5,1.5,T.ROCK,r);
  for(const y of [10,18])for(let x=2;x<=29;x++){tribelSet(m,x,y,T.ROCK);expPut(m,x,y,{kind:'cliff'});}
  tribelPath(m,15,29,12,22,2);tribelPath(m,12,22,12,3,2);tribelPath(m,21,26,21,3,2);tribelPath(m,12,6,21,6,2);tribelPath(m,12,14,21,14,2);tribelPath(m,12,24,21,24,2);
  for(const y of [10,18])for(const x of [12,13,21,22]){tribelSet(m,x,y,T.PATH);expPut(m,x,y,{kind:'stairs'});}
  for(const y of [9,17])for(const x of [12,13,21,22])expPut(m,x,y,{kind:'stairs'});
  tribelFloralPatch(m,16,5,4,2,r);tribelFloralPatch(m,16,15,3,2,r);
  expExit(m,15,31,{map:TRIBEL_KEY,x:20,y:5,dir:2});tribelSet(m,15,30,T.PATH);
  tribelSign(m,14,28,'風見の丘\n二つの 階段から 丘を のぼろう。');
  tribelBlock(m,17,3,'flag','風見の 丘の 旗だ。');tribelSite(m,17,3,'view','風の 観察記録',{key:'hill'});
  m.objs.push({k:'npc',role:'tribelguide',guide:'rival',pid:4,spr:pSpr(4),x:16,y:5,dir:2});tribelItem(m,25,4,'I0026',4);
 }
 for(const [z,tid,pid,x,y,cls,team,pair] of TRIBEL_TRAINERS.filter(t=>t[0]===zone)){tribelSet(m,x,y,T.GRASS);m.objs.push({k:'npc',role:'tribeltrainer',tid,pid,spr:pSpr(pid),name:pFull(pid),cls,x,y,dir:2,tribelPair:pair||null,team:team.map(([sp,lv])=>({sp,lv})),money:pair?150:220,los:0});}
 // Ensure rock reward is adjacent to walkable terrain.
 if(zone==='main')tribelSet(m,23,4,T.GRASS);
 m.tribelFlowers=m.tribelFlowers.filter(([x,y])=>m.t[y*32+x]===T.FLOWER);return m;
}
function tribelSafeSpawn(m,x,y){const ok=(a,b)=>Number.isInteger(a)&&Number.isInteger(b)&&a>=0&&b>=0&&a<m.W&&b<m.H&&!SOLID[m.t[b*m.W+a]]&&!m.objs.some(o=>o.x===a&&o.y===b);return ok(x,y)?[x,y]:[15,29];}
async function tribelTrainerTalk(o){
 if(o.beaten){await msg(o.name+'「いい 勝負だったね。モミノキ街で また 会おう！」');return;}
 if(!S.party.some(m=>m.hp>0)){await msg('相棒を 元気にしてから 挑戦しよう。');return;}
 const map=G.map.id,pair=o.tribelPair&&S.party.filter(m=>m.hp>0).length>=2?G.objs.filter(x=>x.role==='tribeltrainer'&&x.tribelPair===o.tribelPair&&!x.beaten):[o],group=pair.length===2?pair:[o],multi=group.length===2;
 if(!await confirmYN(multi?'ふたりの トレーナーと ダブルバトルを する？':o.name+'と 勝負する？'))return;
 const teams=group.map(x=>mkTeam(x.team,10)),opt={double:multi,trainer:{name:group.map(x=>x.name).join(' と '),team:teams.flat(),money:group.reduce((s,x)=>s+x.money,0),spr:o.spr}};
 if(multi){opt.multi=group.map(x=>({name:x.name,spr:x.spr,pid:x.pid}));opt.ownerByIndex=teams.flatMap((t,j)=>t.map(()=>j));}
 for(const q of group)metPerson(q.pid);const res=await battle(opt);if(res==='lose'){await blackout();return;}
 if(res==='win'){for(const q of group){q.beaten=true;S.flags['t:'+map+':'+q.tid]=1;HitokariUpgrade.noteMatch(S,'t:'+map+':'+q.tid);}await msg(multi?'ふたりとの 勝負に 勝った！':'よい 勝負だった！');saveGame();}
}
async function tribelGuideTalk(o){
 if(o.guide==='double'){await msg('深い 草では 野生の アニマが 2体で 出てくるよ。元気な 相棒が2匹 いれば ダブルバトルに なる。\n技と 味方の 組み合わせを 考えよう。');if(!S.flags['tribel:tutorial']){S.flags['tribel:tutorial']=1;bagAdd('heal1',2);await msg('小さなケアスプレーを 2個 もらった！');saveGame();}return;}
 if(o.guide==='rival'){await msg('ライバル「風が 気持ちいいな！ 次は モミノキ街だ。お互いの 相棒、もっと 強く そだてよう！」');if(!S.flags['tribel:rival']){S.flags['tribel:rival']=1;for(const q of S.party)HitokariUpgrade.bond(q,3);saveGame();}}
}
async function tribelSiteTalk(m,a){
 if(a.kind==='rest'){if(await confirmYN('風の 休憩所で 相棒たちを 休ませる？')){S.party.forEach(healMon);sfx('heal');await msg('みんな 元気に なった！');saveGame();}return;}
 if(a.kind==='portal'){await msg(a.label+'へは 入口を 歩いて 進もう。');return;}
 const flag='tribel:'+a.key;if(S.flags[flag]){await msg(a.kind==='view'?'風景を ゆっくり 楽しもう。':'ここは もう 調べた。');return;}
 S.flags[flag]=1;sfx('get');if(a.kind==='hidden'){bagAdd(a.item);await msg(a.label+'から '+ITEMS[a.item].n+'を 見つけた！');}
 else{await msg(a.label+'を 旅の 記録に つけた！');const p=HitokariUpgrade.progress(S);(p.landmarks||(p.landmarks={}))[m.id]=1;}saveGame();
}
function tribelInteract(m,x,y){if(!m.tribel)return false;const a=m.tribelSites[x+','+y];if(!a)return false;run(()=>tribelSiteTalk(m,a));return true;}
function drawTribelGround(g,m,camx,camy){
 g.save();const t=G.t;
 for(const [x,y,i] of m.tribelFlowers){const px=x*16-camx,py=y*16-camy;if(m.t[y*32+x]!==T.FLOWER||px<-16||py<-16||px>LW||py>LH)continue;drawCell(g,'obj/harusaki/flowers.svg',6,32,32,i,px,py,16,16);}
 const x0=Math.max(0,Math.floor(camx/16)),x1=Math.min(31,x0+16),y0=Math.max(0,Math.floor(camy/16)),y1=Math.min(31,y0+14);
 for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const v=m.t[y*32+x],px=x*16-camx,py=y*16-camy;
  if(v===T.WATER){const f=Math.sin(t/28+x*.8+y*.6);g.strokeStyle=dayPhase()===2?'rgba(255,202,130,.45)':'rgba(220,247,248,.38)';g.lineWidth=.55;g.beginPath();g.moveTo(px+2,py+8+f);g.quadraticCurveTo(px+8,py+7+f,px+14,py+8+f);g.stroke();}
  if(v===T.GRASS&&h2(x,y,20)<.25){g.strokeStyle='#739953';g.lineWidth=.6;const d=reducedFx()?0:Math.sin(t/26+x*.65+y*.4)*1.6;g.beginPath();g.moveTo(px+5,py+13);g.lineTo(px+3+d,py+8);g.moveTo(px+8,py+13);g.lineTo(px+8+d,py+7);g.stroke();}
 }
 if(m.herd){const q=m.herd;for(let j=0;j<q.ids.length;j++){const u=reducedFx()?.32:(t/220+j*.24)%1,x=(q.x0+(q.x1-q.x0)*u)*16-camx,y=q.y*16-camy+j*2;if(x<-32||x>LW+32||y<-32||y>LH+16)continue;haruEllipse(g,x+12,y+13,7,2.2,'rgba(30,55,30,.14)');const id=q.ids[j],c=monCanvas(id,false,true,false);drawIndividualMotion(g,animaPreviewMon(id),c,x-1,y-11,26,1,0,0,false,reducedFx()?'idle':'run');}}
 for(const [key,a] of Object.entries(m.tribelSites)){if(a.kind!=='portal')continue;const [x,y]=key.split(',').map(Number),px=x*16-camx,py=y*16-camy;if(px<-16||px>LW||py<-16||py>LH)continue;g.fillStyle='#c9e1bd';g.fillRect(px+2,py+2,12,12);g.strokeStyle='#4a7953';g.lineWidth=.8;g.strokeRect(px+2,py+2,12,12);g.beginPath();g.moveTo(px+8,py+4);g.lineTo(px+4,py+10);g.lineTo(px+12,py+10);g.closePath();g.fillStyle='#4d8054';g.fill();}
 g.restore();
}
function drawTribelAtmosphere(g,m,camx,camy){if(reducedFx())return;g.save();const t=G.t,night=dayPhase()===3;g.fillStyle=night?'rgba(218,235,157,.72)':'rgba(255,242,209,.70)';for(let i=0;i<13;i++){const x=((i*71+t*(night?.13:.65)-camx)%(LW+40)+LW+40)%(LW+40)-20,y=((i*53+Math.sin(t/50+i)*12-camy)%(LH+32)+LH+32)%(LH+32)-16;g.beginPath();g.ellipse(x,y,night?.65:1.4,night?.65:.6,i,0,Math.PI*2);g.fill();}g.restore();}
function drawTribelHUD(m){if(UI.length||G.banner&&G.banner.t>0)return;const z=tribelZoneAt(m,G.pl.x,G.pl.y),lv=TRIBEL_ZONES[z].levels;ctx.fillStyle='rgba(39,66,48,.78)';ctx.fillRect(4,4,110,15);tx(TRIBEL_LABELS[z]+' Lv'+lv.join('～'),9,7,'#fff7dc',8);}
let TRIBEL_SOUND_NEXT=0,TRIBEL_SOUND_MAP='';
function tribelAmbientAudio(){if(!S||!G.map?.tribel||G.scene!=='world'||G.busy||!SND||!AC)return;if(TRIBEL_SOUND_MAP!==G.map.id){TRIBEL_SOUND_MAP=G.map.id;TRIBEL_SOUND_NEXT=G.t+100;}if(G.t<TRIBEL_SOUND_NEXT)return;TRIBEL_SOUND_NEXT=G.t+180+G.t%100;sfx(G.map.tribel==='lake'?'haruWater':dayPhase()===3?'haruNight':G.t%2?'haruWind':'haruBird');}
