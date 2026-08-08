import fs from 'fs';

const full = JSON.parse(fs.readFileSync('./scratch/liu_tao_full_source.json', 'utf8'));
const additions = full.chapters.filter(item => item.volume === '龍韜');
if (additions.length !== 13) throw new Error(`Expected 13 龍韜 chapters, got ${additions.length}`);
const worksPath = './src/data/works.ts';
let source = fs.readFileSync(worksPath, 'utf8');
function readArray(name, type) {
  const re = new RegExp(`export const ${name}: ${type}\\[\\] = JSON\\.parse\\(decodeURIComponent\\(\"([^\"]+)\"\\)\\);`);
  const match = source.match(re);
  if (!match) throw new Error(`Cannot find ${name}`);
  return { re, value: JSON.parse(decodeURIComponent(match[1])) };
}
const wd = readArray('works', 'Work');
const cd = readArray('chapters', 'Chapter');
const pd = readArray('passages', 'Passage');
const sd = readArray('sentences', 'Sentence');
const work = wd.value.find(item => item.id === 'liu-tao');
const refs = [
  { label: '經文底本', edition: '《四部叢刊初編》本《六韜、吳子、司馬法》' },
  { label: '數位對校', edition: '維基文庫《六韜》標點本；中國哲學書電子化計劃《六韜》' },
];
const splitSentences = text => text.match(/[^。！？；]+[。！？；]?/g)?.map(item => item.trim()).filter(Boolean) ?? [text];
for (const item of additions) {
  const chId = `liu-tao_ch-${item.order}`;
  const pId = `${chId}_p-1`;
  cd.value = cd.value.filter(ch => ch.id !== chId);
  pd.value = pd.value.filter(p => p.id !== pId);
  sd.value = sd.value.filter(s => s.passageId !== pId);
  const parts = splitSentences(item.text);
  const sentenceIds = parts.map((_, index) => `${pId}_s-${index + 1}`);
  cd.value.push({ id: chId, workId: 'liu-tao', order: item.order, title: `龍韜・${item.title}`, difficulty: 4, estimatedMinutes: Math.max(4, Math.ceil(item.text.length / 165)), passageIds: [pId], tags: ['六韜', '龍韜', item.title, '武經七書'] });
  pd.value.push({ id: pId, chapterId: chId, order: 1, canonicalText: item.text, sentenceIds, sourceRefs: refs });
  parts.forEach((text, index) => {
    const id = sentenceIds[index];
    sd.value.push({ id, passageId: pId, order: index + 1, canonicalText: text, chunks: [{ id: `${id}_c-1`, sentenceId: id, order: 1, text }], tags: ['六韜', '龍韜', item.title] });
  });
}
work.chapterIds = Array.from({ length: 30 }, (_, index) => `liu-tao_ch-${index + 1}`);
work.totalChars = sd.value.filter(item => item.id.startsWith('liu-tao_')).reduce((sum, item) => sum + item.canonicalText.length, 0);
work.sourceNote = '《六韜》校補進行中：文韜十二篇、武韜五篇、龍韜十三篇已齊；虎、豹、犬三韜待依六卷六十篇次續補。經文以《四部叢刊初編》本為底本，參校《續古逸叢書》本、《六韜直解》及公開標點本。';
source = source.replace(wd.re, `export const works: Work[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(wd.value))}"));`);
source = source.replace(cd.re, `export const chapters: Chapter[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(cd.value))}"));`);
source = source.replace(pd.re, `export const passages: Passage[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(pd.value))}"));`);
source = source.replace(sd.re, `export const sentences: Sentence[] = JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(sd.value))}"));`);
fs.writeFileSync(worksPath, source, 'utf8');

