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
const HitokariUpgrade = createHitokariUpgrade();
if(typeof module==='object'&&module.exports)module.exports=HitokariUpgrade;
