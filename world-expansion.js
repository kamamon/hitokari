'use strict';
// Deterministic authored adventure maps, regional puzzle engines and life systems.
const EXP_GYM_MODES=['順序の石板','灯火の点灯','連動する歯車','記憶の紋章','重さの天秤','三色の結晶','足跡の回廊','相性の試問','時限の伝導路','回転する水路'];
const EXP_SIGNS=['◇','○','△','□','✦','月'];
function expansionState(){const p=HitokariUpgrade.progress(S);if(!p.world||typeof p.world!=='object')p.world={};const v=p.world;
 for(const k of ['gyms','plots','berries','decor','contests','facilities','quests'])if(!v[k]||typeof v[k]!=='object')v[k]={};
 if(!Number.isFinite(v.bp))v.bp=0;if(!v.base)v.base=null;return v;}
const expKey=(x,y)=>x+','+y;
const expAt=(m,x,y)=>m.adv&&m.adv[expKey(x,y)];
const expPut=(m,x,y,o)=>{(m.adv||(m.adv={}))[expKey(x,y)]=o;return o;};
const expSet=(m,x,y,v)=>{m.t[y*m.W+x]=v;};
function expFloor(m,x,y,v=T.GRASS){if(x>=0&&y>=0&&x<m.W&&y<m.H)expSet(m,x,y,v);}
function expHeight(m,x,y){return m.elevation&&x>=0&&y>=0&&x<m.W&&y<m.H?m.elevation[y*m.W+x]:0;}
function gymPuzzleSpec(k){
 const r=RNG('gym-puzzle-v2:'+gymLegacyId(k)),mode=(gymLegacyId(k)-1)%10,type=GYM_TYPES[k],n=mode===3?6:4,order=r.shuffle(Array.from({length:n},(_,i)=>i)),spec={k,mode,type,n,name:GYM_TOWN[k]+'・'+EXP_GYM_MODES[mode],order,clue:'',target:null};
 if(mode===0||mode===6||mode===8){spec.target=order.slice(0,mode===8?3:4);spec.clue=(mode===8?'45歩以内に ':'')+spec.target.map(i=>EXP_SIGNS[i]).join(' → ');}
 if(mode===1){spec.target=1+r.int(14);spec.clue='点灯：'+order.filter(i=>spec.target&(1<<i)).map(i=>EXP_SIGNS[i]).join('・');}
 if(mode===2){let mask=0;for(const i of order.slice(0,2+r.int(2)))mask^=(1<<i)|(1<<((i+1)%4));spec.target=mask||3;spec.clue='連動する灯りを '+[0,1,2,3].filter(i=>spec.target&(1<<i)).map(i=>EXP_SIGNS[i]).join('・')+' に';}
 if(mode===3){spec.target=Array(6);order.forEach((v,i)=>spec.target[v]=Math.floor(i/2));spec.clue='同じ色の紋章を 2つずつ 開く。';}
 if(mode===4){spec.weights=r.shuffle([1,2,3,4]);spec.target=spec.weights[order[0]]+spec.weights[order[1]];spec.clue='重さの 合計を '+spec.target+' に そろえる。';}
 if(mode===5||mode===9){spec.target=Array.from({length:4},()=>r.int(mode===5?3:4));if(spec.target.every(v=>v===0))spec.target[order[0]]=1;spec.clue=spec.target.map((v,i)=>EXP_SIGNS[i]+':'+(mode===5?['青','赤','金'][v]:['↑','→','↓','←'][v])).join(' ');}
 if(mode===7){spec.questions=[];for(let j=0;j<3;j++){
   const strong=j!==1,valid=Array.from({length:NT},(_,i)=>i).filter(i=>strong?typeEff(i,[type])>1:typeEff(i,[type])<1);
   const fallback=Array.from({length:NT},(_,i)=>i).filter(i=>typeEff(i,[type])===1);
   const pool=valid.length?valid:fallback,answer=r.pick(pool),wrong=r.shuffle(Array.from({length:NT},(_,i)=>i).filter(i=>!pool.includes(i))).slice(0,3),options=r.shuffle([answer,...wrong]);
   spec.questions.push({options,answer:options.indexOf(answer),text:TKANA[type]+(valid.length?(strong?' に ばつぐん':' に 半減・無効'):' に 等倍')+'の 攻撃は？'});
 }spec.target=spec.questions.map(q=>q.answer);spec.clue='3問の タイプ相性に 答える。';}
 return spec;
}
function freshGymState(spec){return{progress:0,mask:0,values:[0,0,0,0],matched:[],open:-1,start:-1,done:false};}
function gymApply(spec,st,i,steps=0){
 if(st.done||i<0||i>=spec.n)return st;const mode=spec.mode;
 if(mode===0||mode===6||mode===7||mode===8){
  if(mode===8&&st.start>=0&&steps-st.start>45){st.progress=0;st.start=-1;}
  if(i===spec.target[st.progress]){if(!st.progress)st.start=steps;st.progress++;}
  else{st.progress=i===spec.target[0]?1:0;st.start=st.progress?steps:-1;}
  st.done=st.progress===spec.target.length;
 }else if(mode===1||mode===2){st.mask^=mode===1?1<<i:(1<<i)|(1<<((i+1)%4));st.done=st.mask===spec.target;}
 else if(mode===3){if(st.matched.includes(i))return st;if(st.open<0){st.open=i;}else if(st.open!==i){if(spec.target[st.open]===spec.target[i])st.matched.push(st.open,i);st.open=-1;}st.done=st.matched.length===6;}
 else if(mode===4){st.mask^=1<<i;st.done=spec.weights.reduce((a,w,j)=>a+((st.mask&(1<<j))?w:0),0)===spec.target;}
 else if(mode===5||mode===9){st.values[i]=(st.values[i]+1)%(mode===5?3:4);st.done=st.values.every((v,j)=>v===spec.target[j]);}
 return st;
}
function gymPuzzleState(m){const v=expansionState().gyms,k=m.gymPuzzle.k;return v[k]||(v[k]=freshGymState(m.gymPuzzle));}
function gymPuzzleSolved(m){return !m.gymPuzzle||!!S.badges[m.gymPuzzle.k]||!!gymPuzzleState(m).done;}
function decorateGym(m){const k=m.cell.gym,spec=gymPuzzleSpec(k);m.gymPuzzle=spec;
 for(let y=1;y<m.H-1;y++)for(let x=1;x<m.W-1;x++)expSet(m,x,y,T.FLOOR);
 for(let x=1;x<m.W-1;x++)expSet(m,x,4,x===6?T.FLOOR:T.IWALL);expPut(m,6,4,{kind:'gymgate'});
 const coords=spec.n===6?[[2,7],[6,7],[10,7],[2,10],[6,10],[10,10]]:k%2?[[3,7],[9,7],[3,11],[9,11]]:[[2,8],[10,8],[4,12],[8,12]];
 // Rotate positions so solution and arrangement differ by district without blocking corridors.
 const layout=RNG('gym-layout:'+k).shuffle(coords.slice());layout.forEach(([x,y],i)=>{expSet(m,x,y,T.RUG);expPut(m,x,y,{kind:'gymplate',i,step:spec.mode===6||spec.mode===8});});
 // Distinct room motifs and traversable obstacle layouts; controls always have a route.
 const obstacles={0:[[2,5],[10,5]],1:[[2,6],[10,6],[2,12],[10,12]],2:[[3,6],[9,6],[3,10],[9,10]],3:[[4,5],[8,5],[4,9],[8,9]],4:[[5,6],[7,6],[5,11],[7,11]],5:[[2,5],[10,5],[2,10],[10,10]],6:[[4,6],[4,7],[4,8],[8,9],[8,10],[8,11]],7:[[2,5],[10,5],[5,8],[7,10]],8:[[3,6],[9,6],[3,9],[9,9]],9:[[4,6],[8,6],[4,10],[8,10]]}[spec.mode];
 for(const [x,y] of obstacles)if(!expAt(m,x,y))expSet(m,x,y,spec.mode===5?T.STATUE:spec.mode===1?T.PLANT:spec.mode===9?T.TABLE:T.IWALL);
 expSet(m,3,14,T.RUG);expPut(m,3,14,{kind:'gymhint'});expSet(m,9,14,T.RUG);expPut(m,9,14,{kind:'gymreset'});
 for(let y=2;y<4;y++)expSet(m,6,y,T.RUG);
 for(let i=0;i<m.objs.length;i++){const o=m.objs[i];if(o.role==='trainer'){o.x=i%2?1:11;o.y=6+(i-1)*3;o.dir=i%2?1:3;}}
 m.name=spec.name;
}
function gymClue(m){const s=m.gymPuzzle,q=gymPuzzleState(m);if(s.mode===7){const a=s.questions[Math.min(q.progress,2)];return a.text+'\n'+a.options.map((t,i)=>EXP_SIGNS[i]+TK[t]).join('　');}return s.clue;}
async function operateGym(m,i){
 if(gymPuzzleSolved(m)){await msg('仕掛けは もう 解けている。');return;}
 const s=m.gymPuzzle,st=gymPuzzleState(m),before=st.progress,oldOpen=st.open,oldMatched=st.matched.length;gymApply(s,st,i,S.steps);sfx(st.done?'get':'sel');
 if(st.done){ring(120,85,'150,255,200',{dr:4,w:3});G.banner={text:'仕掛け解除！ リーダーへの 道が 開いた',t:140};saveGame();await msg('カチッ！　奥の 扉が 開いた！');return;}
 if(s.mode===3){await msg(oldOpen<0||oldOpen===i?'紋章 '+EXP_SIGNS[i]+' は '+['青','赤','金'][s.target[i]]+'色。':st.matched.length>oldMatched?'同じ色の 紋章が つながった！':'色が ちがった。もう一度。');}
 else if([0,6,7,8].includes(s.mode)){if(st.progress<=before){G.banner={text:'順序が ちがう！',t:70};if(s.mode===7)await msg('答えが ちがう。もう一度。');}else G.banner={text:'仕掛け '+st.progress+'/'+s.target.length,t:75};}
 else G.banner={text:'仕掛けが 動いた',t:55};
}
function findPortal(m,x0,y0){const a=[];for(let y=3;y<m.H-3;y++)for(let x=3;x<m.W-3;x++){const v=m.t[y*m.W+x];if(v!==T.PATH&&v!==T.GRASS&&v!==T.FLOWER)continue;if(m.warps[expKey(x,y)]||occupied(m,x,y)||expAt(m,x,y))continue;
 if(![0,1,2,3].some(d=>m.t[(y+DY[d])*m.W+x+DX[d]]===T.PATH&&!occupied(m,x+DX[d],y+DY[d])))continue;a.push([x,y]);}
 a.sort((a,b)=>Math.abs(a[0]-x0)+Math.abs(a[1]-y0)-Math.abs(b[0]-x0)-Math.abs(b[1]-y0));return a[0];}
