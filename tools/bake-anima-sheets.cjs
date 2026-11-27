'use strict';
// Offline asset production. Full output is deliberately not eagerly loaded by the game.
const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path'),{serve}=require('../tests/qa-server.cjs');
const args=process.argv.slice(2),idsArg=args.find(a=>a.startsWith('--ids=')),compact=args.includes('--compact'),back=args.includes('--back'),all=args.includes('--all'),out=path.resolve((args.find(a=>a.startsWith('--out='))||'--out=anima-sheets').slice(6));
const ids=all?Array.from({length:1212},(_,i)=>i+1):idsArg?idsArg.slice(6).split(',').map(Number):[1,2,3,4,5,6,1201,1202,1203,1204,1205,1206,1207,1208,1209,1210,1211,1212];
if(ids.some(i=>!Number.isInteger(i)||i<1||i>1212))throw Error('invalid species ID');
const clipList=compact?['idle','walk','attack','cast','hit','celebrate']:null,frames=compact?4:8,cell=compact?96:160,size=compact?72:144;
(async()=>{const server=await serve();let browser;try{
 browser=await chromium.launch({headless:true});const page=await browser.newPage();await page.goto(server.url);await page.waitForFunction(()=>typeof buildAnimaSheet==='function'&&UI.length>0);fs.mkdirSync(out,{recursive:true});
 const manifest={version:6,frames,cell,clips:[],species:[]};
 for(const id of ids){
  const result=await page.evaluate(async({id,back,frames,cell,size,clipList})=>{const clips=clipList||AnimaSpriteEngine.clips;const sheet=await buildAnimaSheet(id,{back,frames,cell,size,clips,yield:false});const data=sheet.toDataURL('image/webp',.88);const trueBack=!!(back&&MONBACK[SP[id].book]);return{name:SP[id].name,clips,data,trueBack};},{id,back,frames,cell,size,clipList});
  const ext=result.data.startsWith('data:image/webp;')?'webp':'png',file=String(id).padStart(4,'0')+(back?'-reverse':'-front')+'.'+ext;fs.writeFileSync(path.join(out,file),Buffer.from(result.data.split(',')[1],'base64'));manifest.clips=result.clips;manifest.species.push({id,name:result.name,file,view:back?(result.trueBack?'back-art':'mirrored'):'front'});
  if(manifest.species.length%50===0)console.log(manifest.species.length+'/'+ids.length);
 }
 fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2));console.log('Baked '+manifest.species.length+' real raster sheets into '+out);
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
