'use strict';
const ROUTE3_TRAINERS=[
 {tid:301,pid:105,x:7,y:4,dir:2,cls:'若手トレーナー',team:[[451,8],[711,8]],money:160},
 {tid:302,pid:205,x:11,y:9,dir:0,cls:'昆虫採集家',team:[[376,8],[250,9]],money:190},
 {tid:303,pid:1305,x:15,y:4,dir:2,cls:'武術の修行者',team:[[11,9],[765,10]],money:220},
 {tid:304,pid:605,x:19,y:9,dir:0,cls:'アニマ研究員',team:[[241,9],[370,10]],money:220},
 {tid:305,pid:1405,x:24,y:4,dir:2,cls:'双子の挑戦者',pair:'twins',team:[[274,10]],money:140},
 {tid:306,pid:1406,x:24,y:9,dir:0,cls:'双子の挑戦者',pair:'twins',team:[[948,11]],money:140}
];
function route3Rect(m,x,y,w,h,t){for(let j=y;j<y+h;j++)for(let k=x;k<x+w;k++)m.t[j*m.W+k]=t;}
function route3Sign(m,x,y,label){m.t[y*m.W+x]=T.SIGN;m.signs[x+','+y]=label;}
function genRoute3(cell){
 const m=newMap(cell.key,cell,32,32,T.TREE),r=RNG('route3-v113');m.route3=true;m.border=T.TREE;m.exits=[0,1,0,1];m.enc={rate:12,bonus:0};m.adv={};m.route3Flowers=[];
 // Two independent corridors sharing only their west/east entrance plazas.
 route3Rect(m,2,3,28,7,T.GRASS);route3Rect(m,3,5,26,4,T.PATH);
 route3Rect(m,2,5,3,22,T.GRASS);route3Rect(m,27,5,3,22,T.GRASS);
 route3Rect(m,3,5,2,22,T.PATH);route3Rect(m,27,5,2,22,T.PATH);
 route3Rect(m,0,15,5,2,T.PATH);route3Rect(m,27,15,5,2,T.PATH);
 route3Rect(m,2,22,28,8,T.GRASS);
 // Grass trail: broad and continuous encounter patches; each band spans the southern corridor.
 for(let y=22;y<=29;y++)for(let x=5;x<=26;x++){
  const band=(x>=7&&x<=10)||(x>=14&&x<=17)||(x>=21&&x<=24);
  if(band||r.chance(.58))m.t[y*32+x]=T.TALL;
  else if(r.chance(.22)){m.t[y*32+x]=T.FLOWER;m.route3Flowers.push([x,y,(x*7+y*11)%24]);}
 }
 // Rocky/forested divider is impassable; the south has no trainer sight line.
 for(let x=5;x<=26;x++){if(x%4===0)m.t[11*32+x]=T.ROCK;if(x%5===0)m.t[20*32+x]=T.ROCK;}
 // Add short path portions around the forks, never a complete encounter-free southern bypass.
 route3Rect(m,3,24,3,2,T.PATH);route3Rect(m,26,24,3,2,T.PATH);
 route3Sign(m,2,14,'第3街道\n北：トレーナー街道（6人）\n南：草むら街道（6系統）\nどちらも 東の モミノキ街へ。');
 route3Sign(m,2,18,'草むら街道：Lv8～11。トレーナーは いない。');
 route3Sign(m,29,14,'東：モミノキ街\n西：トリベル平原');
 route3Sign(m,5,3,'トレーナー街道：腕を みがいて ジムへ！');
 for(const t of ROUTE3_TRAINERS){m.t[t.y*32+t.x]=T.GRASS;m.objs.push({k:'npc',role:'trainer',tid:t.tid,pid:t.pid,spr:pSpr(t.pid),name:pFull(t.pid),cls:t.cls,x:t.x,y:t.y,dir:t.dir,los:4,route3Pair:t.pair||null,team:t.team.map(([sp,lv])=>({sp,lv})),money:t.money});}
 for(const [x,y,id,iid] of [[9,28,'fuda',1],[23,27,'heal1',2],[17,3,'c_psn',3]]){m.t[y*32+x]=T.GRASS;m.objs.push({k:'item',iid:'r3-'+iid,x,y,item:id});}
 // Small resting decorations outside the walk-through path; signs are actual interactive objects.
 m.objs.push({k:'haruprop',id:'bench',x:22,y:3,say:'モミノキ街は もうすぐ。'});m.objs.push({k:'haruprop',id:'pot',x:3,y:3,say:'花が 風に ゆれている。'});
 m.route3Flowers=m.route3Flowers.filter(([x,y])=>m.t[y*32+x]===T.FLOWER);return m;
}
function route3Zone(m,x,y){return y<=10?'trainer':y>=22?'grass':'fork';}
function route3SafeSpawn(m,x,y){if(Number.isInteger(x)&&Number.isInteger(y)&&x>=0&&y>=0&&x<32&&y<32&&!SOLID[m.t[y*32+x]]&&!m.objs.some(o=>o.x===x&&o.y===y))return[x,y];return[3,15];}
async function route3TrainerTalk(o,automatic=false){
 if(o.beaten){await msg(o.name+'「モミノキ街での ジム戦、がんばってね！」');return;}
 const mid=G.map.id,live=S.party.filter(m=>m.hp>0).length;if(!live)return;
 const other=o.route3Pair&&live>=2?G.objs.find(t=>t!==o&&t.route3Pair===o.route3Pair&&!t.beaten):null,group=other?[o,other]:[o];
 if(!automatic&&!await confirmYN(other?'双子と ダブルバトルを する？':o.cls+'の '+o.name+'と 勝負する？'))return;
 if(automatic){for(const t of group)t.alert=1;sfx('alert');await sleep(300);for(const t of group)t.alert=0;}
 const teams=group.map(t=>mkTeam(t.team,10)),opt={double:!!other,trainer:{name:group.map(t=>t.name).join(' と '),team:teams.flat(),money:group.reduce((n,t)=>n+t.money,0),spr:o.spr}};
 if(other){opt.multi=group.map(t=>({name:t.name,spr:t.spr,pid:t.pid}));opt.ownerByIndex=teams.flatMap((t,j)=>t.map(()=>j));}
 for(const t of group)metPerson(t.pid);await msg(other?'「ふたりで きみの 相棒と 勝負だ！」':'「ジムに 行く前に 腕を ためそう！」');
 const res=await battle(opt);if(res==='lose'){await blackout();return;}if(res==='win'){for(const t of group){t.beaten=true;S.flags['t:'+mid+':'+t.tid]=1;HitokariUpgrade.noteMatch(S,'t:'+mid+':'+t.tid);}saveGame();}
}
function drawRoute3Ground(g,m,camx,camy){
 g.save();
 for(const [x,y,i] of m.route3Flowers){const px=x*16-camx,py=y*16-camy;if(px>=-16&&px<=LW&&py>=-16&&py<=LH)drawCell(g,'obj/harusaki/flowers.svg',6,32,32,i,px,py,16,16);}
 // Authored road edge markers, only on path tiles and no collision changes.
 for(let x=6;x<=26;x+=2){const px=x*16-camx,py=5*16-camy;if(px>=-16&&px<=LW&&py>=-16&&py<=LH){g.fillStyle='#bea783';g.fillRect(px+3,py+1,5,2);g.fillRect(px+11,py+1,3,2);}}
 g.restore();
}
function drawRoute3HUD(m){if(UI.length||G.banner&&G.banner.t>0)return;const z=route3Zone(m,G.pl.x,G.pl.y),label=z==='trainer'?'A トレーナー街道':z==='grass'?'B 草むら街道 Lv8～11':'第3街道 分岐点';ctx.fillStyle='rgba(36,56,44,.82)';ctx.fillRect(4,4,126,15);tx(label,9,7,'#fff6d9',8);}
