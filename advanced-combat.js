'use strict';
// Active slot battle adapter. Reuses the existing move/status/animation resolver for both sides.
const DOUBLE_SPREAD=new Set(['おおなみ','だいかいしょう','はなあらし','たいじゅのいかり','ひょうてんか','だいおせん','ふはいのきり','ちかくへんどう','てんぷうは','ほうせきあらし','がけくずし','だいぐんしゅう','うろこあらし','はめつのほうこう','らんきりゅう','だいせんぷう']);
const doubleTarget=m=>DOUBLE_SPREAD.has(m.name)?'spread':m.pow>0||m.eff.some(e=>e.k==='st'||e.k==='seed'||e.k==='split'||e.k==='stage'&&e.who==='foe')?'enemy':m.eff.some(e=>e.k==='heal'||e.k==='cure')?'support':'self';
function combatEffect(m,t){if(m.type<0)return 1;const ab=abilOf(t);return (m.type===8&&ab===2||m.type===2&&ab===9||m.type===3&&ab===10||m.type===1&&ab===11)?0:typeEff(m.type,SP[t.sp].types);}
function combatStat(m,st,i){let v=stat(m,i)*stgMul(st?st[STKEY[i]]||0:0);if(i===1){if(m.st&&abilOf(m)===12)v*=1.5;else if(m.st==='brn')v*=0.5;}if(i===5){if(m.st==='par')v*=0.25;v*=heldOf(m).spe||1;}return Math.max(1,Math.floor(v));}
function combatEstimate(a,t,m,as,ts,weather){const eff=combatEffect(m,t);if(!eff||m.pow===0)return 0;const fixed=m.eff.find(e=>e.k==='fixed');if(fixed)return fixed.n;if(m.has('level'))return a.lv;if(m.has('halve'))return Math.max(1,t.hp/2);
 let p=m.pow;if(m.has('pinch')&&a.hp*3<=maxHP(a))p*=2;if(m.has('hex')&&t.st)p*=2;
 let d=(Math.floor(2*a.lv/5+2)*p*combatStat(a,as,m.phys?1:3)/combatStat(t,ts,m.phys?2:4)/50+2)*eff*0.925;
 if(SP[a.sp].types.includes(m.type))d*=1.5;if(abilOf(a)===0&&SP[a.sp].types[0]===m.type&&a.hp*3<=maxHP(a))d*=1.5;
 if(abilOf(t)===8&&(m.type===1||m.type===5))d*=0.5;if(weather==='sun')d*=m.type===1?1.5:m.type===2?0.5:1;if(weather==='rain')d*=m.type===2?1.5:m.type===1?0.5:1;
 if(m.has('multi'))d*=3;if(m.has('twice'))d*=2;const held=heldOf(a);if(held.t===m.type)d*=1.15;d*=held.all||1;return Math.max(1,d);}
