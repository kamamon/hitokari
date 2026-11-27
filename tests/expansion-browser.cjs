'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const base=process.cwd(),mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/+/,'')||'index.html';const file=path.resolve(base,name);if(!file.startsWith(base+path.sep)){res.writeHead(403);res.end();return;}fs.readFile(file,(e,data)=>{if(e){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(data);});});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;try{
 browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:390,height:844}});const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForFunction(()=>typeof G!=='undefined'&&UI.length>0&&typeof doubleState==='function');
 const result=await page.evaluate(async()=>{
  const check=(v,m)=>{if(!v)throw Error(m);};
  S=newSave('テスト');Object.assign(S,homeSpot());S.party=[makeMon(STARTERS[0],50),makeMon(STARTERS[1],50),makeMon(STARTERS[2],50),makeMon(STARTERS[3],50)];S.flags.dex=1;S.starter=1;for(let k=1;k<=10;k++)S.badges[k]=1;S.bag.k_surf=1;startFromSave();
  // All puzzle solutions are mechanically reachable and actual gym maps have a closed gate.
  const gymCells=Object.values(CELLS).filter(c=>c.kind==='town'&&c.gym);check(gymCells.length===50,'50 gyms');
  const modes=new Set(),signatures=new Set();
  for(const c of gymCells){const b=townBuildings(c).find(b=>b.kind==='gym'),m=getMap(c.key+':b'+b.slot),sp=m.gymPuzzle,st=freshGymState(sp);check(sp&&expAt(m,6,4).kind==='gymgate','gym gate');modes.add(sp.mode);signatures.add(sp.name);
   if([0,6,7,8].includes(sp.mode))sp.target.forEach((i,j)=>gymApply(sp,st,i,j*4));
   if(sp.mode===1)for(let i=0;i<4;i++)if(sp.target&(1<<i))gymApply(sp,st,i);
   if(sp.mode===2||sp.mode===4){const mask=Array.from({length:16},(_,i)=>i).find(mask=>{let v=0;for(let i=0;i<4;i++)if(mask&(1<<i))v=sp.mode===2?v^((1<<i)|(1<<((i+1)%4))):v+sp.weights[i];return v===sp.target;});check(mask!==undefined,'reachable toggle');for(let i=0;i<4;i++)if(mask&(1<<i))gymApply(sp,st,i);}
   if(sp.mode===3)for(let v=0;v<3;v++)sp.target.forEach((t,i)=>{if(t===v)gymApply(sp,st,i);});
   if(sp.mode===5||sp.mode===9)sp.target.forEach((v,i)=>{for(let j=0;j<v;j++)gymApply(sp,st,i);});
   check(st.done,'puzzle '+c.gym);check(m.W===13&&m.H===17,'gym dimensions');const queue=[[6,15]],visited=new Set(['6,15']);while(queue.length){const [x,y]=queue.shift();for(let d=0;d<4;d++){const nx=x+DX[d],ny=y+DY[d],key=nx+','+ny;if(nx<1||ny<5||nx>=m.W-1||ny>=m.H-1||visited.has(key)||SOLID[m.t[ny*m.W+nx]]||occupied(m,nx,ny))continue;visited.add(key);queue.push([nx,ny]);}}for(const [key,o] of Object.entries(m.adv))if(['gymplate','gymhint','gymreset'].includes(o.kind))check(visited.has(key),'reachable plate '+c.gym+' '+key);
   const gate=expAt(m,6,4);check(gate&&m.t[4*m.W+5]===T.IWALL,'gate barrier');
  }check(modes.size===10&&signatures.size===50,'puzzle variety');
  const cell=gymCells.find(c=>c.gym===1),town=getMap(cell.key);check(Object.values(town.adv).some(o=>o.kind==='portal'&&o.area==='ridge'),'town portal');
  const ridge=getMap(expId('ridge',cell)),river=getMap(expId('river',cell)),coast=getMap(expId('coast',cell)),sea=getMap(expId('undersea',cell)),hub=getMap(expId('hub',cell)),contest=getMap(expId('contest',cell)),secret=getMap(expId('base',cell));
  check(expHeight(ridge,4,4)===2&&expHeight(ridge,4,12)===0,'height');check(expansionPass(ridge,4,4,4,5,{surf:false}),'stairs');check(expansionPass(ridge,12,4,12,5,{surf:false})&&!expansionPass(ridge,12,5,12,4,{surf:false}),'one way ledge');
  check(expAt(river,8,16).kind==='bridge'&&river.t[16*river.W+8]===T.PATH,'bridge');check(expansionPass(river,9,8,9,7,{surf:true})&&!expansionPass(river,9,8,9,7,{surf:false}),'waterfall badge');check(expAt(coast,12,10).kind==='dive'&&expAt(sea,11,20).kind==='surface','dive surface');check(Object.values(hub.adv).filter(o=>['facility','trialPortal'].includes(o.kind)).length===5,'facility map');check(Object.values(contest.adv).filter(o=>o.kind==='contest').length===5,'contest map');check(Object.values(secret.adv).filter(o=>o.kind==='furniture').length===3,'base room');for(const mode of Object.keys(EXP_FACILITIES)){const trial=getMap(expId('trial-'+mode,cell));check(trial.advArea==='trial-'+mode&&expAt(trial,8,3).mode===mode,'dedicated trial');}check(ridge.advEnc.land.length===7&&river.advEnc.water.length===6&&sea.advEnc.water.length===6&&wildPick(ridge.advEnc,'land',0),'encounter pools');
  const farm={type:0,steps:100,time:1000,water:true};check(fruitStage(farm,100,1000)===1&&fruitStage(farm,280,1000)===3,'fruit growth');
  const g11=gymCells.find(c=>c.gym===11);const gb=townBuildings(g11).find(b=>b.kind==='gym');const gm=getMap(g11.key+':b'+gb.slot);check(!expansionPass(gm,6,5,6,4,{surf:false}),'closed gate');expansionState().gyms[11]={done:true};check(expansionPass(gm,6,5,6,4,{surf:false}),'open gate');
  // Rendering smoke of real maps, including new art/terrain; no direct stubs for draw.
  for(const m of [ridge,river,coast,sea,hub,contest,secret,gm]){loadMap(m.id,Math.floor(m.W/2),m.H-3,0);drawWorldPix();drawWorldUI();check(saveGame(),'custom map save '+m.id);}
  // Exercise the real move resolver with deterministic test presentation.
  msg=async()=>{};sleep=async()=>{};tween=async(ms,f)=>{f(1);};moveFx=async()=>{};hitAnim=async()=>{};faintAnim=async()=>{};
  const move=(name)=>MOVES.find(m=>m.name===name).id,learn=(mon,name)=>{const id=move(name);mon.mv=[{id,pp:20}];};
  const a=makeMon(STARTERS[2],65,{iv:31}),a2=makeMon(STARTERS[0],65,{iv:31}),f1=makeMon(STARTERS[0],40),f2=makeMon(STARTERS[0],40),f3=makeMon(STARTERS[1],40);
  learn(a,'おおなみ');learn(a2,'いやしのいき');learn(f1,'ぶつかる');learn(f2,'ぶつかる');learn(f3,'ぶつかる');S.party=[a,a2,makeMon(STARTERS[3],65)];const d=doubleState({facility:true,trainer:{name:'test',team:[f1,f2,f3],money:0}});BT=d;G.scene='battle';const start=[f1.hp,f2.hp];await doubleExecute(d,{kind:'move',slot:d.slots[0][0],i:0,mode:'spread'});check(a.mv[0].pp===19,'one PP for spread');check(f1.hp<start[0]&&f2.hp<start[1],'two spread targets');
  a.hp=Math.max(1,Math.floor(maxHP(a)/2));const before=a.hp;await doubleExecute(d,{kind:'move',slot:d.slots[0][1],i:0,mode:'support',target:0});check(a.hp>before&&a2.mv[0].pp===19,'ally healing');d.o.facility=false;S.bag.heal1=1;a.hp=Math.max(1,Math.floor(maxHP(a)/2));const hp=a.hp;await doubleExecute(d,{kind:'item',slot:d.slots[0][1],id:'heal1',targetIndex:0});check(a.hp>hp&&!S.bag.heal1,'double item');d.o.facility=true;
  f1.hp=0;await doubleFaints(d);check(d.slots[1][0].i===2,'faint refill');const old=d.slots[0][0];await doubleExecute(d,{kind:'switch',slot:old,i:2});check(d.slots[0][0].i===2&&doubleReserve(d,0).some(v=>v.i===0),'switch');drawDoublePix(d);drawDoubleUI(d);
  for(const s of d.slots[1].filter(Boolean))s.mon.hp=0;await doubleFaints(d);check(d.result==='win','double victory');
  BT=null;G.scene='world';G.fade=0;UI.length=0;loadMap(town.id,15,15,0);
  // Exercise single/double AI switch recommendation with a clear type disadvantage.
  const fire=makeMon(STARTERS[0],50,{iv:31}),water=makeMon(STARTERS[4],50,{iv:31}),grass=makeMon(STARTERS[1],50,{iv:31});learn(fire,'ひばな');learn(water,'おおなみ');learn(grass,'もりのやいば');fire.hp=Math.max(1,Math.floor(maxHP(fire)/4));const sw=switchRating({mon:fire,st:newStg()},[{mon:water,st:newStg()}],[{mon:grass,i:1}],null);check(sw===1,'AI tactical switch');
  return{gyms:gymCells.length,modes:modes.size,areas:11,spread:true,ally:true,items:true,refill:true,win:true,aiSwitch:true};
 });assert.equal(result.gyms,50);assert.equal(result.modes,10);assert.deepEqual(errors,[]);console.log('expansion checks:',result);
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