const aids = {
  18: ['武王問統軍需要哪些輔佐人員。太公說全軍以將帥為命，將帥須通權達變、按專長授職，配置七十二名羽翼：腹心總攬計謀；謀士議安危賞罰；天文、地利人員察時候地形；兵法人員整備武器法紀；通糧者掌補給；奮威者選材論兵；伏鼓旗者掌祕密號令；股肱者築壘任重；通材者補過接賓；權士行奇變；耳目刺探情報；爪牙激勵攻堅；羽翼宣威弱敵；遊士充當間諜；術士以譎詐惑眾；方士治療金瘡疾病；法算人員核計營壘、糧食與財用。各類異能齊備，軍務才可周全。', '【主旨】〈王翼〉提出以將帥為核心、七十二名專業人員分工的軍事幕僚體系。\n【詞義】「應卒」為應付突發；「刺舉」為檢舉糾察；「伏鼓旗」指隱蔽旗鼓與號令；「金瘡」是兵刃創傷。\n【制度】篇中涵蓋參謀、情報、工程、後勤、醫療與財務，重點是因能授職，不宜只概括為「團隊合作」。'],
  19: ['太公說將領應具勇、智、仁、信、忠五種才德，同時有十種可被敵人利用的過失：輕死、急躁、貪利、仁而不忍、智而膽怯、輕信、廉潔卻不愛人、智而遲緩、剛愎自用、懦弱而依賴他人。敵人可分別用激怒、拖延、賄賂、疲勞、困迫、欺騙、侮辱、突襲、奉承或蒙蔽加以利用。軍事關乎國家存亡，任將必須審慎；軍隊越境後勝負往往迅速決定，不是亡國便是破軍殺將。', '【主旨】〈論將〉以五材定正面標準，以十過分析性格弱點與敵方利用方式。\n【詞義】「可暴」指可用激怒使其暴露；「可久」指可用持久拖延；「可事」指可用奉承順事操控。\n【思想】同一品格過度或失去配合便成弱點，選將須看整體判斷力，不可只崇尚勇敢。'],
  20: ['武王問如何識別人才。太公先列十五種外貌與內情不相應的情況：外表嚴肅未必賢良，溫良者可能為盜，恭敬者可能內心傲慢；也有人看似恍惚卻忠實、言行激切卻有功、外形弱劣卻無事不成。真正識人須用八種考驗：以一般問答觀言辭，以追問觀應變，以祕密謀議觀誠信，以公開質問觀德行，以財貨觀廉潔，以女色觀貞守，以危難觀勇氣，以飲酒觀儀態。八項具備，賢與不肖才可分辨。', '【主旨】〈選將〉反對以外貌定人，提出八徵作多情境考察。\n【詞義】「精精」指精明外露；「湛湛」指沉靜深厚貌；「悾悾」為誠懇貌；「嗃嗃」為嚴酷急切貌。\n【辨析】八徵反映古代試人觀念，其中以色、醉酒試人有倫理侷限；可取的是多證據、重行為而非相貌的原則。'],
  21: ['國家有難時，君主避開正殿，授命將軍統軍。經太史卜日、太廟授斧鉞後，君主把自上至天、下至淵的軍事處置權交給將領，並告誡察虛實而進止，不可恃眾輕敵、貪必死之名、因尊貴而賤人或獨斷違眾；士卒未坐未食，將領也不可先坐先食，寒暑須共同承受。將領則要求出徵後軍令專一，不受宮中遙控。如此智勇各效其能，軍隊氣勢高昂，可不接刃而使敵降；勝後官兵依功遷賞，國家安寧。', '【主旨】〈立將〉以授斧鉞儀式確立戰時統帥專權，同時用同甘苦與納眾議約束將領。\n【詞義】「鑽靈龜」為灼龜占卜；「斧鉞」象徵生殺與軍事權；「軍不可從中御」指不可由朝廷遙控前線。\n【制度】權責必須一致：君主正式授權，將領承擔勝敗，出徵後保持指揮單一。'],
  22: ['武王問將領如何建立威信與明察，使禁令有效。太公回答：誅罰身分高、罪責大的人以立威；獎賞地位低、功勞確實的人以顯明公正；刑罰審慎準確，禁令才能施行。若處死一人足以震動三軍，便依法處死；賞一人能使萬人喜悅，便予以獎賞。刑可上及權貴重臣，賞可下達牧牛、洗馬、養廄等卑微人員，上下貫通，將威才真正建立。', '【主旨】〈將威〉主張刑不上避權貴、賞不遺卑微，以公正建立軍令威信。\n【詞義】「誅大」指懲治大奸重罪；「賞小」指獎及地位卑小者；「當路」為居要職掌權。\n【思想】威並非任意嚴酷，而來自賞罰能突破身分、依功罪準確施行。'],
  23: ['武王希望士卒攻城野戰都能爭先。太公提出三勝：冬天將領不獨穿皮裘、夏天不獨用扇、雨天不獨張傘，稱為禮將；經過險隘泥濘時率先下車步行，稱為力將；全軍安頓後才住宿、炊食皆熟後才進食、軍中禁火時也不生火，稱為止欲將。將領與士卒共享寒暑、勞苦與飢飽，士卒才會聞鼓進戰而喜、聞金收兵而怒，冒矢石、赴白刃爭先，並非好死，而是感念將領確知其疾苦。', '【主旨】〈勵軍〉以禮將、力將、止欲將說明身教和同甘苦是激勵軍心的根本。\n【詞義】「金聲」為鉦鐸聲，通常表示止退；「定次」指安定營次；「止欲」指剋制個人享受。\n【論證】末段明說士卒不是天生好戰，而是因將領體恤而願效死，將軍心因果落在可見行動。'],
  24: ['武王問深入諸侯國境後，君主與遠方將領如何祕密通信。太公提出八種陰符，以長度表示軍情：一尺代表大勝克敵，九寸代表破軍擒將，八寸代表降城得邑，七寸代表退敵報遠，六寸代表警眾堅守，五寸代表請糧增兵，四寸代表敗軍亡將，三寸代表失利亡士。使者若延誤，或洩露符意與軍情，相關人員皆受嚴懲。符只傳遞預定類別，使敵方即使聰明也不能識別內容。', '【主旨】〈陰符〉記錄以八種長度編碼軍情的主將祕密通信制度。\n【詞義】「近通遠」指由近處聯絡遠軍；「稽留」為延誤滯留；「陰通言語」是暗中傳遞消息。\n【制度】陰符容量有限但辨識快速，安全依賴預先約定、使者紀律與保密；這也引出下篇處理複雜消息的陰書。'],
  25: ['武王問軍情複雜、符節無法說明，而君主與將領相距遙遠時如何通信。太公說重大祕密應改用書信。書信完整寫成後分為三部分，由三名使者各持一份，彼此不知道其他部分；只有三份送達後重新會合，收信者才知道全文。敵人即使截獲一份，也不能明白完整內容，這便稱為陰書。', '【主旨】〈陰書〉提出把一封軍書分成三份、分由三人傳遞的保密方法。\n【詞義】「一合而再離」指完整書信再拆分；「三發而一知」指三路發送、合併後才可讀；「相參」指互相參合。\n【承接】陰符用固定長度傳簡訊，陰書用分割重組傳複雜軍情，兩篇構成不同容量的通信方案。'],
  26: ['太公說軍勢須因敵方行動而形成，變化產生於兩軍陣間，奇正取用無窮。最高機密不可多言，軍事意圖不可顯形；一旦被聽聞便會遭議論，被看見便被圖謀，被知道便受困。善戰者不等軍陣完全張開才求勝，而在禍患未生、勝形未現前處理。上等戰爭甚至沒有正面交戰。將領須先發現敵弱再戰，見可勝便起，不勝則止；最大禍害是猶豫狐疑。見利遇時要迅速決斷，如疾雷迅電使敵不及反應。能守住不可言的機密、看見尚未顯出的徵兆，才可稱神明。', '【主旨】〈軍勢〉論因敵制變、勝於無形、保密與臨機速決。\n【詞義】「奇正」為非常與常規兵法；「玄默」指深密不言；「先見弱於敵」指預先察見敵人弱點；「不釋」是不放過時機。\n【結構】先論隱形保密，再論戰前制勝，最後集中批判猶豫，形成由謀到斷的完整鏈條。'],
  27: ['太公總結奇兵運用皆依地形、敵情與時機：亂列兵卒製造變化，深草供隱遁，溪谷阻車騎，隘塞山林可少擊眾，低濕幽暗處藏形，開闊地較勇力；疾擊可破精微，設伏誘敵可擒將，利用驚駭、疲倦可少勝多。另以強弩長兵渡水作戰，以假使者斷糧，以同服假令防敵逃亡；義戰、重賞、嚴罰用來勵眾，喜怒予奪、文武徐疾用來調和全軍，高地、險阻、山林、深溝高壘各有用途。將領若不仁勇智明、不精微戒備，軍隊便失親、失銳、失機而亂亡。', '【主旨】〈奇兵〉列舉地形、偽裝、速度、賞罰與將德的多層變化，強調奇必建立在治與分合能力上。\n【詞義】「神勢」指難測而有利的態勢；「破精微」指攻破精銳細密之備；「走北」為敗逃；「罷怠」即疲弱懈怠者。\n【思想】奇兵不是單一詭計，而是把環境、編組、心理與紀律整合；篇末仍以賢將決定國家強弱。'],
  28: ['武王問能否由律管五音預知軍情勝敗。太公以宮、商、角、徵、羽配五行及神獸，主張在無風雨的夜半派輕騎到敵營九百步外，以呼聲引發律管微響，據應聲判斷五行勝負；又可由外在聲色判音：鼓聲為角，火光為徵，金鐵矛戟聲為商，人聲嘯呼為羽，寂靜無聲為宮。這些聲色被視為判斷敵情的符驗。', '【主旨】〈五音〉保存以律管、五音、五行和聲色情報推測軍情的古代術數觀。\n【詞義】「律管十二」是十二音律管；「六甲」為干支術數系統；「枹」是鼓槌；「外候」指可由外部觀察的徵候。\n【辨析】其五行配屬不具現代實證基礎；史料價值在呈現古代軍事聲學、偵察與術數混合的知識觀。'],
  29: ['太公說戰前可由軍心、紀律與隊形判斷強弱。全軍喜悅、畏法敬將、互相以勇武勉勵，是強的徵兆；頻繁驚恐、隊伍不整、散播不利妖言、不畏法令不重將領，是弱的徵兆。陣勢堅固、溝深壘高、順風雨之利、旗幟前指而金鼓清揚，是大勝徵兆；行陣不固、旗幟纏亂、逆風雨、士卒恐懼、車馬驚折、金鼓濁濕，是大敗徵兆。篇末又以城上氣色方向判斷可攻與否，並說圍城十日無雷雨應迅速撤離，以防城有強援。', '【主旨】〈兵徵〉把勝敗徵候分為可觀察的軍心紀律、陣形器械，以及術數性的氣象氣色。\n【詞義】「相屬」指交相連續；「宛以鳴」指鼓聲和順響亮；「氣絕而不屬」指士氣斷散；「大輔」指強大援助。\n【辨析】前半可視為組織狀態診斷，後半氣色占候屬古代術數，兩者證據性質須明確區分。'],
  30: ['武王問天下安定時是否可不修戰具守備。太公說軍備都寓於日常生產：耒耜可比拒馬蒺藜，車牛可組營壘遮蔽物，鋤耰可作矛戟，蓑笠可作甲盾，钁鍤斧鋸可作攻城器，牛馬負責糧運，雞犬警戒，婦女紡織可製旗，男子治地可供攻城。春除草備車騎，夏耘田練步卒，秋收儲糧，冬實倉備守；基層編伍、官長、圍牆、糧庫、城渠也分別對應軍隊約束、將帥、編隊、補給與塹壘。富國強兵須先使六畜繁育、田野開闢、男女生產有常。', '【主旨】〈農器〉主張軍事能力根植於農業工具、交通、紡織、基層編伍與季節生產。\n【詞義】「行馬蒺藜」為拒馬與障礙物；「蔽櫓」為遮蔽箭石的盾櫓；「織紝」為紡織；「相伍」指基層編戶組織。\n【思想】平戰轉換不是臨時造兵，而是以穩定生產、倉儲、運輸與組織形成國防韌性。']
};
let aidSource = fs.readFileSync('./src/data/readingAid.ts', 'utf8');
for (const item of additions) {
  const id = `liu-tao_ch-${item.order}_p-1`;
  const [translation, analysis] = aids[item.order];
  const entry = `  '${id}': {\n    translation: ${JSON.stringify(translation)},\n    analysis: ${JSON.stringify(analysis)}\n  },\n`;
  const marker = '\n}\n\nexport function getPassageReadingAid';
  if (!aidSource.includes(marker)) throw new Error('Cannot find PASSAGE_AIDS closing marker');
  aidSource = aidSource.replace(marker, `\n${entry}}\n\nexport function getPassageReadingAid`);
}
fs.writeFileSync('./src/data/readingAid.ts', aidSource, 'utf8');
console.log('Added and annotated all 13 龍韜 chapters.');
