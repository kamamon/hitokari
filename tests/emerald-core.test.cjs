'use strict';
const {test}=require('node:test'), assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),h=require('../emerald-core.js');
test('main page classic script syntax',()=>{const html=fs.readFileSync('index.html','utf8');assert.match(html,/src="emerald-core.js"/);const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)];assert.ok(scripts.length>=2);for(const m of scripts)new vm.Script(m[1]);});
test('bond migration and limits',()=>{const m={};assert.equal(h.bond(m),70);assert.equal(h.bond(m,1000),255);assert.equal(h.bond(m,-1000),0);});
test('rematch threshold and record isolation',()=>{const s={steps:255};assert.equal(h.rematchReady(s,'a'),false);s.steps=256;assert.equal(h.rematchReady(s,'a'),true);h.noteMatch(s,'a');s.steps=512;assert.equal(h.rematchReady(s,'a'),true);h.noteMatch(s,'a',true);assert.equal(s.upgrade.rematches.a.wins,1);assert.equal(h.rematchReady(s,'a'),false);assert.equal(h.rematchReady(s,'b'),true);assert.equal(h.rematchLevel(80,100,10),90);});
test('repel and field weights',()=>{assert.equal(h.repelBlocks(1,4,5),true);assert.equal(h.repelBlocks(1,5,5),false);assert.equal(h.repelBlocks(0,4,5),false);assert.ok(h.encounterChance(10,1)<h.encounterChance(10,0));assert.ok(h.habitatWeight([13],3,-1)>h.habitatWeight([13],0,-1));});
test('AI values accuracy, KO and immunity',()=>{assert.equal(h.damageScore(0,10,1,3,false),0);assert.ok(h.damageScore(100,100,1,0,true)>h.damageScore(80,100,1,0,true));assert.ok(h.damageScore(90,100,0.5,0,false)<h.damageScore(75,100,1,0,false));});
test('facility streak persists record',()=>{const s={};h.facilityResult(s,true);h.facilityResult(s,true);h.facilityResult(s,false);assert.equal(s.upgrade.best,2);assert.equal(s.upgrade.streak,0);assert.equal(s.upgrade.clears,2);});
test('legacy and malformed saves',()=>{const m={sp:1,lv:5,hp:18,exp:100,nat:2,iv:[0,1,2,3,4,5],ev:[0,0,0,0,0,0],mv:[{id:0,pp:5}]};const s={v:3,name:'test',map:'home',x:1,y:2,dir:0,party:[m],box:[],money:300,bag:{},flags:{},badges:{},seen:{},caught:{},visited:{},starter:1};const v=o=>h.validSave(o,n=>n===1,n=>n===0);assert.equal(v(s),true);assert.equal(v({...s,party:Array(6).fill(m)}),true);assert.equal(v({...s,party:Array(7).fill(m)}),false);assert.equal(v({...s,party:[]}),false);assert.equal(v({...s,party:[{...m,sp:999}]}),false);assert.equal(v({...s,party:[{...m,mv:[{id:999,pp:1}]}]}),false);assert.equal(v({...s,x:-1}),false);});

test('nursery steps - compatible, uncollected, held',()=>{const n={parents:[{steps:19999},{steps:0}],pairSteps:0,egg:null};h.tickNursery(n,false);assert.equal(n.pairSteps,0);for(let i=0;i<300;i++)h.tickNursery(n,true);assert.equal(n.pairSteps,256);assert.equal(n.parents[0].steps,20000);n.egg={held:false,walk:0};h.tickNursery(n,true);assert.equal(n.egg.walk,0);n.egg.held=true;for(let i=0;i<600;i++)h.tickNursery(n,true);assert.equal(n.egg.walk,512);});
test('three independent inherited stats and evolution fallback',()=>{const r=h.inheritIV(Array(6).fill(31),Array(6).fill(31),()=>0);assert.equal(r.filter(x=>x===31).length,3);assert.equal(h.earlyEvolution({lv:20,bond:199},25,{early:5,bond:200,phase:3},3),false);assert.equal(h.earlyEvolution({lv:20,bond:200},25,{early:5,bond:200,phase:3},0),false);assert.equal(h.earlyEvolution({lv:20,bond:200},25,{early:5,bond:200,phase:3},3),true);assert.equal(h.earlyEvolution({lv:25,bond:70},25,{early:5,bond:200,phase:3},0),true);});

