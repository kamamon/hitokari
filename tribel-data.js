'use strict';
const TRIBEL_KEY='0,0';
const TRIBEL_LINES=[
  {
    "key": "leaf-crest",
    "ids": [
      546,
      547
    ],
    "names": [
      "ミドハク",
      "ソウレイオ"
    ],
    "types": [
      [
        0,
        4
      ],
      [
        0,
        4
      ]
    ],
    "levels": [
      22
    ],
    "plans": [
      "quad",
      "quad"
    ],
    "arch": "fast",
    "base": [
      [
        50,
        56,
        42,
        36,
        44,
        72
      ],
      [
        75,
        105,
        65,
        50,
        70,
        105
      ]
    ],
    "ability": 38,
    "title": "草冠の疾走獣",
    "home": "中央草原・草原の奥地",
    "eco": [
      "大きな草刃の耳で風向きを読み、草原を駆ける。",
      "黄金の蹄と葉のたてがみを持ち、群れの先頭で安全な道を選ぶ。"
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
        "はっぱうち"
      ],
      [
        9,
        "つるばしり"
      ],
      [
        13,
        "めぶきのまい"
      ],
      [
        20,
        "はやてづき"
      ],
      [
        22,
        "いばらむち"
      ],
      [
        25,
        "かぜにのる"
      ],
      [
        30,
        "やまかぜぎり"
      ],
      [
        36,
        "つばさぎり"
      ],
      [
        44,
        "もりのやいば"
      ]
    ],
    "catch": 190,
    "tier": 0.105,
    "weight": 20
  },
  {
    "key": "crystal-burrow",
    "ids": [
      265,
      266
    ],
    "names": [
      "コウガリ",
      "ガンソウガ"
    ],
    "types": [
      [
        12
      ],
      [
        12,
        8
      ]
    ],
    "levels": [
      25
    ],
    "plans": [
      "quad",
      "quad"
    ],
    "arch": "tank",
    "base": [
      [
        52,
        58,
        74,
        29,
        43,
        29
      ],
      [
        82,
        106,
        128,
        38,
        78,
        48
      ]
    ],
    "ability": 39,
    "title": "晶脈の掘削獣",
    "home": "岩石地帯・乾いた地中",
    "eco": [
      "鉱石の前爪で土を掘り、背の結晶を育てる。",
      "幾層もの岩板で体を守り、巨大な鉱爪で硬い岩盤を掘り抜く。"
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
        6,
        "こいしなげ"
      ],
      [
        10,
        "いわはだ"
      ],
      [
        15,
        "すなつぶて"
      ],
      [
        20,
        "がけくずし"
      ],
      [
        25,
        "ばんじゃくうち"
      ],
      [
        25,
        "つちなだれ"
      ],
      [
        32,
        "こうせきのきらめき"
      ],
      [
        40,
        "きょがんほう"
      ]
    ],
    "catch": 160,
    "tier": 0.115,
    "weight": 12
  },
  {
    "key": "petal-lantern",
    "ids": [
      1188,
      1189,
      1190
    ],
    "names": [
      "ハナトワ",
      "マユトワ",
      "フロルヴェイル"
    ],
    "types": [
      [
        11,
        4
      ],
      [
        11,
        4
      ],
      [
        11,
        4
      ]
    ],
    "levels": [
      16,
      34
    ],
    "plans": [
      "bug",
      "blob",
      "bug"
    ],
    "arch": "mystic",
    "base": [
      [
        44,
        35,
        42,
        55,
        50,
        49
      ],
      [
        60,
        37,
        88,
        65,
        78,
        30
      ],
      [
        72,
        48,
        68,
        108,
        110,
        90
      ]
    ],
    "ability": 41,
    "title": "灯花の変態虫",
    "home": "陽だまりの草地・花畑",
    "eco": [
      "花弁に似た装甲で体を隠し、花粉を集めて育つ。",
      "金色の光が透ける花弁の繭で成長を待つ。",
      "長い桃紫色の花翅で舞い、花蜜と香りを草原全体に運ぶ。"
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
        6,
        "わかばのかぜ"
      ],
      [
        9,
        "みつあつめ"
      ],
      [
        14,
        "かふんだま"
      ],
      [
        16,
        "いのちすい"
      ],
      [
        24,
        "かおりのいやし"
      ],
      [
        34,
        "りんぷんまい"
      ],
      [
        38,
        "ようぶんうばい"
      ],
      [
        44,
        "はなあらし"
      ]
    ],
    "catch": 170,
    "tier": 0.12,
    "weight": 12
  },
  {
    "key": "golden-crown",
    "ids": [
      849,
      850
    ],
    "names": [
      "カナツノ",
      "オウリシカ"
    ],
    "types": [
      [
        4
      ],
      [
        4,
        8
      ]
    ],
    "levels": [
      24
    ],
    "plans": [
      "quad",
      "quad"
    ],
    "arch": "power",
    "base": [
      [
        52,
        57,
        52,
        41,
        47,
        55
      ],
      [
        83,
        112,
        88,
        58,
        80,
        65
      ]
    ],
    "ability": 38,
    "title": "金冠の根角獣",
    "home": "草原の奥地・風見の丘",
    "eco": [
      "丸みのある葉耳で地面の振動を感じ取り、根を掘り出して食べる。",
      "渦を巻く樹角と黄金の葉甲で仲間を守り、蹄で硬い大地を耕す。"
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
        "はっぱうち"
      ],
      [
        9,
        "つるばしり"
      ],
      [
        13,
        "めぶきのまい"
      ],
      [
        17,
        "いばらむち"
      ],
      [
        20,
        "はやてづき"
      ],
      [
        24,
        "ちそうぎり"
      ],
      [
        25,
        "かぜにのる"
      ],
      [
        30,
        "やまかぜぎり"
      ],
      [
        36,
        "つばさぎり"
      ],
      [
        44,
        "もりのやいば"
      ]
    ],
    "catch": 180,
    "tier": 0.119,
    "weight": 17
  },
  {
    "key": "copper-shovel",
    "ids": [
      100,
      101
    ],
    "names": [
      "ドウホリ",
      "ドウザンク"
    ],
    "types": [
      [
        12
      ],
      [
        12,
        16
      ]
    ],
    "levels": [
      27
    ],
    "plans": [
      "quad",
      "quad"
    ],
    "arch": "tank",
    "base": [
      [
        53,
        61,
        70,
        30,
        44,
        32
      ],
      [
        85,
        110,
        125,
        43,
        80,
        47
      ]
    ],
    "ability": 39,
    "title": "銅晶の大掘爪獣",
    "home": "鉱石の多い岩石地帯",
    "eco": [
      "赤銅の前爪と藍色の外殻で岩の隙間を掘る。",
      "硬い銅晶の螺旋爪と層状装甲を発達させ、鉱脈を守る。"
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
        6,
        "こいしなげ"
      ],
      [
        10,
        "いわはだ"
      ],
      [
        15,
        "すなつぶて"
      ],
      [
        20,
        "がけくずし"
      ],
      [
        27,
        "ばんじゃくうち"
      ],
      [
        28,
        "てつづめ"
      ],
      [
        33,
        "くろがねのたて"
      ],
      [
        40,
        "くろがねうち"
      ],
      [
        46,
        "おおあごくだき"
      ]
    ],
    "catch": 150,
    "tier": 0.125,
    "weight": 10
  },
  {
    "key": "orchid-moth",
    "ids": [
      190,
      191,
      192
    ],
    "names": [
      "サキムシ",
      "サキマユ",
      "ランフローラ"
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
        9
      ]
    ],
    "levels": [
      17,
      33
    ],
    "plans": [
      "bug",
      "blob",
      "bug"
    ],
    "arch": "fast",
    "base": [
      [
        42,
        42,
        40,
        47,
        43,
        61
      ],
      [
        54,
        39,
        82,
        53,
        70,
        35
      ],
      [
        67,
        56,
        62,
        103,
        77,
        122
      ]
    ],
    "ability": 41,
    "title": "蘭翅の変態虫",
    "home": "しずく湖近くの花畑",
    "eco": [
      "赤い花弁の額当てと淡い触角を持つ花畑の幼虫。",
      "重なった花弁の殻を閉じ、静かな場所で変態する。",
      "紫と珊瑚色の細長い蘭翅で上昇気流を捉え、高速で花を巡る。"
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
        6,
        "わかばのかぜ"
      ],
      [
        9,
        "みつあつめ"
      ],
      [
        17,
        "かふんだま"
      ],
      [
        28,
        "いのちすい"
      ],
      [
        33,
        "つむじかぜ"
      ],
      [
        34,
        "めぶきのかぜ"
      ],
      [
        41,
        "はなあらし"
      ]
    ],
    "catch": 175,
    "tier": 0.128,
    "weight": 11
  },
  {
    "key": "water-veil",
    "ids": [
      484,
      485
    ],
    "names": [
      "シズミル",
      "アクアヴェル"
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
      26
    ],
    "plans": [
      "quad",
      "quad"
    ],
    "arch": "mystic",
    "base": [
      [
        48,
        39,
        48,
        61,
        57,
        53
      ],
      [
        75,
        55,
        72,
        108,
        100,
        80
      ]
    ],
    "ability": 41,
    "title": "水膜の湖棲獣",
    "home": "しずく湖の浅瀬・水辺の草地",
    "eco": [
      "透明な水滴の飾りを持ち、水辺の植物の間を泳ぐ。",
      "広い水膜を背に広げて流れを制御し、水面から滑空する。"
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
        6,
        "みずはじき"
      ],
      [
        10,
        "うるおい"
      ],
      [
        15,
        "しぶきづき"
      ],
      [
        20,
        "みずのころも"
      ],
      [
        26,
        "どくしぶき"
      ],
      [
        26,
        "いやしのいき"
      ],
      [
        30,
        "なみうち"
      ],
      [
        36,
        "しょうきだん"
      ],
      [
        44,
        "おおなみ"
      ],
      [
        50,
        "ふはいのきり"
      ]
    ],
    "catch": 145,
    "tier": 0.132,
    "weight": 12
  },
  {
    "key": "sail-drake",
    "ids": [
      1062,
      1063
    ],
    "names": [
      "ハクサイル",
      "テンリューヴ"
    ],
    "types": [
      [
        9
      ],
      [
        9,
        14
      ]
    ],
    "levels": [
      32
    ],
    "plans": [
      "quad",
      "bird"
    ],
    "arch": "fast",
    "base": [
      [
        44,
        53,
        38,
        50,
        46,
        69
      ],
      [
        76,
        103,
        67,
        81,
        66,
        116
      ]
    ],
    "ability": 42,
    "title": "帆翼の風竜",
    "home": "風見の丘",
    "eco": [
      "白い毛と青い小さな帆翼を持ち、丘の斜面を跳ねて風を読む。",
      "長い帆翼と二本の流線尾を展開し、上昇気流に乗って遠くまで飛翔する。"
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
        6,
        "かぜきり"
      ],
      [
        10,
        "かぜまとい"
      ],
      [
        15,
        "げんわくは"
      ],
      [
        20,
        "つむじかぜ"
      ],
      [
        26,
        "しんがん"
      ],
      [
        28,
        "たつづめ"
      ],
      [
        32,
        "らんきりゅう"
      ],
      [
        33,
        "うろこうち"
      ],
      [
        39,
        "たつのかまえ"
      ],
      [
        45,
        "ひりゅうげき"
      ],
      [
        52,
        "ばんじゃくうち"
      ]
    ],
    "catch": 105,
    "tier": 0.145,
    "weight": 6
  }
];
const TRIBEL_ABILITIES=[{"n":"駆け足","d":"野生戦の 逃走判定を 有利にする"},{"n":"反撃針","d":"相手の接触攻撃で ダメージを受けると 相手の最大HPの1/8を削る"},{"n":"火守り","d":"相手の焔技を無効化し その戦闘中 自分の焔技が1.5倍"},{"n":"花蜜","d":"自分が使う回復技・吸収技の回復量が1.2倍"},{"n":"風の護り","d":"登場から3ターン 味方全体の素早さが1.2倍"}];

