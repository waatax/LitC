import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const worksPath = path.join(__dirname, '../src/data/works.ts');

// Helper for sentence and chunk splitting
function splitSentences(text) {
  const regex = /[^。；！？\r\n]+[。；！？]+/g;
  let matches = text.match(regex);
  if (!matches) {
    return [text.trim()].filter(Boolean);
  }
  return matches.map(m => m.trim()).filter(Boolean);
}

function splitChunks(sentenceText, sentenceId) {
  const parts = sentenceText.split(/([，、：；。！？])/g).filter(Boolean);
  let tempChunks = [];
  let current = "";
  
  for (const part of parts) {
    current += part;
    if (/[，、：；。！？]/.test(part) || current.length >= 4) {
      tempChunks.push(current);
      current = "";
    }
  }
  if (current) {
    if (tempChunks.length > 0) {
      tempChunks[tempChunks.length - 1] += current;
    } else {
      tempChunks.push(current);
    }
  }

  let finalChunks = [];
  for (let chunk of tempChunks) {
    if (chunk.length > 10) {
      const mid = Math.floor(chunk.length / 2);
      finalChunks.push(chunk.substring(0, mid));
      finalChunks.push(chunk.substring(mid));
    } else {
      finalChunks.push(chunk);
    }
  }

  return finalChunks.map((text, idx) => ({
    id: `${sentenceId}_c-${idx + 1}`,
    sentenceId,
    order: idx + 1,
    text,
    cue: text[0],
  }));
}

