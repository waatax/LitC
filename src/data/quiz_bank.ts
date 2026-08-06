// Auto-generated Quiz Bank
export type QuestionType = 'fill-in-blank' | 'word-meaning' | 'analysis' | 'background' | 'translation';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  workId: string;
  chapterId: string;
  passageId: string;
}

export const quizBank: QuizQuestion[] = [
  {
    "id": "q-1",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「城中吏卒民男女___辨異衣章微職，令男女可知。」",
    "options": [
      "，皆",
      "之賞",
      "兮伯",
      "以有"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「城中吏卒民男女，皆辨異衣章微職，令男女可知。」",
    "workId": "mo-zi",
    "chapterId": "mo-zi_ch-65",
    "passageId": "mo-zi_ch-65_p-7"
  },
  {
    "id": "q-2",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「一質一文，___常也。」",
    "options": [
      "飲酒者",
      "舍於蟻",
      "陵民、",
      "非苟易"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「一質一文，非苟易常也。」",
    "workId": "yan-tie-lun",
    "chapterId": "yan-tie-lun_ch-4",
    "passageId": "yan-tie-lun_ch-4_p-3"
  },
  {
    "id": "q-3",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「___伐善若此，讓之至也。」",
    "options": [
      "上下不",
      "皋陶曰",
      "不專心",
      "智累心"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「上下不伐善若此，讓之至也。」",
    "workId": "si-ma-fa",
    "chapterId": "si-ma-fa_ch-1",
    "passageId": "si-ma-fa_ch-1_p-23"
  },
  {
    "id": "q-4",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「天齊于民，___一日，非終惟終，在人。」",
    "options": [
      "俾我",
      "必以",
      "：『",
      "固多"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「天齊于民，俾我一日，非終惟終，在人。」",
    "workId": "shu-jing",
    "chapterId": "shu-jing_ch-59",
    "passageId": "shu-jing_ch-59_p-6"
  },
  {
    "id": "q-5",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「___月累丸二而不墜，則失者錙銖；」",
    "options": [
      "五六",
      "曰：",
      "好書",
      "吏責"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「五六月累丸二而不墜，則失者錙銖；」",
    "workId": "zhuangzi",
    "chapterId": "zhuangzi_ch-19",
    "passageId": "zhuangzi_ch-19_p-17"
  },
  {
    "id": "q-6",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「四___政，不用其良。」",
    "options": [
      "、泗",
      "惡可",
      "十四",
      "國無"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「四國無政，不用其良。」",
    "workId": "shi-jing",
    "chapterId": "shi-jing_ch-19",
    "passageId": "shi-jing_ch-19_p-3"
  },
  {
    "id": "q-7",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「是故___事實而不誣。」",
    "options": [
      "之乎",
      "質之",
      "雖授",
      "腹心"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「是故質之事實而不誣。」",
    "workId": "qian-han-ji",
    "chapterId": "qian-han-ji_ch-1",
    "passageId": "qian-han-ji_ch-1_p-1"
  },
  {
    "id": "q-8",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「魚___，有莘其尾。」",
    "options": [
      "在在藻",
      "師之野",
      "而不達",
      "王曰、"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「魚在在藻，有莘其尾。」",
    "workId": "shi-jing",
    "chapterId": "shi-jing_ch-22",
    "passageId": "shi-jing_ch-22_p-1"
  },
  {
    "id": "q-9",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「若___之，則在君與子矣。」",
    "options": [
      "夫潤澤",
      "勃定代",
      "臣言為",
      "為宰于"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「若夫潤澤之，則在君與子矣。」",
    "workId": "meng-zi",
    "chapterId": "meng-zi_ch-5",
    "passageId": "meng-zi_ch-5_p-3"
  },
  {
    "id": "q-10",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「《詩》曰：___惟德！」",
    "options": [
      "隕、金",
      "「不顯",
      "生休矣",
      "壺子曰"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「《詩》曰：「不顯惟德！」",
    "workId": "li-ji",
    "chapterId": "li-ji_ch-31",
    "passageId": "li-ji_ch-31_p-38"
  },
  {
    "id": "q-11",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「其除___，不見其所由而禍除。」",
    "options": [
      "禍也",
      "或群",
      "則反",
      "則緇"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「其除禍也，不見其所由而禍除。」",
    "workId": "wenzi",
    "chapterId": "wenzi_ch-2",
    "passageId": "wenzi_ch-2_p-2"
  },
  {
    "id": "q-12",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「___役，不日不月。」",
    "options": [
      "無俾大",
      "錕鋙之",
      "君子于",
      "五者园"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「君子于役，不日不月。」",
    "workId": "shi-jing",
    "chapterId": "shi-jing_ch-6",
    "passageId": "shi-jing_ch-6_p-2"
  },
  {
    "id": "q-13",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「大___其力，小邦懷其德。」",
    "options": [
      "三后",
      "邦畏",
      "同尊",
      "賊公"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「大邦畏其力，小邦懷其德。」",
    "workId": "shu-jing",
    "chapterId": "shu-jing_ch-35",
    "passageId": "shu-jing_ch-35_p-6"
  },
  {
    "id": "q-14",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「王曰、是良史也、___之。」",
    "options": [
      "則為之",
      "子善視",
      "、晉之",
      "先勝其"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「王曰、是良史也、子善視之。」",
    "workId": "gu-wen-guan-zhi",
    "chapterId": "gu-wen-guan-zhi_ch-32",
    "passageId": "gu-wen-guan-zhi_ch-32_p-90"
  },
  {
    "id": "q-15",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「如彼雨雪___集維霰。」",
    "options": [
      "宥之",
      "孔子",
      "，先",
      "未立"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「如彼雨雪，先集維霰。」",
    "workId": "shi-jing",
    "chapterId": "shi-jing_ch-21",
    "passageId": "shi-jing_ch-21_p-7"
  },
  {
    "id": "q-16",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「溪壑易___心難滿」。」",
    "options": [
      "則上大",
      "越卬敉",
      "填，人",
      "重質有"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「溪壑易填，人心難滿」。」",
    "workId": "",
    "chapterId": "",
    "passageId": "cai-gen-tan_ch-4_p-221"
  },
  {
    "id": "q-17",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「___悖逆詐偽之心，有淫泆作亂之事。」",
    "options": [
      "則刑繁",
      "樂身者",
      "而畏之",
      "於是有"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「於是有悖逆詐偽之心，有淫泆作亂之事。」",
    "workId": "li-ji",
    "chapterId": "li-ji_ch-19",
    "passageId": "li-ji_ch-19_p-9"
  },
  {
    "id": "q-18",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「光武年九歲而孤，___父良。」",
    "options": [
      "功居列",
      "所以列",
      "養於叔",
      "君之命"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「光武年九歲而孤，養於叔父良。」",
    "workId": "hou-han-shu",
    "chapterId": "hou-han-shu_ch-1",
    "passageId": "hou-han-shu_ch-1_p-1"
  },
  {
    "id": "q-19",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「不可謂兩___此為兩過。」",
    "options": [
      "投艱",
      "便於",
      "明，",
      "太公"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「不可謂兩明，此為兩過。」",
    "workId": "han-fei-zi",
    "chapterId": "han-fei-zi_ch-18",
    "passageId": "han-fei-zi_ch-18_p-10"
  },
  {
    "id": "q-20",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「范___欲以其城先下君。」",
    "options": [
      "冠以",
      "子墨",
      "陽令",
      "其容"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「范陽令欲以其城先下君。」",
    "workId": "qian-han-ji",
    "chapterId": "qian-han-ji_ch-2",
    "passageId": "qian-han-ji_ch-2_p-3"
  },
  {
    "id": "q-21",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「無___勇，職為亂階。」",
    "options": [
      "袢也",
      "拳無",
      "罕殺",
      "若欲"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「無拳無勇，職為亂階。」",
    "workId": "shi-jing",
    "chapterId": "shi-jing_ch-19",
    "passageId": "shi-jing_ch-19_p-8"
  },
  {
    "id": "q-22",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「___目，無令驚駭。」",
    "options": [
      "、求利",
      "：徙而",
      "功者不",
      "戢其耳"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「戢其耳目，無令驚駭。」",
    "workId": "wu-zi",
    "chapterId": "wu-zi_ch-3",
    "passageId": "wu-zi_ch-3_p-8"
  },
  {
    "id": "q-23",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「都督閻___望、棨戟遙臨。」",
    "options": [
      "公之雅",
      "令民家",
      "萬人若",
      "自知我"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「都督閻公之雅望、棨戟遙臨。」",
    "workId": "gu-wen-guan-zhi",
    "chapterId": "gu-wen-guan-zhi_ch-113",
    "passageId": "gu-wen-guan-zhi_ch-113_p-179"
  },
  {
    "id": "q-24",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「君子至止，___將。」",
    "options": [
      "中康時",
      "鸞聲將",
      "：「上",
      "師兵為"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「君子至止，鸞聲將將。」",
    "workId": "shi-jing",
    "chapterId": "shi-jing_ch-18",
    "passageId": "shi-jing_ch-18_p-2"
  },
  {
    "id": "q-25",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「是知一國___萬人之命、懸於宰相、可不慎歟。」",
    "options": [
      "之政、",
      "眩視憂",
      "見壺子",
      "人皆可"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「是知一國之政、萬人之命、懸於宰相、可不慎歟。」",
    "workId": "gu-wen-guan-zhi",
    "chapterId": "gu-wen-guan-zhi_ch-154",
    "passageId": "gu-wen-guan-zhi_ch-154_p-224"
  },
  {
    "id": "q-26",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「故理民之道，在於節用尚本，___田而已。」",
    "options": [
      "子愀然",
      "甚鄭伯",
      "分土井",
      "下莫不"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「故理民之道，在於節用尚本，分土井田而已。」",
    "workId": "yan-tie-lun",
    "chapterId": "yan-tie-lun_ch-2",
    "passageId": "yan-tie-lun_ch-2_p-4"
  },
  {
    "id": "q-27",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「以王___，以武王為子，父作之，子述之。」",
    "options": [
      "、馬逝",
      "有娀、",
      "十有一",
      "季為父"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「以王季為父，以武王為子，父作之，子述之。」",
    "workId": "zhong-yong",
    "chapterId": "zhong-yong_ch-18",
    "passageId": "zhong-yong_ch-18_p-18"
  },
  {
    "id": "q-28",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「又非___，能明吾意之難也；」",
    "options": [
      "非邃養",
      "翕其舌",
      "得一山",
      "吾辯之"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「又非吾辯之，能明吾意之難也；」",
    "workId": "han-fei-zi",
    "chapterId": "han-fei-zi_ch-12",
    "passageId": "han-fei-zi_ch-12_p-1"
  },
  {
    "id": "q-29",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「刑者侀也，侀者成也，一成而不___，故君子盡心焉。」",
    "options": [
      "：民",
      "先志",
      "可變",
      "有敵"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「刑者侀也，侀者成也，一成而不可變，故君子盡心焉。」",
    "workId": "li-ji",
    "chapterId": "li-ji_ch-5",
    "passageId": "li-ji_ch-5_p-53"
  },
  {
    "id": "q-30",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「孟子曰：「居下位而不獲於上，民___而治也。」",
    "options": [
      "：「殺",
      "不可得",
      "祭所先",
      "而誅必"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「孟子曰：「居下位而不獲於上，民不可得而治也。」",
    "workId": "meng-zi",
    "chapterId": "meng-zi_ch-7",
    "passageId": "meng-zi_ch-7_p-12"
  },
  {
    "id": "q-31",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「其同乎萬物生___復歸於無物者、暫聚之形。」",
    "options": [
      "、衣食",
      "而寧數",
      "諸守皆",
      "死、而"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「其同乎萬物生死、而復歸於無物者、暫聚之形。」",
    "workId": "gu-wen-guan-zhi",
    "chapterId": "gu-wen-guan-zhi_ch-173",
    "passageId": "gu-wen-guan-zhi_ch-173_p-243"
  },
  {
    "id": "q-32",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「類___雌雄，故風化。」",
    "options": [
      "自為",
      "先王",
      "不自",
      "立不"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「類自為雌雄，故風化。」",
    "workId": "zhuangzi",
    "chapterId": "zhuangzi_ch-14",
    "passageId": "zhuangzi_ch-14_p-77"
  },
  {
    "id": "q-33",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「雍人拭羊，宗人視之，宰夫北___碑南，東上。」",
    "options": [
      "術、",
      "面於",
      "大夫",
      "臣自"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「雍人拭羊，宗人視之，宰夫北面於碑南，東上。」",
    "workId": "li-ji",
    "chapterId": "li-ji_ch-21",
    "passageId": "li-ji_ch-21_p-75"
  },
  {
    "id": "q-34",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「為屨以買___屨，夫與屨也。」",
    "options": [
      "甫燕",
      "衣為",
      "郭溝",
      "致之"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「為屨以買衣為屨，夫與屨也。」",
    "workId": "mo-zi",
    "chapterId": "mo-zi_ch-43",
    "passageId": "mo-zi_ch-43_p-3"
  },
  {
    "id": "q-35",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「神之___介爾景福。」",
    "options": [
      "之秉彝",
      "不諭至",
      "聽之，",
      "法無常"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「神之聽之，介爾景福。」",
    "workId": "shi-jing",
    "chapterId": "shi-jing_ch-20",
    "passageId": "shi-jing_ch-20_p-7"
  },
  {
    "id": "q-36",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「通智得而不勞，其次勞而不病___下病而不勞。」",
    "options": [
      "大命",
      "，其",
      "鼓弗",
      "之民"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「通智得而不勞，其次勞而不病，其下病而不勞。」",
    "workId": "wenzi",
    "chapterId": "wenzi_ch-7",
    "passageId": "wenzi_ch-7_p-14"
  },
  {
    "id": "q-37",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「___者，壹稱而上下皆得焉耳矣。」",
    "options": [
      "知辯",
      "其禮",
      "夫銘",
      "之所"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「夫銘者，壹稱而上下皆得焉耳矣。」",
    "workId": "li-ji",
    "chapterId": "li-ji_ch-25",
    "passageId": "li-ji_ch-25_p-30"
  },
  {
    "id": "q-38",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「有渰___，興雨祈祈。」",
    "options": [
      "萋萋",
      "而無",
      "孟子",
      "於晉"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「有渰萋萋，興雨祈祈。」",
    "workId": "shi-jing",
    "chapterId": "shi-jing_ch-21",
    "passageId": "shi-jing_ch-21_p-2"
  },
  {
    "id": "q-39",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「上歷說其意，為陳大命，請為前___堅陣。」",
    "options": [
      "行諸部",
      "晉之伐",
      "去汙而",
      "將以斯"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「上歷說其意，為陳大命，請為前行諸部堅陣。」",
    "workId": "dong-guan-han-ji",
    "chapterId": "dong-guan-han-ji_ch-1",
    "passageId": "dong-guan-han-ji_ch-1_p-2"
  },
  {
    "id": "q-40",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「置杯焉則膠，水___舟大也。」",
    "options": [
      "齊、",
      "淺而",
      "之以",
      "型範"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「置杯焉則膠，水淺而舟大也。」",
    "workId": "zhuangzi",
    "chapterId": "zhuangzi_ch-1",
    "passageId": "zhuangzi_ch-1_p-4"
  },
  {
    "id": "q-41",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「孔子___「共殯服，則子麻，弁絰，疏衰，菲，杖。」",
    "options": [
      "者之",
      "曰：",
      "勢激",
      "羽拔"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「孔子曰：「共殯服，則子麻，弁絰，疏衰，菲，杖。」",
    "workId": "li-ji",
    "chapterId": "li-ji_ch-7",
    "passageId": "li-ji_ch-7_p-74"
  },
  {
    "id": "q-42",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「」七月，南陽守齮降，封為殷侯___恢千戶。」",
    "options": [
      "有妖孽",
      "憂不懼",
      "无有矣",
      "，封陳"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「」七月，南陽守齮降，封為殷侯，封陳恢千戶。」",
    "workId": "han-shu",
    "chapterId": "han-shu_ch-1",
    "passageId": "han-shu_ch-1_p-23"
  },
  {
    "id": "q-43",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「故君子三日齊___見其所祭者。」",
    "options": [
      "母甚",
      "附君",
      "祭器",
      "，必"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「故君子三日齊，必見其所祭者。」",
    "workId": "li-ji",
    "chapterId": "li-ji_ch-11",
    "passageId": "li-ji_ch-11_p-57"
  },
  {
    "id": "q-44",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「凡人未___，若不克見；」",
    "options": [
      "徒娛",
      "見聖",
      "寡人",
      "故輕"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「凡人未見聖，若不克見；」",
    "workId": "shu-jing",
    "chapterId": "shu-jing_ch-53",
    "passageId": "shu-jing_ch-53_p-2"
  },
  {
    "id": "q-45",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「是百王之所___而禮法之大分也。」",
    "options": [
      "咸陽",
      "、冠",
      "我則",
      "同，"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「是百王之所同，而禮法之大分也。」",
    "workId": "xunzi",
    "chapterId": "xunzi_ch-11",
    "passageId": "xunzi_ch-11_p-15"
  },
  {
    "id": "q-46",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「麟之角，振___，于嗟麟兮。」",
    "options": [
      "振公族",
      "則所用",
      "、蔡方",
      "百姓皆"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「麟之角，振振公族，于嗟麟兮。」",
    "workId": "shi-jing",
    "chapterId": "shi-jing_ch-1",
    "passageId": "shi-jing_ch-1_p-11"
  },
  {
    "id": "q-47",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「攻不___不可以言攻。」",
    "options": [
      "必拔，",
      "司之令",
      "其以鼎",
      "以獨立"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「攻不必拔，不可以言攻。」",
    "workId": "wei-liao-zi",
    "chapterId": "wei-liao-zi_ch-5",
    "passageId": "wei-liao-zi_ch-5_p-6"
  },
  {
    "id": "q-48",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「蛟龍得___而神可立也；」",
    "options": [
      "澊而",
      "水，",
      "犯害",
      "為勇"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「蛟龍得水，而神可立也；」",
    "workId": "guanzi",
    "chapterId": "guanzi_ch-2",
    "passageId": "guanzi_ch-2_p-1"
  },
  {
    "id": "q-49",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「聖人執要___來效。」",
    "options": [
      "，四方",
      "之窕貨",
      "澤致定",
      "擇可立"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「聖人執要，四方來效。」",
    "workId": "han-fei-zi",
    "chapterId": "han-fei-zi_ch-8",
    "passageId": "han-fei-zi_ch-8_p-1"
  },
  {
    "id": "q-50",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「失之數而___則疑矣。」",
    "options": [
      "无為而",
      "、綠柰",
      "求之信",
      "弗敢先"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「失之數而求之信則疑矣。」",
    "workId": "shen-bu-hai",
    "chapterId": "shen-bu-hai_ch-1",
    "passageId": "shen-bu-hai_ch-1_p-27"
  },
  {
    "id": "q-51",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「諸___命者，若鄉里齊荊者，皆是。」",
    "options": [
      "馳載驅",
      "以居運",
      "受上帝",
      "守約而"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「諸以居運命者，若鄉里齊荊者，皆是。」",
    "workId": "mo-zi",
    "chapterId": "mo-zi_ch-44",
    "passageId": "mo-zi_ch-44_p-21"
  },
  {
    "id": "q-52",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「___，則慎己而闚彼。」",
    "options": [
      "水亦",
      "意論",
      "安其",
      "如此"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「如此，則慎己而闚彼。」",
    "workId": "han-fei-zi",
    "chapterId": "han-fei-zi_ch-51",
    "passageId": "han-fei-zi_ch-51_p-2"
  },
  {
    "id": "q-53",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「___則骨肉爲行路。」",
    "options": [
      "不敢先",
      "立二世",
      "傲物、",
      "故晝夜"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「傲物、則骨肉爲行路。」",
    "workId": "gu-wen-guan-zhi",
    "chapterId": "gu-wen-guan-zhi_ch-111",
    "passageId": "gu-wen-guan-zhi_ch-111_p-177"
  },
  {
    "id": "q-54",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「內者，吾甲兵頓，士民___積索，田疇荒，囷倉虛；」",
    "options": [
      "其措兵",
      "病，蓄",
      "「今是",
      "將逼主"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「內者，吾甲兵頓，士民病，蓄積索，田疇荒，囷倉虛；」",
    "workId": "han-fei-zi",
    "chapterId": "han-fei-zi_ch-1",
    "passageId": "han-fei-zi_ch-1_p-5"
  },
  {
    "id": "q-55",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「我文考文王克成厥勳，誕膺天命___方夏。」",
    "options": [
      "牖必取",
      "，以撫",
      "衝茀茀",
      "陽膚為"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「我文考文王克成厥勳，誕膺天命，以撫方夏。」",
    "workId": "shu-jing",
    "chapterId": "shu-jing_ch-35",
    "passageId": "shu-jing_ch-35_p-6"
  },
  {
    "id": "q-56",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「二者皆譏、而學士___於世云。」",
    "options": [
      "多稱",
      "於氣",
      "有所",
      "元慶"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「二者皆譏、而學士多稱於世云。」",
    "workId": "gu-wen-guan-zhi",
    "chapterId": "gu-wen-guan-zhi_ch-84",
    "passageId": "gu-wen-guan-zhi_ch-84_p-150"
  },
  {
    "id": "q-57",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「雖___物，不可有其物。」",
    "options": [
      "在野",
      "不去",
      "犧牲",
      "不己"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「雖不去物，不可有其物。」",
    "workId": "liezi",
    "chapterId": "liezi_ch-7",
    "passageId": "liezi_ch-7_p-15"
  },
  {
    "id": "q-58",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「率乃祖文王之遺訓，無若爾___違王命。」",
    "options": [
      "有合",
      "考之",
      "、恣",
      "曰："
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「率乃祖文王之遺訓，無若爾考之違王命。」",
    "workId": "shu-jing",
    "chapterId": "shu-jing_ch-49",
    "passageId": "shu-jing_ch-49_p-3"
  },
  {
    "id": "q-59",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「」乃歌曰：「股肱喜哉，元首___百工熙哉！」",
    "options": [
      "起哉，",
      "言旋言",
      "育不量",
      "「材生"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「」乃歌曰：「股肱喜哉，元首起哉，百工熙哉！」",
    "workId": "shiji",
    "chapterId": "shiji_ch-2",
    "passageId": "shiji_ch-2_p-25"
  },
  {
    "id": "q-60",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「___，移之郊，如初禮。」",
    "options": [
      "于宗",
      "協比",
      "若姓",
      "不變"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「不變，移之郊，如初禮。」",
    "workId": "li-ji",
    "chapterId": "li-ji_ch-5",
    "passageId": "li-ji_ch-5_p-41"
  },
  {
    "id": "q-61",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「采采卷___盈頃筐。」",
    "options": [
      "所惡於",
      "滿而不",
      "愈於已",
      "耳，不"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「采采卷耳，不盈頃筐。」",
    "workId": "shi-jing",
    "chapterId": "shi-jing_ch-1",
    "passageId": "shi-jing_ch-1_p-3"
  },
  {
    "id": "q-62",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「子夏問於孔子曰：「居父母之___何？」",
    "options": [
      "制獨斷",
      "仇如之",
      "於阼西",
      "事以吳"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「子夏問於孔子曰：「居父母之仇如之何？」",
    "workId": "li-ji",
    "chapterId": "li-ji_ch-3",
    "passageId": "li-ji_ch-3_p-54"
  },
  {
    "id": "q-63",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「如枉道而___何也？」",
    "options": [
      "惠子曰",
      "從彼，",
      "葉萋萋",
      "天錫公"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「如枉道而從彼，何也？」",
    "workId": "meng-zi",
    "chapterId": "meng-zi_ch-6",
    "passageId": "meng-zi_ch-6_p-1"
  },
  {
    "id": "q-64",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「山林藪澤、足以___用、則寶之。」",
    "options": [
      "備財",
      "公天",
      "革之",
      "盡以"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「山林藪澤、足以備財用、則寶之。」",
    "workId": "gu-wen-guan-zhi",
    "chapterId": "gu-wen-guan-zhi_ch-43",
    "passageId": "gu-wen-guan-zhi_ch-43_p-109"
  },
  {
    "id": "q-65",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「視駝所種樹、或遷徙___活。」",
    "options": [
      "子辭貴",
      "羿精於",
      "、無不",
      "、儀狄"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「視駝所種樹、或遷徙、無不活。」",
    "workId": "gu-wen-guan-zhi",
    "chapterId": "gu-wen-guan-zhi_ch-147",
    "passageId": "gu-wen-guan-zhi_ch-147_p-213"
  },
  {
    "id": "q-66",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「曰：___物之不齊，物之情也；」",
    "options": [
      "不敢",
      "且行",
      "「夫",
      "沃武"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「曰：「夫物之不齊，物之情也；」",
    "workId": "meng-zi",
    "chapterId": "meng-zi_ch-5",
    "passageId": "meng-zi_ch-5_p-4"
  },
  {
    "id": "q-67",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「宣子殺羊___囚叔向。」",
    "options": [
      "舌虎、",
      "吾未見",
      "寇伏地",
      "學為無"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「宣子殺羊舌虎、囚叔向。」",
    "workId": "gu-wen-guan-zhi",
    "chapterId": "gu-wen-guan-zhi_ch-25",
    "passageId": "gu-wen-guan-zhi_ch-25_p-83"
  },
  {
    "id": "q-68",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「淑問如___在泮獻囚。」",
    "options": [
      "不與一",
      "恃者親",
      "皋陶，",
      "北擊齊"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「淑問如皋陶，在泮獻囚。」",
    "workId": "shi-jing",
    "chapterId": "shi-jing_ch-29",
    "passageId": "shi-jing_ch-29_p-3"
  },
  {
    "id": "q-69",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「故虎豹為猛矣，然君___而用之。」",
    "options": [
      "待附",
      "南郭",
      "子剝",
      "言者"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「故虎豹為猛矣，然君子剝而用之。」",
    "workId": "xunzi",
    "chapterId": "xunzi_ch-9",
    "passageId": "xunzi_ch-9_p-17"
  },
  {
    "id": "q-70",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「士成綺鴈行避影___遂進而問：「脩身若何？」",
    "options": [
      "公旦從",
      "軍下濕",
      "，履行",
      "從先生"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「士成綺鴈行避影，履行遂進而問：「脩身若何？」",
    "workId": "zhuangzi",
    "chapterId": "zhuangzi_ch-13",
    "passageId": "zhuangzi_ch-13_p-58"
  },
  {
    "id": "q-71",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「欲立功名、___尚賢使能矣。」",
    "options": [
      "地之大",
      "之時、",
      "則莫若",
      "：「凡"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「欲立功名、則莫若尚賢使能矣。」",
    "workId": "xunzi",
    "chapterId": "xunzi_ch-9",
    "passageId": "xunzi_ch-9_p-5"
  },
  {
    "id": "q-72",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「」苗___：「何賀焉！」",
    "options": [
      "狼逐",
      "則異",
      "子曰",
      "又多"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「」苗子曰：「何賀焉！」",
    "workId": "han-fei-zi",
    "chapterId": "han-fei-zi_ch-33",
    "passageId": "han-fei-zi_ch-33_p-40"
  },
  {
    "id": "q-73",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「___謂與予並，汝之顏厚矣。」",
    "options": [
      "請自",
      "行者",
      "而皆",
      "食鬱"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「而皆謂與予並，汝之顏厚矣。」",
    "workId": "liezi",
    "chapterId": "liezi_ch-6",
    "passageId": "liezi_ch-6_p-2"
  },
  {
    "id": "q-74",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「伊尹乃言曰___先王昧爽丕顯，坐以待旦。」",
    "options": [
      "驚曰",
      "：「",
      "故效",
      "「古"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「伊尹乃言曰：「先王昧爽丕顯，坐以待旦。」",
    "workId": "shu-jing",
    "chapterId": "shu-jing_ch-17",
    "passageId": "shu-jing_ch-17_p-3"
  },
  {
    "id": "q-75",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「深智一物，___變。」",
    "options": [
      "缺曰：",
      "人不傳",
      "成、曰",
      "眾隱皆"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「深智一物，眾隱皆變。」",
    "workId": "han-fei-zi",
    "chapterId": "han-fei-zi_ch-30",
    "passageId": "han-fei-zi_ch-30_p-12"
  },
  {
    "id": "q-76",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「吾問焉，曰：『___學邪？」",
    "options": [
      "君特雞",
      "操舟可",
      "自來謝",
      "而非越"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「吾問焉，曰：『操舟可學邪？」",
    "workId": "zhuangzi",
    "chapterId": "zhuangzi_ch-19",
    "passageId": "zhuangzi_ch-19_p-20"
  },
  {
    "id": "q-77",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「公孫述出___入賀王曰：「百姓乃皆里買牛為王禱。」",
    "options": [
      "內外之",
      "見之，",
      "利害之",
      "之寶龜"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「公孫述出見之，入賀王曰：「百姓乃皆里買牛為王禱。」",
    "workId": "han-fei-zi",
    "chapterId": "han-fei-zi_ch-35",
    "passageId": "han-fei-zi_ch-35_p-16"
  },
  {
    "id": "q-78",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「王子弗出，___顛隮。」",
    "options": [
      "我乃",
      "雅馴",
      "連月",
      "強而"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「王子弗出，我乃顛隮。」",
    "workId": "shu-jing",
    "chapterId": "shu-jing_ch-29",
    "passageId": "shu-jing_ch-29_p-4"
  },
  {
    "id": "q-79",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「父北面而事之，所___事父之道也。」",
    "options": [
      "以明子",
      "有四失",
      "誅滅趙",
      "季孫必"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「父北面而事之，所以明子事父之道也。」",
    "workId": "li-ji",
    "chapterId": "li-ji_ch-25",
    "passageId": "li-ji_ch-25_p-18"
  },
  {
    "id": "q-80",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「___胡觴天子于當水之陽。」",
    "options": [
      "亦有焉",
      "大戎□",
      "狗●馬",
      "終則對"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「大戎□胡觴天子于當水之陽。」",
    "workId": "mutianzi-zhuan",
    "chapterId": "mutianzi-zhuan_ch-1",
    "passageId": "mutianzi-zhuan_ch-1_p-2"
  },
  {
    "id": "q-81",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「倒___事以嘗所疑則姦情得。」",
    "options": [
      "祿爾",
      "後行",
      "言反",
      "倫列"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「倒言反事以嘗所疑則姦情得。」",
    "workId": "han-fei-zi",
    "chapterId": "han-fei-zi_ch-30",
    "passageId": "han-fei-zi_ch-30_p-14"
  },
  {
    "id": "q-82",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「樂統___辨異，禮樂之說，管乎人情矣。」",
    "options": [
      "足以有",
      "同，禮",
      "戮誅罰",
      "是謂樂"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「樂統同，禮辨異，禮樂之說，管乎人情矣。」",
    "workId": "li-ji",
    "chapterId": "li-ji_ch-19",
    "passageId": "li-ji_ch-19_p-39"
  },
  {
    "id": "q-83",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「」孟子曰___慕也。」",
    "options": [
      "：「怨",
      "以相應",
      "其政乖",
      "侍坐於"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「」孟子曰：「怨慕也。」",
    "workId": "meng-zi",
    "chapterId": "meng-zi_ch-9",
    "passageId": "meng-zi_ch-9_p-1"
  },
  {
    "id": "q-84",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「語曰：「其___其子抱。」",
    "options": [
      "為天下",
      "母好者",
      "雖惡而",
      "再撫四"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「語曰：「其母好者其子抱。」",
    "workId": "han-fei-zi",
    "chapterId": "han-fei-zi_ch-17",
    "passageId": "han-fei-zi_ch-17_p-2"
  },
  {
    "id": "q-85",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「王奪之___霸奪之與，彊奪之地。」",
    "options": [
      "不免",
      "舉也",
      "人，",
      "丘門"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「王奪之人，霸奪之與，彊奪之地。」",
    "workId": "xunzi",
    "chapterId": "xunzi_ch-9",
    "passageId": "xunzi_ch-9_p-7"
  },
  {
    "id": "q-86",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「」___對曰：「君之及此言也，是臣之福也。」",
    "options": [
      "子咎",
      "問孫",
      "孔子",
      "祭、"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「」孔子對曰：「君之及此言也，是臣之福也。」",
    "workId": "li-ji",
    "chapterId": "li-ji_ch-27",
    "passageId": "li-ji_ch-27_p-17"
  },
  {
    "id": "q-87",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「有直情而徑行者，___之道也。」",
    "options": [
      "胡不",
      "變法",
      "既生",
      "戎狄"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「有直情而徑行者，戎狄之道也。」",
    "workId": "li-ji",
    "chapterId": "li-ji_ch-4",
    "passageId": "li-ji_ch-4_p-45"
  },
  {
    "id": "q-88",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「吝於財者失所親，___者失士。」",
    "options": [
      "始形於",
      "信小人",
      "有室之",
      "謂之隱"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「吝於財者失所親，信小人者失士。」",
    "workId": "guanzi",
    "chapterId": "guanzi_ch-1",
    "passageId": "guanzi_ch-1_p-9"
  },
  {
    "id": "q-89",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「亢倉子曰：「___者妄。」",
    "options": [
      "廷者",
      "蚊虻",
      "傳之",
      "當隊"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「亢倉子曰：「傳之者妄。」",
    "workId": "liezi",
    "chapterId": "liezi_ch-4",
    "passageId": "liezi_ch-4_p-2"
  },
  {
    "id": "q-90",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「禮者，本末___，終始相應。」",
    "options": [
      "相順",
      "衣食",
      "、喪",
      "供犧"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「禮者，本末相順，終始相應。」",
    "workId": "xunzi",
    "chapterId": "xunzi_ch-27",
    "passageId": "xunzi_ch-27_p-46"
  },
  {
    "id": "q-91",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「是故質___而弓矢至焉；」",
    "options": [
      "的張，",
      "貪之實",
      "人之喪",
      "君之命"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「是故質的張，而弓矢至焉；」",
    "workId": "xunzi",
    "chapterId": "xunzi_ch-1",
    "passageId": "xunzi_ch-1_p-8"
  },
  {
    "id": "q-92",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「天池之___江之濆、曰有怪物焉。」",
    "options": [
      "莫非王",
      "濱、大",
      "趨庭、",
      "堯之為"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「天池之濱、大江之濆、曰有怪物焉。」",
    "workId": "gu-wen-guan-zhi",
    "chapterId": "gu-wen-guan-zhi_ch-133",
    "passageId": "gu-wen-guan-zhi_ch-133_p-199"
  },
  {
    "id": "q-93",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「詩云：「桃之夭___其葉蓁蓁；」",
    "options": [
      "則能",
      "頃焉",
      "夭，",
      "作新"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「詩云：「桃之夭夭，其葉蓁蓁；」",
    "workId": "da-xue",
    "chapterId": "da-xue_ch-10",
    "passageId": "da-xue_ch-10_p-11"
  },
  {
    "id": "q-94",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「所___者，有不為大盜守者乎？」",
    "options": [
      "謂至聖",
      "於一曲",
      "嚴足畏",
      "浮于天"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「所謂至聖者，有不為大盜守者乎？」",
    "workId": "zhuangzi",
    "chapterId": "zhuangzi_ch-10",
    "passageId": "zhuangzi_ch-10_p-6"
  },
  {
    "id": "q-95",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「命弦者曰：「請奏《___，間若一。」",
    "options": [
      "天子同",
      "貍首》",
      "事於仁",
      "帝曰、"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「命弦者曰：「請奏《貍首》，間若一。」",
    "workId": "li-ji",
    "chapterId": "li-ji_ch-40",
    "passageId": "li-ji_ch-40_p-2"
  },
  {
    "id": "q-96",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「是故，養世子___不慎也。」",
    "options": [
      "瞻子",
      "不可",
      "曰：",
      "必墾"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「是故，養世子不可不慎也。」",
    "workId": "li-ji",
    "chapterId": "li-ji_ch-8",
    "passageId": "li-ji_ch-8_p-13"
  },
  {
    "id": "q-97",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「」對曰：「王試度其功，___板，射稽八板；」",
    "options": [
      "出戎",
      "退道",
      "及爾",
      "癸四"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「」對曰：「王試度其功，癸四板，射稽八板；」",
    "workId": "han-fei-zi",
    "chapterId": "han-fei-zi_ch-32",
    "passageId": "han-fei-zi_ch-32_p-12"
  },
  {
    "id": "q-98",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「___：「父母之年，不可不知也。」",
    "options": [
      "、曹",
      "照於",
      "子曰",
      "鑒："
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「子曰：「父母之年，不可不知也。」",
    "workId": "lun-yu",
    "chapterId": "lun-yu_ch-4",
    "passageId": "lun-yu_ch-4_p-21"
  },
  {
    "id": "q-99",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「骨肉可刑，親戚可滅，___可闕也。」",
    "options": [
      "不遍愛",
      "」鬥伯",
      "至法不",
      "湯放桀"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「骨肉可刑，親戚可滅，至法不可闕也。」",
    "workId": "shenzi",
    "chapterId": "shenzi_ch-8",
    "passageId": "shenzi_ch-8_p-56"
  },
  {
    "id": "q-100",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「___鍾，於樂辟雍。」",
    "options": [
      "於論鼓",
      "經緯蹊",
      "方圓而",
      "足以有"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「於論鼓鍾，於樂辟雍。」",
    "workId": "shi-jing",
    "chapterId": "shi-jing_ch-23",
    "passageId": "shi-jing_ch-23_p-8"
  },
  {
    "id": "q-101",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「天下是___未可定也。」",
    "options": [
      "聲而",
      "有不",
      "彼徂",
      "非果"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「天下是非果未可定也。」",
    "workId": "zhuangzi",
    "chapterId": "zhuangzi_ch-18",
    "passageId": "zhuangzi_ch-18_p-9"
  },
  {
    "id": "q-102",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「冕弁兵革藏於私家___禮也，是謂脅君。」",
    "options": [
      "，非",
      "若此",
      "不賞",
      "舉火"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「冕弁兵革藏於私家，非禮也，是謂脅君。」",
    "workId": "li-ji",
    "chapterId": "li-ji_ch-9",
    "passageId": "li-ji_ch-9_p-10"
  },
  {
    "id": "q-103",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「復___齒、綴足、飯、設飾、帷堂并作。」",
    "options": [
      "不睦",
      "、楔",
      "隱為",
      "芽空"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「復、楔齒、綴足、飯、設飾、帷堂并作。」",
    "workId": "li-ji",
    "chapterId": "li-ji_ch-3",
    "passageId": "li-ji_ch-3_p-106"
  },
  {
    "id": "q-104",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「由湯至於文王，五百___，若伊尹、萊朱則見而知之；」",
    "options": [
      "爭地以",
      "有餘歲",
      "爾將何",
      "棄杖者"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「由湯至於文王，五百有餘歲，若伊尹、萊朱則見而知之；」",
    "workId": "meng-zi",
    "chapterId": "meng-zi_ch-14",
    "passageId": "meng-zi_ch-14_p-38"
  },
  {
    "id": "q-105",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「___朝，至日晏，夜講經聽誦。」",
    "options": [
      "古者",
      "謫我",
      "自三",
      "旦聽"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「旦聽朝，至日晏，夜講經聽誦。」",
    "workId": "dong-guan-han-ji",
    "chapterId": "dong-guan-han-ji_ch-2",
    "passageId": "dong-guan-han-ji_ch-2_p-5"
  },
  {
    "id": "q-106",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「屬其性於五味___如俞兒，非吾所謂臧也；」",
    "options": [
      "商趣利",
      "板梯貍",
      "率大戛",
      "，雖通"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「屬其性於五味，雖通如俞兒，非吾所謂臧也；」",
    "workId": "zhuangzi",
    "chapterId": "zhuangzi_ch-8",
    "passageId": "zhuangzi_ch-8_p-18"
  },
  {
    "id": "q-107",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「___無益之民六，而世譽之如彼；」",
    "options": [
      "歌且",
      "姦偽",
      "、而",
      "用休"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「姦偽無益之民六，而世譽之如彼；」",
    "workId": "han-fei-zi",
    "chapterId": "han-fei-zi_ch-45",
    "passageId": "han-fei-zi_ch-45_p-1"
  },
  {
    "id": "q-108",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「」與其妾訕其良___而相泣於中庭。」",
    "options": [
      "氏嘗",
      "人，",
      "召之",
      "我憚"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「」與其妾訕其良人，而相泣於中庭。」",
    "workId": "meng-zi",
    "chapterId": "meng-zi_ch-8",
    "passageId": "meng-zi_ch-8_p-33"
  },
  {
    "id": "q-109",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「天秩有禮，___五禮有庸哉！」",
    "options": [
      "我以",
      "意者",
      "自我",
      "迅以"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「天秩有禮，自我五禮有庸哉！」",
    "workId": "shu-jing",
    "chapterId": "shu-jing_ch-1",
    "passageId": "shu-jing_ch-1_p-61"
  },
  {
    "id": "q-110",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「廛無夫里之布，則天下之___而願為之氓矣。」",
    "options": [
      "此止於",
      "而不亡",
      "人之學",
      "民皆悅"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「廛無夫里之布，則天下之民皆悅而願為之氓矣。」",
    "workId": "meng-zi",
    "chapterId": "meng-zi_ch-3",
    "passageId": "meng-zi_ch-3_p-5"
  },
  {
    "id": "q-111",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「閎___，面無見膚。」",
    "options": [
      "夭之狀",
      "婦主必",
      "命之情",
      "載奇逢"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「閎夭之狀，面無見膚。」",
    "workId": "xunzi",
    "chapterId": "xunzi_ch-5",
    "passageId": "xunzi_ch-5_p-2"
  },
  {
    "id": "q-112",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「沛今共誅令，擇可立立之，以應諸侯，___完。」",
    "options": [
      "即室家",
      "曰：「",
      "竟有人",
      "子聞之"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「沛今共誅令，擇可立立之，以應諸侯，即室家完。」",
    "workId": "han-shu",
    "chapterId": "han-shu_ch-1",
    "passageId": "han-shu_ch-1_p-12"
  },
  {
    "id": "q-113",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「我儀圖之，惟仲___之，愛莫助之。」",
    "options": [
      "之本也",
      "山甫舉",
      "以巧之",
      "閎大非"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「我儀圖之，惟仲山甫舉之，愛莫助之。」",
    "workId": "li-ji",
    "chapterId": "li-ji_ch-32",
    "passageId": "li-ji_ch-32_p-17"
  },
  {
    "id": "q-114",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「」舜曰：「吾身非吾有___有之哉？」",
    "options": [
      "地尤",
      "工於",
      "粟粒",
      "，孰"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「」舜曰：「吾身非吾有，孰有之哉？」",
    "workId": "liezi",
    "chapterId": "liezi_ch-1",
    "passageId": "liezi_ch-1_p-14"
  },
  {
    "id": "q-115",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「無思___者、土也。」",
    "options": [
      "車是利",
      "舍而不",
      "道，思",
      "亦如含"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「無思道，思者、土也。」",
    "workId": "wenshi-zhenjing",
    "chapterId": "wenshi-zhenjing_ch-1",
    "passageId": "wenshi-zhenjing_ch-1_p-9"
  },
  {
    "id": "q-116",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「」夫曰：「吾據得___用知彼夢我夢邪？」",
    "options": [
      "鹿，何",
      "子謂顏",
      "賈得用",
      "、不由"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「」夫曰：「吾據得鹿，何用知彼夢我夢邪？」",
    "workId": "liezi",
    "chapterId": "liezi_ch-3",
    "passageId": "liezi_ch-3_p-6"
  },
  {
    "id": "q-117",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「」有若曰：「昔者舜鼓五絃之琴，歌___之詩而天下治。」",
    "options": [
      "南風",
      "曰：",
      "之而",
      "十二"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「」有若曰：「昔者舜鼓五絃之琴，歌南風之詩而天下治。」",
    "workId": "han-fei-zi",
    "chapterId": "han-fei-zi_ch-32",
    "passageId": "han-fei-zi_ch-32_p-9"
  },
  {
    "id": "q-118",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「小___於國，而求百姓之行大廉，不可得也。」",
    "options": [
      "不敢與",
      "臣竊怪",
      "有兼聽",
      "廉不修"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「小廉不修於國，而求百姓之行大廉，不可得也。」",
    "workId": "guanzi",
    "chapterId": "guanzi_ch-3",
    "passageId": "guanzi_ch-3_p-13"
  },
  {
    "id": "q-119",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「愾我___念彼京周。」",
    "options": [
      "曰：『",
      "以為十",
      "寤嘆，",
      "於孔子"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「愾我寤嘆，念彼京周。」",
    "workId": "shi-jing",
    "chapterId": "shi-jing_ch-14",
    "passageId": "shi-jing_ch-14_p-4"
  },
  {
    "id": "q-120",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「清___，不願人憐，無勞多買胭脂。」",
    "options": [
      "標傲骨",
      "必置水",
      "能虛己",
      "子曰："
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「清標傲骨，不願人憐，無勞多買胭脂。」",
    "workId": "cai-gen-tan",
    "chapterId": "cai-gen-tan_ch-4",
    "passageId": "cai-gen-tan_ch-4_p-35"
  },
  {
    "id": "q-121",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「」子___夫子曰：「又多乎哉！」",
    "options": [
      "路出，",
      "曰：『",
      "其俯仰",
      "不聽群"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「」子路出，夫子曰：「又多乎哉！」",
    "workId": "li-ji",
    "chapterId": "li-ji_ch-3",
    "passageId": "li-ji_ch-3_p-17"
  },
  {
    "id": "q-122",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「孟嘗君曰、爲之駕、比門___客。」",
    "options": [
      "下之車",
      "師文曰",
      "有爽德",
      "有天災"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「孟嘗君曰、爲之駕、比門下之車客。」",
    "workId": "gu-wen-guan-zhi",
    "chapterId": "gu-wen-guan-zhi_ch-62",
    "passageId": "gu-wen-guan-zhi_ch-62_p-128"
  },
  {
    "id": "q-123",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「我行其___言採其蓫。」",
    "options": [
      "野，",
      "鐵室",
      "布以",
      "子母"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「我行其野，言採其蓫。」",
    "workId": "shi-jing",
    "chapterId": "shi-jing_ch-18",
    "passageId": "shi-jing_ch-18_p-8"
  },
  {
    "id": "q-124",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「___人有世，不亦大乎！」",
    "options": [
      "夫至",
      "不見",
      "「游",
      "之玷"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「夫至人有世，不亦大乎！」",
    "workId": "zhuangzi",
    "chapterId": "zhuangzi_ch-13",
    "passageId": "zhuangzi_ch-13_p-62"
  },
  {
    "id": "q-125",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「故明君知其分___辨也。」",
    "options": [
      "作是頌",
      "其板屋",
      "之亡也",
      "而不與"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「故明君知其分而不與辨也。」",
    "workId": "xunzi",
    "chapterId": "xunzi_ch-22",
    "passageId": "xunzi_ch-22_p-11"
  },
  {
    "id": "q-126",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「昔之能制天下___必先制其民者也；」",
    "options": [
      "幼失",
      "者，",
      "敏給",
      "之不"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「昔之能制天下者，必先制其民者也；」",
    "workId": "shang-jun-shu",
    "chapterId": "shang-jun-shu_ch-18",
    "passageId": "shang-jun-shu_ch-18_p-2"
  },
  {
    "id": "q-127",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「末產不禁，則民緩於時___輕地利；」",
    "options": [
      "學詩",
      "事而",
      "戰之",
      "》曰"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「末產不禁，則民緩於時事而輕地利；」",
    "workId": "guanzi",
    "chapterId": "guanzi_ch-3",
    "passageId": "guanzi_ch-3_p-9"
  },
  {
    "id": "q-128",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「___可致，而名可保。」",
    "options": [
      "、倉廩",
      "然後士",
      "是真樂",
      "之有也"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「然後士可致，而名可保。」",
    "workId": "three-strategies",
    "chapterId": "three-strategies_ch-1",
    "passageId": "three-strategies_ch-1_p-56"
  },
  {
    "id": "q-129",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「提刀而立，為之四顧，為之躊躇滿志，___而藏之。」",
    "options": [
      "終歲",
      "以象",
      "敢行",
      "善刀"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「提刀而立，為之四顧，為之躊躇滿志，善刀而藏之。」",
    "workId": "zhuangzi",
    "chapterId": "zhuangzi_ch-3",
    "passageId": "zhuangzi_ch-3_p-8"
  },
  {
    "id": "q-130",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「」及___師也，齊侯又請妻之。」",
    "options": [
      "其敗戎",
      "叔不以",
      "不相見",
      "」「以"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「」及其敗戎師也，齊侯又請妻之。」",
    "workId": "chun-qiu-zuo-zhuan",
    "chapterId": "chun-qiu-zuo-zhuan_ch-2",
    "passageId": "chun-qiu-zuo-zhuan_ch-2_p-70"
  },
  {
    "id": "q-131",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「從物___，不知所歸；」",
    "options": [
      "時和",
      "如流",
      "其朋",
      "庶民"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「從物如流，不知所歸；」",
    "workId": "xunzi",
    "chapterId": "xunzi_ch-31",
    "passageId": "xunzi_ch-31_p-4"
  },
  {
    "id": "q-132",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「十___，封殷紹嘉公為宋公，周承休公為衛公。」",
    "options": [
      "今死",
      "而不",
      "而已",
      "三年"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「十三年，封殷紹嘉公為宋公，周承休公為衛公。」",
    "workId": "dong-guan-han-ji",
    "chapterId": "dong-guan-han-ji_ch-2",
    "passageId": "dong-guan-han-ji_ch-2_p-3"
  },
  {
    "id": "q-133",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「___禮為無所用而去之者，必有亂患。」",
    "options": [
      "以舊",
      "罰暴",
      "是能",
      "故始"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「以舊禮為無所用而去之者，必有亂患。」",
    "workId": "li-ji",
    "chapterId": "li-ji_ch-26",
    "passageId": "li-ji_ch-26_p-7"
  },
  {
    "id": "q-134",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「石上不生五穀，秀山不遊麋鹿，___蔽也。」",
    "options": [
      "負薪」",
      "無所蔭",
      "為无崖",
      "嘒彼小"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「石上不生五穀，秀山不遊麋鹿，無所蔭蔽也。」",
    "workId": "wenzi",
    "chapterId": "wenzi_ch-12",
    "passageId": "wenzi_ch-12_p-8"
  },
  {
    "id": "q-135",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「鼓鍾伐鼛，淮有___憂心且妯。」",
    "options": [
      "月正日",
      "三洲，",
      "則民盡",
      "人之德"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「鼓鍾伐鼛，淮有三洲，憂心且妯。」",
    "workId": "shi-jing",
    "chapterId": "shi-jing_ch-20",
    "passageId": "shi-jing_ch-20_p-8"
  },
  {
    "id": "q-136",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「詔曰：「___古之建國也，今為郡縣，其復以為諸侯。」",
    "options": [
      "何如",
      "望於",
      "齊，",
      "輝之"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「詔曰：「齊，古之建國也，今為郡縣，其復以為諸侯。」",
    "workId": "han-shu",
    "chapterId": "han-shu_ch-1",
    "passageId": "han-shu_ch-1_p-82"
  },
  {
    "id": "q-137",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「___者，天下之至害也，皆遺忘而不知察，」",
    "options": [
      "此六",
      "安也",
      "後草",
      "方百"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「此六者，天下之至害也，皆遺忘而不知察，」",
    "workId": "zhuangzi",
    "chapterId": "zhuangzi_ch-29",
    "passageId": "zhuangzi_ch-29_p-74"
  },
  {
    "id": "q-138",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「嗟我婦子，曰___，入此室處。」",
    "options": [
      "不老不",
      "為改歲",
      "胡亥元",
      "狂夫之"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「嗟我婦子，曰為改歲，入此室處。」",
    "workId": "shi-jing",
    "chapterId": "shi-jing_ch-15",
    "passageId": "shi-jing_ch-15_p-1"
  },
  {
    "id": "q-139",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「天命之謂性，率___謂道，脩道之謂教。」",
    "options": [
      "亂而",
      "以告",
      "散橫",
      "性之"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「天命之謂性，率性之謂道，脩道之謂教。」",
    "workId": "zhong-yong",
    "chapterId": "zhong-yong_ch-1",
    "passageId": "zhong-yong_ch-1_p-1"
  },
  {
    "id": "q-140",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「處於平陸，儲子為相，以___受之而不報。」",
    "options": [
      "不肖者",
      "力攻者",
      "所欲爲",
      "幣交，"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「處於平陸，儲子為相，以幣交，受之而不報。」",
    "workId": "meng-zi",
    "chapterId": "meng-zi_ch-12",
    "passageId": "meng-zi_ch-12_p-5"
  },
  {
    "id": "q-141",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「稽顙而___哭而起、起而不私。」",
    "options": [
      "乎其中",
      "以若所",
      "不拜、",
      "喪則已"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「稽顙而不拜、哭而起、起而不私。」",
    "workId": "gu-wen-guan-zhi",
    "chapterId": "gu-wen-guan-zhi_ch-54",
    "passageId": "gu-wen-guan-zhi_ch-54_p-120"
  },
  {
    "id": "q-142",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「今王嗣有令緒___監茲哉。」",
    "options": [
      "見聞",
      "寫兮",
      "蓼朽",
      "，尚"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「今王嗣有令緒，尚監茲哉。」",
    "workId": "shu-jing",
    "chapterId": "shu-jing_ch-19",
    "passageId": "shu-jing_ch-19_p-1"
  },
  {
    "id": "q-143",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「是道也，能見精神而久___能忘精神而超生。」",
    "options": [
      "上卿",
      "生，",
      "耳陳",
      "能庸"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「是道也，能見精神而久生，能忘精神而超生。」",
    "workId": "wenshi-zhenjing",
    "chapterId": "wenshi-zhenjing_ch-4",
    "passageId": "wenshi-zhenjing_ch-4_p-12"
  },
  {
    "id": "q-144",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「宣王欲得國子之能導訓___，樊穆仲曰：「魯侯孝。」",
    "options": [
      "哀公曰",
      "：「吾",
      "諸侯者",
      "各有儀"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「宣王欲得國子之能導訓諸侯者，樊穆仲曰：「魯侯孝。」",
    "workId": "guo-yu",
    "chapterId": "guo-yu_ch-1",
    "passageId": "guo-yu_ch-1_p-15"
  },
  {
    "id": "q-145",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「鄉間者，因___人而用之。」",
    "options": [
      "其鄉",
      "之見",
      "言刈",
      "相呂"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「鄉間者，因其鄉人而用之。」",
    "workId": "art-of-war",
    "chapterId": "art-of-war_ch-13",
    "passageId": "art-of-war_ch-13_p-2"
  },
  {
    "id": "q-146",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「___、愚直、婩斫、便辟四人相與游於世，胥如志也；」",
    "options": [
      "聲名",
      "可與",
      "巧佞",
      "不蓵"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「巧佞、愚直、婩斫、便辟四人相與游於世，胥如志也；」",
    "workId": "liezi",
    "chapterId": "liezi_ch-6",
    "passageId": "liezi_ch-6_p-9"
  },
  {
    "id": "q-147",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「下君盡己之能，中君盡___力，上君盡人之智。」",
    "options": [
      "不可",
      "人之",
      "人生",
      "吾同"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「下君盡己之能，中君盡人之力，上君盡人之智。」",
    "workId": "han-fei-zi",
    "chapterId": "han-fei-zi_ch-48",
    "passageId": "han-fei-zi_ch-48_p-3"
  },
  {
    "id": "q-148",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「亂世之音___怒，其政乖。」",
    "options": [
      "而箕",
      "、下",
      "：長",
      "怨以"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「亂世之音怨以怒，其政乖。」",
    "workId": "li-ji",
    "chapterId": "li-ji_ch-19",
    "passageId": "li-ji_ch-19_p-3"
  },
  {
    "id": "q-149",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「人臣有私___有公義。」",
    "options": [
      "馬遷",
      "成、",
      "不以",
      "心，"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「人臣有私心，有公義。」",
    "workId": "han-fei-zi",
    "chapterId": "han-fei-zi_ch-53",
    "passageId": "han-fei-zi_ch-53_p-5"
  },
  {
    "id": "q-150",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「是以國治而兵強___而主尊。」",
    "options": [
      "烙之刑",
      "者令為",
      "，地廣",
      "謂國不"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「是以國治而兵強，地廣而主尊。」",
    "workId": "han-fei-zi",
    "chapterId": "han-fei-zi_ch-14",
    "passageId": "han-fei-zi_ch-14_p-2"
  },
  {
    "id": "q-151",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「同異交得：於福家良恕___也。」",
    "options": [
      "長曰：",
      "以貽之",
      "他則皆",
      "，有無"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「同異交得：於福家良恕，有無也。」",
    "workId": "mo-zi",
    "chapterId": "mo-zi_ch-42",
    "passageId": "mo-zi_ch-42_p-84"
  },
  {
    "id": "q-152",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「是惻___，羞惡也，辭讓也，是非也；」",
    "options": [
      "所待",
      "隱也",
      "成敗",
      "氣不"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「是惻隱也，羞惡也，辭讓也，是非也；」",
    "workId": "gu-wen-guan-zhi",
    "chapterId": "gu-wen-guan-zhi_ch-212",
    "passageId": "gu-wen-guan-zhi_ch-212_p-370"
  },
  {
    "id": "q-153",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「___爲之所，無使滋蔓。」",
    "options": [
      "之外者",
      "罔水行",
      "不如早",
      "然後六"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「不如早爲之所，無使滋蔓。」",
    "workId": "gu-wen-guan-zhi",
    "chapterId": "gu-wen-guan-zhi_ch-1",
    "passageId": "gu-wen-guan-zhi_ch-1_p-3"
  },
  {
    "id": "q-154",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「水行___深，使人無陷；」",
    "options": [
      "不時",
      "方上",
      "諫于",
      "者表"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「水行者表深，使人無陷；」",
    "workId": "xunzi",
    "chapterId": "xunzi_ch-27",
    "passageId": "xunzi_ch-27_p-12"
  },
  {
    "id": "q-155",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「___於刑，不可不嚴。」",
    "options": [
      "得而",
      "心威",
      "人則",
      "攸往"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「心威於刑，不可不嚴。」",
    "workId": "wu-zi",
    "chapterId": "wu-zi_ch-4",
    "passageId": "wu-zi_ch-4_p-3"
  },
  {
    "id": "q-156",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「秋，王命虢公伐曲沃，而___于翼。」",
    "options": [
      "萬物一",
      "立哀侯",
      "也如之",
      "公所為"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「秋，王命虢公伐曲沃，而立哀侯于翼。」",
    "workId": "chun-qiu-zuo-zhuan",
    "chapterId": "chun-qiu-zuo-zhuan_ch-1",
    "passageId": "chun-qiu-zuo-zhuan_ch-1_p-76"
  },
  {
    "id": "q-157",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「不由古訓，___訓。」",
    "options": [
      "于何其",
      "今也則",
      "之名以",
      "得以富"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「不由古訓，于何其訓。」",
    "workId": "shu-jing",
    "chapterId": "shu-jing_ch-56",
    "passageId": "shu-jing_ch-56_p-4"
  },
  {
    "id": "q-158",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「愛尚世與愛後世，一___世人也。」",
    "options": [
      "若今之",
      "得之矣",
      "賢君之",
      "尹子曰"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「愛尚世與愛後世，一若今之世人也。」",
    "workId": "mo-zi",
    "chapterId": "mo-zi_ch-44",
    "passageId": "mo-zi_ch-44_p-14"
  },
  {
    "id": "q-159",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「出雲___而不知下之據，望之若屯雲焉。」",
    "options": [
      "公子亹",
      "、止於",
      "雨之上",
      "重於身"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「出雲雨之上而不知下之據，望之若屯雲焉。」",
    "workId": "liezi",
    "chapterId": "liezi_ch-3",
    "passageId": "liezi_ch-3_p-1"
  },
  {
    "id": "q-160",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「死間者，為誑事于外，令吾間知之，___敵。」",
    "options": [
      "有弒其",
      "而傳于",
      "云：『",
      "孝公得"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「死間者，為誑事于外，令吾間知之，而傳于敵。」",
    "workId": "art-of-war",
    "chapterId": "art-of-war_ch-13",
    "passageId": "art-of-war_ch-13_p-2"
  },
  {
    "id": "q-161",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「薛公知之，故___欒博。」",
    "options": [
      "削、",
      "加益",
      "與二",
      "則其"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「薛公知之，故與二欒博。」",
    "workId": "han-fei-zi",
    "chapterId": "han-fei-zi_ch-34",
    "passageId": "han-fei-zi_ch-34_p-2"
  },
  {
    "id": "q-162",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「暴王桀、___、厲，兼惡天下之百姓，率以詬天侮鬼。」",
    "options": [
      "無功者",
      "紂、幽",
      "乎民無",
      "還天下"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「暴王桀、紂、幽、厲，兼惡天下之百姓，率以詬天侮鬼。」",
    "workId": "mo-zi",
    "chapterId": "mo-zi_ch-4",
    "passageId": "mo-zi_ch-4_p-5"
  },
  {
    "id": "q-163",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「王播告之___不匿厥指。」",
    "options": [
      "右司",
      "，修",
      "三日",
      "則隱"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「王播告之，修不匿厥指。」",
    "workId": "shu-jing",
    "chapterId": "shu-jing_ch-21",
    "passageId": "shu-jing_ch-21_p-4"
  },
  {
    "id": "q-164",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「___便是遣緣，似舞蝶與飛花共適；」",
    "options": [
      "我仇",
      "厲王",
      "之合",
      "隨緣"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「隨緣便是遣緣，似舞蝶與飛花共適；」",
    "workId": "cai-gen-tan",
    "chapterId": "cai-gen-tan_ch-2",
    "passageId": "cai-gen-tan_ch-2_p-29"
  },
  {
    "id": "q-165",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「子曰：___不仁，如禮何？」",
    "options": [
      "志愛公",
      "皆失喪",
      "棺三寸",
      "「人而"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「子曰：「人而不仁，如禮何？」",
    "workId": "lun-yu",
    "chapterId": "lun-yu_ch-3",
    "passageId": "lun-yu_ch-3_p-3"
  },
  {
    "id": "q-166",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「護乃合以為鯖，世稱五侯鯖___奇味焉。」",
    "options": [
      "莫則傳",
      "趾有大",
      "彼高岡",
      "，以為"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「護乃合以為鯖，世稱五侯鯖，以為奇味焉。」",
    "workId": "xijing-zaji",
    "chapterId": "xijing-zaji_ch-2",
    "passageId": "xijing-zaji_ch-2_p-3"
  },
  {
    "id": "q-167",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「其說在昭侯之___爪也。」",
    "options": [
      "：「",
      "邾人",
      "握一",
      "為綱"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「其說在昭侯之握一爪也。」",
    "workId": "han-fei-zi",
    "chapterId": "han-fei-zi_ch-30",
    "passageId": "han-fei-zi_ch-30_p-12"
  },
  {
    "id": "q-168",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「此上不利於天，中不___鬼，下不利於人。」",
    "options": [
      "利於",
      "公曰",
      "術者",
      "則以"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「此上不利於天，中不利於鬼，下不利於人。」",
    "workId": "mo-zi",
    "chapterId": "mo-zi_ch-26",
    "passageId": "mo-zi_ch-26_p-6"
  },
  {
    "id": "q-169",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「智短於自知___道正己。」",
    "options": [
      "一念常",
      "師云而",
      "秘於地",
      "，故以"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「智短於自知，故以道正己。」",
    "workId": "han-fei-zi",
    "chapterId": "han-fei-zi_ch-24",
    "passageId": "han-fei-zi_ch-24_p-1"
  },
  {
    "id": "q-170",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「吾聞至人，尸居環堵之室，而百姓猖___知所如往。」",
    "options": [
      "狂不",
      "曰：",
      "仁民",
      "觀兵"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「吾聞至人，尸居環堵之室，而百姓猖狂不知所如往。」",
    "workId": "zhuangzi",
    "chapterId": "zhuangzi_ch-23",
    "passageId": "zhuangzi_ch-23_p-4"
  },
  {
    "id": "q-171",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「先君之令未收，___之令又下。」",
    "options": [
      "爲文王",
      "人之加",
      "而後君",
      "一卒之"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「先君之令未收，而後君之令又下。」",
    "workId": "han-fei-zi",
    "chapterId": "han-fei-zi_ch-39",
    "passageId": "han-fei-zi_ch-39_p-2"
  },
  {
    "id": "q-172",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「孟子曰___人之所不學而能者，其良能也；」",
    "options": [
      "則見",
      "「未",
      "左右",
      "：「"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「孟子曰：「人之所不學而能者，其良能也；」",
    "workId": "meng-zi",
    "chapterId": "meng-zi_ch-13",
    "passageId": "meng-zi_ch-13_p-15"
  },
  {
    "id": "q-173",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「仲尼揖而退，蹙然改容而___：「業可得進乎？」",
    "options": [
      "能同",
      "問曰",
      "以異",
      "龍而"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「仲尼揖而退，蹙然改容而問曰：「業可得進乎？」",
    "workId": "zhuangzi",
    "chapterId": "zhuangzi_ch-26",
    "passageId": "zhuangzi_ch-26_p-17"
  },
  {
    "id": "q-174",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「漢王傷胸，乃捫足曰___虜中吾指！」",
    "options": [
      "：『",
      "不見",
      "忍而",
      "：「"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「漢王傷胸，乃捫足曰：「虜中吾指！」",
    "workId": "han-shu",
    "chapterId": "han-shu_ch-1",
    "passageId": "han-shu_ch-1_p-61"
  },
  {
    "id": "q-175",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「長___，少者反席而飲。」",
    "options": [
      "必河",
      "者辭",
      "諸會",
      "麟鳳"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「長者辭，少者反席而飲。」",
    "workId": "li-ji",
    "chapterId": "li-ji_ch-1",
    "passageId": "li-ji_ch-1_p-49"
  },
  {
    "id": "q-176",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「故泰誓曰___夫紂。」",
    "options": [
      "毋憚初",
      "苦則樂",
      "：「獨",
      "上不見"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「故泰誓曰：「獨夫紂。」",
    "workId": "xunzi",
    "chapterId": "xunzi_ch-15",
    "passageId": "xunzi_ch-15_p-11"
  },
  {
    "id": "q-177",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「___賴之、則晉國貳。」",
    "options": [
      "之相縣",
      "若吾子",
      "有大有",
      "造化、"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「若吾子賴之、則晉國貳。」",
    "workId": "gu-wen-guan-zhi",
    "chapterId": "gu-wen-guan-zhi_ch-26",
    "passageId": "gu-wen-guan-zhi_ch-26_p-84"
  },
  {
    "id": "q-178",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「孔子與之坐___焉，曰：「夫子何為？」",
    "options": [
      "而問",
      "藥傷",
      "谷也",
      "徒與"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「孔子與之坐而問焉，曰：「夫子何為？」",
    "workId": "lun-yu",
    "chapterId": "lun-yu_ch-14",
    "passageId": "lun-yu_ch-14_p-26"
  },
  {
    "id": "q-179",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「充虞請曰：「前___虞之不肖，使虞敦匠事。」",
    "options": [
      "之憂計",
      "日不知",
      "貢曰：",
      "以為正"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「充虞請曰：「前日不知虞之不肖，使虞敦匠事。」",
    "workId": "meng-zi",
    "chapterId": "meng-zi_ch-4",
    "passageId": "meng-zi_ch-4_p-7"
  },
  {
    "id": "q-180",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「二人惑則勞而不至___勝也。」",
    "options": [
      "，惑者",
      "位明矣",
      "：「吾",
      "冬行春"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「二人惑則勞而不至，惑者勝也。」",
    "workId": "zhuangzi",
    "chapterId": "zhuangzi_ch-12",
    "passageId": "zhuangzi_ch-12_p-86"
  },
  {
    "id": "q-181",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「君姑修政而親兄弟之國___免於難。」",
    "options": [
      "蛸在",
      "乃不",
      "良曰",
      "，庶"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「君姑修政而親兄弟之國，庶免於難。」",
    "workId": "gu-wen-guan-zhi",
    "chapterId": "gu-wen-guan-zhi_ch-7",
    "passageId": "gu-wen-guan-zhi_ch-7_p-33"
  },
  {
    "id": "q-182",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「___，食肉飲酒可也。」",
    "options": [
      "：禘",
      "愷歌",
      "功衰",
      "有疾"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「有疾，食肉飲酒可也。」",
    "workId": "li-ji",
    "chapterId": "li-ji_ch-22",
    "passageId": "li-ji_ch-22_p-31"
  },
  {
    "id": "q-183",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「履雖五___必踐之於地。」",
    "options": [
      "物鞭",
      "宣而",
      "采，",
      "所以"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「履雖五采，必踐之於地。」",
    "workId": "han-fei-zi",
    "chapterId": "han-fei-zi_ch-33",
    "passageId": "han-fei-zi_ch-33_p-28"
  },
  {
    "id": "q-184",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「守大門者二人，夾門___，令行者趣其外。」",
    "options": [
      "兩死",
      "而立",
      "士庶",
      "不與"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「守大門者二人，夾門而立，令行者趣其外。」",
    "workId": "mo-zi",
    "chapterId": "mo-zi_ch-67",
    "passageId": "mo-zi_ch-67_p-12"
  },
  {
    "id": "q-185",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「賊之宗盟___以重任。」",
    "options": [
      "雷車之",
      "不得有",
      "而暮三",
      "、委之"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「賊之宗盟、委之以重任。」",
    "workId": "gu-wen-guan-zhi",
    "chapterId": "gu-wen-guan-zhi_ch-112",
    "passageId": "gu-wen-guan-zhi_ch-112_p-178"
  },
  {
    "id": "q-186",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「五歲___狩，群后四朝。」",
    "options": [
      "難者",
      "鸞》",
      "一巡",
      "越席"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「五歲一巡狩，群后四朝。」",
    "workId": "shiji",
    "chapterId": "shiji_ch-1",
    "passageId": "shiji_ch-1_p-16"
  },
  {
    "id": "q-187",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「大羹___，貴其質也。」",
    "options": [
      "不和",
      "不敢",
      "不辜",
      "聖治"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「大羹不和，貴其質也。」",
    "workId": "li-ji",
    "chapterId": "li-ji_ch-11",
    "passageId": "li-ji_ch-11_p-31"
  },
  {
    "id": "q-188",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「其待上也，忠___懈；」",
    "options": [
      "曰：洊",
      "者必誅",
      "順而不",
      "謂之樂"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「其待上也，忠順而不懈；」",
    "workId": "xunzi",
    "chapterId": "xunzi_ch-12",
    "passageId": "xunzi_ch-12_p-3"
  },
  {
    "id": "q-189",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「法明則內無變亂之患，計得___無死虜之禍。」",
    "options": [
      "君必",
      "下民",
      "則外",
      "各自"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「法明則內無變亂之患，計得則外無死虜之禍。」",
    "workId": "han-fei-zi",
    "chapterId": "han-fei-zi_ch-47",
    "passageId": "han-fei-zi_ch-47_p-6"
  },
  {
    "id": "q-190",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「非___爾、而吾以捕蛇獨存。」",
    "options": [
      "無得反",
      "以居產",
      "言而不",
      "死即徙"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「非死即徙爾、而吾以捕蛇獨存。」",
    "workId": "gu-wen-guan-zhi",
    "chapterId": "gu-wen-guan-zhi_ch-146",
    "passageId": "gu-wen-guan-zhi_ch-146_p-212"
  },
  {
    "id": "q-191",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「___而不歸，惡知其非有也。」",
    "options": [
      "物之",
      "而無",
      "謂光",
      "久假"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「久假而不歸，惡知其非有也。」",
    "workId": "meng-zi",
    "chapterId": "meng-zi_ch-13",
    "passageId": "meng-zi_ch-13_p-30"
  },
  {
    "id": "q-192",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「使脩士行之，則與汙邪之人___雖欲成功，得乎哉！」",
    "options": [
      "「子問",
      "闔而勿",
      "疑之，",
      "善視之"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「使脩士行之，則與汙邪之人疑之，雖欲成功，得乎哉！」",
    "workId": "xunzi",
    "chapterId": "xunzi_ch-12",
    "passageId": "xunzi_ch-12_p-8"
  },
  {
    "id": "q-193",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「賢主以此持勝，故___及後世。」",
    "options": [
      "其福",
      "人設",
      "而治",
      "日永"
    ],
    "correctAnswer": 0,
    "explanation": "原句為：「賢主以此持勝，故其福及後世。」",
    "workId": "liezi",
    "chapterId": "liezi_ch-8",
    "passageId": "liezi_ch-8_p-13"
  },
  {
    "id": "q-194",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「敵___，半渡而薄之。」",
    "options": [
      "群臣慮",
      "若絕水",
      "農事必",
      "非武坐"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「敵若絕水，半渡而薄之。」",
    "workId": "wu-zi",
    "chapterId": "wu-zi_ch-5",
    "passageId": "wu-zi_ch-5_p-7"
  },
  {
    "id": "q-195",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「上徵___，則支離攘臂於其間；」",
    "options": [
      "萬民",
      "之非",
      "則民",
      "武士"
    ],
    "correctAnswer": 3,
    "explanation": "原句為：「上徵武士，則支離攘臂於其間；」",
    "workId": "zhuangzi",
    "chapterId": "zhuangzi_ch-4",
    "passageId": "zhuangzi_ch-4_p-67"
  },
  {
    "id": "q-196",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「樊遲御，子告之曰：「孟孫問孝於我，我___無違』。」",
    "options": [
      "作而畜",
      "對曰『",
      "加彌尊",
      "甚得亂"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「樊遲御，子告之曰：「孟孫問孝於我，我對曰『無違』。」",
    "workId": "lun-yu",
    "chapterId": "lun-yu_ch-2",
    "passageId": "lun-yu_ch-2_p-5"
  },
  {
    "id": "q-197",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「諸子___，門東，北面東上。」",
    "options": [
      "昔天",
      "主用",
      "之國",
      "眾賓"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「諸子之國，門東，北面東上。」",
    "workId": "li-ji",
    "chapterId": "li-ji_ch-14",
    "passageId": "li-ji_ch-14_p-1"
  },
  {
    "id": "q-198",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「如___以免於患而待其事之變。」",
    "options": [
      "則地削",
      "如欲分",
      "是韓可",
      "以炎精"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「如是韓可以免於患而待其事之變。」",
    "workId": "han-fei-zi",
    "chapterId": "han-fei-zi_ch-10",
    "passageId": "han-fei-zi_ch-10_p-6"
  },
  {
    "id": "q-199",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「子曰：「善人教民___，亦可以即戎矣。」",
    "options": [
      "之所",
      "埏埴",
      "七年",
      "世之"
    ],
    "correctAnswer": 2,
    "explanation": "原句為：「子曰：「善人教民七年，亦可以即戎矣。」",
    "workId": "lun-yu",
    "chapterId": "lun-yu_ch-13",
    "passageId": "lun-yu_ch-13_p-29"
  },
  {
    "id": "q-200",
    "type": "fill-in-blank",
    "question": "請填寫古文中的缺漏字：\n「其德不違，其___親，其言可信；」",
    "options": [
      "淖也",
      "仁可",
      "所以",
      "其大"
    ],
    "correctAnswer": 1,
    "explanation": "原句為：「其德不違，其仁可親，其言可信；」",
    "workId": "shiji",
    "chapterId": "shiji_ch-2",
    "passageId": "shiji_ch-2_p-4"
  },
  {
    "id": "q-201",
    "type": "translation",
    "question": "請問以下古文的正確白話文釋義為何？\n「有去大人之好聚珠玉、鳥獸、犬馬，以益衣裳、宮室、甲盾、五兵、舟車之數於數倍乎！若則不難，故孰為難倍？...」",
    "options": [
      "《漢書・漢書卷九十九中‧王莽傳第六十九中》史實記載：「〔五〕　師古曰：共讀曰恭。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "這是一段來自戰國策的歷史敘述，記載了當時各國君臣之間的政治對話與外交策略。具體描述了相關人物在面對國家危機或戰略抉擇時的應對之策（段落編號：195）。",
      "本段經文記載古代典籍中的重要思想論述與歷史事件，展現先秦至漢代思想家的深刻智慧。",
      "老子論述天地運行之道：天覆萬物而不自居其功，地載萬物而不自求其報。聖人效法天地之德，廣施恩澤而不求回報，則天下自然歸心、四海自然太平。"
    ],
    "correctAnswer": 2,
    "explanation": "【主題與背景】本段選自古代經典文獻。\\n【詞義與名物】包含重要的歷史與哲學概念。\\n【思想與篇章】體現了古代思想家對政治、社會與人生的深刻思考。",
    "workId": "mo-zi",
    "chapterId": "mo-zi_ch-20",
    "passageId": "mo-zi_ch-20_p-2"
  },
  {
    "id": "q-202",
    "type": "translation",
    "question": "請問以下古文的正確白話文釋義為何？\n「老子曰：得萬人之兵，不如聞一言之當，得隋侯之珠，不如得事之所由，得和氏之璧，不如得事之所適。天下雖大...」",
    "options": [
      "老子闡明治國修身之理：清靜恬淡則心靈澄明，因循自然則萬事順遂。聖人內修其德、外順其時，不強求不妄動，則天下安定、百姓各安其業。",
      "《漢書・漢書卷四十八‧賈誼傳第十八》史實記載：「〔二〕　師古曰：艾讀曰刈。菅，茅也，音姦。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "本段經文記載古代典籍中的重要思想論述與歷史事件，展現先秦至漢代思想家的深刻智慧。",
      "《史記・卷四十三‧趙世家第十三》史實記載：「十五年，以尉文封相國廉頗為信平君。燕王令丞相栗腹約驩，以五百金為趙王酒……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。"
    ],
    "correctAnswer": 0,
    "explanation": "【主題與背景】本段選自《文子》第4篇。《文子》又名《通玄真經》，為先秦道家經典，託老子與弟子文子之對話，闡發道家治國修身哲學。\\n【詞義與名物】「符言」：本篇之核心概念，文子繼承老子「道法自然」思想，主張聖人順應天道、清靜無為。\\n【思想與篇章】文子融合老莊道家與黃老學派思想，強調「無為而治」的政治理想與「恬淡虛靜」的個人修養境界。",
    "workId": "wenzi",
    "chapterId": "wenzi_ch-4",
    "passageId": "wenzi_ch-4_p-30"
  },
  {
    "id": "q-203",
    "type": "translation",
    "question": "請問以下古文的正確白話文釋義為何？\n「與物窮者，物入焉；與物且者，其身之不能容，焉能容人！不能容人者无親，无親者盡人。兵莫憯于志，鏌鎁為下...」",
    "options": [
      "《漢書・漢書卷二十四上‧食貨志第四上》史實記載：「〔二〕　師古曰：旨，美也。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "《漢書・漢書卷二十四上‧食貨志第四上》史實記載：「〔三〕　師古曰：重，難也。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "與物窮者，物入焉；與物而且者，其身之不能容，焉能容人！不能容人者無親，無親者盡人。兵莫憯於志，鏌鎁為下；寇莫大於陰陽，無所逃於天地之閒。非陰陽賊之，心則使之也。",
      "《漢書・漢書卷六十二‧司馬遷傳第三十二》史實記載：「〔五〕　如淳曰：平居時，遷不肯報其書。今有罪在獄，故報往日書，欲使其……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。"
    ],
    "correctAnswer": 2,
    "explanation": "【主題與背景】\\n本段選自《莊子·庚桑楚》。記載庚桑楚領悟老子之道居蔚壘山，南榮趠請教老子養生養性。\\n在本段落「與物窮者，物入焉；與物且者，其身之不能容...」中，莊子透過生動的文學寓意與哲理對話，展現了具體的思想境界與人生情境。\\n\\n【詞義與名物】\\n「焉」：在其中、於此、如何\\n\\n【莊子哲理】\\n從莊子哲學觀點來看，本段落深刻體現了《庚桑楚》的核心思想：莊子藉由豐富的寓言語意引導人們回歸自然本真，摒棄功利機心與人為束縛，體會《庚桑楚》所傳達的超逸智慧。",
    "workId": "zhuangzi",
    "chapterId": "zhuangzi_ch-23",
    "passageId": "zhuangzi_ch-23_p-43"
  },
  {
    "id": "q-204",
    "type": "translation",
    "question": "請問以下古文的正確白話文釋義為何？\n「夫適人之適而不自適其適，雖盜跖與伯夷，是同為淫僻也。余愧乎道德，是以上不敢為仁義之操，而下不敢為淫僻...」",
    "options": [
      "禮者，貴賤有等；長幼有差，貧富輕重皆有稱者也。故天子袾裷衣冕，諸侯玄裷衣冕，大夫裨冕，士皮弁服。德必稱位，位必稱祿，祿必稱用，由士以上則必以禮樂節之，眾庶百姓則必以法數制之。量地而立國，計利而畜民，度人力而授事，使民必勝事，事必出利，利足以生民，皆使衣食百用出入相揜，必時臧餘，謂之稱數。故自天子通於庶人，事無大小多少，由是推之。故說：「朝無幸位，民無幸生。」此之謂也。輕田野之賦，平關市之徵，省商賈之數，罕興力役，無奪農時，如是則國富矣。夫是之謂以政裕民。",
      "夫適人之適而不自適其適，雖盜跖與伯夷，是同為淫僻也。餘愧乎道德，因此上不敢為仁義之操，而下不敢為淫僻之行也。",
      "《漢書・漢書卷五十五‧衛青霍去病傳第二十五》史實記載：「〔三〕　張晏曰：藉若，胡侯也。產，名也。師古曰：此人單於祖父之行……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "《漢書・漢書卷三十四‧韓彭英盧吳傳第四》史實記載：「〔三〕　晉灼曰：使豨久亡畔。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。"
    ],
    "correctAnswer": 1,
    "explanation": "【主題與背景】\\n本段選自《莊子·駢拇》。批判外加的仁義禮樂如駢拇枝指，主張順應天生之本性。\\n在本段落「夫適人之適而不自適其適，雖盜跖與伯夷，是...」中，莊子透過生動的文學寓意與哲理對話，展現了具體的思想境界與人生情境。\\n\\n【詞義與名物】\\n「是以」：因此、所以\\n\\n【莊子哲理】\\n從莊子哲學觀點來看，本段落深刻體現了《駢拇》的核心思想：強調內在道德與精神氣度之充實（德符於內），遠比外在肢體形貌更具生命價值。",
    "workId": "zhuangzi",
    "chapterId": "zhuangzi_ch-8",
    "passageId": "zhuangzi_ch-8_p-20"
  },
  {
    "id": "q-205",
    "type": "translation",
    "question": "請問以下古文的正確白話文釋義為何？\n「宋元君聞之，召匠石曰：『嘗試為寡人為之。』匠石曰：『臣則嘗能斲之。雖然，臣之質死久矣。』自夫子之死也...」",
    "options": [
      "宋元君聞之，召匠石說：『嘗試為寡人為之。』匠石說：『臣則嘗能斲之。雖然，臣之質死久矣。』自夫子之死也，我無以為質矣，我無與言之矣。」",
      "《漢書・漢書卷十‧成帝紀第十》史實記載：「建始元年春正月乙丑，皇曾祖悼考廟災。〔一〕……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "《漢書・漢書卷九十九下‧王莽傳第六十九下》史實記載：「二年正月，以州牧位三公，刺舉怠解，〔一〕更置牧監副，秩元士，冠法冠，行……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "《漢書・漢書卷七十六‧趙尹韓張兩王傳第四十六》史實記載：「〔二〕　師古曰：遣知其事由某人發，故結怨咎也。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。"
    ],
    "correctAnswer": 0,
    "explanation": "【寓言意象】\\n本段選自《莊子·徐無鬼》。徐無鬼見魏武侯，莊子過惠施墓感嘆「運斤成風」之知音難覓。\\n在本段落「宋元君聞之，召匠石曰：『嘗試為寡人為之。...」中，莊子透過生動的文學寓意與哲理對話，展現了具體的思想境界與人生情境。\\n\\n【詞義與名物】\\n「宋元」：文中所用關鍵詞彙，在莊子文脈中具備特殊的道家哲學意涵。\\n「君聞」：先秦名物與習慣用語，需結合章節語境加以深入體會。\\n\\n【莊子哲理】\\n從莊子哲學觀點來看，本段落深刻體現了《徐無鬼》的核心思想：引導人們體悟生死的自然輪轉，透過「坐忘」摒除聰明與形體束縛，同於大道之大通。",
    "workId": "zhuangzi",
    "chapterId": "zhuangzi_ch-24",
    "passageId": "zhuangzi_ch-24_p-47"
  },
  {
    "id": "q-206",
    "type": "translation",
    "question": "請問以下古文的正確白話文釋義為何？\n「請嘗言移是。是以生為本，以知為師，因以乘是非；果有名實，因以己為質；使人以為己節，因以死償節。」",
    "options": [
      "請嘗言移是。因此生為本，以知為師，因以乘是非；果有名實，因以己為質；使人以為己節，因以死償節。",
      "《漢書・漢書卷六十‧杜周傳第三十》史實記載：「〔一〕　師古曰：更音工衡反。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "《漢書・漢書卷二十八上‧地理志第八上》史實記載：「〔二〕　師古曰：虖池出鹵城。嘔夷出平舒。淶出廣昌。易出故安。虖音呼。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "《漢書・漢書卷七十六‧趙尹韓張兩王傳第四十六》史實記載：「〔一〕　師古曰：右扶風之縣，音媚。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。"
    ],
    "correctAnswer": 0,
    "explanation": "【主題與背景】\\n本段選自《莊子·庚桑楚》。記載庚桑楚領悟老子之道居蔚壘山，南榮趠請教老子養生養性。\\n在本段落「請嘗言移是。是以生為本，以知為師，因以乘...」中，莊子透過生動的文學寓意與哲理對話，展現了具體的思想境界與人生情境。\\n\\n【詞義與名物】\\n「是以」：因此、所以\\n\\n【莊子哲理】\\n從莊子哲學觀點來看，本段落深刻體現了《庚桑楚》的核心思想：主張超越人為劃分的是非與物我界限，體悟萬物齊一與天籟和諧，達到物我兩忘的圓融境界。",
    "workId": "zhuangzi",
    "chapterId": "zhuangzi_ch-23",
    "passageId": "zhuangzi_ch-23_p-54"
  },
  {
    "id": "q-207",
    "type": "translation",
    "question": "請問以下古文的正確白話文釋義為何？\n「芝草無根醴無源，志士當勇奮翼；彩雲易散琉璃脆，達人當早回頭。」",
    "options": [
      "《漢書・漢書卷二十二‧禮樂志第二》史實記載：「〔五〕　師古曰：先者，先人，謂祖考。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "靈芝的生長本無固定的根基，甘泉的湧出也沒有一成不變的源頭（比喻人的富貴與成就並非天生註定），有志之士應當勇敢地振翅高飛、奮發圖強；美麗的彩雲極易消散，精美的琉璃極易破碎（比喻世俗的榮華富貴極其脆弱無常），通達事理的人應當及早回頭、超脫物外。",
      "《漢書・漢書卷二十三‧刑法志第三》史實記載：「〔六〕　師古曰：與讀曰歟。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "《漢書・漢書卷五十九‧張湯傳第二十九》史實記載：「湯死，家產直不過五百金，皆所得奉賜，〔一〕無它贏。〔二〕昆弟諸子欲厚葬……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。"
    ],
    "correctAnswer": 1,
    "explanation": "【主題與背景】本條前半句用「芝草無根，醴泉無源」（出自古語）勉勵士子，說明英雄不問出處，命運掌握在自己手中，應當「勇奮翼」積極進取，體現了儒家的自強不息；後半句用「彩雲易散琉璃脆」（語出白居易《簡簡吟》）警示世人，世間美好與名利極易幻滅，應當「早回頭」淡泊超脫，體現了道禪的無常與出世智慧。\\n【詞義與名物】這兩句一進一退，反映了《菜根譚》進退有度、儒道互補的處世哲學。\\n【思想與篇章】《菜根譚》融會儒釋道三家智慧，兼具操守堅定與處事圓融。",
    "workId": "cai-gen-tan",
    "chapterId": "cai-gen-tan_ch-2",
    "passageId": "cai-gen-tan_ch-2_p-28"
  },
  {
    "id": "q-208",
    "type": "translation",
    "question": "請問以下古文的正確白話文釋義為何？\n「甘蠅，古之善射者，彀弓而獸伏鳥下。弟子名飛衛，學射於甘蠅，而巧過其師。紀昌者，又學射於飛衛。飛衛曰：...」",
    "options": [
      "本段經文記載古代典籍中的重要思想論述與歷史事件，展現先秦至漢代思想家的深刻智慧。",
      "《漢書・漢書卷九十九上‧王莽傳第六十九上》史實記載：「〔六〕　師古曰：配，對也。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "《漢書・漢書卷二十二‧禮樂志第二》史實記載：「〔六〕　應劭曰：言天馬雖去人遠，當豫開門以待之也。文穎曰：言武帝……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "《漢書・漢書卷九‧元帝紀第九》史實記載：「〔一〕　師古曰：復音扶目反。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。"
    ],
    "correctAnswer": 0,
    "explanation": "【主題與背景】本段選自古代經典文獻。\\n【詞義與名物】包含重要的歷史與哲學概念。\\n【思想與篇章】體現了古代思想家對政治、社會與人生的深刻思考。",
    "workId": "liezi",
    "chapterId": "liezi_ch-5",
    "passageId": "liezi_ch-5_p-14"
  },
  {
    "id": "q-209",
    "type": "translation",
    "question": "請問以下古文的正確白話文釋義為何？\n「匠石覺而診其夢。弟子曰：「趣取无用，則為社何邪？」」",
    "options": [
      "《漢書・漢書卷五十七上‧司馬相如傳第二十七上》史實記載：「〔四〕　師古曰：矰，短矢也。繳，生絲縷也。以繳係矰仰射高鳥，謂之弋射……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "匠石覺而診其夢。弟子說：「趣取無用，則為社何邪？」",
      "關尹子說：不執著愚人的言行容易，不執著賢人的言行較難；不執著賢人的言行還容易，不執著聖人的言行更難；不執著一位聖人的言行容易，不執著千百聖人的言行尤其困難。真正能不執著眾聖言行的人，對外不把「他人」立成權威偶像，對內不把「自我」立成中心，向上不把「道」立成固定名相，向下也不把「事」立成不變規則。",
      "《漢書・漢書卷七十三‧韋賢傳第四十三》史實記載：「〔一〕　師古曰：風讀曰諷。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。"
    ],
    "correctAnswer": 1,
    "explanation": "【寓言意象】\\n本段選自《莊子·人間世》。面對混濁亂世的處世智慧，提出「心齋」與「無用之用」，以保全自身。\\n在本段落「匠石覺而診其夢。弟子曰：「趣取無用，則為...」中，莊子透過生動的文學寓意與哲理對話，展現了具體的思想境界與人生情境。\\n\\n【詞義與名物】\\n「匠石」：文中所用關鍵詞彙，在莊子文脈中具備特殊的道家哲學意涵。\\n「覺而」：先秦名物與習慣用語，需結合章節語境加以深入體會。\\n\\n【莊子哲理】\\n從莊子哲學觀點來看，本段落深刻體現了《人間世》的核心思想：主張超越人為劃分的是非與物我界限，體悟萬物齊一與天籟和諧，達到物我兩忘的圓融境界。",
    "workId": "zhuangzi",
    "chapterId": "zhuangzi_ch-4",
    "passageId": "zhuangzi_ch-4_p-59"
  },
  {
    "id": "q-210",
    "type": "translation",
    "question": "請問以下古文的正確白話文釋義為何？\n「有浮雲富貴之風，而不必巖棲穴處；無膏盲泉石之癖，而常自醉酒耽詩。兢逐聽人而不嫌盡醉，恬［心詹］適己而...」",
    "options": [
      "《漢書・漢書卷三十六‧楚元王傳第六》史實記載：「〔一〕　師古曰：質，正也。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "魯成公14年（西元前577年）。《春秋》記錄魯國及周邊列國當年在朝聘、盟會、征伐與宗廟祭祀方面之重要史實。",
      "擁有視富貴如浮雲的清高風骨，卻不必非要隱居在深山洞穴之中；沒有把熱愛山水當作無可救藥的怪癖，卻也能經常飲酒作詩自得其樂。任憑旁人去競爭追逐而不反對與他們一同沉醉，保持內心的恬靜安適卻也不誇耀自己獨自清醒，這就是佛家所說的既不被世俗法則所束縛、也不被空無境界所束縛，達到了身心都無比自在的境界。",
      "《漢書・漢書卷七十七‧蓋諸葛劉鄭孫毌將何傳第四十七》史實記載：「〔七〕　師古曰：闔，閉也。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。"
    ],
    "correctAnswer": 2,
    "explanation": "【主題與背景】本條提倡一種不落兩邊的中道隱逸觀。真正的解脫不是流於形式的「巖棲穴處」或執著於山水美景的「膏肓之癖」（這依然是一種執著，即「法纏」），也不是一味排斥世俗、孤芳自賞（即執著於空、誇耀獨醒，是為「空纏」）。\\n【詞義與名物】真正的自在是身處世俗而心不染塵，能與世俗和光同塵而不隨波逐流，實現「心無罣礙」的圓融狀態。\\n【思想與篇章】《菜根譚》融會儒釋道三家智慧，兼具操守堅定與處事圓融。",
    "workId": "cai-gen-tan",
    "chapterId": "cai-gen-tan_ch-5",
    "passageId": "cai-gen-tan_ch-5_p-33"
  },
  {
    "id": "q-211",
    "type": "translation",
    "question": "請問以下古文的正確白話文釋義為何？\n「用國者，得百姓之力者富，得百姓之死者彊，得百姓之譽者榮。三得者具而天下歸之，三得者亡而天下去之；天下...」",
    "options": [
      "《史記・卷二十六‧曆書第四》史實記載：「端蒙赤奮若竟寧元年。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "《漢書・漢書卷八十七上‧揚雄傳第五十七上》史實記載：「〔二〕　應劭曰：總，結也。扶桑，日所拂木也。晉灼曰：離騷雲總餘……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "用國者，得百姓之力者富，得百姓之死者彊，得百姓之譽者榮。三得者具而天下歸之，三得者亡而天下去之；天下歸之之謂王，天下去之之謂亡。湯武者，脩其道，行其義，興天下同利，除天下同害，天下歸之。故厚德音以先之，明禮義以道之，致忠信以愛之，賞賢使能以次之，爵服賞慶以申重之，時其事，輕其任，以調齊之，潢然兼覆之，養長之，如保赤子。生民則致寬，使民則綦理，辯政令制度，所以接天下之人百姓，有非理者如豪末，則雖孤獨鰥寡，必不加焉。是故百姓貴之如帝，親之如父母，為之出死斷亡而不愉者，無它故焉，道德誠明，利澤誠厚也。亂世不然，汙漫突盜以先之，權謀傾覆以示之，俳優、侏儒、婦女之請謁以悖之，使愚詔知，使不肖臨賢，生民則致貧隘，使民則極勞苦。是故，百姓賤之如尪，惡之如鬼，日欲司閒而相與投藉之，去逐之。卒有寇難之事，又望百姓之為己死，不可得也，說無以取之焉。孔孔子說：「審吾所以適人，適人之所以來我也。」此之謂也。",
      "《史記・卷百一十一‧衞將軍驃騎列傳第五十一》史實記載：「兩軍之出塞，塞閱官及私馬凡十四萬匹，而復入塞者不滿三萬匹。乃益置大司馬……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。"
    ],
    "correctAnswer": 2,
    "explanation": "【主題與背景】\\n本段選自《荀子·王霸篇》。深層分析王道（以德服人）、霸道（以信立國）與亡國之道（專憑暴力巧詐）的差別。荀子在此段落中針對戰國晚期的社會變局與思想衝突，展開了嚴密而深邃的理性論辯。\\n\\n【詞義與名物】\\n「禮義」：禮節與道義，荀子政治與道德思想的核心體制。\\n\\n【荀子哲思】\\n凸顯「禮義」在規範個體言行與維繫社會秩序中的核心樞紐作用，主張以禮立身、以禮修身。",
    "workId": "xunzi",
    "chapterId": "xunzi_ch-11",
    "passageId": "xunzi_ch-11_p-18"
  },
  {
    "id": "q-212",
    "type": "translation",
    "question": "請問以下古文的正確白話文釋義為何？\n「天子外屏，諸侯內屏，禮也。外屏、不欲見外也；內屏、不欲見內也。」",
    "options": [
      "溱與洧方渙渙啊。士與女方秉蕑啊。女曰觀乎士曰已經且。且往觀乎洧的外洵訏且樂。是士與女伊那相謔贈的以勺藥。溱與洧瀏那清矣。士與女殷那盈矣。女曰觀乎士曰已經且。且往觀乎洧的外洵訏且樂。是士與女伊那將謔贈的以勺藥。",
      "天子外屏，諸侯內屏，禮也。外屏、不欲見外也；內屏、不欲見內也。",
      "《史記・卷五十八‧梁孝王世家第二十八》史實記載：「孝王未死時，財以巨萬計，不可勝數。及死，藏府餘黃金尚四十餘萬斤，他財物……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "《史記・卷三十二‧齊太公世家第二》史實記載：「十年，孝公卒，孝公弟潘因衞公子開方殺孝公子而立潘，是為昭公。昭公，桓公……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。"
    ],
    "correctAnswer": 1,
    "explanation": "【主題與背景】\\n本段選自《荀子·大略篇》。荀子語錄與雜記彙編，涵蓋禮義、政治、教育、修身、歷史與經學等多領域智慧。荀子在此段落中針對戰國晚期的社會變局與思想衝突，展開了嚴密而深邃的理性論辯。\\n\\n【詞義與名物】\\n文中關鍵詞如「天子外屏」：結合《荀子》語境指代特定哲學概念與名物規範；「諸侯內屏」：結合《荀子》語境指代特定哲學概念與名物規範；「禮也」：結合《荀子》語境指代特定哲學概念與名物規範，體現了先秦名學與禮義制度的特徵。\\n\\n【荀子哲思】\\n凸顯「禮義」在規範個體言行與維繫社會秩序中的核心樞紐作用，主張以禮立身、以禮修身。",
    "workId": "xunzi",
    "chapterId": "xunzi_ch-27",
    "passageId": "xunzi_ch-27_p-3"
  },
  {
    "id": "q-213",
    "type": "translation",
    "question": "請問以下古文的正確白話文釋義為何？\n「上善若水。水善利萬物而不爭，處衆人之所惡，故幾於道。居善地，心善淵，與善仁，言善信，正善治，事善能，...」",
    "options": [
      "《漢書・漢書卷一上‧高帝紀第一上》史實記載：「〔一四〕師古曰：軍中遣人與秦吏相隨，遍至諸縣鄉邑而告諭也。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "上善若水。水善利萬物而不爭，處衆人的所惡，故幾於道。居善地，心善淵，和善仁，言善信，正善治，事善能，動善時。那唯不爭，故無尤。。這告訴我們順應自然，不刻意強求。",
      "《漢書・漢書卷七十五‧眭兩夏侯京翼李傳第四十五》史實記載：「〔一〕　師古曰：召讀曰邵。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "這是一段來自戰國策的歷史敘述，記載了當時各國君臣之間的政治對話與外交策略。具體描述了相關人物在面對國家危機或戰略抉擇時的應對之策（段落編號：247）。"
    ],
    "correctAnswer": 1,
    "explanation": "【主題與背景】本段「上善若水。水善利萬物而不爭，處...」出自《道德經》，主要探討了老子對於道、萬物的深刻體悟與處世原則，背景是春秋末期的社會動盪與禮崩樂壞。\\n【詞義與名物】文中的關鍵詞語如道、萬物，反映了道家特有的概念體系。需特別注意其反向思維的運用，這不是一般的世俗意義，而是超越性的哲學概念。\\n【道家哲思】這段文字充分展現了老子「無為而治」、「柔弱勝剛強」的哲學思想。它提醒我們，在紛繁複雜的現象背後，存在著一種質樸、自然的規律，不爭不執，方能合於大道。",
    "workId": "dao-de-jing",
    "chapterId": "dao-de-jing_ch-8",
    "passageId": "dao-de-jing_ch-8_p-1"
  },
  {
    "id": "q-214",
    "type": "translation",
    "question": "請問以下古文的正確白話文釋義為何？\n「老子曰：使之以時而敬慎之，如臨深淵，如履薄冰，天地之間，善即吾畜也，不善即吾讎也，昔者夏商之臣，反讎...」",
    "options": [
      "《漢書・漢書卷五十二‧竇田灌韓傳第二十二》史實記載：「〔二〕　師古曰：右，尊也。左，卑也。鈞，等也。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "喫著粗茶淡飯、喫藜莧等野菜度日的人，大多品格高尚，像冰一樣清澈、如玉一般聖潔；穿著華麗禮服、享受珍饈美味的人，反而往往甘心奴顏婢膝、諂媚討好權貴。這大概是因為高尚的志向要在恬靜淡泊中才能顯明，而做人的氣節往往是在追求肥美甘甜的物質享受中喪失殆盡的。",
      "老子論述天地運行之道：天覆萬物而不自居其功，地載萬物而不自求其報。聖人效法天地之德，廣施恩澤而不求回報，則天下自然歸心、四海自然太平。",
      "老子主張無為而治、順應自然規律，認為天地萬物皆由道生化，聖人應效法天道、清靜無欲，方能無為而無不為、治理天下而不擾民。"
    ],
    "correctAnswer": 2,
    "explanation": "【主題與背景】本段選自《文子》第10篇。《文子》又名《通玄真經》，為先秦道家經典，託老子與弟子文子之對話，闡發道家治國修身哲學。\\n【詞義與名物】「上仁」：本篇之核心概念，文子繼承老子「道法自然」思想，主張聖人順應天道、清靜無為。\\n【思想與篇章】文子融合老莊道家與黃老學派思想，強調「無為而治」的政治理想與「恬淡虛靜」的個人修養境界。",
    "workId": "wenzi",
    "chapterId": "wenzi_ch-10",
    "passageId": "wenzi_ch-10_p-7"
  },
  {
    "id": "q-215",
    "type": "translation",
    "question": "請問以下古文的正確白話文釋義為何？\n「伊尹作《咸有一德》。」",
    "options": [
      "《史記・卷九十一‧黥布列傳第三十一》史實記載：「項籍死，天下定，上置酒。上折隨何之功，謂何為腐儒，為天下安用腐儒。隨何……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "《漢書・漢書卷四十八‧賈誼傳第十八》史實記載：「〔四〕　孟康曰：崪音萃。萃，聚集也。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "《漢書・漢書卷二十七上‧五行志第七上》史實記載：「〔二〕　師古曰：二十四年，仲孫羯帥師侵齊。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "本段經文記載古代典籍中的重要思想論述與歷史事件，展現先秦至漢代思想家的深刻智慧。"
    ],
    "correctAnswer": 3,
    "explanation": "【主題與背景】本段選自古代經典文獻。\\n【詞義與名物】包含重要的歷史與哲學概念。\\n【思想與篇章】體現了古代思想家對政治、社會與人生的深刻思考。",
    "workId": "shu-jing",
    "chapterId": "shu-jing_ch-20",
    "passageId": "shu-jing_ch-20_p-1"
  },
  {
    "id": "q-216",
    "type": "translation",
    "question": "請問以下古文的正確白話文釋義為何？\n「嘗相與遊乎无何有之宮，同合而論，无所終窮乎！嘗相與无為乎！澹而靜乎！漠而清乎！調而閒乎！寥已吾志，无...」",
    "options": [
      "嘗相與遊乎無何有之宮，同合而論，無所終窮乎！嘗相與無為乎！澹而靜乎！漠而清乎！調而閒乎！寥已我志，無往焉而不知其所至。去而來不知其所止，",
      "《史記・卷三十二‧齊太公世家第二》史實記載：「庚辰，田常執簡公于徐州。公曰：餘蚤從御鞅言，不及此。甲午，田常弒簡……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "《漢書・漢書卷二十四上‧食貨志第四上》史實記載：「〔一〕　師古曰：謂愛惜之意未厭飽也。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "《漢書・漢書卷八十三‧薛宣朱博傳第五十三》史實記載：「〔五〕　師古曰：詔已罷官，事又經三赦也。更音工衡反。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。"
    ],
    "correctAnswer": 0,
    "explanation": "【主題與背景】\\n本段選自《莊子·知北遊》。知北遊問道於無為謂與黃帝，強調「道在屎溺」，無所不在。\\n在本段落「嘗相與遊乎無何有之宮，同合而論，無所終窮...」中，莊子透過生動的文學寓意與哲理對話，展現了具體的思想境界與人生情境。\\n\\n【詞義與名物】\\n「焉」：在其中、於此、如何\\n\\n【莊子哲理】\\n從莊子哲學觀點來看，本段落深刻體現了《知北遊》的核心思想：莊子藉由豐富的寓言語意引導人們回歸自然本真，摒棄功利機心與人為束縛，體會《知北遊》所傳達的超逸智慧。",
    "workId": "zhuangzi",
    "chapterId": "zhuangzi_ch-22",
    "passageId": "zhuangzi_ch-22_p-52"
  },
  {
    "id": "q-217",
    "type": "translation",
    "question": "請問以下古文的正確白話文釋義為何？\n「延岑大破赤眉於杜陵。」",
    "options": [
      "在《春秋左氏傳・魯桓公11年》記載中：春季正月，魯國國君即位統治。鄭伯在鄢地擊敗其弟共叔段。段不遵從同胞兄弟之道，故《春秋》經文不稱其為弟；兩軍相攻如兩國君主，故稱「克」；稱鄭伯，旨在譏諷鄭莊公失於教導。",
      "《漢書・漢書卷七‧昭帝紀第七》史實記載：「六月，發三輔及郡國惡少年吏有告劾亡者，屯遼東。〔一〕……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "道常無為而無不為。侯王若能守的，萬物將自化。化而欲作，我將鎮的以無名的樸。無名的樸，那亦將無欲。不欲以靜，天下將自定。。這告訴我們順應自然，不刻意強求。",
      "本段經文記載古代典籍中的重要思想論述與歷史事件，展現先秦至漢代思想家的深刻智慧。"
    ],
    "correctAnswer": 3,
    "explanation": "【主題與背景】本段選自古代經典文獻。\\n【詞義與名物】包含重要的歷史與哲學概念。\\n【思想與篇章】體現了古代思想家對政治、社會與人生的深刻思考。",
    "workId": "hou-han-shu",
    "chapterId": "hou-han-shu_ch-1",
    "passageId": "hou-han-shu_ch-1_p-73"
  },
  {
    "id": "q-218",
    "type": "translation",
    "question": "請問以下古文的正確白話文釋義為何？\n「隨卦：隨：元，亨，利貞，無咎。\n大象傳曰：澤中有雷，隨；君子以嚮晦入宴息。」",
    "options": [
      "賢良文學代表回答說：「治理國家的根本在於推崇禮義道德，而不是把搜刮聚斂財富當作功勞。如今官府實行鹽鐵專賣、與平民百姓爭奪商業利益，導致百姓貧窮困頓、社會風俗輕浮敗壞。希望朝廷廢除鹽鐵官營專賣，崇尚仁政教化，百姓富有則國家自然安定。」",
      "隨卦：順隨，創始而亨通，適宜守正，便沒有災咎。\\\\n《大象傳》說：雷潛藏在澤水之中，是隨卦的形象；君子由此在天色向晚時進入室內，安然休息。",
      "尉繚子頒布兵令下規定：本條軍令明確規範軍隊編制、行軍紀律與戰場執法的具體條款。任何違反軍令的將士，一律按律處分，決不姑息。軍法的嚴明是軍隊戰鬥力的根本保障。",
      "《漢書・漢書卷八十九‧循吏傳第五十九》史實記載：「〔四〕　師古曰：緣，因也。因交代之際而棄匿簿書以盜官物也。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。"
    ],
    "correctAnswer": 1,
    "explanation": "隨不是盲從，而是因時順勢；「利貞」明定所隨仍須正當，否則不能免咎。震雷在兌澤之下，古人取雷到秋冬潛藏、隨時休息之象。「嚮晦」是接近昏暗，「宴息」是安息。《大象》把隨時落在日作夜息的節律：該行則行、該止則止。它肯定休息是順應時宜的一部分，不把無止境活動等同進德。",
    "workId": "yi-jing",
    "chapterId": "yi-jing_ch-17",
    "passageId": "yi-jing_ch-17_p-1"
  },
  {
    "id": "q-219",
    "type": "translation",
    "question": "請問以下古文的正確白話文釋義為何？\n「魏人有東門吳者，其子死而不憂。其相室曰：「公之愛子，天下无有。今子死不憂，何也？」東門吳曰：「吾常无...」",
    "options": [
      "管仲論述治國之道：本段闡明國家政治、經濟與軍事管理的核心策略。管子認為，明君應當依法治國、因時制宜，使百姓富足安寧、國家強盛有序。政令統一、獎罰分明，則上下一心、遠近歸附。",
      "《史記・卷百一十六‧西南夷列傳第五十六》史實記載：「及至南越反，上使馳義侯因犍為發南夷兵。且蘭君恐遠行，旁國虜其老弱，乃與……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "魏人有東門吳的人，他的先生死而且不憂。他的相室說：「公的愛先生，天下沒有有。今先生死不憂，何？」東門吳說：「我常沒有先生，沒有先生的時不憂。今先生死，乃和嚮沒有先生同，臣奚憂焉？」",
      "《漢書・漢書卷五十三‧景十三王傳第二十三》史實記載：「〔三〕　師古曰：迕，逆也，不敢逆昭信意。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。"
    ],
    "correctAnswer": 2,
    "explanation": "【主題與背景】本段選自《列子》，探討了關於「魏人有東門」的背景與意涵。\\n【詞義與名物】文中的關鍵概念反映了古代特有的認知方式，說明瞭「魏人有東門」等詞的古今異義與文化脈絡。\\n【道家哲思】本段強調了順應自然、無為而治的道家核心理念，對後世思想產生了深遠影響，展現了對宇宙人生的獨特見解。",
    "workId": "liezi",
    "chapterId": "liezi_ch-6",
    "passageId": "liezi_ch-6_p-12"
  },
  {
    "id": "q-220",
    "type": "translation",
    "question": "請問以下古文的正確白話文釋義為何？\n「漢帝送死皆珠襦玉匣。匣形如鎧甲，連以金縷。武帝匣上皆鏤為蛟龍鸞鳳龜麟之象，世謂為蛟龍玉匣。」",
    "options": [
      "《漢書・漢書卷三十‧藝文志第十》史實記載：「〔二〕　如淳曰：問王、知道，皆篇名也。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "《漢書・漢書卷九十九下‧王莽傳第六十九下》史實記載：「〔六〕　師古曰：蜚，古飛字。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "《漢書・漢書卷六十八‧霍光金日磾傳第三十八》史實記載：「〔一〕　師古曰：磾音丁奚反。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "本段經文記載古代典籍中的重要思想論述與歷史事件，展現先秦至漢代思想家的深刻智慧。"
    ],
    "correctAnswer": 3,
    "explanation": "【主題與背景】本段選自古代經典文獻。\\n【詞義與名物】包含重要的歷史與哲學概念。\\n【思想與篇章】體現了古代思想家對政治、社會與人生的深刻思考。",
    "workId": "xijing-zaji",
    "chapterId": "xijing-zaji_ch-1",
    "passageId": "xijing-zaji_ch-1_p-21"
  },
  {
    "id": "q-221",
    "type": "translation",
    "question": "請問以下古文的正確白話文釋義為何？\n「故夫三皇五帝之禮義法度，不矜於同而矜於治。故譬三皇五帝之禮義法度，其猶柤棃橘柚邪！其味相反，而皆可於...」",
    "options": [
      "《漢書・漢書卷二十七中之上‧五行志第七中之上》史實記載：「〔四〕　師古曰：諺，俗所傳言也。八十曰耄，亂也。言人年老閱歷既多，謂……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "故夫三皇五帝之禮義法度，不矜於同而矜於治。故譬三皇五帝之禮義法度，其依然柤棃橘柚邪！其味相反，而皆可於口。",
      "在《春秋穀梁傳》魯哀公卷的修省與萬世立法論述中，指出品德高尚的君子總是嚴於律己、反求諸己，而品行低劣的小人卻總是一味責求他人。唯有從修養自身做起，進而齊家、治國、平定天下，方能載入千秋史冊，將法度規範永遠留給後世作為典範。",
      "本段經文記載古代典籍中的重要思想論述與歷史事件，展現先秦至漢代思想家的深刻智慧。"
    ],
    "correctAnswer": 1,
    "explanation": "【主題與背景】\\n本段選自《莊子·天運》。探討天道之運行與時代之變遷，孔子見老子論仁義如行陸舟。\\n在本段落「故夫三皇五帝之禮義法度，不矜於同而矜於治...」中，莊子透過生動的文學寓意與哲理對話，展現了具體的思想境界與人生情境。\\n\\n【詞義與名物】\\n「故夫」：文中所用關鍵詞彙，在莊子文脈中具備特殊的道家哲學意涵。\\n「三皇」：先秦名物與習慣用語，需結合章節語境加以深入體會。\\n\\n【莊子哲理】\\n從莊子哲學觀點來看，本段落深刻體現了《天運》的核心思想：莊子藉由豐富的寓言語意引導人們回歸自然本真，摒棄功利機心與人為束縛，體會《天運》所傳達的超逸智慧。",
    "workId": "zhuangzi",
    "chapterId": "zhuangzi_ch-14",
    "passageId": "zhuangzi_ch-14_p-40"
  },
  {
    "id": "q-222",
    "type": "translation",
    "question": "請問以下古文的正確白話文釋義為何？\n「明日，又與之見壺子。立未定，自失而走。」",
    "options": [
      "《漢書・漢書卷九十六上‧西域傳第六十六上》史實記載：「〔四〕　師古曰：遠音於萬反。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "《漢書・漢書卷二十五下‧郊祀志第五下》史實記載：「〔二〕　師古曰：斄讀與邰同，今武功故城是。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "《史記・卷四十五‧韓世家第十五》史實記載：「懿侯二年，魏敗我馬陵。五年，與魏惠王會宅陽。九年，魏敗我澮。十二年，懿……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "明日，又與之見壺子。立未定，自失而走。"
    ],
    "correctAnswer": 3,
    "explanation": "【主題與背景】\\n本段選自《莊子·應帝王》。論述無為而治與順應民性的政治理想，終於混沌鑿七竅而死之寓言。\\n在本段落「明日，又與之見壺子。立未定，自失而走。...」中，莊子透過生動的文學寓意與哲理對話，展現了具體的思想境界與人生情境。\\n\\n【詞義與名物】\\n「明日」：文中所用關鍵詞彙，在莊子文脈中具備特殊的道家哲學意涵。\\n「又與」：先秦名物與習慣用語，需結合章節語境加以深入體會。\\n\\n【莊子哲理】\\n從莊子哲學觀點來看，本段落深刻體現了《應帝王》的核心思想：莊子藉由豐富的寓言語意引導人們回歸自然本真，摒棄功利機心與人為束縛，體會《應帝王》所傳達的超逸智慧。",
    "workId": "zhuangzi",
    "chapterId": "zhuangzi_ch-7",
    "passageId": "zhuangzi_ch-7_p-21"
  },
  {
    "id": "q-223",
    "type": "translation",
    "question": "請問以下古文的正確白話文釋義為何？\n「樊遲問知。子曰：「務民之義，敬鬼神而遠之，可謂知矣。」問仁。曰：「仁者先難而後獲，可謂仁矣。」」",
    "options": [
      "《漢書・漢書卷七十三‧韋賢傳第四十三》史實記載：「元帝崩，衡奏言：前以上體不平，故復諸所罷祠，卒不蒙福。〔一〕案衛思後……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "樊遲問什麼是智慧。孔子說：「專心處理百姓應有的人倫事務，尊敬鬼神卻不過分親近依賴，可以稱為智慧。」又問什麼是仁。孔子說：「仁者先承擔艱難的實踐，把收穫放在後面，可以稱為仁。」",
      "如果能把這個身體經常安置在閒適、超然的境地，世俗的榮譽、恥辱、得到與失去，又有誰能奴役、支配我呢？如果能把這顆心靈經常安頓在寧靜的狀態中，世間的是非、利害，又有誰能矇騙、迷惑我呢？",
      "《漢書・漢書卷二‧惠帝紀第二》史實記載：「〔一〕　臣瓚曰：帝年十七即位，即位七年，壽二十（四）〔三〕。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。"
    ],
    "correctAnswer": 1,
    "explanation": "【知務人事，仁先其難】\\\\n• 「務民之義」是盡力於人民、人倫所宜；「遠鬼神」不是否定祭祀，而是不用鬼神取代人的責任。《論語註疏》亦作敬而不黷。\\\\n• 「先難而後獲」指先做困難而正當之事，不以利益為起點；「獲」有收穫、功效之意。知與仁都落在務實責任。",
    "workId": "lun-yu",
    "chapterId": "lun-yu_ch-6",
    "passageId": "lun-yu_ch-6_p-20"
  },
  {
    "id": "q-224",
    "type": "translation",
    "question": "請問以下古文的正確白話文釋義為何？\n「子曰：「不得中行而與之，必也狂狷乎！狂者進取，狷者有所不為也。」」",
    "options": [
      "《史記・卷七十‧張儀列傳第十》史實記載：「苴蜀相攻擊，各來告急於秦。秦惠王欲發兵以伐蜀，以為道險狹難至，而韓又來……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "《漢書・漢書卷四十五‧蒯伍江息夫傳第十五》史實記載：「〔八〕　師古曰：彼謂武信君也。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "《漢書・漢書卷五十二‧竇田灌韓傳第二十二》史實記載：「〔三〕　師古曰：謂喪服之制也。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "孔子說：「如果找不到做事合乎中庸之道的人來交往，就必定要找狂妄或拘謹的人吧！狂妄的人志向高遠、積極進取；拘謹的人則有所不為，能堅守底線。」"
    ],
    "correctAnswer": 3,
    "explanation": "【主題與背景】\\n孔子在感嘆中庸之道難以實行時，退而求其次地評價了「狂」與「狷」兩種人格特質。\\n【詞義與名物】\\n中行：合乎中庸之道。狂：志向極高，但不拘小節。狷：潔身自好，有所不為。\\n【儒家義理】\\n中庸是最高理想，但現實中難以求得。孔子肯定「狂者」的進取心和「狷者」的道德底線，展現了儒家在堅持理想的同時，也包容不同氣質的多元價值觀。",
    "workId": "lun-yu",
    "chapterId": "lun-yu_ch-13",
    "passageId": "lun-yu_ch-13_p-21"
  },
  {
    "id": "q-225",
    "type": "translation",
    "question": "請問以下古文的正確白話文釋義為何？\n「元年春王正月。公即位。三月，公及邾儀父盟于蔑。夏五月，鄭伯克段于鄢。秋七月，天王使宰嬀來歸惠公仲子之...」",
    "options": [
      "《漢書・漢書卷五‧景帝紀第五》史實記載：「御史大夫綰奏禁馬高五尺九寸以上，齒未平，不得出關。〔一〕……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "魯桓公13年（西元前699年）。《春秋》記錄魯國及周邊列國當年在朝聘、盟會、征伐與宗廟祭祀方面之重要史實。",
      "《史記・卷三十三‧魯周公世家第三》史實記載：「其後武王旣崩，成王少，在強葆之中。周公恐天下聞武王崩而畔，周公乃踐阼代……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "《漢書・漢書卷八十五‧谷永杜鄴傳第五十五》史實記載：「〔六〕　師古曰：肅，敬也。艾讀曰乂。乂，治也。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。"
    ],
    "correctAnswer": 1,
    "explanation": "【主題與背景】\\n本年為魯桓公13年（西元前699年）。在周天子權威持續衰微之背景下，魯桓公領導魯國應對列國爭霸與外交盟會交涉。\\n\\n【詞義與名物】\\n「桓公」指魯國君主；「春秋」為魯國國史編年紀錄；「諸侯」指周代分封之列國君主。\\n\\n【春秋筆法】\\n本條記錄嚴格遵循《春秋》「筆則筆，削則削」之史家規範，以極精煉之文字載錄史實，示褒貶於字裡行間。",
    "workId": "chun-qiu",
    "chapterId": "chun-qiu_ch-24",
    "passageId": "chun-qiu_ch-24_p-1"
  },
  {
    "id": "q-226",
    "type": "translation",
    "question": "請問以下古文的正確白話文釋義為何？\n「昔者齊國鄰邑相望，雞狗之音相聞，罔罟之所布，耒耨之所刺，方二千餘里。闔四竟之內，所以立宗廟社稷，治邑...」",
    "options": [
      "從前齊國鄰邑相望，雞狗之音相聞，罔罟之所布，耒耨之所刺，方二千餘裏。闔四竟之內，所以立宗廟社稷，治邑屋州閭鄉曲者，曷嘗不法體悟大道的聖人哉！",
      "莊周說：「我守形而忘身，觀於濁水而迷於清淵。而且我聞諸夫子說：『入其俗，從其俗。』",
      "一個人的志向與氣度要高遠寬廣，但絕不可以流於狂妄放蕩；心思要周密嚴謹，但絕不可以流於瑣碎繁雜；生活趣味要清雅淡泊，但絕不可以流於枯燥死寂；道德操守要嚴格清明，但絕不可以流於偏激剛烈。",
      "《漢書・漢書卷六十二‧司馬遷傳第三十二》史實記載：「遷既死後，其書稍出。宣帝時，遷外孫平通侯楊惲祖述其書，遂宣佈焉。至王莽……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。"
    ],
    "correctAnswer": 0,
    "explanation": "【主題與背景】\\n本段選自《莊子·胠篋》。指出聖人制定的法度常為大盜所利用（盜亦有道），主張祛除偽飾。\\n在本段落「昔者齊國鄰邑相望，雞狗之音相聞，罔罟之所...」中，莊子透過生動的文學寓意與哲理對話，展現了具體的思想境界與人生情境。\\n\\n【詞義與名物】\\n「昔者」：文中所用關鍵詞彙，在莊子文脈中具備特殊的道家哲學意涵。\\n「齊國」：先秦名物與習慣用語，需結合章節語境加以深入體會。\\n\\n【莊子哲理】\\n從莊子哲學觀點來看，本段落深刻體現了《胠篋》的核心思想：主張超越人為劃分的是非與物我界限，體悟萬物齊一與天籟和諧，達到物我兩忘的圓融境界。",
    "workId": "zhuangzi",
    "chapterId": "zhuangzi_ch-10",
    "passageId": "zhuangzi_ch-10_p-4"
  },
  {
    "id": "q-227",
    "type": "translation",
    "question": "請問以下古文的正確白話文釋義為何？\n「利害不通，非君子也；徇名失己，非士也；亡身不真，非役人也。」",
    "options": [
      "《史記・卷八十三‧魯仲連鄒陽列傳第二十三》史實記載：「諺曰：有白頭如新，傾蓋如故。何則？知與不知也。故昔樊於期逃秦之燕，……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "《漢書・漢書卷二十七下之上‧五行志第七下之上》史實記載：「〔三〕　師古曰：哀樂，可樂而反哀也。樂哀，可哀而反樂也。喪，失之也。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "《漢書・漢書卷七十三‧韋賢傳第四十三》史實記載：「〔三〕　師古曰：博士姓義名倩也。宗家，賢之同族也。倩音千見反。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "利害不通，非有德行的君子也；徇名失己，非士也；亡身不真，非役人也。"
    ],
    "correctAnswer": 3,
    "explanation": "【主題與背景】\\n本段選自《莊子·大宗師》。尊崇大自然為宗師，體悟生死一體與「坐忘」境界，回歸道的本源。\\n在本段落「利害不通，非君子也；徇名失己，非士也；亡...」中，莊子透過生動的文學寓意與哲理對話，展現了具體的思想境界與人生情境。\\n\\n【詞義與名物】\\n「利害」：文中所用關鍵詞彙，在莊子文脈中具備特殊的道家哲學意涵。\\n「不通」：先秦名物與習慣用語，需結合章節語境加以深入體會。\\n\\n【莊子哲理】\\n從莊子哲學觀點來看，本段落深刻體現了《大宗師》的核心思想：莊子藉由豐富的寓言語意引導人們回歸自然本真，摒棄功利機心與人為束縛，體會《大宗師》所傳達的超逸智慧。",
    "workId": "zhuangzi",
    "chapterId": "zhuangzi_ch-6",
    "passageId": "zhuangzi_ch-6_p-10"
  },
  {
    "id": "q-228",
    "type": "translation",
    "question": "請問以下古文的正確白話文釋義為何？\n「然而天下之士非兼者之言，猶未止也。曰：「意可以擇士，而不可以擇君乎？」「姑嘗兩而進之。設以為二君，使...」",
    "options": [
      "《漢書・漢書卷二十五上‧郊祀志第五上》史實記載：「〔九〕　師古曰：匱，乏也。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "《史記・卷八‧高祖本紀第八》史實記載：「項羽出關，使人徙義帝。曰：古之帝者地方千里，必居上游。乃使使徙義帝……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "本段經文記載古代典籍中的重要思想論述與歷史事件，展現先秦至漢代思想家的深刻智慧。",
      "雖然，其為人太多，其自為太少，說：「請欲固置五升之飯足矣。」先生恐不得飽，弟子雖飢，不忘全天下，日夜不休，說："
    ],
    "correctAnswer": 2,
    "explanation": "【主題與背景】本段選自古代經典文獻。\\n【詞義與名物】包含重要的歷史與哲學概念。\\n【思想與篇章】體現了古代思想家對政治、社會與人生的深刻思考。",
    "workId": "mo-zi",
    "chapterId": "mo-zi_ch-16",
    "passageId": "mo-zi_ch-16_p-5"
  },
  {
    "id": "q-229",
    "type": "translation",
    "question": "請問以下古文的正確白話文釋義為何？\n「周最謂金投曰：「公負令秦與強齊戰。戰勝，秦且收齊而封之，使無多割，而聽天下之戰；不勝，國大傷，不得不...」",
    "options": [
      "《漢書・漢書卷八十七下‧揚雄傳第五十七下》史實記載：「〔六〕　師古曰：古文之異者。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "《史記・卷百二十六‧滑稽列傳第六十六》史實記載：「武帝時，齊人有東方生名朔，以好古傳書，愛經術，多所博觀外家之語。朔初入……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "《漢書・漢書卷二十七中之下‧五行志第七中之下》史實記載：「太初元年夏，蝗從東方蜚至敦煌；〔一〕三年秋，復蝗。元年貳師將軍徵大宛，……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "這是一段來自戰國策的歷史敘述，記載了當時各國君臣之間的政治對話與外交策略。具體描述了相關人物在面對國家危機或戰略抉擇時的應對之策（段落編號：13）。"
    ],
    "correctAnswer": 3,
    "explanation": "【主題與背景】\\n本段落（13）反映了戰國時期諸侯國之間錯綜複雜的政治角力與軍事衝突。當時各國為了爭奪霸權或尋求生存，頻繁展開外交周旋與軍事行動。\\n\\n【詞義與名物】\\n「君臣」：指各國的統治者與輔佐之臣。\\n「戰國」：時代背景，羣雄並起。\\n\\n【縱橫機謋】\\n段落中展現了典型的戰國策士風範。他們善於揣摩人心，分析利害關係，並利用各國之間的矛盾與利益衝突，提出巧言善辯的策略，以達到保全自身或削弱敵國的政治目的。",
    "workId": "zhan-guo-ce",
    "chapterId": "zhan-guo-ce_ch-1",
    "passageId": "zhan-guo-ce_ch-1_p-15"
  },
  {
    "id": "q-230",
    "type": "translation",
    "question": "請問以下古文的正確白話文釋義為何？\n「四月，甲辰，鄭公子忽如陳逆婦媯。辛亥，以媯氏歸。甲寅，入于鄭，陳鍼子送女，先配而後祖。鍼子曰：「是不...」",
    "options": [
      "本段經文記載古代典籍中的重要思想論述與歷史事件，展現先秦至漢代思想家的深刻智慧。",
      "《漢書・漢書卷四‧文帝紀第四》史實記載：「三月，除關無用傳。〔一〕……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "《史記・卷二十六‧曆書第四》史實記載：「大餘十，小餘六十二；……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "遂迎臧丈人而授之政。典法無更，偏令無出。三年，文王觀於國，則列士壞植散羣，長官者不成德，斔斛不敢入於四境。"
    ],
    "correctAnswer": 0,
    "explanation": "【主題與背景】本段選自古代經典文獻。\\n【詞義與名物】包含重要的歷史與哲學概念。\\n【思想與篇章】體現了古代思想家對政治、社會與人生的深刻思考。",
    "workId": "chun-qiu-zuo-zhuan",
    "chapterId": "chun-qiu-zuo-zhuan_ch-1",
    "passageId": "chun-qiu-zuo-zhuan_ch-1_p-117"
  },
  {
    "id": "q-231",
    "type": "translation",
    "question": "請問以下古文的正確白話文釋義為何？\n「時厥明，王乃大巡六師，明誓眾士。王曰：「嗚呼！我西土君子。天有顯道，厥類惟彰。今商王受，狎侮五常，荒...」",
    "options": [
      "《漢書・漢書卷八十七下‧揚雄傳第五十七下》史實記載：「〔四〕　師古曰：票，票騎霍去病。衛，衛青也。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "本段經文記載古代典籍中的重要思想論述與歷史事件，展現先秦至漢代思想家的深刻智慧。",
      "《漢書・漢書卷九十九中‧王莽傳第六十九中》史實記載：「〔六〕　孟康曰：黃帝之後也。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "《漢書・漢書卷二十五下‧郊祀志第五下》史實記載：「〔二〕　師古曰：敕，整也。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。"
    ],
    "correctAnswer": 1,
    "explanation": "【主題與背景】本段選自古代經典文獻。\\n【詞義與名物】包含重要的歷史與哲學概念。\\n【思想與篇章】體現了古代思想家對政治、社會與人生的深刻思考。",
    "workId": "shu-jing",
    "chapterId": "shu-jing_ch-33",
    "passageId": "shu-jing_ch-33_p-1"
  },
  {
    "id": "q-232",
    "type": "translation",
    "question": "請問以下古文的正確白話文釋義為何？\n「光武從薊還，過范陽，命收葬吏士。至中山，諸將復上奏曰：「」",
    "options": [
      "《漢書・漢書卷九十四下‧匈奴傳第六十四下》史實記載：「〔二〕　師古曰：微謂精妙也。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "《史記・卷百二十八‧龜策列傳第六十八》史實記載：「衞平對曰：不然。臣聞盛德不報，重寄不歸；天與不受，天奪之寶。今龜周流……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "《漢書・漢書卷五十五‧衛青霍去病傳第二十五》史實記載：「〔六〕　師古曰：振，舉也。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "本段經文記載古代典籍中的重要思想論述與歷史事件，展現先秦至漢代思想家的深刻智慧。"
    ],
    "correctAnswer": 3,
    "explanation": "【主題與背景】本段選自古代經典文獻。\\n【詞義與名物】包含重要的歷史與哲學概念。\\n【思想與篇章】體現了古代思想家對政治、社會與人生的深刻思考。",
    "workId": "hou-han-shu",
    "chapterId": "hou-han-shu_ch-1",
    "passageId": "hou-han-shu_ch-1_p-27"
  },
  {
    "id": "q-233",
    "type": "translation",
    "question": "請問以下古文的正確白話文釋義為何？\n「孔子愀然曰：「請問何謂真？」」",
    "options": [
      "《漢書・漢書卷二十五上‧郊祀志第五上》史實記載：「〔三〕　師古曰：阯者，山之基足，音止。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "孔子說：「南方人有句話：『一個人若沒有恆心，連巫師和醫生也做不了。』這話說得好！」《易經》說：「不能恆久守德，有時會招來羞辱。」孔子說：「這種人是不去佔問吉兇罷了。」",
      "這是一段來自戰國策的歷史敘述，記載了當時各國君臣之間的政治對話與外交策略。具體描述了相關人物在面對國家危機或戰略抉擇時的應對之策（段落編號：153）。",
      "孔子愀然說：「請問何謂真？」"
    ],
    "correctAnswer": 3,
    "explanation": "【主題與背景】\\n本段選自《莊子·漁父》。孔子遇漁父於淄帷，漁父指出孔子八病四患，強調真者精誠之至。\\n在本段落「孔子愀然曰：「請問何謂真？」...」中，莊子透過生動的文學寓意與哲理對話，展現了具體的思想境界與人生情境。\\n\\n【詞義與名物】\\n「孔子」：文中所用關鍵詞彙，在莊子文脈中具備特殊的道家哲學意涵。\\n「愀然」：先秦名物與習慣用語，需結合章節語境加以深入體會。\\n\\n【莊子哲理】\\n從莊子哲學觀點來看，本段落深刻體現了《漁父》的核心思想：莊子藉由豐富的寓言語意引導人們回歸自然本真，摒棄功利機心與人為束縛，體會《漁父》所傳達的超逸智慧。",
    "workId": "zhuangzi",
    "chapterId": "zhuangzi_ch-31",
    "passageId": "zhuangzi_ch-31_p-33"
  },
  {
    "id": "q-234",
    "type": "translation",
    "question": "請問以下古文的正確白話文釋義為何？\n「然而天下之士非兼者之言，猶未止也。曰：「即善矣。雖然，豈可用哉？」子墨子曰：「用而不可，雖我亦將非之...」",
    "options": [
      "《漢書・漢書卷四十四‧淮南衡山濟北王傳第十四》史實記載：「〔三〕　張晏曰：大夫，姓也，上雲男子但，明其本姓大夫也。如淳曰……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "《漢書・漢書卷二十七下之上‧五行志第七下之上》史實記載：「傳曰：思心之不睿，是謂不聖，厥咎霿，〔一〕厥罰恆風，厥極兇短折。時則……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "《漢書・漢書卷五十二‧竇田灌韓傳第二十二》史實記載：「〔一〕　師古曰：言易零落。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "本段經文記載古代典籍中的重要思想論述與歷史事件，展現先秦至漢代思想家的深刻智慧。"
    ],
    "correctAnswer": 3,
    "explanation": "【主題與背景】本段選自古代經典文獻。\\n【詞義與名物】包含重要的歷史與哲學概念。\\n【思想與篇章】體現了古代思想家對政治、社會與人生的深刻思考。",
    "workId": "mo-zi",
    "chapterId": "mo-zi_ch-16",
    "passageId": "mo-zi_ch-16_p-4"
  },
  {
    "id": "q-235",
    "type": "translation",
    "question": "請問以下古文的正確白話文釋義為何？\n「愈再拜。愈之獲見於閤下有年矣。始者亦嘗辱一言之譽。貧賤也、衣食於奔走、不得朝夕繼見。其後閤下位益尊、...」",
    "options": [
      "愈再拜。愈之獲見於閤下有年了。始者亦嘗辱一言之譽。貧賤也，衣食於奔走，不得朝夕繼見。其後閤下位益尊，伺候於門牆者日益進。夫位益尊，則賤者日隔。伺候於門牆者日益進，則愛博而情不專。愈也道不加修，而文日益有名。夫道不加修，則賢者不和。文日益有名，則同進者忌。始之以日隔之疏，加之以不專之望，以不和者之心，而聽忌者之說。由是閤下之庭，無愈之跡了。去年春，亦嘗一進謁於左右了。溫嗎其容，若加其新也。屬嗎其言，若閔其窮也。退而喜也，以告於人。其後如東京取妻子，又不得朝夕繼見。以及其還也，亦嘗一進謁於左右了。邈嗎其容，若不察其愚也。悄嗎其言，若不接其情也。退而懼也，不敢復進。今則釋然悟，翻然悔說：，其邈也，於是所以怒其來之不繼也。其悄也，於是所以示其意也。不敏之誅，無所逃避。不敢遂進，輒自疏其所以，並獻近所爲復志賦以下十首爲一卷，卷有標軸。送孟郊序一首，生紙寫，不加裝飾，皆有揩字註字處，急於自解而謝，不能竢更寫。閤下取其意，而略其禮可也。愈恐懼再拜。",
      "顏淵請問治理國家的道理。孔子說：「採用夏朝的曆法，乘坐殷朝的車子，戴周朝的禮帽，音樂則用舜時的《韶》舞。要禁絕鄭國的音樂，遠離花言巧語的人。因為鄭國的音樂淫靡，花言巧語的人危險。」",
      "《史記・卷四十七‧孔子世家第十七》史實記載：「孔子知弟子有慍心，乃召子路而問曰：詩雲匪兕匪虎，率彼曠野。吾道非……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。",
      "《漢書・漢書卷三十六‧楚元王傳第六》史實記載：「〔二〕　師古曰：過猶誤。……」。本段記述歷史風雲人物事跡、朝代興衰成敗與國家政治外交謀略。"
    ],
    "correctAnswer": 0,
    "explanation": "【主題與背景】本段選自《古文觀止》收錄之《古文觀止名篇》（出處：《古代散文》）。歷代古典散文名篇，展現深厚的思想與文學價值。\\n【詞義與名物】段落中涉及的核心詞彙如「名物詞彙」、「篇章結構」，典雅精煉，寄託了作者獨特的文學情懷與歷史思考。\\n【篇章解析】在寫作藝術與思想內涵上，本段語言凝練，結構嚴謹，章法氣勢充沛，展現了中國古代散文頂峯的文學魅力與人文精神。",
    "workId": "gu-wen-guan-zhi",
    "chapterId": "gu-wen-guan-zhi_ch-132",
    "passageId": "gu-wen-guan-zhi_ch-132_p-198"
  },
  {
    "id": "q-236",
    "type": "translation",
    "question": "請問以下古文的正確白話文釋義為何？\n「且商書獨鬼，而夏書不鬼，則未足以為法也。然則姑嘗上觀乎夏書禹誓曰：『大戰于甘，王乃命左右六人，下聽誓...」",
    "options": [
      "本段經文記載古代典籍中的重要思想論述與歷史事件，展現先秦至漢代思想家的深刻智慧。",
      "本段經文記載古代典籍中的重要思想論述與歷史事件，展現先秦至漢代思想家的深刻智慧。",
      "堯說：「膠膠擾擾乎！子，天之合也；我，人之合也。」",
      "孔子說：「君子安詳舒泰而不驕傲放肆；小人驕傲放肆，內心卻不能安泰。」"
    ],
    "correctAnswer": 0,
    "explanation": "【主題與背景】本段選自古代經典文獻。\\n【詞義與名物】包含重要的歷史與哲學概念。\\n【思想與篇章】體現了古代思想家對政治、社會與人生的深刻思考。",
    "workId": "mo-zi",
    "chapterId": "mo-zi_ch-31",
    "passageId": "mo-zi_ch-31_p-15"
  },
  {
    "id": "q-237",
    "type": "analysis",
    "question": "針對以下段落，何者是最符合其思想或章旨的解析？\n「令，不為所作也。」",
    "options": [
      "本段選自史學名著《漢書・漢書卷九十四下‧匈奴傳第六十四下》。記載重要歷史事件與君臣對答紀實。",
      "本段選自古代經典文獻。",
      "本段選自史學名著《史記・卷百三十‧太史公自序第七十》。記載重要歷史事件與君臣對答紀實。",
      "本段選自史學名著《漢書・漢書卷二十二‧禮樂志第二》。記載重要歷史事件與君臣對答紀實。"
    ],
    "correctAnswer": 1,
    "explanation": "【主題與背景】本段選自古代經典文獻。\\n【詞義與名物】包含重要的歷史與哲學概念。\\n【思想與篇章】體現了古代思想家對政治、社會與人生的深刻思考。...",
    "workId": "mo-zi",
    "chapterId": "mo-zi_ch-40",
    "passageId": "mo-zi_ch-40_p-35"
  },
  {
    "id": "q-238",
    "type": "analysis",
    "question": "針對以下段落，何者是最符合其思想或章旨的解析？\n「曰：「奚為焉？」」",
    "options": [
      "其他經典的洞察。",
      "這是本篇的核心精神。",
      "本段選自史學名著《漢書・漢書卷九‧元帝紀第九》。記載重要歷史事件與君臣對答紀實。",
      "本段選自史學名著《漢書・漢書卷八十二‧王商史丹傅喜傳第五十二》。記載重要歷史事件與君臣對答紀實。"
    ],
    "correctAnswer": 1,
    "explanation": "【主題與背景】\\n本段選自《莊子·人間世》。面對混濁亂世的處世智慧，提出「心齋」與「無用之用」，以保全自身。\\n在本段落「曰：「奚為焉？」...」中，莊子透過生動的文學寓意與哲理對話，展現了具體的思想境界與人生情境。\\n\\n【詞義與名物】\\n「焉」：在其中、於此、如何\\n\\n【莊子哲理】\\n從莊子哲...",
    "workId": "zhuangzi",
    "chapterId": "zhuangzi_ch-4",
    "passageId": "zhuangzi_ch-4_p-4"
  },
  {
    "id": "q-239",
    "type": "analysis",
    "question": "針對以下段落，何者是最符合其思想或章旨的解析？\n「管夷吾、鮑叔牙二人相友甚戚，同處於齊。管夷吾事公子糾，鮑叔牙事公子小白。齊公族多寵，嫡庶並行。國人懼...」",
    "options": [
      "\\",
      "本段選自史學名著《漢書・漢書卷二十六‧天文志第六》。記載重要歷史事件與君臣對答紀實。",
      "本段選自《列子》。《列子》又名《沖虛真經》，為先秦道家經典，以寓言故事闡發深刻哲理。",
      "本段選自史學名著《漢書・漢書卷四十‧張陳王周傳第十》。記載重要歷史事件與君臣對答紀實。"
    ],
    "correctAnswer": 2,
    "explanation": "【主題與背景】本段選自《列子》。《列子》又名《沖虛真經》，為先秦道家經典，以寓言故事闡發深刻哲理。\\n【詞義與名物】列子善用奇特寓言與生動對話，將深奧的道家哲理化為淺顯易懂的故事。\\n【思想與篇章】列子繼承老莊思想，強調順應自然、超越世俗名利，追求心靈的逍遙與自由。...",
    "workId": "liezi",
    "chapterId": "liezi_ch-6",
    "passageId": "liezi_ch-6_p-3"
  },
  {
    "id": "q-240",
    "type": "analysis",
    "question": "針對以下段落，何者是最符合其思想或章旨的解析？\n「疑，說在逢、循、遇、過。」",
    "options": [
      "本段選自史學名著《漢書・漢書卷九十一‧貨殖傳第六十一》。記載重要歷史事件與君臣對答紀實。",
      "本段選自史學名著《漢書・漢書卷九十四上‧匈奴傳第六十四上》。記載重要歷史事件與君臣對答紀實。",
      "本段選自古代經典文獻。",
      "本段選自古代經典文獻。"
    ],
    "correctAnswer": 2,
    "explanation": "【主題與背景】本段選自古代經典文獻。\\n【詞義與名物】包含重要的歷史與哲學概念。\\n【思想與篇章】體現了古代思想家對政治、社會與人生的深刻思考。...",
    "workId": "mo-zi",
    "chapterId": "mo-zi_ch-41",
    "passageId": "mo-zi_ch-41_p-21"
  },
  {
    "id": "q-241",
    "type": "analysis",
    "question": "針對以下段落，何者是最符合其思想或章旨的解析？\n「湯得其司御門尹登恆為之傅之，從師而不囿；得其隨成，為之司其名；之名嬴法，得其兩見。仲尼之盡慮，為之傅...」",
    "options": [
      "本段選自古代經典文獻。",
      "本段選自《鹽鐵論・神儒》（第22篇）。賢良文學代表儒家理想主義，主張政治應以仁政教化與藏富於民為本。",
      "這是本篇的核心精神。",
      "本段選自史學名著《漢書・漢書卷五十六‧董仲舒傳第二十六》。記載重要歷史事件與君臣對答紀實。"
    ],
    "correctAnswer": 2,
    "explanation": "【主題與背景】\\n本段選自《莊子·則陽》。以觸蠻二國於蝸牛角上相爭寓言天下極小，道超越語言與名實。\\n在本段落「湯得其司御門尹登恆為之傅之，從師而不囿；...」中，莊子透過生動的文學寓意與哲理對話，展現了具體的思想境界與人生情境。\\n\\n【詞義與名物】\\n「湯得」：文中所用關鍵詞彙，在莊子文脈中具備...",
    "workId": "zhuangzi",
    "chapterId": "zhuangzi_ch-25",
    "passageId": "zhuangzi_ch-25_p-14"
  },
  {
    "id": "q-242",
    "type": "analysis",
    "question": "針對以下段落，何者是最符合其思想或章旨的解析？\n「知不知上；不知知病。夫唯病病，是以不病。聖人不病，以其病病，是以不病。」",
    "options": [
      "本段選自史學名著《漢書・漢書卷七‧昭帝紀第七》。記載重要歷史事件與君臣對答紀實。",
      "本段選自古代經典文獻。",
      "本段選自史學名著《漢書・漢書卷五十二‧竇田灌韓傳第二十二》。記載重要歷史事件與君臣對答紀實。",
      "本段選自史學名著《漢書・漢書卷八十四‧翟方進傳第五十四》。記載重要歷史事件與君臣對答紀實。"
    ],
    "correctAnswer": 1,
    "explanation": "【主題與背景】本段選自古代經典文獻。\\n【詞義與名物】包含重要的歷史與哲學概念。\\n【思想與篇章】體現了古代思想家對政治、社會與人生的深刻思考。...",
    "workId": "dao-de-jing",
    "chapterId": "dao-de-jing_ch-71",
    "passageId": "dao-de-jing_ch-71_p-1"
  },
  {
    "id": "q-243",
    "type": "analysis",
    "question": "針對以下段落，何者是最符合其思想或章旨的解析？\n「家人卦：家人：利女貞。\n大象傳曰：風自火出，家人；君子以言有物而行有恆。」",
    "options": [
      "本段選自史學名著《漢書・漢書卷四十四‧淮南衡山濟北王傳第十四》。記載重要歷史事件與君臣對答紀實。",
      "本段選自史學名著《漢書・漢書卷四十三‧酈陸朱劉叔孫傳第十三》。記載重要歷史事件與君臣對答紀實。",
      "本段選自史學名著《漢書・漢書卷二十七上‧五行志第七上》。記載重要歷史事件與君臣對答紀實。",
      "家人討論家庭秩序。「利女貞」反映古代內外分工及以女性為家庭內位主體的觀念，不能直接轉成現代女性應被限定於家內；可保留的原則是所有成員各守責任、關係正當。風由火出，影響自內及外，《大象》因此不列家規細目，而要求「言有物、行有恆」：話有事實內容，行為前後一致，家庭信任纔可能向外擴展。"
    ],
    "correctAnswer": 3,
    "explanation": "家人討論家庭秩序。「利女貞」反映古代內外分工及以女性為家庭內位主體的觀念，不能直接轉成現代女性應被限定於家內；可保留的原則是所有成員各守責任、關係正當。風由火出，影響自內及外，《大象》因此不列家規細目，而要求「言有物、行有恆」：話有事實內容，行為前後一致，家庭信任纔可能向外擴展。...",
    "workId": "yi-jing",
    "chapterId": "yi-jing_ch-37",
    "passageId": "yi-jing_ch-37_p-1"
  },
  {
    "id": "q-244",
    "type": "analysis",
    "question": "針對以下段落，何者是最符合其思想或章旨的解析？\n「子列子曰：「昔者聖人因陰陽以統天地。夫有形者生於无形，則天地安從生？故曰：有太易，有太初，有太始，有...」",
    "options": [
      "本段選自古代經典文獻。",
      "本段選自史學名著《漢書・漢書卷四十三‧酈陸朱劉叔孫傳第十三》。記載重要歷史事件與君臣對答紀實。",
      "本段選自史學名著《漢書・漢書卷三十‧藝文志第十》。記載重要歷史事件與君臣對答紀實。",
      "本段選自史學名著《史記・卷四‧周本紀第四》。記載重要歷史事件與君臣對答紀實。"
    ],
    "correctAnswer": 0,
    "explanation": "【主題與背景】本段選自古代經典文獻。\\n【詞義與名物】包含重要的歷史與哲學概念。\\n【思想與篇章】體現了古代思想家對政治、社會與人生的深刻思考。...",
    "workId": "liezi",
    "chapterId": "liezi_ch-1",
    "passageId": "liezi_ch-1_p-2"
  },
  {
    "id": "q-245",
    "type": "analysis",
    "question": "針對以下段落，何者是最符合其思想或章旨的解析？\n「故跖之徒問於跖曰：「盜亦有道乎？」跖曰：「何適而无有道邪！」」",
    "options": [
      "本段選自史學名著《漢書・漢書卷九十九中‧王莽傳第六十九中》。記載重要歷史事件與君臣對答紀實。",
      "這是本篇的核心精神。",
      "本段選自史學名著《漢書・漢書卷七十八‧蕭望之傳第四十八》。記載重要歷史事件與君臣對答紀實。",
      "本段選自史學名著《漢書・漢書卷二十二‧禮樂志第二》。記載重要歷史事件與君臣對答紀實。"
    ],
    "correctAnswer": 1,
    "explanation": "【主題與背景】\\n本段選自《莊子·胠篋》。指出聖人制定的法度常為大盜所利用（盜亦有道），主張祛除偽飾。\\n在本段落「故蹠之徒問於蹠曰：「盜亦有道乎？」蹠曰：...」中，莊子透過生動的文學寓意與哲理對話，展現了具體的思想境界與人生情境。\\n\\n【詞義與名物】\\n「盜亦有道」：大盜亦有其內在之作風法則（...",
    "workId": "zhuangzi",
    "chapterId": "zhuangzi_ch-10",
    "passageId": "zhuangzi_ch-10_p-7"
  },
  {
    "id": "q-246",
    "type": "analysis",
    "question": "針對以下段落，何者是最符合其思想或章旨的解析？\n「今爾出於崖涘，觀於大海，乃知爾醜，爾將可與語大理矣。天下之水，莫大於海，萬川歸之，不知何時止而不盈；...」",
    "options": [
      "本段選自史學名著《漢書・漢書卷二十八下‧地理志第八下》。記載重要歷史事件與君臣對答紀實。",
      "這是本篇的核心精神。",
      "本段選自史學名著《漢書・漢書卷十九上‧百官公卿表第七上》。記載重要歷史事件與君臣對答紀實。",
      "本段選自史學名著《漢書・漢書卷二十八上‧地理志第八上》。記載重要歷史事件與君臣對答紀實。"
    ],
    "correctAnswer": 1,
    "explanation": "【主題與背景】\\n本段選自《莊子·秋水》。以河伯與海若之對話論大小相對性，兼論井蛙與濠梁之魚樂。\\n在本段落「今爾出於崖涘，觀於大海，乃知爾醜，爾將可...」中，莊子透過生動的文學寓意與哲理對話，展現了具體的思想境界與人生情境。\\n\\n【詞義與名物】\\n「今爾」：文中所用關鍵詞彙，在莊子文脈中具備特...",
    "workId": "zhuangzi",
    "chapterId": "zhuangzi_ch-17",
    "passageId": "zhuangzi_ch-17_p-5"
  },
  {
    "id": "q-247",
    "type": "analysis",
    "question": "針對以下段落，何者是最符合其思想或章旨的解析？\n「十過：一曰、行小忠則大忠之賊也。二曰、顧小利則大利之殘也。三曰、行僻自用，無禮諸侯，則亡身之至也。四...」",
    "options": [
      "本段選自史學名著《漢書・漢書卷八十五‧谷永杜鄴傳第五十五》。記載重要歷史事件與君臣對答紀實。",
      "本段選自《韓非子・十過》。系統論述韓非子法、術、勢融為一體的法家政治哲學。",
      "本段選自史學名著《漢書・漢書卷八十一‧匡張孔馬傳第五十一》。記載重要歷史事件與君臣對答紀實。",
      "其他經典的洞察。"
    ],
    "correctAnswer": 1,
    "explanation": "【主題與背景】本段選自《韓非子・十過》。系統論述韓非子法、術、勢融為一體的法家政治哲學。\\n【詞義與名物】「法」：公開頒布的法律制度；「術」：君主暗中操弄與考察臣下的權謀方法；「循名責實」：按官職名稱考核實際績效。\\n【思想與篇章】韓非子主張君主必須握緊刑罰與賞賜二柄，以法治國、以術御臣，防止權臣專...",
    "workId": "han-fei-zi",
    "chapterId": "han-fei-zi_ch-10",
    "passageId": "han-fei-zi_ch-10_p-1"
  },
  {
    "id": "q-248",
    "type": "analysis",
    "question": "針對以下段落，何者是最符合其思想或章旨的解析？\n「耿弇等與張步戰於臨淄，大破之。帝幸臨淄，進幸劇。張步斬蘇茂以降，齊地平。」",
    "options": [
      "本段選自史學名著《漢書・漢書卷六‧武帝紀第六》。記載重要歷史事件與君臣對答紀實。",
      "本段選自古代經典文獻。",
      "本段選自古代經典文獻。",
      "\\"
    ],
    "correctAnswer": 1,
    "explanation": "【主題與背景】本段選自古代經典文獻。\\n【詞義與名物】包含重要的歷史與哲學概念。\\n【思想與篇章】體現了古代思想家對政治、社會與人生的深刻思考。...",
    "workId": "hou-han-shu",
    "chapterId": "hou-han-shu_ch-1",
    "passageId": "hou-han-shu_ch-1_p-140"
  },
  {
    "id": "q-249",
    "type": "analysis",
    "question": "針對以下段落，何者是最符合其思想或章旨的解析？\n「文王將田，史編布卜，曰：「田於渭陽，將大得焉。非龍非螭，非虎非羆，兆得公侯。天遺汝師，以之佐昌，施及...」",
    "options": [
      "本段選自史學名著《漢書・漢書卷四十‧張陳王周傳第十》。記載重要歷史事件與君臣對答紀實。",
      "本段選自史學名著《漢書・漢書卷二十五上‧郊祀志第五上》。記載重要歷史事件與君臣對答紀實。",
      "這是本篇的核心精神。",
      "本段選自史學名著《漢書・漢書卷二十七下之上‧五行志第七下之上》。記載重要歷史事件與君臣對答紀實。"
    ],
    "correctAnswer": 2,
    "explanation": "【主題與背景】\\n本段選自《六韜》（太公兵法），以文韜、武韜、龍韜、虎韜、豹韜、犬韜六卷架構呈現上古軍事思想。\\n\\n【詞義與名物】\\n「文王將田，史編布」：太公問答中對治國安邦與臨陣應變的核心發問。\\n\\n【兵家戰略】\\n《六韜》強調全方位軍事準備，從政治全勝（文韜）、陣法裝備（龍虎韜）到特殊地形...",
    "workId": "liu-tao",
    "chapterId": "liu-tao_ch-1",
    "passageId": "liu-tao_ch-1_p-1"
  },
  {
    "id": "q-250",
    "type": "analysis",
    "question": "針對以下段落，何者是最符合其思想或章旨的解析？\n「今秦之地，方千里者五，而穀土不能處什二，田數不滿百萬，其藪澤谿谷名山大川之材物貨寶，又不盡為用，此人...」",
    "options": [
      "本段選自《商君書・徠民》。提出了吸引鄰國農民前來開墾秦國土地、加強本國農業戰略實力的策略。歷史上記錄了秦國實行法家變法、走向中央集權與帝國統一的理論與制度建構。",
      "本段選自史學名著《漢書・漢書卷二十八下‧地理志第八下》。記載重要歷史事件與君臣對答紀實。",
      "其他經典的洞察。",
      "本段選自史學名著《漢書・漢書卷九十八‧元后傳第六十八》。記載重要歷史事件與君臣對答紀實。"
    ],
    "correctAnswer": 0,
    "explanation": "【主題與背景】本段選自《商君書・徠民》。提出了吸引鄰國農民前來開墾秦國土地、加強本國農業戰略實力的策略。歷史上記錄了秦國實行法家變法、走向中央集權與帝國統一的理論與制度建構。\\n【詞義與名物】段落中涵括「徠民」相關關鍵名詞，如「法」、「信」、「權」、「耕戰」、「錯法」、「壹賞」等，體現秦國法律體系精...",
    "workId": "shang-jun-shu",
    "chapterId": "shang-jun-shu_ch-15",
    "passageId": "shang-jun-shu_ch-15_p-2"
  },
  {
    "id": "q-251",
    "type": "analysis",
    "question": "針對以下段落，何者是最符合其思想或章旨的解析？\n「魯之南鄙人，有吳慮者，冬陶夏耕，自比於舜。子墨子聞而見之。吳慮謂子墨子「義耳義耳，焉用言之哉？」子墨...」",
    "options": [
      "本段選自史學名著《漢書・漢書卷七十二‧王貢兩龔鮑傳第四十二》。記載重要歷史事件與君臣對答紀實。",
      "本段選自古代經典文獻。",
      "本段選自史學名著《漢書・漢書卷九十七上‧外戚傳第六十七上》。記載重要歷史事件與君臣對答紀實。",
      "本段選自史學名著《史記・卷五十八‧梁孝王世家第二十八》。記載重要歷史事件與君臣對答紀實。"
    ],
    "correctAnswer": 1,
    "explanation": "【主題與背景】本段選自古代經典文獻。\\n【詞義與名物】包含重要的歷史與哲學概念。\\n【思想與篇章】體現了古代思想家對政治、社會與人生的深刻思考。...",
    "workId": "mo-zi",
    "chapterId": "mo-zi_ch-49",
    "passageId": "mo-zi_ch-49_p-12"
  },
  {
    "id": "q-252",
    "type": "analysis",
    "question": "針對以下段落，何者是最符合其思想或章旨的解析？\n「溫之會，晉人執衛成公歸之于周。晉侯請殺之，王曰：「不可。夫政自上下者也，上作政，而下行之不逆，故上下...」",
    "options": [
      "本段選自史學名著《史記・卷三十九‧晉世家第九》。記載重要歷史事件與君臣對答紀實。",
      "本段選自古代經典文獻。",
      "本段選自史學名著《漢書・漢書卷九十六上‧西域傳第六十六上》。記載重要歷史事件與君臣對答紀實。",
      "本段選自史學名著《漢書・漢書卷九十九下‧王莽傳第六十九下》。記載重要歷史事件與君臣對答紀實。"
    ],
    "correctAnswer": 1,
    "explanation": "【主題與背景】本段選自古代經典文獻。\\n【詞義與名物】包含重要的歷史與哲學概念。\\n【思想與篇章】體現了古代思想家對政治、社會與人生的深刻思考。...",
    "workId": "guo-yu",
    "chapterId": "guo-yu_ch-2",
    "passageId": "guo-yu_ch-2_p-8"
  },
  {
    "id": "q-253",
    "type": "background",
    "question": "《韓非子》的作者或輯者是誰？",
    "options": [
      "韓非（韓國公子，荀子學生）",
      "趙曄（字長君，會稽山陰人）",
      "孟子（孟軻，鄒國人）及其弟子（萬章、公孫醜等）",
      "周室史官記錄，清朱右曾集訓校釋"
    ],
    "correctAnswer": 0,
    "explanation": "《韓非子》乃戰國末期法家大成者韓非之著作集，現存五十五篇。韓非師承荀子性惡論，針對戰國末期諸侯割據與變法需求，提出了「法、術、勢」三者不可偏廢的政治哲學。他主張「不期修古，不留今俗，論世之事，因為之備...",
    "workId": "han-fei-zi",
    "chapterId": "han-fei-zi_ch-1",
    "passageId": ""
  },
  {
    "id": "q-254",
    "type": "background",
    "question": "《戰國策》的作者或輯者是誰？",
    "options": [
      "趙曄（字長君，會稽山陰人）",
      "列禦寇（戰國鄭國人）及其弟子，魏晉張湛作注",
      "公羊高（齊國人，子夏弟子）傳述，西漢董仲舒發揚",
      "戰國縱橫家遊士記錄，西漢劉向輯錄校訂"
    ],
    "correctAnswer": 3,
    "explanation": "《戰國策》是記錄戰國時期列國政治、軍事與縱橫家遊士謀略言行的國別體史料彙編，原作者非一人，西漢劉向整理、校訂並定名。通行本依東周、西周、秦、齊、楚、趙、魏、韓、燕、宋、衛、中山十二國編排，共三十三卷；...",
    "workId": "zhan-guo-ce",
    "chapterId": "zhan-guo-ce_ch-1",
    "passageId": ""
  },
  {
    "id": "q-255",
    "type": "background",
    "question": "《文始真經》的作者或輯者是誰？",
    "options": [
      "西周至春秋民間採詩官及周室公卿創作，相傳孔子刪定",
      "荀悅（字仲豫，潁川陰陵人，東漢史學家、哲學家）",
      "關尹子（尹喜，春秋函谷關令，老子授《道德經》之人）",
      "文子（辛鈃，號計然，相傳老子親傳弟子）"
    ],
    "correctAnswer": 2,
    "explanation": "《文始真經》，原名《關尹子》，乃道家最高心法聖典之一。相傳為春秋末年函谷關令尹喜（關尹子）所著。尹喜曾迎老子於函谷關並獲授《道德經》，後潛心修道著書九篇（《一宇》、《二柱》、《三極》、《四符》、《五鑑...",
    "workId": "wenshi-zhenjing",
    "chapterId": "wenshi-zhenjing_ch-1",
    "passageId": ""
  },
  {
    "id": "q-256",
    "type": "background",
    "question": "《菜根譚》的成書時代為何？",
    "options": [
      "東漢時期（約公元1世紀）",
      "戰國至秦漢（約公元前3世紀）",
      "明代萬曆年間（約1600年前後）",
      "戰國中期（約公元前4世紀）"
    ],
    "correctAnswer": 2,
    "explanation": "《菜根譚》乃明代萬曆年間學者洪應明所著之處世格言集。書名取自宋代儒者汪信民「人能咬得菜根，則百事可做」之語，意在告誡世人甘於淡泊、咬得苦菜根方能體悟人生真諦。《菜根譚》將儒家的修身齊家、道家的清靜無為...",
    "workId": "cai-gen-tan",
    "chapterId": "cai-gen-tan_ch-1",
    "passageId": ""
  },
  {
    "id": "q-257",
    "type": "background",
    "question": "《春秋》的作者或輯者是誰？",
    "options": [
      "魯國國史，相傳孔子編修",
      "墨子（墨翟，春秋末戰國初魯國/宋國人）及其墨家學派",
      "上古伏羲畫卦、周文王作卦辭、周公作爻辭、孔子作《易傳》（十翼）",
      "孔子門人及其後學撰寫，西漢戴聖輯錄（小戴禮記）"
    ],
    "correctAnswer": 0,
    "explanation": "《春秋》乃中國現存最早之編年體史書，按魯隱公元年（公元前722年）至魯哀公十四年（公元前481年）的時間順序，簡要記載了春秋時期魯國及諸侯國之政治、軍事與外交大事。相傳孔子晚年根據魯國國史修訂《春秋》...",
    "workId": "chun-qiu",
    "chapterId": "chun-qiu_ch-1",
    "passageId": ""
  },
  {
    "id": "q-258",
    "type": "background",
    "question": "《後漢書》的成書時代為何？",
    "options": [
      "明代萬曆年間（約1600年前後）",
      "戰國中期（約公元前4世紀）",
      "戰國初期（約公元前4世紀）",
      "南朝宋時期（公元5世紀）"
    ],
    "correctAnswer": 3,
    "explanation": "《後漢書》乃南朝宋史學家範曄所著之紀傳體斷代史，記載自光武帝建武元年（25 年）至獻帝延康元年（220 年）共 195 年間之東漢歷史。《後漢書》全書包含本紀十卷、列傳八十卷（志三十卷由司馬彪補）。範...",
    "workId": "hou-han-shu",
    "chapterId": "hou-han-shu_ch-1",
    "passageId": ""
  },
  {
    "id": "q-259",
    "type": "background",
    "question": "《莊子》的成書時代為何？",
    "options": [
      "東漢時期（約公元1世紀）",
      "戰國中晚期（約公元前4世紀）",
      "西漢昭帝時期（公元前81年鹽鐵會議後，桓寬整理）",
      "漢魏魏晉時期（舊題西漢劉歆作，晉葛洪輯錄）"
    ],
    "correctAnswer": 1,
    "explanation": "《莊子》，又稱《南華真經》，乃戰國哲學家莊周及其後學所作。現存三十三篇，分為內篇七篇、外篇十五篇、雜篇十一篇。莊子繼承並發展了老子之道家哲學，將本體論之「道」昇華為個體生命之自由與精神超越。莊子善用無...",
    "workId": "zhuangzi",
    "chapterId": "zhuangzi_ch-1",
    "passageId": ""
  },
  {
    "id": "q-260",
    "type": "background",
    "question": "《詩經》的作者或輯者是誰？",
    "options": [
      "西周至春秋民間採詩官及周室公卿創作，相傳孔子刪定",
      "葛洪（字稚川，號抱朴子，東晉道學家、文人）",
      "舊題黃石公授張良，實乃秦漢之際兵家所著",
      "魯國國史，相傳孔子編修"
    ],
    "correctAnswer": 0,
    "explanation": "《詩經》乃中國第一部詩歌總集，共收錄自西周初年至春秋中期詩歌 305 篇（另有笙詩 6 篇），故又稱「詩三百」。全書按音樂曲調分為《風》（十五國風）、《雅》（大雅、小雅）、《頌》（周頌、魯頌、商頌）三...",
    "workId": "shi-jing",
    "chapterId": "shi-jing_ch-1",
    "passageId": ""
  },
  {
    "id": "q-261",
    "type": "background",
    "question": "《越絕書》的作者或輯者是誰？",
    "options": [
      "齊國司馬穰苴遺說，齊威王時整理",
      "袁康、吳平輯錄",
      "吳起（衛國左氏人，曾任魏國、楚國將領）",
      "西周至春秋民間採詩官及周室公卿創作，相傳孔子刪定"
    ],
    "correctAnswer": 1,
    "explanation": "《越絕書》乃東漢時期袁康、吳平所輯錄之地方歷史地理著作，共十五卷。《越絕書》主要記載春秋末期越國之歷史、地理、城郭建造、兵器製造（如歐冶子鑄名劍）以及吳越兩國之恩怨。《越絕書》被學界尊為中國地方誌之鼻...",
    "workId": "yue-jue-shu",
    "chapterId": "yue-jue-shu_ch-1",
    "passageId": ""
  },
  {
    "id": "q-262",
    "type": "background",
    "question": "《後漢書》的作者或輯者是誰？",
    "options": [
      "左丘明（魯國太史）",
      "範曄（字蔚宗，順陽人，南朝宋史學家）",
      "尉繚（魏國人，秦國國尉）",
      "葛洪（字稚川，號抱朴子，東晉道學家、文人）"
    ],
    "correctAnswer": 1,
    "explanation": "《後漢書》乃南朝宋史學家範曄所著之紀傳體斷代史，記載自光武帝建武元年（25 年）至獻帝延康元年（220 年）共 195 年間之東漢歷史。《後漢書》全書包含本紀十卷、列傳八十卷（志三十卷由司馬彪補）。範...",
    "workId": "hou-han-shu",
    "chapterId": "hou-han-shu_ch-1",
    "passageId": ""
  },
  {
    "id": "q-263",
    "type": "background",
    "question": "《易經》的成書時代為何？",
    "options": [
      "舊題伏羲神農黃帝時代，宋代輯本",
      "東漢時期（約公元1世紀）",
      "上古至西周（卦爻辭）、戰國至秦漢（易傳）",
      "漢魏魏晉時期（舊題西漢劉歆作，晉葛洪輯錄）"
    ],
    "correctAnswer": 2,
    "explanation": "《周易》，簡稱《易經》，乃中國古代最古老深邃之哲學典籍，被譽為「羣經之首，大道之源」。全書由《經》（六十四卦卦爻辭）與《傳》（《易傳》十翼）兩部分組成。《易經》以陰爻（--）與陽爻（—）之交錯組合，模...",
    "workId": "yi-jing",
    "chapterId": "yi-jing_ch-1",
    "passageId": ""
  },
  {
    "id": "q-264",
    "type": "background",
    "question": "《漢書》的作者或輯者是誰？",
    "options": [
      "桓寬（字次公，西漢汝南人）",
      "戰國縱橫家遊士記錄，西漢劉向輯錄校訂",
      "班固（字孟堅，扶風安陵人）及其父班彪、妹班昭、馬續",
      "孔子門人及其後學撰寫，西漢戴聖輯錄（小戴禮記）"
    ],
    "correctAnswer": 2,
    "explanation": "《漢書》，又稱《前漢書》，乃東漢著名史學家班固所著，歷時二十餘年完成（未竟部分由妹班昭及馬續補寫），全書共一百卷，記載了自漢高祖元年（前 206 年）至王莽地皇四年（公元 23 年）共 230 年間之...",
    "workId": "han-shu",
    "chapterId": "han-shu_ch-1",
    "passageId": ""
  },
  {
    "id": "q-265",
    "type": "background",
    "question": "《列子》的成書時代為何？",
    "options": [
      "春秋時期（公元前722年至前481年）",
      "戰國中期（約公元前4世紀）",
      "東漢時期（約公元1世紀）",
      "戰國時期至魏晉（唐代尊為《沖虛真經》）"
    ],
    "correctAnswer": 3,
    "explanation": "《列子》，又稱《沖虛至德真經》，乃戰國時期道家代表人物列禦寇之著作集，現存八篇（《天瑞》、《黃帝》、《周穆王》、《仲尼》、《湯問》、《力命》、《楊朱》、《說符》）。《列子》思想繼承老莊，主張順應自然、...",
    "workId": "liezi",
    "chapterId": "liezi_ch-1",
    "passageId": ""
  },
  {
    "id": "q-266",
    "type": "background",
    "question": "《國語》的作者或輯者是誰？",
    "options": [
      "李斯（楚國上蔡人，秦國客卿、後任丞相）",
      "荀況（戰國時期趙國人，著名思想家、文學家、政治家）",
      "相傳為魯國太史左丘明撰寫",
      "劉向（字子政，西漢宗室學者）"
    ],
    "correctAnswer": 2,
    "explanation": "《國語》乃中國第一部國別體史書，共二十一卷。全書按國別分為《周語》、《魯語》、《齊語》、《晉語》、《鄭語》、《楚語》、《吳語》、《越語》，主要記錄春秋時期（前 990 年至前 453 年）八國貴族之重...",
    "workId": "guo-yu",
    "chapterId": "guo-yu_ch-1",
    "passageId": ""
  },
  {
    "id": "q-267",
    "type": "background",
    "question": "《詩經》的成書時代為何？",
    "options": [
      "戰國中期（約公元前4世紀）",
      "上古至戰國（記錄堯舜至春秋時期史事）",
      "春秋末期（約公元前500年前後）",
      "西周初期至春秋中期（公元前11世紀至前6世紀）"
    ],
    "correctAnswer": 3,
    "explanation": "《詩經》乃中國第一部詩歌總集，共收錄自西周初年至春秋中期詩歌 305 篇（另有笙詩 6 篇），故又稱「詩三百」。全書按音樂曲調分為《風》（十五國風）、《雅》（大雅、小雅）、《頌》（周頌、魯頌、商頌）三...",
    "workId": "shi-jing",
    "chapterId": "shi-jing_ch-1",
    "passageId": ""
  },
  {
    "id": "q-268",
    "type": "background",
    "question": "《春秋左傳》的成書時代為何？",
    "options": [
      "戰國末期",
      "上古至戰國（記錄堯舜至春秋時期史事）",
      "戰國初期（約公元前4世紀）",
      "春秋戰國時期（約公元前5世紀至前4世紀）"
    ],
    "correctAnswer": 2,
    "explanation": "《春秋左氏傳》，簡稱《左傳》，乃戰國初期魯國太史左丘明配合《春秋》經文所作之編年體史書。《左傳》極大地擴充了《春秋》簡短經文，詳細記錄了春秋時期二百五十餘年間各諸侯國之政治、軍事、外交與外交論辯大事件...",
    "workId": "chun-qiu-zuo-zhuan",
    "chapterId": "chun-qiu-zuo-zhuan_ch-1",
    "passageId": ""
  },
  {
    "id": "q-269",
    "type": "background",
    "question": "《越絕書》的作者或輯者是誰？",
    "options": [
      "戰國文人據西周傳說輯撰，西晉荀勖、郭璞作注",
      "袁康、吳平輯錄",
      "桓寬（字次公，西漢汝南人）",
      "李斯（楚國上蔡人，秦國客卿、後任丞相）"
    ],
    "correctAnswer": 1,
    "explanation": "《越絕書》乃東漢時期袁康、吳平所輯錄之地方歷史地理著作，共十五卷。《越絕書》主要記載春秋末期越國之歷史、地理、城郭建造、兵器製造（如歐冶子鑄名劍）以及吳越兩國之恩怨。《越絕書》被學界尊為中國地方誌之鼻...",
    "workId": "yue-jue-shu",
    "chapterId": "yue-jue-shu_ch-1",
    "passageId": ""
  },
  {
    "id": "q-270",
    "type": "background",
    "question": "《菜根譚》的成書時代為何？",
    "options": [
      "戰國時期至魏晉（唐代尊為《沖虛真經》）",
      "明代萬曆年間（約1600年前後）",
      "春秋時期（公元前722年至前481年）",
      "春秋末期（約公元前500年前後）"
    ],
    "correctAnswer": 1,
    "explanation": "《菜根譚》乃明代萬曆年間學者洪應明所著之處世格言集。書名取自宋代儒者汪信民「人能咬得菜根，則百事可做」之語，意在告誡世人甘於淡泊、咬得苦菜根方能體悟人生真諦。《菜根譚》將儒家的修身齊家、道家的清靜無為...",
    "workId": "cai-gen-tan",
    "chapterId": "cai-gen-tan_ch-1",
    "passageId": ""
  },
  {
    "id": "q-271",
    "type": "background",
    "question": "《文始真經》的作者或輯者是誰？",
    "options": [
      "洪應明（字自誠，號還初道人，明代學者）",
      "關尹子（尹喜，春秋函谷關令，老子授《道德經》之人）",
      "西周至春秋民間採詩官及周室公卿創作，相傳孔子刪定",
      "舊題管仲（管夷吾，齊國名相）作，實乃齊國稷下學者與齊法家著作彙編"
    ],
    "correctAnswer": 1,
    "explanation": "《文始真經》，原名《關尹子》，乃道家最高心法聖典之一。相傳為春秋末年函谷關令尹喜（關尹子）所著。尹喜曾迎老子於函谷關並獲授《道德經》，後潛心修道著書九篇（《一宇》、《二柱》、《三極》、《四符》、《五鑑...",
    "workId": "wenshi-zhenjing",
    "chapterId": "wenshi-zhenjing_ch-1",
    "passageId": ""
  },
  {
    "id": "q-272",
    "type": "background",
    "question": "《吳越春秋》的作者或輯者是誰？",
    "options": [
      "劉向（字子政，西漢宗室學者）",
      "齊國後人輯錄晏嬰（晏子）言行",
      "趙曄（字長君，會稽山陰人）",
      "東漢官修史官團隊（劉珍、班昭、蔡邕、楊厚等）"
    ],
    "correctAnswer": 2,
    "explanation": "《吳越春秋》乃東漢學者趙曄所著之歷史演義散文集，現存十卷。《吳越春秋》以春秋末年吳越兩國興衰爭霸為背景，詳細記述了伍子胥奔吳復仇、吳王闔閭稱霸、夫差勝越、勾踐臥薪嚐膽以及范蠡、文種滅吳等驚心動魄之歷史...",
    "workId": "wu-yue-chun-qiu",
    "chapterId": "wu-yue-chun-qiu_ch-1",
    "passageId": ""
  },
  {
    "id": "q-273",
    "type": "background",
    "question": "《中庸》的作者或輯者是誰？",
    "options": [
      "韓非（韓國公子，荀子學生）",
      "子思（孔伋，孔子之孫）",
      "戰國文人據西周傳說輯撰，西晉荀勖、郭璞作注",
      "商鞅（衛鞅、公孫鞅）及其法家學派後學"
    ],
    "correctAnswer": 1,
    "explanation": "《中庸》原為《禮記》第三十一篇，相傳為孔子之孫子思所作，後由朱熹輯錄為「四書」之一。《中庸》乃儒家最高精神心法與哲學本體論著作。「中」者，不偏不倚、無過不及；「庸」者，定理常道。全書開篇提出「天命之謂...",
    "workId": "zhong-yong",
    "chapterId": "zhong-yong_ch-1",
    "passageId": ""
  },
  {
    "id": "q-274",
    "type": "background",
    "question": "《吳越春秋》的成書時代為何？",
    "options": [
      "西漢時期（約公元前1世紀）",
      "春秋戰國時期",
      "戰國時期（約公元前5世紀至前3世紀）",
      "東漢時期（約公元1世紀）"
    ],
    "correctAnswer": 3,
    "explanation": "《吳越春秋》乃東漢學者趙曄所著之歷史演義散文集，現存十卷。《吳越春秋》以春秋末年吳越兩國興衰爭霸為背景，詳細記述了伍子胥奔吳復仇、吳王闔閭稱霸、夫差勝越、勾踐臥薪嚐膽以及范蠡、文種滅吳等驚心動魄之歷史...",
    "workId": "wu-yue-chun-qiu",
    "chapterId": "wu-yue-chun-qiu_ch-1",
    "passageId": ""
  },
  {
    "id": "q-275",
    "type": "background",
    "question": "《韓非子》的作者或輯者是誰？",
    "options": [
      "範曄（字蔚宗，順陽人，南朝宋史學家）",
      "韓非（韓國公子，荀子學生）",
      "舊題管仲（管夷吾，齊國名相）作，實乃齊國稷下學者與齊法家著作彙編",
      "孟子（孟軻，鄒國人）及其弟子（萬章、公孫醜等）"
    ],
    "correctAnswer": 1,
    "explanation": "《韓非子》乃戰國末期法家大成者韓非之著作集，現存五十五篇。韓非師承荀子性惡論，針對戰國末期諸侯割據與變法需求，提出了「法、術、勢」三者不可偏廢的政治哲學。他主張「不期修古，不留今俗，論世之事，因為之備...",
    "workId": "han-fei-zi",
    "chapterId": "han-fei-zi_ch-1",
    "passageId": ""
  },
  {
    "id": "q-276",
    "type": "background",
    "question": "《韓非子》的成書時代為何？",
    "options": [
      "戰國至西漢（約公元前2世紀）",
      "戰國末期（約公元前3世紀）",
      "戰國時期至魏晉（唐代尊為《沖虛真經》）",
      "戰國時期（西晉汲塚出土竹書之一）"
    ],
    "correctAnswer": 1,
    "explanation": "《韓非子》乃戰國末期法家大成者韓非之著作集，現存五十五篇。韓非師承荀子性惡論，針對戰國末期諸侯割據與變法需求，提出了「法、術、勢」三者不可偏廢的政治哲學。他主張「不期修古，不留今俗，論世之事，因為之備...",
    "workId": "han-fei-zi",
    "chapterId": "han-fei-zi_ch-1",
    "passageId": ""
  },
  {
    "id": "q-277",
    "type": "background",
    "question": "《越絕書》的成書時代為何？",
    "options": [
      "西漢漢武帝時期（約公元前109年至前91年）",
      "東漢時期（約公元1世紀）",
      "戰國至西漢（約公元前2世紀）",
      "戰國末期至漢代"
    ],
    "correctAnswer": 1,
    "explanation": "《越絕書》乃東漢時期袁康、吳平所輯錄之地方歷史地理著作，共十五卷。《越絕書》主要記載春秋末期越國之歷史、地理、城郭建造、兵器製造（如歐冶子鑄名劍）以及吳越兩國之恩怨。《越絕書》被學界尊為中國地方誌之鼻...",
    "workId": "yue-jue-shu",
    "chapterId": "yue-jue-shu_ch-1",
    "passageId": ""
  },
  {
    "id": "q-278",
    "type": "background",
    "question": "《吳子》的作者或輯者是誰？",
    "options": [
      "荀悅（字仲豫，潁川陰陵人，東漢史學家、哲學家）",
      "戰國文人據西周傳說輯撰，西晉荀勖、郭璞作注",
      "洪應明（字自誠，號還初道人，明代學者）",
      "吳起（衛國左氏人，曾任魏國、楚國將領）"
    ],
    "correctAnswer": 3,
    "explanation": "《吳子》，又稱《吳子兵法》，乃戰國初期傑出軍事家、政治家吳起所作，現存六篇（《圖國》、《料敵》、《治兵》、《論將》、《應變》、《勵士》）。吳起曾相魏、相楚，戰功赫赫。《吳子》強調政治文德與軍事武備不可...",
    "workId": "wu-zi",
    "chapterId": "wu-zi_ch-1",
    "passageId": ""
  },
  {
    "id": "q-279",
    "type": "background",
    "question": "《前漢紀》的作者或輯者是誰？",
    "options": [
      "孔子（孔丘）及其弟子與再傳弟子",
      "文子（辛鈃，號計然，相傳老子親傳弟子）",
      "荀悅（字仲豫，潁川陰陵人，東漢史學家、哲學家）",
      "西周至春秋民間採詩官及周室公卿創作，相傳孔子刪定"
    ],
    "correctAnswer": 2,
    "explanation": "《前漢紀》，又稱《漢紀》，乃東漢末年學者荀悅受漢獻帝之命所撰寫之編年體西漢史，共三十卷。《前漢紀》將班固《漢書》繁複之紀傳體材料，依據年份編年重輯，語言簡要清通，剪裁得當。《前漢紀》附有荀悅個人之精闢...",
    "workId": "qian-han-ji",
    "chapterId": "qian-han-ji_ch-1",
    "passageId": ""
  },
  {
    "id": "q-280",
    "type": "background",
    "question": "《三略》的作者或輯者是誰？",
    "options": [
      "魯國國史，相傳孔子編修",
      "舊題黃石公授張良，實乃秦漢之際兵家所著",
      "趙曄（字長君，會稽山陰人）",
      "穀梁赤（魯國人，子夏弟子）傳述"
    ],
    "correctAnswer": 1,
    "explanation": "《三略》，又稱《黃石公三略》，乃武經七書之一，分為《上略》、《中略》、《下略》三卷。相傳為圯上老人黃石公授予張良之兵書。《三略》融匯了兵家、道家與儒家思想，重點探討國家政治統治、收拾人心、招攬人才與戰...",
    "workId": "three-strategies",
    "chapterId": "three-strategies_ch-1",
    "passageId": ""
  },
  {
    "id": "q-281",
    "type": "background",
    "question": "《東觀漢記》的成書時代為何？",
    "options": [
      "春秋戰國時期（約公元前5世紀至前4世紀）",
      "戰國時期至魏晉（唐代尊為《沖虛真經》）",
      "東漢時期（約公元1世紀）",
      "東漢官修（公元1世紀至2世紀，經劉珍、班昭、蔡邕等數代人接力）"
    ],
    "correctAnswer": 3,
    "explanation": "《東觀漢記》乃東漢王朝於首都洛陽宮東觀皇家圖書館組織歷代名儒（包含班昭、蔡邕、劉珍等）官修之當代紀傳體史書。在魏晉南北朝時期，《東觀漢記》與《史記》、《漢書》並稱為「三史」。原書原有一百四十三卷，後大...",
    "workId": "dong-guan-han-ji",
    "chapterId": "dong-guan-han-ji_ch-1",
    "passageId": ""
  },
  {
    "id": "q-282",
    "type": "background",
    "question": "《詩經》的成書時代為何？",
    "options": [
      "戰國魏國（公元前3世紀魏襄王墓出土）",
      "西周初期至春秋中期（公元前11世紀至前6世紀）",
      "戰國初期（約公元前4世紀）",
      "舊題伏羲神農黃帝時代，宋代輯本"
    ],
    "correctAnswer": 1,
    "explanation": "《詩經》乃中國第一部詩歌總集，共收錄自西周初年至春秋中期詩歌 305 篇（另有笙詩 6 篇），故又稱「詩三百」。全書按音樂曲調分為《風》（十五國風）、《雅》（大雅、小雅）、《頌》（周頌、魯頌、商頌）三...",
    "workId": "shi-jing",
    "chapterId": "shi-jing_ch-1",
    "passageId": ""
  },
  {
    "id": "q-283",
    "type": "background",
    "question": "《春秋》的成書時代為何？",
    "options": [
      "西周初期至春秋中期（公元前11世紀至前6世紀）",
      "西漢昭帝時期（公元前81年鹽鐵會議後，桓寬整理）",
      "春秋時期（公元前722年至前481年）",
      "戰國時期（西晉汲塚出土竹書之一）"
    ],
    "correctAnswer": 2,
    "explanation": "《春秋》乃中國現存最早之編年體史書，按魯隱公元年（公元前722年）至魯哀公十四年（公元前481年）的時間順序，簡要記載了春秋時期魯國及諸侯國之政治、軍事與外交大事。相傳孔子晚年根據魯國國史修訂《春秋》...",
    "workId": "chun-qiu",
    "chapterId": "chun-qiu_ch-1",
    "passageId": ""
  },
  {
    "id": "q-284",
    "type": "background",
    "question": "《墨子》的成書時代為何？",
    "options": [
      "春秋戰國時期（約公元前5世紀至前4世紀）",
      "戰國末年至西漢（西漢劉向整理編訂）",
      "戰國時期（約公元前5世紀至前3世紀）",
      "秦王政十年（公元前237年）"
    ],
    "correctAnswer": 2,
    "explanation": "《墨子》是墨家學派著作的總集。《漢書・藝文志》著錄七十一篇，今存五十三篇，其餘十八篇亡佚；現存篇章涵蓋墨家十論、墨辯、言行記錄與守城技術。墨子創立墨家，與儒家並稱戰國時期的「顯學」。《墨子》提出「兼愛...",
    "workId": "mo-zi",
    "chapterId": "mo-zi_ch-1",
    "passageId": ""
  },
  {
    "id": "q-285",
    "type": "background",
    "question": "《菜根譚》的成書時代為何？",
    "options": [
      "明代萬曆年間（約1600年前後）",
      "東漢時期（約公元1世紀）",
      "東漢末年（公元200年前後）",
      "東漢官修（公元1世紀至2世紀，經劉珍、班昭、蔡邕等數代人接力）"
    ],
    "correctAnswer": 0,
    "explanation": "《菜根譚》乃明代萬曆年間學者洪應明所著之處世格言集。書名取自宋代儒者汪信民「人能咬得菜根，則百事可做」之語，意在告誡世人甘於淡泊、咬得苦菜根方能體悟人生真諦。《菜根譚》將儒家的修身齊家、道家的清靜無為...",
    "workId": "cai-gen-tan",
    "chapterId": "cai-gen-tan_ch-1",
    "passageId": ""
  },
  {
    "id": "q-286",
    "type": "background",
    "question": "《慎子》的成書時代為何？",
    "options": [
      "東漢時期（約公元1世紀）",
      "戰國中期（約公元前4世紀）",
      "西周初期至春秋中期（公元前11世紀至前6世紀）",
      "戰國時期至魏晉（唐代尊為《沖虛真經》）"
    ],
    "correctAnswer": 1,
    "explanation": "《慎子》乃戰國時期稷下學者慎到之著作，《漢書·藝文志》著錄四十二篇，今存《威德》、《因循》、《民雜》、《德立》、《君人》等七篇輯本。慎到早年學黃老道家，後轉為法家。他提出了法家著名的「勢」論（權勢、位...",
    "workId": "shenzi",
    "chapterId": "shenzi_ch-1",
    "passageId": ""
  },
  {
    "id": "q-287",
    "type": "background",
    "question": "《管子》的作者或輯者是誰？",
    "options": [
      "相傳為魯國太史左丘明撰寫",
      "關尹子（尹喜，春秋函谷關令，老子授《道德經》之人）",
      "舊題管仲（管夷吾，齊國名相）作，實乃齊國稷下學者與齊法家著作彙編",
      "班固（字孟堅，扶風安陵人）及其父班彪、妹班昭、馬續"
    ],
    "correctAnswer": 2,
    "explanation": "《管子》乃託名春秋齊國名相管仲之著作集，由西漢劉向編定為七十六篇。《管子》內容極其豐富博大，融合了道家之自然論、法家之法治、儒家之禮教與獨樹一幟之「輕重學」（經濟貨幣學）。提出了著名的「倉廩實而知禮節...",
    "workId": "guanzi",
    "chapterId": "guanzi_ch-1",
    "passageId": ""
  },
  {
    "id": "q-288",
    "type": "background",
    "question": "《韓非子》的成書時代為何？",
    "options": [
      "戰國時期至漢代（唐代尊為《通玄真經》）",
      "戰國初期（約公元前4世紀）",
      "戰國末年至西漢（西漢劉向整理編訂）",
      "戰國末期（約公元前3世紀）"
    ],
    "correctAnswer": 3,
    "explanation": "《韓非子》乃戰國末期法家大成者韓非之著作集，現存五十五篇。韓非師承荀子性惡論，針對戰國末期諸侯割據與變法需求，提出了「法、術、勢」三者不可偏廢的政治哲學。他主張「不期修古，不留今俗，論世之事，因為之備...",
    "workId": "han-fei-zi",
    "chapterId": "han-fei-zi_ch-1",
    "passageId": ""
  },
  {
    "id": "q-289",
    "type": "background",
    "question": "《文子》的作者或輯者是誰？",
    "options": [
      "文子（辛鈃，號計然，相傳老子親傳弟子）",
      "公羊高（齊國人，子夏弟子）傳述，西漢董仲舒發揚",
      "舊題黃石公授張良，實乃秦漢之際兵家所著",
      "範曄（字蔚宗，順陽人，南朝宋史學家）"
    ],
    "correctAnswer": 0,
    "explanation": "《文子》，唐代尊稱為《通玄真經》，乃先秦道家核心典籍之一，相傳為老子弟子文子（辛鈃）問道於老子後所著，現存十二篇。長期以來學界曾懷疑其為漢代抄襲之書，但隨著 1973 年河北定州漢墓及海昏侯墓出土《文...",
    "workId": "wenzi",
    "chapterId": "wenzi_ch-1",
    "passageId": ""
  },
  {
    "id": "q-290",
    "type": "background",
    "question": "《六韜》的作者或輯者是誰？",
    "options": [
      "孟子（孟軻，鄒國人）及其弟子（萬章、公孫醜等）",
      "子思（孔伋，孔子之孫）",
      "戰國文人據西周傳說輯撰，西晉荀勖、郭璞作注",
      "舊題周初太公望（呂尚、姜子牙）作，實戰國兵家輯錄"
    ],
    "correctAnswer": 3,
    "explanation": "《六韜》，又稱《太公兵法》，乃武經七書之一。全書以周文王、周武王與太公望（姜子牙）對答的形式，分為《文韜》、《武韜》、《龍韜》、《虎韜》、《豹韜》、《犬韜》六卷。《六韜》提出了「天下非一人之天下，乃天...",
    "workId": "liu-tao",
    "chapterId": "liu-tao_ch-1",
    "passageId": ""
  },
  {
    "id": "q-291",
    "type": "background",
    "question": "《東觀漢記》的成書時代為何？",
    "options": [
      "東漢官修（公元1世紀至2世紀，經劉珍、班昭、蔡邕等數代人接力）",
      "漢魏魏晉時期（舊題西漢劉歆作，晉葛洪輯錄）",
      "戰國時期（約公元前5世紀至前3世紀）",
      "東漢時期（約公元1世紀）"
    ],
    "correctAnswer": 0,
    "explanation": "《東觀漢記》乃東漢王朝於首都洛陽宮東觀皇家圖書館組織歷代名儒（包含班昭、蔡邕、劉珍等）官修之當代紀傳體史書。在魏晉南北朝時期，《東觀漢記》與《史記》、《漢書》並稱為「三史」。原書原有一百四十三卷，後大...",
    "workId": "dong-guan-han-ji",
    "chapterId": "dong-guan-han-ji_ch-1",
    "passageId": ""
  },
  {
    "id": "q-292",
    "type": "background",
    "question": "《竹書紀年》的成書時代為何？",
    "options": [
      "春秋末年至戰國初期（約公元前5世紀）",
      "戰國末期（秦王政時期）",
      "戰國魏國（公元前3世紀魏襄王墓出土）",
      "戰國中晚期（約公元前4世紀）"
    ],
    "correctAnswer": 2,
    "explanation": "《竹書紀年》，又稱《汲塚紀年》，乃西晉太康二年（281 年）於汲郡（今河南衛輝）魏襄王墓出土之先秦魏國編年體國史。該書記錄自夏朝、商朝、西周至戰國魏國之歷史大事件。《竹書紀年》完全未受秦始皇焚書與漢代...",
    "workId": "zhushu-jinian",
    "chapterId": "zhushu-jinian_ch-1",
    "passageId": ""
  },
  {
    "id": "q-293",
    "type": "background",
    "question": "《商君書》的作者或輯者是誰？",
    "options": [
      "舊題三皇作，宋代毛漸輯得傳世",
      "商鞅（衛鞅、公孫鞅）及其法家學派後學",
      "舊題曾子傳述，宋代朱熹認定為孔子門人曾子作經、門人記傳",
      "關尹子（尹喜，春秋函谷關令，老子授《道德經》之人）"
    ],
    "correctAnswer": 1,
    "explanation": "《商君書》，又稱《商君》，乃戰國時期秦國宰相商鞅及其法家後學言論與政策的彙編。通行本列二十六篇，其中〈刑約〉、〈御盜〉有目無文，實存二十四篇。本書的核心思想為「更法變革」、「農戰結合」與「法治嚴刑」。...",
    "workId": "shang-jun-shu",
    "chapterId": "shang-jun-shu_ch-1",
    "passageId": ""
  },
  {
    "id": "q-294",
    "type": "background",
    "question": "《莊子》的成書時代為何？",
    "options": [
      "戰國至秦漢（約公元前3世紀）",
      "戰國中晚期（約公元前4世紀）",
      "戰國時期至魏晉（唐代尊為《文始真經》）",
      "春秋戰國時期"
    ],
    "correctAnswer": 1,
    "explanation": "《莊子》，又稱《南華真經》，乃戰國哲學家莊周及其後學所作。現存三十三篇，分為內篇七篇、外篇十五篇、雜篇十一篇。莊子繼承並發展了老子之道家哲學，將本體論之「道」昇華為個體生命之自由與精神超越。莊子善用無...",
    "workId": "zhuangzi",
    "chapterId": "zhuangzi_ch-1",
    "passageId": ""
  },
  {
    "id": "q-295",
    "type": "background",
    "question": "《穆天子傳》的成書時代為何？",
    "options": [
      "戰國時期（西晉汲塚出土竹書之一）",
      "戰國末期至西漢",
      "東漢時期（公元1世紀，歷時20餘年完成）",
      "戰國時期（約公元前4世紀）"
    ],
    "correctAnswer": 0,
    "explanation": "《穆天子傳》，原名《周王遊行記》，乃西晉汲塚出土竹書之一，共六卷。本書以編年體形式，詳細記載了西周第五代君主周穆王（姬滿）率領軍隊、乘坐「八駿」神馬，從鎬京出發向西北遠徵西巡數萬裡之傳奇經歷。書中最為...",
    "workId": "mutianzi-zhuan",
    "chapterId": "mutianzi-zhuan_ch-1",
    "passageId": ""
  },
  {
    "id": "q-296",
    "type": "background",
    "question": "《商君書》的成書時代為何？",
    "options": [
      "東漢官修（公元1世紀至2世紀，經劉珍、班昭、蔡邕等數代人接力）",
      "戰國中期（約公元前4世紀）",
      "西漢時期（約公元前1世紀）",
      "戰國末期（約公元前3世紀）"
    ],
    "correctAnswer": 1,
    "explanation": "《商君書》，又稱《商君》，乃戰國時期秦國宰相商鞅及其法家後學言論與政策的彙編。通行本列二十六篇，其中〈刑約〉、〈御盜〉有目無文，實存二十四篇。本書的核心思想為「更法變革」、「農戰結合」與「法治嚴刑」。...",
    "workId": "shang-jun-shu",
    "chapterId": "shang-jun-shu_ch-1",
    "passageId": ""
  },
  {
    "id": "q-297",
    "type": "background",
    "question": "《逸周書》的作者或輯者是誰？",
    "options": [
      "舊題三皇作，宋代毛漸輯得傳世",
      "周室史官記錄，清朱右曾集訓校釋",
      "子思（孔伋，孔子之孫）",
      "孔子門人及其後學撰寫，西漢戴聖輯錄（小戴禮記）"
    ],
    "correctAnswer": 1,
    "explanation": "《逸周書》，原名《周書》或《汲塚周書》，乃記載周代（尤其是西周初年）史事、典章制度與政治訓誨之歷史文獻總集。西晉時期於魏襄王墓（汲塚）出土，全書凡七十篇（其中五十九篇存世，十一篇存目）。《逸周書》包含...",
    "workId": "lost-book-of-zhou",
    "chapterId": "lost-book-of-zhou_ch-1",
    "passageId": ""
  },
  {
    "id": "q-298",
    "type": "background",
    "question": "《列子》的成書時代為何？",
    "options": [
      "東漢時期（公元1世紀，歷時20餘年完成）",
      "戰國至西漢（約公元前2世紀）",
      "春秋末期（約公元前500年前後）",
      "戰國時期至魏晉（唐代尊為《沖虛真經》）"
    ],
    "correctAnswer": 3,
    "explanation": "《列子》，又稱《沖虛至德真經》，乃戰國時期道家代表人物列禦寇之著作集，現存八篇（《天瑞》、《黃帝》、《周穆王》、《仲尼》、《湯問》、《力命》、《楊朱》、《說符》）。《列子》思想繼承老莊，主張順應自然、...",
    "workId": "liezi",
    "chapterId": "liezi_ch-1",
    "passageId": ""
  },
  {
    "id": "q-299",
    "type": "background",
    "question": "《列子》的作者或輯者是誰？",
    "options": [
      "列禦寇（戰國鄭國人）及其弟子，魏晉張湛作注",
      "清代紹興文人吳楚材、吳調侯叔姪",
      "舊題周初太公望（呂尚、姜子牙）作，實戰國兵家輯錄",
      "公羊高（齊國人，子夏弟子）傳述，西漢董仲舒發揚"
    ],
    "correctAnswer": 0,
    "explanation": "《列子》，又稱《沖虛至德真經》，乃戰國時期道家代表人物列禦寇之著作集，現存八篇（《天瑞》、《黃帝》、《周穆王》、《仲尼》、《湯問》、《力命》、《楊朱》、《說符》）。《列子》思想繼承老莊，主張順應自然、...",
    "workId": "liezi",
    "chapterId": "liezi_ch-1",
    "passageId": ""
  },
  {
    "id": "q-300",
    "type": "background",
    "question": "《大學》的成書時代為何？",
    "options": [
      "戰國時期至魏晉（唐代尊為《沖虛真經》）",
      "戰國至秦漢（約公元前3世紀）",
      "戰國時期至漢代（唐代尊為《通玄真經》）",
      "春秋戰國時期"
    ],
    "correctAnswer": 1,
    "explanation": "《大學》原為《禮記》第四十二篇，宋代程顥、程頤與朱熹將其從《禮記》中抽出，與《中庸》、《論語》、《孟子》合編為「四書」，成為科舉與儒學修養之核心經典。《大學》篇幅簡短，卻高度概括了儒家之修養與政治哲學...",
    "workId": "da-xue",
    "chapterId": "da-xue_ch-1",
    "passageId": ""
  },
  {
    "id": "q-301",
    "type": "background",
    "question": "《中庸》的成書時代為何？",
    "options": [
      "東漢時期（公元1世紀，歷時20餘年完成）",
      "戰國至西漢（約公元前2世紀）",
      "西周初期至春秋中期（公元前11世紀至前6世紀）",
      "戰國時期（約公元前5世紀）"
    ],
    "correctAnswer": 3,
    "explanation": "《中庸》原為《禮記》第三十一篇，相傳為孔子之孫子思所作，後由朱熹輯錄為「四書」之一。《中庸》乃儒家最高精神心法與哲學本體論著作。「中」者，不偏不倚、無過不及；「庸」者，定理常道。全書開篇提出「天命之謂...",
    "workId": "zhong-yong",
    "chapterId": "zhong-yong_ch-1",
    "passageId": ""
  },
  {
    "id": "q-302",
    "type": "background",
    "question": "《易經》的作者或輯者是誰？",
    "options": [
      "上古伏羲畫卦、周文王作卦辭、周公作爻辭、孔子作《易傳》（十翼）",
      "李斯（楚國上蔡人，秦國客卿、後任丞相）",
      "上古史官記錄，相傳孔子輯定",
      "周室史官記錄，清朱右曾集訓校釋"
    ],
    "correctAnswer": 0,
    "explanation": "《周易》，簡稱《易經》，乃中國古代最古老深邃之哲學典籍，被譽為「羣經之首，大道之源」。全書由《經》（六十四卦卦爻辭）與《傳》（《易傳》十翼）兩部分組成。《易經》以陰爻（--）與陽爻（—）之交錯組合，模...",
    "workId": "yi-jing",
    "chapterId": "yi-jing_ch-1",
    "passageId": ""
  },
  {
    "id": "q-303",
    "type": "background",
    "question": "《諫逐客書》的成書時代為何？",
    "options": [
      "戰國時期至魏晉（唐代尊為《文始真經》）",
      "舊題伏羲神農黃帝時代，宋代輯本",
      "西周初期至春秋中期（公元前11世紀至前6世紀）",
      "秦王政十年（公元前237年）"
    ],
    "correctAnswer": 3,
    "explanation": "《諫逐客書》乃秦王政十年（前 237 年）客卿李斯所呈遞之奏議名篇。當時秦國宗室藉「鄭國渠」間諜事件，誘使秦王下達「逐客令」，驅逐所有非秦籍之客卿。身為楚人的李斯在離秦途中寫下此書。李斯引經據典，回顧...",
    "workId": "jian-zhu-ke-shu",
    "chapterId": "jian-zhu-ke-shu_ch-1",
    "passageId": ""
  },
  {
    "id": "q-304",
    "type": "background",
    "question": "《國語》的作者或輯者是誰？",
    "options": [
      "西周至春秋民間採詩官及周室公卿創作，相傳孔子刪定",
      "相傳為魯國太史左丘明撰寫",
      "孟子（孟軻，鄒國人）及其弟子（萬章、公孫醜等）",
      "清代紹興文人吳楚材、吳調侯叔姪"
    ],
    "correctAnswer": 1,
    "explanation": "《國語》乃中國第一部國別體史書，共二十一卷。全書按國別分為《周語》、《魯語》、《齊語》、《晉語》、《鄭語》、《楚語》、《吳語》、《越語》，主要記錄春秋時期（前 990 年至前 453 年）八國貴族之重...",
    "workId": "guo-yu",
    "chapterId": "guo-yu_ch-1",
    "passageId": ""
  },
  {
    "id": "q-305",
    "type": "background",
    "question": "《越絕書》的成書時代為何？",
    "options": [
      "西周初期至春秋中期（公元前11世紀至前6世紀）",
      "上古至戰國（記錄堯舜至春秋時期史事）",
      "東漢時期（約公元1世紀）",
      "西漢漢武帝時期（約公元前109年至前91年）"
    ],
    "correctAnswer": 2,
    "explanation": "《越絕書》乃東漢時期袁康、吳平所輯錄之地方歷史地理著作，共十五卷。《越絕書》主要記載春秋末期越國之歷史、地理、城郭建造、兵器製造（如歐冶子鑄名劍）以及吳越兩國之恩怨。《越絕書》被學界尊為中國地方誌之鼻...",
    "workId": "yue-jue-shu",
    "chapterId": "yue-jue-shu_ch-1",
    "passageId": ""
  },
  {
    "id": "q-306",
    "type": "background",
    "question": "《越絕書》的成書時代為何？",
    "options": [
      "戰國末年至西漢（西漢劉向整理編訂）",
      "秦漢時期（約公元前2世紀）",
      "東漢時期（約公元1世紀）",
      "戰國魏國（公元前3世紀魏襄王墓出土）"
    ],
    "correctAnswer": 2,
    "explanation": "《越絕書》乃東漢時期袁康、吳平所輯錄之地方歷史地理著作，共十五卷。《越絕書》主要記載春秋末期越國之歷史、地理、城郭建造、兵器製造（如歐冶子鑄名劍）以及吳越兩國之恩怨。《越絕書》被學界尊為中國地方誌之鼻...",
    "workId": "yue-jue-shu",
    "chapterId": "yue-jue-shu_ch-1",
    "passageId": ""
  },
  {
    "id": "q-307",
    "type": "background",
    "question": "《史記》的作者或輯者是誰？",
    "options": [
      "佚名（古小說/歷史傳奇作家）",
      "司馬遷（字子長，夏陽人，西漢太史令）",
      "劉向（字子政，西漢宗室學者）",
      "公羊高（齊國人，子夏弟子）傳述，西漢董仲舒發揚"
    ],
    "correctAnswer": 1,
    "explanation": "《史記》，原名《太史公書》，乃西漢太史令司馬遷歷時數十年傾力完成之歷史鉅著，全書共一百三十篇，包含本紀十二、表十、書八、世家三十、列傳七十，記載了從黃帝時代至漢武帝太初年間共三千餘年之歷史。《史記》創...",
    "workId": "shiji",
    "chapterId": "shiji_ch-1",
    "passageId": ""
  },
  {
    "id": "q-308",
    "type": "background",
    "question": "《慎子》的成書時代為何？",
    "options": [
      "戰國至西漢（約公元前2世紀）",
      "春秋戰國時期（約公元前5世紀至前4世紀）",
      "戰國初期（約公元前4世紀）",
      "戰國中期（約公元前4世紀）"
    ],
    "correctAnswer": 3,
    "explanation": "《慎子》乃戰國時期稷下學者慎到之著作，《漢書·藝文志》著錄四十二篇，今存《威德》、《因循》、《民雜》、《德立》、《君人》等七篇輯本。慎到早年學黃老道家，後轉為法家。他提出了法家著名的「勢」論（權勢、位...",
    "workId": "shenzi",
    "chapterId": "shenzi_ch-1",
    "passageId": ""
  },
  {
    "id": "q-309",
    "type": "background",
    "question": "《越絕書》的作者或輯者是誰？",
    "options": [
      "袁康、吳平輯錄",
      "荀悅（字仲豫，潁川陰陵人，東漢史學家、哲學家）",
      "文子（辛鈃，號計然，相傳老子親傳弟子）",
      "商鞅（衛鞅、公孫鞅）及其法家學派後學"
    ],
    "correctAnswer": 0,
    "explanation": "《越絕書》乃東漢時期袁康、吳平所輯錄之地方歷史地理著作，共十五卷。《越絕書》主要記載春秋末期越國之歷史、地理、城郭建造、兵器製造（如歐冶子鑄名劍）以及吳越兩國之恩怨。《越絕書》被學界尊為中國地方誌之鼻...",
    "workId": "yue-jue-shu",
    "chapterId": "yue-jue-shu_ch-1",
    "passageId": ""
  },
  {
    "id": "q-310",
    "type": "background",
    "question": "《文始真經》的作者或輯者是誰？",
    "options": [
      "關尹子（尹喜，春秋函谷關令，老子授《道德經》之人）",
      "洪應明（字自誠，號還初道人，明代學者）",
      "孫武（字長卿，齊國樂安人，吳國將軍）",
      "相傳為魯國太史左丘明撰寫"
    ],
    "correctAnswer": 0,
    "explanation": "《文始真經》，原名《關尹子》，乃道家最高心法聖典之一。相傳為春秋末年函谷關令尹喜（關尹子）所著。尹喜曾迎老子於函谷關並獲授《道德經》，後潛心修道著書九篇（《一宇》、《二柱》、《三極》、《四符》、《五鑑...",
    "workId": "wenshi-zhenjing",
    "chapterId": "wenshi-zhenjing_ch-1",
    "passageId": ""
  },
  {
    "id": "q-311",
    "type": "background",
    "question": "《鹽鐵論》的成書時代為何？",
    "options": [
      "戰國時期（約公元前5世紀至前3世紀）",
      "西漢昭帝時期（公元前81年鹽鐵會議後，桓寬整理）",
      "明代萬曆年間（約1600年前後）",
      "戰國時期（西晉汲塚出土竹書之一）"
    ],
    "correctAnswer": 1,
    "explanation": "《鹽鐵論》乃西漢學者桓寬根據漢昭帝始元六年（前 81 年）著名的「鹽鐵會議」紀錄整理寫成之對話體政論著作，共六十篇。會議由霍光主導，邀請郡國選拔之「賢良文學」（民間儒生）與朝廷御史大夫桑弘羊等人，就鹽...",
    "workId": "yan-tie-lun",
    "chapterId": "yan-tie-lun_ch-1",
    "passageId": ""
  },
  {
    "id": "q-312",
    "type": "background",
    "question": "《尚書》的成書時代為何？",
    "options": [
      "戰國時期（西晉汲塚出土竹書之一）",
      "上古至戰國（記錄堯舜至春秋時期史事）",
      "東漢時期（公元1世紀，歷時20餘年完成）",
      "戰國末年至西漢（西漢劉向整理編訂）"
    ],
    "correctAnswer": 1,
    "explanation": "《尚書》，意為「上古之書」，乃中國現存最早之歷史文獻彙編，儒家五經之一。《尚書》分為《虞書》、《夏書》、《商書》、《周書》四部分，記載了從堯舜禹時代至春秋時期秦穆公之帝王言論、典章制度、誓詞與誥命（如...",
    "workId": "shu-jing",
    "chapterId": "shu-jing_ch-1",
    "passageId": ""
  },
  {
    "id": "q-313",
    "type": "background",
    "question": "《司馬法》的成書時代為何？",
    "options": [
      "戰國中期（約公元前4世紀）",
      "戰國末期至西漢",
      "春秋戰國時期",
      "東漢時期（約公元1世紀）"
    ],
    "correctAnswer": 2,
    "explanation": "《司馬法》乃古老的軍事典籍，武經七書之一。《漢書·藝文志》著錄一百五十五篇，今存《仁本》、《嚴位》、《皆賞》、《嚴爵》、《用徽》等五篇。《司馬法》探討了古代軍禮、軍隊組織與正義戰爭觀。提出了著名的「以...",
    "workId": "si-ma-fa",
    "chapterId": "si-ma-fa_ch-1",
    "passageId": ""
  },
  {
    "id": "q-314",
    "type": "background",
    "question": "《古三墳》的成書時代為何？",
    "options": [
      "西周初期至春秋中期（公元前11世紀至前6世紀）",
      "戰國中期（約公元前4世紀）",
      "戰國初期（約公元前4世紀）",
      "舊題伏羲神農黃帝時代，宋代輯本"
    ],
    "correctAnswer": 3,
    "explanation": "《古三墳》，又稱《三墳書》，乃記載中國上古傳說時代三皇（伏羲、神農、黃帝）政教與易象哲學之奇書。古語有「三墳五典，八索九丘」之說。宋代元豐年間毛漸輯得此書出版。《古三墳》分為《山墳》（伏羲氏）、《氣墳...",
    "workId": "gu-san-fen",
    "chapterId": "gu-san-fen_ch-1",
    "passageId": ""
  },
  {
    "id": "q-315",
    "type": "background",
    "question": "《詩經》的成書時代為何？",
    "options": [
      "東漢時期（約公元1世紀）",
      "西周初期至春秋中期（公元前11世紀至前6世紀）",
      "春秋戰國時期",
      "戰國中晚期（約公元前4世紀）"
    ],
    "correctAnswer": 1,
    "explanation": "《詩經》乃中國第一部詩歌總集，共收錄自西周初年至春秋中期詩歌 305 篇（另有笙詩 6 篇），故又稱「詩三百」。全書按音樂曲調分為《風》（十五國風）、《雅》（大雅、小雅）、《頌》（周頌、魯頌、商頌）三...",
    "workId": "shi-jing",
    "chapterId": "shi-jing_ch-1",
    "passageId": ""
  },
  {
    "id": "q-316",
    "type": "background",
    "question": "《古三墳》的作者或輯者是誰？",
    "options": [
      "尉繚（魏國人，秦國國尉）",
      "舊題管仲（管夷吾，齊國名相）作，實乃齊國稷下學者與齊法家著作彙編",
      "舊題三皇作，宋代毛漸輯得傳世",
      "墨子（墨翟，春秋末戰國初魯國/宋國人）及其墨家學派"
    ],
    "correctAnswer": 2,
    "explanation": "《古三墳》，又稱《三墳書》，乃記載中國上古傳說時代三皇（伏羲、神農、黃帝）政教與易象哲學之奇書。古語有「三墳五典，八索九丘」之說。宋代元豐年間毛漸輯得此書出版。《古三墳》分為《山墳》（伏羲氏）、《氣墳...",
    "workId": "gu-san-fen",
    "chapterId": "gu-san-fen_ch-1",
    "passageId": ""
  },
  {
    "id": "q-317",
    "type": "background",
    "question": "《漢書》的作者或輯者是誰？",
    "options": [
      "袁康、吳平輯錄",
      "上古史官記錄，相傳孔子輯定",
      "尉繚（魏國人，秦國國尉）",
      "班固（字孟堅，扶風安陵人）及其父班彪、妹班昭、馬續"
    ],
    "correctAnswer": 3,
    "explanation": "《漢書》，又稱《前漢書》，乃東漢著名史學家班固所著，歷時二十餘年完成（未竟部分由妹班昭及馬續補寫），全書共一百卷，記載了自漢高祖元年（前 206 年）至王莽地皇四年（公元 23 年）共 230 年間之...",
    "workId": "han-shu",
    "chapterId": "han-shu_ch-1",
    "passageId": ""
  },
  {
    "id": "q-318",
    "type": "background",
    "question": "《逸周書》的作者或輯者是誰？",
    "options": [
      "老子（姓李名耳，字聃，春秋時期楚國苦縣人）",
      "孔子（孔丘）及其弟子與再傳弟子",
      "周室史官記錄，清朱右曾集訓校釋",
      "韓非（韓國公子，荀子學生）"
    ],
    "correctAnswer": 2,
    "explanation": "《逸周書》，原名《周書》或《汲塚周書》，乃記載周代（尤其是西周初年）史事、典章制度與政治訓誨之歷史文獻總集。西晉時期於魏襄王墓（汲塚）出土，全書凡七十篇（其中五十九篇存世，十一篇存目）。《逸周書》包含...",
    "workId": "lost-book-of-zhou",
    "chapterId": "lost-book-of-zhou_ch-1",
    "passageId": ""
  },
  {
    "id": "q-319",
    "type": "background",
    "question": "《西京雜記》的成書時代為何？",
    "options": [
      "明代萬曆年間（約1600年前後）",
      "戰國中期（約公元前4世紀）",
      "上古至西周（卦爻辭）、戰國至秦漢（易傳）",
      "漢魏魏晉時期（舊題西漢劉歆作，晉葛洪輯錄）"
    ],
    "correctAnswer": 3,
    "explanation": "《西京雜記》乃記載西漢都城長安（西京）宮廷軼事、社會風俗與名士奇聞之筆記小說集，共六卷。相傳為西漢劉歆撰，東晉葛洪輯錄。《西京雜記》保存了大量極具文學色彩之傳奇典故，如「王昭君畫工毛延壽受賄」、「匡衡...",
    "workId": "xijing-zaji",
    "chapterId": "xijing-zaji_ch-1",
    "passageId": ""
  },
  {
    "id": "q-320",
    "type": "background",
    "question": "《管子》的成書時代為何？",
    "options": [
      "明代萬曆年間（約1600年前後）",
      "戰國魏國（公元前3世紀魏襄王墓出土）",
      "戰國中期（約公元前4世紀）",
      "戰國時期至秦漢（約公元前4世紀至前1世紀）"
    ],
    "correctAnswer": 3,
    "explanation": "《管子》乃託名春秋齊國名相管仲之著作集，由西漢劉向編定為七十六篇。《管子》內容極其豐富博大，融合了道家之自然論、法家之法治、儒家之禮教與獨樹一幟之「輕重學」（經濟貨幣學）。提出了著名的「倉廩實而知禮節...",
    "workId": "guanzi",
    "chapterId": "guanzi_ch-1",
    "passageId": ""
  },
  {
    "id": "q-321",
    "type": "background",
    "question": "《文子》的成書時代為何？",
    "options": [
      "戰國魏國（公元前3世紀魏襄王墓出土）",
      "戰國中期（約公元前4世紀）",
      "西漢漢武帝時期（約公元前109年至前91年）",
      "戰國時期至漢代（唐代尊為《通玄真經》）"
    ],
    "correctAnswer": 3,
    "explanation": "《文子》，唐代尊稱為《通玄真經》，乃先秦道家核心典籍之一，相傳為老子弟子文子（辛鈃）問道於老子後所著，現存十二篇。長期以來學界曾懷疑其為漢代抄襲之書，但隨著 1973 年河北定州漢墓及海昏侯墓出土《文...",
    "workId": "wenzi",
    "chapterId": "wenzi_ch-1",
    "passageId": ""
  },
  {
    "id": "q-322",
    "type": "background",
    "question": "《春秋公羊傳》的作者或輯者是誰？",
    "options": [
      "子思（孔伋，孔子之孫）",
      "清代紹興文人吳楚材、吳調侯叔姪",
      "公羊高（齊國人，子夏弟子）傳述，西漢董仲舒發揚",
      "範曄（字蔚宗，順陽人，南朝宋史學家）"
    ],
    "correctAnswer": 2,
    "explanation": "《春秋公羊傳》，簡稱《公羊傳》，乃儒家今文經學最高經典，相傳由子夏傳予齊國人公羊高。西漢董仲舒、公孫弘極力推崇《公羊傳》，發揮其中的政治哲學。《公羊傳》提出了著名的「大一統」政治理論、「張三世」（據亂...",
    "workId": "gongyang-zhuan",
    "chapterId": "gongyang-zhuan_ch-1",
    "passageId": ""
  },
  {
    "id": "q-323",
    "type": "background",
    "question": "《燕丹子》的作者或輯者是誰？",
    "options": [
      "佚名（古小說/歷史傳奇作家）",
      "商鞅（衛鞅、公孫鞅）及其法家學派後學",
      "孔子門人及其後學撰寫，西漢戴聖輯錄（小戴禮記）",
      "東漢官修史官團隊（劉珍、班昭、蔡邕、楊厚等）"
    ],
    "correctAnswer": 0,
    "explanation": "《燕丹子》乃記載戰國末期燕太子丹遣荊軻刺秦王歷史事件之傳奇小說，共三卷。本書創作年代久遠，呈現了古代傳奇小說之早期風貌。文中以極其生動、富有傳奇色彩之筆觸，敘述了燕太子丹受辱逃歸、極端奉養荊軻、田光吞...",
    "workId": "yandanzi",
    "chapterId": "yandanzi_ch-1",
    "passageId": ""
  },
  {
    "id": "q-324",
    "type": "background",
    "question": "《易經》的成書時代為何？",
    "options": [
      "西漢時期（約公元前1世紀）",
      "東漢末年（公元200年前後）",
      "上古至西周（卦爻辭）、戰國至秦漢（易傳）",
      "漢魏魏晉時期（舊題西漢劉歆作，晉葛洪輯錄）"
    ],
    "correctAnswer": 2,
    "explanation": "《周易》，簡稱《易經》，乃中國古代最古老深邃之哲學典籍，被譽為「羣經之首，大道之源」。全書由《經》（六十四卦卦爻辭）與《傳》（《易傳》十翼）兩部分組成。《易經》以陰爻（--）與陽爻（—）之交錯組合，模...",
    "workId": "yi-jing",
    "chapterId": "yi-jing_ch-1",
    "passageId": ""
  },
  {
    "id": "q-325",
    "type": "background",
    "question": "《穆天子傳》的作者或輯者是誰？",
    "options": [
      "洪應明（字自誠，號還初道人，明代學者）",
      "趙曄（字長君，會稽山陰人）",
      "孫武（字長卿，齊國樂安人，吳國將軍）",
      "戰國文人據西周傳說輯撰，西晉荀勖、郭璞作注"
    ],
    "correctAnswer": 3,
    "explanation": "《穆天子傳》，原名《周王遊行記》，乃西晉汲塚出土竹書之一，共六卷。本書以編年體形式，詳細記載了西周第五代君主周穆王（姬滿）率領軍隊、乘坐「八駿」神馬，從鎬京出發向西北遠徵西巡數萬裡之傳奇經歷。書中最為...",
    "workId": "mutianzi-zhuan",
    "chapterId": "mutianzi-zhuan_ch-1",
    "passageId": ""
  },
  {
    "id": "q-326",
    "type": "background",
    "question": "《漢書》的作者或輯者是誰？",
    "options": [
      "班固（字孟堅，扶風安陵人）及其父班彪、妹班昭、馬續",
      "商鞅（衛鞅、公孫鞅）及其法家學派後學",
      "穀梁赤（魯國人，子夏弟子）傳述",
      "舊題黃石公授張良，實乃秦漢之際兵家所著"
    ],
    "correctAnswer": 0,
    "explanation": "《漢書》，又稱《前漢書》，乃東漢著名史學家班固所著，歷時二十餘年完成（未竟部分由妹班昭及馬續補寫），全書共一百卷，記載了自漢高祖元年（前 206 年）至王莽地皇四年（公元 23 年）共 230 年間之...",
    "workId": "han-shu",
    "chapterId": "han-shu_ch-1",
    "passageId": ""
  },
  {
    "id": "q-327",
    "type": "background",
    "question": "《荀子》的成書時代為何？",
    "options": [
      "戰國末期",
      "戰國時期（約公元前5世紀至前3世紀）",
      "西周至戰國（魏襄王墓汲塚出土）",
      "戰國時期至漢代（唐代尊為《通玄真經》）"
    ],
    "correctAnswer": 0,
    "explanation": "《荀子》乃戰國末期思想家荀況（荀子）及其門人所著，全書存三十二篇。荀子總括諸子思想，吸收道、法、名等學派菁華，建立起以「禮治」與「法治」並舉的務實思想體系。在人性論上，提出「性惡論」，強調透過後天的教...",
    "workId": "xunzi",
    "chapterId": "xunzi_ch-1",
    "passageId": ""
  },
  {
    "id": "q-328",
    "type": "background",
    "question": "《史記》的成書時代為何？",
    "options": [
      "戰國中晚期（約公元前4世紀）",
      "西周至戰國（魏襄王墓汲塚出土）",
      "戰國末期（秦王政時期）",
      "西漢漢武帝時期（約公元前109年至前91年）"
    ],
    "correctAnswer": 3,
    "explanation": "《史記》，原名《太史公書》，乃西漢太史令司馬遷歷時數十年傾力完成之歷史鉅著，全書共一百三十篇，包含本紀十二、表十、書八、世家三十、列傳七十，記載了從黃帝時代至漢武帝太初年間共三千餘年之歷史。《史記》創...",
    "workId": "shiji",
    "chapterId": "shiji_ch-1",
    "passageId": ""
  },
  {
    "id": "q-329",
    "type": "background",
    "question": "《古文觀止》的成書時代為何？",
    "options": [
      "東漢時期（約公元1世紀）",
      "戰國時期（約公元前5世紀至前3世紀）",
      "東漢時期（公元1世紀，歷時20餘年完成）",
      "清康熙三十四年（1695年）"
    ],
    "correctAnswer": 3,
    "explanation": "《古文觀止》乃清代康熙年間紹興學者吳楚材、吳調侯叔姪二人編選之歷代散文總集，共十二卷，收錄自先秦至明代古文名篇 222 篇。書名取自《左傳》「觀止矣」典故，意即古代散文之精品盡在於斯。該選本評選眼光獨...",
    "workId": "gu-wen-guan-zhi",
    "chapterId": "gu-wen-guan-zhi_ch-1",
    "passageId": ""
  },
  {
    "id": "q-330",
    "type": "background",
    "question": "《國語》的作者或輯者是誰？",
    "options": [
      "尉繚（魏國人，秦國國尉）",
      "戰國文人據西周傳說輯撰，西晉荀勖、郭璞作注",
      "關尹子（尹喜，春秋函谷關令，老子授《道德經》之人）",
      "相傳為魯國太史左丘明撰寫"
    ],
    "correctAnswer": 3,
    "explanation": "《國語》乃中國第一部國別體史書，共二十一卷。全書按國別分為《周語》、《魯語》、《齊語》、《晉語》、《鄭語》、《楚語》、《吳語》、《越語》，主要記錄春秋時期（前 990 年至前 453 年）八國貴族之重...",
    "workId": "guo-yu",
    "chapterId": "guo-yu_ch-1",
    "passageId": ""
  },
  {
    "id": "q-331",
    "type": "background",
    "question": "《菜根譚》的成書時代為何？",
    "options": [
      "漢魏魏晉時期（舊題西漢劉歆作，晉葛洪輯錄）",
      "明代萬曆年間（約1600年前後）",
      "戰國中期（約公元前4世紀）",
      "戰國至秦漢（約公元前3世紀）"
    ],
    "correctAnswer": 1,
    "explanation": "《菜根譚》乃明代萬曆年間學者洪應明所著之處世格言集。書名取自宋代儒者汪信民「人能咬得菜根，則百事可做」之語，意在告誡世人甘於淡泊、咬得苦菜根方能體悟人生真諦。《菜根譚》將儒家的修身齊家、道家的清靜無為...",
    "workId": "cai-gen-tan",
    "chapterId": "cai-gen-tan_ch-1",
    "passageId": ""
  },
  {
    "id": "q-332",
    "type": "background",
    "question": "《菜根譚》的作者或輯者是誰？",
    "options": [
      "尉繚（魏國人，秦國國尉）",
      "商鞅（衛鞅、公孫鞅）及其法家學派後學",
      "申不害（韓國相國，鄭國人）",
      "洪應明（字自誠，號還初道人，明代學者）"
    ],
    "correctAnswer": 3,
    "explanation": "《菜根譚》乃明代萬曆年間學者洪應明所著之處世格言集。書名取自宋代儒者汪信民「人能咬得菜根，則百事可做」之語，意在告誡世人甘於淡泊、咬得苦菜根方能體悟人生真諦。《菜根譚》將儒家的修身齊家、道家的清靜無為...",
    "workId": "cai-gen-tan",
    "chapterId": "cai-gen-tan_ch-1",
    "passageId": ""
  },
  {
    "id": "q-333",
    "type": "background",
    "question": "《戰國策》的作者或輯者是誰？",
    "options": [
      "戰國縱橫家遊士記錄，西漢劉向輯錄校訂",
      "舊題曾子傳述，宋代朱熹認定為孔子門人曾子作經、門人記傳",
      "魏國史官編纂，西晉汲塚出土",
      "桓寬（字次公，西漢汝南人）"
    ],
    "correctAnswer": 0,
    "explanation": "《戰國策》是記錄戰國時期列國政治、軍事與縱橫家遊士謀略言行的國別體史料彙編，原作者非一人，西漢劉向整理、校訂並定名。通行本依東周、西周、秦、齊、楚、趙、魏、韓、燕、宋、衛、中山十二國編排，共三十三卷；...",
    "workId": "zhan-guo-ce",
    "chapterId": "zhan-guo-ce_ch-1",
    "passageId": ""
  },
  {
    "id": "q-334",
    "type": "background",
    "question": "《慎子》的作者或輯者是誰？",
    "options": [
      "舊題管仲（管夷吾，齊國名相）作，實乃齊國稷下學者與齊法家著作彙編",
      "慎到（趙國人，齊國稷下學士）",
      "墨子（墨翟，春秋末戰國初魯國/宋國人）及其墨家學派",
      "孫武（字長卿，齊國樂安人，吳國將軍）"
    ],
    "correctAnswer": 1,
    "explanation": "《慎子》乃戰國時期稷下學者慎到之著作，《漢書·藝文志》著錄四十二篇，今存《威德》、《因循》、《民雜》、《德立》、《君人》等七篇輯本。慎到早年學黃老道家，後轉為法家。他提出了法家著名的「勢」論（權勢、位...",
    "workId": "shenzi",
    "chapterId": "shenzi_ch-1",
    "passageId": ""
  },
  {
    "id": "q-335",
    "type": "background",
    "question": "《諫逐客書》的作者或輯者是誰？",
    "options": [
      "舊題曾子傳述，宋代朱熹認定為孔子門人曾子作經、門人記傳",
      "李斯（楚國上蔡人，秦國客卿、後任丞相）",
      "魯國國史，相傳孔子編修",
      "洪應明（字自誠，號還初道人，明代學者）"
    ],
    "correctAnswer": 1,
    "explanation": "《諫逐客書》乃秦王政十年（前 237 年）客卿李斯所呈遞之奏議名篇。當時秦國宗室藉「鄭國渠」間諜事件，誘使秦王下達「逐客令」，驅逐所有非秦籍之客卿。身為楚人的李斯在離秦途中寫下此書。李斯引經據典，回顧...",
    "workId": "jian-zhu-ke-shu",
    "chapterId": "jian-zhu-ke-shu_ch-1",
    "passageId": ""
  },
  {
    "id": "q-336",
    "type": "background",
    "question": "《古三墳》的作者或輯者是誰？",
    "options": [
      "荀悅（字仲豫，潁川陰陵人，東漢史學家、哲學家）",
      "申不害（韓國相國，鄭國人）",
      "舊題三皇作，宋代毛漸輯得傳世",
      "魏國史官編纂，西晉汲塚出土"
    ],
    "correctAnswer": 2,
    "explanation": "《古三墳》，又稱《三墳書》，乃記載中國上古傳說時代三皇（伏羲、神農、黃帝）政教與易象哲學之奇書。古語有「三墳五典，八索九丘」之說。宋代元豐年間毛漸輯得此書出版。《古三墳》分為《山墳》（伏羲氏）、《氣墳...",
    "workId": "gu-san-fen",
    "chapterId": "gu-san-fen_ch-1",
    "passageId": ""
  },
  {
    "id": "q-337",
    "type": "background",
    "question": "《吳子》的作者或輯者是誰？",
    "options": [
      "吳起（衛國左氏人，曾任魏國、楚國將領）",
      "清代紹興文人吳楚材、吳調侯叔姪",
      "袁康、吳平輯錄",
      "商鞅（衛鞅、公孫鞅）及其法家學派後學"
    ],
    "correctAnswer": 0,
    "explanation": "《吳子》，又稱《吳子兵法》，乃戰國初期傑出軍事家、政治家吳起所作，現存六篇（《圖國》、《料敵》、《治兵》、《論將》、《應變》、《勵士》）。吳起曾相魏、相楚，戰功赫赫。《吳子》強調政治文德與軍事武備不可...",
    "workId": "wu-zi",
    "chapterId": "wu-zi_ch-1",
    "passageId": ""
  },
  {
    "id": "q-338",
    "type": "background",
    "question": "《墨子》的成書時代為何？",
    "options": [
      "戰國時期（約公元前5世紀至前3世紀）",
      "戰國時期（約公元前5世紀）",
      "西漢漢武帝時期（約公元前109年至前91年）",
      "春秋末期（約公元前6世紀）"
    ],
    "correctAnswer": 0,
    "explanation": "《墨子》是墨家學派著作的總集。《漢書・藝文志》著錄七十一篇，今存五十三篇，其餘十八篇亡佚；現存篇章涵蓋墨家十論、墨辯、言行記錄與守城技術。墨子創立墨家，與儒家並稱戰國時期的「顯學」。《墨子》提出「兼愛...",
    "workId": "mo-zi",
    "chapterId": "mo-zi_ch-1",
    "passageId": ""
  },
  {
    "id": "q-339",
    "type": "background",
    "question": "《文始真經》的作者或輯者是誰？",
    "options": [
      "列禦寇（戰國鄭國人）及其弟子，魏晉張湛作注",
      "西周至春秋民間採詩官及周室公卿創作，相傳孔子刪定",
      "舊題三皇作，宋代毛漸輯得傳世",
      "關尹子（尹喜，春秋函谷關令，老子授《道德經》之人）"
    ],
    "correctAnswer": 3,
    "explanation": "《文始真經》，原名《關尹子》，乃道家最高心法聖典之一。相傳為春秋末年函谷關令尹喜（關尹子）所著。尹喜曾迎老子於函谷關並獲授《道德經》，後潛心修道著書九篇（《一宇》、《二柱》、《三極》、《四符》、《五鑑...",
    "workId": "wenshi-zhenjing",
    "chapterId": "wenshi-zhenjing_ch-1",
    "passageId": ""
  },
  {
    "id": "q-340",
    "type": "background",
    "question": "《史記》的作者或輯者是誰？",
    "options": [
      "戰國縱橫家遊士記錄，西漢劉向輯錄校訂",
      "西周至春秋民間採詩官及周室公卿創作，相傳孔子刪定",
      "洪應明（字自誠，號還初道人，明代學者）",
      "司馬遷（字子長，夏陽人，西漢太史令）"
    ],
    "correctAnswer": 3,
    "explanation": "《史記》，原名《太史公書》，乃西漢太史令司馬遷歷時數十年傾力完成之歷史鉅著，全書共一百三十篇，包含本紀十二、表十、書八、世家三十、列傳七十，記載了從黃帝時代至漢武帝太初年間共三千餘年之歷史。《史記》創...",
    "workId": "shiji",
    "chapterId": "shiji_ch-1",
    "passageId": ""
  },
  {
    "id": "q-341",
    "type": "background",
    "question": "《穆天子傳》的成書時代為何？",
    "options": [
      "戰國中晚期（約公元前4世紀）",
      "秦漢時期（約公元前2世紀）",
      "戰國時期（西晉汲塚出土竹書之一）",
      "東漢末年（公元200年前後）"
    ],
    "correctAnswer": 2,
    "explanation": "《穆天子傳》，原名《周王遊行記》，乃西晉汲塚出土竹書之一，共六卷。本書以編年體形式，詳細記載了西周第五代君主周穆王（姬滿）率領軍隊、乘坐「八駿」神馬，從鎬京出發向西北遠徵西巡數萬裡之傳奇經歷。書中最為...",
    "workId": "mutianzi-zhuan",
    "chapterId": "mutianzi-zhuan_ch-1",
    "passageId": ""
  },
  {
    "id": "q-342",
    "type": "background",
    "question": "《後漢書》的作者或輯者是誰？",
    "options": [
      "孟子（孟軻，鄒國人）及其弟子（萬章、公孫醜等）",
      "墨子（墨翟，春秋末戰國初魯國/宋國人）及其墨家學派",
      "上古伏羲畫卦、周文王作卦辭、周公作爻辭、孔子作《易傳》（十翼）",
      "範曄（字蔚宗，順陽人，南朝宋史學家）"
    ],
    "correctAnswer": 3,
    "explanation": "《後漢書》乃南朝宋史學家範曄所著之紀傳體斷代史，記載自光武帝建武元年（25 年）至獻帝延康元年（220 年）共 195 年間之東漢歷史。《後漢書》全書包含本紀十卷、列傳八十卷（志三十卷由司馬彪補）。範...",
    "workId": "hou-han-shu",
    "chapterId": "hou-han-shu_ch-1",
    "passageId": ""
  },
  {
    "id": "q-343",
    "type": "background",
    "question": "《論語》的成書時代為何？",
    "options": [
      "戰國至秦漢（約公元前3世紀）",
      "戰國中期（約公元前4世紀）",
      "春秋戰國時期（約公元前5世紀至前4世紀）",
      "戰國末期（約公元前3世紀）"
    ],
    "correctAnswer": 2,
    "explanation": "《論語》乃記錄春秋時期偉大思想家、教育家孔子及其弟子言行之語錄體散文集，由孔子弟子及再傳弟子編纂而成，現存二十篇。《論語》以極其質樸、雋永、深刻之語言，呈現了孔子關於「仁、義、禮、智、信」、「君子修養...",
    "workId": "lun-yu",
    "chapterId": "lun-yu_ch-1",
    "passageId": ""
  },
  {
    "id": "q-344",
    "type": "background",
    "question": "《道德經》的成書時代為何？",
    "options": [
      "漢魏魏晉時期（舊題西漢劉歆作，晉葛洪輯錄）",
      "春秋末期（約公元前6世紀）",
      "春秋戰國時期",
      "西周初期至春秋中期（公元前11世紀至前6世紀）"
    ],
    "correctAnswer": 1,
    "explanation": "《道德經》，又稱《老子》或《五千言》，乃春秋末期道家學派創始人老子所著，全書分《道經》與《德經》上下篇，共八十一章。老子以極其簡練而深邃的韻律警句，系統構建了以「道」為核心的宇宙哲學體系。老子認為「道...",
    "workId": "dao-de-jing",
    "chapterId": "dao-de-jing_ch-1",
    "passageId": ""
  },
  {
    "id": "q-345",
    "type": "background",
    "question": "《孟子》的成書時代為何？",
    "options": [
      "戰國末期至西漢",
      "春秋戰國時期（約公元前5世紀至前4世紀）",
      "戰國中期（約公元前4世紀）",
      "春秋末期（約公元前500年前後）"
    ],
    "correctAnswer": 2,
    "explanation": "《孟子》乃戰國思想家孟子及其弟子萬章等人所著，現存七篇（十四卷）。孟子繼承並宏揚孔子學說，被後世尊為「亞聖」。《孟子》提出了著名的「性善論」，認為人性本善，人人皆具「四端」（仁義禮智）；在政治哲學上，...",
    "workId": "meng-zi",
    "chapterId": "meng-zi_ch-1",
    "passageId": ""
  },
  {
    "id": "q-346",
    "type": "background",
    "question": "《史記》的成書時代為何？",
    "options": [
      "戰國初期（約公元前4世紀）",
      "戰國末期至西漢",
      "西漢漢武帝時期（約公元前109年至前91年）",
      "戰國末期（約公元前3世紀）"
    ],
    "correctAnswer": 2,
    "explanation": "《史記》，原名《太史公書》，乃西漢太史令司馬遷歷時數十年傾力完成之歷史鉅著，全書共一百三十篇，包含本紀十二、表十、書八、世家三十、列傳七十，記載了從黃帝時代至漢武帝太初年間共三千餘年之歷史。《史記》創...",
    "workId": "shiji",
    "chapterId": "shiji_ch-1",
    "passageId": ""
  },
  {
    "id": "q-347",
    "type": "background",
    "question": "《西京雜記》的成書時代為何？",
    "options": [
      "東漢末年（公元200年前後）",
      "戰國中晚期（約公元前4世紀）",
      "漢魏魏晉時期（舊題西漢劉歆作，晉葛洪輯錄）",
      "春秋戰國時期（約公元前5世紀至前4世紀）"
    ],
    "correctAnswer": 2,
    "explanation": "《西京雜記》乃記載西漢都城長安（西京）宮廷軼事、社會風俗與名士奇聞之筆記小說集，共六卷。相傳為西漢劉歆撰，東晉葛洪輯錄。《西京雜記》保存了大量極具文學色彩之傳奇典故，如「王昭君畫工毛延壽受賄」、「匡衡...",
    "workId": "xijing-zaji",
    "chapterId": "xijing-zaji_ch-1",
    "passageId": ""
  },
  {
    "id": "q-348",
    "type": "background",
    "question": "《尉繚子》的作者或輯者是誰？",
    "options": [
      "尉繚（魏國人，秦國國尉）",
      "孔子（孔丘）及其弟子與再傳弟子",
      "上古史官記錄，相傳孔子輯定",
      "左丘明（魯國太史）"
    ],
    "correctAnswer": 0,
    "explanation": "《尉繚子》乃戰國末期軍事家尉繚所著，武經七書之一，現存二十四篇。尉繚曾入秦見秦王政，論述統一天下之戰略。《尉繚子》主張政治、經濟與道德乃軍事勝負之根本，提出「權先出於兵，兵先出於政，政先出於道德」。全...",
    "workId": "wei-liao-zi",
    "chapterId": "wei-liao-zi_ch-1",
    "passageId": ""
  },
  {
    "id": "q-349",
    "type": "background",
    "question": "《文始真經》的成書時代為何？",
    "options": [
      "戰國中期（約公元前4世紀）",
      "戰國時期至魏晉（唐代尊為《文始真經》）",
      "上古至西周（卦爻辭）、戰國至秦漢（易傳）",
      "戰國魏國（公元前3世紀魏襄王墓出土）"
    ],
    "correctAnswer": 1,
    "explanation": "《文始真經》，原名《關尹子》，乃道家最高心法聖典之一。相傳為春秋末年函谷關令尹喜（關尹子）所著。尹喜曾迎老子於函谷關並獲授《道德經》，後潛心修道著書九篇（《一宇》、《二柱》、《三極》、《四符》、《五鑑...",
    "workId": "wenshi-zhenjing",
    "chapterId": "wenshi-zhenjing_ch-1",
    "passageId": ""
  },
  {
    "id": "q-350",
    "type": "background",
    "question": "《後漢書》的作者或輯者是誰？",
    "options": [
      "齊國後人輯錄晏嬰（晏子）言行",
      "關尹子（尹喜，春秋函谷關令，老子授《道德經》之人）",
      "範曄（字蔚宗，順陽人，南朝宋史學家）",
      "相傳為魯國太史左丘明撰寫"
    ],
    "correctAnswer": 2,
    "explanation": "《後漢書》乃南朝宋史學家範曄所著之紀傳體斷代史，記載自光武帝建武元年（25 年）至獻帝延康元年（220 年）共 195 年間之東漢歷史。《後漢書》全書包含本紀十卷、列傳八十卷（志三十卷由司馬彪補）。範...",
    "workId": "hou-han-shu",
    "chapterId": "hou-han-shu_ch-1",
    "passageId": ""
  },
  {
    "id": "q-351",
    "type": "background",
    "question": "《三略》的成書時代為何？",
    "options": [
      "戰國初期（約公元前4世紀）",
      "戰國時期（西晉汲塚出土竹書之一）",
      "秦漢時期（約公元前2世紀）",
      "春秋時期（公元前722年至前481年）"
    ],
    "correctAnswer": 2,
    "explanation": "《三略》，又稱《黃石公三略》，乃武經七書之一，分為《上略》、《中略》、《下略》三卷。相傳為圯上老人黃石公授予張良之兵書。《三略》融匯了兵家、道家與儒家思想，重點探討國家政治統治、收拾人心、招攬人才與戰...",
    "workId": "three-strategies",
    "chapterId": "three-strategies_ch-1",
    "passageId": ""
  },
  {
    "id": "q-352",
    "type": "background",
    "question": "《越絕書》的作者或輯者是誰？",
    "options": [
      "袁康、吳平輯錄",
      "齊國司馬穰苴遺說，齊威王時整理",
      "上古史官記錄，相傳孔子輯定",
      "墨子（墨翟，春秋末戰國初魯國/宋國人）及其墨家學派"
    ],
    "correctAnswer": 0,
    "explanation": "《越絕書》乃東漢時期袁康、吳平所輯錄之地方歷史地理著作，共十五卷。《越絕書》主要記載春秋末期越國之歷史、地理、城郭建造、兵器製造（如歐冶子鑄名劍）以及吳越兩國之恩怨。《越絕書》被學界尊為中國地方誌之鼻...",
    "workId": "yue-jue-shu",
    "chapterId": "yue-jue-shu_ch-1",
    "passageId": ""
  }
];