test('all original music cues and deterministic climate',()=>{const a=require('../audio-engine.js');assert.equal(Object.keys(a.tracks).length,21);for(const t of Object.keys(a.tracks))for(let i=0;i<64;i++){const v=a.notes(t,i);assert.ok(v.duration>0);assert.ok(v.notes.every(n=>Number.isFinite(n.midi)&&n.vol>0&&n.len>0));}assert.equal(a.naturalWeather({cell:{kind:'route',prog:5},pal:'snow'},2),'hail');assert.equal(a.naturalWeather({cell:{kind:'town',prog:5},pal:'snow'},2),null);assert.equal(a.naturalWeather({cell:{kind:'route',prog:3},pal:'snow'},2),null);assert.equal(a.naturalWeather({cell:{kind:'route',prog:10},pal:'desert'},8),null);});

test('expansion script and asset syntax',()=>{for(const p of ['advanced-combat.js','world-expansion.js','animation-enhancement.js'])new vm.Script(fs.readFileSync(p,'utf8'),{filename:p});for(const p of ['ui/expansion-icons.svg','ui/expansion-fx.svg','obj/expansion-terrain.svg'])assert.match(fs.readFileSync(p,'utf8'),/<svg[\s\S]+<\/svg>/);});

test('anima rigs: 1212 unique valid records, 32 motions, finite local deformation',()=>{
 const e=require('../anima-sprite-engine.js'),r=require('../data/anima-rigs.js');
 assert.equal(r.length,1212);assert.equal(e.clips.length,32);assert.equal(new Set(r.map(v=>JSON.stringify(v.slice(1)))).size,1212);
 assert.equal(new Set(r.map(v=>v[1])).size,10);let n=0;
 for(let i=0;i<r.length;i++){const v=r[i];assert.equal(v[0],i+1);assert.ok(v[2]>=0&&v[2]<17);
 for(const clip of e.clips){assert.ok(e.duration(v,clip)>0);
 for(const t of [0,.25,.5,.75,1]){const p=e.pose(v,clip,t);assert.ok(Object.values(p).every(Number.isFinite));assert.ok(p.sx>0&&p.sy>0);
 for(const [x,y] of [[.12,.16],[.8,.18],[.2,.85],[.82,.86],[.5,.5]]){const a=e.mesh(v,clip,t,x,y);assert.ok(a.every(z=>Number.isFinite(z)&&Math.abs(z)<.3));n++;}
 }}}assert.equal(n,969600);
});
test('animation asset files and new code syntax',()=>{for(const p of ['anima-sprite-engine.js','data/anima-rigs.js','anima-motion-lab.js'])new vm.Script(fs.readFileSync(p,'utf8'),{filename:p});for(const [p,n] of [['type-energy',136],['contact',80],['emotions',48]]){const s=fs.readFileSync('mon/motion-v6/'+p+'.svg','utf8');assert.match(s,/<svg[\s\S]+<\/svg>/);assert.equal([...s.matchAll(/<g transform="translate\(\d+ \d+\)">/g)].length,n);}});

test('v7 action atlas and runtime registry syntax',()=>{for(const p of ['anima-advanced-motion.js','data/anima-baked-manifest.js'])new vm.Script(fs.readFileSync(p,'utf8'),{filename:p});const svg=fs.readFileSync('mon/motion-v7/action-trails.svg','utf8');assert.equal([...svg.matchAll(/<g transform="translate\(\d+ \d+\)">/g)].length,168);});

