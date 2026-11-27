'use strict';
// Active slot battle adapter. Reuses the existing move/status/animation resolver for both sides.
const DOUBLE_SPREAD=new Set(['おおなみ','だいかいしょう','はなあらし','たいじゅのいかり','ひょうてんか','だいおせん','ふはいのきり','ちかくへんどう','てんぷうは','ほうせきあらし','がけくずし','だいぐんしゅう','うろこあらし','はめつのほうこう','らんきりゅう','だいせんぷう']);
const DOUBLE_ADJACENT=new Set(['ちかくへんどう']);
const doubleTarget=m=>DOUBLE_ADJACENT.has(m.name)?'all':DOUBLE_SPREAD.has(m.name)?'spread':m.pow>0||m.eff.some(e=>e.k==='st'||e.k==='seed'||e.k==='split'||e.k==='stage'&&e.who==='foe')?'enemy':m.eff.some(e=>e.k==='heal'||e.k==='cure')?'support':'self';
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
function doubleActive(D,side){return D.slots[side].filter(s=>s&&!s.captured&&s.mon.hp>0);}
function doubleReserve(D,side,used=[],pos=null){const a=side?D.foes:S.party,active=D.slots[side].filter(Boolean).map(s=>s.i);return a.map((mon,i)=>({mon,i})).filter(v=>v.mon.hp>0&&!active.includes(v.i)&&!used.includes(v.i)&&(!side||!D.caughtIndices.has(v.i)&&(!D.o.multi||pos===null||D.o.ownerByIndex[v.i]===pos)));}
function doublePair(D,a,t){const pair=a.side?[t,a]:[a,t];D.pair=pair;const B={o:D.o,wild:D.wild,foes:D.foes,pi:pair[0].i,fi:pair[1].i,ps:pair[0].st,fs:pair[1].st,parts:D.parts,pairMons:pair.map(s=>s.mon),pairSlots:pair,wall:pair.map(s=>D.wall[s.side]),allStages:D.slots.flat().filter(Boolean).map(s=>s.st),hpShow:[],fx:{}};
 for(const key of ['weather','wT','naturalWX','coins','turnN'])Object.defineProperty(B,key,{get:()=>D[key],set:v=>D[key]=v});
 for(let i=0;i<2;i++){const s=pair[i],prefix=i?'foe':'me';Object.defineProperty(B.hpShow,i,{get:()=>s.hpShow,set:v=>s.hpShow=v,enumerable:true});for(const k of ['DX','DY','SX','Hide','A','Y'])Object.defineProperty(B.fx,prefix+k,{get:()=>s.fx[k],set:v=>s.fx[k]=v});}
 return B;
}
function doubleState(o){const D={double:true,o,wild:!!o.wilds,foes:o.wilds||o.trainer.team,caughtIndices:new Set(),captured:[],runTry:0,env:battleEnv(o),weather:o.facility?null:fieldWeather(G.map),wT:0,wall:[[0,0],[0,0]],coins:0,parts:new Set(),result:null,turnN:0,slots:[[],[]],pair:null,focus:null};
 D.naturalWX=!!D.weather;
 for(let side=0;side<2;side++){const a=side?D.foes:S.party,ids=a.map((m,i)=>m.hp>0?i:-1).filter(i=>i>=0);for(let pos=0;pos<2;pos++){const i=side&&o.multi?ids.find(i=>o.ownerByIndex[i]===pos):ids[pos];D.slots[side][pos]=i===undefined?null:doubleSlot(side,pos,i,a[i]);if(!side&&i!==undefined)D.parts.add(i);}}
 return D;
}
async function doubleEnter(D,s){if(!s)return;startIndividualMotion(s.mon,'enter');if(s.side)markSeen(s.mon.sp);else D.parts.add(s.i);const q=doublePosition(s);ring(q.x,q.y+18,'230,255,255',{flat:0.35,dr:2.4,w:2});if(s.mon.shiny)sparkleFx(q.x,q.y,12);
 if(abilOf(s.mon)===1){await say(monName(s.mon)+'の 威圧！');for(const t of doubleActive(D,1-s.side))await boost(doublePair(D,s,t),1-s.side,'atk',-1);}}
