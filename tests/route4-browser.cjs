'use strict';
const {chromium,webkit,devices}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),{serve,report}=require('./qa-server.cjs');
(async()=>{const server=await serve(),results=[];let browser;
 try{for(const [engine,api] of [['chromium',chromium],['webkit',webkit]]){
  browser=await api.launch({headless:true});const page=await browser.newPage(engine==='webkit'?{...devices['iPhone 13'],viewport:{width:390,height:844}}:{viewport:{width:960,height:720}});
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.goto(server.url);await page.waitForFunction(()=>typeof genRoute4==='function'&&typeof waitAnimaArtwork==='function'&&UI.length>0);
  const data=await page.evaluate(async()=>{
   const ck=(v,m)=>{if(!v)throw Error(m);},eq=(a,b,m)=>ck(JSON.stringify(a)===JSON.stringify(b),m+' '+JSON.stringify(a)),random=Math.random;
   const approved=[...STARTER_FRONT_SET,...ROUTE1_IDS,...ROUTE2_IDS,...TRIBEL_IDS,...ROUTE3_IDS,...ROUTE4_IDS];
   ck(N_SPECIES===1212&&new Set(FAMS.flatMap(f=>f.ids)).size===1212,'dex');ck(approved.length===83&&new Set(approved).size===83&&TRIBEL_IDS.size===18,'all 83 incl new Tribel');
   const cell=CELLS[ROUTE4_KEY];ck(neighborCell(cell,0).key==='2,0'&&neighborCell(cell,2).key==='2,2','links');ck(WORLD.gymTown.length===51&&GYM_TOWN[2]==='ツユクサ野','gym');eq(cell.land,ROUTE4_LINES.map(f=>SP[f.ids[0]].fam),'ecology');ck(cell.water.length===1&&cell.water[0]===SP[528].fam,'only approved water species');
   for(const [zone,def] of Object.entries(ROUTE4_ZONES)){const counts=ROUTE4_LINES.map(()=>0);for(let i=0;i<100;i++){Math.random=()=>(i+.5)/100;const v=wildPick({...cell,route4Zone:zone},'land',0);counts[ROUTE4_LINES.findIndex(f=>f.ids[0]===v.sp)]++;ck(v.lv>=def.lv[0]&&v.lv<=def.lv[1],'level '+zone);ck(wildPick({...cell,route4Zone:zone},'water',0).sp===528,'water');}eq(counts,def.weights,'exact weights '+zone);}Math.random=random;
   S=newSave('渓流QA');Object.assign(S,homeSpot());S.starter=2;S.flags.dex=1;S.party=[makeMon(19,65,{iv:31}),makeMon(3,60,{iv:31})];S.opts.snd=0;S.opts.music=0;S.opts.share=0;startFromSave();G.busy=true;UI.length=0;G.fade=0;
   const main=getMap(ROUTE4_KEY),gorge=getMap(ROUTE4_INNER),reach=(m,start)=>{const v=new Set([start.join(',')]),q=[start];for(let j=0;j<q.length;j++){const [x,y]=q[j];for(let d=0;d<4;d++){const nx=x+DX[d],ny=y+DY[d],k=nx+','+ny;if(nx<0||nx>=32||ny<0||ny>=32||v.has(k)||SOLID[m.t[ny*32+nx]]||m.t[ny*32+nx]===T.WATER||occupied(m,nx,ny)||!expansionPass(m,x,y,nx,ny,{surf:false,fly:false}))continue;v.add(k);q.push([nx,ny]);}}return v;};
   const topo=[];for(const [j,m] of [main,gorge].entries()){const v=reach(m,j?[15,29]:[15,0]),near=(x,y)=>[0,1,2,3].some(d=>v.has((x+DX[d])+','+(y+DY[d])));ck(v.has('15,31')&&m.W===32&&m.H===32,'map exit '+m.id);for(const k of Object.keys(m.warps))ck(v.has(k),'warp '+k);for(const o of m.objs)ck(near(o.x,o.y),'actor '+m.id+' '+o.x+','+o.y);for(const k of Object.keys(m.route4Sites))ck(near(...k.split(',').map(Number)),'site '+k);topo.push({id:m.id,reachable:v.size,trees:Array.from(m.t).filter(t=>t===T.TREE).length,flowers:m.r4Flowers.length,bridges:Object.values(m.adv).filter(x=>x.kind==='bridge').length});}
   const objs=[...main.objs,...gorge.objs];ck(objs.filter(o=>o.role==='trainer').length===5&&objs.filter(o=>o.k==='item').length===4,'five trainers, four visible items');ck([main,gorge].flatMap(m=>Object.values(m.route4Sites)).filter(a=>a.kind==='hidden').length===2,'two hidden items');ck(validExpansionMapId(ROUTE4_INNER)&&!validExpansionMapId('a:route4-gorge:0,0'),'valid map id');
   ck(main.r4Shrubs.every(([x,y])=>main.t[y*32+x]===T.SHRUB)&&!S.bag.k_cut,'gated shortcut');
   let fronts=0,motions=0;for(const f of ROUTE4_LINES)for(let j=0;j<f.ids.length;j++){const id=f.ids[j],sp=SP[id];eq(sp.name,f.names[j],'name');eq(sp.types,f.types[j],'types');eq(sp.base,f.base[j],'stats');eq(abilityOptions(sp),[f.ability],'ability');eq([sp.prev,sp.next,sp.evoLv],[f.ids[j-1]||0,f.ids[j+1]||0,f.levels[j]||0],'evolution');if(sp.next){ck(!canEvolve(makeMon(id,sp.evoLv-1))&&canEvolve(makeMon(id,sp.evoLv)),'evolution condition '+id);}
    const front=await waitAnimaArtwork(id,false),rear=await waitAnimaArtwork(id,true);ck(monPic(sp.book).img.src.includes('/mon/route4/')&&monPic(sp.book).st===1&&front.width===MS,'front '+id);ck(!MONBACK[id]&&rear._animaView!=='rear','reflection '+id);const a=front.getContext('2d').getImageData(0,0,front.width,front.height).data;let ink=0;for(let k=3;k<a.length;k+=4)if(a[k]>32)ink++;ck(ink>100&&ink<front.width*front.height*.95,'transparent '+id);fronts++;
    for(const clip of AnimaSpriteEngine.clips){const frame=AnimaSpriteEngine.getFrame(front,animaRig(id),clip,.43,{size:80,steps:8,budget:4*1048576});ck(frame&&frame.c.width>80,'motion '+id+' '+clip);motions++;}
   }
   // Exercise combat functions with actual engine state and shortened presentation delays.
   const msgs=[];msg=async t=>{msgs.push(t);};sleep=async()=>{};tween=async(ms,f)=>{f(1);};fadeTo=async v=>{G.fade=v;};moveFx=async()=>{};hitAnim=async()=>{};faintAnim=async()=>{};confirmYN=async()=>true;menu=async items=>Math.max(0,items.findIndex(x=>!x.dis));
   const B=(u,t)=>({pairMons:[u,t],ps:newStg(),fs:newStg(),weather:null,wall:[[0,0],[0,0]],hpShow:[u.hp,t.hp],fx:{},o:{facility:true},parts:new Set(),coins:0,wT:0,turnN:0});
   const learn=(u,n)=>{const id=moveId(n);u.mv=[{id,pp:30}];return MOVES[id];};
   const seed=makeMon(610,50,{iv:31}),water=makeMon(528,40),fire=makeMon(359,50,{iv:31}),weave=makeMon(425,50),dig=makeMon(655,50,{iv:31}),sound=makeMon(929,50,{iv:31}),enemy=makeMon(19,60,{iv:31}),rock=makeMon(266,50,{iv:31});
   let b=B(enemy,seed);BT=b;const half=Math.floor(maxHP(seed)/2),recover=Math.max(1,Math.floor(maxHP(seed)/10));seed.hp=half;await hpAnim(b,1);ck(seed.hp===half+recover&&starterState(b,seed).r4Hollow,'hollow actual HP transition');seed.hp=half-1;await hpAnim(b,1);ck(seed.hp===half-1,'hollow once');
   b=B(enemy,water);BT=b;ck(!await inflict(b,1,'brn',true)&&!water.st,'burn immunity');ck(await inflict(b,1,'par',true)&&water.st==='par','not general status immunity');water.st=null;
   b=B(fire,enemy);BT=b;const flame=learn(fire,'ひばな');ck(route4Power(b,fire,enemy,flame)===1.2,'first fire potential');const d1=calcDamage(b,0,flame,false,1,100);Math.random=()=>.25;await useMove(b,0,0);Math.random=random;ck(b.r4LastBoost&&route4Power(b,fire,enemy,flame)===1,'fire consumed actual move');ck(d1>calcDamage(b,0,flame,false,1,100),'real damage multiplier');
   b=B(weave,enemy);BT=b;const status=learn(weave,'かぜにのる');ck(route4Priority(b,weave,status)===status.prio+1,'first status priority');await useMove(b,0,0);ck(b.ps.eva===1&&route4Priority(b,weave,status)===status.prio,'priority consumed actual status');
   b=B(dig,rock);BT=b;const soil=learn(dig,'すなげり');ck(route4Power(b,dig,rock,soil)===1.2&&route4Power(b,dig,enemy,soil)===1,'wood breaker target typing');const withBoost=calcDamage(b,0,soil,false,1,100),orig=route4Power;route4Power=()=>1;const noBoost=calcDamage(b,0,soil,false,1,100);route4Power=orig;ck(withBoost>noBoost,'wood breaker actual formula');
   b=B(sound,enemy);BT=b;const tone=learn(sound,'きょうめいほう');ck(route4Power(b,sound,enemy,tone)===1.2&&route4Power(b,sound,enemy,MOVES[moveId('ねんどう')])===1,'explicit sound moves');const s1=calcDamage(b,0,tone,false,1,100);route4Power=()=>1;const s0=calcDamage(b,0,tone,false,1,100);route4Power=orig;ck(s1>s0,'sound actual formula');
   // The double battle shares the once-per-battle flags. Action ordering uses the real first-use priority.
   fire.hp=maxHP(fire);weave.hp=maxHP(weave);enemy.hp=maxHP(enemy);rock.hp=maxHP(rock);S.party=[weave,fire];
   const D=doubleState({trainer:{name:'QA',team:[enemy,rock]}});BT=D;learn(enemy,'ぶつかる');learn(weave,'かぜにのる');const actions=[{kind:'move',slot:D.slots[1][0],i:0},{kind:'move',slot:D.slots[0][0],i:0}];ck(doubleOrder(actions)[0].slot.mon===weave,'double action priority');
   const pair=doublePair(D,D.slots[0][0],D.slots[1][0]);await useMove(pair,0,0);const pair2=doublePair(D,D.slots[0][0],D.slots[1][1]);ck(route4Priority(pair2,weave,status)===status.prio,'double shared status flag');
   const fp=doublePair(D,D.slots[0][1],D.slots[1][0]);await route4BeginMove(fp,0,flame);const spread=doublePair(D,D.slots[0][1],D.slots[1][1]);spread.extra=true;spread.r4SpreadBoost=fp.r4LastBoost;await route4BeginMove(spread,0,flame);ck(route4Power(spread,fire,rock,flame)===1.2,'spread fire boost shared');spread.r4FireActor=null;ck(route4Power(spread,fire,rock,flame)===1,'subsequent fire no boost');
   const evo=makeMon(609,25);evo.mv=[];S.party=[evo];BT=null;G.scene='world';await evolveMon(evo);ck(evo.sp===610&&evo.mv.some(x=>MOVES[x.id].name==='てつづめ'),'real evolution');
   S.party=[makeMon(19,75),makeMon(21,75)];G.fade=0;loadMap(ROUTE4_KEY,15,5,0);
   // Real tool interaction and saved unlock. Without tool the shrub is unchanged.
   await useTool(T.SHRUB,6,9);ck(G.map.t[9*32+6]===T.SHRUB,'no tool');S.bag.k_cut=1;await useTool(T.SHRUB,6,9);ck(route4State()['cut:6,9']&&G.map.t[9*32+6]===T.PATH,'cut');MAPCACHE.delete(ROUTE4_KEY);loadMap(ROUTE4_KEY,15,5,0);ck(G.map.t[9*32+6]===T.PATH,'cut persists map rebuild');
   const rest=G.map.route4Sites['12,21'];S.party[0].hp=1;await route4SiteTalk(G.map,rest);ck(S.party[0].hp===maxHP(S.party[0]),'rest');
   let h=G.map.route4Sites['5,11'],n=S.bag[h.item]||0;await route4SiteTalk(G.map,h);await route4SiteTalk(G.map,h);ck(S.bag[h.item]===n+1,'hidden once');
   await doWarp(G.map.warps['26,22']);ck(G.map.id===ROUTE4_INNER,'actual gorge warp');const sites=G.map.route4Sites;
   ck(G.map.r4Repair.every(([x,y])=>G.map.t[y*32+x]===T.WATER),'broken bridge');
   await route4SiteTalk(G.map,sites['21,22']);for(const a of Object.values(sites).filter(a=>a.kind==='plank')){await route4SiteTalk(G.map,a);await route4SiteTalk(G.map,a);}ck(route4State().planks.length===3,'three unique planks');
   let money=S.money;await route4SiteTalk(G.map,sites['21,22']);await route4SiteTalk(G.map,sites['21,22']);ck(S.money===money+600&&route4State().repaired,'repair once');
   ck(G.map.r4Repair.every(([x,y])=>G.map.t[y*32+x]===T.PATH&&expAt(G.map,x,y).kind==='bridge'),'repair bridge tiles');
   await route4SiteTalk(G.map,sites['18,4']);ck(route4State().view,'record');ck(saveGame()&&loadSave().upgrade.route4.repaired,'saved subarea');MAPCACHE.delete(ROUTE4_INNER);loadMap(ROUTE4_INNER,15,29,0);ck(G.map.r4Repair.every(([x,y])=>G.map.t[y*32+x]===T.PATH),'repair persists rebuild');
   const t=G.objs.find(o=>o.role==='trainer'),realBattle=battle;let called=0;battle=async o=>{called++;ck(o.trainer.team.length===2&&!o.double,'fixed trainer team');return'win';};await talk(t);ck(called===1&&t.beaten&&S.flags['t:'+ROUTE4_INNER+':'+t.tid],'trainer flag');battle=realBattle;
   await doWarp(G.map.warps['15,31']);ck(G.map.id===ROUTE4_KEY,'actual return');loadMap(ROUTE4_KEY,15,31,2);await edgeMove(2);ck(G.map.id==='2,2','city exit');
   // New base form through real capture flow.
   loadMap(ROUTE4_KEY,15,5,0);S.bag.fuda=3;chooseAction=async()=>({t:'seal',id:'fuda'});Math.random=()=>0;const cap=await doWild({sp:609,lv:9},{});Math.random=random;ck(cap==='caught'&&S.caught[609]&&S.party.some(m=>m.sp===609),'capture actual');
   const ally=makeMon(610,25),foe=makeMon(358,11);S.party=[ally,makeMon(528,12)];G.scene='battle';BT={o:{wild:foe},wild:true,foes:[foe],pi:0,fi:0,ps:newStg(),fs:newStg(),env:battleEnv({}),hpShow:[ally.hp,foe.hp],fx:{foeX:0,meX:0,foeA:1,meA:1,foeY:0,meY:0},weather:null,wall:[[0,0],[0,0]]};fxClear();render();
   return{topo,fronts,motions,trainers:5,abilities:6,actualCapture:true,actualEvolution:true,repair:true,save:true,approved:approved.length};
  });
  fs.mkdirSync('test-results/route4',{recursive:true});await page.locator('canvas').first().screenshot({path:'test-results/route4/'+engine+'-battle.png'});
  for(const [label,id,x,y,hour] of [['forest','2,1',15,6,12],['bridge','2,1',20,17,12],['waterfall','2,1',6,14,12],['flowers','2,1',24,27,17],['gorge','a:route4-gorge:2,1',23,13,12],['night','a:route4-gorge:2,1',20,13,22]]){
   await page.evaluate(({id,x,y,hour})=>{BT=null;G.scene='world';G.hour=hour;G.fade=0;loadMap(id,x,y,0);G.banner=null;render();},{id,x,y,hour});await page.locator('canvas').first().screenshot({path:'test-results/route4/'+engine+'-'+label+'.png'});
  }
  assert.deepEqual(errors,[]);assert.equal(data.fronts,13);assert.equal(data.motions,416);results.push({engine,...data});await browser.close();browser=null;
 }report('route4',results);
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