function portalAt(m,kind,x,y,label){const p=findPortal(m,x,y);if(p)expPut(m,p[0],p[1],{kind:'portal',area:kind,label,returnX:p[0],returnY:p[1]});return p;}
function decorateExpansionMap(m){
 if(m.advDecorated)return;m.advDecorated=true;
 if(m.advArea||m.haru||m.tribel||m.route3)return;
 if(m.bk==='gym'){decorateGym(m);return;}
 if(!m.indoor&&m.cell&&m.cell.kind==='town'){
  const k=m.cell.gym?gymLegacyId(m.cell.gym):m.cell.dist||1;
  const area=k%3===0?'coast':k%3===1?'ridge':'river';
  portalAt(m,area,12,17,{ridge:'段丘の森',river:'水晶瀑布',coast:'潮の入江'}[area]);
  if(k%5===0||m.cell.main===0)portalAt(m,'contest',18,14,'彩華祭ホール');
  if(m.cell.gym===1&&area!=='ridge')portalAt(m,'ridge',17,19,'段丘の森');
  if(k===50||m.cell.gym===50||m.blds.some(b=>b.kind==='league'))portalAt(m,'hub',18,17,'巡環修練場');
  const p=findPortal(m,13,15);if(p)expPut(m,p[0],p[1],{kind:'berry',plot:0});
  addLifePortal(m);
 }else if(!m.indoor&&m.cell&&!m.cell.gate&&m.cell.kind!=='sea'){
  // Optional existing-pond bridges; never overwrite gates or occupied/warp tiles.
  let done=false;for(let y=3;y<m.H-3&&!done;y++)for(let x=3;x<m.W-4&&!done;x++){
   if(m.t[y*m.W+x]!==T.WATER||occupied(m,x,y)||m.warps[expKey(x,y)])continue;
   let e=x;while(e<m.W-2&&m.t[y*m.W+e]===T.WATER&&!occupied(m,e,y)&&!m.warps[expKey(e,y)])e++;
   if(e-x<=4&&e>x&&!SOLID[m.t[y*m.W+x-1]]&&!SOLID[m.t[y*m.W+e]]){for(let i=x;i<e;i++){expSet(m,i,y,T.PATH);expPut(m,i,y,{kind:'bridge',dir:1});}done=true;}
  }
 }
}
const EXP_AREAS=new Set(['ridge','river','coast','undersea','base','hub','contest','trial-single','trial-double','trial-rental','trial-endurance','life','tribel-lake','tribel-hill']);
function validExpansionMapId(id){if(typeof id!=='string')return false;const p=id.split(':');return p.length===3&&p[0]==='a'&&EXP_AREAS.has(p[1])&&Object.prototype.hasOwnProperty.call(CELLS,p[2])&&(!p[1].startsWith('tribel-')||p[2]===TRIBEL_KEY);}
function expId(area,cell){return 'a:'+area+':'+cell.key;}
function expTownReturn(cell,area){const m=getMap(cell.key);for(const [k,o] of Object.entries(m.adv||{}))if(o.kind==='portal'&&o.area===area){const [x,y]=k.split(',').map(Number);return{map:cell.key,x,y,dir:2};}return{map:cell.key,x:15,y:15,dir:2};}
function expExit(m,x,y,to){expSet(m,x,y,T.MAT);m.warps[expKey(x,y)]=to;expPut(m,x,y,{kind:'exit'});}
function expOutdoor(id,cell,w,h,pal='plain'){const m=newMap(id,cell,w,h,T.TREE);m.advArea=id.split(':')[1];m.pal=pal;m.name=cell.name;m.border=T.TREE;m.adv={};m.elevation=new Uint8Array(w*h);
 for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++)expSet(m,x,y,T.GRASS);return m;}
