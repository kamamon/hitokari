'use strict';
// Approved first-route art and data. Original assets remain at mon/NNNN.webp.
const ROUTE1_LINES=[
  {
    "key": "wheat-mouse",
    "ids": [
      451,
      452
    ],
    "names": [
      "コムギネ",
      "ムギハヤ"
    ],
    "types": [
      [
        0
      ],
      [
        0
      ]
    ],
    "levels": [
      18
    ],
    "plans": [
      "quad",
      "quad"
    ],
    "arch": "fast",
    "base": [
      [
        45,
        48,
        36,
        28,
        38,
        65
      ],
      [
        65,
        85,
        55,
        40,
        55,
        115
      ]
    ],
    "weight": 400,
    "ability": 25,
    "title": "麦穂の野ネズミ",
    "home": "麦畑や道端の草地",
    "eco": [
      "丸い耳と麦穂の尾を持つ。落ちている木の実を巣に持ち帰る。",
      "長い耳と麦穂の尾で風を読み、畑を駆け抜ける。道具を見つけるのが得意。"
    ],
    "learn": [
      [
        1,
        "ぶつかる"
      ],
      [
        1,
        "なきおどし"
      ],
      [
        5,
        "せんこうづき"
      ],
      [
        9,
        "すごみ"
      ],
      [
        13,
        "きりさきづめ"
      ],
      [
        18,
        "かえしうち"
      ],
      [
        23,
        "とうしをもやす"
      ],
      [
        30,
        "だいとつげき"
      ],
      [
        40,
        "ひっさつづき"
      ]
    ],
    "catch": 230,
    "tier": 0.03
  },
  {
    "key": "wind-bird",
    "ids": [
      717,
      718,
      719
    ],
    "names": [
      "ソヨチド",
      "カゼバネ",
      "ソラハヤテ"
    ],
    "types": [
      [
        0,
        9
      ],
      [
        0,
        9
      ],
      [
        0,
        9
      ]
    ],
    "levels": [
      16,
      32
    ],
    "plans": [
      "bird",
      "bird",
      "bird"
    ],
    "arch": "fast",
    "base": [
      [
        40,
        47,
        35,
        30,
        38,
        65
      ],
      [
        55,
        72,
        51,
        42,
        50,
        90
      ],
      [
        75,
        100,
        70,
        55,
        65,
        115
      ]
    ],
    "weight": 300,
    "ability": 26,
    "title": "風冠の小鳥",
    "home": "明るい草原",
    "eco": [
      "青灰色の羽毛と風になびく冠羽が特徴。仲間と朝の空を飛ぶ。",
      "翼が伸び、気流を読む。風に乗って遠くの草原まで飛ぶ。",
      "大きな翼と長い尾羽で空を駆ける。風切り音だけを残して急降下する。"
    ],
    "learn": [
      [
        1,
        "ぶつかる"
      ],
      [
        1,
        "なきおどし"
      ],
      [
        4,
        "はねうち"
      ],
      [
        8,
        "せんこうづき"
      ],
      [
        12,
        "かぜまとい"
      ],
      [
        16,
        "はやぶさおとし"
      ],
      [
        21,
        "かえしばね"
      ],
      [
        26,
        "はねづくろい"
      ],
      [
        32,
        "そらさき"
      ],
      [
        40,
        "つばさぎり"
      ],
      [
        48,
        "てんくうらっか"
      ]
    ],
    "catch": 210,
    "tier": 0.04
  },
  {
    "key": "dew-bug",
    "ids": [
      334,
      335,
      336
    ],
    "names": [
      "ツユマユ",
      "シズクサナギ",
      "ミズハネ"
    ],
    "types": [
      [
        11
      ],
      [
        11
      ],
      [
        11,
        2
      ]
    ],
    "levels": [
      7,
      12
    ],
    "plans": [
      "bug",
      "blob",
      "bug"
    ],
    "arch": "mystic",
    "base": [
      [
        40,
        28,
        35,
        26,
        35,
        26
      ],
      [
        48,
        25,
        75,
        30,
        65,
        22
      ],
      [
        65,
        45,
        60,
        95,
        85,
        90
      ]
    ],
    "weight": 200,
    "ability": 27,
    "title": "朝露の翅",
    "home": "湿った草葉",
    "eco": [
      "葉の触角と背中に朝露をためる小さな幼虫。雨の日は元気に動く。",
      "朝露を含んだ透明な繭に包まれ、羽化を待つ。",
      "水滴のような透明の翅で舞う。雨を吸って力を取り戻す。"
    ],
    "learn": [
      [
        1,
        "かみつきあご"
      ],
      [
        1,
        "ねばりいと"
      ],
      [
        5,
        "はおとのなみ"
      ],
      [
        7,
        "かたいから"
      ],
      [
        12,
        "みずはじき"
      ],
      [
        14,
        "りんぷんまい"
      ],
      [
        18,
        "しびれりんぷん"
      ],
      [
        22,
        "みなわだま"
      ],
      [
        26,
        "くもよび"
      ],
      [
        30,
        "しんくうばね"
      ],
      [
        36,
        "おおなみ"
      ],
      [
        43,
        "むれのまい"
      ]
    ],
    "catch": 240,
    "tier": 0.025
  },
  {
    "key": "earth-armor",
    "ids": [
      765,
      766
    ],
    "names": [
      "コロガネ",
      "ガンヨロイ"
    ],
    "types": [
      [
        8
      ],
      [
        8,
        16
      ]
    ],
    "levels": [
      24
    ],
    "plans": [
      "quad",
      "quad"
    ],
    "arch": "tank",
    "base": [
      [
        55,
        55,
        80,
        25,
        45,
        25
      ],
      [
        85,
        100,
        125,
        35,
        85,
        40
      ]
    ],
    "weight": 99,
    "ability": 28,
    "title": "土石の甲羅",
    "home": "土の斜面や岩場",
    "eco": [
      "土と砂岩の甲羅を持つ。危険が近づくと丸まって転がる。",
      "鉱石を取り込んだ厚い装甲を持ち、前脚で硬い地面を掘る。"
    ],
    "learn": [
      [
        1,
        "ぶつかる"
      ],
      [
        1,
        "みをかためる"
      ],
      [
        5,
        "すなげり"
      ],
      [
        9,
        "すなけむり"
      ],
      [
        14,
        "つちなだれ"
      ],
      [
        19,
        "だいちのかご"
      ],
      [
        24,
        "くろがねうち"
      ],
      [
        30,
        "ふみかためうち"
      ],
      [
        36,
        "てっついくだき"
      ],
      [
        44,
        "だいちわり"
      ]
    ],
    "catch": 155,
    "tier": 0.09
  },
  {
    "key": "moon-deer",
    "ids": [
      1002,
      1003
    ],
    "names": [
      "ルナシカ",
      "セイリンカ"
    ],
    "types": [
      [
        10
      ],
      [
        10,
        13
      ]
    ],
    "levels": [
      35
    ],
    "plans": [
      "quad",
      "quad"
    ],
    "arch": "mystic",
    "base": [
      [
        50,
        34,
        44,
        70,
        65,
        52
      ],
      [
        80,
        55,
        75,
        115,
        105,
        80
      ]
    ],
    "weight": 1,
    "ability": 29,
    "title": "星月の鹿",
    "home": "第1街道の静かな草むら",
    "eco": [
      "銀白色の体毛と半透明の角。星形の模様が淡く光る。昼夜を問わず ごくまれに姿を見せる。",
      "星空を思わせるたてがみと月形の角を持つ。念力と霊の力で星月光を放つ。"
    ],
    "learn": [
      [
        1,
        "ぶつかる"
      ],
      [
        1,
        "なきおどし"
      ],
      [
        4,
        "ねんどう"
      ],
      [
        9,
        "しんがん"
      ],
      [
        14,
        "げんわくは"
      ],
      [
        19,
        "ねんのかべ"
      ],
      [
        25,
        "しねんほう"
      ],
      [
        30,
        "こころのいやし"
      ],
      [
        35,
        "せいげっこう"
      ],
      [
        40,
        "たたりび"
      ],
      [
        48,
        "れいきのなみ"
      ],
      [
        55,
        "むねんむそう"
      ]
    ],
    "catch": 75,
    "tier": 0.85,
    "rare": true,
    "signature": "せいげっこう"
  }
];

