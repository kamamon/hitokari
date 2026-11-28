'use strict';
const MOMI_KEY='2,0',MOMI_GYM='2,0:b2',MOMI_CAFE='2,0:b5';
const MOMI_BLD=[
 [3,9,'heal','clinic','巡環診療所',5,4],[23,9,'shop','shop','モミノキ道具屋',5,4],[12,3,'gym','gym','モミノキジム',7,5],
 [3,3,'momiwood','wood','モミノキ木工房',5,4],[23,3,'momitrain','train','アニマ訓練館',5,4],[3,20,'momicafe','cafe','年輪カフェ',5,4],
 [23,20,'momibike','bike','ツクルの自転車工房',5,4],[3,26,'house','house','森林整備員の家',5,4],[23,26,'house','house','街の民家',5,4]
];
// Fixed local roles, existing person IDs (no increase to the 2,000-person registry).
const MOMI_PEOPLE=[
 {id:11,key:'leader',name:'百瀬 ハルク',role:'ジムリーダー',color:'#486951',skin:'#d4a77e',hair:'#524336',schedule:[[0,2,6,1],[360,-1,10,8],[540,2,6,1],[1020,-1,18,18],[1200,2,6,1]]},
 {id:9,key:'bike',name:'工野 ツクル',role:'工具職人',color:'#527c86',skin:'#e1b996',hair:'#453932',schedule:[[0,6,4,1]]},
 {id:1601,key:'aoto',name:'青木 アオト',role:'ジムの弟子',color:'#557c9f',skin:'#e5bc9a',hair:'#433a32',schedule:[[0,2,1,9]]},
 {id:1602,key:'yuina',name:'結城 ユイナ',role:'ジムの弟子',color:'#ad7781',skin:'#e8c4a1',hair:'#765043',schedule:[[0,2,11,9]]},
 {id:806,key:'wood',name:'杉森 スギノ',role:'木工職人',color:'#94734e',skin:'#c79774',hair:'#7c7c70',schedule:[[0,3,4,2]]},
 {id:503,key:'nurse',name:'雪村 リッカ',role:'診療所受付',color:'#c18b91',skin:'#f2cfaa',hair:'#70473b',schedule:[[0,0,4,1]]},
 {id:603,key:'clerk',name:'三木 ミツキ',role:'道具屋店主',color:'#4d8393',skin:'#d8b28b',hair:'#524b3d',schedule:[[0,1,3,1]]},
 {id:1203,key:'cafe',name:'木葉 コノハ',role:'カフェ店主',color:'#b07b50',skin:'#e4bc97',hair:'#8c5637',schedule:[[0,5,4,1]]},
 {id:1803,key:'forest',name:'凪野 ナギト',role:'森林整備員',color:'#708350',skin:'#caa079',hair:'#4b4236',schedule:[[0,7,3,3],[360,-1,9,9],[720,-1,21,10],[1020,-1,10,24],[1200,7,3,3]]},
 {id:203+10,key:'child',name:'春木 シュン',role:'子ども',color:'#c29b4e',skin:'#e5b892',hair:'#56402d',schedule:[[0,8,3,3],[420,-1,12,18],[720,-1,20,17],[1080,8,3,3]]},
 {id:1403+10,key:'keeper',name:'実森 ミト',role:'アニマの世話係',color:'#aa8ba9',skin:'#eac5a6',hair:'#49413d',schedule:[[0,7,6,4],[360,-1,21,23],[600,4,5,3],[1020,-1,19,23],[1200,7,6,4]]},
 {id:1903,key:'guide',name:'葉月 ハズキ',role:'街の案内人',color:'#b0a26d',skin:'#d5ad89',hair:'#62584b',schedule:[[0,-1,3,14],[360,-1,3,14],[720,-1,10,17],[1020,-1,12,22]]}
];
const MOMI_NAMES=Object.fromEntries(MOMI_PEOPLE.map(p=>[p.id,p]));
const MOMI_GUEST_NAMES=Object.fromEntries(MomiCafe.roster.map(g=>[g.pid,g]));
const MOMI_PETS=[
 {id:'horse',sp:546,x:9,y:7,targets:[[9,7],[10,9],[11,7]]},{id:'badger',sp:11,x:9,y:5,targets:[[9,5],[10,6]]},
 {id:'mouse',sp:451,x:22,y:13,targets:[[22,13],[21,12]]},{id:'bird',sp:717,x:22,y:7,targets:[[22,7],[21,6]]},
 {id:'seed',sp:274,x:20,y:21,targets:[[20,21],[21,23]]},{id:'tanuki',sp:516,x:10,y:27,targets:[[10,27],[11,26]]}
];
const MOMI_WOOD=[[9,4],[10,7],[21,5]],MOMI_BIKE=[[15,23],[11,18],[16,9]];
const MOMI_GYM_TEAM=[
 {sp:516,lv:10,moves:['ぶつかる','こだまごえ','すごみ']},
 {sp:717,lv:10,moves:['はねうち','せんこうづき','なきおどし']},
 {sp:546,lv:11,moves:['きりさきづめ','せんこうづき','なきおどし','ぶつかる']}
];
const momiMap=slot=>slot<0?MOMI_KEY:MOMI_KEY+':b'+slot;
function momiBuildings(){return MOMI_BLD.map(([x,y,kind,momiArt,label,bw,bh],slot)=>({slot,x,y,kind,momiArt,label,bw,bh,cx:x+Math.floor(bw/2),doorY:y+bh-1}));}
function momiState(s=S){const p=HitokariUpgrade.progress(s);if(!p.momino||typeof p.momino!=='object'||Array.isArray(p.momino))p.momino={};return p.momino;}
function momiSet(m,x,y,v){if(x>=0&&y>=0&&x<m.W&&y<m.H)m.t[y*m.W+x]=v;}
function momiRect(m,x,y,w,h,v){for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)momiSet(m,i,j,v);}
function momiSign(m,x,y,text){momiSet(m,x,y,T.SIGN);m.signs[x+','+y]=text;}
function momiSite(m,x,y,kind,extra={}){m.momiSites[x+','+y]={kind,...extra};}
function momiProp(m,x,y,id,say,extra={}){m.objs.push({k:'momiprop',id,x,y,say,...extra});}
function momiActor(m,p,slot){
 const t=p.schedule.find(v=>v[1]===slot);if(!t)return;
 // The leader is always callable at the arena, even when his town schedule says otherwise.
 if(p.key==='leader'&&slot===2)return;
 const role=p.key==='nurse'?'nurse':p.key==='clerk'?'clerk':p.key==='aoto'||p.key==='yuina'?'momipupil':'momiresident';
 m.objs.push({k:'npc',role,momiActor:p.key,pid:p.id,spr:pSpr(p.id),x:t[2],y:t[3],dir:2});
}
function momiTemplates(m,slot){for(const p of MOMI_PEOPLE)momiActor(m,p,slot);if(slot<0)for(const p of MOMI_PETS)m.objs.push({k:'momipet',momiActor:'pet:'+p.id,sp:p.sp,x:p.x,y:p.y,dir:2});}
function momiTown(cell){
 const m=newMap(cell.key,cell,32,32,T.GRASS);m.momi=true;m.momiSlot=-1;m.name='モミノキ街';m.border=T.TREE;m.exits=cell.ex.slice();m.adv={};m.momiSites={};m.enc=null;
 for(let y=0;y<32;y++)for(let x=0;x<32;x++)if(x<2||x>29||y<2||y>29)momiSet(m,x,y,T.TREE);
 // Road footprints match the world exits. No gym badge is required to walk through town.
 momiRect(m,15,8,2,24,T.PATH);momiRect(m,0,15,22,2,T.PATH);
 for(const y of [8,13,19,24,30])momiRect(m,5,y,21,1,T.PATH);
 momiRect(m,11,14,10,6,T.PATH);momiRect(m,5,7,1,24,T.PATH);momiRect(m,25,7,1,24,T.PATH);
 for(const b of momiBuildings()){
  const roof=b.kind==='gym'?T.ROOF_G:b.kind==='heal'?T.ROOF_H:b.kind==='shop'?T.ROOF_S:T.ROOF;
  momiRect(m,b.x,b.y,b.bw,b.bh-2,roof);momiRect(m,b.x,b.y+b.bh-2,b.bw,2,T.WALL);
  momiSet(m,b.x+1,b.doorY-1,T.WINDOW);momiSet(m,b.x+b.bw-2,b.doorY-1,T.WINDOW);momiSet(m,b.cx,b.doorY,T.DOOR);momiSet(m,b.cx,b.doorY+1,T.PATH);
  const entry=b.slot===0?[5,7]:b.slot===2?[6,15]:[5,8];
  m.warps[b.cx+','+b.doorY]={map:momiMap(b.slot),x:entry[0],y:entry[1],dir:0};m.blds.push(b);
 }
 for(const [x,y] of [[10,3],[20,3],[10,10],[21,6],[10,20],[21,20],[9,26],[22,26],[13,25],[18,25],[9,29],[22,29]])if(m.t[y*32+x]===T.GRASS)momiSet(m,x,y,T.TREE);
 // Keep the compass-like year-ring plaza walkable. Props are placed beside paths.
 for(const [x,y,id] of [[12,13,'lamp'],[19,13,'lamp'],[12,21,'lamp'],[19,21,'lamp'],[10,17,'bench'],[21,17,'bench'],[10,25,'bench'],[20,25,'planter'],[8,5,'woodstack'],[21,4,'sawhorse'],[8,13,'crate'],[23,13,'barrel'],[8,24,'signpost'],[23,24,'bikeRack'],[9,21,'planter'],[22,21,'planter'],[13,27,'pinecone'],[18,27,'pinecone']]){
  if(m.t[y*32+x]!==T.TREE)momiProp(m,x,y,id,'モミノキ街の ものづくりを 感じる。');
 }
 for(const [j,[x,y]] of MOMI_WOOD.entries()){momiSet(m,x,y,T.GRASS);momiSite(m,x,y,'wood',{i:j});momiProp(m,x,y,'log','木工房の 材木。');}
 for(const [j,[x,y]] of MOMI_BIKE.entries()){momiSet(m,x,y,T.PATH);momiSite(m,x,y,'bike',{i:j});}
 momiSign(m,3,17,'モミノキ街\n北：ジム　南：第4街道\n西：第3街道');
 momiSign(m,11,9,'年輪の 道場 モミノキジム\nリーダー：百瀬ハルク　無タイプ');
 momiSign(m,14,29,'南：第4街道へ');
 expPut(m,2,3,{kind:'portal',area:'ridge',label:'段丘の森'});expPut(m,29,3,{kind:'portal',area:'river',label:'水晶瀑布'});
 expPut(m,29,18,{kind:'portal',area:'life',label:'モミノキ街・生活区'});expPut(m,20,28,{kind:'berry',plot:0});
 momiTemplates(m,-1);return m;
}
function momiGymSpec(){return{k:1,mode:1,type:0,n:4,name:'モミノキジム・年輪の四灯',order:[0,1,2,3],target:5,labels:['根','幹','枝','実'],clue:'大地を 支える ものと、風を 受ける ものに 光を 灯せ。\n根・幹・枝・実の 四つの 灯り。',revision:'momi-v114'};}
function momiGymRoom(cell,b){
 const m=room(momiMap(b.slot),cell,13,17);m.momi=true;m.momiSlot=2;m.momiGym=true;m.bk='gym';m.name='モミノキジム・年輪の四灯';m.adv={};m.momiSites={};m.gymPuzzle=momiGymSpec();
 for(let x=1;x<12;x++)momiSet(m,x,4,x===6?T.FLOOR:T.IWALL);expPut(m,6,4,{kind:'gymgate'});
 for(let y=2;y<=3;y++)for(let x=3;x<=9;x++)momiSet(m,x,y,T.RUG);
 for(let y=5;y<=15;y++)momiSet(m,6,y,T.RUG);
 for(const [j,[x,y]] of [[3,11],[3,7],[9,7],[9,11]].entries()){momiSet(m,x,y,T.RUG);expPut(m,x,y,{kind:'gymplate',i:j,step:false});}
 momiSet(m,3,14,T.RUG);expPut(m,3,14,{kind:'gymhint'});momiSet(m,9,14,T.RUG);expPut(m,9,14,{kind:'gymreset'});
 momiProp(m,2,5,'trainingPost','木の 訓練柱。');momiProp(m,10,5,'trainingPost','木の 訓練柱。');
 m.objs.push({k:'npc',role:'leader',gym:1,pid:11,spr:pSpr(11),x:6,y:1,dir:2});
 momiTemplates(m,2);
 momiSet(m,6,16,T.MAT);m.warps['6,16']={map:MOMI_KEY,x:b.cx,y:b.doorY+1,dir:2};
 return m;
}
function momiInterior(cell,slot){
 const b=momiBuildings()[slot];if(!b)throw Error('momi room '+slot);if(slot===2)return momiGymRoom(cell,b);
 const W=11,H=slot===0?9:10,m=room(momiMap(slot),cell,W,H);m.momi=true;m.momiSlot=slot;m.bk=b.kind;m.name=b.label;m.adv={};m.momiSites={};
 const set=(x,y,v)=>momiSet(m,x,y,v),prop=(x,y,id,say)=>momiProp(m,x,y,id,say);
 for(const x of [1,2,7,8,9])set(x,1,T.SHELF);
 if(slot===0){momiRect(m,1,2,7,1,T.COUNTER);set(3,1,T.HEALM);set(9,1,T.PC);prop(2,5,'bench','診療所の 待合席。');prop(8,5,'planter','観葉植物。');}
 else if(slot===1){momiRect(m,1,2,5,1,T.COUNTER);prop(8,4,'crate','道具の 箱。');prop(2,5,'barrel','旅の 品物。');}
 else if(slot===3){prop(2,3,'workbench','木工台。');prop(8,3,'sawhorse','作業台。');prop(2,6,'woodstack','木材の 束。');prop(8,6,'toolbox','職人の 工具。');}
 else if(slot===4){momiRect(m,3,4,5,2,T.RUG);prop(2,4,'trainingPost','練習用の 柱。');prop(8,4,'trainingPost','練習用の 柱。');prop(8,2,'board','相性と 交代の 学習。');momiSite(m,8,2,'training');}
 else if(slot===5){momiRect(m,2,2,5,1,T.COUNTER);prop(2,4,'cafeTable','年輪の テーブル。');prop(8,4,'cafeTable','年輪の テーブル。');prop(2,6,'stool','カフェの 椅子。');prop(8,6,'stool','カフェの 椅子。');prop(8,2,'coffee','焙煎した 木の実の 香り。');momiRect(m,4,5,3,3,T.RUG);m.objs.push({k:'npc',role:'momicafeguest',x:5,y:6,dir:2,pid:MomiCafe.guest(MomiCafe.day()).pid,spr:pSpr(MomiCafe.guest(MomiCafe.day()).pid)});}
 else if(slot===6){momiRect(m,2,2,5,1,T.COUNTER);prop(2,5,'bikeRack','組み立て中の 自転車。');prop(8,5,'toolbox','万能工具の 試作品。');prop(8,3,'wheel','予備の 車輪。');}
 else{prop(2,5,'bed','住民の ベッド。');prop(7,3,'cafeTable','木の テーブル。');prop(8,6,'planter','小さな モミノキ。');}
 const extras={0:[[1,4,'bottle'],[9,4,'bell']],1:[[1,4,'basket'],[9,5,'shelfSign']],3:[[1,4,'stackedBoards'],[9,4,'hammer'],[1,7,'chisel'],[9,7,'measuringTape']],4:[[1,6,'dumbbell'],[9,6,'target']],5:[[1,7,'cup'],[9,7,'cake'],[1,3,'menuBoard']],6:[[1,4,'pump'],[9,4,'wrench'],[1,7,'spareWheel'],[9,7,'toolCabinet']],7:[[1,3,'lantern'],[9,3,'woodenRing']],8:[[1,3,'floorMat']]}[slot]||[];for(const [x,y,id] of extras)if(!SOLID[m.t[y*m.W+x]]&&!m.objs.some(o=>o.x===x&&o.y===y))prop(x,y,id,'街の 職人が 作った 品だ。');
 momiTemplates(m,slot);for(const o of m.objs)if(o.momiActor&&SOLID[m.t[o.y*W+o.x]])set(o.x,o.y,T.FLOOR);
 set(5,H-1,T.MAT);set(5,H-2,T.FLOOR);m.warps['5,'+(H-1)]={map:MOMI_KEY,x:b.cx,y:b.doorY+1,dir:2};return m;
}
function momiSafeSpawn(m,x,y){
 const ok=(a,b)=>Number.isInteger(a)&&Number.isInteger(b)&&a>=0&&b>=0&&a<m.W&&b<m.H&&!SOLID[m.t[b*m.W+a]]&&!m.objs.some(o=>!o.momiActor&&o.x===a&&o.y===b);
 if(ok(x,y))return[x,y];return m.indoor?[Math.floor(m.W/2),m.H-2]:[15,19];
}
function momiTarget(o,minute=npcMinutes()){
 if(o.k==='momipet'){const p=MOMI_PETS.find(p=>'pet:'+p.id===o.momiActor);if(!p)return null;const pos=p.targets[Math.floor(minute/180)%p.targets.length];return{map:MOMI_KEY,x:pos[0],y:pos[1]};}
 const p=MOMI_PEOPLE.find(p=>p.key===o.momiActor);if(!p)return null;let s=p.schedule[0];for(const e of p.schedule)if(e[0]<=minute)s=e;return{map:momiMap(s[1]),x:s[2],y:s[3]};
}
function momiSpawn(m,o,out){
 const t=momiTarget(o);if(!t||t.map!==m.id)return false;
 const valid=(x,y)=>x>0&&y>0&&x<m.W-1&&y<m.H-1&&!SOLID[m.t[y*m.W+x]]&&!m.warps[x+','+y]&&!expAt(m,x,y)&&!m.objs.some(z=>!z.momiActor&&z.x===x&&z.y===y)&&!out.some(z=>z.x===x&&z.y===y)&&!(G.pl.x===x&&G.pl.y===y);
 for(let r=0;r<=3;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.abs(dx)+Math.abs(dy)!==r)continue;let x=t.x+dx,y=t.y+dy;if(valid(x,y)){o.x=x;o.y=y;return true;}}return false;
}
let MOMI_CURSOR=0;
function tickMomi(canInput){
 const m=G.map;if(!m?.momi)return;
 for(const o of G.objs){if(!o.momiActor||!o.npcMove)continue;const z=o.npcMove;z.t++;const f=Math.min(1,z.t/z.duration);o.ox=(z.x-o.x)*16*f;o.oy=(z.y-o.y)*16*f;if(f>=1){o.x=z.x;o.y=z.y;o.ox=o.oy=0;o.npcMove=null;}}
 if(!canInput||G.busy||G.t%6!==0)return;
 const guest=G.objs.find(o=>o.role==='momicafeguest');if(guest){const v=MomiCafe.guest(momiCafeDay());if(guest.pid!==v.pid){guest.pid=v.pid;guest.spr=pSpr(v.pid);chrPreload(guest.spr);}}
 for(const o of G.objs.slice())if(o.momiActor&&!o.npcMove&&momiTarget(o)?.map!==m.id&&Math.abs(o.x-G.pl.x)+Math.abs(o.y-G.pl.y)>2)removeObj(o);
 for(const z of m.objs)if(z.momiActor&&!G.objs.some(o=>o.momiActor===z.momiActor)){const o={...z,ox:0,oy:0,alert:0};if(momiSpawn(m,o,G.objs)){if(o.spr)chrPreload(o.spr);G.objs.push(o);}}
 const walkers=G.objs.filter(o=>o.momiActor&&!['nurse','clerk','momipupil','momicafeguest'].includes(o.role)&&(!m.indoor||o.momiActor==='keeper'));if(!walkers.length)return;
 const o=walkers[MOMI_CURSOR++%walkers.length],t=momiTarget(o);if(o.npcMove||!t||t.map!==m.id||Math.abs(o.x-G.pl.x)+Math.abs(o.y-G.pl.y)<=1||o.x===t.x&&o.y===t.y)return;
 const d=residentNextStep(m,o,t);if(d<0)return;o.dir=d;o.npcMove={x:o.x+DX[d],y:o.y+DY[d],t:0,duration:13};
}
function momiMigrate(s){
 if(s.flags['momi:v114'])return;s.flags['momi:v114']=1;
 const q=s.upgrade?.world?.gyms;if(q)delete q[1];
 if(typeof s.map==='string'&&s.map.startsWith(MOMI_KEY+':b')&&+s.map.split(':b')[1]>=3){s.map=MOMI_KEY;s.x=15;s.y=19;s.dir=0;s.surf=false;}
 if(s.heal?.map===MOMI_KEY){s.heal={map:MOMI_KEY+':b0',x:5,y:7};}
}
function momiGymParty(){return MOMI_GYM_TEAM.map(t=>{const m=makeMon(t.sp,t.lv,{iv:12,nat:0,shiny:false});m.mv=t.moves.map(name=>{const id=moveId(name);if(id<0)throw Error('gym move '+name);return{id,pp:MOVES[id].pp};});return m;});}
function momiRematchTeam(){const b=badgeCount(),lv=Math.min(85,22+Math.floor((b-4)*1.15));return [[516,lv],[717,lv+1],[546,lv+2]].map(([id,l])=>({sp:formAt(famOf(SP[id]),Math.min(100,l)),lv:Math.min(100,l)}));}
async function momiPupil(o){
 const t=o.momiActor==='aoto'?{team:[{sp:451,lv:9},{sp:516,lv:9}],money:180}:{team:[{sp:717,lv:10}],money:140},key='momi:pupil:'+o.momiActor;
 if(S.flags[key]){await msg(o.momiActor==='aoto'?'交代すると 能力の 変化が もとに 戻るよ。':'先制技や 空タイプの 技も おぼえて おこう。');return;}
 if(!S.party.some(m=>m.hp>0)||!await confirmYN('任意の 練習勝負を する？ ジムの 挑戦には 必要ないよ。'))return;
 const result=await battle({trainer:{name:pFull(o.pid),team:mkTeam(t.team,8),money:t.money,spr:o.spr}});if(result==='lose'){await blackout();return;}if(result==='win'){S.flags[key]=1;await msg('いい 勝負だった！');saveGame();}
}
let MOMI_CAFE_BUSY=false;
function momiCafeTeam(d,badges=badgeCount()){const v=MomiCafe.guest(d),df=MomiCafe.difficulty(badges);return{guest:v,prize:df.prize,team:v.ids.slice(0,df.count).map((id,j)=>{const lv=df.ace-df.count+1+j;return{sp:formAt(famOf(SP[id]),lv),lv};})};}
function momiCafeDay(){return MomiCafe.day();}
function momiCafeInfo(d=momiCafeDay()){const q=MomiCafe.normalize(momiState().cafe),v=momiCafeTeam(d);return{...v,day:d,record:q,available:MomiCafe.available(q,d)};}
async function momiCafeBattle(){
 if(MOMI_CAFE_BUSY||G.map?.id!==MOMI_CAFE)return;
 if(!S.flags.dex||!S.party.some(m=>m.hp>0)){await msg('元気な 相棒と 一緒に 来てね。');return;}
 MOMI_CAFE_BUSY=true;
 try{
  const info=momiCafeInfo();if(!info.available){await msg('今日は もう 勝負したね。\n日本時間の 午前0時に 相手が かわるよ。');return;}
  const detail=info.team.map(t=>SP[t.sp].name+' Lv'+t.lv).join('、');
  await msg('本日の 相手：'+info.guest.name+'（'+info.guest.theme+'）\n'+detail+'\n賞金 '+info.prize+'G。1日1回、勝敗を 問わず 参加記録が 残る。');
  if(!await confirmYN('今日の カフェバトルに 挑戦する？'))return;
  if(momiCafeDay()!==info.day){await msg('日付が かわったよ。新しい 相手を 確認しよう。');return;}
  // Spend before entering battle and persist it. A reload or interrupted fight is still an attempt.
  const state=momiState(),before=state.cafe,claimed=MomiCafe.claim(before,info.day);if(!claimed){await msg('今日は もう 参加したよ。');return;}
  state.cafe=claimed;if(!saveGame()){if(before===undefined)delete state.cafe;else state.cafe=before;await msg('記録を 保存できないため、対戦は 開始できなかった。');return;}
  metPerson(info.guest.pid);let result='aborted';
  try{
   result=await battle({momiCafe:true,trainer:{name:info.guest.name,team:mkTeam(info.team,12),money:info.prize,spr:pSpr(info.guest.pid)}});
   if(result==='lose'){S.party.forEach(healMon);await msg('コノハ「おつかれさま。今日は ゆっくり 休んでね。」\n相棒を 手当てした。賞金は ないが お金も 失わない。');}
   else if(result==='win')await msg('コノハ「すてきな 勝負だった！ また 明日 来てね。」');
  }finally{state.cafe=MomiCafe.finish(state.cafe,info.day,result);if(!saveGame())await msg('対戦の 結果を 保存できなかった。参加記録は 保存済みだ。');}
 }finally{MOMI_CAFE_BUSY=false;}
}
async function momiCafeTalk(){
 const info=momiCafeInfo(),n=await menu([{label:'今日の カフェバトル',right:info.available?'挑戦可':'本日済み'},{label:'戦績',right:info.record.wins+'勝'},{label:'カフェの お使い'},{label:'もどる'}],{x:6,y:36,w:228,rows:4,title:'年輪カフェ '+MomiCafe.dateLabel(info.day)});
 if(n===0)await momiCafeBattle();else if(n===1)await msg('対戦 '+info.record.attempts+'回、勝利 '+info.record.wins+'回。\n今日の 相手は '+info.guest.name+'。\n毎日 午前0時（日本時間）に 更新。');else if(n===2){const q=momiState();if(q.deliveryDone)await msg('お使い ありがとう！');else if(q.deliveryReady){await momiReward('deliveryDone','お礼に 3種類の 実を もらった！',()=>{for(let i=0;i<3;i++)fruitAdd(i,1);});}else{q.deliveryStarted=true;await msg('森林整備員の ナギトに 木の実のお茶を 届けてくれる？');saveGame();}}
}
async function momiReward(key,line,fn){const q=momiState();if(q[key])return false;q[key]=true;fn();sfx('get');await msg(line);saveGame();return true;}
async function momiTraining(){
 const n=await menu(['相性と 交代の 教室','実戦の 練習','もどる'],{x:8,y:36,w:224,title:'アニマ訓練館'});
 if(n===0){const questions=[['無タイプに 効果抜群なのは？',['拳','焔','潮'],0],['命中率を 下げられたら？',['交代する','待つだけ','捕まえる'],0],['先制技は どんな技？',['必ず急所','優先度が高い','必ず眠らせる'],1]];for(const [title,opts,answer] of questions){const k=await menu(opts,{x:6,y:40,w:228,title});if(k<0)return;if(k!==answer){await msg('もう一度 考えてみよう。');return;}}if(!await momiReward('training','基礎教室 合格！ 500Gを もらった！',()=>S.money+=500))await msg('全問 正解！');}
 if(n===1){if(facilityActive||!S.party.length||!await confirmYN('練習戦を する？ 終了後は 元の 手持ちに 戻る。'))return;const party=S.party,seen={...S.seen};facilityActive=true;try{S.party=JSON.parse(JSON.stringify(party));S.party.forEach(healMon);await battle({facility:true,trainer:{name:'訓練館',team:mkTeam([{sp:451,lv:8},{sp:717,lv:9}],8),money:0,spr:pSpr(1413)}});}finally{S.party=party;S.seen=seen;facilityActive=false;BT=null;G.scene='world';G.fade=0;fxClear();folReset();}await msg('練習 おつかれさま。');saveGame();}
}
async function momiTalk(o){const q=momiState();switch(o.momiActor){
 case'leader':await msg('ハルク「ジムで 待っているぞ。基礎を 大切に な！」');return;
 case'bike':if(!S.badges[1]){await msg('ツクル「初バッジを 取ったら 自転車と 工具を 使えるように するよ。」');return;}await milestones();if(q.bikeDone){await msg('ツクル「試乗コース 合格だ！」');return;}if(await confirmYN('自転車で 3か所の 印を 通る 試乗コースに 挑戦する？')){q.bikeStarted=true;q.bikeMarks=[];saveGame();await msg('広場の 南、西、ジムの 前の 印を 通ろう。');}return;
 case'wood':if(q.woodDone){await msg('スギノ「木材 ありがとう！」');return;}if((q.woodMarks||[]).length===3){await momiReward('woodDone','木材を すべて 集めた！ 800Gを もらった！',()=>S.money+=800);return;}q.woodStarted=true;await msg('スギノ「街の 3か所に 置いた 材木を 調べて きてくれる？」');saveGame();return;
 case'cafe':await momiCafeTalk();return;
 case'keeper':if(G.map.momiSlot===4){await momiTraining();return;}await msg('ミト「アニマと いっしょに 暮らしているよ。」');return;
 case'forest':if(q.deliveryStarted&&!q.deliveryReady&&!q.deliveryDone){q.deliveryReady=true;await msg('ナギト「お茶を ありがとう！ コノハに よろしく。」');saveGame();}else await msg('ナギト「モミノキの 森を 大切にしているんだ。」');return;
 case'child':if(S.party.some(m=>m.sp===11||m.sp===36)){if(await momiReward('fist','ケンアナの 系統だ！ ケアスプレーを 3個 もらった！',()=>bagAdd('heal1',3)))return;}await msg('シュン「拳タイプの アニマを 見てみたいな！」');return;
 case'guide':await msg('ハズキ「北は ジム。南は 第4街道。年輪カフェでは 1日1回 勝負が できるよ。」');return;
 default:await msg(pGiven(o.pid)+'「ようこそ モミノキ街へ！」');
}}
async function momiSiteTalk(site){const q=momiState();if(site.kind==='training')return momiTraining();if(site.kind==='wood'){if(!q.woodStarted){await msg('木工房の 材木だ。職人に 話を 聞こう。');return;}q.woodMarks=q.woodMarks||[];if(!q.woodMarks.includes(site.i)){q.woodMarks.push(site.i);sfx('get');saveGame();}await msg('材木の 確認 '+q.woodMarks.length+'/3。');}else if(site.kind==='bike')await msg('自転車の 試乗コースの 印だ。');}
function momiInteract(m,x,y){if(!m.momi)return false;const s=m.momiSites?.[x+','+y];if(!s)return false;run(()=>momiSiteTalk(s));return true;}
function momiBikeStep(m,p){if(!m.momi||m.indoor||!S.badges[1]||!riding())return;const q=momiState(),v=m.momiSites[p.x+','+p.y];if(!q.bikeStarted||q.bikeDone||v?.kind!=='bike')return;q.bikeMarks=q.bikeMarks||[];if(q.bikeMarks.includes(v.i))return;q.bikeMarks.push(v.i);sfx('get');if(q.bikeMarks.length===3){q.bikeDone=true;S.own[452]=1;S.flags['k:wear']=1;S.own[401]=1;S.own[601]=1;bagAdd('I0154');G.banner={text:'試乗 合格！ 年輪の帽子を 入手',t:140};}else G.banner={text:'試乗 '+q.bikeMarks.length+'/3',t:80};saveGame();}
function momiArrivalReady(m){return m.id===MOMI_KEY&&S.flags.dex&&!S.flags['momi:intro'];}
async function momiArrival(){S.flags['momi:intro']=1;await sayAs(4,'ここが 最初の ジムか！ どっちが 先に バッジを 取れるか、競争だな！');saveGame();}
function momiDrawGround(g,m,cx,cy){
 g.save();if(m.momiGym){for(let y=1;y<16;y++)for(let x=1;x<12;x++){if(m.t[y*m.W+x]!==T.FLOOR)continue;let px=x*16-cx,py=y*16-cy;if(px<-16||px>LW||py<-16||py>LH)continue;g.fillStyle=(x+y)%2?'#d4b88d':'#dcc299';g.fillRect(px,py,16,16);g.strokeStyle='#bd9c73';g.lineWidth=.45;g.strokeRect(px,py,16,16);}}
 if(!m.indoor){for(let y=Math.max(0,Math.floor(cy/16));y<=Math.min(31,Math.floor(cy/16)+15);y++)for(let x=Math.max(0,Math.floor(cx/16));x<=Math.min(31,Math.floor(cx/16)+16);x++){const v=m.t[y*32+x];if(v!==T.PATH&&v!==T.GRASS)continue;const px=x*16-cx,py=y*16-cy;if(!drawCell(g,'obj/momino/ground.svg',6,32,32,(x*13+y*7)%12+(v===T.PATH?0:12),px,py,16,16)&&v===T.PATH){g.fillStyle='#d6c9ac';g.fillRect(px,py,16,16);}}
  const px=16*16-cx,py=17*16-cy;g.strokeStyle='#b49973';g.lineWidth=1.1;for(let r=9;r<=34;r+=8){g.beginPath();g.arc(px,py,r,0,Math.PI*2);g.stroke();}g.beginPath();g.moveTo(px-34,py);g.lineTo(px+34,py);g.moveTo(px,py-34);g.lineTo(px,py+34);g.stroke();
  if(S.badges[1])for(const [j,[x,y]] of MOMI_BIKE.entries()){let px=x*16-cx,py=y*16-cy;g.fillStyle='#d6b66c';g.fillRect(px+2,py+2,12,12);g.fillStyle='#5b543f';g.font='bold 8px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(String(j+1),px+8,py+8);}
 }
 g.restore();
}
const MOMI_PROPS=['lamp','bench','planter','woodstack','sawhorse','crate','barrel','signpost','bikeRack','pinecone','log','trainingPost','workbench','toolbox','board','cafeTable','stool','coffee','wheel','bed','basket','shelfSign','lantern','stackedBoards','hammer','chisel','measuringTape','woodenRing','cup','cake','menuBoard','bottle','wrench','pump','spareWheel','toolCabinet','floorMat','dumbbell','target','bell'];
function momiDrawProp(g,o,x,y){const i=MOMI_PROPS.indexOf(o.id),z=o.id==='lamp'?28:o.id==='trainingPost'?26:22;if(i>=0&&!drawCell(g,'obj/momino/props.svg',5,48,48,i,x+8-z/2,y+16-z,z,z)){g.fillStyle='#927856';g.fillRect(x+2,y+4,12,10);}}
function momiDrawPet(g,o,x,y){drawHaruPet(g,o,x,y);}
function momiDrawLights(g,m,cx,cy){if(m.indoor||dayPhase()!==3)return;g.save();for(const o of m.objs.filter(o=>o.id==='lamp')){const x=o.x*16+8-cx,y=o.y*16-4-cy;if(x<-24||x>LW+24||y<-24||y>LH+24)continue;const grad=g.createRadialGradient(x,y,0,x,y,24);grad.addColorStop(0,'rgba(255,224,140,.42)');grad.addColorStop(1,'rgba(255,224,140,0)');g.fillStyle=grad;g.fillRect(x-24,y-24,48,48);}g.restore();}
function momiDrawHUD(m){if(UI.length||G.banner&&G.banner.t>0)return;if(m.momiGym)return;if(m.id===MOMI_CAFE){const available=MomiCafe.available(momiState().cafe,momiCafeDay());ctx.fillStyle='rgba(65,51,39,.83)';ctx.fillRect(4,4,166,15);tx('年輪カフェ '+(available?'本日 挑戦可':'本日 対戦済み'),9,7,'#fff1d2',8);}else if(!m.indoor){ctx.fillStyle='rgba(40,64,48,.8)';ctx.fillRect(4,4,95,15);tx('森と鍛錬の 街',9,7,'#fff2d6',8);}}
function momiPortraitPath(id){return MOMI_NAMES[id]?'obj/momino/people/p'+id+'.svg':null;}
function momiFace(id,text){if(id!==11)return null;let n=faceEx(text);if(/考え|基礎/.test(text||''))n=4;else if(/最後|力を/.test(text||''))n=5;else if(/休ん|大切/.test(text||''))n=6;else if(/バッジ/.test(text||''))n=7;return picOK('obj/momino/people/face-'+n+'.svg');}
function momiDrawWalker(g,id,dir,fr,x,y){if(!MOMI_NAMES[id])return false;const f=fr>=10?(fr-10)%3:fr===1?1:fr===2?2:0;return drawCell(g,'obj/momino/people/walk'+id+'.svg',3,96,144,dir*3+f,x+8-9,y+19-27,18,27);}

function momiDrawPine(g,r,x,y){const w=r.big?39:30,h=r.big?52:40;return drawCell(g,'obj/momino/pines.svg',4,96,128,r.v%4,x-w/2,y-h+4,w,h);}
function momiLeaderBig(g,pid,pose,x,y,h,al){
 if(pid!==11)return false;const n=BT?.o?.momiGym?BT.result==='win'?9:BT.fx?.trX!==null&&BT.fx?.trX>10?5:1:Math.max(0,Math.min(11,pose||0)),im=picOK('obj/momino/people/leader-'+n+'.svg');if(!im)return false;
 g.save();if(al!=null)g.globalAlpha=Math.max(0,al);g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';g.drawImage(im,x-h/3,y-h,h*2/3,h);g.restore();return true;
}
function momiFanfare(){if(!SND||!AC)return;try{const now=AC.currentTime,notes=[72,76,79,84,83,79,84];notes.forEach((n,i)=>{const o=AC.createOscillator(),g=AC.createGain(),t=now+i*.105;o.type='triangle';o.frequency.value=440*2**((n-69)/12);g.gain.setValueAtTime(.045,t);g.gain.linearRampToValueAtTime(0,t+.22);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+.24);});}catch(e){}}
