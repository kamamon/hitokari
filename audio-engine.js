'use strict';
const createSoraneAudio=function musicFactory(){
  // Original short motifs, written specifically for Sorane. Notes are intervals in semitones.
  const tracks={
    title:{tempo:104,roots:[60,57,65,67],motif:[0,4,7,11,7,null,4,2,0,2,4,7,9,null,7,4],type:'triangle'},
    'harusaki-day':{tempo:98,roots:[60,65,57,67],motif:[7,9,12,9,7,4,2,null,4,7,9,7,5,4,2,0],type:'triangle'},
    'harusaki-night':{tempo:66,roots:[60,57,65,67],motif:[12,null,9,7,null,4,7,null,9,null,7,4,2,null,4,null],type:'sine'},
    'tribel-day':{tempo:110,roots:[62,67,59,57],motif:[0,4,7,9,11,9,7,4,2,4,7,12,11,9,7,null],type:'triangle'},
    'tribel-night':{tempo:72,roots:[57,60,65,67],motif:[7,null,12,9,7,null,4,2,0,null,4,7,9,null,7,2],type:'sine'},
    town:{tempo:92,roots:[55,60,57,62],motif:[7,null,9,7,4,2,0,null,4,7,9,12,9,7,4,null],type:'sine'},
    road:{tempo:124,roots:[62,55,59,57],motif:[0,2,7,9,7,4,2,null,4,7,11,9,7,4,2,0],type:'triangle'},
    cave:{tempo:76,roots:[57,53,60,55],motif:[0,null,7,null,3,2,null,null,0,null,10,7,null,3,2,null],minor:true,type:'sine'},
    sea:{tempo:112,roots:[60,67,57,65],motif:[0,7,12,7,9,7,4,2,4,9,12,14,12,9,7,null],type:'triangle'},
    indoor:{tempo:84,roots:[60,55,57,65],motif:[4,7,null,4,2,0,2,null,4,null,7,9,7,4,2,null],type:'sine'},
    wild:{tempo:152,roots:[57,60,53,55],motif:[0,0,7,3,0,7,10,7,3,7,12,10,7,3,5,7],minor:true,type:'square',drums:true},
    trainer:{tempo:144,roots:[59,55,57,54],motif:[0,7,0,3,7,10,12,7,10,7,3,0,2,3,7,10],minor:true,type:'triangle',drums:true},
    boss:{tempo:138,roots:[55,51,53,50],motif:[0,7,12,10,7,3,7,0,3,10,14,12,10,7,2,3],minor:true,type:'square',drums:true},
    victory:{tempo:120,roots:[60,67,65,60],motif:[0,4,7,12,11,9,7,null,7,9,12,16,14,12,7,null],type:'triangle'}
  };
  function notes(cue,step){
    const m=tracks[cue]||tracks.road,i=step%64,root=m.roots[Math.floor(i/16)],v=m.motif[i%16],out=[];
    if(v!==null)out.push({midi:root+12+v,type:m.type,vol:m.type==='square'?0.014:0.035,len:0.74});
    if(i%2===0)out.push({midi:root+[0,m.minor?3:4,7,12][(i>>1)%4],type:'triangle',vol:0.019,len:1.35});
    if(i%4===0)out.push({midi:root-12+(i%8===4?7:0),type:'sine',vol:0.055,len:2.5});
    if(m.drums&&i%4===0)out.push({midi:i%8===0?34:43,type:'sine',vol:0.027,len:0.38,drum:true});
    return{duration:60/m.tempo/2,notes:out};
  }
  function create(ac){
    let current=null,master=null,next=0,index=0,volume=-1;
    function stop(){if(!master)return;const old=master,t=ac.currentTime;try{old.gain.cancelScheduledValues(t);old.gain.setTargetAtTime(0,t,0.035);setTimeout(()=>{try{old.disconnect();}catch(_){}},250);}catch(_){}master=null;current=null;}
    function tick(cue,vol=0.4,enabled=true){
      if(!enabled||!cue||ac.state!=='running'){stop();return;}
      const t=ac.currentTime;
      if(current!==cue||!master){stop();master=ac.createGain();master.gain.value=0;master.connect(ac.destination);current=cue;next=t+0.035;index=0;volume=-1;}
      const gain=Math.max(0,Math.min(1,vol));
      if(volume!==gain){master.gain.setTargetAtTime(gain,t,0.035);volume=gain;}
      if(next<t-0.1)next=t+0.025;
      for(let limit=0;next<t+0.16&&limit<4;limit++){
        const data=notes(cue,index++);
        for(const n of data.notes){
          const o=ac.createOscillator(),g=ac.createGain(),end=next+data.duration*n.len;
          o.type=n.type;const hz=440*2**((n.midi-69)/12);o.frequency.setValueAtTime(hz,next);if(n.drum)o.frequency.exponentialRampToValueAtTime(Math.max(20,hz/2),end);
          g.gain.setValueAtTime(0.0001,next);g.gain.linearRampToValueAtTime(n.vol,next+0.009);g.gain.exponentialRampToValueAtTime(0.0001,end);o.connect(g);g.connect(master);o.onended=()=>{o.disconnect();g.disconnect();};o.start(next);o.stop(end+0.012);
        }
        next+=data.duration;
      }
    }
    return{tick,stop};
  }
  function naturalWeather(m,hash){if(!m||m.indoor||!m.cell||m.cell.kind==='town'||m.cell.prog<4)return null;const p=m.pal,r=hash%10;if((p==='swamp'||p==='coast')&&r<4)return'rain';if(p==='desert'&&r<4)return'sand';if(p==='snow'&&r<4)return'hail';if(p==='volcano'&&r<4)return'sun';return null;}
  return{tracks,notes,create,naturalWeather};
};
const SoraneAudio=createSoraneAudio();
if(typeof module==='object'&&module.exports)module.exports=SoraneAudio;
