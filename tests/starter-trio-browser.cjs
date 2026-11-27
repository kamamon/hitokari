'use strict';
const {chromium,webkit,devices}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),{serve,report}=require('./qa-server.cjs');
(async()=>{const server=await serve();let browser;const results=[];
 try{for(const [engine,api] of [['chromium',chromium],['webkit',webkit]]){
  browser=await api.launch({headless:true});const page=await browser.newPage(engine==='webkit'?{...devices['iPhone 13'],viewport:{width:390,height:844}}:{viewport:{width:960,height:720}});const errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.goto(server.url);await page.waitForFunction(()=>typeof starterResearchMenu==='function'&&typeof buildAnimaRuntimeAtlas==='function'&&UI.length>0);
  const data=await page.evaluate(async()=>{
   const ck=(v,m)=>{if(!v)throw Error(m);},equal=(a,b,m)=>ck(JSON.stringify(a)===JSON.stringify(b),m+' '+JSON.stringify(a));
   equal(STARTERS,[2,3,1],'starter IDs');equal(STARTER_TRIO.map(f=>f.choice),['C','A','A'],'adopted options');ck(N_SPECIES===1212&&FAMS.filter(f=>f.starter).length===3&&MOVES.length===495,'counts');
   S=newSave('御三家QA');Object.assign(S,homeSpot());S.opts.snd=0;S.opts.music=0;S.flags.prof=1;S.flags.dex=1;startFromSave();G.busy=true;
   const home=WORLD.main[0],b=townBuildings(home).find(b=>b.kind==='lab'),lab=getMap(home.key+':b'+b.slot);equal(lab.objs.filter(o=>o.k==='starter').map(o=>[o.i,o.x,o.y]),[[0,4,5],[1,5,5],[2,6,5]],'lab three');
   let fronts=0,backs=0;
   for(const f of STARTER_TRIO){for(let i=0;i<3;i++){const id=f.ids[i],sp=SP[id];equal(sp.name,f.name[i],'name');equal(sp.types,i?[f.type,f.secondary]:[f.type],'type');ck(sp.bst===[318,410,535][i]&&sp.evoLv===[16,36,0][i],'stats evolution');ck(famOf(sp).ids.join(',')===f.ids.join(','),'family');equal(abilityOptions(sp),i===2?[f.ability,f.special]:[f.ability],'ability choices');ck(makeMon(id,50).ability===f.ability,'default ability');ck(motionProfile(id)[1]===sp.name&&motionProfile(id)[2]===f.plans[i]&&animaRig(id)[2]===f.type,'motion rig');
     const art=await waitAnimaArtwork(id,false);ck(art.width===MS&&monPic(id).img.src.includes('/mon/starter-v2/'),'actual art path');const pix=art.getContext('2d').getImageData(0,0,MS,MS).data;let alpha=0;for(let k=3;k<pix.length;k+=4)if(pix[k]>50)alpha++;ck(alpha>500&&alpha<MS*MS*.9,'art alpha '+id);fronts++;
     if(f.key!=='fire'){const rear=await waitAnimaArtwork(id,true);ck(rear._animaView==='rear'&&pic(monAssetPath(id,true)).st===1,'true back');backs++;}else ck(!MONBACK[id],'no stale fire rear');
     const atlas=await buildAnimaRuntimeAtlas(id,{size:80,frames:4,clips:['idle','walk','wingstrike','cast','hit'],yield:false});ck(atlas.width===392&&atlas.height===490,'motion atlas');
    }
    S.starter=f.ids[0];S.rivalStarter=starterRivalId(S.starter);const r=STARTER_TRIO.find(t=>t.ids[0]===S.rivalStarter);ck(typeEff(r.type,[f.type])===2,'rival type advantage');for(let i=1;i<=7;i++)ck(famOf(SP[rivalTeam(i).at(-1).sp]).ids[0]===S.rivalStarter,'fixed rival '+i);
    const base=makeMon(f.ids[0],5,{iv:31});ck(base.mv.some(v=>MOVES[v.id].type===f.type&&MOVES[v.id].pow===40),'starter initial attack');const mid=makeMon(f.ids[1],36,{iv:31});ck(!mid.mv.some(v=>MOVES[v.id].name===f.signature),'signature final only');const final=makeMon(f.ids[2],36,{iv:31});ck(final.mv.some(v=>MOVES[v.id].name===f.signature),'signature learned');
    base.hp=Math.floor(maxHP(base)/3);ck(starterPinch(base,f.type)&&!starterPinch(base,f.secondary),'pinch primary only');
   }
   // real UI render at 3 choices
   loadMap(lab.id,5,8,0);for(let i=0;i<3;i++)drawStarterTrio(i);
   const ui=pushBG(()=>drawStarterTrio(0));window.starterQAUI=ui;await new Promise(r=>setTimeout(r,70));popW(ui);
   // Real battle resolution with presentation waits stubbed, same engine as normal battles.
   msg=async()=>{};sleep=async()=>{};tween=async(ms,f)=>{f(1);};moveFx=async()=>{};hitAnim=async()=>{};faintAnim=async()=>{};fadeTo=async v=>{G.fade=v;};confirmYN=async()=>true;menu=async items=>Math.max(0,items.findIndex(x=>!x.dis));
   const setMove=(m,n)=>{const id=MOVES.find(v=>v.name===n).id;m.mv=[{id,pp:20}];};
   const fire=makeMon(19,50,{iv:31,ability:22}),water=makeMon(21,50,{iv:31,ability:23}),grass=makeMon(17,50,{iv:31,ability:24}),enemy=makeMon(6,35,{iv:31}),reserve=makeMon(4,40,{iv:31});
   S.party=[fire,water,grass];const D=doubleState({facility:true,trainer:{name:'QA',team:[enemy,reserve],money:0}});BT=D;G.scene='battle';
   // Put both ability candidates on active slots; state is on battle root, not transient stage.
   let B=doublePair(D,D.slots[1][0],D.slots[0][0]);fire.hp=Math.floor(maxHP(fire)/2)+10;const prev=fire.hp;fire.hp-=20;await starterAfterDamage(B,1,prev,20,false);ck(D.slots[0][0].st.spe===1&&starterState(D,fire).ember,'ember triggers');
   fire.hp=prev-20;await starterAfterDamage(B,1,prev,20,false);ck(D.slots[0][0].st.spe===1,'ember once');const B2=doublePair(D,D.slots[1][0],D.slots[0][0]);ck(starterState(B2,fire).ember,'persistent across pairs');
   B=doublePair(D,D.slots[1][0],D.slots[0][1]);setMove(enemy,'みずはじき');const mv=MOVES[enemy.mv[0].id],eff=typeEff(mv.type,SP[water.sp].types);let protectedDamage=calcDamage(B,1,mv,false,eff,100);water.ability=20;let normal=calcDamage(B,1,mv,false,eff,100);water.ability=23;ck(protectedDamage<=normal&&protectedDamage>=Math.floor(normal*.75)-1,'mirror formula');await useMove(B,1,0);ck(starterState(D,water).mirror,'mirror real attack');ck(calcDamage(B,1,mv,false,eff,100)===normal,'mirror once');
   // Test root only after an actual successful status move, then real residual processing.
   D.slots[0][0]=doubleSlot(0,0,2,grass);grass.hp=Math.floor(maxHP(grass)/2);const hp=grass.hp;setMove(grass,'きをねる');B=doublePair(D,D.slots[0][0],D.slots[1][0]);await useMove(B,0,0);ck(starterState(D,grass).rootTurn===D.turnN,'deep root successful');await doubleResidual(D);ck(grass.hp===hp+Math.max(1,Math.floor(maxHP(grass)/16)),'deep root recovery');const nextHP=grass.hp;await doubleResidual(D);ck(grass.hp===nextHP,'root once');
   BT=null;G.scene='world';UI.length=0;G.fade=0;
   // Actual starter event, including level 5 and dex unlock, for each choice. Stub battle presentation only.
   chooseStarter=async i=>i;
   battle=async o=>{ck(o.trainer.team.length===1&&famOf(SP[o.trainer.team[0].sp]).ids[0]===S.rivalStarter,'real event rival');return'win';};
   let choices=0;for(let i=0;i<3;i++){S=newSave('QA');Object.assign(S,homeSpot());S.opts.snd=0;S.opts.music=0;startFromSave();loadMap(lab.id,5,8,0);await profTalk();await starterTalk({i});ck(S.starter===STARTERS[i]&&S.party[0].sp===STARTERS[i]&&S.party[0].lv===5&&S.flags.dex,'actual select '+i);ck(saveGame(),'save choice');choices++;}
   return{choices,fronts,backs,motions:9*32,abilityChecks:6,finalBst:535,nextMap:CELLS['0,3'].name};
  });
  assert.deepEqual(errors,[]);assert.equal(data.choices,3);assert.equal(data.fronts,9);assert.equal(data.backs,6);results.push({engine,...data});await browser.close();browser=null;
 }report('starter-trio',results);
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
