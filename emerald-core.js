'use strict';
// Original system helpers. No DOM dependencies; shared with Node tests.
const createHitokariUpgrade = function coreFactory(){
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const int=(n,d=0)=>Number.isFinite(n)?Math.floor(n):d;
  const record=o=>!!o&&typeof o==="object"&&!Array.isArray(o);
  function bond(m,delta=0){m.bond=clamp(int(m.bond,70)+delta,0,255);return m.bond;}
  function progress(s){
    if(!record(s.upgrade))s.upgrade={};
    const p=s.upgrade;
    for(const k of ["rematches","hidden"])if(!record(p[k]))p[k]={};
    for(const k of ["wins","captures","losses","best","streak","clears"])p[k]=Math.max(0,int(p[k]));
    return p;
  }
  function rematchReady(s,key,steps=256){const p=progress(s),r=p.rematches[key];return Math.max(0,int(s.steps))-Math.max(0,int(r&&r.step))>=steps;}
  function noteMatch(s,key,rematch=false){const p=progress(s),r=p.rematches[key];p.rematches[key]={step:Math.max(0,int(s.steps)),wins:Math.max(0,int(r&&r.wins))+(rematch?1:0)};return p.rematches[key];}
  function rematchLevel(original,strongest,wins,cap=90){return clamp(Math.max(original+4+Math.min(5,wins)*2,Math.min(original+18,strongest-2)),2,cap);}
  function encounterChance(rate,ability){return clamp((ability===14?1.35:ability===1?0.65:1)/Math.max(1,rate),0,1);}
  function repelBlocks(remaining,level,lead){return remaining>0&&Number.isFinite(lead)&&level<lead;}
  function habitatWeight(types,phase,ability){let w=1;if(phase===3&&(types.includes(13)||types.includes(15)))w*=1.6;if((phase===0||phase===1)&&(types.includes(4)||types.includes(9)))w*=1.25;if(ability===3&&types.includes(3))w*=1.7;if(ability===9&&types.includes(2))w*=1.7;return w;}
  function validSave(s,validSpecies,validMove,maxParty=6){
    if(!record(s)||typeof s.name!=="string"||typeof s.map!=="string"||!s.map||!Number.isInteger(s.x)||!Number.isInteger(s.y)||s.x<0||s.y<0||s.x>255||s.y>255||!Number.isInteger(s.dir)||s.dir<0||s.dir>3||!Array.isArray(s.party)||s.party.length>maxParty||!record(s.bag)||!record(s.flags)||!record(s.badges)||!record(s.seen)||!record(s.caught)||!record(s.visited)||!Number.isFinite(s.money)||s.money<0||s.party.length===0&&s.starter)return false;
    if(s.box!==undefined&&!Array.isArray(s.box))return false;
    return [...s.party,...(s.box||[])].every(m=>record(m)&&validSpecies(m.sp)&&Number.isInteger(m.lv)&&m.lv>=1&&m.lv<=100&&Number.isFinite(m.exp)&&m.exp>=0&&Number.isFinite(m.hp)&&m.hp>=0&&Number.isInteger(m.nat)&&m.nat>=0&&m.nat<25&&Array.isArray(m.iv)&&m.iv.length===6&&m.iv.every(n=>Number.isInteger(n)&&n>=0&&n<=31)&&Array.isArray(m.ev)&&m.ev.length===6&&m.ev.every(n=>Number.isInteger(n)&&n>=0&&n<=255)&&Array.isArray(m.mv)&&m.mv.length<=4&&m.mv.every(v=>record(v)&&validMove(v.id)&&Number.isInteger(v.pp)&&v.pp>=0));
  }
  function damageScore(damage,hp,accuracy,priority,fast){if(damage<=0||hp<=0)return 0;const hit=clamp(accuracy,0,1);return hit*(Math.min(1,damage/hp)*100+(damage>=hp?45:0)+(priority>0&&!fast?12:0));}
  function facilityResult(s,won){const p=progress(s);p.streak=won?p.streak+1:0;p.best=Math.max(p.best,p.streak);if(won)p.clears++;return p;}
  return {bond,progress,rematchReady,noteMatch,rematchLevel,encounterChance,repelBlocks,habitatWeight,validSave,damageScore,facilityResult};
};
const createNurseryUpgrade = function nurseryCore(){
 const EGG_READY=256,EGG_HATCH=512;
 function tickNursery(n,ok){for(const p of n.parents)p.steps=Math.min(20000,p.steps+1);if(n.egg){if(n.egg.held)n.egg.walk=Math.min(EGG_HATCH,n.egg.walk+1);}else if(ok&&n.parents.length===2)n.pairSteps=Math.min(EGG_READY,n.pairSteps+1);return n;}
 function inheritIV(a,b,rand=Math.random){const v=Array.from({length:6},()=>Math.floor(rand()*32)),slots=[0,1,2,3,4,5];for(let i=0;i<3;i++){const k=slots.splice(Math.floor(rand()*slots.length),1)[0];v[k]=(rand()<0.5?a:b)[k];}return v;}
 function earlyEvolution(m,base,rule,phase){if(!base)return false;if(m.lv>=base)return true;if(!rule||m.lv<Math.max(2,base-rule.early))return false;return (rule.bond===undefined||(Number.isFinite(m.bond)?m.bond:70)>=rule.bond)&&(rule.phase===undefined||rule.phase===phase);}
 return{EGG_READY,EGG_HATCH,tickNursery,inheritIV,earlyEvolution};
};
const HitokariUpgrade = Object.assign(createHitokariUpgrade(),createNurseryUpgrade());
if(typeof module==='object'&&module.exports)module.exports=HitokariUpgrade;
