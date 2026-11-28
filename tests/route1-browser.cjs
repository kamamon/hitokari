'use strict';
const {chromium,webkit,devices}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),{serve,report}=require('./qa-server.cjs');
(async()=>{const server=await serve(),results=[];let browser;try{
 for(const [name,api] of [['chromium',chromium],['webkit',webkit]]){
  browser=await api.launch({headless:true});const page=await browser.newPage(name==='webkit'?{...devices['iPhone 13'],viewport:{width:390,height:844}}:{viewport:{width:960,height:720}});const errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.goto(server.url);await page.waitForFunction(()=>typeof route1Roll==='function'&&typeof battleArtInfo==='function'&&UI.length>0);
  const result=await page.evaluate(async()=>{
   const ck=(v,m)=>{if(!v)throw Error(m);},eq=(a,b,m)=>ck(JSON.stringify(a)===JSON.stringify(b),m+' '+JSON.stringify(a));
   eq(STARTERS,[2,3,1],'original starters');ck(N_SPECIES===1212&&new Set(FAMS.flatMap(f=>f.ids)).size===1212,'all IDs preserved');
   S=newSave('第1街道QA');Object.assign(S,homeSpot());S.party=[makeMon(19,50,{iv:31}),makeMon(21,50,{iv:31})];S.starter=2;S.flags.dex=1;S.opts.music=0;S.opts.snd=0;startFromSave();G.busy=true;UI.length=0;
   const cell=CELLS['0,3'];loadMap(cell.key,15,15,0);const ec=G.map.advEnc||G.map.cell;ck(ec===cell,'actual field encounter source');eq(cell.land,ROUTE1_LINES.slice(0,4).map(f=>SP[f.ids[0]].fam),'land table');
   const ids=ROUTE1_LINES.map(f=>f.ids[0]),counts=ids.map(()=>0),actual=ids.map(()=>0),random=Math.random;
   for(let k=0;k<1000;k++){const f=route1Roll(k);counts[ids.indexOf(f.ids[0])]++;Math.random=()=>(k+.25)/1000;const w=wildPick(ec,'land',0);actual[ids.indexOf(w.sp)]++;ck(w.lv>=3&&w.lv<=5&&(!w.rare||w.lv>=4),'encounter level');}Math.random=random;
   eq(counts,[400,300,200,99,1],'exact integer weights');eq(actual,counts,'actual wildPick matches roll table');
   ck(WORLD.areas.every(c=>c===cell||(!c.land.includes(cell.rare)&&!c.water.includes(cell.rare)&&c.rare!==cell.rare)),'rare wild exclusive');
   for(let k=0;k<51;k++)ck(famCand(k,null).every(f=>!f.rareRoute1),'rare not trainers');
   const lead=S.party[0];ck(!wildEncounterPartner(ec,'land',0,0,lead,{sp:ROUTE1_RARE,lv:5},true),'rare single only');
   Math.random=()=>.99999;const partner=wildEncounterPartner(ec,'land',0,0,lead,{sp:451,lv:5},true);Math.random=random;ck(partner&&partner.sp===765&&!partner.rare,'rare excluded from second roll');
   let fronts=0,backs=0,motions=0;
   for(const f of ROUTE1_LINES){for(let i=0;i<f.ids.length;i++){const id=f.ids[i],sp=SP[id];eq(sp.name,f.names[i],'name');eq(sp.types,f.types[i],'types');eq(sp.base,f.base[i],'stats');eq([sp.prev,sp.next,sp.evoLv],[f.ids[i-1]||0,f.ids[i+1]||0,f.levels[i]||0],'evolution');eq(abilityOptions(sp),[f.ability],'ability');ck(motionProfile(id)[1]===sp.name&&motionProfile(id)[2]===f.plans[i],'motion profile');ck(animaRig(id)[2]===sp.types[0]&&animaRig(id)[15]===f.ids.length,'rig');
    if(sp.next){ck(!canEvolve(makeMon(id,sp.evoLv-1)),'before evolution');ck(canEvolve(makeMon(id,sp.evoLv)),'at evolution');}
    const front=await waitAnimaArtwork(id,false),back=await waitAnimaArtwork(id,true);ck(monPic(id).img.src.includes('/mon/route1/')&&front.width===MS,'front art');ck(back._animaView==='rear'&&pic(monAssetPath(id,true)).st===1,'rear art');fronts++;backs++;
    for(const clip of AnimaSpriteEngine.clips){const frame=AnimaSpriteEngine.getFrame(front,animaRig(id),clip,.43,{size:80,steps:8,budget:4*1048576});ck(frame&&frame.c.width>80,'frame '+id+' '+clip);motions++;}
   }}
   eq(ROUTE1_LINES.map(f=>SP[f.ids.at(-1)].bst),[415,480,440,470,510],'approved final stats');
   for(const id of [453,767,1004]){ck(SP[id].forms===1&&!SP[id].next&&!SP[id].prev&&!ROUTE1_IDS.has(id),'preserved provisional '+id);}
   const sig=moveId('せいげっこう');ck(MOVES[sig].type===10&&MOVES[sig].pow===90&&MOVES[sig].acc===100&&!MOVES[sig].phys,'signature');
   ck(!movesAt(SP[1002],50).includes(sig)&&movesAt(SP[1003],35).includes(sig),'final exclusive signature');
   const events=[];msg=async t=>{events.push(t);};sleep=async()=>{};tween=async(ms,f)=>{f(1);};fadeTo=async v=>{G.fade=v;};moveFx=async()=>{};hitAnim=async()=>{};faintAnim=async()=>{};confirmYN=async()=>true;menu=async items=>Math.max(0,items.findIndex(x=>!x.dis));
   const B=(m,t,weather=null)=>({pairMons:[m,t],ps:newStg(),fs:newStg(),weather,wall:[[0,0],[0,0]],hpShow:[m.hp,t.hp],fx:{},o:{facility:true},parts:new Set(),coins:0,wT:5,turnN:0});
   const bird=makeMon(717,30,{iv:31,nat:0}),enemy=makeMon(19,25,{iv:0,nat:0}),plain=effStat(B(bird,enemy),0,5);bird.hp--;ck(plain===Math.floor(effStat(B(bird,enemy),0,5)*1.2),'full hp speed');ck(combatStat(bird,newStg(),5)===effStat(B(bird,enemy),0,5),'AI speed');
   const shell=makeMon(765,30,{iv:31,nat:0}),move=MOVES[moveId('ぶつかる')],b=B(enemy,shell);const full=calcDamage(b,0,move,false,1,100);shell.hp--;const damaged=calcDamage(b,0,move,false,1,100);ck(full===Math.max(1,Math.floor(damaged*.75)),'shell 25%');ck(route1DamageScale(b,shell,move,1)===1,'damaged shell no buff');
   const deer=makeMon(1002,50,{iv:31,nat:0}),ward=B(enemy,deer),dark=MOVES[moveId('やみうち')];enemy.mv=[{id:dark.id,pp:20}];const eff=typeEff(dark.type,SP[deer.sp].types);ck(eff>1,'super effective');const reduced=calcDamage(ward,0,dark,false,eff,100);starterState(ward,deer).starWard=true;const normal=calcDamage(ward,0,dark,false,eff,100);ck(reduced===Math.max(1,Math.floor(normal*.7)),'ward 30%');delete starterState(ward,deer).starWard;BT=ward;Math.random=()=>.25;await useMove(ward,0,0);Math.random=random;ck(starterState(ward,deer).starWard&&deer.hp>0,'actual first hit consumes ward');ck(route1DamageScale(ward,deer,dark,eff)===1,'once per battle');
   const bug=makeMon(336,40,{iv:31,nat:0});bug.hp=Math.floor(maxHP(bug)/2);const hp=bug.hp,rain=B(bug,enemy,'rain');BT=rain;await route1RainHeal(rain,0);ck(bug.hp===hp+Math.max(1,Math.floor(maxHP(bug)/16)),'rain heal');rain.weather='sun';ck(!await route1RainHeal(rain,0),'no sun heal');
   S.party=[makeMon(451,5),makeMon(19,50),makeMon(21,50)];const old=S.bag.heal1||0;Math.random=()=>0;await route1Pickup('win',{});await route1Pickup('run',{});await route1Pickup('win',{facility:true});Math.random=random;ck(S.bag.heal1===old+1,'pickup win only');
   // Real evolution and exclusive move at the transition (presentation waits stubbed).
   const evolve=makeMon(1002,35,{iv:31});evolve.mv=[];S.party=[evolve];G.scene='world';BT=null;await evolveMon(evolve);ck(evolve.sp===1003&&evolve.mv.some(v=>v.id===sig),'real evolution signature');
   // Actual rare battle entry and successful escape, using the real battle loop.
   S.party=[makeMon(19,60,{iv:31}),makeMon(21,60,{iv:31})];S.starter=2;G.scene='world';BT=null;G.fade=0;chooseAction=async()=>({t:'run'});const r=await doWild({sp:1002,lv:5,rare:true},{wildPartner:{sp:451,lv:5}});ck(r==='run'&&S.seen[1002]&&events.some(t=>t.includes('星の光が')),'rare actual intro');
   // Use the actual HD battle renderer to display new assets; export a screenshot.
   const ally=makeMon(719,35,{iv:31}),foe=makeMon(1002,5,{iv:31});S.party=[ally];G.scene='battle';const battleView={o:{wild:foe},wild:true,foes:[foe],pi:0,fi:0,ps:newStg(),fs:newStg(),env:battleEnv({}),hpShow:[ally.hp,foe.hp],fx:{foeX:0,meX:0,foeA:1,meA:1,foeY:0,meY:0},weather:null,wall:[[0,0],[0,0]]};BT=battleView;fxClear();render();ck(battleArtSource(foe,false,64).view==='front'&&battleArtSource(ally,true,96).view==='rear','HD new art path');
   return{counts,actual,fronts,backs,motions,rareSolo:true,rareExclusive:true,abilities:5,realEvolution:true,rareIntro:true,hd:battleArtInfo()};
  });
  fs.mkdirSync('test-results/route1',{recursive:true});await page.locator('canvas').first().screenshot({path:'test-results/route1/'+name+'-rare-battle.png'});assert.deepEqual(errors,[]);assert.deepEqual(result.counts,[400,300,200,99,1]);assert.equal(result.motions,384);results.push({engine:name,...result});await browser.close();browser=null;
 }
 report('route1',results);
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