function expSiteItem(m,x,y,id,iid){m.objs.push({k:'item',iid:'exp'+iid,x,y,item:id});}
function expSiteTrainer(m,x,y,dir,tid){const r=RNG('exp-trainer:'+m.id+':'+tid),o=genTrainer(r,m.cell,tid,{n:3,los:3,bonus:2});o.x=x;o.y=y;o.dir=dir;o.double=tid===91;if(o.double)o.cls='双戦 '+o.cls;m.objs.push(o);}
function expansionEncounter(m,area){
 const c=m.cell,r=RNG('ecology:'+m.id),target=clamp(c.prog/50,0,1),types=area==='ridge'?[4,9,11,12,8]:area==='river'?[2,4,9,3]:area==='coast'?[2,9,5,12]:[2,5,10,13,16];
 const pool=FAMS.filter(f=>!f.legend&&!f.starter&&!f.one&&!f.rareRoute1);
 const choose=(list,n)=>list.map(f=>({f,score:Math.abs(f.tier-target)+(types.includes(f.t1)||types.includes(f.t2)?0:.22)+r()*.04})).sort((a,b)=>a.score-b.score).slice(0,n).map(v=>v.f.id);
 const land=choose(pool.filter(f=>f.hab!=='water'),7),water=choose(pool.filter(f=>f.hab==='water'),6);
 return {...c,land,water,rare:null,lv:Math.max(3,c.lv),name:m.name};
}
function generateExpansionMap(id){
 if(!validExpansionMapId(id))throw Error('invalid expansion map');const [,area,key]=id.split(':'),cell=CELLS[key],r=RNG('adventure:'+id);let m;
 if(area==='tribel-lake'||area==='tribel-hill')return genTribelMap(area==='tribel-lake'?'lake':'hill',cell);
 if(area==='life')return generateLifeDistrict(id,cell);
 if(area==='ridge'){
  m=expOutdoor(id,cell,23,24,cell.pal==='cave'?'forest':cell.pal);m.name=cell.name+'・風渡り段丘';m.enc={rate:13,bonus:1};
  for(let y=1;y<m.H-1;y++)for(let x=1;x<m.W-1;x++){
   m.elevation[y*m.W+x]=y<5?2:y<11?1:0;expSet(m,x,y,x===4||x===18||y===15||y===8||y===3?T.PATH:r.chance(.24)?T.TALL:T.GRASS);
   if(y===5||y===11){expSet(m,x,y,T.ROCK);expPut(m,x,y,{kind:'cliff'});}
  }
  for(const y of [5,11]){for(const x of [4,18]){expSet(m,x,y,T.PATH);expPut(m,x,y,{kind:'stairs'});}
   const x=y===5?12:10;expSet(m,x,y,T.PATH);expPut(m,x,y,{kind:'ledge',dir:2});}
  expExit(m,11,23,expTownReturn(cell,'ridge'));expSet(m,11,22,T.PATH);
  expPut(m,4,3,{kind:'baseSite',label:'岩の ひみつ穴'});expPut(m,15,15,{kind:'berry',plot:1});expPut(m,7,19,{kind:'berry',plot:2});expSiteItem(m,18,2,'I0026',1);expSiteItem(m,6,7,'heal2',2);
  expPut(m,11,20,{kind:'sign',label:'段丘：階段で上り下り。白い縁の段差は 高い所から南へ 飛びおりられる。'});
  expSiteTrainer(m,8,15,1,90);
 }else if(area==='river'){
  m=expOutdoor(id,cell,23,24,'forest');m.name=cell.name+'・水晶瀑布';m.enc={rate:15,bonus:2};
  for(let y=1;y<23;y++)for(let x=1;x<22;x++){const wet=x>=7&&x<=15;expSet(m,x,y,wet?T.WATER:x===5||x===17?T.PATH:r.chance(.18)?T.TALL:T.GRASS);
   m.elevation[y*m.W+x]=y<=7?1:0;
   if(y===7){if(wet)expPut(m,x,y,{kind:'fall'});else if(x===5||x===17){expSet(m,x,y,T.PATH);expPut(m,x,y,{kind:'stairs'});}else{expSet(m,x,y,T.ROCK);expPut(m,x,y,{kind:'cliff'});}}
  }
  for(let x=6;x<=16;x++){expSet(m,x,16,T.PATH);expPut(m,x,16,{kind:'bridge',dir:1});}
  // Upper pool island, approached by water only.
  for(let y=2;y<=3;y++)for(let x=10;x<=12;x++)expSet(m,x,y,T.SAND);
  expSiteItem(m,11,2,'heal3',1);expPut(m,3,11,{kind:'berry',plot:1});expPut(m,19,19,{kind:'berry',plot:2});
  expExit(m,5,23,expTownReturn(cell,'river'));expSet(m,5,22,T.PATH);
  expPut(m,5,19,{kind:'sign',label:'木橋は 歩いて わたれる。滝は バッジ8個と 水上移動の道具で 上り下りできる。'});
  expSiteTrainer(m,17,11,2,91);
 }else if(area==='coast'){
  m=expOutdoor(id,cell,23,24,'coast');m.name=cell.name+'・潮の入江';m.enc={rate:12,bonus:1};
  for(let y=1;y<23;y++)for(let x=1;x<22;x++)expSet(m,x,y,y>=18||x<=3||x>=20?T.SAND:T.WATER);
  for(let y=4;y<=6;y++)for(let x=10;x<=12;x++)expSet(m,x,y,T.SAND);
  for(let x=3;x<=9;x++){expSet(m,x,12,T.PATH);expPut(m,x,12,{kind:'bridge',dir:1});}
  expPut(m,12,10,{kind:'dive'});expPut(m,6,20,{kind:'berry',plot:1});expPut(m,15,21,{kind:'berry',plot:2});
  expSiteItem(m,11,5,'I0038',1);expExit(m,11,23,expTownReturn(cell,'coast'));
  expPut(m,11,20,{kind:'sign',label:'深い青の 水面に A。バッジ6個と 水上移動の道具が あれば 海底に 潜れる。'});
 }else if(area==='undersea'){
  m=expOutdoor(id,cell,23,24,'cave');m.name=cell.name+'・蒼光の海底';m.border=T.ROCK;m.enc={rate:11,bonus:3};
  for(let y=0;y<m.H;y++)for(let x=0;x<m.W;x++){expSet(m,x,y,x===0||y===0||x===m.W-1||y===m.H-1?T.ROCK:T.CFLOOR);if(x>1&&x<m.W-2&&y>2&&y<m.H-3&&r.chance(.10)&&!(x>=10&&x<=12))expSet(m,x,y,T.ROCK);else if(x>1&&x<m.W-2&&y>2&&y<m.H-3&&r.chance(.12))expPut(m,x,y,{kind:'coral',tone:r.int(3)});}
  expPut(m,11,20,{kind:'surface'});expSiteItem(m,11,3,'I0041',1);expPut(m,11,6,{kind:'sign',label:'海底の 結晶が 青く 光っている。出口は 南の 光の輪。'});
 }else if(area==='base'){
  m=room(id,cell,15,13);m.advArea=area;m.name='ひみつ基地';m.adv={};
  for(let x=3;x<=11;x++)expSet(m,x,7,T.RUG);
  expPut(m,3,3,{kind:'furniture',slot:0});expPut(m,7,3,{kind:'furniture',slot:1});expPut(m,11,3,{kind:'furniture',slot:2});expPut(m,7,9,{kind:'baseRest'});
  expPut(m,2,9,{kind:'sign',label:'家具は 調べて 配置変更。休息の 印で 相棒を 回復。'});
  expExit(m,7,12,{map:expId('ridge',cell),x:4,y:3,dir:2});
 }else if(area==='hub'||area==='contest'){
  m=room(id,cell,17,15);m.advArea=area;m.name=area==='hub'?'巡環修練場・中央館':'彩華祭・演技ホール';m.adv={};
  for(let y=2;y<=12;y++)for(let x=2;x<=14;x++)if(y===7||x===8)expSet(m,x,y,T.RUG);
  const desks=area==='hub'?[[3,3,'single'],[8,3,'double'],[13,3,'rental'],[3,9,'endurance'],[13,9,'exchange']]:[[4,4,'beauty'],[8,4,'skill'],[12,4,'spirit'],[4,9,'cute'],[12,9,'power']];
  desks.forEach(([x,y,v])=>expPut(m,x,y,{kind:area==='hub'?(v==='exchange'?'facility':'trialPortal'):'contest',mode:v}));
  expPut(m,8,11,{kind:'sign',label:area==='hub'?'各 受付の 印に A。連勝とポイントを 競う。':'各 受付で アニマの 演技大会に 参加できる。'});
  expExit(m,8,14,expTownReturn(cell,area));
 }else if(area.startsWith('trial-')){
  const mode=area.slice(6),f=EXP_FACILITIES[mode];m=room(id,cell,17,15);m.advArea=area;m.name=f.name+'・専用競技場';m.adv={};
  for(let y=2;y<=11;y++)for(let x=2;x<=14;x++){if(x>=5&&x<=11&&y>=3&&y<=9)expSet(m,x,y,T.RUG);else if(mode==='rental'&&(x===3||x===13)&&y%3===0)expSet(m,x,y,T.PLANT);else if(mode==='endurance'&&(x===3||x===13)&&y%3===0)expSet(m,x,y,T.STATUE);else if(mode==='single'&&y===4&&(x===3||x===13))expSet(m,x,y,T.STATUE);}
  expPut(m,8,3,{kind:'facility',mode});expPut(m,8,10,{kind:'sign',label:f.name+'：'+f.rounds+'連戦／'+f.size+'体／Lv50'});expExit(m,8,14,{map:expId('hub',cell),x:8,y:12,dir:2});
 }
 if(m.enc)m.advEnc=expansionEncounter(m,area);
 return m;
}
function expansionLedge(m,x,y,nx,ny){const a=expAt(m,x,y),b=expAt(m,nx,ny);return !!((a&&a.kind==='ledge'||b&&b.kind==='ledge')&&ny>y);}
function expansionPass(m,x,y,nx,ny,p){
 const a=expAt(m,x,y),b=expAt(m,nx,ny);if(b&&b.kind==='gymgate'&&!gymPuzzleSolved(m))return false;
 if(p.fly)return !m.advArea;
 const fall=a&&a.kind==='fall'||b&&b.kind==='fall';if(fall&&(!p.surf||badgeCount()<8||!hasItem('k_surf')||nx!==x))return false;
 const ledge=a&&a.kind==='ledge'||b&&b.kind==='ledge';if(ledge&&!(ny>y&&nx===x))return false;
 const z=expHeight(m,x,y),nz=expHeight(m,nx,ny);
 if(z!==nz&&!fall&&!ledge&&!(a&&a.kind==='stairs'||b&&b.kind==='stairs'))return false;
 return true;
}
function expansionLift(m,p){const z=expHeight(m,p.x,p.y),q=p.moving?p.prog/16:0,n=expHeight(m,p.x+DX[p.dir],p.y+DY[p.dir]);return (z+(n-z)*q)*1.5+(p.ledgeJump?Math.sin(q*Math.PI)*7:0);}
function expansionStep(m,p){
 if(m.gymPuzzle&&!gymPuzzleSolved(m)){const a=expAt(m,p.x,p.y);if(a&&a.kind==='gymplate'&&a.step){const s=m.gymPuzzle,st=gymPuzzleState(m),was=st.progress;gymApply(s,st,a.i,S.steps);if(st.done){sfx('get');G.banner={text:'仕掛け解除！ 奥の扉が 開いた',t:130};}else G.banner={text:st.progress>was?'正しい 足跡 '+st.progress+'/'+s.target.length:'順序が ちがう！',t:75};}}
}
function expansionInteract(m,x,y){
 const p=G.pl,front=expAt(m,x,y),here=expAt(m,p.x,p.y);let a=front,ax=x,ay=y;
 if(here&&['dive','surface','portal','gymplate','berry','baseSite','furniture','baseRest','facility','trialPortal','contest','landmark','gymhint','gymreset'].includes(here.kind)&&(!front||front.kind==='exit')){a=here;ax=p.x;ay=p.y;}
 if(!a)return false;
 if(a.kind==='gymplate'){if(a.step){run(()=>msg('この 石板は 上を 歩いて 作動させる。'));}else run(()=>operateGym(m,a.i));return true;}
 if(a.kind==='gymhint'){run(()=>msg(gymClue(m)));return true;}
 if(a.kind==='gymreset'){run(async()=>{if(await confirmYN('仕掛けを 初期状態へ 戻す？')){expansionState().gyms[m.gymPuzzle.k]=freshGymState(m.gymPuzzle);sfx('sel');}});return true;}
 if(a.kind==='gymgate'&&!gymPuzzleSolved(m)){run(()=>msg('仕掛けを 解くと 奥の 扉が 開く。'));return true;}
 if(a.kind==='portal'){run(async()=>{if(!S.flags.dex){await msg('まずは 博士の 研究所へ。');return;}if(a.area==='hub'&&!S.flags.champ){await msg('殿堂入りした アニマ使いだけが 入れる。');return;}if(await confirmYN(a.label+'へ 行きますか？')){const dest=generateExpansionEntry(a.area,m.cell);await warpTo(dest,0);autoSave();}});return true;}
 if(a.kind==='dive'){run(async()=>{if(!p.surf||badgeCount()<6||!hasItem('k_surf')){await msg('水上移動中に バッジ6個以上で ここから 潜れる。');return;}if(await confirmYN('海底へ 潜りますか？')){await warpTo({map:expId('undersea',m.cell),x:11,y:19},0);G.pl.surf=false;autoSave();}});return true;}
 if(a.kind==='surface'){run(async()=>{await warpTo({map:expId('coast',m.cell),x:12,y:10},2);G.pl.surf=true;autoSave();});return true;}
 if(a.kind==='fall'){if(!p.surf){run(()=>msg('水上移動で 滝の 下へ。バッジ8個が 必要。'));return true;}if(badgeCount()<8){run(()=>msg('滝を のぼるには バッジ8個が 必要。'));return true;}return false;}
 if(a.kind==='sign'){run(()=>msg(a.label));return true;}
 if(a.kind==='landmark'){run(()=>visitIndividualLandmark(m,a));return true;}
 if(a.kind==='berry'){run(()=>berryPlotMenu(m,ax,ay));return true;}
 if(a.kind==='baseSite'){run(()=>claimBase(m,ax,ay));return true;}
 if(a.kind==='furniture'){run(()=>furnitureMenu(a.slot));return true;}
 if(a.kind==='baseRest'){run(async()=>{if(await confirmYN('ひみつ基地で 休む？')){sfx('heal');S.party.forEach(healMon);await msg('みんな 元気に なった！');saveGame();}});return true;}
 if(a.kind==='trialPortal'){run(async()=>{if(await confirmYN(EXP_FACILITIES[a.mode].name+'へ 行きますか？')){await warpTo({map:expId('trial-'+a.mode,m.cell),x:8,y:13},0);autoSave();}});return true;}
 if(a.kind==='facility'){run(()=>expansionFacility(a.mode));return true;}
 if(a.kind==='contest'){run(()=>contestMenu(a.mode));return true;}
 return false;
}
function generateExpansionEntry(area,cell){const coords={ridge:[11,22],river:[5,22],coast:[11,22],hub:[8,13],contest:[8,13],base:[7,11],undersea:[11,19],life:[15,29]},q=coords[area];return{map:expId(area,cell),x:q[0],y:q[1]};}
// Berries are original fruits, grown using travel steps and real elapsed time.
const EXP_FRUITS=[
 {name:'ひだまりの実',color:'#edab3d',grow:180,effect:'heal',value:30},
 {name:'しずくの実',color:'#54b9d7',grow:220,effect:'cure',value:1},
 {name:'絆の実',color:'#e77c9b',grow:260,effect:'bond',value:8},
 {name:'風羽の実',color:'#88c87d',grow:300,effect:'contest',value:12},
 {name:'星蜜の実',color:'#ba9af2',grow:360,effect:'contest',value:20}
];
function fruitAge(plot,steps,now=Date.now()){return Math.max(0,steps-plot.steps,Math.floor((now-plot.time)/60000)*6);}
function fruitStage(plot,steps,now=Date.now()){if(!plot)return 0;const a=fruitAge(plot,steps,now),g=EXP_FRUITS[plot.type].grow;return a>=g?3:a>=g*.5?2:1;}
function fruitCount(type){return expansionState().berries[type]||0;}
function fruitAdd(type,n){const b=expansionState().berries;b[type]=Math.max(0,(b[type]||0)+n);}
async function berryPlotMenu(m,x,y){if(!S.flags.dex){await msg('図鑑を もらってから 来よう。');return;}const v=expansionState(),key=m.id+':'+expKey(x,y);let plot=v.plots[key];
 if(!plot){if(!v.fruitIntro){v.fruitIntro=true;for(let i=0;i<EXP_FRUITS.length;i++)fruitAdd(i,2);await msg('旅の農園から 5種類の 実を 2つずつ もらった！');}
  const i=await menu(EXP_FRUITS.map((f,i)=>({label:f.name,right:'×'+fruitCount(i),dis:!fruitCount(i)})),{x:8,y:38,w:224,title:'植える 実を 選ぶ'});if(i<0)return;fruitAdd(i,-1);v.plots[key]={type:i,steps:S.steps,time:Date.now(),water:false};sfx('get');await msg(EXP_FRUITS[i].name+'を 植えた。水を あげると 収穫が 増える。');saveGame();return;
 }
 const f=EXP_FRUITS[plot.type],stage=fruitStage(plot,S.steps);
 if(stage===3){const n=plot.water?4:2;fruitAdd(plot.type,n);delete v.plots[key];sfx('get');await msg(f.name+'を '+n+'個 収穫した！');saveGame();}
 else if(!plot.water&&await confirmYN(f.name+'が 育っている。水を あげる？')){plot.water=true;sfx('heal');await msg('水を あげた！');saveGame();}
 else await msg(f.name+'　成長 '+Math.min(99,Math.floor(fruitAge(plot,S.steps)/f.grow*100))+'％');
}
async function useFruitMenu(){const i=await menu(EXP_FRUITS.map((f,i)=>({label:f.name,right:'×'+fruitCount(i),dis:!fruitCount(i)})),{x:8,y:30,w:224,title:'実の ポーチ'});if(i<0)return;const f=EXP_FRUITS[i];if(f.effect==='contest'){await msg('彩華祭で アニマに あげると 演技を 助ける。');return;}if(!S.party.length)return;const j=await partyPick({title:'だれに あげる？'});if(j<0)return;const m=S.party[j];
 if(f.effect==='heal'){if(m.hp<=0||m.hp>=maxHP(m)){await msg('効果が ない。');return;}m.hp=Math.min(maxHP(m),m.hp+f.value);}
 if(f.effect==='cure'){if(!m.st){await msg('効果が ない。');return;}m.st=null;m.sc=0;}
 if(f.effect==='bond')HitokariUpgrade.bond(m,f.value);fruitAdd(i,-1);sfx('heal');await msg(monName(m)+'に '+f.name+'を あげた！');saveGame();}
