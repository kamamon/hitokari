'use strict';
// A real-calendar daily challenge. The date boundary is 00:00 JST, independent of game time.
// A single save is authoritative; a cancelled confirmation never spends an attempt.
const MomiCafe=(()=>{
 const DAY=86400000,JST=9*3600000;
 const roster=[
 {name:'ミナト',pid:109,theme:'草原の旅人',ids:[451,711,546,717]},
 {name:'サエ',pid:209,theme:'水辺の観察者',ids:[241,3,334,283]},
 {name:'コウヤ',pid:1309,theme:'拳の修行者',ids:[11,765,250,61]},
 {name:'ヒヨリ',pid:809,theme:'花と虫の研究員',ids:[190,274,250,283]},
 {name:'レンジ',pid:1109,theme:'炎と雷の使い手',ids:[1188,948,2,981]},
 {name:'ユズ',pid:609,theme:'夜の散歩好き',ids:[370,516,1179,1062]},
 {name:'セナ',pid:1509,theme:'岩場の探索者',ids:[265,376,223,61]}
 ];
 function day(now=Date.now()){return Math.floor((now+JST)/DAY);}
 function dateLabel(d){return new Date(d*DAY).toISOString().slice(0,10);}
 function guest(d){return roster[((d%roster.length)+roster.length)%roster.length];}
 function normalize(r){return r&&typeof r==='object'&&Number.isInteger(r.lastDay)?{lastDay:r.lastDay,result:['started','win','lose','aborted'].includes(r.result)?r.result:'started',attempts:Math.max(1,Math.floor(Number(r.attempts)||1)),wins:Math.max(0,Math.min(Math.floor(Number(r.wins)||0),Math.max(1,Math.floor(Number(r.attempts)||1))))}:{lastDay:-1,result:'none',attempts:0,wins:0};}
 function available(r,d=day()){return Number.isInteger(d)&&d>normalize(r).lastDay;}
 function claim(r,d=day()){const q=normalize(r);if(!available(q,d))return null;return{lastDay:d,result:'started',attempts:q.attempts+1,wins:q.wins};}
 function finish(r,d,result){const q=normalize(r);if(q.lastDay!==d||q.result!=='started')return q;return{...q,result:result==='win'?'win':result==='lose'?'lose':'aborted',wins:q.wins+(result==='win'?1:0)};}
 function difficulty(badges){const b=Math.max(0,Math.min(50,Math.floor(Number(badges)||0)));return{count:b>=10?4:b>=1?3:2,ace:Math.min(65,10+Math.floor(b*1.1)),prize:Math.min(2500,350+b*45)};}
 return {day,dateLabel,guest,normalize,available,claim,finish,difficulty,roster};
})();
if(typeof module==='object'&&module.exports)module.exports=MomiCafe;
