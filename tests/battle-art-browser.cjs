'use strict';
const {chromium,webkit,devices}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),{serve,report}=require('./qa-server.cjs');
(async()=>{const server=await serve(),results=[];let browser;try{
 for(const [name,api] of [['chromium',chromium],['webkit',webkit]]){
  browser=await api.launch({headless:true});const page=await browser.newPage(name==='webkit'?{...devices['iPhone 13'],viewport:{width:390,height:844}}:{viewport:{width:960,height:720},deviceScaleFactor:2});
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.goto(server.url);await page.waitForFunction(()=>typeof battleArtInfo==='function'&&UI.length>0);
  const result=await page.evaluate(async()=>{
   const ck=(v,m)=>{if(!v)throw Error(m);};S=newSave('高精細QA');Object.assign(S,homeSpot());S.party=[makeMon(21,50),makeMon(19,50),makeMon(17,50)];S.starter=3;S.flags.dex=1;S.opts.music=0;S.opts.snd=0;S.opts.gfxQuality='auto';startFromSave();G.busy=true;UI.length=0;
   await Promise.all([1,2,3,17,19,21].map(id=>waitAnimaArtwork(id,false)));await waitAnimaArtwork(21,true);
   const worldK=K;G.scene='battle';syncBattleResolution();const battleK=K;ck(battleK>=worldK,'battle DPR');
   const front=makeMon(19,50),rear=S.party[0],f=battleArtSource(front,false,96),b=battleArtSource(rear,true,96),mirror=battleArtSource(front,true,96),shiny=battleArtSource({...rear,shiny:true},true,96);
   ck(f.n>=Math.min(512,96*K)&&f.n>animaRenderSettings(96).size,'native target');ck(b.view==='rear'&&mirror.view==='reflected'&&shiny.canvas!==b.canvas,'view and shiny');
   ck(f===battleArtSource(front,false,96),'source cache');ck(f.sourceWidth>100&&b.sourceHeight>100,'native artwork');
   // Use a real animation pose, assert a high resolution mesh frame and alpha geometry.
   front.previewClip='slash';front.previewStart=G.t-12;const p=resolveIndividualMotion(front,null),frame=battleArtFrame(f,p,false);ck(frame&&frame.n>=Math.min(320,f.n),'HD motion frame');
   const out=document.createElement('canvas');out.width=out.height=frame.c.width;const g=out.getContext('2d');g.drawImage(frame.c,0,0);const a=g.getImageData(0,0,out.width,out.height).data;let visible=0;for(let i=3;i<a.length;i+=4)if(a[i]>32)visible++;ck(visible>100&&a[3]===0,'alpha');
   const gpuBackend=battleArtInfo().backend;delete front.previewClip;
   // Even without WebGL, use sharp originals or high-density CPU frames.
   G.t++;const cpu=battleArtFrame(f,p,false,true);ck(cpu&&cpu.n>=Math.min(320,f.n),'CPU fallback HD');ck(AnimaSpriteEngine.info().hdBytes<=24*1048576,'CPU cache bound');
   const pix=(c)=>c.getContext('2d').getImageData(0,0,c.width,c.height).data;
   // Pixel test: an image with narrow alternating detail must retain more contrast in HD.
   const test=document.createElement('canvas');test.width=test.height=384;const tg=test.getContext('2d');for(let x=12;x<372;x+=4){tg.fillStyle=(x/4)%2?'#fff':'#141414';tg.fillRect(x,12,4,360);}
   const old=document.createElement('canvas');old.width=old.height=128;old.getContext('2d').drawImage(test,0,0,128,128);
   const blown=document.createElement('canvas');blown.width=blown.height=384;blown.getContext('2d').drawImage(old,0,0,384,384);
   function energy(c){const p=pix(c),w=c.width;let n=0;for(let x=20;x<360;x++)n+=Math.abs(p[(100*w+x)*4]-p[(100*w+x-1)*4]);return n;}
   const oldEdge=energy(blown),hdEdge=energy(test);ck(hdEdge>oldEdge*1.1,'detail preserved');
   // Use the actual single and double render paths. No low-res baked atlas access for battle.
   const saved=animaBakedFrame;animaBakedFrame=()=>{throw Error('battle must not use compact atlas');};
   const B={o:{trainer:{name:'QA'}},wild:false,foes:[front],fi:0,pi:0,ps:newStg(),fs:newStg(),env:battleEnv({}),hpShow:[rear.hp,front.hp],fx:{foeX:0,meX:0,foeA:1,meA:1,foeY:0,meY:0},weather:null,wall:[[0,0],[0,0]]};BT=B;fxClear();render();
   const first=battleArtInfo();ck(first.lastSize>=Math.min(512,96*K),'single high resolution');window.qaSingle=B;
   const D=doubleState({trainer:{name:'QA',team:[makeMon(2,40),makeMon(1,40)]}});window.qaDouble=D;BT=D;render();ck(battleArtInfo().lastSize>=Math.min(512,49*K),'double high resolution');
   animaBakedFrame=saved;BT=B;render();
   return{worldK,battleK,frontPixels:[f.sourceWidth,f.sourceHeight],rearPixels:[b.sourceWidth,b.sourceHeight],frameSize:frame.n,cpuSize:cpu.n,backend:gpuBackend,detailRatio:hdEdge/oldEdge,stats:battleArtInfo()};
  });
  fs.mkdirSync('test-results/battle-art',{recursive:true});await page.locator('canvas').first().screenshot({path:'test-results/battle-art/'+name+'-single.png'});
  await page.evaluate(()=>{BT=window.qaDouble;render();});await page.locator('canvas').first().screenshot({path:'test-results/battle-art/'+name+'-double.png'});
  // Timed real render with multiple moving battle actors. Record, rather than assume physical phone speed.
  const perf=await page.evaluate(async()=>{const samples=[];for(let i=0;i<40;i++){await new Promise(requestAnimationFrame);const t=performance.now();G.t++;render();samples.push(performance.now()-t);}samples.sort((a,b)=>a-b);return{p50:samples[20],p95:samples[37],stats:battleArtInfo()};});
  await page.evaluate(()=>{BT=null;G.scene='world';render();});assert.equal(await page.evaluate(()=>K),result.worldK);assert.deepEqual(errors,[]);results.push({engine:name,...result,perf});await browser.close();browser=null;
 }
 report('battle-art',results);
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