test('approved starter register and real asset files',()=>{const a=JSON.parse(fs.readFileSync('data/anima-approval.json','utf8'));assert.equal(a.total,1212);assert.equal(a.approvedSpecies,83);assert.equal(a.heldSpecies,1129);assert.deepEqual(a.approved.map(f=>f.choice),['C','A','A']);assert.equal(a.next.map,'2,2');assert.equal(a.route1.land.length,5);assert.equal(a.route1.land.reduce((n,f)=>n+f.weight,0),1000);for(const f of a.route1.land)for(const id of f.ids)for(const prefix of ['','b']){const b=fs.readFileSync('mon/route1/'+prefix+String(id).padStart(4,'0')+'.webp');assert.equal(b.subarray(0,4).toString(),'RIFF');assert.equal(b.subarray(8,12).toString(),'WEBP');}for(const f of a.approved)for(const id of f.ids){const p='mon/starter-v2/'+String(id).padStart(4,'0')+'.webp';const b=fs.readFileSync(p);assert.equal(b.subarray(0,4).toString(),'RIFF');assert.equal(b.subarray(8,12).toString(),'WEBP');if(f.key!=='fire')assert.ok(fs.existsSync('mon/starter-v2/b'+String(id).padStart(4,'0')+'.webp'));}});

test('route2 adopted encounter weights and asset inventory',()=>{const a=JSON.parse(fs.readFileSync('data/anima-approval.json','utf8'));assert.equal(a.route2.land.length,8);assert.equal(a.route2.land.flatMap(f=>f.ids).length,18);assert.equal(a.route2.land.reduce((n,f)=>n+f.weight,0),100);assert.deepEqual(a.route2.land.map(f=>f.weight),[25,20,15,13,10,8,6,3]);const art=JSON.parse(fs.readFileSync('mon/route2/manifest.json','utf8'));assert.equal(art.length,22);assert.equal(art.filter(x=>x.rear).length,4);for(const x of art){const b=fs.readFileSync(x.path);assert.equal(b.subarray(0,4).toString(),'RIFF');assert.equal(b.subarray(8,12).toString(),'WEBP');assert.equal(b.length,x.size);}const vmctx=vm.createContext({});vm.runInContext(fs.readFileSync('route2-data.js','utf8')+'\nthis.counts=Array.from({length:100},(_,i)=>route2Roll(i).weight);',vmctx);assert.equal(vmctx.counts.filter(x=>x===25).length,25);assert.equal(vmctx.counts.filter(x=>x===3).length,3);});