async function doublePlayerAction(D,s,reserved,itemsReserved={}){
 for(;;){D.focus=s;const options0=['技を 使う','交代する',{label:'もちもの',dis:!!D.o.facility},'前の選択へ'];if(D.wild)options0.push('捕獲','にげる');const choice=await menu(options0,{x:6,y:LH-MSG_H+2,w:228,cols:2,cancel:true,title:monName(s.mon)+' の 行動'});
 if(choice<0||choice===3)return null;
 if(choice===4&&D.wild){const item=await doubleChooseCapture(D,s,itemsReserved);if(item)return item;continue;}
 if(choice===5&&D.wild)return{kind:'run',slot:s};
 if(choice===2){if(D.o.facility)continue;const item=await doubleChooseItem(s,itemsReserved);if(item)return item;continue;}
 if(choice===1){const pool=doubleReserve(D,0,reserved);if(!pool.length){await sayW('交代できる 相棒は いない。');continue;}
 const i=await menu(pool.map(v=>({label:monName(v.mon),right:'HP '+v.mon.hp+'/'+maxHP(v.mon)})),{x:8,y:36,w:224,title:'交代先'});if(i>=0)return{kind:'switch',slot:s,i:pool[i].i};continue;}
 const options=combatOptions(s.mon);
 const mi=await menu(options.map(v=>({label:v.m.name,right:(v.i<0?'PP―':'PP'+s.mon.mv[v.i].pp)+' '+(['spread','all'].includes(doubleTarget(v.m))?'範囲':TK[v.m.type]||'無')})),{x:3,y:LH-MSG_H+1,w:234,rows:3,cancel:true,title:'技を 選ぶ',fg:j=>{const m=options[j].m;win(4,111,232,35);tx(TKANA[m.type]||'無',11,116,'#2a2233',9);tx('威力 '+powTxt(m)+' 命中 '+(m.acc||'必中'),228,116,'#2a2233',9,'right');tx(doubleTarget(m)==='all'?'相手と 味方にも 命中':doubleTarget(m)==='spread'?'相手2体（2体時75%）':doubleTarget(m)==='support'?'自分 または 味方':moveNote(m).slice(0,23),11,130,'#5a5560',8);}});if(mi<0)continue;
 const v=options[mi],kind=doubleTarget(v.m);let target=null;
 if(kind==='enemy'||kind==='support'){const targets=kind==='support'?doubleActive(D,0):doubleActive(D,1);if(targets.length===1)target=targets[0].pos;else{const i=await menu(targets.map(t=>({label:monName(t.mon),right:'HP '+t.mon.hp})),{x:10,y:LH-MSG_H+1,w:220,title:kind==='support'?'回復対象':'攻撃対象'});if(i<0)continue;target=targets[i].pos;}}
 return{kind:'move',slot:s,i:v.i,target,mode:kind};
 }
}
function doubleItemEligible(it,m){
 if(!it||!m)return false;
 if(it.k==='heal')return m.hp>0&&m.hp<maxHP(m);
 if(it.k==='cure')return m.hp>0&&!!m.st&&(it.v==='all'||it.v===m.st);
 if(it.k==='revive')return m.hp<=0;
 if(it.k==='pp')return m.mv.some(v=>v.pp<MOVES[v.id].pp);
 return false;
}
async function doubleChooseItem(s,reserved){
 const ids=ITEM_ORDER.filter(id=>(S.bag[id]||0)>(reserved[id]||0)&&['heal','cure','revive','pp'].includes(ITEMS[id].k)&&S.party.some(m=>doubleItemEligible(ITEMS[id],m)));
 if(!ids.length){await sayW('使える 道具が ない。');return null;}
 const i=await menu(ids.map(id=>({label:ITEMS[id].n,right:'×'+(S.bag[id]-(reserved[id]||0))})),{x:4,y:8,w:232,rows:10,title:'戦闘用の 道具'});if(i<0)return null;
 const id=ids[i],j=await menu(S.party.map(m=>({label:monName(m),right:'HP '+m.hp+'/'+maxHP(m),dis:!doubleItemEligible(ITEMS[id],m)})),{x:5,y:30,w:230,title:'使う 相棒'});if(j<0)return null;
 return{kind:'item',slot:s,id,targetIndex:j};
}
async function doubleUseItem(D,a){
 if(D.o.facility||!(S.bag[a.id]>0))return;
 const m=S.party[a.targetIndex],it=ITEMS[a.id];if(!doubleItemEligible(it,m)){await say('道具は 使わなかった。');return;}
 if(it.k==='heal')m.hp=Math.min(maxHP(m),m.hp+it.v);
 if(it.k==='cure'){m.st=null;m.sc=0;}
 if(it.k==='revive'){m.hp=it.v?maxHP(m):Math.max(1,Math.floor(maxHP(m)/2));m.st=null;m.sc=0;}
 if(it.k==='pp')for(const v of m.mv)v.pp=MOVES[v.id].pp;
 if(--S.bag[a.id]<=0)delete S.bag[a.id];sfx('heal');const target=D.slots[0].find(s=>s&&s.i===a.targetIndex);if(target){const opp=doubleActive(D,1)[0];if(opp){const B=doublePair(D,target,opp);healFx(0);await hpAnim(B,0);}else target.hpShow=m.hp;}
 await say(monName(m)+'に '+it.n+'を 使った！');
}
function doubleAI(D,s,reserved){
 const enemies=doubleActive(D,1-s.side);
 if(D.wild){const v=pick(combatOptions(s.mon)),mode=doubleTarget(v.m),target=mode==='support'?pick(doubleActive(D,s.side)).pos:mode==='enemy'?pick(enemies).pos:null;return{kind:'move',slot:s,i:v.i,target,mode};}
 if(D.turnN-s.lastSwitch>=2&&D.turnN>=1){const i=switchRating(s,enemies,doubleReserve(D,s.side,reserved,s.pos),D.weather);if(i>=0)return{kind:'switch',slot:s,i};}
 let best=null,bs=-Infinity;
 for(const v of combatOptions(s.mon)){const m=v.m,kind=doubleTarget(m),targets=kind==='support'?doubleActive(D,s.side):kind==='self'?[s]:['spread','all'].includes(kind)?[null]:enemies;
 for(const t of targets){let score=0;
 if(m.pow){const targets2=t?[t]:enemies;score=targets2.reduce((sum,z)=>sum+HitokariUpgrade.damageScore(combatEstimate(s.mon,z.mon,m,s.st,z.st,D.weather)*(targets2.length>1?0.75:1),z.mon.hp,(m.acc||100)/100,m.prio,combatStat(s.mon,s.st,5)>=combatStat(z.mon,z.st,5)),0);
 if(kind==='all'){const ally=doubleActive(D,s.side).find(z=>z!==s);if(ally)score-=70*combatEstimate(s.mon,ally.mon,m,s.st,ally.st,D.weather)/Math.max(1,ally.mon.hp);}
 if(m.has('rech'))score*=0.7;if(m.has('boom')&&s.mon.hp>maxHP(s.mon)*0.25)score*=0.1;
 }else if(kind==='support'){const h=t.mon.hp/maxHP(t.mon);score=m.has('heal')?(h<0.4?85:h<0.7?35:0):(t.mon.st?62:0);}
 else if(kind==='self'){score=m.has('protect')?(s.st.protN?0:8):m.has('wall')?(!D.wall[s.side][m.eff.find(e=>e.k==='wall').c]?30:0):m.has('wx')?(D.weather!==m.eff.find(e=>e.k==='wx').w?18:0):m.has('rest')?(s.mon.hp<maxHP(s.mon)*0.3?70:0):m.eff.some(e=>e.k==='stage'&&e.who==='self'&&Math.abs(s.st[e.stat])<3)?24:4;}
 else score=t.mon.st?5:25;
 score*=0.96+Math.random()*0.08;if(score>bs){bs=score;best={kind:'move',slot:s,i:v.i,target:t?t.pos:null,mode:kind};}
 }}
 return best||{kind:'move',slot:s,i:-1,mode:'enemy',target:enemies[0]?.pos};
}
function doubleOrder(actions){return actions.map(a=>({a,p:a.kind==='run'?110:a.kind==='switch'?100:a.kind==='item'||a.kind==='capture'?90:(a.i<0?0:MOVES[a.slot.mon.mv[a.i].id].prio),speed:combatStat(a.slot.mon,a.slot.st,5),tie:Math.random()})).sort((a,b)=>b.p-a.p||b.speed-a.speed||a.tie-b.tie).map(x=>x.a);}
async function doubleExecute(D,a){const s=a.slot;if(!s||s.captured||s.mon.hp<=0||D.slots[s.side][s.pos]!==s||D.result)return;
 if(a.kind==='run'){if(!D.wild)return;D.runTry++;const speed=combatStat(s.mon,s.st,5),foe=Math.max(1,...doubleActive(D,1).map(z=>combatStat(z.mon,z.st,5)));if(speed>=foe||ri(256)<Math.floor(speed*128/foe)+30*D.runTry){D.result='run';await say('うまく にげきれた！');}else await say('にげられなかった！');return;}
 if(a.kind==='capture'){await doubleCapture(D,a);return;}
 if(a.kind==='item'){await doubleUseItem(D,a);return;}
 if(a.kind==='switch'){const next=doubleReserve(D,s.side,[],s.pos).find(v=>v.i===a.i);if(!next)return;await say(monName(s.mon)+'、もどれ！');const q=doubleSlot(s.side,s.pos,next.i,next.mon);q.lastSwitch=D.turnN;D.slots[s.side][s.pos]=q;await say(monName(q.mon)+'、出番だ！');await doubleEnter(D,q);return;}
 const enemy=doubleActive(D,1-s.side);if(!enemy.length)return;
 const mode=a.mode||'enemy',m=a.i<0?STRUGGLE:MOVES[s.mon.mv[a.i].id];
 const allies=doubleActive(D,s.side);
 let targets=mode==='all'?[...enemy,...allies.filter(t=>t!==s)]:mode==='spread'?enemy:mode==='support'?[allies.find(t=>t.pos===a.target)||s]:mode==='self'?[enemy[0]]:[enemy.find(t=>t.pos===a.target)||enemy[0]];
 const support=mode==='support'&&targets[0]!==s;if(mode==='support'&&!support)targets=[enemy[0]];
 let moved=false;
 for(let j=0;j<targets.length;j++){if(j&&!moved)break;const t=targets[j];if(t.captured||t.mon.hp<=0||s.mon.hp<=0)continue;const B=doublePair(D,s,t);B.extra=j>0;B.spreadFactor=targets.length>1?0.75:1;B.supportAlly=support;await useMove(B,s.side,a.i);if(!j)moved=B.didMove;}
}
async function doubleResidual(D){
 for(const s of D.slots.flat().filter(Boolean)){const m=s.mon,st=s.st;st.flinch=false;st.prot=false;if(s.captured||m.hp<=0)continue;const t=doubleActive(D,1-s.side)[0]||D.slots[1-s.side].find(Boolean)||s,B=doublePair(D,s,t),side=s.side,ab=abilOf(m),mx=maxHP(m);
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
 for(const s of D.slots.flat().filter(Boolean)){if(s.captured||s.mon.hp>0||s.down)continue;s.down=true;const opposite=D.slots[1-s.side].find(Boolean);if(opposite){const B=doublePair(D,s,opposite);await faintAnim(B,s.side);await say(monName(s.mon)+'は たおれた！');if(s.side&&!D.o.facility){const live=doubleActive(D,0)[0];if(live)await giveExp(doublePair(D,live,s));}else if(!s.side&&!D.o.facility)HitokariUpgrade.bond(s.mon,-3);}}
 if(!S.party.some(m=>m.hp>0)){D.result='lose';return;}
 if(!D.foes.some((m,i)=>m.hp>0&&!D.caughtIndices.has(i))){D.result=D.captured.length?'caught':'win';return;}
 for(const side of [0,1])for(let pos=0;pos<2;pos++){const s=D.slots[side][pos];if(s&&!s.captured&&s.mon.hp>0)continue;
 const pool=doubleReserve(D,side,[],pos);if(!pool.length){D.slots[side][pos]=null;continue;}
 let i=0;if(!side&&pool.length>1){do{i=await menu(pool.map(v=>({label:monName(v.mon),right:'HP '+v.mon.hp})),{x:8,y:24,w:224,title:'次の 相棒を 選ぶ',cancel:false});}while(i<0);}
 const q=doubleSlot(side,pos,pool[i].i,pool[i].mon);D.slots[side][pos]=q;await say(monName(q.mon)+'、出番だ！');await doubleEnter(D,q);
 }
 D.parts=new Set(doubleActive(D,0).map(s=>s.i));
}
async function doubleBattle(o){
 const D=doubleState(o),speaker=SPEAKER;SPEAKER=0;fxClear();
 try{for(const m of S.party.concat(D.foes))monPreload(m.sp);D.intro=!!o.multi;await fadeTo(1,180);BT=D;G.scene='battle';await fadeTo(0,220);await say(D.wild?'野生の '+D.foes.map(monName).join(' と ')+'が あらわれた！':o.multi?o.multi.map(v=>v.name).join(' と ')+'との 共闘バトル！':o.trainer.name+'との ダブルバトル！');D.intro=false;
 for(const s of D.slots.flat().filter(Boolean))await doubleEnter(D,s);
 while(!D.result){const actions=[],players=doubleActive(D,0),reserved=[],itemsReserved={};let i=0;
 while(i<players.length){const a=await doublePlayerAction(D,players[i],reserved,itemsReserved);if(!a){if(i){const prev=actions.pop();if(prev.kind==='switch')reserved.splice(reserved.indexOf(prev.i),1);if(prev.kind==='item'||prev.kind==='capture')itemsReserved[prev.id]--;i--;}continue;}actions.push(a);if(a.kind==='switch')reserved.push(a.i);if(a.kind==='item'||a.kind==='capture')itemsReserved[a.id]=(itemsReserved[a.id]||0)+1;i++;}
 const aiReserved=[];for(const s of doubleActive(D,1)){const a=doubleAI(D,s,aiReserved);if(a.kind==='switch')aiReserved.push(a.i);actions.push(a);}
 D.focus=null;for(const a of doubleOrder(actions)){if(D.result||!doubleActive(D,0).length||!doubleActive(D,1).length)break;await doubleExecute(D,a);}
 if(!D.result){await doubleResidual(D);await doubleFaints(D);}D.turnN++;
 }
 if(D.result==='win'){for(const s of doubleActive(D,0))startIndividualMotion(s.mon,'celebrate');await sayW(D.wild?'野生の アニマとの 勝負に 勝った！':o.trainer.name+'との ダブルバトルに 勝った！');if(!D.wild&&!o.facility&&o.trainer.money){S.money+=o.trainer.money;await sayW('賞金 '+o.trainer.money+'G を 手に入れた！');}}
 if(!o.facility){const p=HitokariUpgrade.progress(S);if(D.result==='win')p.wins++;else if(D.result==='lose')p.losses++;p.captures+=D.captured.length;if(D.result!=='lose')S.money+=D.coins||0;}
 await fadeTo(1,180);G.scene='world';BT=null;fxClear();for(const m of D.captured)await addMon(m,true);if(!o.facility&&D.result!=='lose')await checkEvolutions();await fadeTo(0,180);return D.result;
 }finally{if(BT===D){BT=null;G.scene='world';G.fade=0;fxClear();}SPEAKER=speaker;}
}
function drawDoublePix(D){const g=wctx;g.save();if(FX.shake&&!reducedFx())g.translate(rnd(-FX.shake,FX.shake),rnd(-FX.shake,FX.shake));g.drawImage(battleBG(D.env),-16,-16,LW+32,LH+32);battleTint(g,D.env);if(D.weather)drawWeather(g,D.weather);
 if(D.intro&&D.o.multi){for(let i=0;i<D.o.multi.length;i++)drawHumanBig(g,D.o.multi[i].spr,2,0,1.8,147+i*61,88);}
 for(const s of [...D.slots[1],...D.slots[0]].filter(Boolean)){if(s.captured||D.intro&&s.side)continue;const q=doublePosition(s),f=s.fx,size=s.side?49:58;if(f.Hide||f.A<=0)continue;g.fillStyle='rgba(24,24,40,.24)';g.beginPath();g.ellipse(q.x,q.y+size*.45,21,5,0,0,6.3);g.fill();const k=D.pair?D.pair.indexOf(s):-1;drawLive(g,s.mon,q.x-size/2+f.DX,q.y-size*.56+f.DY+f.Y,size/32,!s.side,f.A,f.SX,k<0?0:FX.lit[k]);}
 if(D.captureOrb){const o=D.captureOrb;g.fillStyle='rgba(255,231,150,.3)';g.beginPath();g.arc(o.x,o.y,8,0,6.3);g.fill();if(!drawItemPic(ITEMS[o.id].img,o.x-7,o.y-7,14,g)){g.fillStyle='#e7bb62';g.beginPath();g.arc(o.x,o.y,5,0,6.3);g.fill();}}
 fxDraw(g);g.restore();if(FX.flash){g.fillStyle='rgba('+FX.flash.col+','+Math.max(0,FX.flash.a)+')';g.fillRect(0,0,LW,LH);}}
function drawDoubleUI(D){
 for(const s of D.slots.flat().filter(Boolean)){if(s.captured)continue;const x=s.pos*119+2,y=s.side?2:119,w=117,selected=D.focus===s;win(x,y,w,31,selected?'#fff3c4':'#fbf7ea');const name=monName(s.mon);tx(name.slice(0,10),x+5,y+3,'#2a2233',8);tx('Lv'+s.mon.lv,x+w-4,y+3,'#2a2233',7,'right');bar(x+7,y+16,65,4,s.hpShow/maxHP(s.mon),hpCol(s.hpShow/maxHP(s.mon)));tx(s.mon.st?STATUS_JP[s.mon.st]:s.side?'':Math.ceil(s.hpShow)+'/'+maxHP(s.mon),x+w-4,y+14,'#5a5560',7,'right');if(selected)tx('▶',x+4,y+23,'#b54d34',7);SP[s.mon.sp].types.forEach((t,j)=>{ctx.fillStyle=TCOL[t];ctx.fillRect(x+17+j*14,y+23,12,6);tx(TK[t],x+23+j*14,y+21.5,'#fff',6,'center');});}
 win(0,LH-MSG_H,LW,MSG_H);tx((D.wild?'野生ダブル':D.o.multi?'共闘':'ダブル')+'　TURN '+(D.turnN+1)+(D.weather?'　'+WX_JP[D.weather]:''),8,LH-MSG_H+7,'#5a5560',9);if(D.focus)tx(monName(D.focus.mon)+'の 行動を 選ぼう',8,LH-MSG_H+22,'#2a2233',10);
}

function captureRoll(B,f,it,override=null,random=Math.random){
 const v=override===null?it.v*(it.c?it.c(B,f):1):override,M=maxHP(f),sp=SP[f.sp];
 if(v>=255)return{shakes:3,ok:true};let a=Math.floor((3*M-2*f.hp)*sp.catch*v/(3*M));a=Math.floor(a*(f.st==='slp'||f.st==='frz'?2:f.st?1.5:1));if(a>=255)return{shakes:3,ok:true};
 const b=Math.floor(1048560/Math.sqrt(Math.sqrt(16711680/Math.max(1,a))));let n=0;for(;n<4;n++)if(Math.floor(random()*65536)>=b)break;return{shakes:Math.min(3,n),ok:n===4};
}
async function doubleChooseCapture(D,s,reserved){
 const ids=ITEM_ORDER.filter(id=>ITEMS[id].k==='seal'&&(S.bag[id]||0)>(reserved[id]||0));if(!ids.length){await sayW('キャプセルを 持っていない。');return null;}
 const i=await menu(ids.map(id=>({label:ITEMS[id].n,right:'×'+(S.bag[id]-(reserved[id]||0))})),{x:4,y:8,w:232,rows:10,title:'キャプセル'});if(i<0)return null;const targets=doubleActive(D,1);
 const j=targets.length===1?0:await menu(targets.map(t=>({label:monName(t.mon),right:'HP '+t.mon.hp})),{x:10,y:104,w:220,title:'なかまにする 相手'});if(j<0)return null;return{kind:'capture',slot:s,id:ids[i],target:targets[j].pos,targetId:targets[j].i};
}
async function doubleCapture(D,a){
 if(!D.wild||!S.bag[a.id]||ITEMS[a.id].k!=='seal')return false;
 const target=D.slots[1][a.target];if(!target||target.i!==a.targetId||target.captured||target.mon.hp<=0){await say('相手が いなくなったので キャプセルは 使わなかった。');return false;}
 const B=doublePair(D,a.slot,target),f=target.mon,id=a.id,it=ITEMS[id],q=doublePosition(target),p=doublePosition(a.slot);if(--S.bag[id]<=0)delete S.bag[id];await say(S.name+'は '+it.n+'を 投げた！');
 const orb=D.captureOrb={x:p.x,y:p.y,id};await tween(280,u=>{orb.x=p.x+(q.x-p.x)*u;orb.y=p.y+(q.y-p.y)*u-20*Math.sin(u*Math.PI);});
 const roll=captureRoll(B,f,it);sfx('seal');target.fx.A=.18;ring(q.x,q.y,'255,231,150',{dr:3,w:2});for(let j=0;j<roll.shakes;j++){await tween(230,u=>{orb.x=q.x+Math.sin(u*Math.PI*2)*3;});sfx('seal');}
 D.captureOrb=null;if(!roll.ok){target.fx.A=1;await say(monName(f)+'は キャプセルから 出てきた！');return false;}
 target.captured=true;target.fx.A=0;D.caughtIndices.add(target.i);D.captured.push(f);sfx('get');sparkleFx(q.x,q.y,18);await sayW(monName(f)+'と 絆を 結んだ！');
 if(!D.o.facility)await giveExp(B);return true;
}
function wildEncounterPartner(cell,kind,bonus,repel,lead,first,force=false){
 if(S.party.filter(m=>m.hp>0).length<2||SP[first.sp].legend)return null;
 const area=G.map&&G.map.advArea,prob=kind==='water'?.10:area==='ridge'?.24:.15;
 if(!force&&!chance(prob))return null;
 for(let i=0;i<4;i++){const w=wildPick(cell,kind,bonus)||(kind==='water'?waterFallback(cell):null);if(w&&!SP[w.sp].legend&&!HitokariUpgrade.repelBlocks(repel,w.lv,lead.lv))return w;}return null;
}
function addLinkedTrainerPair(m){
 if(m.indoor||!m.cell||m.cell.gate||m.cell.prog<3||m.cell.kind==='town'||m.cell.kind==='sea'||m.advArea&&m.advArea!=='ridge'&&m.advArea!=='river'||m.objs.some(o=>o.role==='guard'||o.role==='story')||hashStr('linked:'+m.id)%3!==0)return;
 const r=RNG('linked:'+m.id),valid=(x,y)=>x>2&&y>2&&x<m.W-3&&y<m.H-3&&!occupied(m,x,y)&&!expAt(m,x,y)&&!m.warps[expKey(x,y)]&&!SOLID[m.t[y*m.W+x]],spots=[];
 for(let y=4;y<m.H-4;y++)for(let x=4;x<m.W-4;x++)if(valid(x,y)&&m.t[y*m.W+x]===T.PATH){
  for(const d of [0,1]){const ax=x+2*DX[d],ay=y+2*DY[d],bx=x-2*DX[d],by=y-2*DY[d];
   if(!valid(ax,ay)||!valid(bx,by)||!valid(x+DX[d],y+DY[d])||!valid(x-DX[d],y-DY[d]))continue;
   if(m.t[ay*m.W+ax]===T.PATH||m.t[by*m.W+bx]===T.PATH)continue;
   if(expHeight(m,ax,ay)!==expHeight(m,x,y)||expHeight(m,bx,by)!==expHeight(m,x,y))continue;
   spots.push({x,y,a:[ax,ay,(d+2)%4],b:[bx,by,d]});
  }
 }
 if(!spots.length)return;const site=r.pick(spots),key='linked:'+m.id;
 for(let i=0;i<2;i++){const p=i?site.b:site.a,o=genTrainer(r,m.cell,900+i,{n:2,los:3});const pid=distPerson(m.cell.dist||1,13,i);o.pid=pid;o.name=pFull(pid);o.spr=pSpr(pid);o.cls='共闘 '+person(pid).role;o.x=p[0];o.y=p[1];o.dir=p[2];o.linked=key;o.los=3;m.objs.push(o);}
 m.linkedSite={x:site.x,y:site.y,key};
}
async function pairedTrainerEncounter(pair){
 const p=G.pl,m=G.map,mid=m.id;for(const o of pair)o.alert=1;sfx('alert');await sleep(400);for(const o of pair)o.alert=0;
 const moves=pair.map(o=>({o,dx:p.x-DX[o.dir]-o.x,dy:p.y-DY[o.dir]-o.y}));
 await tween(330,u=>{for(const q of moves){q.o.ox=q.dx*16*u;q.o.oy=q.dy*16*u;}});
 for(const q of moves){q.o.x+=q.dx;q.o.y+=q.dy;q.o.ox=q.o.oy=0;}p.dir=(pair[0].dir+2)%4;
 for(const o of pair){metPerson(o.pid);await sayAs(o.pid,o.name+'「一緒に 力を ためしてみよう！」');}
 const teams=pair.map(o=>mkTeam(o.team,Math.min(28,8+Math.floor(o.team[0].lv/3)))),ownerByIndex=teams.flatMap((a,i)=>a.map(()=>i)),multi=pair.map(o=>({name:o.name,spr:o.spr,pid:o.pid}));
 const result=await battle({double:true,multi,ownerByIndex,trainer:{name:pair.map(o=>o.name).join(' と '),team:teams.flat(),money:pair.reduce((a,o)=>a+o.money,0),spr:pair[0].spr}});
 if(result==='lose'){await blackout();return;}
 if(result==='win'){for(const o of pair){S.flags['t:'+mid+':'+o.tid]=1;o.beaten=true;HitokariUpgrade.noteMatch(S,'t:'+mid+':'+o.tid);}await msg('ふたりとの 勝負に 勝った！');saveGame();}
}
