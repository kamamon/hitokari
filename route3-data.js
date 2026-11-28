'use strict';
const ROUTE3_KEY='1,0';
const ROUTE3_LINES=[
  {
    "key": "boxing-badger",
    "ids": [
      11,
      36
    ],
    "names": [
      "ケンアナ",
      "ゴウアナ"
    ],
    "types": [
      [
        6
      ],
      [
        6
      ]
    ],
    "levels": [
      24
    ],
    "plans": [
      "biped",
      "biped"
    ],
    "arch": "power",
    "base": [
      [
        52,
        65,
        45,
        24,
        38,
        61
      ],
      [
        85,
        115,
        80,
        40,
        65,
        95
      ]
    ],
    "weight": 26,
    "ability": 43,
    "title": "拳闘のアナグマ",
    "home": "第3街道の草地",
    "eco": [
      "大きな前脚で土を掘る。負けずぎらいで毎朝拳を鍛える。",
      "厚い毛皮と岩のような拳を持つ。攻撃を受けるとさらに力を増す。"
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
        "こづき"
      ],
      [
        10,
        "しゅんそくけり"
      ],
      [
        14,
        "きをねる"
      ],
      [
        19,
        "ふたえげり"
      ],
      [
        24,
        "まわしうち"
      ],
      [
        30,
        "きゅうしょづき"
      ],
      [
        38,
        "はがんしょう"
      ],
      [
        46,
        "ごうきほう"
      ]
    ],
    "catch": 190,
    "tier": 0.15
  },
  {
    "key": "rain-newt",
    "ids": [
      241,
      242
    ],
    "names": [
      "アメイモリ",
      "シブキモリ"
    ],
    "types": [
      [
        2
      ],
      [
        2,
        7
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
        55,
        34,
        43,
        62,
        62,
        39
      ],
      [
        85,
        55,
        75,
        95,
        105,
        60
      ]
    ],
    "weight": 22,
    "ability": 44,
    "title": "雨滴のイモリ",
    "home": "湿った草むら",
    "eco": [
      "水滴をためる透明な尾と橙のえらが特徴。雨の日には草の陰から顔を出す。",
      "紫の模様と大きな透明尾を持つ。休むと傷をふさぐ粘液を分泌する。"
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
    "catch": 185,
    "tier": 0.16
  },
  {
    "key": "spiral-beetle",
    "ids": [
      376,
      377
    ],
    "names": [
      "カブネジ",
      "カブガネ"
    ],
    "types": [
      [
        11
      ],
      [
        11,
        16
      ]
    ],
    "levels": [
      28
    ],
    "plans": [
      "bug",
      "bug"
    ],
    "arch": "tank",
    "base": [
      [
        47,
        61,
        70,
        22,
        45,
        35
      ],
      [
        75,
        110,
        135,
        35,
        85,
        60
      ]
    ],
    "weight": 18,
    "ability": 45,
    "title": "螺旋角の甲虫",
    "home": "林縁と草むら",
    "eco": [
      "銅色の螺旋角で枝や石を持ち上げる。小さな力を正確に伝える。",
      "金属の外殻と渦巻く大角を備える。短い突きの威力が強い。"
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
        6,
        "はねばしり"
      ],
      [
        10,
        "かたいから"
      ],
      [
        15,
        "はりれんだ"
      ],
      [
        20,
        "むれあたり"
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
    "catch": 170,
    "tier": 0.17
  },
  {
    "key": "moon-bat",
    "ids": [
      370,
      371
    ],
    "names": [
      "ヤミコウモ",
      "ヨルマント"
    ],
    "types": [
      [
        15,
        9
      ],
      [
        15,
        9
      ]
    ],
    "levels": [
      27
    ],
    "plans": [
      "bird",
      "bird"
    ],
    "arch": "fast",
    "base": [
      [
        41,
        49,
        35,
        46,
        40,
        78
      ],
      [
        70,
        85,
        55,
        70,
        70,
        115
      ]
    ],
    "weight": 15,
    "ability": 46,
    "title": "月紋のコウモリ",
    "home": "日陰の林縁",
    "eco": [
      "月の模様がある翼を持ち、音を立てずに木々の間を飛ぶ。",
      "長い翼をマントのように折りたたむ。相手の先制攻撃を空中でかわす。"
    ],
    "learn": [
      [
        1,
        "やみうち"
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
        "はやてづき"
      ],
      [
        15,
        "ほくそえむ"
      ],
      [
        20,
        "かげがみ"
      ],
      [
        27,
        "つむじかぜ"
      ],
      [
        33,
        "そらさき"
      ],
      [
        39,
        "あんこくは"
      ],
      [
        46,
        "らんきりゅう"
      ]
    ],
    "catch": 155,
    "tier": 0.175
  },
  {
    "key": "thorn-seed",
    "ids": [
      274,
      275
    ],
    "names": [
      "ハリダネ",
      "イバラカブ"
    ],
    "types": [
      [
        4
      ],
      [
        4,
        7
      ]
    ],
    "levels": [
      25
    ],
    "plans": [
      "plant",
      "quad"
    ],
    "arch": "mystic",
    "base": [
      [
        48,
        40,
        56,
        60,
        53,
        28
      ],
      [
        80,
        75,
        90,
        100,
        90,
        45
      ]
    ],
    "weight": 12,
    "ability": 47,
    "title": "茨の種",
    "home": "花と茂みの境",
    "eco": [
      "とげのある種の体で草の中に隠れる。つるを伸ばして移動する。",
      "赤紫の花冠と茨の装甲を持つ。深い根で外敵の干渉を防ぐ。"
    ],
    "learn": [
      [
        1,
        "はっぱうち"
      ],
      [
        1,
        "なきおどし"
      ],
      [
        6,
        "わかばのかぜ"
      ],
      [
        10,
        "やどりだね"
      ],
      [
        15,
        "いばらむち"
      ],
      [
        20,
        "めぶきのまい"
      ],
      [
        25,
        "どくとげ"
      ],
      [
        30,
        "いのちすい"
      ],
      [
        36,
        "しょうきだん"
      ],
      [
        42,
        "もりのやいば"
      ]
    ],
    "catch": 150,
    "tier": 0.18
  },
  {
    "key": "cliff-drake",
    "ids": [
      61,
      62,
      63
    ],
    "names": [
      "ガケチビ",
      "ガケリュウ",
      "ガンレグス"
    ],
    "types": [
      [
        12
      ],
      [
        12,
        14
      ],
      [
        12,
        14
      ]
    ],
    "levels": [
      28,
      45
    ],
    "plans": [
      "quad",
      "quad",
      "quad"
    ],
    "arch": "power",
    "base": [
      [
        53,
        65,
        57,
        29,
        38,
        43
      ],
      [
        72,
        93,
        84,
        42,
        58,
        52
      ],
      [
        95,
        125,
        115,
        55,
        80,
        65
      ]
    ],
    "weight": 7,
    "ability": 48,
    "title": "崖岩の竜",
    "home": "岩壁のそばの草地",
    "eco": [
      "橙色の岩角を持つ小さな竜。危険を感じると岩陰に隠れる。",
      "岩の装甲が発達する。長い尾と角で体勢を支える。",
      "大きな岩板で全身を覆う。弱点を突かれると力を蓄えて反撃する。"
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
        "いしばしり"
      ],
      [
        15,
        "いわはだ"
      ],
      [
        21,
        "がけくずし"
      ],
      [
        28,
        "たつづめ"
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
    "tier": 0.205
  }
];
const ROUTE3_ABILITIES=[{"n":"鍛錬","d":"最初に相手の物理技で ダメージを受けると 攻撃1段階上昇（1戦1回）"},{"n":"再生尾","d":"交代で控えに戻ると 最大HPの1/5を回復"},{"n":"硬角","d":"威力50以下の物理攻撃技の 威力が1.3倍（固定ダメージ除外）"},{"n":"静音飛行","d":"相手の優先度が正の攻撃技を 無効にする"},{"n":"根の守り","d":"相手の能力低下を 1戦につき1回 防ぐ"},{"n":"岩竜の気迫","d":"最初の効果抜群の被弾後 次の通常攻撃技が1.3倍（1戦1回）"}];

const ROUTE3_SPECIES=new Map(ROUTE3_LINES.flatMap(f=>f.ids.map((id,stage)=>[id,{family:f,stage}])));
const ROUTE3_IDS=new Set(ROUTE3_SPECIES.keys());
function setRoute3Encounters(){
 const c=CELLS[ROUTE3_KEY],former=c.land.slice(),next=ROUTE3_LINES.map(f=>SP[f.ids[0]].fam);c.land=next;c.rare=null;
 const other=WORLD.areas.filter(a=>!['0,3','0,1','0,0',ROUTE3_KEY].includes(a.key)&&a.kind!=='sea');
 for(const fid of former){if(next.includes(fid)||other.some(a=>a.land.includes(fid)))continue;const f=FAMS[fid],target=other.slice().sort((a,b)=>Math.abs(a.prog-f.tier*50)-Math.abs(b.prog-f.tier*50)||a.land.length-b.land.length)[0];if(target)target.land.push(fid);}
}
function route3Roll(n){if(!Number.isInteger(n)||n<0||n>=100)throw RangeError('route3 roll');for(const f of ROUTE3_LINES){if(n<f.weight)return f;n-=f.weight;}throw Error('route3 weights');}
function route3WildPick(){const f=route3Roll(ri(100));return{sp:f.ids[0],lv:8+ri(4)};}
function route3MoveAllowed(sp,id){const r=ROUTE3_SPECIES.get(sp.id);if(!r)return true;const sec=r.family.types.at(-1)[1];return sec==null||r.family.types[r.stage].includes(sec)||MOVES[id].type!==sec;}
function route3NormalAttack(mv){return mv.pow>0&&!mv.has('fixed')&&!mv.has('level')&&!mv.has('halve');}
function route3WeakPower(m,mv){return abilOf(m)===45&&mv.phys&&mv.pow<=50&&route3NormalAttack(mv)?1.3:1;}
function route3PriorityBlock(m,mv){return abilOf(m)===46&&mv.pow>0&&mv.prio>0;}
function route3RootAvailable(B,m){return abilOf(m)===47&&!starterState(B,m).rootWard;}
function route3RootWard(B,s,n,source){if(n>=0||source===s||!starterOpponents(B,source)||!route3RootAvailable(B,bmon(B,s)))return false;starterState(B,bmon(B,s)).rootWard=true;return true;}
async function route3Withdraw(m){
 if(abilOf(m)!==44||m.hp<=0||m.hp>=maxHP(m))return false;
 m.hp=Math.min(maxHP(m),m.hp+Math.max(1,Math.floor(maxHP(m)/5)));await say(monName(m)+'は 「再生尾」で HPを 回復した！');return true;
}
async function route3AfterHit(B,sd,mv,eff,dmg){
 const t=bmon(B,1-sd);if(dmg<=0||t.hp<=0||!starterOpponents(B,sd))return;
 const ab=abilOf(t),f=starterState(B,t);
 if(ab===43&&mv.phys&&!f.training){f.training=true;await say(bname(B,1-sd)+'の 「鍛錬」！');await boost(B,1-sd,'atk',1);}
 if(ab===48&&eff>1&&!f.rockTriggered){f.rockTriggered=true;f.rockReady=true;await say(bname(B,1-sd)+'の 「岩竜の気迫」！ 次の 攻撃に 力が こもった！');}
}
async function route3BeginAttack(B,sd,mv){
 const u=bmon(B,sd);B.r3LastBoost=false;B.r3AttackActor=null;
 if(abilOf(u)!==48||!route3NormalAttack(mv))return;
 const f=starterState(B,u),use=B.extra?!!B.r3SpreadBoost:!!f.rockReady;if(!use)return;
 if(!B.extra)f.rockReady=false;B.r3LastBoost=true;B.r3AttackActor=u;
 if(!B.extra)await say(bname(B,sd)+'は 「岩竜の気迫」で 力を 解き放った！');
}
function route3DamagePower(B,m,mv){return abilOf(m)===48&&route3NormalAttack(mv)&&(B?.r3AttackActor===m||starterState(B,m).rockReady)?1.3:1;}