// Data definitions for the 10 new classic works
const newWorksData = [
  {
    id: 'da-xue',
    schoolId: 'confucianism',
    title: '大學',
    genreStrategy: 'argumentative',
    sourceNote: '朱熹《四書章句集注》，儒家修己治人之核心大綱。',
    chapters: [
      {
        title: '經一章',
        text: '大學之道，在明明德，在親民，在止於至善。知止而后有定，定而后能靜，靜而后能安，安而后能慮，慮而后能得。物有本末，事有終始，知所先後，則近道矣。古之欲明明德於天下者，先治其國；欲治其國者，先齊其家；欲齊其家者，先修其身；欲修其身者，先正其心；欲正其心者，先誠其意；欲誠其意者，先致其知；致知在格物。物格而后知至，知至而后意誠，意誠而后心正，心正而后身修，身修而后家齊，家齊而后國治，國治而后天下平。自天子以至於庶人，壹是皆以修身為本。其本亂而末治者否矣；其所厚者薄，而其所薄者厚，未之有也！',
        translation: 'The Way of great learning consists in manifesting illustrious virtue, in loving the people, and in abiding in the highest good. Knowing where to abide leads to stability, stability to stillness, stillness to peace...'
      }
    ]
  },
  {
    id: 'zhong-yong',
    schoolId: 'confucianism',
    title: '中庸',
    genreStrategy: 'argumentative',
    sourceNote: '朱熹《四書章句集注》，儒家心法與中和哲學之源起。',
    chapters: [
      {
        title: '天命之謂性',
        text: '天命之謂性，率性之謂道，修道之謂教。道也者，不可須臾離也，可離非道也。是故君子戒慎乎其所不睹，恐懼乎其所不聞。莫見乎隱，莫顯乎微，故君子慎其獨也。喜怒哀樂之未發，謂之中；發而皆中節，謂之和。中也者，天下之大本也；和也者，天下之達道也。致中和，天地位焉，萬物育焉。',
        translation: 'What Heaven has conferred is called the nature; an accordance with this nature is called the Way; the cultivation of this Way is called instruction. The Way cannot be left for an instant...'
      }
    ]
  },
  {
    id: 'lun-yu',
    schoolId: 'confucianism',
    title: '論語',
    genreStrategy: 'rhythmic',
    sourceNote: '記錄孔子及其弟子言行之儒家最核心經典。',
    chapters: [
      {
        title: '學而第一（節選）',
        text: '子曰：「學而時習之，不亦說乎？有朋自遠方來，不亦樂乎？人不知而不慍，不亦君子乎？」曾子曰：「吾日三省吾身：為人謀而不忠乎？與朋友交而不信乎？傳不習乎？」子曰：「道千乘之國，敬事而信，節用而愛人，使民以時。」子曰：「弟子入則孝，出則弟，謹而信，汎愛眾，而親仁。行有餘力，則以學文。」',
        translation: 'The Master said: "Is it not a pleasure to learn and repeat it at times? Is it not delightful to have friends coming from afar?..." Zengzi said: "I examine myself three times daily..."'
      },
      {
        title: '為政第二（節選）',
        text: '子曰：「吾十有五而志於學，三十而立，四十而不惑，五十而知天命，六十而耳順，七十而從心所欲，不逾矩。」子曰：「溫故而知新，可以為師矣。」子曰：「學而不思則罔，思而不學則殆。」子曰：「知之為知之，不知為不知，是知也。」',
        translation: 'The Master said: "At fifteen, I bent my mind to learning. At thirty, I stood firm..." The Master said: "If a man keeps cherishing his old knowledge, so as continually to be acquiring new..."'
      }
    ]
  },
  {
    id: 'meng-zi',
    schoolId: 'confucianism',
    title: '孟子',
    genreStrategy: 'argumentative',
    sourceNote: '記載孟軻之言論、政治主張與心性論。',
    chapters: [
      {
        title: '梁惠王上（節選）',
        text: '孟子見梁惠王。王曰：「叟！不遠千里而來，亦將有以利吾國乎？」孟子對曰：「王！何必曰利？亦有仁義而已矣。王曰『何以利吾國』，大夫曰『何以利吾家』，士庶人曰『何以利吾身』，上下交征利而國危矣。萬乘之國，弒其君者，必千乘之家；千乘之國，弒其君者，必百乘之家。萬取千焉，千取百焉，不為不多矣。苟為後義而先利，不奪不饜。未有仁而遺其親者也，未有義而後其君者也。王亦曰仁義而已矣，何必曰利？」',
        translation: 'Mencius went to see King Hui of Liang. The King said: "Venerable sir, since you have not counted a thousand li too far to come, I suppose you have something to profit my kingdom?..."'
      },
      {
        title: '四端之心',
        text: '孟子曰：「人皆有惻隱之心，羞惡之心，辭讓之心，是非之心。惻隱之心，仁之端也；羞惡之心，義之端也；辭讓之心，禮之端也；是非之心，智之端也。人之有是四端也，猶其有四體也。有是四端而自謂不能者，自賊者也；謂其君不能者，賊其君者也。」',
        translation: 'Mencius said: "All men have a mind which cannot bear to see the sufferings of others. The feeling of commiseration is the principle of benevolence..."'
      }
    ]
  },
  {
    id: 'yi-jing',
    schoolId: 'confucianism',
    title: '易經',
    genreStrategy: 'parallel',
    sourceNote: '儒家與道家共同之核心源頭，五經之首。',
    chapters: [
      {
        title: '乾坤二卦《大象傳》',
        text: '乾卦：元，亨，利，貞。大象傳曰：天行健，君子以自強不息。坤卦：元，亨，利，牝馬之貞。大象傳曰：地勢坤，君子以厚德載物。',
        translation: 'The Qian Hexagram represents Heaven... The Xiang Zhuan says: "As Heaven moves with strength, the gentleman strengthens himself untiringly." The Kun Hexagram represents Earth... "As Earth is receptive, the gentleman supports all things with virtue."'
      }
    ]
  },
  {
    id: 'shu-jing',
    schoolId: 'confucianism',
    title: '尚書',
    genreStrategy: 'narrative',
    sourceNote: '中國上古歷史文獻與政事記錄。',
    chapters: [
      {
        title: '大禹謨（十六字心傳）',
        text: '帝曰：「來，禹！降水儆予，成允成功，惟汝賢。克勤于邦，克儉于家，不自滿假，惟汝賢。人心惟危，道心惟微，惟精惟一，允執厥中。無稽之言勿聽，弗詢之謀勿庸。」',
        translation: 'The Emperor said: "Come, Yu. The great floods alerted us, and you achieved success... The mind of man is restless, prone to err; its affinity for the right way is small. Be discriminating, be undivided, that you may sincerely hold fast the Mean."'
      }
    ]
  },
  {
    id: 'shi-jing',
    schoolId: 'confucianism',
    title: '詩經',
    genreStrategy: 'parallel',
    sourceNote: '中國最早之詩歌總集，開創文學風雅傳統。',
    chapters: [
      {
        title: '國風·周南·關雎',
        text: '關關雎鳩，在河之洲。窈窕淑女，君子好逑。參差荇菜，左右流之。窈窕淑女，寤寐求之。求之不得，寤寐思服。悠哉悠哉，輾轉反側。參差荇菜，左右采之。窈窕淑女，琴瑟友之。參差荇菜，左右芼之。窈窕淑女，鐘鼓樂之。',
        translation: 'Guan guan go the ospreys, on the islet in the river. The gentle, graceful girl is a good mate for the gentleman. Uneven water-lilies, float left and right...'
      },
      {
        title: '國風·秦風·蒹葭',
        text: '蒹葭蒼蒼，白露為霜。所謂伊人，在水一方。溯洄從之，道阻且長。溯游從之，宛在水中央。蒹葭淒淒，白露未晞。所謂伊人，在水之湄。溯洄從之，道阻且躋。溯游從之，宛在水中坻。',
        translation: 'The reeds are luxuriant and green, the white dew is turned into frost. The one I long for is on the other side of the water...'
      }
    ]
  },
  {
    id: 'li-ji',
    schoolId: 'confucianism',
    title: '禮記',
    genreStrategy: 'argumentative',
    sourceNote: '記載儒家禮儀制度與社會哲學。',
    chapters: [
      {
        title: '禮運·大同篇',
        text: '大道之行也，天下為公：選賢與能，講信修睦。故人不獨親其親，不獨子其子；使老有所終，壯有所用，幼有所長，矜寡孤獨廢疾者皆有所養；男有分，女有歸。貨惡其棄於地也，不必藏於己；力惡其不出於身也，不必為己。是故謀閉而不興，盜竊亂賊而不作，故外戶而不閉。是謂大同。',
        translation: 'When the Great Way prevailed, the world was shared by all. Sages and capable men were chosen... Thus men did not only love their own parents, nor only nurture their own children...'
      }
    ]
  },
  {
    id: 'chun-qiu',
    schoolId: 'confucianism',
    title: '春秋',
    genreStrategy: 'narrative',
    sourceNote: '魯國之編年史，微言大義。',
    chapters: [
      {
        title: '曹劌論戰（左傳節選）',
        text: '十年春，齊師伐我。公將戰。曹劌請見。其鄉人曰：「肉食者謀之，又何間焉？」劌曰：「肉食者鄙，未能遠謀。」乃入見。問：「何以戰？」公曰：「衣食所安，弗敢專也，必以分人。」對曰：「小惠未徧，民弗從也。」公曰：「犧牲玉帛，弗敢加也，必以信。」對曰：「小信未孚，神弗福也。」公曰：「小大之獄，雖不能察，必以情。」對曰：「忠之屬也。可以一戰。戰則請從。」',
        translation: 'In the spring of the tenth year, the Qi army invaded us. The Duke was about to battle. Cao Gui requested an audience. His townsman said: "The meat-eaters will plan it, why interfere?"...'
      }
    ]
  },
  {
    id: 'gu-wen-guan-zhi',
    schoolId: 'literature',
    title: '古文觀止',
    genreStrategy: 'parallel',
    sourceNote: '清代編選之歷代名篇散文精華，文學殿堂之階梯。',
    chapters: [
      {
        title: '桃花源記（陶淵明）',
        text: '晉太元中，武陵人捕魚為業。緣溪行，忘路之遠近。忽逢桃花林，夾岸數百步，中無雜樹，芳草鮮美，落英繽紛。漁人甚異之，復前行，欲窮其林。林盡水源，便得一山，山有小口，彷彿若有光。便捨船，從口入。初極狹，才通人。復行數十步，豁然開朗。土地平曠，屋舍儼然，有良田、美池、桑竹之屬。阡陌交通，雞犬相聞。其中往來種作，男女衣著，悉如外人。黃髮垂髫，並怡然自樂。',
        translation: 'During the Taiyuan era of the Jin dynasty, a man from Wuling earned his living by fishing. He followed a stream, forgetting how far he had gone. Suddenly he came upon a peach blossom forest...'
      },
      {
        title: '陋室銘（劉輿錫）',
        text: '山不在高，有仙則名。水不在深，有龍則靈。斯是陋室，惟吾德馨。苔痕上階綠，草色入簾青。談笑有鴻儒，往來無白丁。可以調素琴，閱金經。無絲竹之亂耳，無案牘之勞形。南陽諸葛廬，西蜀子雲亭。孔子云：「何陋之有？」',
        translation: 'A mountain need not be high, it is famous if an immortal dwells there. Water need not be deep, it is sacred if a dragon is present. This is a humble room, but my virtue makes it fragrant...'
      },
      {
        title: '岳陽樓記（范仲淹）',
        text: '慶曆四年春，滕子京謫守巴陵郡。越明年，政通人和，百廢具興。乃重修岳陽樓，增其舊制，刻唐賢今人詩賦於其上。屬予作文以記之。予觀夫巴陵勝狀，在洞庭一湖。銜遠山，吞長江，浩浩湯湯，橫無際涯；朝暉夕陰，氣象萬千。此則岳陽樓之大觀也，前人之述備矣。然則北通巫峽，南極瀟湘，遷客騷人，多會於此，覽物之情，得無異乎？',
        translation: 'In the spring of the fourth year of Qingli, Teng Zijing was banished to guard Baling Prefecture. In the following year, the administration flourished and the people lived in harmony...'
      },
      {
        title: '前赤壁賦（蘇軾）',
        text: '壬戌之秋，七月既望，蘇子與客泛舟遊於赤壁之下。清風徐來，水波不興。舉酒屬客，誦明月之詩，歌窈窕之章。少焉，月出於東山之上，徘徊於斗牛之間。白露橫江，水光接天。縱一葦之所如，凌萬頃之茫然。浩浩乎如馮虛御風，而不知其所止；飄飄乎如遺世獨立，羽化而登仙。',
        translation: 'In the autumn of the year Renxu, on the day after the full moon in the seventh month, Master Su and his guests sailed on a boat beneath the Red Cliff. A gentle breeze blew, and the water was quiet...'
      },
      {
        title: '出師表（諸葛亮）',
        text: '先帝創業未半而中道崩殂，今天下三分，益州疲弊，此誠危急存亡之秋也。然侍衛之臣不懈於內，忠志之士忘身於外者，蓋追先帝之殊遇，欲報之於陛下也。誠宜開張聖聽，以光先帝遺德，恢弘志士之氣，不宜妄自菲薄，引喻失義，以塞忠諫之路也。宮中府中，俱為一體；陟罰臧否，不宜異同。',
        translation: 'The Late Emperor had not completed half of his great task when he passed away. Today the world is divided into three, and Yizhou is exhausted. This is indeed a critical moment of life and death...'
      }
    ]
  }
];

