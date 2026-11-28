'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),{serve,report}=require('./qa-server.cjs');
(async()=>{const server=await serve();let browser;try{
 browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:390,height:844}});const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error'&&/Error:|TypeError|ReferenceError/.test(m.text()))console.error(m.text())});
 await page.goto(server.url);await page.waitForFunction(()=>typeof SORANE_FIELD_DATA!=='undefined'&&typeof mobilePerformanceSnapshot==='function'&&UI.length>0);
 const data=await page.evaluate(()=>{
  const ck=(x,m)=>{if(!x)throw Error(m);};S=newSave('世界QA');Object.assign(S,homeSpot());S.party=[makeMon(2,100),makeMon(1,100),makeMon(6,100),makeMon(4,100)];S.starter=2;S.flags.dex=1;S.flags.champ=1;for(let i=1;i<=50;i++)S.badges[i]=1;S.opts.snd=0;S.opts.music=0;startFromSave();G.busy=true;
  ck(SORANE_MOTION_DATA.length===1212&&SORANE_MOTION_CLIPS.length===9,'motion counts');
  const keys=new Set();let motionSamples=0;for(const p of SORANE_MOTION_DATA){ck(p[0]>=1&&SP[p[0]].name===p[1]&&p[11].length===9&&p[10].length===9,'motion species '+p[0]);keys.add(JSON.stringify([p[10],p[11]]));for(const clip of SORANE_MOTION_CLIPS)for(let frame=0;frame<=4;frame++){const s=motionSample(p[0],clip,p[10][motionClipIndex(clip)]*frame/4);ck([s.dx,s.dy,s.sx,s.sy,s.lean,s.warp].every(Number.isFinite)&&s.sx>0&&s.sy>0,'motion finite');motionSamples++;}}
  ck(keys.size===1212,'individual curves');ck(SORANE_NPC_DATA.length===2000,'NPC count');const schedules=new Set();let events=0;for(const p of SORANE_NPC_DATA){ck(person(p[0]).name===p[1]&&p[3]>=1&&p[3]<=50,'NPC identity');schedules.add(JSON.stringify([p[5],p[6],p[7],p[8]]));ck(p[8][0][0]===0&&p[8].every((a,i)=>a[0]>=0&&a[0]<1440&&a[1]>=0&&a[1]<4&&(i===0||a[0]>p[8][i-1][0])),'schedule order');for(const t of [0,300,600,900,1200,1439])ck(npcScheduleAt(p[0],t).activity,'schedule lookup');events+=p[8].length;}
  ck(schedules.size===2000,'unique daily schedules');ck(SORANE_FIELD_DATA.length>=870,'map count');const maps=new Set(),roster=new Set();let linked=0,life=0,carved=0,landmarks=0,linkedId=null;
  for(const d of SORANE_FIELD_DATA){const m=getMap(d[0]);ck(m.id===d[0]&&m.individualDesign===d&&m.t.length===m.W*m.H,'map '+d[0]);maps.add(m.id);if(d[7].length)carved++;if(Object.values(m.adv||{}).some(a=>a.kind==='landmark'))landmarks++;
   for(const w of Object.values(m.warps)){ck(typeof w.map==='string'&&Number.isInteger(w.x)&&Number.isInteger(w.y),'warp '+m.id);}
   if(m.cell&&m.cell.kind==='town'&&!m.indoor&&!m.advArea)ck(Object.values(m.adv||{}).some(a=>a.kind==='portal'&&a.area==='life'),'life portal '+m.id);
   if(m.linkedSite){linked++;linkedId=linkedId||m.id;}
   if(m.advArea==='life'){life++;if(m.cell.gym){for(const o of m.objs)if(o.role==='resident')roster.add(o.pid);ck(m.objs.filter(o=>o.role==='resident').length<=49,'life capacity');}}
  }
  ck(maps.size===SORANE_FIELD_DATA.length&&life===53,'map coverage');ck(roster.size===2000,'all resident roster '+roster.size);ck(linked>0,'linked trainer placement');
  const c=WORLD.gymTown[1],id=expId('life',c);G.hour=2;loadMap(id,15,29,0);ck(G.objs.every(o=>o.pid!==plPid()),'player excluded');const old=G.objs.map(o=>[o.pid,o.x,o.y]);G.hour=13;loadMap(id,15,29,0);const newPos=G.objs.map(o=>[o.pid,o.x,o.y]);ck(JSON.stringify(old)!==JSON.stringify(newPos),'NPC schedule changes actual positions');ck(new Set(G.objs.map(o=>o.x+','+o.y)).size===G.objs.length,'resident overlaps');drawWorldPix();drawWorldUI();
  return{species:keys.size,clips:1212*9,motionSamples,npcs:schedules.size,scheduleEvents:events,maps:maps.size,life,roster:roster.size,carved,landmarks,linked,linkedId};
 });
 assert.equal(data.species,1212);assert.equal(data.npcs,2000);assert.ok(data.maps>=870);
 // Every original species image must exist and decode. Draw all 9 clips at their midpoint.
 for(let i=1;i<=1212;i++)assert.ok(fs.existsSync('mon/'+String(i).padStart(4,'0')+'.webp'),'missing '+i);
 const art=await page.evaluate(async()=>{
  const g=document.createElement('canvas').getContext('2d');g.canvas.width=g.canvas.height=72;let rendered=0,clips=0;const errors=[];
  for(let base=1;base<=1212;base+=16){
   const ids=Array.from({length:Math.min(16,1213-base)},(_,i)=>base+i);
   await Promise.all(ids.map(async id=>{const p=monPic(id);try{if(p.st!==1)await p.img.decode();}catch(e){errors.push(id);}}));
   for(const id of ids){const p=monPic(id);if(!p.img.naturalWidth){errors.push(id);continue;}if(p.st===0)p.st=1;const art=monCanvas(id,false,false);if(art.width<32){errors.push(id);continue;}const m={sp:id,shiny:false,st:null};for(const name of SORANE_MOTION_CLIPS){const before=G.t;startIndividualMotion(m,name);G.t+=Math.floor(motionProfile(id)[10][motionClipIndex(name)]/2);g.clearRect(0,0,72,72);drawIndividualMotion(g,m,art,4,4,64,1,0,0,false,null);G.t=before;clips++;}rendered++;}
  }return{rendered,clips,errors,cache:MON_PIC.size};
 });assert.equal(art.rendered,1212);assert.equal(art.clips,10908);assert.deepEqual(art.errors,[]);
 // Actual move and capture resolver, without animation delays or manual input.
 const battleChecks=await page.evaluate(async linkedId=>{
  const ck=(x,m)=>{if(!x)throw Error(m);};msg=async()=>{};sleep=async()=>{};tween=async(ms,f)=>{f(1);};fadeTo=async v=>{G.fade=v;};moveFx=async()=>{};hitAnim=async()=>{};faintAnim=async()=>{};
  menu=async items=>Math.max(0,items.findIndex(x=>!x.dis));confirmYN=async()=>true;S.opts.share=0;
  const moves=m=>{m.mv=[{id:MOVES.find(v=>v.name==='だいとつげき').id,pp:15},{id:MOVES.find(v=>v.name==='おおなみ').id,pp:15}];return m;};
  S.party=[2,1,6,4].map(id=>moves(makeMon(id,100,{iv:31})));
  const first=makeMon(3,5),second=makeMon(1,5);S.bag.fuda9=2;const before=S.party.length;
  doublePlayerAction=async(D,s,res,items)=>{if(D.wild){const target=doubleActive(D,1)[s.pos]||doubleActive(D,1)[0];return{kind:'capture',slot:s,id:'fuda9',target:target.pos,targetId:target.i};}const t=doubleActive(D,1)[0];return{kind:'move',slot:s,i:0,mode:'enemy',target:t.pos};};
  const r=await battle({wild:first,wilds:[first,second]});ck(r==='caught'&&S.party.length===before+2&&!S.bag.fuda9,'wild double full capture');
  ck(S.caught[first.sp]&&S.caught[second.sp],'captured dex');ck(HitokariUpgrade.progress(S).captures>=2,'capture counts');
  const D=doubleState({wilds:[makeMon(4,2),makeMon(3,2)]});await doubleExecute(D,{kind:'run',slot:D.slots[0][0]});ck(D.result==='run','wild escape');
  const m=getMap(linkedId);loadMap(m.id,m.linkedSite.x,m.linkedSite.y,0);const pair=trainerSightHits().filter(o=>o.linked===m.linkedSite.key);ck(pair.length===2,'simultaneous sight');
  S.party.forEach(healMon);const real=await pairedTrainerEncounter(pair);ck(pair.every(o=>o.beaten&&S.flags['t:'+m.id+':'+o.tid]),'both victory flags');
  const a=[makeMon(2,5),makeMon(1,5),makeMon(6,5),makeMon(4,5)],d=doubleState({multi:[{},{}],ownerByIndex:[0,0,1,1],trainer:{team:a}});
  ck(d.slots[1][0].i===0&&d.slots[1][1].i===2,'independent opening');ck(doubleReserve(d,1,[],0).map(v=>v.i).join(',')==='1','owner 0 bench');ck(doubleReserve(d,1,[],1).map(v=>v.i).join(',')==='3','owner 1 bench');
  return{wildCapture:r,escape:true,simultaneous:pair.length,independentBench:true};
 },data.linkedId);
 assert.deepEqual(errors,[]);report('individual-world',{...data,art,battleChecks});
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});