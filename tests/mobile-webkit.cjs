'use strict';
const {webkit,devices}=require('playwright'),assert=require('node:assert/strict'),{serve,report}=require('./qa-server.cjs');
(async()=>{const server=await serve();let browser;try{
 browser=await webkit.launch({headless:true});const device=devices['iPhone 13'];const context=await browser.newContext({...device,viewport:{width:390,height:844},deviceScaleFactor:3,hasTouch:true,isMobile:true});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.goto(server.url);await page.waitForFunction(()=>typeof mobilePerformanceSnapshot==='function'&&UI.length>0);
 const initial=await page.evaluate(()=>{S=newSave('WebKit');Object.assign(S,homeSpot());S.party=[makeMon(STARTERS[0],60),makeMon(STARTERS[1],60)];S.starter=STARTERS[0];S.flags.dex=1;S.opts.music=0;S.opts.snd=0;S.opts.gfxQuality='auto';S.flags.champ=1;startFromSave();G.busy=false;G.hour=12;loadMap(expId('life',WORLD.gymTown[1]),15,29,0);resize();return mobilePerformanceSnapshot();});
 assert.ok(initial.touch);assert.ok(initial.K<=3);
 // Direct touch on the canvas selects the second list row, independent of A button.
 await page.evaluate(()=>{window.qaTap=-99;menu(['first','second'],{x:45,y:55,w:150}).then(v=>window.qaTap=v);});
 const cv=await page.locator('#cv').boundingBox();await page.touchscreen.tap(cv.x+cv.width*100/240,cv.y+cv.height*81/208);await page.waitForFunction(()=>window.qaTap===1);
 // Real Playwright touch tap on menu button, then B to close.
 await page.locator('#bM').tap();await page.waitForFunction(()=>UI.some(w=>w.type==='menu'));await page.locator('#bB').tap();await page.waitForFunction(()=>!UI.length&&!G.busy);
 // Pointer press and cancellation release the virtual controller.
 await page.evaluate(()=>{const el=document.getElementById('dpad'),r=el.getBoundingClientRect();el.dispatchEvent(new PointerEvent('pointerdown',{pointerId:7,pointerType:'touch',clientX:r.left+r.width*.9,clientY:r.top+r.height*.5,bubbles:true}));el.dispatchEvent(new PointerEvent('pointercancel',{pointerId:7,pointerType:'touch',bubbles:true}));if(Object.values(held).some(Boolean))throw Error('stuck input');});
 await page.waitForTimeout(3000);const portrait=await page.evaluate(()=>mobilePerformanceSnapshot());assert.ok(portrait.samples>15);assert.equal(portrait.errors,0);
 await page.screenshot({path:'test-results/webkit-portrait.png'}).catch(()=>{});await page.setViewportSize({width:844,height:390});await page.waitForTimeout(1000);assert.ok(await page.locator('body').evaluate(el=>el.classList.contains('land')));
 const geometry=await page.evaluate(()=>{const c=cv.getBoundingClientRect(),d=document.getElementById('dpad').getBoundingClientRect(),a=document.getElementById('bA').getBoundingClientRect();return{canvas:[c.left,c.right],pad:[d.left,d.right],a:[a.left,a.right],disjoint:d.right<=c.left+2&&a.left>=c.right-2};});assert.ok(geometry.disjoint,JSON.stringify(geometry));
 await page.waitForTimeout(3000);const landscape=await page.evaluate(()=>mobilePerformanceSnapshot());assert.equal(landscape.errors,0);assert.ok(landscape.samples>15);
 await page.evaluate(()=>{S.opts.gfxQuality='low';resize();if(K!==2)throw Error('low resolution');S.opts.gfxQuality='auto';resize();});assert.deepEqual(errors,[]);
 report('mobile-webkit',{engine:'Playwright WebKit on Linux, iPhone 13 profile; NOT physical iPhone',portrait,landscape,geometry,touchMenu:true,buttons:true,pointerCancel:true,lowQuality:true});await page.screenshot({path:'test-results/webkit-landscape.png'});
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});