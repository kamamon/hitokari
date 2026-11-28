'use strict';
const ROUTE4_KEY='2,1';
const ROUTE4_INNER='a:route4-gorge:2,1';
const ROUTE4_LINES=[
  {
    "key": "hollow-seed",
    "ids": [
      609,
      610
    ],
    "names": [
      "タネウツロ",
      "ウツロギ"
    ],
    "types": [
      [
        4
      ],
      [
        4,
        16
      ]
    ],
    "levels": [
      25
    ],
    "plans": [
      "plant",
      "golem"
    ],
    "arch": "tank",
    "base": [
      [
        58,
        46,
        66,
        39,
        52,
        29
      ],
      [
        88,
        85,
        125,
        50,
        92,
        40
      ]
    ],
    "weight": 24,
    "ability": 49,
    "title": "樹洞の種",
    "home": "木漏れ日の渓流街道の林床",
    "eco": [
      "木の種の空洞にあたたかな光を宿す。落ち葉と苔で体を守る。",
      "根と木甲が幾層にも重なる。樹洞に蓄えた樹液で傷を癒す。"
    ],
    "learn": [
      [
        1,
        "はっぱうち"
      ],
      [
        1,
        "みをかためる"
      ],
      [
        7,
        "わかばのかぜ"
      ],
      [
        10,
        "こけのころも"
      ],
      [
        14,
        "たねつぶて"
      ],
      [
        19,
        "いのちすい"
      ],
      [
        25,
        "てつづめ"
      ],
      [
        31,
        "くろがねのたて"
      ],
      [
        38,
        "もりのやいば"
      ],
      [
        46,
        "くろがねうち"
      ]
    ],
    "catch": 180,
    "tier": 0.19
  },
  {
    "key": "droplet-kite",
    "ids": [
      528,
      529
    ],
    "names": [
      "アワトビ",
      "セセラトビ"
    ],
    "types": [
      [
        2
      ],
      [
        2,
        9
      ]
    ],
    "levels": [
      24
    ],
    "plans": [
      "blob",
      "bird"
    ],
    "arch": "fast",
    "base": [
      [
        48,
        35,
        43,
        60,
        54,
        68
      ],
      [
        68,
        55,
        65,
        105,
        80,
        112
      ]
    ],
    "weight": 20,
    "ability": 50,
    "title": "清流の水滴",
    "home": "せせらぎ川の岸辺",
    "eco": [
      "三角の透明な水滴体が跳ね、薄い水膜が体を包む。",
      "澄んだ流れをまとって大きな水の翼を開く。水膜は熱を受け流す。"
    ],
    "learn": [
      [
        1,
        "みずはじき"
      ],
      [
        1,
        "なきおどし"
      ],
      [
        6,
        "しぶきづき"
      ],
      [
        10,
        "うるおい"
      ],
      [
        15,
        "みなわだま"
      ],
      [
        20,
        "なみうち"
      ],
      [
        24,
        "かぜきり"
      ],
      [
        30,
        "つむじかぜ"
      ],
      [
        37,
        "ながれにのる"
      ],
      [
        44,
        "おおなみ"
      ]
    ],
    "catch": 175,
    "tier": 0.195
  },
  {
    "key": "amber-canopy",
    "ids": [
      358,
      359
    ],
    "names": [
      "ホノカサ",
      "ヒガサネ"
    ],
    "types": [
      [
        1,
        11
      ],
      [
        1,
        11
      ]
    ],
    "levels": [
      26
    ],
    "plans": [
      "bug",
      "bug"
    ],
    "arch": "mystic",
    "base": [
      [
        46,
        40,
        50,
        68,
        48,
        48
      ],
      [
        72,
        60,
        75,
        120,
        86,
        82
      ]
    ],
    "weight": 18,
    "ability": 51,
    "title": "灯熱の傘",
    "home": "渓流の木陰",
    "eco": [
      "傘状の琥珀の殻に火を灯し、夜の森を照らす。",
      "幾層もの燃える花弁を開き、蓄えた熱で最初の一撃を放つ。"
    ],
    "learn": [
      [
        1,
        "ひばな"
      ],
      [
        1,
        "ねばりいと"
      ],
      [
        7,
        "はおとのなみ"
      ],
      [
        11,
        "くすぶり"
      ],
      [
        15,
        "かげろう"
      ],
      [
        20,
        "ほむらだま"
      ],
      [
        26,
        "りんぷんまい"
      ],
      [
        32,
        "ほのおのいのり"
      ],
      [
        39,
        "れっかのうず"
      ],
      [
        46,
        "しんくうばね"
      ]
    ],
    "catch": 160,
    "tier": 0.2
  },
  {
    "key": "woven-wing",
    "ids": [
      424,
      425
    ],
    "names": [
      "イトハネ",
      "オリハネ"
    ],
    "types": [
      [
        11,
        9
      ],
      [
        11,
        9
      ]
    ],
    "levels": [
      27
    ],
    "plans": [
      "bug",
      "bird"
    ],
    "arch": "fast",
    "base": [
      [
        43,
        36,
        44,
        56,
        60,
        72
      ],
      [
        65,
        52,
        62,
        98,
        91,
        122
      ]
    ],
    "weight": 16,
    "ability": 52,
    "title": "風織りの翼",
    "home": "木漏れ日の草むらと花畑",
    "eco": [
      "菱形の糸の翅と金色の房を持つ。細い糸で風を読む。",
      "織物のような翅を展開し、細い糸の流れで素早く技を整える。"
    ],
    "learn": [
      [
        1,
        "はおとのなみ"
      ],
      [
        1,
        "ねばりいと"
      ],
      [
        7,
        "かぜきり"
      ],
      [
        11,
        "かぜにのる"
      ],
      [
        16,
        "りんぷんだま"
      ],
      [
        21,
        "つむじかぜ"
      ],
      [
        27,
        "むれのまい"
      ],
      [
        33,
        "しんくうばね"
      ],
      [
        40,
        "はねづくろい"
      ],
      [
        47,
        "らんきりゅう"
      ]
    ],
    "catch": 155,
    "tier": 0.21
  },
  {
    "key": "carving-beak",
    "ids": [
      654,
      655
    ],
    "names": [
      "ホリクチ",
      "キリクチ"
    ],
    "types": [
      [
        8
      ],
      [
        8,
        6
      ]
    ],
    "levels": [
      28
    ],
    "plans": [
      "quad",
      "quad"
    ],
    "arch": "power",
    "base": [
      [
        54,
        67,
        58,
        26,
        41,
        40
      ],
      [
        85,
        120,
        95,
        40,
        70,
        80
      ]
    ],
    "weight": 15,
    "ability": 53,
    "title": "木砕きの刃",
    "home": "岩と古木の多い山道",
    "eco": [
      "木工刃のような嘴と太い掘削脚で根の間を掘る。",
      "木と岩が重なる装甲を持つ。硬い相手の装甲を土技で砕く。"
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
        7,
        "すなげり"
      ],
      [
        11,
        "どろなげ"
      ],
      [
        15,
        "つちばしり"
      ],
      [
        20,
        "つちなだれ"
      ],
      [
        28,
        "こづき"
      ],
      [
        34,
        "ちそうぎり"
      ],
      [
        40,
        "だいちわり"
      ],
      [
        46,
        "まわしうち"
      ]
    ],
    "catch": 155,
    "tier": 0.215
  },
  {
    "key": "resonator",
    "ids": [
      927,
      928,
      929
    ],
    "names": [
      "ネノオト",
      "カナネ",
      "キョウリン"
    ],
    "types": [
      [
        10
      ],
      [
        10
      ],
      [
        10,
        16
      ]
    ],
    "levels": [
      22,
      40
    ],
    "plans": [
      "ghost",
      "ghost",
      "golem"
    ],
    "arch": "mystic",
    "base": [
      [
        48,
        32,
        47,
        65,
        67,
        42
      ],
      [
        65,
        45,
        68,
        88,
        88,
        56
      ],
      [
        84,
        60,
        92,
        125,
        105,
        64
      ]
    ],
    "weight": 7,
    "ability": 54,
    "title": "共鳴の音叉",
    "home": "渓流の奥地と静かな木立",
    "eco": [
      "金色の音叉と緑の光球を持つ木の共鳴器。小さな音で仲間と会話する。",
      "複数の木製共鳴器から澄んだ音を発する。木々の間で音を集める。",
      "大樹のように重なる木甲と金属音叉を持つ。響き渡る音で空気を震わせる。"
    ],
    "learn": [
      [
        1,
        "ねんどう"
      ],
      [
        1,
        "なきおどし"
      ],
      [
        7,
        "こだまごえ"
      ],
      [
        11,
        "しんがん"
      ],
      [
        16,
        "ひびきのは"
      ],
      [
        22,
        "げんわくは"
      ],
      [
        28,
        "ねんのかべ"
      ],
      [
        34,
        "しねんのなみ"
      ],
      [
        40,
        "かなきりごえ"
      ],
      [
        46,
        "きょうめいほう"
      ],
      [
        54,
        "じりょくほう"
      ]
    ],
    "catch": 100,
    "tier": 0.245
  }
];
const ROUTE4_ABILITIES=[{"n":"樹洞","d":"戦闘中 初めてHPが半分以下に減ったとき 最大HPの1/10を回復（1戦1回）"},{"n":"水膜","d":"やけどに ならない"},{"n":"灯熱","d":"戦闘中 最初に使う焔の攻撃技の威力が1.2倍"},{"n":"風織り","d":"戦闘中 最初に使う変化技の優先度が1高い"},{"n":"木砕き","d":"鉄・巌タイプの相手に使う土の攻撃技の威力が1.2倍"},{"n":"共鳴","d":"声・音・共鳴の攻撃技の威力が1.2倍"}];

