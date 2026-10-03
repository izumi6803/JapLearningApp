import type { LessonSeed } from "@/lib/types";

export const n5: LessonSeed[] = [
  {
    id: "n5-01",
    level: "N5",
    number: 1,
    title: "はじめまして",
    titleEn: "Nice to meet you",
    source: "Minna no Nihongo I · Lesson 1",
    vocab: [
      { term: "私", reading: "わたし", romaji: "watashi", meaning: "I, me", pos: "pronoun" },
      { term: "私たち", reading: "わたしたち", romaji: "watashitachi", meaning: "we", pos: "pronoun" },
      { term: "あなた", reading: "あなた", romaji: "anata", meaning: "you", pos: "pronoun" },
      { term: "あの人", reading: "あのひと", romaji: "ano hito", meaning: "that person, he, she", pos: "pronoun" },
      { term: "あの方", reading: "あのかた", romaji: "ano kata", meaning: "that person (polite)", pos: "pronoun" },
      { term: "皆さん", reading: "みなさん", romaji: "minasan", meaning: "everyone, all of you", pos: "noun" },
      { term: "～さん", reading: "～さん", romaji: "~san", meaning: "Mr., Ms. (suffix)", pos: "suffix" },
      { term: "～ちゃん", reading: "～ちゃん", romaji: "~chan", meaning: "affectionate suffix", pos: "suffix" },
      { term: "～君", reading: "～くん", romaji: "~kun", meaning: "familiar suffix for males", pos: "suffix" },
      { term: "～人", reading: "～じん", romaji: "~jin", meaning: "nationality suffix", pos: "suffix" },
      { term: "先生", reading: "せんせい", romaji: "sensei", meaning: "teacher, instructor", pos: "noun" },
      { term: "教師", reading: "きょうし", romaji: "kyoushi", meaning: "teacher (as an occupation)", pos: "noun" },
      { term: "学生", reading: "がくせい", romaji: "gakusei", meaning: "student", pos: "noun" },
      { term: "会社員", reading: "かいしゃいん", romaji: "kaishain", meaning: "company employee", pos: "noun", example: { jp: "私はIMCの会社員です。", reading: "わたしはアイエムシーのかいしゃいんです。", en: "I'm an IMC employee." } },
      { term: "銀行員", reading: "ぎんこういん", romaji: "ginkouin", meaning: "bank employee", pos: "noun" },
      { term: "医者", reading: "いしゃ", romaji: "isha", meaning: "doctor", pos: "noun" },
      { term: "研究者", reading: "けんきゅうしゃ", romaji: "kenkyuusha", meaning: "researcher, scholar", pos: "noun" },
      { term: "大学", reading: "だいがく", romaji: "daigaku", meaning: "university", pos: "noun" },
      { term: "病院", reading: "びょういん", romaji: "byouin", meaning: "hospital", pos: "noun" },
      { term: "誰", reading: "だれ", romaji: "dare", meaning: "who", pos: "pronoun", example: { jp: "あの人は誰ですか。", reading: "あのひとはだれですか。", en: "Who is that person?" } },
      { term: "～歳", reading: "～さい", romaji: "~sai", meaning: "~ years old", pos: "counter" },
      { term: "何歳", reading: "なんさい", romaji: "nansai", meaning: "how old", pos: "expression" },
      { term: "初めまして", reading: "はじめまして", romaji: "hajimemashite", meaning: "how do you do (first meeting)", pos: "expression" },
      { term: "どうぞよろしく", reading: "どうぞよろしく", romaji: "douzo yoroshiku", meaning: "pleased to meet you", pos: "expression" },
    ],
    grammar: [
      {
        point: "Noun は Noun です",
        meaning: "A is B",
        explanation:
          "は marks the topic. です is the polite copula. It states identity or description: 私は学生です (I am a student).",
        examples: [
          { jp: "私はマイク・ミラーです。", reading: "わたしはまいく・みらーです。", en: "I'm Mike Miller." },
          { jp: "サントスさんは学生じゃありません。", reading: "さんとすさんはがくせいじゃありません。", en: "Mr. Santos is not a student." },
        ],
      },
      {
        point: "Noun は Noun じゃありません",
        meaning: "A is not B",
        explanation:
          "Negative of です. じゃ（では）ありません makes it polite-negative. In formal writing では is preferred over じゃ.",
        examples: [
          { jp: "私は医者じゃありません。", reading: "わたしはいしゃじゃありません。", en: "I'm not a doctor." },
        ],
      },
      {
        point: "Noun は Noun ですか",
        meaning: "Is A B?",
        explanation:
          "Add か at the end to form a question. Intonation rises. Answer with はい or いいえ.",
        examples: [
          { jp: "ミラーさんはアメリカ人ですか。", reading: "みらーさんはあめりかじんですか。", en: "Is Mr. Miller American?" },
          { jp: "はい、そうです。", reading: "はい、そうです。", en: "Yes, that's right." },
          { jp: "いいえ、違います。", reading: "いいえ、ちがいます。", en: "No, that's not right." },
        ],
      },
      {
        point: "Noun も",
        meaning: "also, too",
        explanation:
          "も replaces は when the topic is the same as the previous one: グプタさんも会社員です (Mr. Gupta is also a company employee).",
        examples: [
          { jp: "グプタさんも会社員です。", reading: "ぐぷたさんもかいしゃいんです。", en: "Mr. Gupta is also a company employee." },
        ],
      },
      {
        point: "Noun の Noun",
        meaning: "belonging / affiliation",
        explanation:
          "の links two nouns. The first modifies or owns the second: IMCの社員 (an employee of IMC), 日本の大学 (a Japanese university).",
        examples: [
          { jp: "私はIMCの社員です。", reading: "わたしはあいえむしー のしゃいんです。", en: "I'm an IMC employee." },
        ],
      },
      {
        point: "～歳 / 何歳",
        meaning: "age",
        explanation:
          "State age with ～歳: 私は25歳です. Ask with おいくつですか (polite) or 何歳ですか.",
        examples: [
          { jp: "マイクさんは25歳です。", reading: "まいくさんはにじゅうごさいです。", en: "Mike is 25 years old." },
        ],
      },
    ],
    kanji: [
      { char: "私", on: ["シ"], kun: ["わたし"], meaning: "I, private", strokes: 7, words: [
        { term: "私", reading: "わたし", meaning: "I" },
        { term: "私立", reading: "しりつ", meaning: "private (institution)" },
      ] },
      { char: "日", on: ["ニチ", "ジツ"], kun: ["ひ", "か"], meaning: "sun, day", strokes: 4, words: [
        { term: "日曜日", reading: "にちようび", meaning: "Sunday" },
        { term: "毎日", reading: "まいにち", meaning: "every day" },
      ] },
      { char: "本", on: ["ホン"], kun: ["もと"], meaning: "book, origin", strokes: 5, words: [
        { term: "本", reading: "ほん", meaning: "book" },
        { term: "日本", reading: "にほん", meaning: "Japan" },
      ] },
      { char: "語", on: ["ゴ"], kun: ["かた.る"], meaning: "language, word", strokes: 14, words: [
        { term: "日本語", reading: "にほんご", meaning: "Japanese language" },
        { term: "英語", reading: "えいご", meaning: "English language" },
      ] },
      { char: "学", on: ["ガク"], kun: ["まな.ぶ"], meaning: "study, learning", strokes: 8, words: [
        { term: "学生", reading: "がくせい", meaning: "student" },
        { term: "大学", reading: "だいがく", meaning: "university" },
      ] },
      { char: "生", on: ["セイ", "ショウ"], kun: ["い.きる", "う.まれる"], meaning: "life, birth", strokes: 5, words: [
        { term: "先生", reading: "せんせい", meaning: "teacher" },
        { term: "学生", reading: "がくせい", meaning: "student" },
      ] },
    ],
  },
  {
    id: "n5-02",
    level: "N5",
    number: 2,
    title: "これ・それ・あれ",
    titleEn: "This, that & that over there",
    source: "Minna no Nihongo I · Lesson 2",
    vocab: [
      { term: "これ", reading: "これ", romaji: "kore", meaning: "this (thing near me)", pos: "pronoun" },
      { term: "それ", reading: "それ", romaji: "sore", meaning: "that (near you)", pos: "pronoun" },
      { term: "あれ", reading: "あれ", romaji: "are", meaning: "that over there", pos: "pronoun" },
      { term: "この", reading: "この", romaji: "kono", meaning: "this ~ (before a noun)", pos: "adjective" },
      { term: "その", reading: "その", romaji: "sono", meaning: "that ~ (near you)", pos: "adjective" },
      { term: "あの", reading: "あの", romaji: "ano", meaning: "that ~ over there", pos: "adjective" },
      { term: "本", reading: "ほん", romaji: "hon", meaning: "book", pos: "noun" },
      { term: "辞書", reading: "じしょ", romaji: "jisho", meaning: "dictionary", pos: "noun" },
      { term: "雑誌", reading: "ざっし", romaji: "zasshi", meaning: "magazine", pos: "noun" },
      { term: "新聞", reading: "しんぶん", romaji: "shinbun", meaning: "newspaper", pos: "noun" },
      { term: "手帳", reading: "てちょう", romaji: "techou", meaning: "pocket notebook, planner", pos: "noun" },
      { term: "名刺", reading: "めいし", romaji: "meishi", meaning: "business card", pos: "noun" },
      { term: "鉛筆", reading: "えんぴつ", romaji: "enpitsu", meaning: "pencil", pos: "noun" },
      { term: "鍵", reading: "かぎ", romaji: "kagi", meaning: "key", pos: "noun" },
      { term: "時計", reading: "とけい", romaji: "tokei", meaning: "watch, clock", pos: "noun" },
      { term: "傘", reading: "かさ", romaji: "kasa", meaning: "umbrella", pos: "noun" },
      { term: "鞄", reading: "かばん", romaji: "kaban", meaning: "bag", pos: "noun" },
      { term: "車", reading: "くるま", romaji: "kuruma", meaning: "car, vehicle", pos: "noun" },
      { term: "机", reading: "つくえ", romaji: "tsukue", meaning: "desk", pos: "noun" },
      { term: "椅子", reading: "いす", romaji: "isu", meaning: "chair", pos: "noun" },
      { term: "お土産", reading: "おみやげ", romaji: "omiyage", meaning: "souvenir, gift", pos: "noun" },
      { term: "何", reading: "なに", romaji: "nani", meaning: "what", pos: "pronoun", example: { jp: "これは何ですか。", reading: "これはなんですか。", en: "What is this?" } },
      { term: "そう", reading: "そう", romaji: "sou", meaning: "that's right", pos: "expression" },
      { term: "違います", reading: "ちがいます", romaji: "chigaimasu", meaning: "no, that's not right", pos: "expression" },
    ],
    grammar: [
      {
        point: "これ／それ／あれ は Noun です",
        meaning: "This / that / that over there is B",
        explanation:
          "これ refers to a thing near the speaker, それ near the listener, あれ far from both. They stand alone as pronouns.",
        examples: [
          { jp: "これは本です。", reading: "これはほんです。", en: "This is a book." },
          { jp: "それは何ですか。", reading: "それはなんですか。", en: "What is that?" },
          { jp: "あれは傘です。", reading: "あれはかさです。", en: "That over there is an umbrella." },
        ],
      },
      {
        point: "この／その／あの Noun",
        meaning: "this / that / that over there + noun",
        explanation:
          "Unlike これ, these must be followed directly by a noun: この本 (this book). Use の Noun when the noun is already known: この本は私のです.",
        examples: [
          { jp: "この本は私のです。", reading: "このほんはわたしのです。", en: "This book is mine." },
          { jp: "あの方はどなたですか。", reading: "あのかたはどなたですか。", en: "Who is that person?" },
        ],
      },
      {
        point: "そうです / 違います",
        meaning: "That's right / That's not right",
        explanation:
          "Answer a yes/no question with はい、そうです or いいえ、違います. For ～ですか questions about nouns.",
        examples: [
          { jp: "それは辞書ですか。… はい、そうです。", reading: "それはじしょですか。", en: "Is that a dictionary? … Yes, it is." },
          { jp: "いいえ、違います。", reading: "いいえ、ちがいます。", en: "No, it isn't." },
        ],
      },
      {
        point: "Noun の",
        meaning: "one (possessive pronoun)",
        explanation:
          "の can replace a known noun: これは私の本です → これは私のです (This is mine).",
        examples: [
          { jp: "あれは誰のかばんですか。", reading: "あれはだれのかばんですか。", en: "Whose bag is that?" },
          { jp: "ミラーさんのです。", reading: "みらーさんのです。", en: "It's Mr. Miller's." },
        ],
      },
      {
        point: "これは～の～です",
        meaning: "this is a B of/from A",
        explanation:
          "Combine これ with の to describe origin or relation: これは日本の雑誌です (This is a Japanese magazine).",
        examples: [
          { jp: "これは日本の雑誌です。", reading: "これはにほんのざっしです。", en: "This is a Japanese magazine." },
        ],
      },
    ],
    kanji: [
      { char: "本", on: ["ホン"], kun: ["もと"], meaning: "book, origin", strokes: 5, words: [
        { term: "本", reading: "ほん", meaning: "book" },
        { term: "日本", reading: "にほん", meaning: "Japan" },
      ] },
      { char: "何", on: ["カ"], kun: ["なに", "なん"], meaning: "what", strokes: 7, words: [
        { term: "何", reading: "なに", meaning: "what" },
        { term: "何歳", reading: "なんさい", meaning: "how old" },
      ] },
      { char: "車", on: ["シャ"], kun: ["くるま"], meaning: "vehicle, car", strokes: 7, words: [
        { term: "車", reading: "くるま", meaning: "car" },
        { term: "電車", reading: "でんしゃ", meaning: "train" },
      ] },
      { char: "門", on: ["モン"], kun: ["かど"], meaning: "gate", strokes: 8, words: [
        { term: "門", reading: "もん", meaning: "gate" },
      ] },
      { char: "語", on: ["ゴ"], kun: ["かた.る"], meaning: "language", strokes: 14, words: [
        { term: "日本語", reading: "にほんご", meaning: "Japanese" },
        { term: "英語", reading: "えいご", meaning: "English" },
      ] },
    ],
  },
  {
    id: "n5-03",
    level: "N5",
    number: 3,
    title: "ここは私の学校です",
    titleEn: "Here is my school",
    source: "Minna no Nihongo I · Lesson 3",
    vocab: [
      { term: "ここ", reading: "ここ", romaji: "koko", meaning: "here", pos: "pronoun" },
      { term: "そこ", reading: "そこ", romaji: "soko", meaning: "there", pos: "pronoun" },
      { term: "あそこ", reading: "あそこ", romaji: "asoko", meaning: "over there", pos: "pronoun" },
      { term: "どこ", reading: "どこ", romaji: "doko", meaning: "where", pos: "pronoun" },
      { term: "学校", reading: "がっこう", romaji: "gakkou", meaning: "school", pos: "noun" },
      { term: "会社", reading: "かいしゃ", romaji: "kaisha", meaning: "company", pos: "noun" },
      { term: "銀行", reading: "ぎんこう", romaji: "ginkou", meaning: "bank", pos: "noun" },
      { term: "図書館", reading: "としょかん", romaji: "toshokan", meaning: "library", pos: "noun" },
      { term: "郵便局", reading: "ゆうびんきょく", romaji: "yuubinkyoku", meaning: "post office", pos: "noun" },
      { term: "食堂", reading: "しょくどう", romaji: "shokudou", meaning: "dining hall, cafeteria", pos: "noun" },
      { term: "事務所", reading: "じむしょ", romaji: "jimusho", meaning: "office", pos: "noun" },
      { term: "デパート", reading: "デパート", romaji: "depaato", meaning: "department store", pos: "noun" },
      { term: "建物", reading: "たてもの", romaji: "tatemono", meaning: "building", pos: "noun" },
      { term: "国", reading: "くに", romaji: "kuni", meaning: "country", pos: "noun" },
      { term: "出身", reading: "しゅっしん", romaji: "shusshin", meaning: "hometown, origin", pos: "noun" },
      { term: "～階", reading: "～かい", romaji: "~kai", meaning: "~ floor", pos: "counter" },
      { term: "何階", reading: "なんがい", romaji: "nangai", meaning: "what floor", pos: "expression" },
      { term: "～円", reading: "～えん", romaji: "~en", meaning: "~ yen", pos: "counter" },
      { term: "いくら", reading: "いくら", romaji: "ikura", meaning: "how much", pos: "pronoun" },
      { term: "お手洗い", reading: "おてあらい", romaji: "otearai", meaning: "restroom", pos: "noun" },
    ],
    grammar: [
      {
        point: "ここ／そこ／あそこ は Noun です",
        meaning: "Here / there / over there is B",
        explanation:
          "These are place pronouns. ここ is near the speaker, そこ near the listener, あそこ far from both.",
        examples: [
          { jp: "ここは私の学校です。", reading: "ここはわたしのがっこうです。", en: "Here is my school." },
          { jp: "あそこは郵便局です。", reading: "あそこはゆうびんきょくです。", en: "Over there is the post office." },
        ],
      },
      {
        point: "Noun は 場所です",
        meaning: "A is at place P",
        explanation:
          "Ask where with どこ / どちら. どちら is the polite form: 会社はどこですか。",
        examples: [
          { jp: "トイレはどこですか。", reading: "といれはどこですか。", en: "Where is the restroom?" },
          { jp: "あそこです。", reading: "あそこです。", en: "It's over there." },
        ],
      },
      {
        point: "Noun の Noun（所属）",
        meaning: "belonging to / from",
        explanation:
          "国 + の + 人 / 会社: アメリカの車. Ask origin with お国はどちらですか.",
        examples: [
          { jp: "お国はどちらですか。", reading: "おくにはどちらですか。", en: "Where are you from?" },
          { jp: "IMCの社員です。", reading: "あいえむしー のしゃいんです。", en: "I'm an IMC employee." },
        ],
      },
      {
        point: "Noun は いくらですか",
        meaning: "How much is A?",
        explanation: "Ask prices with いくら. Prices use ～円.",
        examples: [
          { jp: "この傘はいくらですか。", reading: "このかさはいくらですか。", en: "How much is this umbrella?" },
          { jp: "三千円です。", reading: "さんぜんえんです。", en: "It's 3,000 yen." },
        ],
      },
    ],
    kanji: [
      { char: "国", on: ["コク"], kun: ["くに"], meaning: "country", strokes: 8, words: [
        { term: "国", reading: "くに", meaning: "country" },
        { term: "外国", reading: "がいこく", meaning: "foreign country" },
      ] },
      { char: "学", on: ["ガク"], kun: ["まな.ぶ"], meaning: "study", strokes: 8, words: [
        { term: "学校", reading: "がっこう", meaning: "school" },
        { term: "大学", reading: "だいがく", meaning: "university" },
      ] },
      { char: "校", on: ["コウ"], kun: [], meaning: "school", strokes: 10, words: [
        { term: "学校", reading: "がっこう", meaning: "school" },
      ] },
      { char: "会", on: ["カイ", "エ"], kun: ["あ.う"], meaning: "meet, society", strokes: 6, words: [
        { term: "会社", reading: "かいしゃ", meaning: "company" },
        { term: "会議", reading: "かいぎ", meaning: "meeting" },
      ] },
      { char: "社", on: ["シャ"], kun: ["やしろ"], meaning: "company, shrine", strokes: 7, words: [
        { term: "会社", reading: "かいしゃ", meaning: "company" },
        { term: "神社", reading: "じんじゃ", meaning: "shrine" },
      ] },
      { char: "書", on: ["ショ"], kun: ["か.く"], meaning: "write", strokes: 10, words: [
        { term: "辞書", reading: "じしょ", meaning: "dictionary" },
        { term: "図書館", reading: "としょかん", meaning: "library" },
      ] },
    ],
  },
  {
    id: "n5-04",
    level: "N5",
    number: 4,
    title: "そちらは何時から何時までですか",
    titleEn: "From what time to what time?",
    source: "Minna no Nihongo I · Lesson 4",
    vocab: [
      { term: "起きます", reading: "おきます", romaji: "okimasu", meaning: "get up, wake up", pos: "verb" },
      { term: "寝ます", reading: "ねます", romaji: "nemasu", meaning: "sleep, go to bed", pos: "verb" },
      { term: "働きます", reading: "はたらきます", romaji: "hatarakimasu", meaning: "work", pos: "verb" },
      { term: "休みます", reading: "やすみます", romaji: "yasumimasu", meaning: "rest, take a break", pos: "verb" },
      { term: "勉強します", reading: "べんきょうします", romaji: "benkyoushimasu", meaning: "study", pos: "verb" },
      { term: "終わります", reading: "おわります", romaji: "owarimasu", meaning: "finish, end", pos: "verb" },
      { term: "何時", reading: "なんじ", romaji: "nanji", meaning: "what time", pos: "expression" },
      { term: "何分", reading: "なんぷん", romaji: "nanpun", meaning: "what minute", pos: "expression" },
      { term: "午前", reading: "ごぜん", romaji: "gozen", meaning: "a.m., morning", pos: "noun" },
      { term: "午後", reading: "ごご", romaji: "gogo", meaning: "p.m., afternoon", pos: "noun" },
      { term: "朝", reading: "あさ", romaji: "asa", meaning: "morning", pos: "noun" },
      { term: "昼", reading: "ひる", romaji: "hiru", meaning: "noon, daytime", pos: "noun" },
      { term: "晩", reading: "ばん", romaji: "ban", meaning: "evening, night", pos: "noun" },
      { term: "今", reading: "いま", romaji: "ima", meaning: "now", pos: "noun" },
      { term: "毎朝", reading: "まいあさ", romaji: "maiasa", meaning: "every morning", pos: "noun" },
      { term: "毎晩", reading: "まいばん", romaji: "maiban", meaning: "every night", pos: "noun" },
      { term: "毎日", reading: "まいにち", romaji: "mainichi", meaning: "every day", pos: "noun" },
      { term: "月曜日", reading: "げつようび", romaji: "getsuyoubi", meaning: "Monday", pos: "noun" },
      { term: "日曜日", reading: "にちようび", romaji: "nichiyoubi", meaning: "Sunday", pos: "noun" },
      { term: "何曜日", reading: "なんようび", romaji: "nanyoubi", meaning: "what day of the week", pos: "expression" },
      { term: "～時", reading: "～じ", romaji: "~ji", meaning: "~ o'clock", pos: "counter" },
      { term: "～分", reading: "～ふん", romaji: "~fun", meaning: "~ minute", pos: "counter" },
      { term: "～半", reading: "～はん", romaji: "~han", meaning: "half past", pos: "counter" },
      { term: "～ごろ", reading: "～ごろ", romaji: "~goro", meaning: "around (time)", pos: "suffix" },
    ],
    grammar: [
      {
        point: "今 ～時～分です",
        meaning: "It is ~ o'clock",
        explanation:
          "Tell time with 時 and 分. 半 means half past. 午前/午後 specify a.m./p.m.",
        examples: [
          { jp: "今、4時5分です。", reading: "いま、よじごふんです。", en: "It's 4:05 now." },
          { jp: "午前9時半です。", reading: "ごぜんくじはんです。", en: "It's 9:30 a.m." },
        ],
      },
      {
        point: "Verb ます / ません / ました / ませんでした",
        meaning: "polite verb forms",
        explanation:
          "ます (present/future), ません (negative), ました (past), ませんでした (past negative).",
        examples: [
          { jp: "毎朝6時に起きます。", reading: "まいあさろくじにおきます。", en: "I get up at 6 every morning." },
          { jp: "昨日勉強しませんでした。", reading: "きのうべんきょうしませんでした。", en: "I didn't study yesterday." },
        ],
      },
      {
        point: "～から ～まで",
        meaning: "from ~ to ~",
        explanation:
          "から marks the start, まで the end — for time or place: 9時から5時まで働きます.",
        examples: [
          { jp: "9時から5時まで働きます。", reading: "くじからごじまではたらきます。", en: "I work from 9 to 5." },
        ],
      },
      {
        point: "Noun（時間）に Verb",
        meaning: "at (a specific time)",
        explanation:
          "に marks a specific point in time. Do not use it with 毎日, 今, きのう, or ～ごろ.",
        examples: [
          { jp: "日曜日に休みます。", reading: "にちようびにやすみます。", en: "I rest on Sundays." },
          { jp: "7時ごろ起きます。", reading: "しちじごろおきます。", en: "I get up around 7." },
        ],
      },
    ],
    kanji: [
      { char: "時", on: ["ジ"], kun: ["とき"], meaning: "time, hour", strokes: 10, words: [
        { term: "時間", reading: "じかん", meaning: "time" },
        { term: "時計", reading: "とけい", meaning: "watch, clock" },
      ] },
      { char: "間", on: ["カン"], kun: ["あいだ", "ま"], meaning: "interval, space", strokes: 12, words: [
        { term: "時間", reading: "じかん", meaning: "time" },
        { term: "一週間", reading: "いっしゅうかん", meaning: "one week" },
      ] },
      { char: "分", on: ["フン", "ブン"], kun: ["わ.ける"], meaning: "minute, divide", strokes: 4, words: [
        { term: "分", reading: "ふん", meaning: "minute" },
        { term: "五分", reading: "ごふん", meaning: "five minutes" },
      ] },
      { char: "午", on: ["ゴ"], kun: [], meaning: "noon", strokes: 4, words: [
        { term: "午前", reading: "ごぜん", meaning: "a.m." },
        { term: "午後", reading: "ごご", meaning: "p.m." },
      ] },
      { char: "前", on: ["ゼン"], kun: ["まえ"], meaning: "before, front", strokes: 9, words: [
        { term: "午前", reading: "ごぜん", meaning: "a.m." },
        { term: "名前", reading: "なまえ", meaning: "name" },
      ] },
      { char: "半", on: ["ハン"], kun: ["なか.ば"], meaning: "half", strokes: 5, words: [
        { term: "半", reading: "はん", meaning: "half" },
        { term: "三時半", reading: "さんじはん", meaning: "3:30" },
      ] },
    ],
  },
  {
    id: "n5-05",
    level: "N5",
    number: 5,
    title: "箱根へ行きます",
    titleEn: "Going to Hakone",
    source: "Minna no Nihongo I · Lesson 5",
    vocab: [
      { term: "行きます", reading: "いきます", romaji: "ikimasu", meaning: "go", pos: "verb" },
      { term: "来ます", reading: "きます", romaji: "kimasu", meaning: "come", pos: "verb" },
      { term: "帰ります", reading: "かえります", romaji: "kaerimasu", meaning: "return, go home", pos: "verb" },
      { term: "電車", reading: "でんしゃ", romaji: "densha", meaning: "train", pos: "noun" },
      { term: "地下鉄", reading: "ちかてつ", romaji: "chikatetsu", meaning: "subway", pos: "noun" },
      { term: "新幹線", reading: "しんかんせん", romaji: "shinkansen", meaning: "bullet train", pos: "noun" },
      { term: "飛行機", reading: "ひこうき", romaji: "hikouki", meaning: "airplane", pos: "noun" },
      { term: "自転車", reading: "じてんしゃ", romaji: "jitensha", meaning: "bicycle", pos: "noun" },
      { term: "徒歩", reading: "とほ", romaji: "toho", meaning: "on foot", pos: "noun" },
      { term: "駅", reading: "えき", romaji: "eki", meaning: "station", pos: "noun" },
      { term: "空港", reading: "くうこう", romaji: "kuukou", meaning: "airport", pos: "noun" },
      { term: "週末", reading: "しゅうまつ", romaji: "shuumatsu", meaning: "weekend", pos: "noun" },
      { term: "先週", reading: "せんしゅう", romaji: "senshuu", meaning: "last week", pos: "noun" },
      { term: "来週", reading: "らいしゅう", romaji: "raishuu", meaning: "next week", pos: "noun" },
      { term: "今年", reading: "ことし", romaji: "kotoshi", meaning: "this year", pos: "noun" },
      { term: "来年", reading: "らいねん", romaji: "rainen", meaning: "next year", pos: "noun" },
      { term: "去年", reading: "きょねん", romaji: "kyonen", meaning: "last year", pos: "noun" },
      { term: "誕生日", reading: "たんじょうび", romaji: "tanjoubi", meaning: "birthday", pos: "noun" },
      { term: "いつ", reading: "いつ", romaji: "itsu", meaning: "when", pos: "pronoun" },
      { term: "～と一緒に", reading: "～といっしょに", romaji: "~toisshoni", meaning: "together with ~", pos: "expression" },
      { term: "とても", reading: "とても", romaji: "totemo", meaning: "very", pos: "adverb" },
      { term: "～で", reading: "～で", romaji: "~de", meaning: "by (means of)", pos: "particle" },
    ],
    grammar: [
      {
        point: "場所 へ 行きます／来ます／帰ります",
        meaning: "go/come/return to a place",
        explanation:
          "へ marks direction. に can also be used. どこへも with a negative means 'nowhere'.",
        examples: [
          { jp: "京都へ行きます。", reading: "きょうとへいきます。", en: "I'm going to Kyoto." },
          { jp: "どこへも行きません。", reading: "どこへもいきません。", en: "I'm not going anywhere." },
        ],
      },
      {
        point: "Noun（手段）で",
        meaning: "by means of ~",
        explanation:
          "で marks the method of transport or a tool: 電車で行きます (go by train). For walking, use 歩いて.",
        examples: [
          { jp: "新幹線で京都へ行きます。", reading: "しんかんせんで きょうとへ いきます。", en: "I go to Kyoto by bullet train." },
          { jp: "歩いて駅へ行きます。", reading: "あるいてえきへいきます。", en: "I walk to the station." },
        ],
      },
      {
        point: "人と 一緒に",
        meaning: "together with a person",
        explanation:
          "と marks a companion: 家族と一緒に日本へ来ました. と alone can also mean 'with'.",
        examples: [
          { jp: "家族と一緒に日本へ来ました。", reading: "かぞくといっしょに にほんへ きました。", en: "I came to Japan with my family." },
        ],
      },
      {
        point: "いつ / いつも",
        meaning: "when / always",
        explanation:
          "いつ asks an indefinite time and takes no に. いつも means 'always'.",
        examples: [
          { jp: "いつ日本へ行きますか。", reading: "いつにほんへいきますか。", en: "When are you going to Japan?" },
        ],
      },
    ],
    kanji: [
      { char: "行", on: ["コウ", "ギョウ"], kun: ["い.く"], meaning: "go", strokes: 6, words: [
        { term: "行きます", reading: "いきます", meaning: "go" },
        { term: "銀行", reading: "ぎんこう", meaning: "bank" },
      ] },
      { char: "来", on: ["ライ"], kun: ["く.る"], meaning: "come", strokes: 7, words: [
        { term: "来ます", reading: "きます", meaning: "come" },
        { term: "来週", reading: "らいしゅう", meaning: "next week" },
      ] },
      { char: "帰", on: ["キ"], kun: ["かえ.る"], meaning: "return", strokes: 10, words: [
        { term: "帰ります", reading: "かえります", meaning: "return home" },
      ] },
      { char: "駅", on: ["エキ"], kun: [], meaning: "station", strokes: 14, words: [
        { term: "駅", reading: "えき", meaning: "station" },
        { term: "駅前", reading: "えきまえ", meaning: "in front of the station" },
      ] },
      { char: "電", on: ["デン"], kun: [], meaning: "electricity", strokes: 13, words: [
        { term: "電車", reading: "でんしゃ", meaning: "train" },
        { term: "電気", reading: "でんき", meaning: "electricity" },
      ] },
      { char: "年", on: ["ネン"], kun: ["とし"], meaning: "year", strokes: 6, words: [
        { term: "来年", reading: "らいねん", meaning: "next year" },
        { term: "去年", reading: "きょねん", meaning: "last year" },
      ] },
    ],
  },
];
