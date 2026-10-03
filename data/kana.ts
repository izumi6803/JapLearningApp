export type KanaScript = "hiragana" | "katakana";

export interface KanaCell {
  h: string;
  k: string;
  r: string;
}

export interface KanaRow {
  id: string;
  label: string;
  romaji: string;
  cells: (KanaCell | null)[];
}

export interface KanaGroup {
  id: string;
  label: string;
  note: string;
  columns: number;
  rows: KanaRow[];
}

const cell = (h: string, k: string, r: string): KanaCell => ({ h, k, r });

export const kanaGroups: KanaGroup[] = [
  {
    id: "seion",
    label: "五十音",
    note: "basic syllabary · 46 characters",
    columns: 5,
    rows: [
      { id: "a", label: "あ行", romaji: "a", cells: [cell("あ", "ア", "a"), cell("い", "イ", "i"), cell("う", "ウ", "u"), cell("え", "エ", "e"), cell("お", "オ", "o")] },
      { id: "ka", label: "か行", romaji: "ka", cells: [cell("か", "カ", "ka"), cell("き", "キ", "ki"), cell("く", "ク", "ku"), cell("け", "ケ", "ke"), cell("こ", "コ", "ko")] },
      { id: "sa", label: "さ行", romaji: "sa", cells: [cell("さ", "サ", "sa"), cell("し", "シ", "shi"), cell("す", "ス", "su"), cell("せ", "セ", "se"), cell("そ", "ソ", "so")] },
      { id: "ta", label: "た行", romaji: "ta", cells: [cell("た", "タ", "ta"), cell("ち", "チ", "chi"), cell("つ", "ツ", "tsu"), cell("て", "テ", "te"), cell("と", "ト", "to")] },
      { id: "na", label: "な行", romaji: "na", cells: [cell("な", "ナ", "na"), cell("に", "ニ", "ni"), cell("ぬ", "ヌ", "nu"), cell("ね", "ネ", "ne"), cell("の", "ノ", "no")] },
      { id: "ha", label: "は行", romaji: "ha", cells: [cell("は", "ハ", "ha"), cell("ひ", "ヒ", "hi"), cell("ふ", "フ", "fu"), cell("へ", "ヘ", "he"), cell("ほ", "ホ", "ho")] },
      { id: "ma", label: "ま行", romaji: "ma", cells: [cell("ま", "マ", "ma"), cell("み", "ミ", "mi"), cell("む", "ム", "mu"), cell("め", "メ", "me"), cell("も", "モ", "mo")] },
      { id: "ya", label: "や行", romaji: "ya", cells: [cell("や", "ヤ", "ya"), null, cell("ゆ", "ユ", "yu"), null, cell("よ", "ヨ", "yo")] },
      { id: "ra", label: "ら行", romaji: "ra", cells: [cell("ら", "ラ", "ra"), cell("り", "リ", "ri"), cell("る", "ル", "ru"), cell("れ", "レ", "re"), cell("ろ", "ロ", "ro")] },
      { id: "wa", label: "わ行", romaji: "wa", cells: [cell("わ", "ワ", "wa"), null, null, null, cell("を", "ヲ", "wo")] },
      { id: "n", label: "ん", romaji: "n", cells: [cell("ん", "ン", "n")] },
    ],
  },
  {
    id: "dakuon",
    label: "濁音",
    note: "voiced · が ざ だ ば",
    columns: 5,
    rows: [
      { id: "ga", label: "が行", romaji: "ga", cells: [cell("が", "ガ", "ga"), cell("ぎ", "ギ", "gi"), cell("ぐ", "グ", "gu"), cell("げ", "ゲ", "ge"), cell("ご", "ゴ", "go")] },
      { id: "za", label: "ざ行", romaji: "za", cells: [cell("ざ", "ザ", "za"), cell("じ", "ジ", "ji"), cell("ず", "ズ", "zu"), cell("ぜ", "ゼ", "ze"), cell("ぞ", "ゾ", "zo")] },
      { id: "da", label: "だ行", romaji: "da", cells: [cell("だ", "ダ", "da"), cell("ぢ", "ヂ", "ji"), cell("づ", "ヅ", "zu"), cell("で", "デ", "de"), cell("ど", "ド", "do")] },
      { id: "ba", label: "ば行", romaji: "ba", cells: [cell("ば", "バ", "ba"), cell("び", "ビ", "bi"), cell("ぶ", "ブ", "bu"), cell("べ", "ベ", "be"), cell("ぼ", "ボ", "bo")] },
    ],
  },
  {
    id: "handakuon",
    label: "半濁音",
    note: "semi-voiced · ぱ",
    columns: 5,
    rows: [
      { id: "pa", label: "ぱ行", romaji: "pa", cells: [cell("ぱ", "パ", "pa"), cell("ぴ", "ピ", "pi"), cell("ぷ", "プ", "pu"), cell("ぺ", "ペ", "pe"), cell("ぽ", "ポ", "po")] },
    ],
  },
  {
    id: "yoon",
    label: "拗音",
    note: "contracted · きゃ しゅ ちょ",
    columns: 3,
    rows: [
      { id: "kya", label: "きゃ行", romaji: "kya", cells: [cell("きゃ", "キャ", "kya"), cell("きゅ", "キュ", "kyu"), cell("きょ", "キョ", "kyo")] },
      { id: "sha", label: "しゃ行", romaji: "sha", cells: [cell("しゃ", "シャ", "sha"), cell("しゅ", "シュ", "shu"), cell("しょ", "ショ", "sho")] },
      { id: "cha", label: "ちゃ行", romaji: "cha", cells: [cell("ちゃ", "チャ", "cha"), cell("ちゅ", "チュ", "chu"), cell("ちょ", "チョ", "cho")] },
      { id: "nya", label: "にゃ行", romaji: "nya", cells: [cell("にゃ", "ニャ", "nya"), cell("にゅ", "ニュ", "nyu"), cell("にょ", "ニョ", "nyo")] },
      { id: "hya", label: "ひゃ行", romaji: "hya", cells: [cell("ひゃ", "ヒャ", "hya"), cell("ひゅ", "ヒュ", "hyu"), cell("ひょ", "ヒョ", "hyo")] },
      { id: "mya", label: "みゃ行", romaji: "mya", cells: [cell("みゃ", "ミャ", "mya"), cell("みゅ", "ミュ", "myu"), cell("みょ", "ミョ", "myo")] },
      { id: "rya", label: "りゃ行", romaji: "rya", cells: [cell("りゃ", "リャ", "rya"), cell("りゅ", "リュ", "ryu"), cell("りょ", "リョ", "ryo")] },
      { id: "gya", label: "ぎゃ行", romaji: "gya", cells: [cell("ぎゃ", "ギャ", "gya"), cell("ぎゅ", "ギュ", "gyu"), cell("ぎょ", "ギョ", "gyo")] },
      { id: "ja", label: "じゃ行", romaji: "ja", cells: [cell("じゃ", "ジャ", "ja"), cell("じゅ", "ジュ", "ju"), cell("じょ", "ジョ", "jo")] },
      { id: "bya", label: "びゃ行", romaji: "bya", cells: [cell("びゃ", "ビャ", "bya"), cell("びゅ", "ビュ", "byu"), cell("びょ", "ビョ", "byo")] },
      { id: "pya", label: "ぴゃ行", romaji: "pya", cells: [cell("ぴゃ", "ピャ", "pya"), cell("ぴゅ", "ピュ", "pyu"), cell("ぴょ", "ピョ", "pyo")] },
    ],
  },
];

export interface KanaEntry {
  script: KanaScript;
  kana: string;
  alt: string;
  romaji: string;
}

export const kanaEntries: KanaEntry[] = kanaGroups.flatMap((group) =>
  group.rows.flatMap((row) =>
    row.cells.flatMap((c) =>
      c
        ? [
            { script: "hiragana" as const, kana: c.h, alt: c.k, romaji: c.r },
            { script: "katakana" as const, kana: c.k, alt: c.h, romaji: c.r },
          ]
        : [],
    ),
  ),
);

export function kanaOf(script: KanaScript): KanaEntry[] {
  return kanaEntries.filter((e) => e.script === script);
}
