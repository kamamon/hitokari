'use strict';
const {chromium,webkit,devices}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{serve,report}=require('./qa-server.cjs');
(async()=>{const server=await serve();let browser;const results=[];
 try{for(const [engine,api] of [['chromium',chromium],['webkit',webkit]]){
  browser=await api.launch({headless:true});const mobile=engine==='webkit',page=await browser.newPage(mobile?{...devices['iPhone 13'],viewport:{width:390,height:844}}:{viewport:{width:960,height:720}});
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.goto(server.url);await page.waitForFunction(()=>typeof chooseStarter==='function'&&UI.length>0);
  const lab=await page.evaluate(async()=>{
    S=newSave('選択QA');Object.assign(S,homeSpot());S.opts.snd=0;S.opts.music=0;S.flags.prof=1;startFromSave();UI.length=0;G.busy=false;G.fade=0;G.scene='world';
    const c=WORLD.main[0],b=townBuildings(c).find(b=>b.kind==='lab');loadMap(c.key+':b'+b.slot,5,6,0);
    await Promise.all(STARTERS.map(id=>waitAnimaArtwork(id,false)));
    const m=G.map;G.banner=null;
    // Isolate the choice event from story dialogue; use the real selection widget and event.
    msg=async()=>{};battle=async()=> 'win';saveGame();render();
    return{desk:m.starterDesk,balls:G.objs.filter(o=>o.k==='starter').map(o=>[o.i,o.x,o.y]),solid:[4,5,6].map(x=>!passable(x,5)),sides:[passable(3,5),passable(7,5)],approach:[4,5,6].map(x=>passable(x,6))};
  });
  assert.deepEqual(lab.desk,{x:4,y:5,count:3});assert.deepEqual(lab.balls,[[0,4,5],[1,5,5],[2,6,5]]);assert.ok(lab.solid.every(Boolean));assert.ok(lab.sides.every(Boolean));assert.ok(lab.approach.every(Boolean));
  const out='test-results/starter-selection';fs.mkdirSync(out,{recursive:true});
  const canvas=page.locator('canvas').first();
  const shot=async name=>{await page.evaluate(()=>render());await canvas.screenshot({path:path.join(out,engine+'-'+name+'.png')});};
  const state=()=>page.evaluate(()=>{const w=UI.at(-1);return{type:w?.type,i:w?.i,confirm:w?.confirm,yes:w?.yes,starter:S.starter,party:S.party.length,balls:G.objs.filter(o=>o.k==='starter').length,busy:G.busy};});
  const wait=async(fn)=>{await page.waitForFunction(fn);};
  const tap=async(x,y)=>{const b=await canvas.boundingBox(),px=b.x+x*b.width/240,py=b.y+y*b.height/208;if(mobile)await page.touchscreen.tap(px,py);else await page.mouse.click(px,py);};
  const key=async k=>{await page.keyboard.press(k);};
  const open=async(x)=>{await page.evaluate(x=>{G.pl.x=x;G.pl.y=6;G.pl.dir=0;interact();},x);await wait(()=>UI.at(-1)?.type==='starter-select');};
  await shot('lab');
  // Every tabletop position opens the matching choice; cancelling keeps all three objects.
  for(let i=0;i<3;i++){await open(4+i);assert.equal((await state()).i,i);await tap(55,191);await wait(()=>!G.busy);assert.equal((await state()).starter,0);assert.equal((await state()).balls,3);}
  await open(5);assert.equal((await state()).i,1);
  await tap(44,40);assert.equal((await state()).i,0);await shot('fire');
  await tap(120,40);assert.equal((await state()).i,1);await shot('water');
  await tap(196,40);assert.equal((await state()).i,2);await shot('grass');
  await tap(175,191);assert.equal((await state()).confirm,true);await shot('confirm');
  await tap(55,191);assert.equal((await state()).confirm,false);assert.equal((await state()).i,2);assert.equal((await state()).starter,0);
  // Keyboard navigation, negative confirmation, and landscape pointer coordinates.
  await key('ArrowRight');await wait(()=>UI.at(-1)?.i===0);await key('Enter');await wait(()=>UI.at(-1)?.confirm);await key('ArrowLeft');await wait(()=>UI.at(-1)?.yes===false);await key('Enter');await wait(()=>UI.at(-1)?.confirm===false);
  if(mobile){await page.setViewportSize({width:844,height:390});await wait(()=>window.innerWidth>window.innerHeight);await page.evaluate(()=>resize());await shot('landscape');}
  await tap(120,40);assert.equal((await state()).i,1);await tap(175,191);assert.equal((await state()).confirm,true);await tap(175,191);await wait(()=>!G.busy&&S.starter===3);
  const final=await state();assert.equal(final.party,1);assert.equal(final.balls,0);assert.equal(final.starter,3);
  const save=await page.evaluate(()=>({rival:S.rivalStarter,valid:isValidGameSave(S),starter:loadSave().starter,dex:!!S.flags.dex}));assert.deepEqual(save,{rival:1,valid:true,starter:3,dex:true});await shot('lab-after');
  assert.deepEqual(errors,[]);results.push({engine,desk:lab.desk,threeApproaches:true,keyboard:true,touch:mobile,cancel:true,negativeConfirmation:true,chosen:3,remainingCapsules:0,save:true});
  await browser.close();browser=null;
 }report('starter-selection-ui',results);
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