const EXP_FURNITURE=[['なし',0],['木のベンチ',200],['花の鉢',250],['星のランプ',400],['水晶の飾り',600],['アニマの絵',350],['紋章の敷物',500],['記念トロフィー',850]];
async function claimBase(m,x,y){if(badgeCount()<3){await msg('この 穴を 基地に するには バッジ3個が 必要。');return;}const v=expansionState();if(!v.base||v.base.cell!==m.cell.key){if(!(await confirmYN(v.base?'今の 基地から ここへ 引っこす？':'ここを ひみつ基地に する？')))return;v.base={cell:m.cell.key,x,y};sfx('get');await msg('ひみつ基地を 開いた！ 家具を 自由に 置ける。');}
 await warpTo(generateExpansionEntry('base',m.cell),0);saveGame();}
async function furnitureMenu(slot){const v=expansionState(),i=await menu(EXP_FURNITURE.map(([name,cost],i)=>({label:name,right:v.decorOwned&&v.decorOwned[i]||i===0?'所持':cost+'G'})),{x:8,y:26,w:224,title:'家具を 選ぶ'});if(i<0)return;v.decorOwned=v.decorOwned||{};const cost=EXP_FURNITURE[i][1];if(i&&!v.decorOwned[i]){if(S.money<cost){await msg('お金が 足りない。');return;}if(!await confirmYN(cost+'Gで 買う？'))return;S.money-=cost;v.decorOwned[i]=true;}
 v.decor[slot]=i;sfx('get');saveGame();}
