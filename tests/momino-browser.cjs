'use strict';
const {chromium,webkit,devices}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),{serve,report}=require('./qa-server.cjs');
(async()=>{const server=await serve(),results=[];let browser;try{
 for(const [engine,api] of [['chromium',chromium],['webkit',webkit]]){
  browser=await api.launch({headless:true});const page=await browser.newPage(engine==='webkit'?{...devices['iPhone 13'],viewport:{width:390,height:844}}:{viewport:{width:960,height:720}});const errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.goto(server.url);await page.waitForFunction(()=>typeof momiCafeBattle==='function'&&UI.length>0);
  const result=await page.evaluate(async()=>{
   const ck=(v,m)=>{if(!v)throw Error(m);},eq=(a,b,m)=>ck(JSON.stringify(a)===JSON.stringify(b),m+' '+JSON.stringify(a));
   const c=CELLS[MOMI_KEY],m=getMap(MOMI_KEY),gym=getMap(MOMI_GYM),cafe=getMap(MOMI_CAFE);
   ck(c.gym===1&&WORLD.gymTown.length===51&&CELLS['0,2'].gym===0,'gym topology');ck(neighborCell(c,3).key==='1,0'&&neighborCell(c,2).key==='2,1','road links');
   const reach=(m,start,minY=0)=>{const q=[start],v=new Set([start.join(',')]);for(let j=0;j<q.length;j++){const [x,y]=q[j];for(let d=0;d<4;d++){const nx=x+DX[d],ny=y+DY[d],k=nx+','+ny;if(nx<0||ny<minY||nx>=m.W||ny>=m.H||v.has(k)||SOLID[m.t[ny*m.W+nx]]||m.objs.some(o=>!o.momiActor&&o.x===nx&&o.y===ny))continue;v.add(k);q.push([nx,ny]);}}return v;};
   const seen=reach(m,[0,15]);ck(seen.has('15,31')&&seen.has('16,31'),'no mandatory gym');for(const b of m.blds){const k=b.cx+','+b.doorY;ck(seen.has(k)&&m.t[b.doorY*32+b.cx]===T.DOOR,'door '+b.label);const r=getMap(m.warps[k].map);ck(r.momi&&Object.values(r.warps)[0].map===MOMI_KEY,'room exit');ck(!SOLID[r.t[m.warps[k].y*r.W+m.warps[k].x]],'room entry');}
   ck(m.blds.length===9&&m.enc===null,'9 buildings peaceful');ck(Object.values(m.adv).filter(v=>v.kind==='portal').length===3,'old portals');
   const gReach=reach(gym,[6,15],5);for(const [k,a] of Object.entries(gym.adv))if(['gymplate','gymhint','gymreset'].includes(a.kind))ck(gReach.has(k),'gym reachable '+k);
   eq(gymTeam(1),[{sp:516,lv:10},{sp:717,lv:10},{sp:546,lv:11}],'approved gym roster');ck(gym.momiGym&&gym.gymPuzzle.target===5&&gym.gymPuzzle.mode===1,'4 lamps');
   S=newSave('モミノキQA');Object.assign(S,homeSpot());S.starter=2;S.flags.dex=1;S.party=[makeMon(19,65,{iv:31}),makeMon(11,30,{iv:31})];S.opts.snd=0;S.opts.music=0;S.opts.share=0;startFromSave();G.busy=true;UI.length=0;G.fade=0;
   // Validate all new artwork actually decodes. All NPC and sprite atlases are unique files.
   const art=['clinic','shop','gym','wood','train','cafe','bike','house','ground','pines','props','badge','battle-dojo','battle-training','battle-cafe'].map(s=>'obj/momino/'+s+'.svg');
   for(const p of MOMI_PEOPLE)art.push('obj/momino/people/p'+p.id+'.svg','obj/momino/people/walk'+p.id+'.svg');
   for(let j=0;j<8;j++)art.push('obj/momino/people/face-'+j+'.svg');for(let j=0;j<12;j++)art.push('obj/momino/people/leader-'+j+'.svg');
   for(const path of art){const im=new Image();im.src=path;await im.decode();ck(im.naturalWidth>0,'asset '+path);}
   // Stable day schedule and no actor collision in any authored room.
   for(const hour of [2,7,12,18,22]){G.hour=hour;for(let slot=-1;slot<=8;slot++){const r=getMap(momiMap(slot));loadMap(r.id,slot<0?15:Math.floor(r.W/2),slot<0?19:r.H-2,0);const xy=G.objs.map(o=>o.x+','+o.y);ck(new Set(xy).size===xy.length,'overlap '+slot+' '+hour);if(slot===2)ck(G.objs.some(o=>o.role==='leader'&&o.pid===11),'leader always available');if(slot===5)ck(G.objs.some(o=>o.role==='momicafeguest'),'cafe guest');}}
   const msgs=[];msg=async t=>{msgs.push(t);};sleep=async()=>{};tween=async(ms,f)=>{f(1);};fadeTo=async v=>{G.fade=v;};moveFx=async()=>{};hitAnim=async()=>{};faintAnim=async()=>{};menu=async items=>Math.max(0,items.findIndex(x=>!x.dis));confirmYN=async()=>true;
   loadMap(MOMI_GYM,6,15,0);ck(!expansionPass(gym,6,5,6,4,G.pl),'closed gate');await operateGym(gym,1);await operateGym(gym,0);ck(!gymPuzzleSolved(gym),'wrong pattern remains locked');await operateGym(gym,1);await operateGym(gym,2);ck(gymPuzzleSolved(gym)&&expansionPass(gym,6,5,6,4,G.pl),'correct root branch');
   const tm='tm'+moveId('せんこうづき');ck(!!ITEMS[tm],'actual reward TM exists');
   // Actual cafe combat with presentation and player selection automated, not a simulated result.
   S.party[0].mv=[{id:moveId('ぐれんばくえん'),pp:20},{id:moveId('しゃくねつとつげき'),pp:20}];
   chooseAction=async B=>({t:'move',i:combatOptions(bmon(B,0)).sort((x,y)=>combatEstimate(bmon(B,0),bmon(B,1),y.m,B.ps,B.fs,B.weather)-combatEstimate(bmon(B,0),bmon(B,1),x.m,B.ps,B.fs,B.weather))[0].i});
   // Begin on a deterministic date. Opponent can be looked up without consuming an attempt.
   let day=MomiCafe.day(Date.UTC(2026,10,28,14,59));momiCafeDay=()=>day;
   loadMap(MOMI_CAFE,5,8,0);ck(momiCafeInfo().available,'first available');let money=S.money,exp=S.party[0].exp;
   confirmYN=async()=>false;await momiCafeBattle();ck(momiCafeInfo().record.attempts===0&&momiCafeInfo().available,'cancel does not spend');
   confirmYN=async()=>true;await momiCafeBattle();ck(momiCafeInfo().record.attempts===1&&momiCafeInfo().record.result==='win'&&S.money>money&&S.party[0].exp>exp,'real cafe victory prize experience');
   ck(!momiCafeInfo().available&&loadSave().upgrade.momino.cafe.lastDay===day,'persist attempt');money=S.money;await momiCafeBattle();ck(S.money===money,'same day blocked');
   S=loadSave();startFromSave();G.busy=true;ck(!momiCafeInfo().available,'reload blocks');const oldGuest=momiCafeInfo().guest.pid;day++;ck(momiCafeInfo().available&&momiCafeInfo().guest.pid!==oldGuest,'new day new guest');
   // Verify defeated and interrupted matches also consume the daily attempt. Use stubs only for these result branches.
   const realBattle=battle;let calls=0;battle=async()=>{calls++;S.party.forEach(m=>m.hp=0);return'lose';};await momiCafeBattle();ck(calls===1&&!momiCafeInfo().available&&momiCafeInfo().record.result==='lose'&&S.party.every(m=>m.hp>0),'loss consumes, no blackout');await momiCafeBattle();ck(calls===1,'loss cannot retry');
   day++;const expected=day;battle=async()=>{ck(loadSave().upgrade.momino.cafe.lastDay===expected&&loadSave().upgrade.momino.cafe.result==='started','attempt saved before combat');return'run';};await momiCafeBattle();ck(momiCafeInfo().record.result==='aborted'&&!momiCafeInfo().available,'aborted attempt consumed');day--;ck(!momiCafeInfo().available,'clock rewind rejected');day+=2;
   const origSave=saveGame;saveGame=()=>false;battle=async()=>{throw Error('must not start without save');};await momiCafeBattle();saveGame=origSave;ck(momiCafeInfo().available,'storage failure no spend');
   // Day boundary during confirmation never spends either day.
   confirmYN=async()=>{day++;return true;};await momiCafeBattle();ck(momiCafeInfo().available,'midnight during confirm');confirmYN=async()=>true;battle=realBattle;
   // First gym: actual battle, reward, bike and tool milestones.
   loadMap(MOMI_GYM,6,15,0);S.party.forEach(healMon);const leader=G.objs.find(o=>o.role==='leader');await gymBattle(leader);ck(S.badges[1]&&S.bag.k_bike&&S.bag.k_cut&&S.bag[tm],'actual first gym rewards');
   ck(momiGymParty().length===3&&momiGymParty()[2].mv.some(v=>MOVES[v.id].name==='きりさきづめ'),'fixed moves');
   // Side quest state and one-time rewards, actual event handlers.
   G.hour=12;loadMap(momiMap(3),5,8,0);const wood=G.objs.find(o=>o.momiActor==='wood');await momiTalk(wood);loadMap(MOMI_KEY,15,19,0);for(let j=0;j<3;j++)await momiSiteTalk({kind:'wood',i:j});money=S.money;loadMap(momiMap(3),5,8,0);await momiTalk(G.objs.find(o=>o.momiActor==='wood'));await momiTalk(G.objs.find(o=>o.momiActor==='wood'));ck(S.money===money+800&&momiState().woodDone,'wood reward once');
   loadMap(MOMI_KEY,15,19,0);const child=G.objs.find(o=>o.momiActor==='child'),heal=S.bag.heal1||0;await momiTalk(child);await momiTalk(child);ck(S.bag.heal1===heal+3,'fist reward once');
   const q=momiState();q.bikeStarted=true;q.bikeMarks=[];S.bikeOn=1;G.pl.surf=false;G.pl.fly=false;for(const [x,y] of MOMI_BIKE)momiBikeStep(G.map,{x,y});ck(q.bikeDone&&S.own[452],'bike course');
   S.bikeOn=0;G.busy=true;BT=null;G.scene='world';UI.length=0;G.hour=12;loadMap(MOMI_KEY,15,19,0);G.banner=null;render();
   return{buildings:m.blds.length,art:art.length,gyms:50,roster:3,dailyWin:true,dailyLoss:true,midnight:true,reload:true,saveFailure:true,quests:true,realGym:true};
  });
  fs.mkdirSync('test-results/momino',{recursive:true});for(const [label,slot,x,y,hour] of [['plaza',-1,15,19,12],['gym',2,6,13,12],['cafe',5,5,8,12],['workshop',3,5,8,12],['night',-1,15,19,22]]){await page.evaluate(({slot,x,y,hour})=>{G.hour=hour;loadMap(momiMap(slot),x,y,0);G.banner=null;render();},{slot,x,y,hour});await page.locator('canvas').first().screenshot({path:'test-results/momino/'+engine+'-'+label+'.png'});}
  assert.deepEqual(errors,[]);assert.equal(result.dailyWin,true);assert.equal(result.realGym,true);results.push({engine,...result});await browser.close();browser=null;
 }report('momino',results);
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
