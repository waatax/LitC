// scripts/enrich_existing.cjs
const fs = require('fs');

const originalCode = fs.readFileSync('src/data/poetry.ts', 'utf8');
const start = originalCode.indexOf('[\n  {');
const end = originalCode.lastIndexOf(']', originalCode.indexOf('export function getPoemById')) + 1;
const jsonStr = originalCode.slice(start, end).trim();

const existing = JSON.parse(jsonStr);
console.log('Successfully loaded existing items:', existing.length);

const enrichmentMap = {
  "tang-libai-jiangjinjiu": {
    gradeLevel: "advanced",
    gradeLabel: "初中拔尖經典",
    illustrationEmoji: "🍶",
    kidStory: "李白叔叔是全天下最自信、最浪漫的詩人！有一次他和好朋友在風景美麗的高山上喝酒聚會，李白想到自己雖然當官不順利，但他拍著胸脯大聲對朋友說：「上天生下我李白這麼大的天才，就一定有最偉大的用處！就算千兩黃金花光了，也一定還能再賺回來！」這種永不服輸、無比開朗的霸氣，激勵了千千萬萬遇到困難的人！",
    funFact: "「天生我材必有用」這句名言是李白最著名的自信宣言！李白一生豪氣干雲，他覺得人生的真正價值不在於官位大小，而在於活出自己獨一無二的精彩才華！"
  },
  "tang-libai-shudaonan": {
    gradeLevel: "advanced",
    gradeLabel: "初中拔尖經典",
    illustrationEmoji: "🧗",
    kidStory: "古代四川被重重疊疊的險峻高山包圍著，去四川的路叫「蜀道」，在懸崖峭壁上搭木頭棧道，旁邊就是萬丈深淵。李白發揮了他驚人的想像力：連飛得最高的黃鶴都飛不過去，猴子想爬都發愁！走在山頂上，伸手都能摸到天上的星星！李白寫這首詩提醒朋友們：人生旅途中也有很多像蜀道一樣險峻的難關，但只要勇敢面對、小心謹慎，就能跨越萬水千山！",
    funFact: "傳說大詩人賀知章第一次在長安讀到李白的《蜀道難》時，驚訝得鬍子都翹了起來，讚嘆李白是「天上掉下來的謫仙人」（天上的神仙下凡），從此李白「詩仙」的名號傳遍天下！"
  },
  "tang-dufu-denggao": {
    gradeLevel: "advanced",
    gradeLabel: "初中拔尖經典",
    illustrationEmoji: "🍂",
    kidStory: "深秋重陽節，杜甫爺爺一個人拄著拐杖爬上長江邊的高山。秋風呼呼地吹，天上的大雁在飛，漫山遍野金黃色的落葉像下雨一樣飄落下來，滾滾長江奔騰不息。杜甫雖然頭髮花白、疾病纏身，但他心中裝著的是天下百姓和受苦的人。這首詩被大家公認為「唐代七言律詩第一名」，字字千鈞！",
    funFact: "這首詩全篇八句五十六個字，每一句都嚴格對仗（首聯、頷聯、頸聯、尾聯全部對仗），在文學史上被尊為「古今七言律詩第一」，堪稱神工鬼斧！"
  },
  "tang-wangwei-shanjutiuming": {
    gradeLevel: "primary-high",
    gradeLabel: "小學經典・五六年級",
    illustrationEmoji: "🌕",
    kidStory: "秋天傍晚剛下過一場清涼透徹的秋雨，空氣好乾淨好清新。王維叔叔漫步在松樹林裡，抬頭看見皎潔的月亮在松樹枝縫裡閃閃發光，清涼的泉水在乾淨的石頭上叮咚流淌。竹林深處傳來浣紗姑娘們清脆歡樂的笑聲，漁船撥開荷葉划了回來。王維感嘆：山裡的生活這麼純潔美麗，真想一輩子留在這裡！",
    funFact: "「明月松間照，清泉石上流」是中國山水詩中最著名的畫面！蘇東坡稱讚王維「詩中有畫，畫中有詩」，讀這兩句詩，就像親眼看見一幅活生生的水墨山水畫！"
  },
  "tang-baijuyi-pipaxing": {
    gradeLevel: "advanced",
    gradeLabel: "初中拔尖經典",
    illustrationEmoji: "🪕",
    kidStory: "秋夜秋風蕭瑟的潯陽江頭，白居易送別朋友時，忽然從水面上漂來悠揚絕倫的琵琶聲。白居易請來了彈琵琶的藝人，那琴聲時而像粗繩大雨嘩啦啦傾盆而下，時而像細雨喁喁私語，最後像冰泉凝結，又突然像銀瓶破裂、鐵騎奔馳！白居易聽了深受感動，寫下了「同是天涯淪落人，相逢何必曾相識」的千古同情之歌。",
    funFact: "這首長詩描寫琵琶聲音的段落是文學史上的奇蹟！白居易把看不見摸不著的音樂，用「大珠小珠落玉盤」、「銀瓶乍破水漿迸」等各種神奇的比喻具象化，讀者讀著文字彷彿耳朵邊真的響起了美妙的交響樂！"
  },
  "tang-lishangyin-jinse": {
    gradeLevel: "advanced",
    gradeLabel: "初中拔尖經典",
    illustrationEmoji: "🦋",
    kidStory: "李商隱叔叔看到家裡一把五十條琴弦的古瑟，想起了自己充滿夢幻與思念的一生。他寫下了莊周夢見自己變成美麗蝴蝶、杜鵑鳥啼血寄託深情、大海裡蚌珠在月光下流淚、藍田美玉在暖陽下升起煙霧的四大神奇意象。整首詩美得像一場神祕莫測、光芒璀璨的夢境！",
    funFact: "「莊生曉夢迷蝴蝶，望帝春心託杜鵑」一口氣融合了莊周夢蝶和蜀王杜宇化鵑兩個千古浪漫神話，是古典詩歌中最具魔幻神秘色彩的名作！"
  },
  "tang-cuihao-huanghelou": {
    gradeLevel: "primary-high",
    gradeLabel: "小學經典・五六年級",
    illustrationEmoji: "🏯",
    kidStory: "長江邊有一座傳奇的黃鶴樓，相傳古代有神仙騎著黃鶴在這裡歇腳。崔顥叔叔登上高樓，看見天邊白雲悠悠飄蕩，晴朗陽光下的漢陽樹木清清楚楚，鸚鵡洲上的芳草綠得像地毯。到了傍晚江上籠罩起薄霧，他望著遠方想起了家鄉。據說連詩仙李白登上黃鶴樓看到這首詩，都佩服得放下筆說：「眼前有景道不得，崔顥題詩在上頭！」",
    funFact: "李白一生豪氣傲岸，唯獨在黃鶴樓讀了崔顥這首詩後甘拜下風，甚至後來寫下《登金陵鳳凰臺》來向崔顥致敬，成就了文壇一段謙謙君子的千古佳話！"
  },
  "tang-zhangruoxu-chunjianghuayueye": {
    gradeLevel: "advanced",
    gradeLabel: "初中拔尖經典",
    illustrationEmoji: "🌌",
    kidStory: "在春天的大江邊，花草盛開、春潮澎湃、一輪圓圓的明月升上海面，整個世界被銀色的月光洗得纖塵不染！詩人仰望著月亮，發出了天地間最浪漫浩瀚的發問：「江畔何人初見月？江月何年初照人？」一代代人走過了時光，但那輪江月依然年年照耀著我們，這首詩被近代大學者聞一多譽為「詩中的詩，頂峰上的頂峰」！",
    funFact: "張若虛在唐代存留下來的詩只有兩首，但僅憑這一首《春江花月夜》，就足以橫掃全唐，被譽為「孤篇蓋全唐」的絕世瑰寶！"
  },
  "song-sushi-chibihuaigu": {
    gradeLevel: "advanced",
    gradeLabel: "初中拔尖經典",
    illustrationEmoji: "🔥",
    kidStory: "蘇東坡叔叔站在長江邊赤壁懸崖上，看著洶湧澎湃的滔滔江水滾滾向東流去，浪花拍打在懸崖上，像卷起了千堆白雪！他想起了三國時代的年輕英雄周瑜周公瑾，搖著羽毛扇、戴著青絲巾，在談笑風生之間就用一把大火燒退了曹操的百萬大軍！蘇軾雖然自己人生坎坷，但他以無比豪邁的胸襟敬仰英雄、超脫苦難！",
    funFact: "「羽扇綸巾，談笑間，檣櫓灰飛煙滅」生動描摹了赤壁之戰周瑜的神采風範。這首詞也樹立了宋詞「豪放派」最高難以企及的豐碑！"
  },
  "song-sushi-shuidiaogetou": {
    gradeLevel: "primary-high",
    gradeLabel: "小學經典・五六年級",
    illustrationEmoji: "🌕",
    kidStory: "中秋節的夜晚，明月高懸，蘇東坡叔叔思念著遠在異地的親弟弟蘇轍。他舉起酒杯問月亮：「明月幾時有？把酒問青天。」他在月光下起舞，明白月亮本就有陰晴圓缺、人世間也難免有悲歡離合。最後他送給全天下所有人最美麗的祝福：「但願人長久，千里共嬋娟！」就算隔著千里萬里，只要我們抬頭看著同一輪明月，心就在一起！",
    funFact: "南宋文學評論家胡仔盛讚：「中秋詞自東坡《水調歌頭》一出，餘詞盡廢！」意思是自從蘇軾寫了這首詞，其他所有寫中秋的詞作全都不用看了！"
  },
  "song-sushi-dingfengbo": {
    gradeLevel: "primary-high",
    gradeLabel: "小學經典・五六年級",
    illustrationEmoji: "🎋",
    kidStory: "春天下著傾盆大雨，同行的朋友都被淋得抱頭逃跑、狼狽不堪，只有蘇東坡叔叔不慌不忙！他拄著一根竹杖，腳上穿著草鞋，一邊在雨中大步漫步，一邊吹著口哨高歌！他說：「不要聽樹林裡雨點打葉子的聲音，何妨在雨中大聲唱歌緩步徐行？」雨停了，太陽照常升起，蘇軾回頭一笑：「回首向來蕭瑟處，歸去，也無風雨也無晴！」多麼開朗豁達的超級大英雄！",
    funFact: "「一蓑煙雨任平生」和「也無風雨也無晴」是蘇軾一生豁達超然精神的最完美寫照！不論遇到多大的風浪挫折，都能微笑面對、坦然自若！"
  },
  "song-xinqiji-pozhenzi": {
    gradeLevel: "primary-high",
    gradeLabel: "小學經典・五六年級",
    illustrationEmoji: "🏹",
    kidStory: "辛棄疾叔叔不僅是偉大詞人，更是率領五十勇士闖入數萬敵營活捉叛將的鐵血大英雄！這天夜裡他喝了酒，擦亮了寶劍，回憶起當年帶兵打仗時的英姿：軍營裡烤著美味的牛肉，軍樂隊奏響著雄壯的邊塞軍歌，弓箭像雷霆閃電一樣呼嘯射向敵人！他立志要收復國家山河、贏得身前生後的英雄英名！",
    funFact: "「馬作的盧飛快，弓如霹靂弦驚」描繪戰馬像劉備的的盧神馬一樣疾馳如飛，弓弦聲如霹靂炸雷，節奏緊湊得讓人心跳加速！"
  },
  "song-xinqiji-qingyuan": {
    gradeLevel: "primary-high",
    gradeLabel: "小學經典・五六年級",
    illustrationEmoji: "🏮",
    kidStory: "元宵節的夜晚熱鬧非凡！街上掛滿了成千上萬的各色花燈，像花樹開花一樣美麗，煙火像流星雨一樣從天上落下來，寶馬雕車香氣撲鼻。滿街的人都在歡笑追逐，但辛棄疾叔叔卻在尋找一位不隨波逐流、清高純潔的人。他在人群中找了千百遍都沒有找到，忽然不經意一回頭，看見那個人正安靜地站在燈火稀疏冷落的角落裡！",
    funFact: "國學大師王國維在《人間詞話》中，把「眾裡尋他千百度，驀然回首，那人卻在，燈火闌珊處」列為古今成就大事業、大學問的第三種、也是最高境界！"
  },
  "song-liqingzhao-shengshengman": {
    gradeLevel: "advanced",
    gradeLabel: "初中拔尖經典",
    illustrationEmoji: "🌧️",
    kidStory: "在金兵入侵、丈夫病逝、國破家亡的深秋，李清照孤身一人流落南方。窗外下著綿綿秋雨，雨滴打在梧桐葉上點點滴滴，落葉滿地無人清掃。她一開篇一口氣連用了十四個疊字：「尋尋覓覓，冷冷清清，悽悽慘慘戚戚」，把生命中最深沉的孤獨與悲傷傾瀉在字裡行間，震撼了古今千百年讀者的心靈。",
    funFact: "這首詞開篇十四個疊字連用，在整部中國文學史上前無古人、後無來者，音律急促低迴，宛如大珠小珠墜入冰窟，被譽為聲律美學的無上奇蹟！"
  },
  "song-liqingzhao-yijianmei": {
    gradeLevel: "primary-high",
    gradeLabel: "小學經典・五六年級",
    illustrationEmoji: "💌",
    kidStory: "秋天到了，荷花漸漸謝了，竹蓆泛起了一絲清涼。李清照輕輕解開羅裳，獨自登上小木船。她看著天邊排成一字的大雁飛過，想著遠方的丈夫會不會寄來寫在帛絹上的書信？花兒自顧自飄落、流水自顧自流淌，彼此思念著對方卻不能相聚。這種牽掛剛剛才從緊鎖的眉頭放下來，卻又悄悄湧上了心頭！",
    funFact: "「此情無計可消除，才下眉頭，卻上心頭」把無形的思念寫得像會走動的小精靈一樣，剛離開眉間，又爬上心間，描寫得極其傳神動人！"
  },
  "song-liuyong-yulinling": {
    gradeLevel: "advanced",
    gradeLabel: "初中拔尖經典",
    illustrationEmoji: "🌙",
    kidStory: "秋天的黃昏，長亭邊一隻寒蟬淒切地叫著。一艘小船即將啟航，柳永與心愛的人淚眼相對、緊握雙手，喉嚨哽咽得連一句話都說不出來。小船漸漸駛遠，千里煙波籠罩在蒼茫江面上。柳永想著：明天的這個時候，我不知道會漂泊在哪裡，大概只能面對著楊柳岸邊那清冷的晨風與殘缺的下弦月吧！",
    funFact: "「今宵酒醒何處？楊柳岸，曉風殘月」是宋代婉約派詞作的代表巔峰，把離別之淒美、空茫之境地表現得淋漓盡致！"
  },
  "song-yuefei-manjianghong": {
    gradeLevel: "primary-high",
    gradeLabel: "小學經典・五六年級",
    illustrationEmoji: "🛡️",
    kidStory: "岳飛大將軍是我們最敬佩的民族英雄！他帶領著紀律嚴明的岳家軍「凍死不拆屋，餓死不擄掠」，一次次把金國侵略軍打得落花流水！站在高樓上遠眺祖國大好河山，岳飛熱血沸騰，高唱「三十功名塵與土，八千里路雲和月。莫等閒、白了少年頭，空悲切！」激勵無數少年珍惜大好時光、奮發報效國家！",
    funFact: "「莫等閒、白了少年頭，空悲切」是激勵青少年最經典的名言！它叮囑我們千萬不要虛度光陰、荒廢年華，等老了才後悔莫及！"
  },
  "tang-dufu-maowu": {
    gradeLevel: "advanced",
    gradeLabel: "初中拔尖經典",
    illustrationEmoji: "🛖",
    kidStory: "秋天狂風大作，把杜甫爺爺草堂屋頂上的茅草全都捲上了天，掛在樹梢、掉進池塘。半夜又下起了傾盆大雨，屋頂破了洞，雨水漏得棉被全濕透了，又冷又硬像鐵板一樣。但就在自己凍得瑟瑟發抖的時候，杜甫爺爺心裡想的不是自己，而是大聲呼喊：「怎樣才能建造千萬間高大溫暖的房屋，把天下所有受苦貧寒的讀書人都接進來住，讓大家臉上都露出幸福的笑容啊！」杜甫那顆博大無私的愛心，永遠在歷史上閃閃發光！",
    funFact: "「安得廣廈千萬間，大庇天下寒士俱歡顏」充分展現了杜甫「推己及人、胸懷蒼生」的崇高人格，也是他被後世尊為「詩聖」的核心原因！"
  },
  "tang-liyu-yumeiren": {
    gradeLevel: "advanced",
    gradeLabel: "初中拔尖經典",
    illustrationEmoji: "🌊",
    kidStory: "南唐後主李煜原本是一位溫柔優雅的國王，國家滅亡後被軟禁在異鄉。七夕這天夜晚，他望著天上的明月，想起故國江南雕欄玉砌的宮殿，人事已非。面對人生無法挽回的劇變，他問自己：心中的愁恨到底有多深？就像那滾滾東流、永遠不會停歇的一江春水！他把巨大的傷痛化為了震撼人心的永恆藝術！",
    funFact: "「問君能有幾多愁？恰似一江春水向東流」是文學史上最生動神奇的以景喻情之筆，把抽象的心靈憂愁化為奔騰不息的江水！"
  }
};

existing.forEach(item => {
  const enrich = enrichmentMap[item.id];
  if (enrich) {
    Object.assign(item, enrich);
  }
});

fs.writeFileSync('scripts/corpus_data/existing_enriched.json', JSON.stringify(existing, null, 2), 'utf8');
console.log('Successfully wrote existing_enriched.json, total count:', existing.length);
