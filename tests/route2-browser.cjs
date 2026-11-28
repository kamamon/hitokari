'use strict';
const {chromium,webkit,devices}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),{serve,report}=require('./qa-server.cjs');
(async()=>{const server=await serve(),results=[];let browser;try{
 for(const [engine,api] of [['chromium',chromium],['webkit',webkit]]){
  browser=await api.launch({headless:true});const page=await browser.newPage(engine==='webkit'?{...devices['iPhone 13'],viewport:{width:390,height:844}}:{viewport:{width:960,height:720}});const errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.goto(server.url);await page.waitForFunction(()=>typeof route2Roll==='function'&&typeof battleArtInfo==='function'&&UI.length>0);
  const data=await page.evaluate(async()=>{
   const ck=(v,m)=>{if(!v)throw Error(m);},eq=(a,b,m)=>ck(JSON.stringify(a)===JSON.stringify(b),m+' '+JSON.stringify(a));
   eq(STARTERS,[2,3,1],'starters preserved');ck(N_SPECIES===1212&&new Set(FAMS.flatMap(f=>f.ids)).size===1212,'dex preserved');ck(ROUTE2_IDS.size===18&&ROUTE1_IDS.size===12,'approved counts');
   S=newSave('第2街道QA');Object.assign(S,homeSpot());S.party=[makeMon(19,60,{iv:31}),makeMon(21,60,{iv:31})];S.starter=2;S.flags.dex=1;S.opts.music=0;S.opts.snd=0;startFromSave();G.busy=true;UI.length=0;G.fade=0;
   const c=CELLS['0,1'];loadMap(c.key,15,15,0);const m=G.map;ck(m.cell===c&&m.route2Meadow.tall>m.route2Meadow.oldTall*2&&m.route2Meadow.flowers>0,'expanded meadow');
   eq(c.land,ROUTE2_LINES.map(f=>SP[f.ids[0]].fam),'land table');ck(c.rare===null,'no extra species');
   const q=[[15,0]],seen=new Set(['15,0']);while(q.length){const [x,y]=q.shift();for(let d=0;d<4;d++){const nx=x+DX[d],ny=y+DY[d],k=nx+','+ny;if(nx<0||ny<0||nx>=m.W||ny>=m.H||seen.has(k)||SOLID[m.t[ny*m.W+nx]]||m.t[ny*m.W+nx]===T.WATER||occupied(m,nx,ny))continue;seen.add(k);q.push([nx,ny]);}}
   ck(seen.has('15,31')||seen.has('16,31'),'connected exits');
   const ids=ROUTE2_LINES.map(f=>f.ids[0]),counts=ids.map(()=>0),random=Math.random;
   for(let i=0;i<100;i++){Math.random=()=>(i+.25)/100;const w=wildPick(c,'land',0);counts[ids.indexOf(w.sp)]++;ck(w.lv>=5&&w.lv<=9,'level range');}Math.random=random;
   eq(counts,[25,20,15,13,10,8,6,3],'real encounter weights');Math.random=()=>.99999;const partner=wildEncounterPartner(c,'land',0,0,S.party[0],{sp:711,lv:5},true);Math.random=random;ck(partner&&partner.sp===1179,'wild double actual roster');
   let fronts=0,backs=0,reflected=0,motions=0;
   for(const f of ROUTE2_LINES)for(let i=0;i<f.ids.length;i++){
    const id=f.ids[i],sp=SP[id];eq(sp.name,f.names[i],'name');eq(sp.types,f.types[i],'types');eq(sp.base,f.base[i],'stats');eq([sp.prev,sp.next,sp.evoLv],[f.ids[i-1]||0,f.ids[i+1]||0,f.levels[i]||0],'evolution links');eq(abilityOptions(sp),[f.ability],'ability');
    ck(motionProfile(id)[1]===sp.name&&motionProfile(id)[2]===f.plans[i]&&animaRig(id)[15]===f.ids.length,'rig');
    if(sp.next){ck(!canEvolve(makeMon(id,sp.evoLv-1)),'before evolution');ck(canEvolve(makeMon(id,sp.evoLv)),'at evolution');}
    const front=await waitAnimaArtwork(id,false),back=await waitAnimaArtwork(id,true);ck(front.width===MS&&monPic(sp.book).img.src.includes('/mon/route2/'),'front actual art');fronts++;
    const alpha=front.getContext('2d').getImageData(0,0,front.width,front.height).data;let ink=0;for(let k=3;k<alpha.length;k+=4)if(alpha[k]>32)ink++;ck(ink>100&&ink<front.width*front.height*.9,'visible transparent art '+id);
    if(ROUTE2_REAR_IDS.has(id)){ck(back._animaView==='rear'&&pic(monAssetPath(id,true)).st===1,'real rear');backs++;}else{ck(!MONBACK[id]&&back._animaView!=='rear','no stale rear');reflected++;}
    for(const clip of AnimaSpriteEngine.clips){const frame=AnimaSpriteEngine.getFrame(front,animaRig(id),clip,.43,{size:80,steps:8,budget:4*1048576});ck(frame&&frame.c.width>80,'frame '+id+' '+clip);motions++;}
   }
   eq(ROUTE2_LINES.map(f=>SP[f.ids.at(-1)].bst),[450,465,480,500,475,490,470,500],'final stats');
   for(const id of [713,518,225,983,285,1181])ck(SP[id].forms===1&&!SP[id].next&&!ROUTE2_IDS.has(id),'provisional retained');
   // Real move execution with presentation delays removed.
   const events=[];msg=async t=>{events.push(t);};sleep=async()=>{};tween=async(ms,f)=>{f(1);};fadeTo=async v=>{G.fade=v;};moveFx=async()=>{};hitAnim=async()=>{};faintAnim=async()=>{};confirmYN=async()=>true;menu=async items=>Math.max(0,items.findIndex(x=>!x.dis));
   const B=(u,t,weather=null)=>({pairMons:[u,t],ps:newStg(),fs:newStg(),weather,wall:[[0,0],[0,0]],hpShow:[u.hp,t.hp],fx:{},o:{facility:true},parts:new Set(),coins:0,wT:5,turnN:0});
   const learn=(u,n)=>{const id=moveId(n);u.mv=[{id,pp:20}];return MOVES[id];};
   const rabbit=makeMon(712,50,{iv:31,nat:0}),tanuki=makeMon(516,40),hopper=makeMon(252,30,{iv:31}),sheep=makeMon(948,50,{iv:31}),mole=makeMon(223,40),snake=makeMon(981,5),flower=makeMon(283,50),fungus=makeMon(1179,50),enemy=makeMon(3,50,{iv:31,nat:0}),weak=makeMon(3,5,{iv:0,nat:0});
   let b=B(rabbit,enemy);const speed=effStat(b,0,5);b.weather='sun';ck(effStat(b,0,5)===Math.floor(speed*1.5)&&route2Speed(rabbit,'rain')===1,'sun speed');ck(combatStat(rabbit,b.ps,5,'sun')===effStat(b,0,5),'AI sunny speed');
   b=B(tanuki,enemy);BT=b;await entryAbility(b,0);ck(b.fs.acc===-1,'entry accuracy');b=B(tanuki,mole);BT=b;await entryAbility(b,0);ck(b.fs.acc===0,'mole prevents accuracy drop');await boost(b,1,'def',-1);ck(b.fs.def===-1,'other stages unaffected');
   const kick=learn(hopper,'しゅんそくけり'),other=MOVES[moveId('ぶつかる')];ck(route2PowerScale(hopper,kick)===1.2&&route2PowerScale(hopper,other)===1,'kick multiplier only');b=B(hopper,enemy);const d1=calcDamage(b,0,kick,false,1,100);const no=route2PowerScale;route2PowerScale=()=>1;const d0=calcDamage(b,0,kick,false,1,100);route2PowerScale=no;ck(d1>d0,'power affects actual damage');
   b=B(weak,sheep);BT=b;const spark=learn(weak,'ぱちぱち');sheep.hp=Math.floor(maxHP(sheep)/2);const hp=sheep.hp;Math.random=()=>.2;await useMove(b,0,0);Math.random=random;ck(sheep.hp===hp+Math.floor(maxHP(sheep)/4)&&combatEffect(spark,sheep)===0,'electric absorb and AI');
   sheep.hp=Math.floor(maxHP(sheep)/2);const hp2=sheep.hp;learn(weak,'しびれなみ');Math.random=()=>.1;await useMove(b,0,0);Math.random=random;ck(sheep.hp===hp2+Math.floor(maxHP(sheep)/4)&&!sheep.st,'electric status absorbed');
   b=B(snake,enemy);BT=b;learn(snake,'ぶつかる');enemy.st=null;Math.random=()=>.05;await useMove(b,0,0);Math.random=random;ck(enemy.st==='psn','venom contact');
   b=B(weak,flower);BT=b;learn(weak,'ぶつかる');weak.st=null;Math.random=()=>.05;await useMove(b,0,0);Math.random=random;ck(b.ps.spe===-1,'cotton contact');
   b=B(weak,fungus);BT=b;learn(weak,'かみつきあご');weak.st=null;Math.random=()=>.05;await useMove(b,0,0);Math.random=random;ck(weak.st==='slp','sleep contact');weak.st=null;
   ck(route2Contact(other)&&!route2Contact(MOVES[moveId('つぶてあめ')]),'contact vs ranged');await route2ContactEffects(b,0,MOVES[moveId('すなげり')],10);ck(!weak.st,'ranged not contact');
   // Two enemies receive the entry debuff, excluding the accuracy-immune mole.
   S.party=[tanuki,rabbit];const D=doubleState({trainer:{name:'QA',team:[enemy,mole]}});BT=D;await doubleEnter(D,D.slots[0][0]);ck(D.slots[1][0].st.acc===-1&&D.slots[1][1].st.acc===0,'double entry');
   // Real evolution and signature-type acquisition on the transition.
   const evo=makeMon(250,15);evo.mv=[];S.party=[evo];BT=null;G.scene='world';await evolveMon(evo);ck(evo.sp===251&&evo.mv.some(v=>MOVES[v.id].name==='しゅんそくけり'),'actual evolution');
   // Capture an actual encounter using the real battle engine and save, with deterministic QA randomness.
   S.party=[makeMon(19,60,{iv:31}),makeMon(21,60,{iv:31})];S.bag.fuda=3;G.scene='world';BT=null;G.fade=0;chooseAction=async()=>({t:'seal',id:'fuda'});Math.random=()=>0;const captured=await doWild({sp:711,lv:5},{});Math.random=random;ck(captured==='caught'&&S.caught[711]&&S.party.some(m=>m.sp===711),'actual capture');
   // Render the expanded field and HD single battle using the production paths.
   S.party=[makeMon(712,25),makeMon(19,50)];BT=null;G.scene='world';loadMap(c.key,15,15,0);G.banner=null;render();window.route2Field=G.map.id;
   const ally=S.party[0],foe=makeMon(1179,7);G.scene='battle';const view={o:{wild:foe},wild:true,foes:[foe],pi:0,fi:0,ps:newStg(),fs:newStg(),env:battleEnv({}),hpShow:[ally.hp,foe.hp],fx:{foeX:0,meX:0,foeA:1,meA:1,foeY:0,meY:0},weather:null,wall:[[0,0],[0,0]]};BT=view;fxClear();render();
   ck(battleArtSource(foe,false,64).view==='front'&&battleArtSource(ally,true,96).view==='rear','HD asset');
   return{counts,fronts,backs,reflected,motions,meadow:m.route2Meadow,connected:true,abilities:8,double:true,evolution:true,capture:true};
  });
  fs.mkdirSync('test-results/route2',{recursive:true});await page.locator('canvas').first().screenshot({path:'test-results/route2/'+engine+'-battle.png'});await page.evaluate(()=>{BT=null;G.scene='world';render();});await page.locator('canvas').first().screenshot({path:'test-results/route2/'+engine+'-meadow.png'});
  assert.deepEqual(errors,[]);assert.deepEqual(data.counts,[25,20,15,13,10,8,6,3]);assert.equal(data.fronts,18);assert.equal(data.backs,4);assert.equal(data.motions,576);results.push({engine,...data});await browser.close();browser=null;
 }
 report('route2',results);
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
