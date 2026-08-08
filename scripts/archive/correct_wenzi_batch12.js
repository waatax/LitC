import fs from 'fs';

const corrections = {
  'wenzi_ch-3_p-65': {
    translation: '平王問文子說：我聽說您從老聃那裡得到道。如今賢人即使有道，卻遭逢淫亂的時代，只靠一個人的權力，想感化長久混亂的人民，真能做到嗎？文子說：道德可以匡正衰敗，使它返回正軌；振起亂局，使它得到治理；改變淫亂敗壞，使風俗返回淳樸。淳厚之德重新產生，天下安寧，關鍵可以從一人開始。君主是人民的老師，在上者是下民的儀表；在上者讚美什麼，下民便以之為生活取向。在上者有道德，下民便有仁義；下民有仁義，便不會形成淫亂的世道。積累德行可以成就王業，積累怨恨可以導致滅亡；石頭積聚成山，水流匯積成海，從來沒有不經積累便能成就的事。積累道德的人，上天支持他，大地幫助他，鬼神輔佐他；鳳凰棲息於庭院，麒麟遊行於郊野，蛟龍宿在池沼。所以用道端正天下，是天下的恩德；無道卻治理天下，是天下的禍賊。以一個人和天下為仇，即使想長久維持，也不可能。堯舜因此昌盛，桀紂因此滅亡。平王說：我領受您的教誨了。',
    analysis: '【主旨】本段回答一人能否改變亂世：影響可以從君主示範開始，但成敗不是一時命令，而是德或怨長期累積的結果。\n【關鍵詞義】「上美之則下食之」指上位者所推崇的價值會成為下民生活取向；「邪天下」依上下文作端正天下理解，原字仍待版本核定；祥瑞意象用來象徵德治與天地相應。\n【章法與思想】由平王質疑一人之權能否化民開始，文子以師表作用回答，再連用積德、積怨、積石、積水四組累積譬喻，最後用堯舜桀紂對照。重點不是權力瞬間改造，而是上行下效的長期放大。'
  },
  'wenzi_ch-6_p-1': {
    translation: '老子說：君主好比國家的心。心安定清明，全身各個關節便都安適；心受到擾亂，各個關節也都混亂。因此一個人身體調和時，各肢體各盡作用，彼此甚至感覺不到對方的存在；國家治理良好時，君臣各安職分，也不必彼此刻意牽制。',
    analysis: '【主旨】本段以心與百節比喻君主和國家：中樞清明，組織各部分便能自然協調；中樞紛擾，混亂會傳遍全體。\n【關鍵詞義】「支體相遺」「君臣相忘」不是互相遺棄，而是運作順暢到不必刻意干預、牽制。\n【章法與思想】先建立國主如心的譬喻，再以心治、心擾對照百節安亂，最後平行比較身治與國治。無為在此指協調到各安其位，而不是君臣失去責任。'
  },
  'wenzi_ch-6_p-6': {
    translation: '老子說：薄的逐漸積累可以成厚，低的逐漸積累可以成高。君子天天勤勉，終能成就光明；小人天天自得快意，最後走向恥辱。這些增減消長雖未必立刻看得出來，所以見到善行要像怕趕不上一樣努力，看到不善要像遇到不祥一樣警惕。只要一心向善，即使有過失也少招怨；若不向善，即使自稱忠誠也可能招致厭惡。因此怨恨別人不如反省自己，勉強向別人求取不如向自己求。聲譽由自己招來，同類由自己感召，名聲由自己造成，官位也由人的表現形成，沒有一件完全與自己無關。自己拿著尖器刺人、拿著刀刃攻擊，又能怨誰？所以君子慎重細微開端。萬物背陰而抱陽，陰陽相沖所成之氣形成和諧；和居於中央。因此木本果實從內核生發，草本果實從花英形成，卵與胎也從中央孕育；但無論卵生胎生，生成都必須等待適當時機。地面完全平坦，水便不流；秤的兩端輕重相等，衡杆便不傾。萬物的生成變化，都因條件感應而發生。',
    analysis: '【主旨】本段把人格成敗理解為細微行為長期積累，並以陰陽、果實、胚胎、水流與衡器說明變化必須具備差異、感應和時機。\n【版本提示】「宿不善」「雖忠來惡」等字句在現有傳文中不穩，白話依見善趨赴、見惡警戒及向善與否的對比處理，保留原文核定。\n【章法與思想】前半從積薄成厚推到求諸己與慎微；後半由「負陰抱陽，沖氣為和」展開自然譬喻。倫理積累與自然生成共享同一結構：結果不是突發，而由細小條件逐步形成。'
  },
  'wenzi_ch-7_p-3': {
    translation: '老子說：有什麼不能做到呢？大概只有真正懂得言語意義的人才明白吧！所謂懂得言語，不是只靠言辭表面來理解。爭著捕魚的人會弄濕身體，追逐野獸的人會奔跑，並不是喜愛濕身或奔跑本身，而是為了所追求的目標。因此最高的言說會超越言辭，最高的作為會去除造作；見識淺薄的人，爭論的只是末節。正如所說：「言語有根宗，事務有主宰；人們因為不了解，所以也不了解我。」',
    analysis: '【主旨】本段區分手段與目的：涉水、奔跑是為魚獸，言語與行動也是通往根本的工具；若只爭字面末節，反而失去言之宗、事之君。\n【關鍵詞義】「不以言言」是不把字面言辭當成全部；「至言去言」是最高言說不執著言辭；末引文出自《道德經》第七十章，今本作「言有宗，事有君。夫唯無知，是以不我知」。\n【章法與思想】以知言設問，接著用捕魚逐獸的目的性作譬喻，再提出至言、至為，最後用《道德經》引文指出理解須掌握根本。'
  },
  'wenzi_ch-7_p-5': {
    translation: '老子說：拉車的人，前面呼喊「邪軤」一類號子，後面的人也跟著應和；這是拉車時勉勵眾人出力的歌聲。即使鄭、衛、胡、楚各地音樂優美，也不如這號子切合共同工作的意義。治理國家貴在有合宜秩序，不在辭藻華麗、辯說繁多。正如所說：「法令愈加繁多彰顯，盜賊反而愈多。」',
    analysis: '【主旨】本段以拉車號子說明語言與禮法的價值在能否協調共同實踐，不在聲音華美或文辭繁複。\n【關鍵詞義】「邪軤」是挽車時的應和聲，主要功能是統一步伐、勸力；鄭衛胡楚代表各地音樂；末句化用《道德經》第五十七章。\n【章法與思想】先描寫一呼一應的勞動場景，再拿實用號子與多地音樂比較，轉到治國之禮，最後以繁法增盜作反證。這不是排斥語言藝術，而是要求制度形式服務實際協作。'
  }
};