function combatOptions(m){const arr=m.mv.map((v,i)=>({i,m:MOVES[v.id]})).filter(v=>m.mv[v.i].pp>0);return arr.length?arr:[{i:-1,m:STRUGGLE}];}
function combatThreat(a,t,as,ts,w){return Math.max(0,...combatOptions(a).map(v=>combatEstimate(a,t,v.m,as,ts,w)*(v.m.acc||100)/100));}
function switchRating(current,opponents,candidates,weather){
 if(!opponents.length||current.st.rech||current.st.seed&&current.mon.hp<=0)return -1;
 const metrics=(mon,stage)=>{const inD=Math.max(...opponents.map(s=>combatThreat(s.mon,mon,s.st,stage,weather))),outD=Math.max(...opponents.map(s=>combatThreat(mon,s.mon,stage,s.st,weather)/Math.max(1,s.mon.hp)));return{risk:inD/Math.max(1,mon.hp),power:Math.min(2,outD)};};
 const now=metrics(current.mon,current.st);
 if(now.risk<0.7&&now.power>=0.27)return -1;
 let best=-1,score=-Infinity;
 for(const c of candidates){const q=metrics(c.mon,null);const v=(now.risk-q.risk)*1.1+(q.power-now.power)*0.8;if(q.risk<0.85&&q.risk<=now.risk*0.75&&v>0.55&&v>score){best=c.i;score=v;}}
 return best;
}
function singleEnemySwitch(B){
 if(B.wild||B.foes.length<2||!B.turnN||B.turnN-(B.lastSwitch??-10)<2||B.fs.rech)return -1;
 return switchRating({mon:B.foes[B.fi],st:B.fs},[{mon:S.party[B.pi],st:B.ps}],B.foes.map((mon,i)=>({mon,i})).filter(v=>v.i!==B.fi&&v.mon.hp>0),B.weather);
}
function doubleSlot(side,pos,i,mon){return{side,pos,i,mon,st:newStg(),hpShow:mon.hp,fx:{DX:0,DY:0,SX:0,Hide:0,A:1,Y:0},lastSwitch:-10,down:false};}
function doublePosition(s){return s.side?{x:147+s.pos*61,y:57-s.pos*9}:{x:41+s.pos*65,y:103+s.pos*7};}
function doubleActive(D,side){return D.slots[side].filter(s=>s&&s.mon.hp>0);}
function doubleReserve(D,side,used=[]){const a=side?D.foes:S.party,active=D.slots[side].filter(Boolean).map(s=>s.i);return a.map((mon,i)=>({mon,i})).filter(v=>v.mon.hp>0&&!active.includes(v.i)&&!used.includes(v.i));}
function doublePair(D,a,t){const pair=a.side?[t,a]:[a,t];D.pair=pair;const B={o:D.o,wild:false,foes:D.foes,pi:pair[0].i,fi:pair[1].i,ps:pair[0].st,fs:pair[1].st,parts:D.parts,pairMons:pair.map(s=>s.mon),pairSlots:pair,wall:D.wall,allStages:D.slots.flat().filter(Boolean).map(s=>s.st),hpShow:[],fx:{}};
 for(const key of ['weather','wT','naturalWX','coins'])Object.defineProperty(B,key,{get:()=>D[key],set:v=>D[key]=v});
 for(let i=0;i<2;i++){const s=pair[i],prefix=i?'foe':'me';Object.defineProperty(B.hpShow,i,{get:()=>s.hpShow,set:v=>s.hpShow=v,enumerable:true});for(const k of ['DX','DY','SX','Hide','A','Y'])Object.defineProperty(B.fx,prefix+k,{get:()=>s.fx[k],set:v=>s.fx[k]=v});}
 return B;
}
function doubleState(o){const D={double:true,o,wild:false,foes:o.trainer.team,env:battleEnv(o),weather:o.facility?null:fieldWeather(G.map),wT:0,wall:[[0,0],[0,0]],coins:0,parts:new Set(),result:null,turnN:0,slots:[[],[]],pair:null,focus:null};
 D.naturalWX=!!D.weather;
 for(let side=0;side<2;side++){const a=side?D.foes:S.party,ids=a.map((m,i)=>m.hp>0?i:-1).filter(i=>i>=0);for(let pos=0;pos<2;pos++){const i=ids[pos];D.slots[side][pos]=i===undefined?null:doubleSlot(side,pos,i,a[i]);if(!side&&i!==undefined)D.parts.add(i);}}
 return D;
}
async function doubleEnter(D,s){if(!s)return;if(s.side)markSeen(s.mon.sp);else D.parts.add(s.i);const q=doublePosition(s);ring(q.x,q.y+18,'230,255,255',{flat:0.35,dr:2.4,w:2});if(s.mon.shiny)sparkleFx(q.x,q.y,12);
 if(abilOf(s.mon)===1){await say(monName(s.mon)+'の 威圧！');for(const t of doubleActive(D,1-s.side))await boost(doublePair(D,s,t),1-s.side,'atk',-1);}}
