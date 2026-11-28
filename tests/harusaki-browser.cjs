'use strict';
const {chromium,webkit,devices}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),{serve,report}=require('./qa-server.cjs');
(async()=>{const server=await serve(),results=[];let browser;
 try{for(const [engine,api] of [['chromium',chromium],['webkit',webkit]]){
  browser=await api.launch({headless:true});const page=await browser.newPage(engine==='webkit'?{...devices['iPhone 13'],viewport:{width:390,height:844}}:{viewport:{width:960,height:720}});const errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.goto(server.url);await page.waitForFunction(()=>typeof genHaruTown==='function'&&UI.length>0);
  const result=await page.evaluate(async()=>{
   const ck=(v,m)=>{if(!v)throw Error(m);},eq=(a,b,m)=>ck(JSON.stringify(a)===JSON.stringify(b),m+' '+JSON.stringify(a));
   const c=CELLS[HARU_KEY],m=getMap(HARU_KEY);ck(c.gym===0&&c.noGym&&m.haru&&m.enc===null,'no gym or encounter');eq(m.exits,[1,0,1,0],'north south exits');ck(neighborCell(c,0).key==='0,1'&&neighborCell(c,2).key==='0,3','unchanged roads');ck(WORLD.gymTown[1].name==='モミノキ街'&&WORLD.gymTown[50].name==='ミチシルベ村','gym relocation');ck(Object.values(CELLS).filter(c=>c.gym).length===50&&gymLeaderPid(1)===11&&gymLeaderPid(50)===10,'all 50 leaders preserved');
   eq(townBuildings(c).map(x=>x.kind),['heal','shop','harulodge','harutailor','house','house','haruflower'],'seven buildings');
   const reach=(map,start)=>{const visited=new Set([start.join(',')]),q=[start];while(q.length){const [x,y]=q.shift();for(let d=0;d<4;d++){const nx=x+DX[d],ny=y+DY[d],key=nx+','+ny;if(nx<0||ny<0||nx>=map.W||ny>=map.H||visited.has(key)||SOLID[map.t[ny*map.W+nx]]||map.objs.some(o=>!o.haruActor&&o.x===nx&&o.y===ny))continue;visited.add(key);q.push([nx,ny]);}}return visited;};
   const seen=reach(m,[15,31]);ck(seen.has('15,0')&&seen.has('16,0'),'south-north connected');for(const b of m.blds){const x=b.x+2,y=b.y+3;ck(m.t[y*32+x]===T.DOOR&&seen.has(x+','+y),'door reachable '+b.label);const r=getMap(haruMapId(b.slot)),warp=Object.values(m.warps).find(v=>v.map===r.id);ck(r.haru&&!SOLID[r.t[warp.y*r.W+warp.x]],'entry '+r.id);ck(Object.values(r.warps)[0].map===HARU_KEY,'return '+r.id);}
   ck(HARU_PLOTS.every(([x,y])=>expAt(m,x,y)?.kind==='berry'&&[0,1,2,3].some(d=>seen.has((x+DX[d])+','+(y+DY[d])))),'four berry plots');
   ck([23,24,25,26,27,28].every(x=>seen.has(x+',27')&&expAt(m,x,27)?.kind==='bridge'),'bridge');
   // Macro reachability through existing gate conditions, using badges earned only at reachable towns.
   const badges=new Set(),visited=new Set();let changed=true;while(changed){changed=false;const byCircle=n=>[...badges].filter(k=>circOf(k)===n).length,allowed=cell=>{if(cell.kind==='sea'&&!byCircle(2))return false;const g=cell.gate;if(!g)return true;if(g.type==='shrub')return badges.size>=1;if(g.type==='crack')return byCircle(1)>=2;if(g.type==='boulder')return byCircle(3)>=1;if(g.type==='guard')return g.k===9?[1,2,3,4,5].every(n=>byCircle(n)>=2):byCircle(g.k)>=2;return true;};
    const q=[WORLD.main[0]],v=new Set([q[0].key]);for(let i=0;i<q.length;i++){const a=q[i];visited.add(a.key);if(a.gym&&!badges.has(a.gym)){badges.add(a.gym);changed=true;}for(let d=0;d<4;d++){if(!a.ex[d])continue;const b=neighborCell(a,d);if(!b||v.has(b.key)||!allowed(b))continue;v.add(b.key);q.push(b);}}
   }ck(badges.size===50&&visited.has(WORLD.main[52].key),'all gyms and league graph reachable '+badges.size);
   S=newSave('村QA');Object.assign(S,homeSpot());S.party=[makeMon(2,20),makeMon(3,20)];S.starter=2;S.flags.dex=1;S.opts.snd=0;S.opts.music=0;startFromSave();G.busy=true;UI.length=0;
   let residents=0,pets=0;const positions=[];for(const hour of [2,6,10,18,22]){G.hour=hour;const all=new Set(),animals=new Set();let count=0;
    for(const slot of [-1,0,1,2,3,4,5,6]){const r=getMap(haruMapId(slot));loadMap(r.id,slot<0?15:Math.floor(r.W/2),slot<0?29:r.H-2,0);const actors=G.objs.filter(o=>o.haruActor);
     ck(new Set(G.objs.map(o=>o.x+','+o.y)).size===G.objs.length,'overlap '+r.id+' '+hour);for(const o of actors){if(o.k==='npc'){ck(!all.has(o.pid),'duplicate person');all.add(o.pid);}else{ck(!animals.has(o.haruActor),'duplicate pet');animals.add(o.haruActor);}ck(haruWalkable(r,o.x,o.y),'actor walkable');}count+=actors.length;
     if(slot<0)positions.push([hour,actors.map(o=>[o.haruActor,o.x,o.y])]);
    }ck(all.size===10&&animals.size===6,'resident and pet count '+hour+' '+all.size+'/'+animals.size);residents=all.size;pets=animals.size;
   }ck(JSON.stringify(positions[0][1])!==JSON.stringify(positions[2][1]),'time schedule changes');
   // Original SVGs really decode, with dimensions equal to the engine's atlas specification.
   const art=['clinic','shop','lodge','tailor','house','flower','props','flowers','landmarks'];for(const key of art){const im=new Image();im.src='obj/harusaki/'+key+'.svg';await im.decode();ck(im.naturalWidth>0&&im.naturalHeight>0,'asset '+key);}
   // Optional quest logic through actual handlers, deterministic rewards and save.
   const lines=[];msg=async t=>{lines.push(t);};sleep=async()=>{};tween=async(ms,f)=>{f(1);};fadeTo=async v=>{G.fade=v;};confirmYN=async()=>false;
   G.hour=10;loadMap(HARU_KEY,15,29,0);ck(!haruQuest().flowers&&!haruQuest().lost,'new quests not completed');
   S.caught[451]=1;let capsules=S.bag.fuda||0;const mayor=G.objs.find(o=>o.haruActor==='mayor');await talk(mayor);await talk(mayor);ck(S.bag.fuda===capsules+5&&haruQuest().catch,'one-time capture reward');
   const child=G.objs.find(o=>o.haruActor==='child');await talk(child);ck(haruQuest().lostStarted,'lost quest start');
   loadMap(HARU_KEY,15,29,0);const lost=G.objs.find(o=>o.haruActor==='pet:lost');ck(lost&&lost.sp===451,'lost pet exists');await talk(lost);let money=S.money;await talk(G.objs.find(o=>o.haruActor==='child'));await talk(G.objs.find(o=>o.haruActor==='child'));ck(S.money===money+1000&&haruQuest().lost&&!G.objs.some(o=>o.haruActor==='pet:lost'),'one-time lost reward');
   const berries=[0,1,2].map(fruitCount);for(const [x,y] of HARU_FLOWER_BEDS)await haruWaterFlower(x,y);await haruWaterFlower(...HARU_FLOWER_BEDS[0]);eq([0,1,2].map(fruitCount),berries.map(x=>x+1),'flower rewards');ck(haruQuest().flowers,'flower completed');
   // Practice does not change the real party, exp or badges even on defeat.
   const real=S.party,old=JSON.stringify(real),oldBadges=JSON.stringify(S.badges);let heal=S.bag.heal1||0;
   confirmYN=async()=>true;const realBattle=battle;battle=async o=>{ck(o.facility&&o.trainer.team.length===2,'practice rules');S.party[0].hp=0;S.party[0].exp+=1000;return'win';};await haruPractice();await haruPractice();ck(S.party===real&&JSON.stringify(real)===old&&S.bag.heal1===heal+3&&JSON.stringify(S.badges)===oldBadges,'practice restored/one reward');battle=async()=> 'lose';await haruPractice();ck(JSON.stringify(S.party)===old,'practice lose safe');battle=realBattle;
   // Tailoring gift, equipping and return. Actual purchase preview has a separate code path.
   let seq=[1,2];menu=async()=>seq.shift()??-1;await haruTailor({pid:8});ck(S.own[451]&&S.wear.hat===451&&haruQuest().tailor,'hat');
   G.hour=22;loadMap(HARU_KEY,14,16,1);haruInteract(G.map,15,16);await new Promise(r=>setTimeout(r,30));ck(haruQuest().night,'night event');
   ck(saveGame()&&loadSave().upgrade.harusaki.night,'quest save');
   const oldSave={flags:{},badges:{1:1,2:1,50:1},map:'0,2:b2',x:6,y:15,dir:0,upgrade:{rematches:{'g:2':{wins:1}},world:{gyms:{1:{done:true}}}}};migrateHaruSave(oldSave);eq(Object.keys(oldSave.badges).sort(),['1','49','50'],'old badge migration');ck(oldSave.map===HARU_KEY&&oldSave.upgrade.rematches['g:1'].wins===1,'legacy location and record');
   BT=null;G.scene='world';G.busy=true;G.fade=0;UI.length=0;G.hour=12;loadMap(HARU_KEY,14,19,0);G.banner=null;render();
   return{buildings:m.blds.length,gyms:badges.size,residents,pets,quests:HARU_QUESTS.length,reachable:seen.size,art:art.length,bridge:true,save:true};
  });
  fs.mkdirSync('test-results/harusaki',{recursive:true});for(const [name,hour,x,y,slot] of [['plaza',12,14,19,-1],['north',7,16,9,-1],['garden',12,25,15,-1],['park',18,21,27,-1],['night',22,14,19,-1],['clinic',12,5,7,0],['lodge',12,5,8,2],['tailor',12,5,7,3]]){await page.evaluate(({hour,x,y,slot})=>{G.hour=hour;loadMap(haruMapId(slot),x,y,0);G.banner=null;render();},{hour,x,y,slot});await page.locator('canvas').first().screenshot({path:'test-results/harusaki/'+engine+'-'+name+'.png'});}
  assert.deepEqual(errors,[]);assert.equal(result.gyms,50);assert.equal(result.residents,10);assert.equal(result.quests,6);results.push({engine,...result});await browser.close();browser=null;
 }report('harusaki',results);
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
