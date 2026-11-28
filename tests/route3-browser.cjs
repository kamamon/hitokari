'use strict';
const {chromium,webkit,devices}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),{serve,report}=require('./qa-server.cjs');
(async()=>{const server=await serve(),results=[];let browser;try{
 for(const [engine,api] of [['chromium',chromium],['webkit',webkit]]){
  browser=await api.launch({headless:true});const page=await browser.newPage(engine==='webkit'?{...devices['iPhone 13'],viewport:{width:390,height:844}}:{viewport:{width:960,height:720}}),errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.goto(server.url);await page.waitForFunction(()=>typeof genRoute3==='function'&&typeof battleArtInfo==='function'&&UI.length>0);
  const data=await page.evaluate(async()=>{
   const ck=(v,m)=>{if(!v)throw Error(m);},eq=(a,b,m)=>ck(JSON.stringify(a)===JSON.stringify(b),m+' '+JSON.stringify(a)),random=Math.random;
   eq(STARTERS,[2,3,1],'starters');ck(N_SPECIES===1212&&new Set(FAMS.flatMap(f=>f.ids)).size===1212,'dex identity');ck(ROUTE1_IDS.size===12&&ROUTE2_IDS.size===18&&TRIBEL_IDS.size===18&&ROUTE3_IDS.size===13,'70 approved');
   const c=CELLS[ROUTE3_KEY];eq(c.land,ROUTE3_LINES.map(f=>SP[f.ids[0]].fam),'roster');ck(CELLS['0,2'].gym===0&&WORLD.gymTown[1].name==='モミノキ街'&&WORLD.gymTown.length===51,'gym progression');
   const ids=ROUTE3_LINES.map(f=>f.ids[0]),counts=ids.map(()=>0);for(let i=0;i<100;i++){Math.random=()=>(i+.5)/100;const w=wildPick(c,'land',0);counts[ids.indexOf(w.sp)]++;ck(w.lv>=8&&w.lv<=11,'level');}Math.random=random;eq(counts,[26,22,18,15,12,7],'actual encounter weights');
   S=newSave('第3街道QA');Object.assign(S,homeSpot());S.party=[makeMon(19,75,{iv:31}),makeMon(21,75,{iv:31})];S.starter=2;S.flags.dex=1;S.opts.music=0;S.opts.snd=0;startFromSave();G.busy=true;UI.length=0;G.fade=0;
   const m=getMap(ROUTE3_KEY);ck(m.W===32&&m.H===32&&m.route3,'map');eq(m.exits,[0,1,0,1],'exits');ck(neighborCell(c,1).key==='2,0'&&neighborCell(c,3).key==='0,0','neighbors');
   const reach=(mode,avoidTall=false)=>{const q=[[0,15]],v=new Set(['0,15']);while(q.length){const [x,y]=q.shift();for(let d=0;d<4;d++){const nx=x+DX[d],ny=y+DY[d],k=nx+','+ny;if(nx<0||ny<0||nx>=32||ny>=32||v.has(k)||SOLID[m.t[ny*32+nx]]||occupied(m,nx,ny)||mode==='north'&&ny>16||mode==='south'&&ny<15||avoidTall&&m.t[ny*32+nx]===T.TALL)continue;v.add(k);q.push([nx,ny]);}}return v;};
   const north=reach('north'),south=reach('south');ck(north.has('31,15')&&south.has('31,15'),'both routes reach city');ck(!reach('south',true).has('31,15'),'south grass crossing');ck(reach('north',true).has('31,15'),'north no grass');
   const trainers=m.objs.filter(o=>o.role==='trainer');ck(trainers.length===6&&trainers.every(o=>o.y<10)&&trainers.filter(o=>o.route3Pair).length===2,'six north trainers');ck(m.t.slice(0,22*32).every(x=>x!==T.TALL&&x!==T.FLOWER),'no north wild encounters');
   loadMap(ROUTE3_KEY,24,7,1);ck(trainerSightHits().filter(o=>o.route3Pair).length===2,'actual twin sight');loadMap(ROUTE3_KEY,15,25,1);ck(trainerSightHits().length===0,'no south trainers');
   let fronts=0,reflected=0,motions=0;
   for(const f of ROUTE3_LINES)for(let j=0;j<f.ids.length;j++){
    const id=f.ids[j],sp=SP[id];eq(sp.name,f.names[j],'name');eq(sp.types,f.types[j],'types');eq(sp.base,f.base[j],'base stats');eq([sp.prev,sp.next,sp.evoLv],[f.ids[j-1]||0,f.ids[j+1]||0,f.levels[j]||0],'evolution');eq(abilityOptions(sp),[f.ability],'ability');ck(motionProfile(id)[1]===sp.name&&motionProfile(id)[2]===f.plans[j]&&animaRig(id)[15]===f.ids.length,'rig');
    if(sp.next){ck(!canEvolve(makeMon(id,sp.evoLv-1)),'before evolution');ck(canEvolve(makeMon(id,sp.evoLv)),'at evolution');}
    const front=await waitAnimaArtwork(id,false),rear=await waitAnimaArtwork(id,true);ck(monPic(sp.book).img.src.includes('/mon/route3/')&&monPic(sp.book).st===1&&front.width===MS,'approved front '+id);ck(!MONBACK[id]&&rear._animaView!=='rear','reflection not stale rear');fronts++;reflected++;
    const alpha=front.getContext('2d').getImageData(0,0,front.width,front.height).data;let ink=0;for(let k=3;k<alpha.length;k+=4)if(alpha[k]>32)ink++;ck(ink>100&&ink<front.width*front.height*.9,'transparent art '+id);
    for(const clip of AnimaSpriteEngine.clips){const frame=AnimaSpriteEngine.getFrame(front,animaRig(id),clip,.43,{size:80,steps:8,budget:4*1048576});ck(frame&&frame.c.width>80,'motion '+id+' '+clip);motions++;}
   }
   eq(ROUTE3_LINES.map(f=>SP[f.ids.at(-1)].bst),[480,475,500,465,480,535],'final stats');
   const messages=[];msg=async t=>{messages.push(t);};sleep=async()=>{};tween=async(ms,f)=>{f(1);};fadeTo=async v=>{G.fade=v;};moveFx=async()=>{};hitAnim=async()=>{};faintAnim=async()=>{};confirmYN=async()=>true;menu=async items=>Math.max(0,items.findIndex(x=>!x.dis));
   const B=(u,t,weather=null)=>({pairMons:[u,t],ps:newStg(),fs:newStg(),weather,wall:[[0,0],[0,0]],hpShow:[u.hp,t.hp],fx:{},o:{facility:true},parts:new Set(),coins:0,wT:5,turnN:0});
   const learn=(u,n)=>{const id=moveId(n);u.mv=[{id,pp:20}];return MOVES[id];};
   const badger=makeMon(36,50,{iv:31}),newt=makeMon(242,50,{iv:31}),beetle=makeMon(377,50,{iv:31}),bat=makeMon(371,50,{iv:31}),seed=makeMon(275,50,{iv:31}),drake=makeMon(63,50,{iv:31}),enemy=makeMon(19,60,{iv:31}),weak=makeMon(3,5,{iv:0});
   let b=B(weak,badger);BT=b;learn(weak,'ぶつかる');Math.random=()=>.25;await useMove(b,0,0);await useMove(b,0,0);Math.random=random;ck(b.fs.atk===1&&starterState(b,badger).training,'training once actual damage');
   newt.hp=10;const initial=newt.hp;await route3Withdraw(newt);ck(newt.hp===initial+Math.floor(maxHP(newt)/5),'regeneration');newt.hp=0;ck(!await route3Withdraw(newt)&&newt.hp===0,'no faint regen');newt.hp=maxHP(newt);
   const weakMove=learn(beetle,'かみつきあご'),strong=MOVES[moveId('むれあたり')];ck(route3WeakPower(beetle,weakMove)===1.3&&route3WeakPower(beetle,strong)===1,'weak move power');b=B(beetle,enemy);const enhanced=calcDamage(b,0,weakMove,false,1,100),orig=route3WeakPower;route3WeakPower=()=>1;const old=calcDamage(b,0,weakMove,false,1,100);route3WeakPower=orig;ck(enhanced>old,'hard horn actual damage');
   b=B(weak,bat);BT=b;const fast=learn(weak,'せんこうづき'),hp=bat.hp;ck(fast.prio>0,'priority fixture');Math.random=()=>.25;await useMove(b,0,0);Math.random=random;ck(bat.hp===hp&&combatEffect(fast,bat)===0,'priority immunity');learn(weak,'ぶつかる');await useMove(b,0,0);ck(bat.hp<hp,'ordinary attacks hit');
   b=B(weak,seed);BT=b;await boost(b,1,'def',-1,1);ck(b.fs.def===-1&&route3RootAvailable(b,seed),'self drop does not consume');await boost(b,1,'atk',-1,0);ck(b.fs.atk===0&&!route3RootAvailable(b,seed),'opponent drop blocked');await boost(b,1,'atk',-1,0);ck(b.fs.atk===-1,'next drop allowed');
   b=B(weak,drake);BT=b;const water=learn(weak,'こづき');Math.random=()=>.25;await useMove(b,0,0);Math.random=random;ck(starterState(b,drake).rockReady,'super effective actual hit');const rock=learn(drake,'こいしなげ');ck(route3DamagePower(b,drake,rock)===1.3,'rock ready');Math.random=()=>.25;await useMove(b,1,0);Math.random=random;ck(b.r3LastBoost&&!starterState(b,drake).rockReady&&route3DamagePower(b,drake,rock)===1,'boost consumed');await route3AfterHit(b,0,water,2,1);ck(!starterState(b,drake).rockReady,'no second trigger');
   // Real double-switch path restores outgoing HP and retains once-per-battle flags across pairs.
   S.party=[newt,seed,beetle];newt.hp=1;const D=doubleState({trainer:{name:'QA',team:[enemy,badger]}});BT=D;const s=D.slots[0][0];await doubleExecute(D,{kind:'switch',slot:s,i:2});ck(newt.hp===1+Math.floor(maxHP(newt)/5)&&D.slots[0][0].mon===beetle,'double actual withdraw');const pair=doublePair(D,D.slots[0][1],D.slots[1][0]);await boost(pair,0,'def',-1,1);ck(D.slots[0][1].st.def===0,'double root ward');await boost(doublePair(D,D.slots[0][1],D.slots[1][1]),0,'def',-1,1);ck(D.slots[0][1].st.def===-1,'shared battle flag');
   const evo=makeMon(241,26);evo.mv=[];S.party=[evo];BT=null;G.scene='world';await evolveMon(evo);ck(evo.sp===242&&evo.mv.some(x=>MOVES[x.id].name==='どくしぶき'),'actual evolution');
   // Actual field trigger calls the production twin handler, test the two-owner battle options.
   S.party=[makeMon(19,75),makeMon(21,75)];G.fade=0;loadMap(ROUTE3_KEY,24,7,1);const realBattle=battle;let called=0;battle=async o=>{called++;ck(o.double&&o.multi.length===2&&o.ownerByIndex.join(',')==='0,1','twin options');return'win';};onStep();await new Promise(r=>setTimeout(r,30));ck(called===1&&G.objs.filter(o=>o.route3Pair).every(o=>o.beaten),'actual twin encounter');ck(saveGame(),'save twin');loadMap(ROUTE3_KEY,24,7,1);ck(G.objs.filter(o=>o.route3Pair).every(o=>o.beaten),'persisted twin');battle=realBattle;
   // Actual world traversal: south route encounter path invokes approved species, north does not.
   let encountered=null;const oldWild=doWild;doWild=async (w,opt)=>{encountered=w;};const grass=Array.from(m.t).findIndex((v,i)=>v===T.TALL&&Math.floor(i/32)>=22&&!occupied(m,i%32,Math.floor(i/32)));loadMap(ROUTE3_KEY,grass%32,Math.floor(grass/32),1);Math.random=()=>0;onStep();await new Promise(r=>setTimeout(r,30));Math.random=random;ck(encountered&&ids.includes(encountered.sp),'real grass encounter');doWild=oldWild;
   // Actual capture through normal battle processing, no other art substituted.
   S.bag.fuda=3;chooseAction=async()=>({t:'seal',id:'fuda'});Math.random=()=>0;const cap=await doWild({sp:11,lv:8},{});Math.random=random;ck(cap==='caught'&&S.caught[11]&&S.party.some(m=>m.sp===11),'capture');
   // Actual transition to both adjacent cells.
   loadMap(ROUTE3_KEY,31,15,1);await edgeMove(1);ck(G.map.id==='2,0','city exit');loadMap(ROUTE3_KEY,0,15,3);await edgeMove(3);ck(G.map.id==='0,0','plain exit');
   loadMap(ROUTE3_KEY,15,25,1);const ally=makeMon(36,30),foe=makeMon(63,48);S.party=[ally,makeMon(241,10)];G.scene='battle';BT={o:{wild:foe},wild:true,foes:[foe],pi:0,fi:0,ps:newStg(),fs:newStg(),env:battleEnv({}),hpShow:[ally.hp,foe.hp],fx:{foeX:0,meX:0,foeA:1,meA:1,foeY:0,meY:0},weather:null,wall:[[0,0],[0,0]]};fxClear();render();ck(battleArtSource(foe,false,64).view==='front'&&battleArtSource(ally,true,96).view==='reflected','HD assets');
   return{counts,trainers:6,twin:true,independentPaths:2,grassTiles:Array.from(m.t).filter(x=>x===T.TALL).length,northReach:north.size,southReach:south.size,fronts,reflected,motions,abilities:6,capture:true,evolution:true};
  });
  fs.mkdirSync('test-results/route3',{recursive:true});await page.locator('canvas').first().screenshot({path:'test-results/route3/'+engine+'-battle.png'});
  for(const [label,x,y] of [['fork',3,15],['trainer',15,7],['twins',24,7],['grass',15,25],['join',28,15]]){await page.evaluate(({x,y})=>{BT=null;G.scene='world';G.hour=12;G.fade=0;loadMap(ROUTE3_KEY,x,y,1);G.banner=null;render();},{x,y});await page.locator('canvas').first().screenshot({path:'test-results/route3/'+engine+'-'+label+'.png'});}
  assert.deepEqual(errors,[]);assert.equal(data.fronts,13);assert.equal(data.motions,416);results.push({engine,...data});await browser.close();browser=null;
 }
 report('route3',results);
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
