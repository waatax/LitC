import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetFile = path.join(__dirname, '../src/data/structuredAnnotations.ts');

const annotations = {
  // ─── 道德經 ───
  '道可道，非常道。': {
    translation: '可以說得出的「道」，不是永恆不變的道。',
    wordGlossary: '道：宇宙運行的根本規律。\n常：永恆不變的。',
    philosophicalNote: '老子開篇立論，指出真實的「道」超越語言文字的範疇。一旦可以用言詞命名，便落入相對的界限中。',
    writingApplication: '【寫作修辭】對仗、警策句。\n【應用範例】用於論述「真理超越言語表象」，切莫被名詞定義束縛。'
  },
  '名可名，非常名。': {
    translation: '可以叫得出的名稱，也不是事物最根本、固定的名稱。',
    wordGlossary: '名：事物的概念、標籤、名稱。\n常：永恆固定的。',
    philosophicalNote: '概念與符號只是人類對客觀世界的暫時標記，非本體本身。',
    writingApplication: '【寫作修辭】排比、對句。\n【應用範例】適用於探討概念本質與定義的相對性。'
  },
  '無名天地之始；有名萬物之母。': {
    translation: '未被命名時，是天地萬物的開端；有了名稱與分別後，便成為萬物生發的根源。',
    wordGlossary: '無名：道的無形無相狀態。\n有名：萬物演化出邊界與屬性的狀態。',
    philosophicalNote: '「無」與「有」是道的兩面。無名是形而上的混沌本體，有名是形而下的萬物演化。',
    writingApplication: '【寫作修辭】對比、頂真。\n【應用範例】可用於探討創意的無中生有過程。'
  },
  '上善若水。': {
    translation: '最高的善像水一樣。',
    wordGlossary: '上善：最完美的善、最高道德境界。',
    philosophicalNote: '以水喻道，水具備包容、柔韌、利他與避高趨下的特質。',
    writingApplication: '【寫作修辭】明喻。\n【應用範例】常用於形容謙遜包容的人格美德。'
  },
  '水善利萬物而不爭，處眾人之所惡，故幾於道。': {
    translation: '水滋養萬物卻不與萬物爭功，安處在人們不喜歡的低窪處，因此最接近「道」。',
    wordGlossary: '利：滋養。\n爭：爭名奪利。\n幾：接近。',
    philosophicalNote: '不爭並非懦弱，而是順應自然、默默奉獻的極致智者境界。',
    writingApplication: '【寫作修辭】擬人、象徵。\n【應用範例】論述「利他精神」與「柔性領導」。'
  },
  '知人者智，自知者明。': {
    translation: '能了解別人的人算是有智慧，能了解自己的人才算通達明智。',
    wordGlossary: '智：察人之智。\n明：自知之明、心明覺悟。',
    philosophicalNote: '將認識的焦點由外在社會轉向內在心靈，強調自省的高階價值。',
    writingApplication: '【寫作修辭】對偶。\n【應用範例】作文論述「自省與自我認知」的核心引用。'
  },
  '勝人者有力，自勝者強。': {
    translation: '能戰勝別人的人算是有力量，能戰勝自己的人才算真正的強者。',
    wordGlossary: '自勝：克服自我的欲望、惰性與弱點。',
    philosophicalNote: '真正的強大不是凌駕他人，而是掌握並超越自我。',
    writingApplication: '【寫作修辭】對比。\n【應用範例】用於論述「自律」與「自我超越」。'
  },
  '合抱之木，生於毫末；九層之臺，起於累土；千里之行，始於足下。': {
    translation: '兩臂合抱的大樹，是從細小的幼芽生長起來的；九層高的高臺，是由一筐筐泥土堆積起來的；千里的遠行，是從腳步第一步開始的。',
    wordGlossary: '毫末：極細小的幼芽。\n累土：堆積泥土。',
    philosophicalNote: '揭示質變源自量變的客觀規律，鼓勵持之以恆。',
    writingApplication: '【寫作修辭】排比、遞進。\n【應用範例】作文中「腳踏實地」與「微小累積」必備名言。'
  },

  // ─── 莊子 ───
  '北冥有魚，其名為鯤。': {
    translation: '北方的大海有一條魚，牠的名字叫做鯤。',
    wordGlossary: '北冥：北方的大海。\n鯤：傳說中的巨魚。',
    philosophicalNote: '鯤是生命積蓄力量與潛能的起點。',
    writingApplication: '【寫作修辭】起興、寓言。\n【應用範例】比喻人在平凡中積蓄厚重力量。'
  },
  '鯤之大，不知其幾千里也；化而為鳥，其名為鵬。': {
    translation: '鯤的身驅龐大，不知道有幾千里寬；牠羽化成鳥，名字叫做鵬。',
    wordGlossary: '化：轉化、蛻變。',
    philosophicalNote: '生命境界的躍遷，從深海之魚升華為九天之鵬。',
    writingApplication: '【寫作修辭】誇張、象徵。\n【應用範例】用於寫作「志向遠大」與「自我蛻變」。'
  },
  '昔者莊周夢為胡蝶，栩栩然胡蝶也，自喻適志與！不知周也。': {
    translation: '從前莊周夢見自己變成蝴蝶，栩栩如生的一隻蝴蝶，感到非常愉快合意！竟不知道自己是莊周。',
    wordGlossary: '栩栩然：生動活潑。\n適志：暢快合意。',
    philosophicalNote: '莊周夢蝶，打破物我界限，追求萬物齊一的精神自由。',
    writingApplication: '【寫作修辭】寓言。\n【應用範例】論述物我合一與藝術沉浸。'
  },

  // ─── 論語 ───
  '子曰：「學而時習之，不亦說乎？有朋自遠方來，不亦樂乎？人不知而不慍，不亦君子乎？」': {
    translation: '孔子說：「學習知識並按時溫習實踐，不也很令人愉快嗎？有志同道合的朋友從遠方前來，不也很令人快樂嗎？別人不了解我，我卻不抱怨發怒，不也是個有道德修養的君子嗎？」',
    wordGlossary: '時習：按時實踐溫習。\n說：同「悅」，愉悅。\n慍：抱怨發怒。',
    philosophicalNote: '開篇定調孔門精神：學求諸己、樂在志同、修養沉壓。',
    writingApplication: '【寫作修辭】反問、排比。\n【應用範例】用於論述學習態度與君子胸懷。'
  },
  '曾子曰：「吾日三省吾身：為人謀而不忠乎？與朋友交而不信乎？傳不習乎？」': {
    translation: '曾子說：「我每天多次反省自己：替別人謀劃辦事是否盡心盡力？與朋友交往是否誠實守信？老師傳授的學業是否溫習實踐了？」',
    wordGlossary: '三省：多次自我反省。\n忠：盡心盡力。\n信：誠實守信。',
    philosophicalNote: '自省是儒家自我修養的核心機制。',
    writingApplication: '【寫作修辭】反問、排比。\n【應用範例】用於論述「自律反省」與「誠信待人」。'
  },
  '子曰：「溫故而知新，可以為師矣。」': {
    translation: '孔子說：「溫習舊有的知識而能領悟出新的道理，就可以憑藉著成為老師了。」',
    wordGlossary: '故：舊知識。\n新：新體會。',
    philosophicalNote: '學習需融會貫通、推陳出新。',
    writingApplication: '【寫作修辭】對比。\n【應用範例】論述學習方法與創新傳承。'
  },
  '子曰：「學而不思則罔，思而不學則殆。」': {
    translation: '孔子說：「只學習而不思考就會迷惘；只思考而不學習就會危殆。」',
    wordGlossary: '罔：迷惘。\n殆：危險。',
    philosophicalNote: '學思結合，學為思之基，思為學之昇華。',
    writingApplication: '【寫作修辭】互文、對偶。\n【應用範例】用於論述學與思的辯證關係。'
  },
  '子曰：「知之者不如好之者，好之者不如樂之者。」': {
    translation: '孔子說：「對於知識學問，知道它的人不如喜歡它的人，喜歡它的人不如以它為樂的人。」',
    wordGlossary: '好：喜愛。\n樂：以之為樂。',
    philosophicalNote: '學習境界的三重躍升：認知、興趣、沉浸。',
    writingApplication: '【寫作修辭】層遞。\n【應用範例】論述熱情與興趣驅動學習。'
  },

  // ─── 孫子兵法 ───
  '兵者，國之大事，死生之地，存亡之道，不可不察也。': {
    translation: '戰爭是國家的頭等大事，關係軍民生死與國家存亡，不可不嚴肅考察。',
    wordGlossary: '察：考察研究。',
    philosophicalNote: '孫子兵法的慎戰思想，強調查明實情與風險意識。',
    writingApplication: '【寫作修辭】警示。\n【應用範例】用於論述重大決策的審慎態度。'
  },
  '知彼知己，百戰不殆；不知彼而知己，一勝一負；不知彼不知己，每戰必殆。': {
    translation: '了解對手也了解自己，百次戰鬥都不會面臨危險；不了解對手卻了解自己，勝負機率各半；既不了解對手也不了解自己，每戰必败。',
    wordGlossary: '彼：對手。\n殆：危險。',
    philosophicalNote: '客觀評估資訊是決策勝負的硬道理。',
    writingApplication: '【寫作修辭】對比、排比。\n【應用範例】商戰談判與競合分析名句。'
  },

  // ─── 孟子 ───
  '天時不如地利，地利不如人和。': {
    translation: '有利的天時比不上有利的地勢，有利的地勢比不上人心所向與內部團結。',
    wordGlossary: '人和：人心團結。',
    philosophicalNote: '人心凝聚力高於客觀物質條件。',
    writingApplication: '【寫作修辭】遞進。\n【應用範例】論述團隊凝聚力與以人為本。'
  },
  '生，亦我所欲也；義，亦我所欲也。': {
    translation: '生命是我渴望的，道義也是我渴望的。',
    wordGlossary: '欲：渴望。',
    philosophicalNote: '價值衝突的起點，引出捨生取義的道德抉擇。',
    writingApplication: '【寫作修辭】對偶。\n【應用範例】用於寫作價值評估。'
  },

  // ─── 韓非子 ───
  '明主之所導制其臣者，二柄而已矣。二柄者，刑德也。': {
    translation: '英明的君主用來引導和制服臣下的手段，不過是兩種權柄罷了。這兩種權柄，就是賞賜與懲罰。',
    wordGlossary: '柄：權柄、手段。\n刑：懲罰。\n德：賞賜。',
    philosophicalNote: '韓非子法家權謀思想的核心，主張透過嚴明的賞罰控制臣下。',
    writingApplication: '【寫作修辭】開門見山、對偶。\n【應用範例】論述制度管理中的獎懲機制。'
  },

  // ─── 墨子 ───
  '子墨子言曰：「仁人之所以任務者，必求興天下之利，除天下之害。」': {
    translation: '墨子說：「仁德的人所擔負的任務，必定是尋求興辦天下有利的事，消除天下有害的事。」',
    wordGlossary: '興：興辦、建立。\n除：消除。',
    philosophicalNote: '墨家功利主義與兼愛非攻的核心實踐標準：以天下利害為依歸。',
    writingApplication: '【寫作修辭】宗旨宣告、對偶。\n【應用範例】論述社會責任感與利他使命。'
  },

  // ─── 菜根譚 ───
  '寵辱不驚，閑看庭前花開花落；去留無意，漫隨天外雲卷雲舒。': {
    translation: '受到榮寵或侮辱都不動心，安閒地觀看庭院前的花朵花開花落；升遷或貶適都不介意，漫不經心地隨看天邊的雲彩隨風聚散。',
    wordGlossary: '寵辱：榮寵與屈辱。\n去留：去職與留任。\n卷舒：聚集與舒展。',
    philosophicalNote: '融合儒道佛之超脫處世境界，展現淡泊明志的情懷。',
    writingApplication: '【寫作修辭】對偶、借景抒情。\n【應用範例】用於描繪曠達心境與人生態度。'
  },

  // ─── 晏子春秋 ───
  '晏子使楚。': {
    translation: '晏子奉命出使楚國。',
    wordGlossary: '使：出使。',
    philosophicalNote: '經典外交故事開端，展現機智與國家尊嚴。',
    writingApplication: '【寫作修辭】敘事記敘。\n【應用範例】名篇引述。'
  },
  '嬰聞之，橘生淮南則為橘，生於淮北則為枳，葉徒相似，其實味不同。': {
    translation: '我聽說，橘樹生長在淮河以南就是橘樹，生長在淮河以北就變成枳樹，葉子雖然相似，果實味道卻完全不同。',
    wordGlossary: '枳：一種苦澀的小枸橘。\n實：果實。',
    philosophicalNote: '環境對人與事物的深遠塑造作用。',
    writingApplication: '【寫作修辭】類比、象徵。\n【應用範例】作文中論述「環境對人成長的影響」。'
  }
};

const content = `import type { StructuredTranslation } from '../types/content'

export const STRUCTURED_ANNOTATIONS: Record<string, StructuredTranslation> = ${JSON.stringify(annotations, null, 2)};
`;

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully generated comprehensive structured annotations!');
