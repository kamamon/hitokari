'use strict';
// Real device diagnostics are collected only on the device running this code.
const MOBILE_QA={render:[],interval:[],errors:0,adaptive:0,window:0,streak:0,lastAdjust:0,started:performance.now()};
function isTouchDevice(){return (typeof matchMedia==='function'&&matchMedia('(pointer:coarse)').matches)||navigator.maxTouchPoints>0;}
function mobileViewport(){const v=window.visualViewport;return{w:Math.round(v?v.width:window.innerWidth),h:Math.round(v?v.height:window.innerHeight)};}
function mobileQualityMode(){return S&&S.opts&&S.opts.gfxQuality||'auto';}
function mobileQualityLabel(){return ({auto:'自動',low:'軽量',high:'高精細'})[mobileQualityMode()]||'自動';}
function mobileResolution(scale){
 const q=mobileQualityMode(),touch=isTouchDevice(),battle=G.scene==='battle',max=q==='low'?2:battle?(q==='high'?6:touch?5:6):q==='high'?touch?4:6:touch?(MOBILE_QA.adaptive?2:3):MOBILE_QA.adaptive?3:5;
 return clamp(Math.ceil(scale*Math.min(3,window.devicePixelRatio||1)-.02),2,max);
}
function mobileMotionBands(){const q=mobileQualityMode();return q==='low'||q==='auto'&&MOBILE_QA.adaptive?5:isTouchDevice()?8:12;}
function mobileCacheLimit(k){const small=isTouchDevice()||mobileQualityMode()==='low';return ({monster:small?80:160,portrait:small?72:160,chibi:small?80:160,monsterCanvas:small?28:48})[k]||64;}
function trimIndividualCaches(){
 const trim=(map,max)=>{if(map.size<=max)return;for(const [k,v] of map){if(map.size<=max)break;if(v.st===0||v.pin>0)continue;map.delete(k);}};
 trim(MON_PIC,mobileCacheLimit('monster'));trim(CHR_PIC,mobileCacheLimit('portrait'));
}
function mobileFrameSample(render,interval){
 if(document.hidden)return;const a=MOBILE_QA;a.render.push(render);if(a.render.length>240)a.render.shift();if(interval>0&&interval<250){a.interval.push(interval);if(a.interval.length>240)a.interval.shift();}
 if(mobileQualityMode()!=='auto'||++a.window<180||a.render.length<120)return;a.window=0;
 const p=mobilePerformanceSnapshot();if(p.renderP95>25||p.intervalP95>40)a.streak++;else a.streak=0;
 if(!a.adaptive&&a.streak>=2&&performance.now()-a.lastAdjust>6000&&G.scene==='world'&&!G.busy){a.adaptive=1;a.lastAdjust=performance.now();resize();}
}
function mobileFrameError(e){MOBILE_QA.errors++;}
function mobilePercentile(a,p){if(!a.length)return 0;const v=a.slice().sort((a,b)=>a-b);return Math.round(v[Math.min(v.length-1,Math.floor(v.length*p))]*10)/10;}
function mobilePerformanceSnapshot(){const a=MOBILE_QA,mean=a.interval.length?a.interval.reduce((n,x)=>n+x,0)/a.interval.length:0;return{samples:a.render.length,renderP50:mobilePercentile(a.render,.5),renderP95:mobilePercentile(a.render,.95),intervalP95:mobilePercentile(a.interval,.95),fps:mean?Math.round(1000/mean):0,errors:a.errors,K,mode:mobileQualityMode(),adaptive:a.adaptive,touch:!!isTouchDevice(),monsterCache:MON_PIC.size,portraitCache:CHR_PIC.size,canvasCache:MONCACHE.size,viewport:mobileViewport(),anima:typeof AnimaSpriteEngine!=='undefined'?AnimaSpriteEngine.info():null,battleArt:typeof battleArtInfo==='function'?battleArtInfo():null};}
async function mobileDiagnostics(){const d=mobilePerformanceSnapshot();await msg('動作診断（この 端末の 実測）\n描画 '+d.renderP50+'ms / 95% '+d.renderP95+'ms\nフレーム '+d.fps+'fps　倍率 '+d.K+'x');await msg('描画エラー '+d.errors+'回\n画像 '+d.monsterCache+'／人物 '+d.portraitCache+'\n測定 '+d.samples+'フレーム');if(d.anima)await msg('動きの 素材 キャッシュ\n'+d.anima.frames+'枚　'+(d.anima.bytes/1048576).toFixed(1)+'MB\n生成 '+d.anima.builds+'回');}
