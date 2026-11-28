'use strict';
const INDIVIDUAL_FIELDS=new Map(SORANE_FIELD_DATA.map(x=>[x[0],x]));
const NPC_ZONES=['住居区','中央広場','仕事区','交流庭園'];
const NPC_RESIDENTS=Array.from({length:51},()=>[]);
for(const p of SORANE_NPC_DATA){if(p[0]>=10&&p[0]<=59)p[3]=gymNumberForLegacy(p[0]-9);if(HARU_NAMES[p[0]])p[1]=person(p[0]).name;}
for(const p of SORANE_NPC_DATA)NPC_RESIDENTS[p[3]].push(p[0]);
function npcProfile(id){return SORANE_NPC_DATA[id-1]||SORANE_NPC_DATA[0];}
function npcMinutes(){if(G.hour!=null)return((Math.floor(G.hour*60)%1440)+1440)%1440;const d=new Date();return d.getHours()*60+d.getMinutes();}
function npcScheduleAt(id,minute=npcMinutes()){const p=npcProfile(id),events=p[8];let j=0;for(let i=1;i<events.length;i++)if(events[i][0]<=minute)j=i;const e=events[j];return{minute:e[0],zone:e[1],activity:e[2],next:events[(j+1)%events.length][0],index:j};}
function formatNpcTime(t){return String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0');}
function residentAvailable(id){if(id===plPid())return false;if(id>100)return true;if(id>=10&&id<=59)return !!S.badges[gymNumberForLegacy(id-9)]||!!S.flags.champ;return !!S.met[id]||!!S.flags.champ;}
function residentSchedulePosition(id,slot,minute=npcMinutes()){const p=npcProfile(id),e=npcScheduleAt(id,minute),i=slot%49,ox=e.zone%2?17:2,oy=e.zone>1?17:2;return{x:ox+(i%7)*2,y:oy+Math.floor(i/7)*2,dir:(p[7]+e.index)%4,zone:e.zone};}
function addLifePortal(m){
 if(!m.cell||m.cell.kind!=='town'||m.indoor)return;let q=findPortal(m,15,17);
 if(!q){const cand=[];for(let y=2;y<m.H-2;y++)for(let x=2;x<m.W-2;x++){if(![T.PATH,T.GRASS,T.FLOWER].includes(m.t[y*m.W+x])||m.warps[expKey(x,y)]||occupied(m,x,y)||expAt(m,x,y))continue;if([0,1,2,3].some(d=>!SOLID[m.t[(y+DY[d])*m.W+x+DX[d]]]&&!occupied(m,x+DX[d],y+DY[d])))cand.push([x,y]);}cand.sort((a,b)=>Math.abs(a[0]-15)+Math.abs(a[1]-15)-Math.abs(b[0]-15)-Math.abs(b[1]-15));q=cand[0];}
 if(q)expPut(m,q[0],q[1],{kind:'portal',area:'life',label:m.cell.name+'・生活区',returnX:q[0],returnY:q[1]});
}
function generateLifeDistrict(id,cell){
 const m=expOutdoor(id,cell,32,32,cell.pal==='cave'?'plain':cell.pal);m.name=cell.name+'・生活区';
 for(let y=1;y<31;y++)for(let x=1;x<31;x++){const z=(x>=16?1:0)+(y>=16?2:0);expSet(m,x,y,x===15||x===16||y===15||y===16?T.PATH:z===2?T.SAND:z===1?T.PATH:T.GRASS);}
 const d=cell.gym||cell.dist||1,ids=NPC_RESIDENTS[d];const selected=cell.gym?ids:ids.filter((id,i)=>i%3===0);
 selected.forEach((pid,i)=>{const pos=residentSchedulePosition(pid,i,720);m.objs.push({k:'npc',role:'resident',pid,spr:pSpr(pid),x:pos.x,y:pos.y,dir:pos.dir,residentSlot:i});});
 expPut(m,15,27,{kind:'sign',label:'生活区：北西 住居／北東 広場／南西 仕事／南東 庭園。人々は 時刻で 行動を 変える。'});
 expExit(m,15,31,expTownReturn(cell,'life'));return m;
}
function resolveResidentSpawn(m,a,out){
 const taken=(x,y)=>out.some(o=>o.x===x&&o.y===y)||x===G.pl.x&&y===G.pl.y||!!m.warps[expKey(x,y)]||!!expAt(m,x,y)||SOLID[m.t[y*m.W+x]];
 if(!taken(a.x,a.y))return;const x=a.x,y=a.y;for(let r=1;r<=4;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){const nx=x+dx,ny=y+dy;if(nx<=0||ny<=0||nx>=m.W-1||ny>=m.H-1||taken(nx,ny))continue;a.x=nx;a.y=ny;return;}
}
function residentPass(m,o,x,y){
 if(x<=0||y<=0||x>=m.W-1||y>=m.H-1||SOLID[m.t[y*m.W+x]]||m.warps[expKey(x,y)]||expAt(m,x,y))return false;
 const p=G.pl;if(x===p.x&&y===p.y||p.moving&&x===p.x+DX[p.dir]&&y===p.y+DY[p.dir])return false;
 const other=objAt(x,y);return !other||other===o;
}
function residentNextStep(m,o,target){
 const q=[[o.x,o.y,-1]],visited=new Set([expKey(o.x,o.y)]);let best=-1,bd=Math.abs(o.x-target.x)+Math.abs(o.y-target.y);
 for(let i=0;i<q.length&&i<340;i++){const [x,y,first]=q[i];const dist=Math.abs(x-target.x)+Math.abs(y-target.y);if(dist<bd){best=first;bd=dist;if(!dist)return best;}
  for(let d=0;d<4;d++){const nx=x+DX[d],ny=y+DY[d],key=expKey(nx,ny);if(visited.has(key)||!residentPass(m,o,nx,ny))continue;visited.add(key);q.push([nx,ny,first<0?d:first]);}
 }return best;
}
let residentCursor=0;
function tickResidentSchedules(canInput){
 const m=G.map;if(!m||m.advArea!=='life')return;
 const actors=G.objs.filter(o=>o.role==='resident');
 for(const o of actors){const z=o.npcMove;if(!z)continue;z.t++;const f=Math.min(1,z.t/z.duration);o.ox=(z.x-o.x)*16*f;o.oy=(z.y-o.y)*16*f;if(f>=1){o.x=z.x;o.y=z.y;o.ox=o.oy=0;o.npcMove=null;}}
 if(!canInput||G.busy||G.pl.fly||G.t%5!==0||!actors.length)return;
 const minute=npcMinutes();
 for(let attempt=0;attempt<Math.min(3,actors.length);attempt++){
  const o=actors[residentCursor++%actors.length];if(o.npcMove||Math.abs(o.x-G.pl.x)+Math.abs(o.y-G.pl.y)<=1)continue;
  const p=npcProfile(o.pid),target=residentSchedulePosition(o.pid,o.residentSlot,minute);
  if(o.x===target.x&&o.y===target.y){if((G.t+p[7])%p[6]===0)o.dir=(o.dir+1)%4;continue;}
  if(o.nextMove&&G.t<o.nextMove)continue;const d=residentNextStep(m,o,target);o.nextMove=G.t+p[5]+3;if(d<0)continue;o.dir=d;o.npcMove={x:o.x+DX[d],y:o.y+DY[d],t:0,duration:p[5]};
 }
}
async function scheduledResidentTalk(o){const p=npcProfile(o.pid),e=npcScheduleAt(o.pid);metPerson(o.pid);await msg(p[1]+'「'+e.activity+'の 時間だよ。次は '+formatNpcTime(e.next)+' ごろ。」');if(p[0]>100)await recordFrom(o.pid,G.map.cell);await msg(NPC_ZONES[e.zone]+'に いる 予定だよ。人物図鑑で 予定を 見られる。');}
function drawNPCScheduleCard(id){const p=npcProfile(id),e=npcScheduleAt(id);screenBG('生活予定　C'+String(id).padStart(4,'0'));win(4,18,232,34);tx(p[1]+'　'+p[2],10,23,'#2a2233',9);tx(GYM_TOWN[p[3]]+'　現在 '+formatNpcTime(npcMinutes()),10,36,'#5a5560',8);win(4,56,232,146);for(let i=0;i<p[8].length;i++){const row=p[8][i],y=61+i*15;if(i===e.index){ctx.fillStyle='#f4d98a';ctx.fillRect(7,y-1,226,14);}tx(formatNpcTime(row[0]),10,y,'#364b53',8);tx(NPC_ZONES[row[1]],48,y,'#364b53',8);tx(row[2].slice(0,18),97,y,'#2a2233',8);}}
function fieldProfile(id){return INDIVIDUAL_FIELDS.get(id)||null;}
function applyIndividualFieldDesign(m){
 const d=fieldProfile(m.id);if(!d||m.individualDesign)return;m.individualDesign=d;if(m.haru)return;const blocked=(x,y)=>occupied(m,x,y)||!!m.warps[expKey(x,y)]||!!expAt(m,x,y);
 for(const [x,y,t] of d[7])if(x>0&&y>0&&x<m.W-1&&y<m.H-1&&!blocked(x,y)&&[T.ROCK,T.TREE].includes(m.t[y*m.W+x]))expSet(m,x,y,t);
 if(d[9]){const [x,y,label]=d[9];if(x>0&&y>0&&x<m.W-1&&y<m.H-1&&!blocked(x,y)&&!SOLID[m.t[y*m.W+x]])expPut(m,x,y,{kind:'landmark',label:m.name+'・'+label,design:d[6]});}
 addLinkedTrainerPair(m);
}
function landmarkRecords(){const p=HitokariUpgrade.progress(S);return p.landmarks||(p.landmarks={});}
async function visitIndividualLandmark(m,o){const rec=landmarkRecords(),fresh=!rec[m.id];rec[m.id]=1;await msg(o.label+'。'+(fresh?'旅の 記録に 加わった！':'ここを 記録している。'));if(fresh){sfx('get');saveGame();}}
const FIELD_TONES=['#94b58a','#d4b77a','#7ba4b1','#c39a90','#8e91c2','#b9bf8f','#98c2b8','#c4a18d'];
function drawIndividualTerrain(g,m,camx,camy){
 const d=m.individualDesign;if(!d)return;
 for(const [x,y,kind,tone] of d[8]){
  if(x<=0||y<=0||x>=m.W-1||y>=m.H-1||expAt(m,x,y)&&expAt(m,x,y).kind!=='landmark')continue;const v=m.t[y*m.W+x];if(SOLID[v]&&v!==T.WATER)continue;const px=x*16-camx,py=y*16-camy;if(px<-16||py<-16||px>LW||py>LH)continue;
  const c=FIELD_TONES[tone];g.save();g.translate(px,py);g.lineWidth=.6;g.strokeStyle=c;g.fillStyle=c;g.globalAlpha=m.indoor?.45:.8;
  if(kind===7&&v===T.WATER){g.beginPath();g.ellipse(8,8,5,1.5,0,0,6.3);g.stroke();g.fillStyle='rgba(255,255,255,.30)';g.fillRect(4,7,3,1);}
  else if(kind===0){for(let i=0;i<3;i++){g.fillRect(3+i*4,9-(i%2)*2,1,4);g.beginPath();g.arc(4+i*4,8-(i%2)*2,1.3,0,6.3);g.fill();}}
  else if(kind===1){g.beginPath();g.ellipse(7,10,4,2.5,-.15,0,6.3);g.fill();g.strokeStyle='rgba(64,57,57,.5)';g.beginPath();g.moveTo(3,10);g.lineTo(11,10);g.stroke();}
  else if(kind===2){g.beginPath();g.moveTo(5,11);g.lineTo(8,3);g.lineTo(11,11);g.closePath();g.fill();}
  else if(kind===3){g.strokeRect(3,3,10,10);g.beginPath();g.moveTo(8,4);g.lineTo(12,8);g.lineTo(8,12);g.lineTo(4,8);g.closePath();g.stroke();}
  else if(kind===4){for(let i=0;i<4;i++)g.fillRect(2+i*3,4+(i%2)*7,2,1);}
  else if(kind===5){g.beginPath();g.arc(8,8,4,0,6.3);g.stroke();g.fillRect(7,7,2,2);}
  else if(kind===6){g.fillRect(5,4,6,9);g.strokeStyle='#485455';g.strokeRect(5,4,6,9);}
  g.restore();
 }
 if(m.advArea==='life'){for(let i=0;i<4;i++){const x=(i%2?23:8)*16-camx,y=(i>1?17:2)*16-camy;if(x>LW||x<-50||y>LH||y<-20)continue;g.fillStyle='rgba(37,59,62,.83)';g.fillRect(x-23,y-10,46,11);g.font='bold 7px '+FONT;g.textBaseline='top';g.textAlign='center';g.fillStyle='#fff2cc';g.fillText(NPC_ZONES[i],x,y-9);}}
}
function drawIndividualMapHUD(m){if(UI.length||m.gymPuzzle||!m.individualDesign)return;if(m.advArea==='life'){ctx.fillStyle='rgba(28,44,51,.85)';ctx.fillRect(4,3,82,15);tx(formatNpcTime(npcMinutes())+' 生活区',9,6,'#fff2ce',8);}}
async function individualAtlasMenu(){
 const d=G.map.individualDesign,rec=landmarkRecords();const opts=['現在地の 地形記録','発見した 名所','生活予定の 案内','もどる'];
 for(;;){const i=await menu(opts,{x:8,y:30,w:224,title:'地方の記録',bg:()=>screenBG()});if(i<0||i===3)return;
 if(i===0)await msg(d?d[1]+'\n地形：'+d[4]+'\n設計番号 '+d[6]+'／'+SORANE_FIELD_DATA.length:'まだ 記録が ない。');
 if(i===1){const list=SORANE_FIELD_DATA.filter(v=>rec[v[0]]);if(!list.length)await msg('まだ 名所を 発見していない。');else await menu(list.map(v=>({label:v[1],right:v[4]})),{x:4,y:4,w:232,rows:11,title:'名所 '+list.length,bg:()=>screenBG()});}
 if(i===2)await msg('町の 生活区の 印から 住人の 生活を 見られる。各人の 人物図鑑で Aを 押すと 24時間の 予定が 開く。');
 }}