const file = 'src/data/readingAid.ts';
let source = fs.readFileSync(file, 'utf8');
const entryPattern = /'([^']+)'\s*:\s*\{\s*translation:\s*"((?:\\.|[^"\\])*)",\s*analysis:\s*"((?:\\.|[^"\\])*)"\s*\}/gs;
let replaced = 0;
source = source.replace(entryPattern, (whole, id) => {
  const correction = corrections[id];
  if (!correction) return whole;
  replaced += 1;
  return `'${id}': {\n    translation: ${JSON.stringify(correction.translation)},\n    analysis: ${JSON.stringify(correction.analysis)}\n  }`;
});
if (replaced !== Object.keys(corrections).length) throw new Error(`Expected ${Object.keys(corrections).length}, replaced ${replaced}.`);
fs.writeFileSync(file, source, 'utf8');

const reviewFile = 'src/data/editorialReviews.json';
const reviewData = JSON.parse(fs.readFileSync(reviewFile, 'utf8'));
for (const passageId of Object.keys(corrections)) {
  if (reviewData.reviews.some((review) => review.passageId === passageId)) throw new Error(`Duplicate review: ${passageId}`);
  const chapterSource = passageId.startsWith('wenzi_ch-3')
    ? 'https://ctext.org/wenzi/jiu-shou/zh'
    : passageId.startsWith('wenzi_ch-6')
      ? 'https://ctext.org/wenzi/shang-de/zh'
      : 'https://ctext.org/wenzi/ce-ming/zh';
  reviewData.reviews.push({
    passageId,
    canonicalText: 'pending',
    translation: 'verified',
    analysis: 'verified',
    sources: [chapterSource, 'https://ctext.org/dao-de-jing/zh', 'https://www.xuanxuecenter.com/files/wen_zi_tong_xuan_zhen_jing.pdf'],
    reviewedAt: '2026-07-29'
  });
}
reviewData.updatedAt = '2026-07-29';
fs.writeFileSync(reviewFile, `${JSON.stringify(reviewData, null, 2)}\n`, 'utf8');
console.log(`Corrected ${replaced} Wenzi translations and analyses.`);