const CONTEST_RULES={beauty:{name:'うつくしさ',types:[2,4,5,9],stat:4},skill:{name:'かしこさ',types:[3,10,13,16],stat:3},spirit:{name:'たくましさ',types:[6,8,12,16],stat:2},cute:{name:'かわいさ',types:[0,4,11,10],stat:5},power:{name:'かっこよさ',types:[1,6,14,15],stat:1}};
function contestStage(m,rule,round,score,opponents){screenBG('彩華祭　'+rule.name+'　演技 '+(round+1)+'/5');const g=ctx;g.fillStyle='#31465e';g.fillRect(0,15,LW,135);g.fillStyle='#bc9368';g.fillRect(10,101,220,48);g.fillStyle='#e4c89e';g.beginPath();g.ellipse(120,107,84,22,0,0,6.3);g.fill();for(let i=0;i<7;i++){g.fillStyle=i%2?'#f0c684':'#b3d9cf';g.beginPath();g.moveTo(17+i*34,15);g.lineTo(7+i*34,46);g.lineTo(27+i*34,46);g.closePath();g.fill();}for(let i=0;i<3;i++){const x=17+i*79;g.fillStyle='#233749';g.fillRect(x,21,50,19);tx('ライバル '+(i+1),x+25,23,'#dbe7ed',7,'center');tx(opponents[i]+'点',x+25,31,'#fff1c7',7,'center');}drawLive(g,m,91,54,1.8,false,1,0,0);fxDraw(g);win(5,119,230,28);tx(monName(m)+'　'+score+'点',12,124,'#263b47',10);bar(12,139,216,3,Math.min(1,score/200),'#cc9b55');}
function contestAppeal(m,mv,rule,last,round){const bond=HitokariUpgrade.bond(m);return Math.round(8+(rule.types.includes(mv.type)?12:0)+Math.min(12,Math.floor(mv.pow/10))+(!mv.pow?6:0)+(last===mv.id?-10:4)+Math.min(8,Math.floor(bond/32))+Math.min(6,Math.floor(stat(m,rule.stat)/28))+(round===4?4:0));}
async function contestMenu(mode){
 if(badgeCount()<2){await msg('彩華祭には バッジ2個が 必要。');return;}const rule=CONTEST_RULES[mode],v=expansionState();if(!rule||!S.party.length)return;const rank=await menu(['ノーマル','スーパー','ハイパー','マスター'].map((n,i)=>({label:n,dis:i>0&&!(v.contests[mode+':'+(i-1)]>0)})),{x:12,y:42,w:216,title:rule.name+'　ランク'});if(rank<0)return;
 const j=await partyPick({title:'出場する 相棒を 選ぶ'});if(j<0)return;const m=S.party[j];if(m.hp<=0){await msg('元気な 相棒を 選ぼう。');return;}
 let score=0,last=-99,combo=0;if(fruitCount(3)||fruitCount(4)){const b=await menu(['実を 使わない',...([3,4].map(i=>({label:EXP_FRUITS[i].name,right:'×'+fruitCount(i),dis:!fruitCount(i)})))],{x:12,y:45,w:216,title:'演技の 前に'});if(b>0){fruitAdd(b+2,-1);score+=EXP_FRUITS[b+2].value;}}
 await msg(rule.name+' の 彩華祭！ 5回の 演技。おなじ技の 連続使用は 評価が 下がる。');
 const opponents=[0,0,0];for(let round=0;round<5;round++){
  const opts=m.mv.map(v=>MOVES[v.id]);if(!opts.length){await msg('演技に 使える 技が ない。');return;}
  const i=await menu(opts.map(mv=>({label:mv.name,right:(rule.types.includes(mv.type)?'◎':'○')+(last===mv.id?' 連続':'')})),{x:8,y:45,w:224,title:'演技 '+(round+1)+'/5',cancel:false,bg:()=>contestStage(m,rule,round,score,opponents)});if(i<0)continue;
  const mv=opts[i],appeal=contestAppeal(m,mv,rule,last,round);combo=last!==mv.id?combo+1:0;last=mv.id;score+=Math.max(0,appeal)+(combo>=3?3:0);for(let x=0;x<3;x++)opponents[x]+=18+rank*6+ri(12+x*2);
  sfx('get');const stage=pushBG(()=>contestStage(m,rule,round,score,opponents));try{enhancedSkillCue({x:120,y:85},{x:120,y:85},mv,mv.pow>=80?2:1);sparkleFx(120,85,12);await sleep(220);await msg(mv.name+'！ 観客の 評価 +'+Math.max(0,appeal));}finally{popW(stage);fxClear();}
 }
 const place=1+opponents.filter(n=>n>score).length;v.contests[mode+':'+rank]=place===1?Math.max(1,v.contests[mode+':'+rank]||0):v.contests[mode+':'+rank]||0;v.contestBest=Math.max(v.contestBest||0,score);if(place===1){v.bp+=5+rank*3;HitokariUpgrade.bond(m,5);fruitAdd(3,1);sfx('lvup');}
 await msg('結果発表！ '+score+'点・第'+place+'位。'+(place===1?'彩華章と 修練ポイントを 獲得！':''));saveGame();}