async function doublePlayerAction(D,s,reserved){
 for(;;){D.focus=s;const choice=await menu(['技を 使う','交代する','前の選択へ'],{x:6,y:LH-MSG_H+2,w:228,cols:2,cancel:true,title:monName(s.mon)+' の 行動'});
 if(choice<0||choice===2)return null;
 if(choice===1){const pool=doubleReserve(D,0,reserved);if(!pool.length){await sayW('交代できる 相棒は いない。');continue;}
 const i=await menu(pool.map(v=>({label:monName(v.mon),right:'HP '+v.mon.hp+'/'+maxHP(v.mon)})),{x:8,y:36,w:224,title:'交代先'});if(i>=0)return{kind:'switch',slot:s,i:pool[i].i};continue;}
 const options=combatOptions(s.mon);
 const mi=await menu(options.map(v=>({label:v.m.name,right:(v.i<0?'PP―':'PP'+s.mon.mv[v.i].pp)+' '+(doubleTarget(v.m)==='spread'?'全体':TK[v.m.type]||'無')})),{x:3,y:LH-MSG_H+1,w:234,rows:3,cancel:true,title:'技を 選ぶ',fg:j=>{const m=options[j].m;win(4,111,232,35);tx(TKANA[m.type]||'無',11,116,'#2a2233',9);tx('威力 '+powTxt(m)+' 命中 '+(m.acc||'必中'),228,116,'#2a2233',9,'right');tx(doubleTarget(m)==='spread'?'相手2体（2体時75%）':doubleTarget(m)==='support'?'自分 または 味方':moveNote(m).slice(0,23),11,130,'#5a5560',8);}});if(mi<0)continue;
 const v=options[mi],kind=doubleTarget(v.m);let target=null;
 if(kind==='enemy'||kind==='support'){const targets=kind==='support'?doubleActive(D,0):doubleActive(D,1);if(targets.length===1)target=targets[0].pos;else{const i=await menu(targets.map(t=>({label:monName(t.mon),right:'HP '+t.mon.hp})),{x:10,y:LH-MSG_H+1,w:220,title:kind==='support'?'回復対象':'攻撃対象'});if(i<0)continue;target=targets[i].pos;}}
 return{kind:'move',slot:s,i:v.i,target,mode:kind};
 }
}
function doubleAI(D,s,reserved){
 const enemies=doubleActive(D,1-s.side);
 if(D.turnN-s.lastSwitch>=2&&D.turnN>=1){const i=switchRating(s,enemies,doubleReserve(D,s.side,reserved),D.weather);if(i>=0)return{kind:'switch',slot:s,i};}
 let best=null,bs=-Infinity;
 for(const v of combatOptions(s.mon)){const m=v.m,kind=doubleTarget(m),targets=kind==='support'?doubleActive(D,s.side):kind==='self'?[s]:kind==='spread'?[null]:enemies;
 for(const t of targets){let score=0;
 if(m.pow){const targets2=t?[t]:enemies;score=targets2.reduce((sum,z)=>sum+HitokariUpgrade.damageScore(combatEstimate(s.mon,z.mon,m,s.st,z.st,D.weather)*(targets2.length>1?0.75:1),z.mon.hp,(m.acc||100)/100,m.prio,combatStat(s.mon,s.st,5)>=combatStat(z.mon,z.st,5)),0);
 if(m.has('rech'))score*=0.7;if(m.has('boom')&&s.mon.hp>maxHP(s.mon)*0.25)score*=0.1;
 }else if(kind==='support'){const h=t.mon.hp/maxHP(t.mon);score=m.has('heal')?(h<0.4?85:h<0.7?35:0):(t.mon.st?62:0);}
 else if(kind==='self'){score=m.has('protect')?(s.st.protN?0:8):m.has('wall')?(!D.wall[s.side][m.eff.find(e=>e.k==='wall').c]?30:0):m.has('wx')?(D.weather!==m.eff.find(e=>e.k==='wx').w?18:0):m.has('rest')?(s.mon.hp<maxHP(s.mon)*0.3?70:0):m.eff.some(e=>e.k==='stage'&&e.who==='self'&&Math.abs(s.st[e.stat])<3)?24:4;}
 else score=t.mon.st?5:25;
 score*=0.96+Math.random()*0.08;if(score>bs){bs=score;best={kind:'move',slot:s,i:v.i,target:t?t.pos:null,mode:kind};}
 }}
 return best||{kind:'move',slot:s,i:-1,mode:'enemy',target:enemies[0]?.pos};
}
function doubleOrder(actions){return actions.map(a=>({a,p:a.kind==='switch'?100:(a.i<0?0:MOVES[a.slot.mon.mv[a.i].id].prio),speed:combatStat(a.slot.mon,a.slot.st,5),tie:Math.random()})).sort((a,b)=>b.p-a.p||b.speed-a.speed||a.tie-b.tie).map(x=>x.a);}
async function doubleExecute(D,a){const s=a.slot;if(!s||s.mon.hp<=0||D.slots[s.side][s.pos]!==s)return;
 if(a.kind==='switch'){const next=doubleReserve(D,s.side).find(v=>v.i===a.i);if(!next)return;await say(monName(s.mon)+'、もどれ！');const q=doubleSlot(s.side,s.pos,next.i,next.mon);q.lastSwitch=D.turnN;D.slots[s.side][s.pos]=q;await say(monName(q.mon)+'、出番だ！');await doubleEnter(D,q);return;}
 const enemy=doubleActive(D,1-s.side);if(!enemy.length)return;
 const mode=a.mode||'enemy',m=a.i<0?STRUGGLE:MOVES[s.mon.mv[a.i].id];
 const allies=doubleActive(D,s.side);
 let targets=mode==='spread'?enemy:mode==='support'?[allies.find(t=>t.pos===a.target)||s]:mode==='self'?[enemy[0]]:[enemy.find(t=>t.pos===a.target)||enemy[0]];
 const support=mode==='support'&&targets[0]!==s;if(mode==='support'&&!support)targets=[enemy[0]];
 let moved=false;
 for(let j=0;j<targets.length;j++){if(j&&!moved)break;const t=targets[j];if(t.mon.hp<=0||s.mon.hp<=0)continue;const B=doublePair(D,s,t);B.extra=j>0;B.spreadFactor=targets.length>1?0.75:1;B.supportAlly=support;await useMove(B,s.side,a.i);if(!j)moved=B.didMove;}
}
async function doubleResidual(D){
 for(const s of D.slots.flat().filter(Boolean)){const m=s.mon,st=s.st;st.flinch=false;st.prot=false;if(m.hp<=0)continue;const t=doubleActive(D,1-s.side)[0]||D.slots[1-s.side].find(Boolean)||s,B=doublePair(D,s,t),side=s.side,ab=abilOf(m),mx=maxHP(m);
  if(heldOf(m).regen&&m.hp<mx){m.hp=Math.min(mx,m.hp+Math.max(1,Math.floor(mx/heldOf(m).regen)));await hpAnim(B,side);}
  if(st.seed){const d=Math.min(m.hp,Math.max(1,Math.floor(mx/8)));m.hp-=d;await hpAnim(B,side);const o=st.seedFrom;if(o&&D.slots[o.side][o.pos]&&D.slots[o.side][o.pos].mon.hp>0){const target=D.slots[o.side][o.pos];target.mon.hp=Math.min(maxHP(target.mon),target.mon.hp+d);target.hpShow=target.mon.hp;}await say(monName(m)+'は タネに 体力を うばわれた！');}
  if(m.hp<=0)continue;const ty=SP[m.sp].types,safe=D.weather==='sand'?ty.some(x=>[8,12,16].includes(x)):ty.includes(5);
  if((D.weather==='sand'||D.weather==='hail')&&!safe){m.hp=Math.max(0,m.hp-Math.max(1,Math.floor(mx/16)));await hpAnim(B,side);await say(monName(m)+'は '+WX_JP[D.weather]+'に うたれた！');}
  if(m.hp<=0)continue;if(m.st==='psn'||m.st==='brn'){m.hp=Math.max(0,m.hp-Math.max(1,Math.floor(mx/8)));await hpAnim(B,side);await say(monName(m)+'は '+STATUS_JP[m.st]+'の ダメージを うけた！');}
  if(m.hp<=0)continue;if(ab===16&&m.hp<mx){m.hp=Math.min(mx,m.hp+Math.max(1,Math.floor(mx/16)));await hpAnim(B,side);}if(ab===7&&st.spe<6){st.spe++;await say(monName(m)+'の すばやさが 上がった！');}if(ab===13&&m.st&&ri(3)===0){m.st=null;await say(monName(m)+'の 状態異常が 治った！');}
 }
 if(D.weather&&!D.naturalWX&&--D.wT<=0){await say(WX_OFF[D.weather]);D.weather=null;}
 for(const side of [0,1])for(let c=0;c<2;c++)if(D.wall[side][c]>0)--D.wall[side][c];
}
async function doubleFaints(D){
 for(const s of D.slots.flat().filter(Boolean)){if(s.mon.hp>0||s.down)continue;s.down=true;const opposite=D.slots[1-s.side].find(Boolean);if(opposite){const B=doublePair(D,s,opposite);await faintAnim(B,s.side);await say(monName(s.mon)+'は たおれた！');if(s.side&&!D.o.facility){const live=doubleActive(D,0)[0];if(live)await giveExp(doublePair(D,live,s));}else if(!s.side&&!D.o.facility)HitokariUpgrade.bond(s.mon,-3);}}
 if(!S.party.some(m=>m.hp>0)){D.result='lose';return;}
 if(!D.foes.some(m=>m.hp>0)){D.result='win';return;}
 for(const side of [0,1])for(let pos=0;pos<2;pos++){const s=D.slots[side][pos];if(s&&s.mon.hp>0)continue;
 const pool=doubleReserve(D,side);if(!pool.length){D.slots[side][pos]=null;continue;}
 let i=0;if(!side&&pool.length>1){do{i=await menu(pool.map(v=>({label:monName(v.mon),right:'HP '+v.mon.hp})),{x:8,y:24,w:224,title:'次の 相棒を 選ぶ',cancel:false});}while(i<0);}
 const q=doubleSlot(side,pos,pool[i].i,pool[i].mon);D.slots[side][pos]=q;await say(monName(q.mon)+'、出番だ！');await doubleEnter(D,q);
 }
 D.parts=new Set(doubleActive(D,0).map(s=>s.i));
}
async function doubleBattle(o){
 const D=doubleState(o),speaker=SPEAKER;SPEAKER=0;fxClear();
 try{for(const m of S.party.concat(D.foes))monPreload(m.sp);await fadeTo(1,180);BT=D;G.scene='battle';await fadeTo(0,220);await say(o.trainer.name+'との ダブルバトル！');
 for(const s of D.slots.flat().filter(Boolean))await doubleEnter(D,s);
 while(!D.result){const actions=[],players=doubleActive(D,0),reserved=[];let i=0;
 while(i<players.length){const a=await doublePlayerAction(D,players[i],reserved);if(!a){if(i){const prev=actions.pop();if(prev.kind==='switch')reserved.splice(reserved.indexOf(prev.i),1);i--;}continue;}actions.push(a);if(a.kind==='switch')reserved.push(a.i);i++;}
 const aiReserved=[];for(const s of doubleActive(D,1)){const a=doubleAI(D,s,aiReserved);if(a.kind==='switch')aiReserved.push(a.i);actions.push(a);}
 D.focus=null;for(const a of doubleOrder(actions)){if(!doubleActive(D,0).length||!doubleActive(D,1).length)break;await doubleExecute(D,a);}
 await doubleResidual(D);await doubleFaints(D);D.turnN++;
 }
 if(D.result==='win'){await sayW(o.trainer.name+'との ダブルバトルに 勝った！');if(!o.facility&&o.trainer.money){S.money+=o.trainer.money;await sayW('賞金 '+o.trainer.money+'G を 手に入れた！');}}
 if(!o.facility){const p=HitokariUpgrade.progress(S);if(D.result==='win')p.wins++;else p.losses++;if(D.result==='win')S.money+=D.coins||0;}
 await fadeTo(1,180);G.scene='world';BT=null;fxClear();if(!o.facility&&D.result==='win')await checkEvolutions();await fadeTo(0,180);return D.result;
 }finally{if(BT===D){BT=null;G.scene='world';G.fade=0;fxClear();}SPEAKER=speaker;}
}
function drawDoublePix(D){const g=wctx;g.save();if(FX.shake&&!reducedFx())g.translate(rnd(-FX.shake,FX.shake),rnd(-FX.shake,FX.shake));g.drawImage(battleBG(D.env),-16,-16,LW+32,LH+32);battleTint(g,D.env);if(D.weather)drawWeather(g,D.weather);
 for(const s of [...D.slots[1],...D.slots[0]].filter(Boolean)){const q=doublePosition(s),f=s.fx,size=s.side?49:58;if(f.Hide||f.A<=0)continue;g.fillStyle='rgba(24,24,40,.24)';g.beginPath();g.ellipse(q.x,q.y+size*.45,21,5,0,0,6.3);g.fill();const k=D.pair?D.pair.indexOf(s):-1;drawLive(g,s.mon,q.x-size/2+f.DX,q.y-size*.56+f.DY+f.Y,size/32,!s.side,f.A,f.SX,k<0?0:FX.lit[k]);}
 fxDraw(g);g.restore();if(FX.flash){g.fillStyle='rgba('+FX.flash.col+','+Math.max(0,FX.flash.a)+')';g.fillRect(0,0,LW,LH);}}
