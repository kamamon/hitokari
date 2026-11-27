'use strict';
// Produces an optional installable runtime pack with paths matching the game registry.
// Ordinary front, reflected front (at draw time), and original rear where available.
const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{serve}=require('../tests/qa-server.cjs');
const args=process.argv.slice(2),idsArg=args.find(a=>a.startsWith('--ids=')),out=path.resolve((args.find(a=>a.startsWith('--out='))||'--out=anima-runtime-pack').slice(6)),all=args.includes('--all');
const ids=all?Array.from({length:1212},(_,i)=>i+1):idsArg?idsArg.slice(6).split(',').map(Number):[1,2,3,4,5,1201,1202,1203,1204,1205,1206,1207,1208,1209,1210,1211,1212];
if(!ids.length||new Set(ids).size!==ids.length||ids.some(i=>!Number.isInteger(i)||i<1||i>1212))throw Error('invalid ids');
const clips=['idle','walk','run','attack','pounce','dash','cast','beam','hit','celebrate'],size=80,frames=6,cell=size+2*Math.ceil(size*.105),registry={version:7,frames,size,clips,species:{}},report={...registry,species:[],files:0,bytes:0};
(async()=>{const server=await serve();let browser;try{
 browser=await chromium.launch({headless:true});const page=await browser.newPage();await page.goto(server.url);await page.waitForFunction(()=>typeof buildAnimaRuntimeAtlas==='function'&&UI.length>0);
 fs.mkdirSync(path.join(out,'mon/motion-v7/baked'),{recursive:true});fs.mkdirSync(path.join(out,'data'),{recursive:true});
 for(const id of ids){
  const hasBack=await page.evaluate(id=>!!MONBACK[SP[id].book],id),entry={},rec={id,views:[]};
  for(const back of hasBack?[false,true]:[false]){
   const result=await page.evaluate(async({id,back,frames,size,clips})=>{const atlas=await buildAnimaRuntimeAtlas(id,{back,frames,size,clips,yield:false});return{url:atlas.toDataURL('image/webp',.9),width:atlas.width,height:atlas.height};},{id,back,frames,size,clips});
   if(result.width!==frames*cell||result.height!==clips.length*cell)throw Error('geometry '+id);
   const ext=result.url.startsWith('data:image/webp;')?'webp':'png',file='mon/motion-v7/baked/'+String(id).padStart(4,'0')+(back?'-rear':'-front')+'.'+ext,buf=Buffer.from(result.url.split(',')[1],'base64');if(buf.length<200)throw Error('empty '+id);
   fs.writeFileSync(path.join(out,file),buf);entry[back?'back':'front']=file;rec.views.push({view:back?'rear':'front',file,bytes:buf.length,sha256:crypto.createHash('sha256').update(buf).digest('hex')});report.files++;report.bytes+=buf.length;
  }registry.species[id]=entry;report.species.push(rec);
  if(report.species.length%100===0)console.log(report.species.length+'/'+ids.length);
 }
 fs.writeFileSync(path.join(out,'data/anima-baked-manifest.js'),"'use strict';\nconst ANIMA_BAKED_MANIFEST="+JSON.stringify(registry)+";\n");
 fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(report,null,2));console.log('Runtime atlas pack: '+report.files+' sheets, '+report.bytes+' bytes, '+report.species.length+' species');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