// ─────────────────────────────────────────────────
// Read works.ts, parse, append, and rewrite
// ─────────────────────────────────────────────────
import { works, chapters, passages, sentences } from '../src/data/works.ts';

const updatedWorks = [...works];
const updatedChapters = [...chapters];
const updatedPassages = [...passages];
const updatedSentences = [...sentences];

newWorksData.forEach((wData) => {
  const workId = wData.id;
  const chapterIds = [];
  let totalChars = 0;
  
  wData.chapters.forEach((chData, chIdx) => {
    const chapterId = `${workId}_ch-${chIdx + 1}`;
    chapterIds.push(chapterId);
    
    // Character count (pure Chinese characters, no punctuation)
    totalChars += chData.text.replace(/[，。；！？、：\s（）『』「」]/g, '').length;
    
    const passageId = `${chapterId}_p-1`;
    const sentenceTexts = splitSentences(chData.text);
    const sentenceIds = [];
    
    sentenceTexts.forEach((sText, sIdx) => {
      const sentenceId = `${passageId}_s-${sIdx + 1}`;
      sentenceIds.push(sentenceId);
      
      const chunks = splitChunks(sText, sentenceId);
      
      updatedSentences.push({
        id: sentenceId,
        passageId,
        order: sIdx + 1,
        canonicalText: sText,
        chunks,
        translationHint: chData.translation,
        tags: []
      });
    });
    
    updatedPassages.push({
      id: passageId,
      chapterId,
      order: 1,
      canonicalText: chData.text,
      sentenceIds,
      sourceRefs: [{ label: "通行本", edition: "中哲會" }]
    });
    
    updatedChapters.push({
      id: chapterId,
      workId,
      order: chIdx + 1,
      title: chData.title,
      difficulty: 2,
      estimatedMinutes: Math.max(1, Math.round(chData.text.length / 100)),
      passageIds: [passageId],
      tags: []
    });
  });
  
  updatedWorks.push({
    id: workId,
    schoolId: wData.schoolId,
    title: wData.title,
    genreStrategy: wData.genreStrategy,
    sourceNote: wData.sourceNote,
    chapterIds,
    totalChars
  });
});

// Write updated works.ts
const worksTsContent = `// ─────────────────────────────────────────────────
// 經典文脈 ClassicFlow — 典籍內容資料庫
// 自動生成於: ${new Date().toISOString()}
// ─────────────────────────────────────────────────
import type { Work, Chapter, Passage, Sentence } from '../types/content'

export const works: Work[] = ${JSON.stringify(updatedWorks, null, 2)};

export const chapters: Chapter[] = ${JSON.stringify(updatedChapters, null, 2)};

export const passages: Passage[] = ${JSON.stringify(updatedPassages, null, 2)};

export const sentences: Sentence[] = ${JSON.stringify(updatedSentences, null, 2)};
`;

fs.writeFileSync(worksPath, worksTsContent, 'utf8');
console.log(`Successfully appended 10 new works! Total works in DB: ${updatedWorks.length}, Total chapters: ${updatedChapters.length}`);