const EXP_FACILITIES={single:{name:'単戦の塔',rounds:7,size:3,double:false,heal:true},double:{name:'双戦の塔',rounds:7,size:4,double:true,heal:true},rental:{name:'貸出の庭',rounds:3,size:3,double:false,heal:true,rental:true},endurance:{name:'持久の迷宮',rounds:5,size:3,double:false,heal:false}};
async function expansionFacilityGuide(){await msg('巡環修練場は テンカイ門・リーグの町の 印から 入れる。殿堂入りが 条件。単戦・双戦・貸出・持久の 4施設が ある。');}
async function expansionExchange(){const v=expansionState(),stock=[['heal3',3],['candy',10],['fuda3',5],['I0041',6],['I0038',8]];for(;;){const i=await menu(stock.map(([id,c])=>({label:ITEMS[id].n,right:c+'BP',dis:v.bp<c})),{x:6,y:34,w:228,title:'交換所　'+v.bp+'BP'});if(i<0)return;const [id,c]=stock[i];if(await confirmYN(c+'BPで 交換する？')){v.bp-=c;bagAdd(id);sfx('get');saveGame();}}}
async function expansionFacility(mode){
 if(!S.flags.champ){await msg('殿堂入りしてから 挑戦できる。');return;}if(mode==='exchange'){await expansionExchange();return;}
 const f=EXP_FACILITIES[mode],v=expansionState();if(!f||facilityActive)return;
 const record=v.facilities[mode]||(v.facilities[mode]={best:0,streak:0,clears:0});
 await msg(f.name+'　'+f.rounds+'連戦・Lv50・'+f.size+'体。'+(f.heal?'各戦の あと 回復。':'戦闘間の 回復なし。'));
 let real=S.party,select=[],pool=real;
 if(f.rental){const r=RNG('rental:'+record.clears+':'+record.streak+':'+S.steps),c=famCand(50,null).slice();r.shuffle(c);pool=c.slice(0,6).map(x=>makeMon(formAt(x,50),50,{iv:25,shiny:false}));}
 if(pool.length<f.size){await msg('参加には '+f.size+'匹が 必要。');return;}
 while(select.length<f.size){const i=await menu(pool.map((m,i)=>({label:monName(m),right:'Lv'+m.lv,dis:select.includes(i)||select.some(j=>pool[j].sp===m.sp)})),{x:6,y:26,w:228,title:(f.rental?'貸出 ':'')+(select.length+1)+'匹目'});if(i<0)return;select.push(i);}
 if(!(await confirmYN('この 編成で 挑戦する？')))return;
 const seen={...S.seen},speaker=SPEAKER;let won=0,completed=false;facilityActive=true;
 try{S.party=select.map(i=>{const m=JSON.parse(JSON.stringify(pool[i]));m.lv=50;m.exp=expFor(SP[m.sp],50);healMon(m);return m;});
 for(let round=0;round<f.rounds;round++){const r=RNG('trial:'+mode+':'+record.streak+':'+record.clears+':'+round),c=famCand(50,null).slice();r.shuffle(c);const team=c.slice(0,f.size).map(x=>({sp:formAt(x,50),lv:50}));
  if(round&&f.heal)S.party.forEach(healMon);await msg(f.name+'　第'+(round+1)+'戦／'+f.rounds);
  const result=await battle({facility:true,double:f.double,trainer:{name:'修練官 '+(round+1),team:mkTeam(team,Math.min(31,22+round+record.streak)),money:0,spr:pSpr(60+round%4)}});
  if(result!=='win')break;won++;
 }completed=true;
 }finally{S.party=real;S.seen=seen;SPEAKER=speaker;facilityActive=false;if(BT){BT=null;fxClear();UI.length=0;G.scene='world';G.fade=0;}folReset();}
 if(completed){record.streak=won===f.rounds?record.streak+won:0;record.best=Math.max(record.best,record.streak,won);if(won===f.rounds)record.clears++;const earned=won+(won===f.rounds?f.rounds:0);v.bp+=earned;await msg(won+'/'+f.rounds+' 勝利！ '+earned+'BP 獲得。最高連勝 '+record.best);saveGame();}
}
async function expansionLifeMenu(){const v=expansionState();for(;;){const i=await menu(['実のポーチ','農園の記録','ひみつ基地の場所','彩華祭の記録','修練場の記録','地方の探訪案内','もどる'],{x:8,y:24,w:224,title:'旅の生活',bg:()=>screenBG()});if(i<0||i===6)return;
 if(i===0)await useFruitMenu();if(i===1){const plots=Object.values(v.plots);await msg('栽培中 '+plots.length+'か所、収穫できる 実 '+plots.filter(p=>fruitStage(p,S.steps)===3).length+'か所。');}
 if(i===2)await msg(v.base?'ひみつ基地：'+CELLS[v.base.cell].name+' の 風渡り段丘。':'段丘の 岩穴を 調べよう。バッジ3個から 基地に できる。');
 if(i===3)await msg('彩華章 '+Object.values(v.contests).filter(n=>n>0).length+'／20　最高 '+(v.contestBest||0)+'点。');
 if(i===4)await msg('修練ポイント '+v.bp+'BP\n'+Object.entries(EXP_FACILITIES).map(([k,f])=>f.name+' '+(v.facilities[k]?.best||0)+'連勝').join('\n'));
 if(i===5)await msg('町の 特別な 印に A。段丘、瀑布、入江から 海底へ。5地区ごとの 彩華祭、殿堂入り後の 修練場。');
 }}