const TRIBEL_SPECIES=new Map(TRIBEL_LINES.flatMap(f=>f.ids.map((id,i)=>[id,{family:f,stage:i}])));
const TRIBEL_IDS=new Set(TRIBEL_SPECIES.keys());
const TRIBEL_REAR_IDS=new Set(); // Approved front art; player-side view uses reflection until true rear art is approved.
const TRIBEL_ENCOUNTERS=TRIBEL_LINES.map(f=>[f.ids[0],f.weight]);
const TRIBEL_ZONES={
 meadow:{levels:[6,9],double:.15,boost:{}},
 deep:{levels:[9,12],double:.30,boost:{546:1.6,849:2.2,1188:1.2}},
 rock:{levels:[7,10],double:.18,boost:{265:3,100:3.2,849:1.3}},
 flowers:{levels:[6,10],double:.18,boost:{1188:3.2,190:3.8,546:1.2}},
 lake:{levels:[6,10],double:.18,boost:{484:5,190:2,1188:1.4}},
 hill:{levels:[9,12],double:.24,boost:{1062:4,849:2,546:1.5}}
};
function setTribelEncounters(){
 const c=CELLS[TRIBEL_KEY],former=c.land.slice(),next=TRIBEL_ENCOUNTERS.map(([id])=>SP[id].fam);c.land=next;c.rare=null;
 const other=WORLD.areas.filter(a=>a!==c&&a!==CELLS['0,3']&&a!==CELLS['0,1']&&a.kind!=='sea');
 for(const fid of former){if(next.includes(fid)||other.some(a=>a.land.includes(fid)))continue;const f=FAMS[fid],target=other.slice().sort((a,b)=>Math.abs(a.prog-f.tier*50)-Math.abs(b.prog-f.tier*50)||a.land.length-b.land.length)[0];if(target)target.land.push(fid);}
}
function tribelWeights(zone='meadow'){const b=(TRIBEL_ZONES[zone]||TRIBEL_ZONES.meadow).boost;return TRIBEL_ENCOUNTERS.map(([id,w])=>[id,w*(b[id]||1)]);}
function tribelRoll(value,zone='meadow'){
 const weights=tribelWeights(zone),total=weights.reduce((n,v)=>n+v[1],0);let q=clamp(value,0,1-Number.EPSILON)*total;
 for(const [id,w] of weights){if(q<w)return id;q-=w;}return weights.at(-1)[0];
}
function tribelWildPick(zone='meadow'){const z=TRIBEL_ZONES[zone]||TRIBEL_ZONES.meadow;return {sp:tribelRoll(Math.random(),zone),lv:z.levels[0]+ri(z.levels[1]-z.levels[0]+1)};}
function tribelZoneAt(m,x,y){
 if(m.tribel==='lake')return x>19&&y>19?'flowers':'lake';
 if(m.tribel==='hill')return y<=10?'hill':y<=18?'rock':'deep';
 if(x<=13&&y<=12)return 'deep';if(x>=21&&y<=12)return 'rock';if(x>=21&&y>=22)return 'flowers';if(x<=12&&y>=24)return 'deep';return 'meadow';
}
function tribelEncounterCell(m,p){return {...m.cell,tribelZone:tribelZoneAt(m,p.x,p.y)};}
function tribelEscape(m){return abilOf(m)===38?96:0;}
function tribelFireBoost(B,m,mv){return abilOf(m)===40&&mv.type===1&&starterState(B,m).fireWard?1.5:1;}
function tribelHealScale(m){return abilOf(m)===41?1.2:1;}
async function tribelAbsorbFire(B,s){
 const m=bmon(B,s);if(m.hp<=0)return;const state=starterState(B,m);state.fireWard=true;await say(bname(B,s)+'は 「火守り」で 焔の 技を 吸収した！ 焔の 力が 高まった！');
}
async function tribelCounterSpines(B,sd,mv,dmg){
 const u=bmon(B,sd),t=bmon(B,1-sd);
 if(dmg<=0||u.hp<=0||abilOf(t)!==39||!starterOpponents(B,sd)||!route2Contact(mv))return;
 u.hp=Math.max(0,u.hp-Math.max(1,Math.floor(maxHP(u)/8)));await hpAnim(B,sd);await say(bname(B,sd)+'は 「反撃針」の ダメージを うけた！');
}
function tribelWind(B){if(!B)return[0,0];return B.tribelWinds||(B.tribelWinds=[0,0]);}
function tribelWindSpeed(B,s){return tribelWind(B)[s]>0?1.2:1;}
function tribelAISpeed(m,B){if(!B||!B.tribelWinds)return 1;const side=B.double?B.slots[0].some(s=>s&&s.mon===m)?0:B.slots[1].some(s=>s&&s.mon===m)?1:S?.party.includes(m)?0:1:S?.party.includes(m)?0:1;return tribelWindSpeed(B,side);}
async function tribelWindEntry(B,s,m){if(abilOf(m)!==42||m.hp<=0)return;tribelWind(B)[s]=3;await say(monName(m)+'の 「風の護り」！ 味方を 風が つつんだ！');}
async function tribelWindEnd(B){if(!B.tribelWinds)return;for(let s=0;s<2;s++)if(B.tribelWinds[s]>0&&--B.tribelWinds[s]===0)await say((s?'相手':'味方')+'の 風の護りが おさまった。');}
