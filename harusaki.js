'use strict';
// Hand-authored 32x32 village. All interactions use the normal game state and save.
const HARU_KEY='0,2',HARU_NAMES={1901:'ハナエ',501:'コハル',601:'ミノル',101:'レント',801:'フウカ',201:'ナナ',202:'ソウタ',802:'ムギ',102:'ミサキ'};
const HARU_BLD=[
 [22,4,'heal','clinic','巡環診療所'],[4,4,'shop','shop','ハルサキ雑貨店'],
 [4,18,'harulodge','lodge','旅人の家'],[23,18,'harutailor','tailor','イトミの仕立て工房'],
 [4,25,'house','house','ハナエの家'],[10,25,'house','house','水辺の民家'],
 [4,10,'haruflower','flower','フウカの花の家']
];
const HARU_PEOPLE=[
 {id:1901,key:'mayor',role:'村の案内人',schedule:[[0,4,3,3],[360,-1,12,22],[540,-1,13,13],[1020,-1,18,21],[1200,4,3,3]]},
 {id:501,key:'nurse',role:'nurse',schedule:[[0,0,4,1]]},
 {id:601,key:'shop',role:'clerk',schedule:[[0,1,3,1]]},
 {id:8,key:'tailor',role:'harutailor',schedule:[[0,3,4,1]]},
 {id:101,key:'mentor',role:'先輩トレーナー',schedule:[[0,2,5,3]]},
 {id:801,key:'florist',role:'花壇の世話係',schedule:[[0,6,3,2],[360,-1,11,10],[540,-1,10,16],[1020,-1,11,11],[1200,6,3,2]]},
 {id:201,key:'child',role:'子ども',schedule:[[0,5,3,3],[420,-1,12,23],[540,-1,19,17],[1020,-1,18,24],[1200,5,3,3]]},
 {id:202,key:'child2',role:'子ども',schedule:[[0,4,6,4],[420,-1,22,23],[540,-1,20,20],[1020,-1,19,24],[1200,4,6,4]]},
 {id:802,key:'farmer',role:'栽培園の世話係',schedule:[[0,-1,24,15],[360,-1,23,10],[540,-1,24,15],[1020,-1,27,15]]},
 {id:102,key:'traveler',role:'旅人',schedule:[[0,2,3,6],[420,-1,10,9],[540,-1,18,14],[1020,-1,12,21],[1200,2,3,6]]}
];
const HARU_PETS=[
 {id:'mouse',sp:451,schedule:[[0,1,7,4],[360,-1,10,8],[1200,1,7,4]]},
 {id:'bird',sp:717,schedule:[[0,-1,21,7],[360,-1,18,8],[780,-1,20,9],[1200,-1,21,7]]},
 {id:'bug',sp:334,schedule:[[0,-1,11,12],[420,-1,10,11],[1020,-1,11,12]]},
 {id:'rabbit',sp:711,schedule:[[0,5,6,4],[420,-1,12,15],[600,-1,19,18],[1020,-1,19,22],[1200,5,6,4]]},
 {id:'tanuki',sp:516,schedule:[[0,4,2,5],[420,-1,8,24],[1020,4,2,5]]},
 {id:'flower',sp:283,schedule:[[0,6,6,5],[420,-1,10,13],[780,-1,12,11],[1200,6,6,5]]}
];
const HARU_FLOWER_BEDS=[[10,10],[11,12],[11,17]];
const HARU_PLOTS=[[24,10],[26,10],[24,13],[26,13]];
const HARU_PET_LOST={id:'lost',sp:451,schedule:[[0,-1,29,28]]};
const HARU_QUESTS=[['catch','初めての 捕獲','キャプセル5個'],['lost','迷子の コムギネ','1000G'],['flowers','花壇の お手伝い','木の実3種'],['practice','先輩との 練習戦','ケアスプレー3個'],['tailor','仕立て体験','旅帽'],['night','夜の 広場','会話の 記録']];
const haruMapId=slot=>slot<0?HARU_KEY:HARU_KEY+':b'+slot;
function haruBuildings(){return HARU_BLD.map(([x,y,kind,haruArt,label],slot)=>({slot,x,y,kind,haruArt,label}));}
function haruSet(m,x,y,v){if(x>=0&&x<m.W&&y>=0&&y<m.H)m.t[y*m.W+x]=v;}
function haruRect(m,x,y,w,h,v){for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)haruSet(m,i,j,v);}
function haruPath(m,x,y,x2,y2){for(let i=Math.min(x,x2);i<=Math.max(x,x2);i++)haruSet(m,i,y,T.PATH);for(let j=Math.min(y,y2);j<=Math.max(y,y2);j++)haruSet(m,x2,j,T.PATH);}
function haruProp(m,id,x,y,say,extra={}){m.objs.push({k:'haruprop',id,x,y,say,...extra});}
function haruBlock(m,x,y,say){m.objs.push({k:'harublock',x,y,hide:true,say});}
function haruSign(m,x,y,say){haruSet(m,x,y,T.SIGN);m.signs[x+','+y]=say;}
function haruTemplates(m,slot){
 for(const p of HARU_PEOPLE)if(p.schedule.some(s=>s[1]===slot)){const t=p.schedule.find(s=>s[1]===slot);m.objs.push({k:'npc',role:['nurse','clerk','harutailor'].includes(p.role)?p.role:'harusaki',haruActor:p.key,pid:p.id,spr:pSpr(p.id),x:t[2],y:t[3],dir:2});}
 for(const p of HARU_PETS.concat([HARU_PET_LOST]))if(p.schedule.some(s=>s[1]===slot)){const t=p.schedule.find(s=>s[1]===slot);m.objs.push({k:'harupet',haruActor:'pet:'+p.id,sp:p.sp,x:t[2],y:t[3],dir:2});}
}
function genHaruTown(cell){
 const m=newMap(cell.key,cell,32,32,T.GRASS);m.haru=true;m.haruSlot=-1;m.name='ハルサキ村';m.border=T.TREE;m.exits=[1,0,1,0];m.adv={};
 for(let y=0;y<32;y++)for(let x=0;x<32;x++)if(x<2||x>29||y<2||y>29)haruSet(m,x,y,T.TREE);
 haruRect(m,15,0,2,32,T.PATH);haruRect(m,11,13,10,8,T.PATH);
 haruRect(m,13,12,2,10,T.PATH);haruRect(m,17,12,2,10,T.PATH);
 haruRect(m,4,8,24,2,T.PATH);haruRect(m,4,22,24,2,T.PATH);
 for(const b of haruBuildings()){
  const roof=b.kind==='heal'?T.ROOF_H:b.kind==='shop'?T.ROOF_S:T.ROOF;
  haruRect(m,b.x,b.y,5,2,roof);haruRect(m,b.x,b.y+2,5,2,T.WALL);
  for(const dx of [1,3])haruSet(m,b.x+dx,b.y+2,T.WINDOW);
  haruSet(m,b.x+2,b.y+3,T.DOOR);const y=b.y+4;
  const entry=b.kind==='heal'?[5,7]:b.kind==='harulodge'?[5,8]:b.kind==='harutailor'?[5,7]:[4,6];
  m.warps[(b.x+2)+','+(b.y+3)]={map:haruMapId(b.slot),x:entry[0],y:entry[1],dir:0};
  // Keep door approaches and connect each building to the main avenue.
  haruSet(m,b.x+2,y,T.PATH); // The flower house faces south; never carve a road through its roof.
  if(b.y>=24)haruPath(m,b.x+2,29,15,29);
  m.blds.push(b);
 }
 haruPath(m,6,14,13,14);haruPath(m,25,8,25,15);haruPath(m,20,15,25,15);
 // Central fountain with independent 2x2 solid collision, route bypass on both sides.
 for(const [x,y] of [[15,15],[16,15],[16,16]])haruBlock(m,x,y,'花咲き広場の 噴水だ。');
 haruProp(m,'fountain',15,16,'水が 光を はじいている。',{large:true});
 // Windmill on a grassy verge (not the main road).
 haruRect(m,19,4,2,3,T.GRASS);
 for(const [x,y] of [[19,4],[20,4],[19,5],[20,5],[20,6]])haruBlock(m,x,y,'花風車。風の 力で 水を くみ上げる。');
 haruProp(m,'windmill',19,6,'花風車が ゆっくり 回っている。',{large:true});
 // Flowerbeds and two rows of four crops, no wild encounters in town.
 m.haruFlowers=[];for(const [cx,cy] of [[10,10],[11,12],[11,17],[20,11],[22,16],[3,16],[28,17],[9,30],[21,24]])for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++){const x=cx+dx,y=cy+dy;if(x>=30||y>=30||m.t[y*32+x]!==T.GRASS)continue;haruSet(m,x,y,T.FLOWER);m.haruFlowers.push([x,y,(x*13+y*7)%24]);}
 for(const [x,y] of HARU_PLOTS){haruSet(m,x,y,T.GRASS);expPut(m,x,y,{kind:'berry',plot:HARU_PLOTS.findIndex(p=>p[0]===x&&p[1]===y)});}
 for(const [x,y] of HARU_FLOWER_BEDS){haruSet(m,x,y,T.FLOWER);if(!m.haruFlowers.some(p=>p[0]===x&&p[1]===y))m.haruFlowers.push([x,y,(x+y)%24]);}
 // Water garden with a real crossing and walkable bank.
 haruRect(m,23,25,6,4,T.WATER);for(let x=23;x<=28;x++){haruSet(m,x,27,T.PATH);expPut(m,x,27,{kind:'bridge',dir:1});}
 haruPath(m,20,27,22,27);haruSet(m,29,27,T.PATH);
 for(const [id,x,y] of [['bench',12,12],['bench',18,21],['bench',22,24],['lamp',13,10],['lamp',18,10],['lamp',14,23],['lamp',17,23],['lamp',22,29],['crate',3,8],['pot',9,9],['pot',21,8],['barrel',3,22],['mail',9,24],['basket',28,15],['well',28,11],['flag',29,21],['basket',3,14]]){haruProp(m,id,x,y,id==='bench'?'ここで ひと休み できる。':'村の 人たちが 大切に 使っている。');}
 haruSign(m,13,3,'北：第2街道\n南：第1街道');haruSign(m,12,22,'花咲き広場\n北東：診療所　北西：雑貨店\n西：旅人の家　東：仕立て工房');
 haruSign(m,28,9,'木の実 栽培園。実を 植えて 水を あげよう。');
 // Preserve existing adventure/life functionality, but put portals in authored safe spots.
 expPut(m,3,3,{kind:'portal',area:'ridge',label:'段丘の森'});expPut(m,28,3,{kind:'portal',area:'life',label:'ハルサキ村・生活区'});
 haruTemplates(m,-1);m.enc=null;m.nCiv=7;return m;
}
function genHaruInterior(cell,slot){
 const b=haruBuildings()[slot];if(!b)throw Error('harusaki building '+slot);
 const W=slot===0||slot===2||slot===3?11:9,H=slot===2?10:slot===0||slot===3?9:8,m=room(haruMapId(slot),cell,W,H);
 m.haru=true;m.haruSlot=slot;m.bk=b.kind;m.name=b.label;
 const set=(x,y,v)=>haruSet(m,x,y,v);
 for(let x=1;x<W-1;x++)if(x%3!==0)set(x,1,T.SHELF);
 if(slot===0){haruRect(m,1,2,7,1,T.COUNTER);set(3,1,T.HEALM);set(9,1,T.PC);set(1,6,T.PLANT);set(9,6,T.PLANT);haruProp(m,'bench',2,5,'待合室の ベンチ。');haruProp(m,'bench',8,5,'待合室の ベンチ。');}
 else if(slot===1){haruRect(m,1,2,5,1,T.COUNTER);set(7,1,T.SHELF);set(7,2,T.SHELF);set(6,1,T.SHELF);haruProp(m,'crate',2,5,'旅の 道具が 入っている。');}
 else if(slot===2){haruRect(m,4,2,3,1,T.RUG);haruRect(m,3,4,5,3,T.RUG);set(1,5,T.PLANT);set(9,5,T.PLANT);haruProp(m,'map',2,2,'ソラネ地方の 地図だ。');haruProp(m,'board',8,2,'練習戦は 自由参加。バッジは もらえない。');}
 else if(slot===3){haruRect(m,2,2,5,1,T.COUNTER);set(9,1,T.SHELF);haruProp(m,'cloth',2,4,'色とりどりの 布。');haruProp(m,'mirror',8,4,'試着用の 鏡。');haruRect(m,4,5,3,2,T.RUG);}
 else{set(1,5,T.PLANT);set(7,1,T.PLANT);haruRect(m,4,3,2,1,T.TABLE);haruRect(m,3,5,2,1,T.RUG);if(slot===6){haruProp(m,'pot',1,3,'花の 苗が ならんでいる。');haruProp(m,'basket',7,3,'花の 種が 入っている。');}else haruProp(m,'bed',7,4,'やわらかな ベッド。');}
 const x=Math.floor(W/2);set(x,H-1,T.MAT);set(x,H-2,T.FLOOR);m.warps[x+','+(H-1)]={map:HARU_KEY,x:b.x+2,y:b.y+4,dir:2};
 // Ensure the fixed actor positions have floor and a walkable interaction neighbor.
 haruTemplates(m,slot);for(const o of m.objs)if(o.haruActor){if(o.role==='nurse'||o.role==='clerk'||o.role==='harutailor')set(o.x,o.y,T.FLOOR);else if(SOLID[m.t[o.y*m.W+o.x]])set(o.x,o.y,T.FLOOR);}
 return m;
}
function haruActorInfo(o){return o.k==='harupet'?HARU_PETS.concat([HARU_PET_LOST]).find(p=>'pet:'+p.id===o.haruActor):HARU_PEOPLE.find(p=>p.key===o.haruActor);}
function haruSchedule(o,minute=npcMinutes()){const p=haruActorInfo(o);if(!p)return null;let s=p.schedule[0];for(const z of p.schedule)if(z[0]<=minute)s=z;return{map:haruMapId(s[1]),x:s[2],y:s[3]};}
function haruQuest(){const p=HitokariUpgrade.progress(S);return p.harusaki||(p.harusaki={watered:[]});}
function haruActorEnabled(o){return o.haruActor!=='pet:lost'||haruQuest().lostStarted&&!haruQuest().lostFound&&!haruQuest().lost;}
function haruWalkable(m,x,y){return x>=1&&y>=1&&x<m.W-1&&y<m.H-1&&!SOLID[m.t[y*m.W+x]]&&m.t[y*m.W+x]!==T.WATER&&!m.warps[x+','+y]&&!expAt(m,x,y);}
function haruSpawn(m,o,out){const s=haruSchedule(o);if(!s||s.map!==m.id||!haruActorEnabled(o))return false;
 const taken=(x,y)=>out.some(a=>a.x===x&&a.y===y||a.npcMove&&a.npcMove.x===x&&a.npcMove.y===y)||m.objs.some(a=>!a.haruActor&&a.x===x&&a.y===y)||(G.pl.x===x&&G.pl.y===y);
 const candidates=[[s.x,s.y]];for(let d=1;d<=3;d++)for(let y=-d;y<=d;y++)for(let x=-d;x<=d;x++)if(Math.abs(x)+Math.abs(y)===d)candidates.push([s.x+x,s.y+y]);
 const pos=candidates.find(([x,y])=>haruWalkable(m,x,y)&&!taken(x,y));if(!pos)return false;o.x=pos[0];o.y=pos[1];o.homeX=o.x;o.homeY=o.y;return true;
}
function haruSafeSpawn(m,x,y){if(Number.isInteger(x)&&Number.isInteger(y)&&x>=0&&y>=0&&x<m.W&&y<m.H&&!SOLID[m.t[y*m.W+x]]&&m.t[y*m.W+x]!==T.WATER&&!m.objs.some(o=>!o.haruActor&&o.x===x&&o.y===y))return[x,y];return m.indoor?[Math.floor(m.W/2),m.H-2]:[15,29];}
let HARU_CURSOR=0;
function tickHaru(canInput){
 const m=G.map;if(!m||!m.haru)return;
 for(const o of G.objs){if(!o.haruActor||!o.npcMove)continue;const z=o.npcMove;z.t++;const f=Math.min(1,z.t/z.duration);o.ox=(z.x-o.x)*16*f;o.oy=(z.y-o.y)*16*f;if(f>=1){o.x=z.x;o.y=z.y;o.ox=o.oy=0;o.npcMove=null;}}
 if(!canInput||G.busy||G.t%5!==0)return;const p=G.pl,near=o=>Math.abs(o.x-p.x)+Math.abs(o.y-p.y)<4;
 // Update membership without materializing a resident on top of the player.
 for(const o of G.objs.slice()){if(!o.haruActor||o.npcMove)continue;const s=haruSchedule(o);if(!haruActorEnabled(o)||s.map!==m.id&&!near(o))removeObj(o);}
 for(const z of m.objs)if(z.haruActor&&!G.objs.some(o=>o.haruActor===z.haruActor)){const o={...z,ox:0,oy:0,alert:0};if(haruSpawn(m,o,G.objs)){if(o.spr)chrPreload(o.spr);G.objs.push(o);}}
 const list=G.objs.filter(o=>o.haruActor&&!['nurse','clerk','harutailor'].includes(o.role));if(!list.length)return;
 const o=list[HARU_CURSOR++%list.length];if(o.npcMove||near(o)&&Math.abs(o.x-p.x)+Math.abs(o.y-p.y)<2)return;
 const s=haruSchedule(o);if(!s||s.map!==m.id)return;
 let target=s;if(o.k==='harupet'&&o.haruActor!=='pet:lost'&&G.t%40<5){const d=(G.t+o.sp)%4;const x=s.x+DX[d],y=s.y+DY[d];if(haruWalkable(m,x,y))target={x,y};}
 if(o.x===target.x&&o.y===target.y)return;const d=residentNextStep(m,o,target);if(d<0)return;o.dir=d;o.npcMove={x:o.x+DX[d],y:o.y+DY[d],t:0,duration:o.k==='harupet'?9:13};
}
function haruEligibleCatch(){return [...ROUTE1_IDS].some(id=>S.caught[id]);}
async function haruReward(key,text,fn){const q=haruQuest();if(q[key])return false;q[key]=1;fn();sfx('haruBell');await msg(text);saveGame();return true;}
async function haruQuestList(){const q=haruQuest();await menu(HARU_QUESTS.map(([key,name,reward])=>({label:name,right:q[key]?'完了':reward})),{x:5,y:18,w:230,rows:7,title:'ハルサキ村の お手伝い'});}
async function haruTalk(o){
 const q=haruQuest(),name=pGiven(o.pid);if(!S.flags.dex){await msg('博士から 相棒を もらって おいで。');return;}
 switch(o.haruActor){
  case'mayor':
   if(!q.catch&&haruEligibleCatch())await haruReward('catch','ハナエ「初めての 捕獲 おめでとう！」\nリーフキャプセルを 5個 もらった！',()=>bagAdd('fuda',5));
   else await msg('ハナエ「ようこそ 花と 風の 村へ。第2街道へは 北の 道から。ジムは モミノキ街に あるよ。」');
   if(await confirmYN('村の お手伝いを 見る？'))await haruQuestList();break;
  case'mentor':await haruMentor();break;
  case'florist':case'farmer':
   if(!q.flowers&&!q.flowersStarted){q.flowersStarted=1;await msg(name+'「花壇3か所を 調べて 水を あげてくれる？ 栽培園で 実も 育てられるよ。」');saveGame();}
   else await msg(q.flowers?'花壇の 花が 元気だね！':'花壇の お手伝い '+(q.watered||[]).length+'/3。');break;
  case'child':
   if(q.lostFound&&!q.lost){await haruReward('lost','ナナ「見つけて くれて ありがとう！」\n1000Gを もらった！',()=>S.money+=1000);}
   else if(!q.lost&&!q.lostStarted){q.lostStarted=1;await msg('ナナ「コムギネが いなくなっちゃった。水辺の 公園で 見かけたかも…。」');saveGame();}
   else await msg(q.lost?'コムギネは 元気だよ！':'いっしょに さがして くれる？');break;
  case'child2':await msg('ソウタ「第2街道は 草が いっぱい！ いろんな アニマが いるよ。」');break;
  case'traveler':await msg(npcMinutes()>=1140||npcMinutes()<300?'ミサキ「夜の 噴水は 星が 映って きれいだよ。」':'ミサキ「診療所と 雑貨店は いつでも あいているよ。」');break;
  default:await msg(name+'「ゆっくり していってね。」');
 }
 if(o.pid>100)await recordFrom(o.pid,G.map.cell);
}
async function haruMentor(){
 const opts=['タイプ相性','捕獲の コツ','特性と 進化','練習バトル','村の お手伝い','もどる'];
 for(;;){const n=await menu(opts,{x:8,y:20,w:224,title:'レントの 冒険教室'});if(n<0||n===5)return;
  if(n===0)await msg('火は 草に、草は 水に、水は 火に 強い。\nメニューの 相性表で 他の タイプも 確かめよう。');
  if(n===1)await msg('HPを 減らし、まひや 眠りに してから キャプセルを 投げよう。手持ちが6匹なら 牧場へ 送られる。');
  if(n===2)await msg('アニマには 特性が ある。レベルが 上がると 進化する 子も いるよ。図鑑や つよさで 確かめよう。');
  if(n===3)await haruPractice();
  if(n===4)await haruQuestList();
 }
}
async function haruPractice(){
 if(!S.party.length||facilityActive)return;
 if(!await confirmYN('練習戦を する？ 終了後は 戦う前の 状態に 戻る。'))return;
 const real=S.party,seen={...S.seen},speaker=SPEAKER;let result;facilityActive=true;
 try{S.party=JSON.parse(JSON.stringify(real));S.party.forEach(healMon);result=await battle({facility:true,trainer:{name:'先輩の レント',team:mkTeam([{sp:451,lv:5},{sp:717,lv:6}],8),money:0,spr:pSpr(101)}});}
 finally{S.party=real;S.seen=seen;SPEAKER=speaker;facilityActive=false;if(BT){BT=null;G.scene='world';G.fade=0;fxClear();}folReset();}
 if(result==='win'){await haruReward('practice','レント「いい 勝負だった！」\n小さなケアスプレーを 3個 もらった！',()=>bagAdd('heal1',3));if(haruQuest().practice)await msg('練習は 何度でも できるよ。');}else await msg('レント「失敗しても 大丈夫。相性を ためしてみよう。」');
 saveGame();
}
async function haruTailor(o){
 for(;;){const n=await menu(['試着・購入','仕立て体験','もどる'],{x:10,y:40,w:220,title:'イトミの 仕立て工房'});if(n<0||n===2)return;if(n===0)await haruWearShop(o);
 else{if(!haruQuest().tailor){await msg('イトミ「旅の 帽子を 仕立てて あげるね。」');await haruReward('tailor','ハルサキの旅帽を もらった！',()=>{S.own[451]=1;S.flags['k:wear']=1;S.own[401]=1;S.own[601]=1;bagAdd('I0154');});}if(await confirmYN('旅帽を かぶってみる？')){S.wear.hat=451;charInvalidate();saveGame();}}}
}
async function haruWearShop(o){
 const stock=wearStock(1).filter(n=>n!==451);let idx=0;
 for(;;){const j=await menu(stock.map(n=>({label:wearName(n),right:S.own[n]?'所持':wearCat(n).p+'G'})),{x:5,y:4,w:230,rows:9,idx,title:'試着する 衣装',bg:()=>screenBG(),fg:i=>{win(4,162,232,42);drawWearPic(stock[i],8,163,38);tx(wearName(stock[i]),52,172,'#293e45',10);tx('A：試着する',52,186,'#50636b',8);}});if(j<0)return;idx=j;const n=stock[j],k=wearCat(n).k,old=S.wear[k],price=wearCat(n).p;S.wear[k]=n;charInvalidate();
  const preview=pushBG(()=>{screenBG('試着室');win(6,20,228,124,'#edf0e4');drawHumanBig(ctx,'pl',2,0,3.2,120,140,1);tx(wearName(n),120,149,'#31454c',10,'center');});
  let keep=false;try{if(S.own[n])keep=await confirmYN('この 衣装を 着る？');else if(S.money>=price&&await confirmYN(price+'Gで 買って 着る？')){S.money-=price;S.own[n]=1;keep=true;}else if(S.money<price)await msg('お金が たりないようだ。');}finally{popW(preview);if(!keep){if(old===undefined)delete S.wear[k];else S.wear[k]=old;}charInvalidate();}
  if(keep){sfx('get');saveGame();}
 }
}
async function haruPetTalk(o){
 if(o.haruActor==='pet:lost'){const q=haruQuest();if(!q.lostStarted||q.lostFound||q.lost)return;q.lostFound=1;removeObj(o);sfx('haruPet');await msg('迷子の コムギネを 見つけた！ ナナに 知らせよう。');saveGame();return;}
 sfx('haruPet');const m=animaPreviewMon(o.sp,false);startIndividualMotion(m,'celebrate');await msg(SP[o.sp].name+'は うれしそうに している。\n村の 人の 大切な 相棒だ。');
}
async function haruWaterFlower(x,y){
 const q=haruQuest(),key=x+','+y;q.flowersStarted=1;q.watered=q.watered||[];
 if(q.watered.includes(key)){await msg('この 花壇は 水を あげた。');return;}q.watered.push(key);sfx('haruGarden');await msg('花壇に 水を あげた。 '+q.watered.length+'/3');
 if(q.watered.length===3)await haruReward('flowers','フウカ「ありがとう！ これを 育ててね。」\n3種類の 実を もらった！',()=>{for(let i=0;i<3;i++)fruitAdd(i,1);});saveGame();
}
function haruInteract(m,x,y){
 if(!m.haru||m.indoor)return false;
 if(HARU_FLOWER_BEDS.some(a=>a[0]===x&&a[1]===y)){run(()=>haruWaterFlower(x,y));return true;}
 if([[15,15],[16,15],[15,16],[16,16]].some(a=>a[0]===x&&a[1]===y)){
  run(async()=>{if(npcMinutes()>=1200||npcMinutes()<300){if(await haruReward('night','水面に 星が 映っている。\nいつか また この 村へ 戻ろう。',()=>{}))return;}await msg('花咲き広場の 噴水。風に 乗って 花の 香りが する。');});return true;}
 return false;
}
function migrateHaruSave(s){
 if(!s.flags)s.flags={};if(s.flags['hsk:v111'])return;s.flags['hsk:v111']=1;
 const old=s.badges||{};s.badges={};for(const [k,v] of Object.entries(old)){const n=+k;if(n>=1&&n<=50&&v)s.badges[gymNumberForLegacy(n)]=v;}
 const p=s.upgrade;if(p&&p.rematches){const old=p.rematches;p.rematches={};for(const [k,v] of Object.entries(old)){const m=/^g:(\d+)$/.exec(k);p.rematches[m?'g:'+gymNumberForLegacy(+m[1]):k]=v;}}
 if(p&&p.world&&p.world.gyms)p.world.gyms={}; // new numbering and puzzle layouts; earned badges are retained.
 if(typeof s.map==='string'&&s.map.startsWith(HARU_KEY+':b')){s.map=HARU_KEY;s.x=15;s.y=29;s.dir=0;s.surf=false;}
 if(s.heal&&s.heal.map&&s.heal.map.startsWith(HARU_KEY+':b'))s.heal={map:haruMapId(0),x:5,y:7};
}
function haruEllipse(g,x,y,rx,ry,fill,stroke=null){g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);if(fill){g.fillStyle=fill;g.fill();}if(stroke){g.strokeStyle=stroke;g.lineWidth=.7;g.stroke();}}
function drawHaruGround(g,m,camx,camy){
 if(m.indoor)return;g.save();
 // Fine paving lines on the plaza and a distinct flower mosaic.
 for(let y=13;y<=20;y++)for(let x=11;x<=20;x++){if(m.t[y*32+x]!==T.PATH)continue;const px=x*16-camx,py=y*16-camy;if(px<-16||py<-16||px>LW||py>LH)continue;g.fillStyle=(x+y)%2?'#e5d7b4':'#e8dabd';g.fillRect(px,py,16,16);g.strokeStyle='#c7b898';g.lineWidth=.35;g.strokeRect(px+.4,py+.4,15.2,15.2);}
 for(const [x,y,i] of m.haruFlowers||[]){const px=x*16-camx,py=y*16-camy;if(px<-16||py<-16||px>LW||py>LH)continue;drawCell(g,'obj/harusaki/flowers.svg',6,32,32,i,px,py,16,16);}
 if(!reducedFx()){const q=G.t/24;for(let k=0;k<7;k++){const px=23*16-camx+(k*17+q*2)%90,py=25*16-camy+(k*11)%60;if(py<27*16-camy||py>28*16-camy){g.strokeStyle='rgba(235,252,243,.6)';g.beginPath();g.moveTo(px,py);g.lineTo(px+3,py);g.stroke();}}}
 g.restore();
}
const HARU_PROP_NAMES=['bench','lamp','crate','pot','barrel','mail','basket','well','flag','map','board','cloth','mirror','bed','barrier','sign','watering','lantern','book','stool'];
function drawHaruProp(g,o,x,y){
 g.save();if(o.id==='fountain'){
  const cx=x+16,cy=y-2;haruEllipse(g,cx,cy+8,16,8,'rgba(40,60,49,.2)');haruEllipse(g,cx,cy+2,16,10,'#b8baa4','#827f70');haruEllipse(g,cx,cy,14,8.5,'#d6d3bd','#939780');haruEllipse(g,cx,cy-.5,11.7,6.5,'#74b5c3','#50899c');
  g.fillStyle='#d8d5bc';g.fillRect(cx-2,cy-12,4,13);haruEllipse(g,cx,cy-12,4.2,2.2,'#ede2bf','#8c8b70');
  g.strokeStyle='#e8f8ef';g.lineWidth=.65;for(let j=0;j<4;j++){const ang=j*Math.PI/2,dx=Math.cos(ang)*10,dy=Math.sin(ang)*4;g.beginPath();g.moveTo(cx,cy-12);g.quadraticCurveTo(cx+dx*.75,cy-17,cx+dx,cy+dy);g.stroke();if(!reducedFx()){const p=(G.t/36+j*.17)%1;haruEllipse(g,cx+dx*p,cy-12+(12+dy)*p-8*Math.sin(p*Math.PI),.8,.9,'#fffdf0');}}
 }else if(o.id==='windmill'){
  const cx=x+16,fy=y+16;drawCell(g,'obj/harusaki/landmarks.svg',2,96,128,0,cx-20,fy-48,40,48);
  const cy=fy-34;g.translate(cx,cy);g.rotate(reducedFx()?.25:G.t/160);g.fillStyle='#f1dfb5';g.strokeStyle='#7d6c52';g.lineWidth=.7;for(let j=0;j<4;j++){g.save();g.rotate(j*Math.PI/2);g.beginPath();g.moveTo(-1,-1);g.lineTo(-5,-20);g.lineTo(2,-20);g.lineTo(2,-2);g.closePath();g.fill();g.stroke();g.restore();}haruEllipse(g,0,0,2.4,2.4,'#8d7955','#5e5548');
 }else{
  const i=HARU_PROP_NAMES.indexOf(o.id),sz=o.id==='lamp'?25:o.id==='well'?22:18;
  if(i>=0&&!drawCell(g,'obj/harusaki/props.svg',5,48,48,i,x+8-sz/2,y+16-sz,sz,sz)){g.fillStyle='#9c8060';g.fillRect(x+3,y+5,10,9);}
 }g.restore();
}
function drawHaruPet(g,o,x,y){haruEllipse(g,x+8,y+13,7,2.5,'rgba(35,48,35,.16)');const m=animaPreviewMon(o.sp,false),walk=!!o.npcMove,back=o.dir===0;const c=back&&monBackCv(o.sp,false)||monCanvas(o.sp,false,o.dir===1||back,false);drawIndividualMotion(g,m,c,x-3,y-10,22,1,0,0,back,walk?'walk':npcMinutes()<300||npcMinutes()>=1200?'sleep':'idle');}
function drawHaruLights(g,m,camx,camy){if(m.indoor||dayPhase()!==3)return;g.save();for(const o of m.objs){if(o.id!=='lamp')continue;const x=o.x*16+8-camx,y=o.y*16-1-camy;if(x<-25||x>LW+25||y<-25||y>LH+25)continue;const r=g.createRadialGradient(x,y,1,x,y,23);r.addColorStop(0,'rgba(255,225,148,.43)');r.addColorStop(1,'rgba(255,225,148,0)');g.fillStyle=r;g.fillRect(x-23,y-23,46,46);haruEllipse(g,x,y,1.8,2.2,'#fff5b4');}g.restore();}
function drawHaruHUD(m){if(UI.length||m.indoor||G.banner&&G.banner.t>0)return;ctx.fillStyle='rgba(43,62,53,.76)';ctx.fillRect(4,4,71,13);tx('花と風の 村',9,6,'#fff2d0',8);}
let HARU_SOUND_NEXT=0,HARU_SOUND_ID='';
function haruAmbientAudio(){if(!S||!G.map||!G.map.haru||G.map.indoor||G.scene!=='world'||G.busy||!SND||!AC)return;if(HARU_SOUND_ID!==G.map.id){HARU_SOUND_ID=G.map.id;HARU_SOUND_NEXT=G.t+120;}if(G.t<HARU_SOUND_NEXT)return;HARU_SOUND_NEXT=G.t+180+(G.t%130);const p=G.pl;if(Math.abs(p.x-15)+Math.abs(p.y-16)<5)sfx('haruWater');else if(dayPhase()===3)sfx('haruNight');else sfx(G.t%2?'haruBird':'haruWind');}
