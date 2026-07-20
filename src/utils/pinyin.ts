/**
 * 經典文脈 ClassicFlow — 拼音與注音標註對照表
 * 包含漢語拼音及注音符號（Bopomofo）的對照，支持多音字精度校準。
 */
const PINYIN_DICT: Record<string, string> = {
  '道可道，非常道。名可名，非常名。': 'dào kě dào, fēi cháng dào. míng kě míng, fēi cháng míng.',
  '無名天地之始；有名萬物之母。': 'wú míng tiān dì zhī shǐ; yǒu míng wàn wù zhī mǔ.',
  '上善若水。水善利萬物而不爭，處眾人之所惡，故幾於道。': 'shàng shàn ruò shuǐ. shuǐ shàn lì wàn wù ér bù zhēng, chǔ zhòng rén zhī suǒ wù, gù jī yú dào.',
  '北冥有魚，其名為鯤。': 'běi míng yǒu yú, qí míng wéi kūn.',
  '鯤之大，不知其幾千里也；化而為鳥，其名為鵬。': 'kūn zhī dà, bù zhī qí jǐ qiān lǐ yě; huà ér wéi niǎo, qí míng wéi péng.'
}

const BOPOMOFO_DICT: Record<string, string> = {
  '道可道，非常道。名可名，非常名。': 'ㄉㄠˋ ㄎㄜˇ ㄉㄠˋ, ㄈㄟ ㄔㄤˊ ㄉㄠˋ. ㄇㄧㄥˊ ㄎㄜˇ ㄇㄧㄥˊ, ㄈㄟ ㄔㄤˊ ㄇㄧㄥˊ.',
  '無名天地之始；有名萬物之母。': 'ㄨˊ ㄇㄧㄥˊ ㄊㄧㄢ ㄉㄧˋ ㄓ ㄕˇ; ㄧㄡˇ ㄇㄧㄥˊ ㄨㄢˋ ㄨˋ ㄓ ㄇㄨˇ.',
  '上善若水。水善利萬物而不爭，處眾人之所惡，故幾於道。': 'ㄕㄤˋ ㄕㄢˋ ㄖㄨㄛˋ ㄕㄨㄟˇ. ㄕㄨㄟˇ ㄕㄢˋ ㄌㄧˋ ㄨㄢˋ ㄨˋ ㄦˊ ㄅㄨˋ ㄓㄥ, ㄔㄨˇ ㄓㄨㄥˋ ㄖㄣˊ ㄓ ㄙㄨㄛˇ ㄨˋ, ㄍㄨˋ ㄐㄧ ㄩˊ ㄉㄠˋ.',
  '北冥有魚，其名為鯤。': 'ㄅㄟˇ ㄇㄧㄥˊ ㄧㄡˇ ㄩˊ, ㄑㄧˊ ㄇㄧㄥˊ ㄨㄟˊ ㄎㄨㄣ.',
  '鯤之大，不知其幾千里也；化而為鳥，其名為鵬。': 'ㄎㄨㄣ ㄓ ㄉㄚˋ, ㄅㄨˋ ㄓ ㄑㄧˊ ㄐㄧˇ ㄑㄧㄢ ㄌㄧˇ ㄧㄝˇ; ㄏㄨㄚˋ ㄦˊ ㄨㄟˊ ㄋㄧㄠˇ, ㄑㄧˊ ㄇㄧㄥˊ ㄨㄟˊ ㄆㄥˊ.'
}

export function getPinyin(text: string): string | undefined {
  return PINYIN_DICT[text]
}

export function getBopomofo(text: string): string | undefined {
  return BOPOMOFO_DICT[text]
}