const ROUTE1_SPECIES=new Map(ROUTE1_LINES.flatMap(f=>f.ids.map((id,i)=>[id,{family:f,stage:i}])));
const ROUTE1_IDS=new Set(ROUTE1_SPECIES.keys()),ROUTE1_RARE=ROUTE1_LINES[4].ids[0];
function route1FamilyRare(id){return !!ROUTE1_SPECIES.get(id)?.family.rare;}
function applyRoute1Families(lines=ROUTE1_LINES){
 for(const r of lines){
  const f=FAMS[SP[r.ids[0]].fam],oldIds=f.ids.slice();
  // The unused old third forms are preserved as distinct provisional single-stage species.
  for(const id of oldIds.filter(id=>!r.ids.includes(id))){
   const sp=SP[id],fid=FAMS.length,old={...f,id:fid,n:1,ids:[id],pre:sp.name,t1:sp.types[0],t2:sp.types[1]??-1,t2From:0,evo:[],book:-id,bst0:sp.bst,bstN:sp.bst,one:true,starter:false,legend:false,learn:f.learn.map(v=>v.slice()),sig:-1,title:'旧原画・保留',home:f.home};
   FAMS.push(old);Object.assign(sp,{fam:fid,stage:0,forms:1,rank:1,evoLv:0,next:0,prev:0});
  }
  Object.assign(f,{n:r.ids.length,ids:r.ids.slice(),pre:r.names[0],t1:r.types[0][0],t2:r.types.at(-1)[1]??-1,t2From:Math.max(0,r.types.findIndex(t=>t.length>1)),tier:r.tier,plan:r.plans.at(-1),arch:r.arch,abil:r.ability,growth:1,learn:r.learn.map(([lv,name])=>{const id=moveId(name);if(id<0)throw Error('route1 move '+name);return [lv,id];}),evo:r.levels.slice(),bst0:r.base[0].reduce((a,b)=>a+b),bstN:r.base.at(-1).reduce((a,b)=>a+b),cb:r.catch,book:r.ids[0],title:r.title,home:r.home,starter:false,legend:false,hab:'land',ori:r.arch==='mystic'?1:0,rareRoute1:!!r.rare,one:false,sig:-1});
  for(let i=0;i<r.ids.length;i++){
   const id=r.ids[i],sp=SP[id],base=r.base[i].slice(),bst=base.reduce((a,b)=>a+b),rank=i/(r.ids.length-1);
   Object.assign(sp,{name:r.names[i],stage:i,forms:r.ids.length,rank,types:r.types[i].slice(),base,bst,abil:r.ability,evoLv:r.levels[i]||0,next:r.ids[i+1]||0,prev:r.ids[i-1]||0,catch:Math.max(25,Math.round(r.catch*(1-.65*rank))),yield:Math.max(30,Math.floor(bst*.36-35)),growth:1,eco:r.eco[i]});
   BOOK_SP[id-1]=[sp.name,sp.types[0],sp.types[1]??-1,sp.eco];
  }
 }
}
function setRoute1Encounters(){
 const c=CELLS['0,3'];if(!c||c.name!=='第1街道')throw Error('route1 not found');
 const former=c.land.slice(),next=ROUTE1_LINES.slice(0,4).map(r=>SP[r.ids[0]].fam);c.land=next;c.rare=SP[ROUTE1_RARE].fam;
 // Keep unapproved originals available somewhere, without polluting the first route.
 const other=WORLD.areas.filter(v=>v!==c&&v.kind!=='sea');
 for(const fid of former)if(!next.includes(fid)&&fid!==c.rare&&!other.some(v=>v.land.includes(fid))){
  const f=FAMS[fid],v=other.slice().sort((x,y)=>Math.abs(x.prog-f.tier*50)-Math.abs(y.prog-f.tier*50)||x.land.length-y.land.length)[0];if(v)v.land.push(fid);
 }
}
function route1Roll(n){if(!Number.isInteger(n)||n<0||n>=1000)throw RangeError('route1 roll');let x=n;for(const f of ROUTE1_LINES){if(x<f.weight)return f;x-=f.weight;}throw Error('route1 weights');}
function route1WildPick(cell,partner=false){
 const r=route1Roll(ri(partner?999:1000)),lv=r.rare?4+ri(2):3+ri(3);return{sp:r.ids[0],lv,rare:!!r.rare};
}
function route1MoveAllowed(sp,id){const r=ROUTE1_SPECIES.get(sp.id);if(!r)return true;const f=r.family;if(f.signature&&MOVES[id].name===f.signature)return r.stage===f.ids.length-1;return true;}
function route1Speed(m){return abilOf(m)===26&&m.hp===maxHP(m)?1.2:1;}
function route1StarWard(B,m,mv,eff){return abilOf(m)===29&&eff>1&&mv.pow>0&&!mv.has('fixed')&&!mv.has('level')&&!mv.has('halve')&&!starterState(B,m).starWard;}
function route1DamageScale(B,m,mv,eff,opponent=true){if(!opponent)return 1;if(abilOf(m)===28&&mv.phys&&m.hp===maxHP(m))return .75;if(route1StarWard(B,m,mv,eff))return .7;return 1;}
async function route1RainHeal(B,s){const m=bmon(B,s);if(abilOf(m)!==27||B.weather!=='rain'||m.hp<=0||m.hp>=maxHP(m))return false;m.hp=Math.min(maxHP(m),m.hp+Math.max(1,Math.floor(maxHP(m)/16)));healFx(s);await hpAnim(B,s);await say(bname(B,s)+'の 「朝露」で HPが 回復した！');return true;}
function route1PickupItem(roll){return roll<50?'heal1':roll<80?'fuda':roll<95?'c_par':'I0009';}
async function route1Pickup(result,o){if(o.facility||!['win','caught'].includes(result))return;for(const m of S.party)if(m.hp>0&&abilOf(m)===25&&ri(100)<10){const item=route1PickupItem(ri(100));bagAdd(item);sfx('get');await msg(monName(m)+'の 「拾いもの」！ '+ITEMS[item].n+'を 見つけた。');}}
function route1RareCry(){if(!SND||!AC)return;try{const t=AC.currentTime;[740,988,1480,1175].forEach((hz,i)=>{const o=AC.createOscillator(),g=AC.createGain(),s=t+i*.095;o.type='sine';o.frequency.setValueAtTime(hz,s);o.frequency.exponentialRampToValueAtTime(hz*.92,s+.19);g.gain.setValueAtTime(0,s);g.gain.linearRampToValueAtTime(.075,s+.025);g.gain.exponentialRampToValueAtTime(.001,s+.30);o.connect(g);g.connect(AC.destination);o.start(s);o.stop(s+.31);});}catch(e){}}
async function route1RareIntro(m){route1RareCry();if(!reducedFx()){const T=fxPos(1);startIndividualMotion(m,'alert');ring(T.x,T.y,'203,211,255',{dr:2.5,w:1.6,life:26,max:26});ring(T.x,T.y,'255,226,145',{dr:1.5,w:1.3,life:24,max:24});sparkleFx(T.x,T.y,26);await sleep(360);}await say('星の光が きらめいた！ めずらしい アニマだ！');}
