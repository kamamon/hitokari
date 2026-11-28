'use strict';
const {chromium,webkit,devices}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),{serve,report}=require('./qa-server.cjs');
(async()=>{const server=await serve(),results=[];let browser;try{
 for(const [engine,api] of [['chromium',chromium],['webkit',webkit]]){
  browser=await api.launch({headless:true});const page=await browser.newPage(engine==='webkit'?{...devices['iPhone 13'],viewport:{width:390,height:844}}:{viewport:{width:960,height:720}});const errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.goto(server.url);await page.waitForFunction(()=>typeof genTribelMap==='function'&&typeof battleArtInfo==='function'&&UI.length>0);
  const data=await page.evaluate(async()=>{
   const ck=(v,m)=>{if(!v)throw Error(m);},eq=(a,b,m)=>ck(JSON.stringify(a)===JSON.stringify(b),m+' '+JSON.stringify(a)),random=Math.random;
   eq(STARTERS,[2,3,1],'starters');ck(N_SPECIES===1212&&new Set(FAMS.flatMap(f=>f.ids)).size===1212,'dex identity');ck(ROUTE1_IDS.size===12&&ROUTE2_IDS.size===18&&TRIBEL_IDS.size===18&&TRIBEL_LINES.length===8,'57 approved through Tribel');
   const c=CELLS[TRIBEL_KEY];eq(c.land,TRIBEL_ENCOUNTERS.map(([id])=>SP[id].fam),'base roster');ck(CELLS['0,2'].gym===0&&WORLD.gymTown[1].name==='モミノキ街'&&WORLD.gymTown.length===51,'gym progression');
   const ids=TRIBEL_ENCOUNTERS.map(x=>x[0]),counts=ids.map(()=>0);
   for(let i=0;i<100;i++){Math.random=()=>(i+.5)/100;const w=wildPick(c,'land',0);counts[ids.indexOf(w.sp)]++;ck(w.lv>=6&&w.lv<=9,'base level');}Math.random=random;eq(counts,[20,12,12,17,10,11,12,6],'real base weights');
   for(const zone of Object.keys(TRIBEL_ZONES)){const [min,max]=TRIBEL_ZONES[zone].levels;for(let i=0;i<100;i++){Math.random=()=>(i+.5)/100;const w=wildPick({...c,tribelZone:zone},'land',0);ck(ids.includes(w.sp)&&w.lv>=min&&w.lv<=max&&!route1FamilyRare(w.sp),'zone ecology '+zone);}}Math.random=random;
   ck(tribelWeights('hill').find(v=>v[0]===1062)[1]===24&&tribelWeights('rock').find(v=>v[0]===265)[1]===36,'habitat weights');
   S=newSave('平原QA');Object.assign(S,homeSpot());S.party=[makeMon(19,75,{iv:31}),makeMon(21,75,{iv:31})];S.starter=2;S.flags.dex=1;S.opts.music=0;S.opts.snd=0;startFromSave();G.busy=true;UI.length=0;G.fade=0;
   const maps=Object.values(TRIBEL_MAPS).map(id=>getMap(id)),reach=(m,p)=>{const q=[p],v=new Set([p.join(',')]);while(q.length){const [x,y]=q.shift();for(let d=0;d<4;d++){const nx=x+DX[d],ny=y+DY[d],k=nx+','+ny;if(nx<0||ny<0||nx>=m.W||ny>=m.H||v.has(k)||SOLID[m.t[ny*m.W+nx]]||occupied(m,nx,ny)||!expansionPass(m,x,y,nx,ny,{surf:false,fly:false}))continue;v.add(k);q.push([nx,ny]);}}return v;};
   const topology=[];for(const m of maps){ck(m.W===32&&m.H===32,'dimensions');const v=reach(m,m.tribel==='main'?[15,31]:[15,29]);ck(m.tribel==='main'?v.has('31,15')&&v.has('31,16'):v.has('15,31'),'exit '+m.id);
    for(const k of Object.keys(m.warps))ck(v.has(k),'warp '+m.id+' '+k);
    for(const o of m.objs)ck([0,1,2,3].some(d=>v.has((o.x+DX[d])+','+(o.y+DY[d]))),'actor reachable '+m.id+' '+o.x+','+o.y);
    for(const [k,o] of Object.entries(m.tribelSites)){const [x,y]=k.split(',').map(Number);ck([0,1,2,3].some(d=>v.has((x+DX[d])+','+(y+DY[d]))),'site '+m.id+' '+k);}
    topology.push({id:m.id,tiles:m.W*m.H,reachable:v.size,trees:Array.from(m.t).filter(x=>x===T.TREE).length,flowers:m.tribelFlowers.length,bridges:Object.values(m.adv).filter(o=>o.kind==='bridge').length,stairs:Object.values(m.adv).filter(o=>o.kind==='stairs').length});
   }
   ck(topology[0].trees<300&&topology[1].bridges>8&&topology[2].stairs>=8,'open meadow, lake and hill');eq(maps[0].exits,[0,1,1,0],'macro exits');ck(neighborCell(c,1).key==='1,0'&&neighborCell(c,2).key==='0,1','road connections');
   const trainers=maps.flatMap(m=>m.objs.filter(o=>o.role==='tribeltrainer'));ck(trainers.length===8&&trainers.filter(o=>o.tribelPair).length===4&&new Set(trainers.map(o=>o.tid)).size===8,'eight trainers');
   ck(validExpansionMapId(TRIBEL_MAPS.lake)&&validExpansionMapId(TRIBEL_MAPS.hill)&&!validExpansionMapId('a:tribel-lake:0,2'),'valid save ids');
   loadMap(TRIBEL_KEY,15,29,0);Math.random=()=>.99;ck(!wildEncounterPartner({...c,tribelZone:'deep'},'land',0,0,S.party[0],{sp:711,lv:9}), 'double probability rejected');Math.random=()=>.25;ck(wildEncounterPartner({...c,tribelZone:'deep'},'land',0,0,S.party[0],{sp:711,lv:9}),'deep 30% doubles');Math.random=random;
   ck(ids.every(id=>TRIBEL_IDS.has(id))&&ids.length===8,'only eight approved base forms');let fronts=0,backs=0,motions=0;
   for(const f of TRIBEL_LINES)for(let j=0;j<f.ids.length;j++){const id=f.ids[j],sp=SP[id];eq(sp.name,f.names[j],'name');eq(sp.types,f.types[j],'types');eq(sp.base,f.base[j],'base stats');eq([sp.prev,sp.next,sp.evoLv],[f.ids[j-1]||0,f.ids[j+1]||0,f.levels[j]||0],'evolution');eq(abilityOptions(sp),[f.ability],'ability');ck(motionProfile(id)[1]===sp.name&&motionProfile(id)[2]===f.plans[j]&&animaRig(id)[15]===f.ids.length,'rig');
    if(sp.next){ck(!canEvolve(makeMon(id,sp.evoLv-1)),'before evolution');ck(canEvolve(makeMon(id,sp.evoLv)),'at evolution');}
    const front=await waitAnimaArtwork(id,false),rear=await waitAnimaArtwork(id,true);ck(monPic(sp.book).img.src.includes('/mon/tribel/')&&monPic(sp.book).st===1&&front.width===MS,'front actual '+id);ck(!MONBACK[id]&&rear._animaView!=='rear'&&monAssetPath(id,true)===monAssetPath(id),'reflected rear, no legacy art '+id);fronts++;backs++;
    for(const view of [front,rear]){const a=view.getContext('2d').getImageData(0,0,view.width,view.height).data;let ink=0;for(let k=3;k<a.length;k+=4)if(a[k]>32)ink++;ck(ink>100&&ink<view.width*view.height*.9,'transparent artwork');}
    for(const clip of AnimaSpriteEngine.clips){const frame=AnimaSpriteEngine.getFrame(front,animaRig(id),clip,.43,{size:80,steps:8,budget:4*1048576});ck(frame&&frame.c.width>80,'motion '+id+' '+clip);motions++;}
   }
   eq(TRIBEL_LINES.map(f=>SP[f.ids.at(-1)].bst),TRIBEL_LINES.map(f=>f.base.at(-1).reduce((a,b)=>a+b,0)),'final stats');
   // Use actual combat move/entry/end-of-turn paths; stub only presentation delays.
   const messages=[];msg=async t=>{messages.push(t);};sleep=async()=>{};tween=async(ms,f)=>{f(1);};fadeTo=async v=>{G.fade=v;};moveFx=async()=>{};hitAnim=async()=>{};faintAnim=async()=>{};confirmYN=async()=>true;menu=async items=>Math.max(0,items.findIndex(x=>!x.dis));
   const B=(u,t,weather=null)=>({pairMons:[u,t],ps:newStg(),fs:newStg(),weather,wall:[[0,0],[0,0]],hpShow:[u.hp,t.hp],fx:{},o:{facility:true},parts:new Set(),coins:0,wT:5,turnN:0});
   const learn=(u,n)=>{const id=moveId(n);u.mv=[{id,pp:20}];return MOVES[id];};
   const horse=makeMon(546,10),stone=makeMon(266,50,{iv:31}),bee=makeMon(191,50,{iv:31}),wind=makeMon(1062,40,{iv:31,nat:0}),enemy=makeMon(19,50,{iv:31,nat:0}),weak=makeMon(3,5,{iv:0,nat:0});
   ck(tribelEscape(horse)===96&&tribelEscape(enemy)===0,'escape bonus');
   let b=B(weak,stone);BT=b;learn(weak,'ぶつかる');const hp=weak.hp;Math.random=()=>.25;await useMove(b,0,0);Math.random=random;ck(weak.hp===hp-Math.max(1,Math.floor(maxHP(weak)/8)),'contact reflection');
   const hp2=weak.hp;learn(weak,'すなげり');await useMove(b,0,0);ck(weak.hp===hp2,'ranged not reflected');
   b=B(bee,enemy);BT=b;learn(bee,'いやしのいき');bee.hp=1;b.hpShow[0]=1;await useMove(b,0,0);ck(bee.hp===Math.min(maxHP(bee),1+Math.floor(maxHP(bee)*.6)),'nectar heal');
   b=B(wind,enemy);BT=b;const normal=effStat(b,0,5);await entryAbility(b,0);ck(effStat(b,0,5)===Math.floor(normal*1.2)&&tribelWind(b)[0]===3&&tribelWindSpeed(b,1)===1,'wind 3 turns');
   for(let j=0;j<3;j++)await tribelWindEnd(b);ck(tribelWindSpeed(b,0)===1,'wind expiration');
   S.party=[wind,horse];const D=doubleState({trainer:{name:'QA',team:[enemy,stone]}});BT=D;const plain=combatStat(horse,D.slots[0][1].st,5);await doubleEnter(D,D.slots[0][0]);ck(tribelWind(D)[0]===3&&combatStat(horse,D.slots[0][1].st,5)===Math.floor(plain*1.2),'double ally speed');const pair=doublePair(D,D.slots[0][1],D.slots[1][0]);ck(tribelWind(pair)===tribelWind(D)&&tribelWindSpeed(pair,0)===1.2,'shared side state');await tribelWindEnd(D);
   const evo=makeMon(1188,16);evo.mv=[];S.party=[evo];BT=null;G.scene='world';await evolveMon(evo);ck(evo.sp===1189&&evo.mv.some(x=>MOVES[x.id].name==='いのちすい'),'actual evolution');
   // Optional paired encounter: cancellation, both owners, one-time reward flags.
   S.party=[makeMon(19,75),makeMon(21,75)];BT=null;G.scene='world';G.fade=0;loadMap(TRIBEL_KEY,15,29,0);
   const t=G.objs.find(o=>o.tribelPair==='grass'),realBattle=battle;let called=0;
   battle=async o=>{called++;ck(o.double&&o.multi.length===2&&o.ownerByIndex.join(',')==='0,1'&&o.trainer.team.length===2,'actual pair options');return'win';};
   confirmYN=async()=>false;await tribelTrainerTalk(t);ck(called===0&&!t.beaten,'optional cancel');confirmYN=async()=>true;await tribelTrainerTalk(t);await tribelTrainerTalk(t);ck(called===1&&G.objs.filter(o=>o.tribelPair==='grass').every(o=>o.beaten),'paired victory persistence');battle=realBattle;
   const rest=Object.values(G.map.tribelSites).find(o=>o.kind==='rest');S.party[0].hp=1;await tribelSiteTalk(G.map,rest);ck(S.party[0].hp===maxHP(S.party[0]),'rest');const guide=G.objs.find(o=>o.guide==='double'),items=S.bag.heal1||0;await talk(guide);await talk(guide);ck(S.bag.heal1===items+2,'tutorial reward once');
   const hidden=Object.values(G.map.tribelSites).find(o=>o.kind==='hidden'),oldItem=S.bag[hidden.item]||0;await tribelSiteTalk(G.map,hidden);await tribelSiteTalk(G.map,hidden);ck(S.bag[hidden.item]===oldItem+1,'hidden reward once');
   // Actual warp from main to hill and return; no gate or required trainer.
   await doWarp(G.map.warps['20,4']);ck(G.map.id===TRIBEL_MAPS.hill,'actual hill warp');const rival=G.objs.find(o=>o.guide==='rival');await talk(rival);ck(S.flags['tribel:rival'],'rival optional');ck(saveGame()&&loadSave().map===TRIBEL_MAPS.hill,'subarea save');await doWarp(G.map.warps['15,31']);ck(G.map.id===TRIBEL_KEY,'actual return');
   // New species in real capture flow.
   S.bag.fuda=3;chooseAction=async()=>({t:'seal',id:'fuda'});Math.random=()=>0;const cap=await doWild({sp:546,lv:6},{});Math.random=random;ck(cap==='caught'&&S.caught[546]&&S.party.some(m=>m.sp===546),'capture');
   // Actual battle render with mixed WebP/SVG and true rear art.
   const ally=makeMon(547,25),foe=makeMon(1062,10);S.party=[ally,makeMon(190,12)];G.scene='battle';const view={o:{wild:foe},wild:true,foes:[foe],pi:0,fi:0,ps:newStg(),fs:newStg(),env:battleEnv({}),hpShow:[ally.hp,foe.hp],fx:{foeX:0,meX:0,foeA:1,meA:1,foeY:0,meY:0},weather:null,wall:[[0,0],[0,0]]};BT=view;fxClear();render();ck(battleArtSource(foe,false,64).view==='front'&&battleArtSource(ally,true,96).view==='reflected','battle HD paths');
   return{counts,topology,fronts,backs,motions,trainers:8,pairs:2,abilities:4,optional:true,actualCapture:true,actualEvolution:true,save:true};
  });
  fs.mkdirSync('test-results/tribel',{recursive:true});await page.locator('canvas').first().screenshot({path:'test-results/tribel/'+engine+'-battle.png'});
  for(const [label,zone,x,y,hour] of [['meadow','main',15,20,12],['herd','main',10,26,12],['lake','lake',14,16,12],['flowers','lake',24,22,12],['hill','hill',17,7,17],['night','hill',17,7,22]]){
   await page.evaluate(({zone,x,y,hour})=>{BT=null;G.scene='world';G.hour=hour;G.fade=0;loadMap(TRIBEL_MAPS[zone],x,y,0);G.banner=null;render();},{zone,x,y,hour});await page.locator('canvas').first().screenshot({path:'test-results/tribel/'+engine+'-'+label+'.png'});
  }
  assert.deepEqual(errors,[]);assert.equal(data.fronts,18);assert.equal(data.backs,18);assert.equal(data.motions,576);results.push({engine,...data});await browser.close();browser=null;
 }
 report('tribel',results);
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
