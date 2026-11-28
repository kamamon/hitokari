'use strict';
// User-approved second-route land encounter roster, stable original dex IDs.
const ROUTE2_LINES=[
  {
    "key": "meadow-rabbit",
    "ids": [
      711,
      712
    ],
    "names": [
      "ノハラビ",
      "カゼクサビ"
    ],
    "types": [
      [
        4
      ],
      [
        4,
        9
      ]
    ],
    "levels": [
      20
    ],
    "plans": [
      "quad",
      "quad"
    ],
    "arch": "fast",
    "base": [
      [
        43,
        45,
        34,
        35,
        39,
        69
      ],
      [
        65,
        85,
        55,
        65,
        60,
        120
      ]
    ],
    "weight": 25,
    "ability": 30,
    "title": "葉耳の草原ウサギ",
    "home": "風の通る草原",
    "eco": [
      "長い葉のような耳で風の変化を感じる。晴れた朝は草原を跳ね回る。",
      "長い葉耳としなやかな脚で風に乗る。葉を広げて草原を駆ける。"
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
    "catch": 220,
    "tier": 0.045
  },
  {
    "key": "leaf-tanuki",
    "ids": [
      516,
      517
    ],
    "names": [
      "ホロタヌ",
      "バケダヌ"
    ],
    "types": [
      [
        0
      ],
      [
        0,
        15
      ]
    ],
    "levels": [
      23
    ],
    "plans": [
      "quad",
      "biped"
    ],
    "arch": "tank",
    "base": [
      [
        54,
        48,
        40,
        35,
        47,
        39
      ],
      [
        85,
        90,
        70,
        65,
        85,
        70
      ]
    ],
    "weight": 20,
    "ability": 31,
    "title": "落ち葉の化かし狸",
    "home": "草原の林縁",
    "eco": [
      "落ち葉をかぶり、草むらで息をひそめる。物音をまねして敵を惑わせる。",
      "葉の外套をまとい、落ち葉の残像で相手の狙いを外す。"
    ],
    "learn": [
      [
        1,
        "ぶつかる"
      ],
      [
        1,
        "すごみ"
      ],
      [
        5,
        "こだまごえ"
      ],
      [
        9,
        "きりさきづめ"
      ],
      [
        14,
        "めくらましこう"
      ],
      [
        19,
        "みがまえ"
      ],
      [
        23,
        "やみうち"
      ],
      [
        28,
        "かげがみ"
      ],
      [
        34,
        "やみにまぎれる"
      ],
      [
        42,
        "くらやみぎり"
      ]
    ],
    "catch": 200,
    "tier": 0.055
  },
  {
    "key": "meadow-hopper",
    "ids": [
      250,
      251,
      252
    ],
    "names": [
      "トビカヤ",
      "カヤキック",
      "ライガバッタ"
    ],
    "types": [
      [
        11
      ],
      [
        11,
        6
      ],
      [
        11,
        6
      ]
    ],
    "levels": [
      15,
      28
    ],
    "plans": [
      "bug",
      "bug",
      "bug"
    ],
    "arch": "fast",
    "base": [
      [
        40,
        49,
        35,
        28,
        36,
        62
      ],
      [
        55,
        78,
        55,
        35,
        50,
        85
      ],
      [
        70,
        115,
        75,
        45,
        65,
        110
      ]
    ],
    "weight": 15,
    "ability": 32,
    "title": "跳躍の草原バッタ",
    "home": "背の高い草むら",
    "eco": [
      "草の色に溶け込み、長い後脚で飛び跳ねる。",
      "脚の筋肉が発達し、正確な蹴りで相手をはじき飛ばす。",
      "金色の翅と長い後脚を持つ。跳躍から放つ蹴りは岩をも砕く。"
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
        "はねばしり"
      ],
      [
        9,
        "むれあたり"
      ],
      [
        12,
        "かたいから"
      ],
      [
        15,
        "しゅんそくけり"
      ],
      [
        19,
        "ふたえげり"
      ],
      [
        23,
        "するどいかま"
      ],
      [
        28,
        "はがんしょう"
      ],
      [
        34,
        "むれのまい"
      ],
      [
        42,
        "おおあごくだき"
      ]
    ],
    "catch": 210,
    "tier": 0.065
  },
  {
    "key": "electric-lamb",
    "ids": [
      948,
      949,
      950
    ],
    "names": [
      "パチワタ",
      "ライモコ",
      "ライテイラム"
    ],
    "types": [
      [
        3
      ],
      [
        3
      ],
      [
        3,
        0
      ]
    ],
    "levels": [
      18,
      34
    ],
    "plans": [
      "quad",
      "quad",
      "quad"
    ],
    "arch": "mystic",
    "base": [
      [
        55,
        35,
        45,
        60,
        55,
        30
      ],
      [
        73,
        45,
        61,
        84,
        75,
        40
      ],
      [
        95,
        60,
        80,
        115,
        100,
        50
      ]
    ],
    "weight": 13,
    "ability": 33,
    "title": "蓄電のヒツジ",
    "home": "開けた草原",
    "eco": [
      "ふわふわの毛に静電気をためる。仲間と寄り添って眠る。",
      "角と体毛に電気をためる。興奮すると毛が逆立つ。",
      "金色の大角と厚い毛を持つ。雷を吸収し、穏やかな電流を放つ。"
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
        "ぱちぱち"
      ],
      [
        9,
        "しびれなみ"
      ],
      [
        14,
        "たいでん"
      ],
      [
        18,
        "いなずまばしり"
      ],
      [
        23,
        "いなだま"
      ],
      [
        29,
        "でんじのかべ"
      ],
      [
        34,
        "らいげき"
      ],
      [
        40,
        "きょうめいほう"
      ],
      [
        48,
        "でんじのあみ"
      ]
    ],
    "catch": 190,
    "tier": 0.075
  },
  {
    "key": "burrow-mole",
    "ids": [
      223,
      224
    ],
    "names": [
      "ホリモグ",
      "ドリモグラ"
    ],
    "types": [
      [
        8
      ],
      [
        8
      ]
    ],
    "levels": [
      25
    ],
    "plans": [
      "quad",
      "biped"
    ],
    "arch": "fast",
    "base": [
      [
        49,
        62,
        57,
        25,
        36,
        51
      ],
      [
        80,
        110,
        95,
        40,
        55,
        95
      ]
    ],
    "weight": 10,
    "ability": 34,
    "title": "土脈の掘りモグラ",
    "home": "盛り上がった土の近く",
    "eco": [
      "土の下に巣穴を掘る。振動で地上の気配を感じる。",
      "鉱物のように硬い爪で岩盤を掘る。暗い土中でも正確に相手を見つける。"
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
        "どろなげ"
      ],
      [
        13,
        "すなけむり"
      ],
      [
        18,
        "にだんほり"
      ],
      [
        25,
        "つちなだれ"
      ],
      [
        30,
        "ちそうぎり"
      ],
      [
        36,
        "つちのめぐみ"
      ],
      [
        44,
        "だいちわり"
      ]
    ],
    "catch": 175,
    "tier": 0.085
  },
  {
    "key": "grass-viper",
    "ids": [
      981,
      982
    ],
    "names": [
      "カヤヘビ",
      "カヤノヌシ"
    ],
    "types": [
      [
        7
      ],
      [
        7,
        4
      ]
    ],
    "levels": [
      30
    ],
    "plans": [
      "serpent",
      "serpent"
    ],
    "arch": "fast",
    "base": [
      [
        42,
        62,
        42,
        36,
        43,
        65
      ],
      [
        75,
        105,
        75,
        65,
        75,
        95
      ]
    ],
    "weight": 8,
    "ability": 35,
    "title": "草隠れの毒蛇",
    "home": "背の高いカヤの草地",
    "eco": [
      "細長い草に擬態する。紫色の牙から毒を出す。",
      "葉のような尾と紫の冠を持つ。身をくねらせて奇襲を仕掛ける。"
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
        "どくとげ"
      ],
      [
        9,
        "どくぎり"
      ],
      [
        14,
        "あくどくづめ"
      ],
      [
        19,
        "ふたまたのきば"
      ],
      [
        24,
        "ねばるどく"
      ],
      [
        30,
        "いばらむち"
      ],
      [
        35,
        "もうどくのきば"
      ],
      [
        42,
        "もりのやいば"
      ]
    ],
    "catch": 160,
    "tier": 0.09
  },
  {
    "key": "dandelion",
    "ids": [
      283,
      284
    ],
    "names": [
      "ポポネ",
      "ワタフロー"
    ],
    "types": [
      [
        4,
        9
      ],
      [
        4,
        9
      ]
    ],
    "levels": [
      22
    ],
    "plans": [
      "plant",
      "plant"
    ],
    "arch": "mystic",
    "base": [
      [
        42,
        29,
        42,
        60,
        60,
        52
      ],
      [
        70,
        40,
        65,
        100,
        105,
        90
      ]
    ],
    "weight": 6,
    "ability": 36,
    "title": "綿毛の風花",
    "home": "花畑",
    "eco": [
      "黄色い花を頭に咲かせ、綿毛を風に乗せて仲間を増やす。",
      "長い茎と綿毛で風を操る。触れた相手に綿毛を散布して動きを鈍らせる。"
    ],
    "learn": [
      [
        1,
        "わかばのかぜ"
      ],
      [
        1,
        "なきおどし"
      ],
      [
        5,
        "かぜきり"
      ],
      [
        9,
        "まどろみかふん"
      ],
      [
        13,
        "かふんだま"
      ],
      [
        17,
        "かぜまとい"
      ],
      [
        22,
        "つむじかぜ"
      ],
      [
        28,
        "いのちすい"
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
    "catch": 150,
    "tier": 0.1
  },
  {
    "key": "dream-fungus",
    "ids": [
      1179,
      1180
    ],
    "names": [
      "ユメホウシ",
      "マドロタケ"
    ],
    "types": [
      [
        4,
        13
      ],
      [
        4,
        13
      ]
    ],
    "levels": [
      32
    ],
    "plans": [
      "plant",
      "plant"
    ],
    "arch": "mystic",
    "base": [
      [
        52,
        25,
        48,
        62,
        61,
        35
      ],
      [
        90,
        45,
        85,
        110,
        110,
        60
      ]
    ],
    "weight": 3,
    "ability": 37,
    "title": "夢灯のキノコ",
    "home": "草原の奥の薄暗い林",
    "eco": [
      "青紫の傘から淡く光る胞子を放つ。静かな場所でよく眠る。",
      "大きな傘と小さな傘に夢の光を宿す。近づいた相手を眠りに誘う。"
    ],
    "learn": [
      [
        1,
        "ひとだま"
      ],
      [
        1,
        "まどわしび"
      ],
      [
        5,
        "わかばのかぜ"
      ],
      [
        9,
        "まどろみかふん"
      ],
      [
        14,
        "いのちすい"
      ],
      [
        19,
        "たたりび"
      ],
      [
        24,
        "やどりだね"
      ],
      [
        28,
        "れいりょくしゅうちゅう"
      ],
      [
        32,
        "れいきのなみ"
      ],
      [
        40,
        "ようぶんうばい"
      ],
      [
        48,
        "あくむのさそい"
      ]
    ],
    "catch": 120,
    "tier": 0.115
  }
];
const ROUTE2_ABILITIES=[{"n":"草原疾走","d":"晴れのとき 素早さが1.5倍"},{"n":"化かし","d":"登場時 相手の命中率を1段階 下げる"},{"n":"跳躍力","d":"指定の跳躍・蹴り技の威力が1.2倍"},{"n":"蓄電毛","d":"雷の攻撃技を無効にして HPを1/4回復"},{"n":"地中感覚","d":"命中率を 下げられない"},{"n":"毒牙","d":"接触技でダメージを与えると20%で 毒にする"},{"n":"綿毛散布","d":"接触技を受けると20%で 相手の素早さを1段階下げる"},{"n":"夢の胞子","d":"接触技を受けると10%で 相手を眠らせる"}];

const ROUTE2_SPECIES=new Map(ROUTE2_LINES.flatMap(f=>f.ids.map((id,i)=>[id,{family:f,stage:i}])));
const ROUTE2_IDS=new Set(ROUTE2_SPECIES.keys()),ROUTE2_REAR_IDS=new Set([711,712,516,517]);
function setRoute2Encounters(){
 const c=CELLS['0,1'];if(!c||c.name!=='第2街道'||c.gate)throw Error('route2 cell mismatch');
 const former=c.land.slice(),next=ROUTE2_LINES.map(f=>SP[f.ids[0]].fam);c.land=next;c.rare=null;
 const other=WORLD.areas.filter(a=>a!==c&&a!==CELLS['0,3']&&a.kind!=='sea');
 for(const fid of former){if(next.includes(fid)||other.some(a=>a.land.includes(fid)))continue;const f=FAMS[fid];const target=other.slice().sort((a,b)=>Math.abs(a.prog-f.tier*50)-Math.abs(b.prog-f.tier*50)||a.land.length-b.land.length)[0];if(target&&!target.land.includes(fid))target.land.push(fid);}
}
function route2Roll(n){if(!Number.isInteger(n)||n<0||n>=100)throw RangeError('route2 roll');for(const f of ROUTE2_LINES){if(n<f.weight)return f;n-=f.weight;}throw Error('route2 weights');}
function route2WildPick(){const f=route2Roll(ri(100));return {sp:f.ids[0],lv:5+ri(5)};}
function route2MoveAllowed(sp,id){const r=ROUTE2_SPECIES.get(sp.id);if(!r)return true;const sec=r.family.types.at(-1)[1];return sec==null||r.family.types[r.stage].includes(sec)||MOVES[id].type!==sec||sec===0;}
function route2Speed(m,weather){return abilOf(m)===30&&weather==='sun'?1.5:1;}
const ROUTE2_JUMP_MOVES=new Set(['はねばしり','しゅんそくけり','ふたえげり','はやぶさおとし','らいこうげり','そうらいきゃく','ほむらげり','しゃくねつとつげき']);
function route2PowerScale(m,mv){return abilOf(m)===32&&ROUTE2_JUMP_MOVES.has(mv.name)?1.2:1;}
// Contact is a distinct property from physical. Projectiles and area ground moves do not trigger these abilities.
const ROUTE2_CONTACT_RE=/ぶつかる|づき|つき|づめ|つめ|かみ|がみ|きば|けり|げり|きゃく|あご|なぐ|けん|きり|ぎり|やいば|まわしうち|はがんしょう|かえしうち|はねうち|かえしばね|つるばしり|いばらむち|とつげき|はねばしり|むれあたり|にだんほり|かつぎなげ|たいえきすい|はりれんだ|ふたまた|ひやりて/;
const ROUTE2_RANGED_PHYS=new Set(['はっぱうち','たねつぶて','つぶてあめ','すなげり','きんかとばし','つちなだれ','だいちわり','ちかくへんどう','ふみかためうち','ひとだまれんだ','かげばしり','みだればね','もりのやいば','やまかぜぎり']);
function route2Contact(mv){return !!(mv.phys&&mv.pow>0&&!ROUTE2_RANGED_PHYS.has(mv.name)&&ROUTE2_CONTACT_RE.test(mv.name));}
function route2BlocksAccuracy(m,key,n){return abilOf(m)===34&&key==='acc'&&n<0;}
async function route2EntryAbility(B,s){
 if(abilOf(bmon(B,s))!==31||bmon(B,1-s).hp<=0)return false;
 await say(bname(B,s)+'の 「化かし」！');await boost(B,1-s,'acc',-1);return true;
}
async function route2ContactEffects(B,sd,mv,dmg){
 if(dmg<=0||!route2Contact(mv)||!starterOpponents(B,sd))return;
 const u=bmon(B,sd),t=bmon(B,1-sd);if(u.hp<=0||t.hp<=0)return;
 if(abilOf(u)===35&&!t.st&&ri(100)<20)await inflict(B,1-sd,'psn',false);
 if(abilOf(t)===36&&ri(100)<20){await say(bname(B,1-sd)+'の 「綿毛散布」！');await boost(B,sd,'spe',-1);}
 if(abilOf(t)===37&&!u.st&&ri(100)<10)await inflict(B,sd,'slp',false);
}
// Widen the walkable interior rather than altering the 32x32 world-cell connections.
function expandRoute2Meadow(m){
 if(m.id!=='0,1')return;const r=RNG('route2-meadow-v110'),W=m.W,H=m.H,patches=[[7,7,5.7,5.7],[24,8,5.5,6],[7,23,5.5,6],[24,23,5.5,6]];
 const protectedTile=(x,y)=>occupied(m,x,y)||m.warps[x+','+y]||m.signs[x+','+y]||![T.TREE,T.GRASS,T.TALL,T.FLOWER].includes(m.t[y*W+x]);
 const old=Array.from(m.t),count=(v)=>Array.from(m.t).filter(x=>x===v).length;
 for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){
  if(protectedTile(x,y))continue;
  const edge=Math.min(x-1,W-2-x,y-1,H-2-y);
  const patch=patches.find(([cx,cy,rx,ry])=>((x-cx)/rx)**2+((y-cy)/ry)**2<=1+r()*.12);
  // Preserve scattered tree clusters as habitat edges; keep continuous traversal strips.
  const corridor=x===14||x===15||x===16||x===17||[8,15,16,24].includes(y);
  if(corridor){m.t[y*W+x]=T.GRASS;continue;}
  if(edge<=2&&r.chance(.58))continue;
  if(patch)m.t[y*W+x]=T.TALL;
  else if((x>=20&&y>=17&&y<=22)||(x>=4&&x<=9&&y>=13&&y<=18))m.t[y*W+x]=r.chance(.48)?T.FLOWER:T.GRASS;
  else if(r.chance(.11)&&Math.abs(x-15)>3)m.t[y*W+x]=T.TREE;
  else m.t[y*W+x]=T.GRASS;
 }
 m.route2Meadow={oldTall:old.filter(v=>v===T.TALL).length,tall:count(T.TALL),flowers:count(T.FLOWER)};
 m.enc={...m.enc,rate:10};
 for(const k of Object.keys(m.signs))if(m.signs[k].startsWith(m.cell.name))m.signs[k]+='\n草原・花畑に 8系統の アニマ。深い 草では 2体が あらわれることも。';
}
