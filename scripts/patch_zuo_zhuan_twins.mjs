import fs from 'fs';
import path from 'path';
import vm from 'vm';

function loadBundle(file) {
  const source = fs.readFileSync(file, 'utf8');
  const start = source.indexOf('JSON.parse(');
  const end = source.lastIndexOf(') as WorkBundle');
  const expression = source.slice(start, end + 1);
  return vm.runInNewContext(expression, Object.create(null), { timeout: 5_000 });
}

const zqPath = path.resolve('src/data/work_chunks/chun-qiu-zuo-zhuan.ts');
const bundle = loadBundle(zqPath);

const p19 = bundle.passages.find((x) => x.id === 'chun-qiu-zuo-zhuan_ch-2_p-19');
if (p19) {
  p19.readingAid.translation = `魯桓公二年春季，宋國華督發兵攻打孔氏，殺害了孔父嘉並搶奪了他的妻子。宋殤公大怒，華督心生恐懼，於是弑殺了宋殤公。君子認為華督早就懷有無君叛逆之心，然後才付諸惡行，所以《春秋》經文首先記載他弑殺國君。諸侯在稷地會盟，平定了宋國的內亂，魯桓公因為接受了宋國賄賂的緣故，立了公子馮為宋莊公。宋殤公在位十年，打了十一場仗，百姓苦不堪言。孔父嘉擔任司馬，華督擔任太宰，華督藉著百姓不堪重負，散布謠言說：「這都是司馬造成的！」殺了孔父嘉並弑殺殤公後，從鄭國迎立莊公以親附鄭國。華督用郜國大鼎賄賂魯桓公，齊國、陳國、鄭國也都接受了賄賂，所以華督遂順利擔任宋國國相。\n夏季四月，魯桓公從宋國取回郜大鼎。戊申日，將大鼎安放在魯國太廟之中，這完全是不合禮制的違法行徑。\n臧哀伯進諫說：「做人君的人，應當昭示美德、堵塞邪惡以照臨百官，還唯恐有所缺失，所以要昭顯美德留示子孫。因此太廟採用茅草屋頂，大路車使用蒲席，大羹不加調味，黍稷之食不用精米，這是昭示節儉；袞冕、黻紋、玉珽、大帶、下裳、行縢、赤舄、冠衡、紞帶、紘纓、綖板，這是昭示法度；藻飾、刀鞘、弓袋、革帶、佩玉、旗旒、馬纓，這是昭示等級禮數；火龍、黼黻花紋，這是昭示文采；五色相配之圖象，這是昭示品物制度；鍚鈴、鸞鈴、和鈴、懸鈴，這是昭示和諧之聲；日月星辰旌旗，這是昭示光明。德行節儉而有法度，升降有序，以文飾器物記錄，以音聲昭明顯發，以此照臨百官。百官因而警惕敬畏而不敢毀亂綱紀。\n如今毀滅道德、樹立邪亂，卻將受賄之贓器安放在太廟之中以明示百官，百官起而效尤，國君又將如何誅責他們呢！國家的敗亡，起因於官員的邪惡；官員的失德，是由於貪婪受賄肆無忌憚。郜鼎擺在太廟之中，還有比這更嚴重的受賄彰顯嗎？周武王克商，將九鼎遷至雒邑，尚且有義士予以非議；何況如今竟將象徵違法悖亂之賄器公開昭示於太廟，這又將如何向天下交代呢？」\n魯桓公不聽勸諫。周朝內史聽聞此事說：「臧孫達其後代必在魯國長久昌盛！國君違法失德，他能不忘以道德大義進諫。」`;
}

const p68 = bundle.passages.find((x) => x.id === 'chun-qiu-zuo-zhuan_ch-2_p-68');
if (p68) {
  p68.readingAid.translation = `楚武王侵犯隨國邊境，派遣薳章前去隨國求和，楚軍駐紮在瑕地等待消息。隨國派遣少師出面主持議和談判。楚國大夫鬥伯比向楚武王進言說：「我們楚國在漢江以東一直未能得志，這完全是我們自己的策略失誤所致。我們每次都耀武揚威張揚三軍、身披堅甲利兵，以武力凌逼他們，他們因為害怕而團結協作共同抵禦我們，所以很難離間他們。漢東諸國之中，以隨國最大。隨國如果自大驕傲，必然會拋棄周邊小國；小國與隨國離心離德，這正是楚國的最大利益！隨國少師為人驕橫狂妄，請大王故意示弱，派出羸弱疲敝的軍隊以助長其驕橫之心。」楚臣熊率且比說道：「隨國賢臣季梁還在，示弱有何益處？」鬥伯比說：「這是為了以後長遠謀劃。少師深受隨侯寵信。」楚武王於是故意毀壞軍容，接見少師。\n少師回國後，請求隨侯出兵追擊楚軍，隨侯打算同意。賢臣季梁制止說：「上天正要假手於楚國以成就其大。楚國軍隊故意顯得羸弱，這分明是在誘騙我們，大王何必如此急躁呢？臣聽說小國之所以能夠抵擋大國，是因為小國行正道而大國行淫暴。所謂正道，就是對內忠於人民，對外取信於神明。在上位者心心念念利澤人民，這就是忠；祝官史官在祭祀時如實稟告，這就是信。如今百姓飢寒交迫而國君放縱私欲，祝史在祭祀時謊報政績欺騙神靈，臣不知道這樣如何能取勝！」\n隨侯問道：「我的祭祀犧牲純色肥壯，黍稷祭品豐美完備，神明何以不信？」季梁回答說：「人民，才是神靈的主人！因此古代聖王總是先成就造福人民，然後才致力於事奉神靈。因此奉獻牲畜祭品時告慰神明說『碩大肥壯』，是指人民的財富普遍充裕，六畜繁衍碩大無病，各類物資完備無缺；奉獻黍稷時告慰神明說『潔淨豐盛』，是指春夏秋三季農事不受損害，人民和睦而年歲豐收；奉獻美酒時告慰神明說『醇美佳釀』，是指舉國上下皆具美德而無叛逆之心。祭祀所謂的馨香，是指沒有諂媚邪惡之言。因此做好三時農事，修明五常教化，親和九族宗親，以此舉行隆重祭祀，於是人民和睦而神靈降下福祉，凡有行動必定成功！如今百姓各懷異心，鬼神失去依託，大王即使獨自祭品豐盛，又能求得什麼福澤呢？大王姑且整頓內政，親和兄弟邦國，或許還能免於災禍。」隨侯聽後深感恐懼，於是修明治道，楚國軍隊最終不敢進攻隨國。`;
}

// Re-split sentences
const allSentences = [];
bundle.passages.forEach((p) => {
  const rawClauses = p.canonicalText
    .split(/(?<=[。！？；\n])/)
    .map((c) => c.trim())
    .filter(Boolean);

  const sids = [];
  rawClauses.forEach((c, cidx) => {
    const sid = `${p.id}_s-${cidx + 1}`;
    sids.push(sid);
    allSentences.push({
      id: sid,
      workId: 'chun-qiu-zuo-zhuan',
      chapterId: p.chapterId,
      passageId: p.id,
      order: cidx + 1,
      canonicalText: c,
      chunks: [],
    });
  });

  p.sentenceIds = sids;
});

bundle.sentences = allSentences;

const updatedZqContent = `import type { WorkBundle } from '../workLoader'

export default JSON.parse(
  ${JSON.stringify(JSON.stringify(bundle, null, 2))}
) as WorkBundle
`;

fs.writeFileSync(zqPath, updatedZqContent, 'utf8');
console.log('Successfully patched ZuoZhuan twins passages.');
