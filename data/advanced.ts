import type { LessonSeed } from "@/lib/types";

/**
 * Upper-level chapters. Minna no Nihongo Intermediate supplies the N3 band;
 * N2/N1 are extended with the grammar customarily taught after it. Each entry
 * is a representative unit that demonstrates how the curriculum scales.
 */
export const advanced: LessonSeed[] = [
  {
    id: "n4-26",
    level: "N4",
    number: 26,
    title: "～てあげます・～てくれます・～てもらいます",
    titleEn: "Doing favours for others",
    source: "Minna no Nihongo II · Lesson 26",
    vocab: [
      { term: "貸します", reading: "かします", romaji: "kashimasu", meaning: "lend", pos: "verb" },
      { term: "借ります", reading: "かります", romaji: "karimasu", meaning: "borrow", pos: "verb" },
      { term: "教えます", reading: "おしえます", romaji: "oshiemasu", meaning: "teach, tell", pos: "verb" },
      { term: "送ります", reading: "おくります", romaji: "okurimasu", meaning: "send, see off", pos: "verb" },
      { term: "直します", reading: "なおします", romaji: "naoshimasu", meaning: "repair, correct", pos: "verb" },
      { term: "見せます", reading: "みせます", romaji: "misemasu", meaning: "show", pos: "verb" },
      { term: "手伝います", reading: "てつだいます", romaji: "tetsudaimasu", meaning: "help, assist", pos: "verb" },
      { term: "助けます", reading: "たすけます", romaji: "tasukemasu", meaning: "save, help", pos: "verb" },
      { term: "お見舞い", reading: "おみまい", romaji: "omimai", meaning: "visit (a sick person)", pos: "noun" },
      { term: "お礼", reading: "おれい", romaji: "orei", meaning: "thanks, gratitude", pos: "noun" },
    ],
    grammar: [
      {
        point: "～てあげます",
        meaning: "do ~ for someone",
        explanation:
          "The speaker (or subject) does something kind for another person. Use with care — it can sound patronising to a superior.",
        examples: [
          { jp: "私は木村さんに本を貸してあげました。", reading: "わたしはきむらさんにほんをかしてあげました。", en: "I lent Kimura a book." },
        ],
      },
      {
        point: "～てくれます",
        meaning: "someone does ~ for me",
        explanation:
          "Another person does something for the speaker. The giver is the subject; the speaker is the receiver (私に).",
        examples: [
          { jp: "佐藤さんは私に辞書を貸してくれました。", reading: "さとうさんはわたしにじしょをかしてくれました。", en: "Sato lent me a dictionary." },
        ],
      },
      {
        point: "～てもらいます",
        meaning: "have someone do ~ for me",
        explanation:
          "Focus on the receiver's perspective: 私 は 人 に ～てもらいます. The speaker requests or benefits from the action.",
        examples: [
          { jp: "私は田中さんに日本語を教えてもらいました。", reading: "わたしはたなかさんに にほんごを おしえてもらいました。", en: "I had Tanaka teach me Japanese." },
        ],
      },
    ],
    kanji: [
      { char: "貸", on: ["タイ"], kun: ["か.す"], meaning: "lend", strokes: 12, words: [
        { term: "貸します", reading: "かします", meaning: "lend" },
        { term: "貸家", reading: "かしや", meaning: "house for rent" },
      ] },
      { char: "教", on: ["キョウ"], kun: ["おし.える"], meaning: "teach", strokes: 11, words: [
        { term: "教えます", reading: "おしえます", meaning: "teach" },
        { term: "教室", reading: "きょうしつ", meaning: "classroom" },
      ] },
      { char: "送", on: ["ソウ"], kun: ["おく.る"], meaning: "send", strokes: 9, words: [
        { term: "送ります", reading: "おくります", meaning: "send" },
        { term: "放送", reading: "ほうそう", meaning: "broadcast" },
      ] },
      { char: "助", on: ["ジョ"], kun: ["たす.ける"], meaning: "help", strokes: 7, words: [
        { term: "助けます", reading: "たすけます", meaning: "help, save" },
        { term: "助手", reading: "じょしゅ", meaning: "assistant" },
      ] },
    ],
  },
  {
    id: "n4-31",
    level: "N4",
    number: 31,
    title: "～つもりです・～予定です",
    titleEn: "Intentions & plans",
    source: "Minna no Nihongo II · Lesson 31",
    vocab: [
      { term: "予定", reading: "よてい", romaji: "yotei", meaning: "plan, schedule", pos: "noun" },
      { term: "予約", reading: "よやく", romaji: "yoyaku", meaning: "reservation", pos: "noun" },
      { term: "経験", reading: "けいけん", romaji: "keiken", meaning: "experience", pos: "noun" },
      { term: "趣味", reading: "しゅみ", romaji: "shumi", meaning: "hobby", pos: "noun" },
      { term: "続けます", reading: "つづけます", romaji: "tsuzukemasu", meaning: "continue", pos: "verb" },
      { term: "決めます", reading: "きめます", romaji: "kimemasu", meaning: "decide", pos: "verb" },
      { term: "将来", reading: "しょうらい", romaji: "shourai", meaning: "future", pos: "noun" },
      { term: "留学", reading: "りゅうがく", romaji: "ryuugaku", meaning: "studying abroad", pos: "noun" },
      { term: "もちろん", reading: "もちろん", romaji: "mochiron", meaning: "of course", pos: "adverb" },
      { term: "きっと", reading: "きっと", romaji: "kitto", meaning: "surely", pos: "adverb" },
    ],
    grammar: [
      {
        point: "Verb（辞書形）つもりです",
        meaning: "intend to ~",
        explanation:
          "Express a personal intention. Negative: ～ないつもりです. Cannot be used for plans already arranged.",
        examples: [
          { jp: "来年、日本へ留学するつもりです。", reading: "らいねん、にほんへ りゅうがくする つもりです。", en: "I intend to study in Japan next year." },
        ],
      },
      {
        point: "Noun の / Verb 予定です",
        meaning: "be scheduled to ~",
        explanation:
          "Describes an objective plan or schedule. 旅行の予定です / 行く予定です.",
        examples: [
          { jp: "3月に国へ帰る予定です。", reading: "さんがつに くにへ かえる よていです。", en: "I'm scheduled to return home in March." },
        ],
      },
      {
        point: "～たことがあります",
        meaning: "have done ~ before",
        explanation:
          "Talk about past experience. Negative: ～たことがありません.",
        examples: [
          { jp: "京都へ行ったことがあります。", reading: "きょうとへ いったことが あります。", en: "I have been to Kyoto." },
        ],
      },
      {
        point: "～たり～たりします",
        meaning: "do things like ~ and ~",
        explanation:
          "List representative actions without implying order or completeness.",
        examples: [
          { jp: "週末は本を読んだり、映画を見たりします。", reading: "しゅうまつは ほんを よんだり、えいがを みたりします。", en: "On weekends I read books and watch movies." },
        ],
      },
    ],
    kanji: [
      { char: "予", on: ["ヨ"], kun: ["あらかじ.め"], meaning: "beforehand", strokes: 4, words: [
        { term: "予定", reading: "よてい", meaning: "plan" },
        { term: "予約", reading: "よやく", meaning: "reservation" },
      ] },
      { char: "定", on: ["テイ", "ジョウ"], kun: ["さだ.める"], meaning: "determine", strokes: 8, words: [
        { term: "予定", reading: "よてい", meaning: "plan" },
        { term: "定食", reading: "ていしょく", meaning: "set meal" },
      ] },
      { char: "経", on: ["ケイ"], kun: ["へ.る"], meaning: "pass through", strokes: 11, words: [
        { term: "経験", reading: "けいけん", meaning: "experience" },
        { term: "経済", reading: "けいざい", meaning: "economy" },
      ] },
      { char: "験", on: ["ケン"], kun: [], meaning: "test, effect", strokes: 18, words: [
        { term: "経験", reading: "けいけん", meaning: "experience" },
        { term: "試験", reading: "しけん", meaning: "exam" },
      ] },
    ],
  },
  {
    id: "n3-01",
    level: "N3",
    number: 1,
    title: "～という・～ことになる",
    titleEn: "Naming & coming to be",
    source: "Minna no Nihongo Intermediate · Unit 1",
    vocab: [
      { term: "情報", reading: "じょうほう", romaji: "jouhou", meaning: "information", pos: "noun" },
      { term: "環境", reading: "かんきょう", romaji: "kankyou", meaning: "environment", pos: "noun" },
      { term: "文化", reading: "ぶんか", romaji: "bunka", meaning: "culture", pos: "noun" },
      { term: "社会", reading: "しゃかい", romaji: "shakai", meaning: "society", pos: "noun" },
      { term: "増えます", reading: "ふえます", romaji: "fuemasu", meaning: "increase", pos: "verb" },
      { term: "減ります", reading: "へります", romaji: "herimasu", meaning: "decrease", pos: "verb" },
      { term: "変えます", reading: "かえます", romaji: "kaemasu", meaning: "change (something)", pos: "verb" },
      { term: "比べます", reading: "くらべます", romaji: "kurabemasu", meaning: "compare", pos: "verb" },
      { term: "関係", reading: "かんけい", romaji: "kankei", meaning: "relationship, connection", pos: "noun" },
      { term: "方法", reading: "ほうほう", romaji: "houhou", meaning: "method, way", pos: "noun" },
    ],
    grammar: [
      {
        point: "～という Noun",
        meaning: "a thing called ~ / named ~",
        explanation:
          "Introduces a name or label. Also ～というのは…ことです for definitions.",
        examples: [
          { jp: "「もったいない」という言葉を知っていますか。", reading: "「もったいない」という ことばを しっていますか。", en: "Do you know the word 'mottainai'?" },
        ],
      },
      {
        point: "～ことになる",
        meaning: "it has been decided that ~ / it turns out",
        explanation:
          "A conclusion reached by circumstance or by a decision outside the speaker's control. Compare ～ことにする (personal decision).",
        examples: [
          { jp: "来月から大阪で働くことになりました。", reading: "らいげつから おおさかで はたらく ことに なりました。", en: "It's been decided that I'll work in Osaka from next month." },
        ],
      },
      {
        point: "～ようにします",
        meaning: "make a point of ~",
        explanation:
          "Habitual effort. ～ようにしています = I'm trying to make a habit of ~.",
        examples: [
          { jp: "毎日、日本語を話すようにしています。", reading: "まいにち、にほんごを はなす ように しています。", en: "I make a point of speaking Japanese every day." },
        ],
      },
      {
        point: "～によって",
        meaning: "depending on / by (agent)",
        explanation:
          "Shows variation by cause or agent: 人によって違います. Passive sentences use it for the doer.",
        examples: [
          { jp: "考え方は人によって違います。", reading: "かんがえかたは ひとに よって ちがいます。", en: "Ways of thinking differ from person to person." },
        ],
      },
    ],
    kanji: [
      { char: "情", on: ["ジョウ", "セイ"], kun: ["なさ.け"], meaning: "feeling, information", strokes: 11, words: [
        { term: "情報", reading: "じょうほう", meaning: "information" },
        { term: "感情", reading: "かんじょう", meaning: "emotion" },
      ] },
      { char: "報", on: ["ホウ"], kun: ["むく.いる"], meaning: "report, repay", strokes: 12, words: [
        { term: "情報", reading: "じょうほう", meaning: "information" },
        { term: "報告", reading: "ほうこく", meaning: "report" },
      ] },
      { char: "環", on: ["カン"], kun: ["わ"], meaning: "ring, surroundings", strokes: 17, words: [
        { term: "環境", reading: "かんきょう", meaning: "environment" },
        { term: "循環", reading: "じゅんかん", meaning: "circulation" },
      ] },
      { char: "境", on: ["キョウ"], kun: ["さかい"], meaning: "boundary", strokes: 14, words: [
        { term: "環境", reading: "かんきょう", meaning: "environment" },
        { term: "国境", reading: "こっきょう", meaning: "national border" },
      ] },
    ],
  },
  {
    id: "n2-01",
    level: "N2",
    number: 1,
    title: "～わけではない・～に違いない",
    titleEn: "Inference & qualification",
    source: "Minna no Nihongo Intermediate II · Unit 1",
    vocab: [
      { term: "傾向", reading: "けいこう", romaji: "keikou", meaning: "tendency", pos: "noun" },
      { term: "判断", reading: "はんだん", romaji: "handan", meaning: "judgement", pos: "noun" },
      { term: "影響", reading: "えいきょう", romaji: "eikyou", meaning: "influence", pos: "noun" },
      { term: "原因", reading: "げんいん", romaji: "genin", meaning: "cause", pos: "noun" },
      { term: "結果", reading: "けっか", romaji: "kekka", meaning: "result", pos: "noun" },
      { term: "認めます", reading: "みとめます", romaji: "mitomemasu", meaning: "admit, approve", pos: "verb" },
      { term: "限ります", reading: "かぎります", romaji: "kagirimasu", meaning: "limit", pos: "verb" },
      { term: "疑います", reading: "うたがいます", romaji: "utagaimasu", meaning: "doubt", pos: "verb" },
      { term: "明らか", reading: "あきらか", romaji: "akiraka", meaning: "clear, obvious", pos: "adjective" },
      { term: "確か", reading: "たしか", romaji: "tashika", meaning: "certain, sure", pos: "adjective" },
    ],
    grammar: [
      {
        point: "～わけではない",
        meaning: "it doesn't mean that ~",
        explanation:
          "Partial negation: reject a conclusion someone might draw. ～ないわけではない = it's not that it's not ~ (double negative).",
        examples: [
          { jp: "日本人だからといって、誰でも漢字が書けるわけではない。", reading: "にほんじん だからといって、だれでも かんじが かける わけでは ない。", en: "Just because someone is Japanese doesn't mean everyone can write kanji." },
        ],
      },
      {
        point: "～に違いない",
        meaning: "must be ~, there's no doubt",
        explanation:
          "Strong, confident inference based on evidence. More assertive than ～はずだ.",
        examples: [
          { jp: "電気がついているから、彼はまだ起きているに違いない。", reading: "でんきが ついているから、かれは まだ おきている に ちがいない。", en: "The light is on, so he must still be awake." },
        ],
      },
      {
        point: "～おそれがある",
        meaning: "there is a risk that ~",
        explanation:
          "Formal warning about an undesirable possibility. Common in news and reports.",
        examples: [
          { jp: "台風が上陸するおそれがあります。", reading: "たいふうが じょうりくする おそれが あります。", en: "There is a risk the typhoon will make landfall." },
        ],
      },
      {
        point: "～に限らず",
        meaning: "not limited to ~",
        explanation:
          "Extends a statement beyond one category: 若者に限らず、高齢者にも人気だ.",
        examples: [
          { jp: "この問題は若者に限らず、社会全体の問題だ。", reading: "この もんだいは わかものに かぎらず、しゃかい ぜんたいの もんだいだ。", en: "This problem isn't limited to the young — it's society-wide." },
        ],
      },
    ],
    kanji: [
      { char: "傾", on: ["ケイ"], kun: ["かたむ.く"], meaning: "lean, incline", strokes: 13, words: [
        { term: "傾向", reading: "けいこう", meaning: "tendency" },
        { term: "傾斜", reading: "けいしゃ", meaning: "slope" },
      ] },
      { char: "判", on: ["ハン", "バン"], kun: [], meaning: "judge", strokes: 7, words: [
        { term: "判断", reading: "はんだん", meaning: "judgement" },
        { term: "裁判", reading: "さいばん", meaning: "trial" },
      ] },
      { char: "響", on: ["キョウ"], kun: ["ひび.く"], meaning: "echo, resound", strokes: 20, words: [
        { term: "影響", reading: "えいきょう", meaning: "influence" },
        { term: "音響", reading: "おんきょう", meaning: "acoustics" },
      ] },
      { char: "因", on: ["イン"], kun: ["よ.る"], meaning: "cause", strokes: 6, words: [
        { term: "原因", reading: "げんいん", meaning: "cause" },
        { term: "要因", reading: "よういん", meaning: "factor" },
      ] },
    ],
  },
  {
    id: "n1-01",
    level: "N1",
    number: 1,
    title: "～を余儀なくされる・～ずにはおかない",
    titleEn: "Compulsion & inevitability",
    source: "Advanced reader · Unit 1",
    vocab: [
      { term: "余儀", reading: "よぎ", romaji: "yogi", meaning: "alternative, other means", pos: "noun" },
      { term: "企業", reading: "きぎょう", romaji: "kigyou", meaning: "enterprise, firm", pos: "noun" },
      { term: "制度", reading: "せいど", romaji: "seido", meaning: "system, institution", pos: "noun" },
      { term: "展開", reading: "てんかい", romaji: "tenkai", meaning: "development, unfold", pos: "noun" },
      { term: "促します", reading: "うながします", romaji: "unagashimasu", meaning: "urge, promote", pos: "verb" },
      { term: "覆します", reading: "くつがえします", romaji: "kutsugaeshimasu", meaning: "overturn", pos: "verb" },
      { term: "廃止", reading: "はいし", romaji: "haishi", meaning: "abolition", pos: "noun" },
      { term: "措置", reading: "そち", romaji: "sochi", meaning: "measure, step", pos: "noun" },
      { term: "深刻", reading: "しんこく", romaji: "shinkoku", meaning: "serious, grave", pos: "adjective" },
      { term: "明白", reading: "めいはく", romaji: "meihaku", meaning: "evident, clear", pos: "adjective" },
    ],
    grammar: [
      {
        point: "～を余儀なくされる",
        meaning: "be forced to ~",
        explanation:
          "Formal, often passive expression of unavoidable action due to circumstance: 計画の変更を余儀なくされた.",
        examples: [
          { jp: "大雨で、試合は中止を余儀なくされた。", reading: "おおあめで、しあいは ちゅうしを よぎなくされた。", en: "The match was forced to be cancelled due to heavy rain." },
        ],
      },
      {
        point: "～ずにはおかない",
        meaning: "will inevitably / cannot help but ~",
        explanation:
          "Two senses: a strong inevitable effect on others, or a determined will. 感動させずにはおかない.",
        examples: [
          { jp: "その映画は観客を感動させずにはおかないだろう。", reading: "その えいがは かんきゃくを かんどうさせずには おかないだろう。", en: "That film will inevitably move the audience." },
        ],
      },
      {
        point: "～といえども",
        meaning: "even though ~ / even ~",
        explanation:
          "Concessive, formal. 専門家といえども間違えることがある (Even experts make mistakes).",
        examples: [
          { jp: "専門家といえども、間違えることがある。", reading: "せんもんかに いえども、まちがえる ことが ある。", en: "Even experts sometimes make mistakes." },
        ],
      },
      {
        point: "～に至るまで",
        meaning: "down to / extending as far as ~",
        explanation:
          "Emphasises an extreme extent: 子どもに至るまで知っている.",
        examples: [
          { jp: "その噂は子どもに至るまで広まった。", reading: "その うわさは こどもに いたるまで ひろまった。", en: "The rumour spread even to the children." },
        ],
      },
    ],
    kanji: [
      { char: "余", on: ["ヨ"], kun: ["あま.る"], meaning: "surplus, remaining", strokes: 7, words: [
        { term: "余儀", reading: "よぎ", meaning: "alternative" },
        { term: "余裕", reading: "よゆう", meaning: "margin, composure" },
      ] },
      { char: "儀", on: ["ギ"], kun: [], meaning: "ceremony, matter", strokes: 15, words: [
        { term: "余儀", reading: "よぎ", meaning: "alternative" },
        { term: "儀式", reading: "ぎしき", meaning: "ceremony" },
      ] },
      { char: "企", on: ["キ"], kun: ["くわだ.てる"], meaning: "plan, enterprise", strokes: 6, words: [
        { term: "企業", reading: "きぎょう", meaning: "enterprise" },
        { term: "企画", reading: "きかく", meaning: "planning" },
      ] },
      { char: "制", on: ["セイ"], kun: [], meaning: "system, control", strokes: 8, words: [
        { term: "制度", reading: "せいど", meaning: "system" },
        { term: "制限", reading: "せいげん", meaning: "restriction" },
      ] },
    ],
  },
];
