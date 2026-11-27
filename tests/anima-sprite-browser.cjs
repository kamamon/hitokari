'use strict';
const {chromium,webkit,devices}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),{serve,report}=require('./qa-server.cjs');
(async()=>{const server=await serve();const results=[];let browser;
 try{for(const [name,engine] of [['chromium',chromium],['webkit',webkit]]){
  browser=await engine.launch({headless:true});const context=await browser.newContext(name==='webkit'?{...devices['iPhone 13'],viewport:{width:390,height:844}}:{viewport:{width:960,height:720}});const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(server.url);await page.waitForFunction(()=>typeof AnimaSpriteEngine!=='undefined'&&typeof animaMotionLab==='function'&&UI.length>0);
  const result=await page.evaluate(async()=>{
   const ck=(v,m)=>{if(!v)throw Error(m);};S=newSave('動作検証');Object.assign(S,homeSpot());S.party=[makeMon(STARTERS[0],50),makeMon(STARTERS[1],50)];S.starter=STARTERS[0];S.flags.dex=1;S.opts.snd=0;S.opts.music=0;startFromSave();
   const ids=Array.from({length:10},(_,p)=>ANIMA_RIG_DATA.find(r=>r[1]===p)[0]),stats=[];
   for(const id of ids){const c=await waitAnimaArtwork(id,false),rig=animaRig(id);for(const clip of AnimaSpriteEngine.clips){
    const first=AnimaSpriteEngine.getFrame(c,rig,clip,0,{size:80,steps:8,budget:4*1048576}),second=AnimaSpriteEngine.getFrame(c,rig,clip,.43,{size:80,steps:8,budget:4*1048576}),repeat=AnimaSpriteEngine.getFrame(c,rig,clip,.43,{size:80,steps:8,budget:4*1048576});ck(first&&second&&repeat===second,'cache');
    const g=second.c.getContext('2d'),p=g.getImageData(0,0,second.c.width,second.c.height).data;let alpha=0;for(let i=3;i<p.length;i+=4)if(p[i]>32)alpha++;ck(alpha>25,'visible frame '+id+' '+clip);ck(p[3]===0,'transparent margin');stats.push(alpha);
   }}
   const id=ids[0],sheet=await buildAnimaSheet(id,{size:96,cell:128,frames:8});ck(sheet.width===1024&&sheet.height===4096,'full sheet geometry');const url=sheet.toDataURL('image/png');ck(url.length>5000&&url.startsWith('data:image/png;base64,'),'export');
   const c=await waitAnimaArtwork(ids[2],false),r=animaRig(ids[2]),a=AnimaSpriteEngine.getFrame(c,r,'cast',.25,{size:96}),b=AnimaSpriteEngine.getFrame(c,r,'cast',.55,{size:96});ck(a.c.toDataURL()!==b.c.toDataURL(),'wing geometry changes');
   const img=await Promise.all(['type-energy','contact','emotions'].map(name=>new Promise((res,rej)=>{const i=new Image();i.onload=()=>res([i.naturalWidth,i.naturalHeight]);i.onerror=rej;i.src='mon/motion-v6/'+name+'.svg';})));ck(img[0][1]===1088&&img[1][1]===640&&img[2][1]===384,'atlas dimensions');
   const atlas=await buildAnimaRuntimeAtlas(ids[0],{size:80,frames:6,clips:['idle','run','bite','dash'],yield:false});ck(atlas.width===588&&atlas.height===392,'runtime atlas geometry');const blob=atlas.toDataURL('image/png');const entry=ANIMA_BAKED_MANIFEST;entry.clips=['idle','run','bite','dash'];entry.frames=6;entry.size=80;entry.species[String(ids[0])]={front:blob};const probe={sp:ids[0],shiny:false},pose={clip:'run',t:.5,still:false};animaBakedFrame(probe,pose,false,null);await ANIMA_ATLAS_CACHE.get(blob).decode();const baked=animaBakedFrame(probe,pose,false,null);ck(baked&&baked.rect[2]===98,'baked frame read');ck(animaBakedFrame(probe,pose,true,null).flip===true,'mirrored front');ck(!animaBakedFrame({...probe,shiny:true},pose,false,null),'shiny dynamic');delete entry.species[String(ids[0])];entry.clips=[];ANIMA_ATLAS_CACHE.clear();
   const kinds=new Set(MOVES.map(v=>animaMoveClip({sp:ids[0]},v)));ck(kinds.size>=6,'move motion variety');ck(animaMoveClip({sp:ids[0]},{name:'かみつく',pow:50,phys:true,has:()=>false})==='bite','bite choreography');
   const trail=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res([i.naturalWidth,i.naturalHeight]);i.onerror=rej;i.src='mon/motion-v7/action-trails.svg';});ck(trail[0]===768&&trail[1]===896,'trail atlas');
   const preview={sp:ids[2],shiny:false,st:null,previewClip:'wingstrike',previewStart:G.t-17};animaLabDraw(preview,false);ck(AnimaSpriteEngine.info().bytes<=12*1048576,'cache bound');
   window.qaLab={preview,draw(){animaLabDraw(preview,false);},key(){}};UI.push(window.qaLab);
   return{speciesRepresentatives:ids,renderedClips:stats.length,fullSheet:[sheet.width,sheet.height],cache:AnimaSpriteEngine.info(),sheet:url,atlas:img,trail,kinds:[...kinds],runtimeAtlas:[atlas.width,atlas.height]};
  });
  fs.mkdirSync('test-results/anima-motion',{recursive:true});fs.writeFileSync('test-results/anima-motion/'+name+'-sample.png',Buffer.from(result.sheet.split(',')[1],'base64'));delete result.sheet;
  await page.waitForTimeout(250);await page.screenshot({path:'test-results/anima-motion/'+name+'-lab.png'});assert.deepEqual(errors,[]);
  results.push({engine:name,...result});await browser.close();browser=null;
 }report('anima-sprite',results);
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