// Town NPCs reserve destinations so movement cannot overlap the player or other actors.
function tickExpansionNPC(canInput){if(!G.map||G.map.indoor||G.map.advArea)return;const p=G.pl,m=G.map;
 for(const o of G.objs){if(o.role!=='civ'||o.gift)continue;
  if(o.npcMove){const z=o.npcMove;z.t++;o.ox=(z.x-o.x)*16*Math.min(1,z.t/12);o.oy=(z.y-o.y)*16*Math.min(1,z.t/12);if(z.t>=12){o.x=z.x;o.y=z.y;o.ox=o.oy=0;o.npcMove=null;}continue;}
  if(!canInput||G.busy||p.fly||Math.abs(o.x-p.x)+Math.abs(o.y-p.y)<2)continue;
  if((G.t+hashStr(String(o.pid)))%npcProfile(o.pid)[6]!==0)continue;
  const phase=dayPhase(),schedule=npcScheduleAt(o.pid),r=RNG('npc-destination:'+o.pid+':'+schedule.zone),target=[o.homeX+r.range(-2,2),o.homeY+r.range(-2,2)],directions=RNG('npc:'+o.pid+':'+phase+':'+Math.floor(G.t/143)).shuffle([0,1,2,3]);
  if(Math.abs(o.x-target[0])+Math.abs(o.y-target[1])>0)directions.sort((a,b)=>Math.abs(o.x+DX[a]-target[0])+Math.abs(o.y+DY[a]-target[1])-Math.abs(o.x+DX[b]-target[0])-Math.abs(o.y+DY[b]-target[1]));
  for(const d of directions){const x=o.x+DX[d],y=o.y+DY[d];if(x<2||y<2||x>=m.W-2||y>=m.H-2||Math.abs(x-o.homeX)+Math.abs(y-o.homeY)>2||!([T.GRASS,T.FLOWER,T.PATH].includes(m.t[y*m.W+x]))||m.warps[expKey(x,y)]||expAt(m,x,y)||objAt(x,y)||x===p.x&&y===p.y||p.moving&&x===p.x+DX[p.dir]&&y===p.y+DY[p.dir])continue;
   if(m.t[y*m.W+x]===T.PATH&&Math.abs(x-o.homeX)+Math.abs(y-o.homeY)>1)continue;o.dir=d;o.npcMove={x,y,t:0};break;}
 }}
async function expansionCivDialogue(o){if(!o.pid||G.map.indoor)return;const v=expansionState(),key='talk:'+o.pid+':'+dayPhase();if(v.quests[key])return;
 const phase=dayPhase(),lines=['今日は 広場を 散歩しているよ。','朝の 空気は 気持ちいいね。','夕方になったら 家へ 帰るつもり。','夜は 星を 観察しているんだ。'];if(hashStr('life:'+o.pid)%4!==0)return;v.quests[key]=1;await msg(lines[phase]);}
const EXP_CHAPTERS=[['芽吹きの約束',7,'旅は 自分の 足で 道を 見つけることから 始まる。各地の 仕掛けを 解き、相棒との 絆を 深めてね。'],['潮風の観測',75,'潮の 変化を たしかめて。入江には 海底へ つながる 深い 水面が ある。'],['炉峰の記憶',9,'山の 段差や 瀑布には 別の 道が ある。道具と バッジを たよりに 進もう。'],['星霜の灯',69,'静環団が 止めたかったものは 変化そのもの。けれど 変わるからこそ 未来は 生まれる。'],['環都への誓い',1,'五つの 圏で 得た 記録を つなごう。きみの 旅の 答えを リーグで 見せておくれ。']];
function expansionChapterReady(m){if(!S.flags.dex||m.indoor||m.advArea||!m.cell||m.cell.kind!=='town'||!m.cell.gym)return false;const k=m.cell.gym;return k%10===1&&!S.flags['chapter:'+Math.ceil(k/10)];}
async function expansionChapter(m){const i=Math.ceil(m.cell.gym/10)-1,k='chapter:'+(i+1);if(S.flags[k])return;S.flags[k]=1;const a=EXP_CHAPTERS[i];let alpha=0;const bg=pushBG(()=>{ctx.fillStyle='rgba(15,24,38,'+alpha*.87+')';ctx.fillRect(0,0,LW,LH);if(alpha>.3){tx('第 '+(i+1)+' 章',120,55,'#dfc680',12,'center');tx(a[0],120,79,'#fff5d8',18,'center');}});await tween(400,p=>alpha=p);await sleep(650);await tween(250,p=>alpha=1-p);popW(bg);await sayAs(a[1],a[2]);autoSave();}
// Render new interactive terrain with dedicated vector motifs and height lighting.
function expIcon(g,k,x,y,s=16,color='#f5dc92'){g.save();g.translate(x,y);g.scale(s/16,s/16);g.lineWidth=1;g.lineJoin='round';g.strokeStyle='#243b43';g.fillStyle=color;
 if(k==='berry'){g.fillRect(2,9,12,5);g.fillStyle='#60aa68';g.beginPath();g.ellipse(8,6,5,3,0,0,6.3);g.fill();}
 else if(k==='dive'||k==='surface'){g.strokeStyle='#d7f7ff';for(let i=0;i<3;i++){g.beginPath();g.ellipse(8,8,3+i*2.1,1.5+i*1.4,0,0,6.3);g.stroke();}}
 else if(k==='portal'){g.beginPath();g.moveTo(8,0);g.lineTo(15,7);g.lineTo(8,15);g.lineTo(1,7);g.closePath();g.fill();g.stroke();g.fillStyle='#27484e';g.fillRect(6,4,4,7);}
 else if(k==='gymhint'||k==='sign'){g.fillRect(3,2,10,9);g.strokeRect(3,2,10,9);g.fillStyle='#38535a';g.fillRect(7,11,2,4);g.fillRect(5,5,6,1);g.fillRect(5,7,6,1);}
 else if(k==='baseSite'){g.beginPath();g.moveTo(1,14);g.lineTo(2,6);g.quadraticCurveTo(8,-2,14,6);g.lineTo(15,14);g.closePath();g.fillStyle='#947a62';g.fill();g.stroke();g.fillStyle='#344341';g.beginPath();g.arc(8,12,4,Math.PI,2*Math.PI);g.fill();}
 else{g.fillRect(2,2,12,12);g.strokeRect(2,2,12,12);g.fillStyle='#27434a';g.beginPath();g.arc(8,8,3,0,6.3);g.fill();}
 g.restore();}
