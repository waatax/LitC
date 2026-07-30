import fs from 'fs';

const file = 'src/data/works.ts';
let source = fs.readFileSync(file, 'utf8');
const matches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)];
if (matches.length < 4) throw new Error('Unable to decode corpus arrays');
const arrays = matches.map((match) => JSON.parse(decodeURIComponent(match[1])));
const [works, chapters, passages, sentences] = arrays;
const chapterId = 'gu-wen-guan-zhi_ch-182';
const chapter = chapters.find((item) => item.id === chapterId);
if (!chapter) throw new Error('Chapter not found');
if (passages.some((item) => item.id === `${chapterId}_p-260a`)) {
  console.log('賈誼論缺文已補，無需重複執行。');
  process.exit(0);
}

const additions = [
  {
    id: `${chapterId}_p-260a`,
    order: 4,
    lines: [
      ['夫絳侯親握天子璽而授之文帝、灌嬰連兵數十萬、以決劉呂之雌雄、又皆高帝之舊將。', '絳侯周勃曾親手捧著天子璽符交給漢文帝，灌嬰也曾統率數十萬軍隊，決定劉氏與呂氏的勝負；兩人又都是漢高祖的舊將。'],
      ['此其君臣相得之分、豈特父子骨肉手足哉。', '他們與文帝君臣相知的情分，豈只是一般父子兄弟的親密可以相比？'],
      ['賈生洛陽之少年、欲使其一朝之間、盡棄其舊而謀其新、亦已難矣。', '賈誼只是洛陽的一位青年，想讓文帝在一朝之間盡棄舊臣、改和新人謀政，本來就很困難。'],
      ['爲賈生者、上得其君、下得其大臣、如絳灌之屬、優游浸漬而深交之、使天子不疑、大臣不忌、然後舉天下而唯吾之所欲爲、不過十年、可以得志。', '如果我是賈誼，便會向上取得君主信任，向下取得周勃、灌嬰等大臣的信任，從容漸進地和他們建立深交，使天子不疑、大臣不忌；如此不出十年，便能依照自己的理想推行天下政事。'],
      ['安有立談之間、而遽爲人痛哭哉。', '哪有才談片刻，便立刻替天下人痛哭的道理呢？'],
      ['觀其過湘、爲賦以弔屈原、縈紆鬱悶、趯然有遠舉之志。', '看他經過湘水、作賦憑弔屈原，文意迴旋鬱結，顯然流露出遠離塵世的念頭。'],
      ['其後以自傷哭泣、至於夭絕。', '後來他又因哀傷哭泣，竟至早逝。'],
      ['是亦不善處窮者也。', '這也是不善於面對困境。'],
      ['夫謀之一不見用、則安知終不復用也。', '一項主張暫時未被採用，怎麼知道以後永遠不會再被採用？'],
      ['不知默默以待其變、而自殘至此。', '他不懂沉靜等待局勢轉變，反而把自己傷害到這個地步。'],
      ['嗚呼、賈生志大而量小、才有餘而識不足也。', '唉！賈誼志向遠大而器量狹小，才華有餘而見識不足。'],
    ],
  },
  {
    id: `${chapterId}_p-260b`,
    order: 5,
    lines: [
      ['古之人、有高世之才、必有遺俗之累。', '古代具有超越世俗才華的人，往往也有不合世俗所帶來的牽累。'],
      ['是故非聰明睿智不惑之主、則不能全其用。', '所以若不是聰明睿智而不受蒙蔽的君主，就不能充分發揮這種人才的作用。'],
      ['古今稱苻堅得王猛於草茅之中、一朝盡斥去其舊臣、而與之謀。', '古今都稱道前秦苻堅從民間得到王猛，一朝排開舊臣，專心和王猛謀劃國事。'],
      ['彼其匹夫略有天下之半、其以此哉。', '苻堅由一介平民而幾乎占有半個天下，大概正因為能如此用人吧！'],
      ['愚深悲生之志、故備論之。', '我深深同情賈誼的志向，所以詳盡評論他的遭遇。'],
      ['亦使人君得如賈生之臣、則知其有狷介之操、一不見用、則憂傷病沮、不能復振。', '也希望君主得到賈誼這類臣子時，知道他性情耿直孤高，一旦不受任用便可能憂傷受挫，再也振作不起。'],
      ['而爲賈生者、亦謹其所發哉。', '至於身為賈誼這一類人才的人，也應謹慎自己情志與言論的發露啊！'],
    ],
  },
];

const splitChunks = (text, sentenceId) => {
  const parts = text.match(/[^、，。；！？]+[、，。；！？]?/g) || [text];
  return parts.map((part, index) => ({ id: `${sentenceId}_c-${index + 1}`, sentenceId, order: index + 1, text: part }));
};
let sequence = 0;
for (const addition of additions) {
  const sentenceIds = addition.lines.map((_, index) => `${addition.id}_s-new-${index + 1}`);
  passages.push({
    id: addition.id,
    chapterId,
    order: addition.order,
    canonicalText: addition.lines.map(([text]) => text).join(''),
    sentenceIds,
    sourceRefs: [{ label: '蘇軾' }],
  });
  addition.lines.forEach(([canonicalText, translationHint], index) => {
    const id = sentenceIds[index];
    sentences.push({ id, passageId: addition.id, order: 5262 + (++sequence / 100), canonicalText, translationHint, chunks: splitChunks(canonicalText, id), tags: [] });
  });
}
chapter.passageIds.push(...additions.map((item) => item.id));
chapter.estimatedMinutes = 5;
const work = works.find((item) => item.id === 'gu-wen-guan-zhi');
const normalizedLength = additions.flatMap((item) => item.lines).reduce((sum, [text]) => sum + text.replace(/\s+/g, '').replace(/[，。！？；：、「」『』（）《》〈〉、]/g, '').length, 0);
if (work) work.totalChars += normalizedLength;

for (let index = matches.length - 1; index >= 0; index--) {
  const match = matches[index];
  const encoded = encodeURIComponent(JSON.stringify(arrays[index]));
  const start = match.index;
  const end = start + match[0].length;
  source = `${source.slice(0, start)}JSON.parse(decodeURIComponent("${encoded}"))${source.slice(end)}`;
}
fs.writeFileSync(file, source, 'utf8');
console.log(`已補 2 段、${sequence} 句，新增正文淨字數 ${normalizedLength}。`);