const ROUTE4_SPECIES=new Map(ROUTE4_LINES.flatMap(f=>f.ids.map((id,stage)=>[id,{family:f,stage}])));
const ROUTE4_IDS=new Set(ROUTE4_SPECIES.keys());
const ROUTE4_ZONES={main:{lv:[9,12],weights:[24,20,18,16,15,7],double:.15},gorge:{lv:[11,13],weights:[18,22,16,14,13,17],double:.20}};
const ROUTE4_SOUND=new Set(['こだまごえ','ひびきのは','きょうめいほう','はおとのなみ','かなきりごえ','ごうおん','はおとほう','めいかいのよびごえ','じひびきとつげき']);
function setRoute4Encounters(){
 const c=CELLS[ROUTE4_KEY],former=c.land.slice(),water=c.water.slice(),next=ROUTE4_LINES.map(f=>SP[f.ids[0]].fam);c.land=next;c.water=[SP[528].fam];c.rare=null;
 const other=WORLD.areas.filter(a=>!['0,3','0,1','0,0',ROUTE3_KEY,ROUTE4_KEY].includes(a.key)&&a.kind!=='sea');
 for(const [kind,old] of [['land',former],['water',water]])for(const fid of old){if(c[kind].includes(fid)||other.some(a=>a[kind]?.includes(fid)))continue;const f=FAMS[fid],target=other.slice().sort((a,b)=>Math.abs(a.prog-f.tier*50)-Math.abs(b.prog-f.tier*50)||(a[kind]?.length||0)-(b[kind]?.length||0))[0];if(target)target[kind].push(fid);}
}
function route4Roll(n,zone='main'){if(!Number.isInteger(n)||n<0||n>=100)throw RangeError('route4 roll');const ws=(ROUTE4_ZONES[zone]||ROUTE4_ZONES.main).weights;for(let j=0;j<ws.length;j++){if(n<ws[j])return ROUTE4_LINES[j];n-=ws[j];}throw Error('route4 weights');}
function route4WildPick(zone='main',kind='land'){const z=ROUTE4_ZONES[zone]||ROUTE4_ZONES.main;return{sp:kind==='water'?528:route4Roll(ri(100),zone).ids[0],lv:z.lv[0]+ri(z.lv[1]-z.lv[0]+1)};}
function route4MoveAllowed(sp,id){const r=ROUTE4_SPECIES.get(sp.id);if(!r)return true;const sec=r.family.types.at(-1)[1];return sec==null||r.family.types[r.stage].includes(sec)||MOVES[id].type!==sec;}
function route4Priority(B,m,mv){return mv.prio+(abilOf(m)===52&&mv.pow===0&&!starterState(B,m).r4Woven?1:0);}
async function route4BeginMove(B,sd,mv){
 const u=bmon(B,sd),ab=abilOf(u),f=starterState(B,u);B.r4FireActor=null;B.r4LastBoost=false;
 if(ab===51&&mv.type===1&&route3NormalAttack(mv)){
  const use=B.extra?!!B.r4SpreadBoost:!f.r4FireUsed;
  if(use){B.r4FireActor=u;B.r4LastBoost=true;if(!B.extra){f.r4FireUsed=true;await say(bname(B,sd)+'の 「灯熱」！ 最初の 炎が 強まった！');}}
 }
 if(ab===52&&mv.pow===0&&!B.extra&&!f.r4Woven){f.r4Woven=true;await say(bname(B,sd)+'の 「風織り」！');}
}
function route4Power(B,a,t,mv){
 if(!route3NormalAttack(mv))return 1;
 const ab=abilOf(a);
 if(ab===51&&mv.type===1&&(B?.r4FireActor===a||!starterState(B,a).r4FireUsed))return 1.2;
 if(ab===53&&mv.type===8&&SP[t.sp].types.some(x=>x===12||x===16))return 1.2;
 if(ab===54&&ROUTE4_SOUND.has(mv.name))return 1.2;
 return 1;
}
async function route4Hollow(B,s,from){
 const u=bmon(B,s),mx=maxHP(u);
 if(abilOf(u)!==49||u.hp<=0||!Number.isFinite(from)||from*2<=mx||u.hp*2>mx||starterState(B,u).r4Hollow)return false;
 starterState(B,u).r4Hollow=true;u.hp=Math.min(mx,u.hp+Math.max(1,Math.floor(mx/10)));healFx(s);sfx('heal');await hpAnim(B,s);await say(bname(B,s)+'は 「樹洞」で HPを 回復した！');return true;
}