function drawExpansionTerrain(g,m,camx,camy){
 if(!m.adv&&!m.elevation)return;const x0=Math.max(0,Math.floor(camx/16)),y0=Math.max(0,Math.floor(camy/16)),x1=Math.min(m.W-1,x0+17),y1=Math.min(m.H-1,y0+15),t=G.t;
 for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const a=expAt(m,x,y),z=expHeight(m,x,y),px=x*16-camx,py=y*16-camy;
 if(z){g.fillStyle='rgba(239,229,175,'+(z*.045)+')';g.fillRect(px,py,16,16);}
 if(!a){if(m.advArea&&!m.indoor&&m.t[y*m.W+x]===T.GRASS&&h2(x,y,19)<.13){g.fillStyle='rgba(213,223,151,.7)';g.fillRect(px+3,py+11,1,2);g.fillRect(px+5,py+9,1,3);g.fillRect(px+8,py+12,1,1);}continue;}const k=a.kind;
 if(k==='cliff'){g.fillStyle='#80654e';g.fillRect(px,py+2,16,13);g.fillStyle='#bba17a';g.fillRect(px,py,16,4);g.fillStyle='#514e48';g.fillRect(px,py+13,16,3);g.strokeStyle='#a08263';g.beginPath();g.moveTo(px+4,py+5);g.lineTo(px+2,py+12);g.moveTo(px+12,py+6);g.lineTo(px+14,py+14);g.stroke();}
 else if(k==='stairs'||k==='ledge'){g.fillStyle=k==='stairs'?'#b59b77':'#c7b18f';g.fillRect(px,py,16,16);g.fillStyle='#795e48';if(k==='stairs'){for(let i=3;i<16;i+=4)g.fillRect(px,py+i,16,1);}else{g.fillRect(px,py+9,16,4);g.fillStyle='#f2e7cb';g.fillRect(px,py+8,16,1);g.beginPath();g.moveTo(px+5,py+3);g.lineTo(px+11,py+3);g.lineTo(px+8,py+7);g.fill();}}
 else if(k==='bridge'){g.fillStyle='#4a352c';g.fillRect(px,py+1,16,14);g.fillStyle='#bd8858';g.fillRect(px,py+2,16,12);g.fillStyle='#7d533a';for(let i=3;i<16;i+=5)g.fillRect(px+i,py+2,1,12);g.fillStyle='#e0b278';g.fillRect(px,py+1,16,2);g.fillRect(px,py+13,16,2);g.fillStyle='#624d3b';g.fillRect(px+1,py,2,4);g.fillRect(px+13,py+12,2,4);}
 else if(k==='fall'){g.fillStyle='#498eac';g.fillRect(px,py,16,16);g.strokeStyle='#c8f4f3';g.lineWidth=.8;g.beginPath();for(let i=2;i<16;i+=4){const d=(t*1.8+i*7)%16;g.moveTo(px+i,py+d-8);g.lineTo(px+i-1,py+d+7);}g.stroke();g.fillStyle='rgba(239,255,255,.72)';for(let i=0;i<4;i++)g.fillRect(px+(i*7+t/3)%16,py+13,3,2);}
 else if(k==='dive'||k==='surface'){g.fillStyle=k==='dive'?'#246d86':'#72cad4';g.fillRect(px,py,16,16);expIcon(g,k,px,py,16);}
 else if(k==='coral'){g.strokeStyle=['#dc8c89','#8dbac4','#b0a6d7'][a.tone];g.lineWidth=1.5;g.beginPath();g.moveTo(px+8,py+15);g.lineTo(px+8,py+5);g.moveTo(px+8,py+10);g.lineTo(px+3,py+5);g.moveTo(px+8,py+8);g.lineTo(px+13,py+3);g.stroke();}
 else if(k==='gymgate'){if(!gymPuzzleSolved(m)){g.fillStyle='#514f65';g.fillRect(px,py,16,16);g.strokeStyle='#e9cb84';g.strokeRect(px+1,py+1,14,14);for(let i=3;i<16;i+=4)g.fillRect(px+i,py+2,1,12);}else{g.fillStyle='#72ac92';g.fillRect(px,py+12,16,3);}}
 else if(k==='gymplate'){const s=m.gymPuzzle,q=gymPuzzleState(m),i=a.i;let c='#b9c5c1',label=EXP_SIGNS[i];if(s.mode===1||s.mode===2||s.mode===4){c=q.mask&(1<<i)?'#f0c36a':'#75858a';if(s.mode===4)label=String(s.weights[i]);}else if(s.mode===3){if(q.open===i||q.matched.includes(i))c=['#5fa8d0','#d96e6a','#e7bd64'][s.target[i]];}else if(s.mode===5)c=['#5fa8d0','#d96e6a','#e7bd64'][q.values[i]];else if(s.mode===9)label=['↑','→','↓','←'][q.values[i]];else if(s.mode===7){const qn=s.questions[Math.min(q.progress,2)];label=TK[qn.options[i]];}
  if(q.done)c='#69b68c';g.fillStyle='#34474d';g.fillRect(px+1,py+1,14,14);g.fillStyle=c;g.fillRect(px+2,py+2,12,12);g.fillStyle='#23393f';g.font='bold 9px '+FONT;g.textAlign='center';g.textBaseline='middle';g.fillText(label,px+8,py+8);}
 else if(k==='berry'){const q=expansionState().plots[m.id+':'+expKey(x,y)],stage=fruitStage(q,S.steps);g.fillStyle='#7b5a43';g.fillRect(px+1,py+2,14,12);g.fillStyle='#bc946e';g.fillRect(px+2,py+3,12,10);if(stage){g.fillStyle='#4b8e57';g.fillRect(px+7,py+4,2,9);g.beginPath();g.ellipse(px+5,py+6,3,2,-.5,0,6.3);g.ellipse(px+10,py+6,3,2,.5,0,6.3);g.fill();if(stage===3){g.fillStyle=EXP_FRUITS[q.type].color;for(let i=0;i<3;i++){g.beginPath();g.arc(px+4+i*4,py+5+(i%2)*3,2.3,0,6.3);g.fill();}}}}
 else if(k==='furniture'){const i=expansionState().decor[a.slot]||0;if(i){g.fillStyle=['','#ad7953','#5eaa75','#e7b95e','#a49be8','#79b2ce','#a75678','#e5bd71'][i];g.fillRect(px+1,py+2,14,12);g.strokeStyle='#39434d';g.strokeRect(px+1,py+2,14,12);g.fillStyle='#fff4d8';g.fillRect(px+4,py+4,8,3);}else expIcon(g,'empty',px,py,16,'#c2c6ba');}
 else if(k==='exit'){g.fillStyle='#d8bc83';g.fillRect(px+1,py+3,14,10);g.fillStyle='#5d5757';g.beginPath();g.moveTo(px+4,py+6);g.lineTo(px+12,py+6);g.lineTo(px+8,py+11);g.fill();}
 else{expIcon(g,k,px,py,16,k==='facility'||k==='trialPortal'?'#91c4d7':k==='contest'?'#e9a2bc':k==='gymreset'?'#a8b7bc':'#f2d38a');}
 const atlasIndex={cliff:0,stairs:1,ledge:2,bridge:3,fall:4,dive:5,baseSite:7}[k];if(atlasIndex!==undefined&&k!=='fall')drawCell(g,'obj/expansion-terrain.svg',8,64,64,atlasIndex,px,py,16,16);
 }}
function drawExpansionAtmosphere(g,m){if(m.advArea==='undersea'){g.fillStyle='rgba(24,101,139,.24)';g.fillRect(0,0,LW,LH);if(!reducedFx()){g.strokeStyle='rgba(180,246,250,.4)';g.lineWidth=.6;for(let i=0;i<13;i++){const x=(i*47+Math.sin(G.t/30+i)*7+LW)%LW,y=LH-((G.t*.5+i*29)%LH);g.beginPath();g.arc(x,y,1+(i%3)*.5,0,6.3);g.stroke();}}}}
function drawExpansionHUD(m){if(UI.length)return;if(m.gymPuzzle){const s=m.gymPuzzle,st=gymPuzzleState(m);ctx.fillStyle='rgba(27,42,53,.84)';ctx.fillRect(2,2,236,17);tx(EXP_GYM_MODES[s.mode]+(gymPuzzleSolved(m)?'　解除済':s.mode===8&&st.start>=0?'　あと '+Math.max(0,45-(S.steps-st.start))+'歩':''),8,5,'#f7e4aa',9);}
 else if(m.advArea&&['ridge','river','coast','undersea'].includes(m.advArea)){const z=expHeight(m,G.pl.x,G.pl.y);ctx.fillStyle='rgba(27,42,53,.75)';ctx.fillRect(4,2,67,14);tx(m.advArea==='undersea'?'海底 探索':'高度 '+z+'段',9,4,'#f3ebcc',8);}}
function drawExpansionPlayer(g,p,x,y){const q=p.moving?p.prog/16:0,frame=p.moving?10+((((p.stepN||0)&1)*2+(p.prog>=8?1:0)+1)&3):10;const running=p.moving&&p.spd>=4&&!reducedFx();g.save();g.translate(x+8,y+19);if(!reducedFx()){const bob=p.moving?-Math.abs(Math.sin(q*Math.PI))*(running?2:0.9):Math.sin(G.t/22)*.18;g.translate(0,bob);if(running)g.transform(1,0,(p.dir===1?-.055:p.dir===3?.055:0),1.02,0,0);}drawChar(g,'pl',p.dir,frame,-8,-19);g.restore();}
function drawExpansionNPC(g,o,x,y){const walk=!!o.npcMove||!!(o.ox||o.oy);g.save();g.translate(x+8,y+19);if(walk&&!reducedFx()){const f=o.npcMove?o.npcMove.t/(o.npcMove.duration||12):G.t/12;g.translate(0,-Math.abs(Math.sin(f*Math.PI))*1.15);g.scale(1+Math.sin(f*Math.PI*2)*.015,1-Math.sin(f*Math.PI*2)*.025);}drawChar(g,o.spr,o.dir,walk?walkFr(G.t>>3):0,-8,-19);g.restore();}