test('tribel 8 approved families, 18 transparent WebP images and exact ecology',()=>{
 const a=JSON.parse(fs.readFileSync('data/anima-approval.json','utf8')),m=JSON.parse(fs.readFileSync('mon/tribel/manifest.json','utf8')),crypto=require('node:crypto');
 assert.equal(a.approvedSpecies,83);assert.equal(a.heldSpecies,1129);assert.equal(a.tribel.new.length,8);assert.equal(a.tribel.new.flatMap(f=>f.ids).length,18);assert.equal(a.tribel.land.length,8);
 const weights=[20,12,12,17,10,11,12,6];assert.deepEqual(a.tribel.land.map(f=>f.weight),weights);assert.equal(a.tribel.land.reduce((n,f)=>n+f.weight,0),100);
 const ids=[...a.approved,...a.route1.land,...a.route2.land,...a.tribel.new,...a.route3.land,...a.route4.land].flatMap(f=>f.ids);assert.equal(ids.length,83);assert.equal(new Set(ids).size,83);
 assert.equal(m.version,2);assert.equal(m.fronts.length,18);assert.equal(m.trueRear.length,0);assert.equal(m.rearMode,'reflected-front');assert.deepEqual(new Set(m.fronts.map(f=>f.id)),new Set(a.tribel.new.flatMap(f=>f.ids)));
 for(const f of m.fronts){const b=fs.readFileSync(f.path);assert.equal(b.subarray(0,4).toString(),'RIFF');assert.equal(b.subarray(8,12).toString(),'WEBP');assert.equal(b.length,f.size);assert.ok(f.path.startsWith('mon/tribel/v2/'));assert.equal(crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex'),f.sha);}
 const ctx=vm.createContext({clamp:(v,a,b)=>Math.max(a,Math.min(b,v))});vm.runInContext(fs.readFileSync('tribel-data.js','utf8')+'\nthis.ids=Array.from({length:100},(_,i)=>tribelRoll((i+.5)/100));this.zones=Object.keys(TRIBEL_ZONES).map(k=>[k,tribelWeights(k)]);',ctx);
 const counts=a.tribel.land.map(f=>ctx.ids.filter(x=>x===f.id).length);assert.deepEqual(counts,weights);for(const [k,weights] of ctx.zones){assert.equal(weights.length,8,k);assert.ok(weights.every(([id,w])=>a.tribel.land.some(f=>f.id===id)&&w>0),k);}
});


test('route3 approved art, six exact weights and no duplicate ids',()=>{
 const a=JSON.parse(fs.readFileSync('data/anima-approval.json','utf8')),man=JSON.parse(fs.readFileSync('mon/route3/manifest.json','utf8'));assert.equal(a.route3.land.length,6);assert.equal(a.route3.land.flatMap(f=>f.ids).length,13);assert.equal(man.length,13);assert.equal(new Set(man.map(f=>f.id)).size,13);assert.deepEqual(a.route3.land.map(f=>f.weight),[26,22,18,15,12,7]);for(const f of man){const b=fs.readFileSync(f.path);assert.equal(b.length,f.size);assert.equal(b.subarray(0,4).toString(),'RIFF');assert.equal(b.subarray(8,12).toString(),'WEBP');}
 const ctx=vm.createContext({});vm.runInContext(fs.readFileSync('route3-data.js','utf8')+'\nthis.ids=Array.from({length:100},(_,i)=>route3Roll(i).ids[0]);',ctx);assert.deepEqual([11,241,376,370,274,61].map(id=>ctx.ids.filter(x=>x===id).length),[26,22,18,15,12,7]);
});

test('Momino cafe daily JST boundary, reload, refusal after loss and scaling',()=>{
 const d=require('../momino-daily.js'),a=d.day(Date.UTC(2026,10,28,14,59,59)),b=d.day(Date.UTC(2026,10,28,15,0,0));
 assert.equal(b,a+1);assert.equal(d.dateLabel(a),'2026-11-28');assert.equal(d.dateLabel(b),'2026-11-29');assert.equal(new Set(Array.from({length:7},(_,i)=>d.guest(a+i).pid)).size,7);
 assert.equal(d.normalize(null).attempts,0);assert.equal(d.normalize(d.normalize(null)).attempts,0);
 let q=d.claim(null,a);assert.equal(q.attempts,1);assert.equal(q.result,'started');assert.equal(d.claim(JSON.parse(JSON.stringify(q)),a),null);
 q=d.finish(q,a,'lose');assert.equal(q.wins,0);assert.equal(d.available(q,a),false);assert.equal(d.available(q,a-1),false);
 q=d.claim(q,b);assert.equal(q.attempts,2);q=d.finish(q,b,'win');assert.equal(q.wins,1);assert.equal(d.finish(q,b,'win').wins,1);
 assert.equal(d.difficulty(0).count,2);assert.equal(d.difficulty(1).count,3);assert.equal(d.difficulty(10).count,4);assert.equal(d.difficulty(50).ace,65);
});

test('Route 4 exact encounter weights and approved transparent image assets',()=>{
 const a=JSON.parse(fs.readFileSync('data/anima-approval.json','utf8')),m=JSON.parse(fs.readFileSync('mon/route4/manifest.json','utf8')),hash=require('node:crypto');
 assert.equal(a.route4.land.length,6);assert.equal(a.route4.land.flatMap(f=>f.ids).length,13);assert.equal(m.length,13);
 assert.deepEqual(a.route4.land.map(f=>f.weight),[24,20,18,16,15,7]);
 for(const f of m){const b=fs.readFileSync(f.path);assert.equal(b.length,f.size);assert.equal(b.subarray(0,4).toString(),'RIFF');assert.equal(b.subarray(8,12).toString(),'WEBP');assert.equal(hash.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex'),f.sha);}
 const c=vm.createContext({});vm.runInContext(fs.readFileSync('route4-data.js','utf8')+'\nthis.counts=Object.keys(ROUTE4_ZONES).map(z=>ROUTE4_LINES.map(f=>Array.from({length:100},(_,i)=>route4Roll(i,z)).filter(r=>r===f).length));',c);
 assert.deepEqual(JSON.parse(JSON.stringify(c.counts)),[[24,20,18,16,15,7],[18,22,16,14,13,17]]);
});