function drawDoubleUI(D){
 for(const s of D.slots.flat().filter(Boolean)){const x=s.pos*119+2,y=s.side?2:119,w=117,selected=D.focus===s;win(x,y,w,31,selected?'#fff3c4':'#fbf7ea');const name=monName(s.mon);tx(name.slice(0,10),x+5,y+3,'#2a2233',8);tx('Lv'+s.mon.lv,x+w-4,y+3,'#2a2233',7,'right');bar(x+7,y+16,65,4,s.hpShow/maxHP(s.mon),hpCol(s.hpShow/maxHP(s.mon)));tx(s.mon.st?STATUS_JP[s.mon.st]:s.side?'':Math.ceil(s.hpShow)+'/'+maxHP(s.mon),x+w-4,y+14,'#5a5560',7,'right');if(selected)tx('▶',x+4,y+23,'#b54d34',7);SP[s.mon.sp].types.forEach((t,j)=>{ctx.fillStyle=TCOL[t];ctx.fillRect(x+17+j*14,y+23,12,6);tx(TK[t],x+23+j*14,y+21.5,'#fff',6,'center');});}
 win(0,LH-MSG_H,LW,MSG_H);tx('ダブル　TURN '+(D.turnN+1)+(D.weather?'　'+WX_JP[D.weather]:''),8,LH-MSG_H+7,'#5a5560',9);if(D.focus)tx(monName(D.focus.mon)+'の 行動を 選ぼう',8,LH-MSG_H+22,'#2a2233',10);
}
