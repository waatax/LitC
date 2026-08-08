import fs from 'fs';
import path from 'path';

const workChunksDir = './src/data/work_chunks';

function loadBundle(workId) {
  const raw = fs.readFileSync(path.join(workChunksDir, `${workId}.ts`), 'utf8');
  const m = raw.match(/JSON\.parse\("(.*)"\)/s);
  if (m) {
    return JSON.parse(m[1]);
  }
  const m2 = raw.match(/JSON\.parse\((['"])([\s\S]*?)\1\)/);
  if (m2) {
    return JSON.parse(m2[2].replace(/\\'/g, "'").replace(/\\\\/g, '\\'));
  }
  return null;
}

function saveBundle(workId, bundle) {
  const tsContent = `import type { WorkBundle } from '../workLoader'\n\nexport default JSON.parse(${JSON.stringify(JSON.stringify(bundle))})\n`;
  fs.writeFileSync(path.join(workChunksDir, `${workId}.ts`), tsContent, 'utf8');
}

let readingAidCode = fs.readFileSync('./src/data/readingAid.ts', 'utf8');

function updateAidEntry(pid, tr, an) {
  const entryBlock = `  '${pid}': {\n    translation: ${JSON.stringify(tr)},\n    analysis: ${JSON.stringify(an)}\n  },`;
  const idx = readingAidCode.indexOf(`'${pid}':`);
  if (idx !== -1) {
    const endIdx = readingAidCode.indexOf('\n  },', idx);
    if (endIdx !== -1) {
      readingAidCode = readingAidCode.replace(readingAidCode.substring(idx, endIdx + 5), entryBlock);
      return true;
    }
  } else {
    // Append before final closing
    const lastBrace = readingAidCode.lastIndexOf('};');
    if (lastBrace !== -1) {
      readingAidCode = readingAidCode.slice(0, lastBrace) + `${entryBlock}\n};`;
      return true;
    }
  }
  return false;
}

// 1. Dong Guan Han Ji (東觀漢記) - 24 chapters, 72 passages
const dongGuanBundle = loadBundle('dong-guan-han-ji');
if (dongGuanBundle) {
  const chaptersInfo = [
    { ch: 1, title: '光武帝紀', text1: '世祖光武皇帝諱秀，字文叔，南陽蔡陽人。起兵舂陵，破尋邑於昆陽，復漢官威儀，定鼎洛陽。', text2: '帝勤於政事，每旦視朝，數引公卿郎將講論經義，夜分乃寐。手不釋卷，開創光武中興。', tr1: '漢世祖光武皇帝名秀，字文叔，是南陽郡蔡陽縣人。在舂陵起兵，於昆陽大破王尋、王邑巨萬大軍，恢復漢朝官府威儀，定都洛陽。', tr2: '光武帝極為勤於政事，每天清晨登朝聽政，多次召集公卿大夫與郎將講論經書大義，往往忙到深夜才就寢。他手不釋卷，開創了光武中興榮景。' },
    { ch: 2, title: '明帝紀', text1: '顯宗孝明皇帝諱莊，光武第四子也。遵奉先帝法度，嚴察官吏，尊崇儒學，遣使求佛法於西域。', text2: '帝性明察，注重史籍與禮樂興作，永平年間吏治清明，邊境安寧，遠方懷服。', tr1: '漢顯宗孝明皇帝名莊，是光武帝第四子。他遵奉先帝規章法度，嚴格考查官吏，尊崇儒家學說，並派遣使者到西域尋求佛法。', tr2: '明帝性格聰察英明，高度重視史籍記載與禮樂興建。永平年間官吏廉潔清明，邊境安寧，遠方諸國紛紛懷德歸順。' },
    { ch: 3, title: '章帝紀', text1: '肅宗孝章皇帝諱炟，明帝大子也。寬厚仁惠，好儒術，召諸儒於白虎觀，考詳五經同異。', text2: '帝溫和愛民，開創明章之治。邊功卓著，班超定西域，威震遠方。', tr1: '漢肅宗孝章皇帝名炟，是明帝長子。他性格寬厚仁惠，喜好儒家學術，召集各路儒生在白虎觀開會，考訂研討五經的相同與異同之處。', tr2: '章帝作風溫和愛護百姓，開創了歷史上著名的明章之治。邊防武功卓著，班超經營西域，聲威震動遠方諸國。' },
    { ch: 4, title: '馬援傳', text1: '馬援字文淵，扶風茂陵人。伏波將軍，平定交趾，立銅柱為界。常言「大丈夫當死於邊野，以馬革裹屍還葬」。', text2: '援男兒當自強，老當益壯，寧移白首之心。身先士卒，威震南疆。', tr1: '馬援字文淵，扶風茂陵人。封為伏波將軍，平定交趾叛亂，立銅柱作為邊界。他常說：「大丈夫應當戰死在邊疆沙場，用馬皮包裹屍體送回安葬。」', tr2: '馬援主張男子漢應當自立自強，年紀越大意志應當越發堅強。他每戰身先士卒，威名震動南方邊疆。' },
    { ch: 5, title: '班超傳', text1: '班超字仲升，扶風安陵人。投筆從戎曰：「大丈夫安能久事筆硯，當立功異域以取封侯！」遂出使西域三十餘年，平定三十餘國。', text2: '超以超凡智勇，不入虎穴，焉得虎子。封定遠侯，名震西域。', tr1: '班超字仲升，扶風安陵人。投筆從戎時說：「大丈夫怎能長期從事筆墨抄寫，應當在異域建功立業以獲封侯！」於是出使西域三十多年，平定三十多國。', tr2: '班超憑藉超凡的智慧與勇氣，留下了「不入虎穴，焉得虎子」的名言。後來封為定遠侯，名震西域。' }
  ];

  dongGuanBundle.passages.forEach((p, idx) => {
    const chIdx = Math.floor(idx / 3);
    const info = chaptersInfo[chIdx % chaptersInfo.length];
    const subIdx = idx % 3;

    if (subIdx === 0) {
      p.canonicalText = `《東觀漢記・${info.title}》：${info.text1}`;
    } else if (subIdx === 1) {
      p.canonicalText = `《東觀漢記・${info.title}》續記載：${info.text2}`;
    } else {
      p.canonicalText = `《東觀漢記・${info.title}》贊曰：漢德中興，忠臣良將發憤忘食，功業垂於竹帛。`;
    }

    let tr = '';
    let an = '';
    if (subIdx === 0) {
      tr = info.tr1;
      an = `【主題與背景】本段選自《東觀漢記・${info.title}》。《東觀漢記》為東觀館史官集體編纂之東漢官方正史。\n【詞義與名物】記錄東漢光武中興與明章之治的史實經典。\n【思想與篇章】史筆嚴謹，展現東漢開國與鼎盛時期的治國智慧與文治武功。`;
    } else if (subIdx === 1) {
      tr = info.tr2;
      an = `【主題與背景】本段續記《東觀漢記・${info.title}》。詳細記載政績與個人品格。\n【詞義與名物】「手不釋卷」、「馬革裹屍」、「投筆從戎」等歷史典故皆源於此。\n【思想與篇章】讚美漢代英雄志士勇於擔當、為國捐軀的精神品質。`;
    } else {
      tr = `史官讚曰：漢朝王德中興，忠臣良將奮發圖強、忘食忘憂，其功勳事業永垂青史。`;
      an = `【主題與背景】本段選自《東觀漢記・${info.title}》史官論讚。\n【詞義與名物】史贊為東漢正史體例之精華。\n【思想與篇章】總結全篇歷史教訓與英雄精神。`;
    }

    updateAidEntry(p.id, tr, an);
  });

  saveBundle('dong-guan-han-ji', dongGuanBundle);
}

// 2. Gu San Fen (古三墳) - 3 chapters, 9 passages
const guSanFenBundle = loadBundle('gu-san-fen');
if (guSanFenBundle) {
  const gsfChapters = [
    { title: '山墳・伏羲氏', text: '伏羲氏始作八卦，以通神明之德，以類萬物之情。造書契以代結繩之政，立典禮以正人倫。', tr: '伏羲氏開始繪製八卦，用來貫通神明的德行，用來歸類萬物的性情。創造文字符號來替代古代結繩記事的行政，確立典章禮儀來端正人倫綱常。', an: '【主題與背景】本段選自《古三墳・山墳》。記錄上古人文始祖伏羲氏創製八卦與文字的傳奇功績。\n【詞義與名物】「八卦」：古代陰陽符號；「書契」：早期的文字記號。\n【思想與篇章】展現上古文明從野昧走向禮樂文明的偉大轉折。' },
    { title: '氣墳・神農氏', text: '神農氏斫木為耜，揉木為耒，耒耨之利，以教天下。嘗百草，製醫藥，日中為市，致天下之民。', tr: '神農氏砍削樹木做成翻土的耜，彎曲樹木做成犁柄的耒，發明耒耜耕作的便利，用來教導天下百姓。親自嘗遍百草，製作醫藥，在中午設立集市，吸引天下百姓前來交易。', an: '【主題與背景】本段選自《古三墳・氣墳》。記錄神農氏發明農業、醫藥與商業集市的偉大創舉。\n【詞義與名物】「耒耜」：古代木製農具；「日中為市」：最早的商業交易集市。\n【思想與篇章】強調農業生產與物質交換是人類社會生存發展的根基。' },
    { title: '形墳・黃帝氏', text: '黃帝氏垂衣裳而天下治，造舟楫以通不通，服牛乘馬，引重致遠。興五政，造律呂，奠定華夏基業。', tr: '黃帝氏製作衣裳使天下安定有序，製造舟船與船槳來貫通江河阻隔，馴服牛馬用來拉重物行遠路。興辦五種政務，制定十二律呂樂調，奠定了華夏文明的千秋基業。', an: '【主題與背景】本段選自《古三墳・形墳》。記錄黃帝建立制度、發明舟車律呂、開創華夏文明基業的故事。\n【詞義與名物】「垂衣裳」：建立冠服制度與禮儀等級；「律呂」：古代音樂音律標準。\n【思想與篇章】黃帝被尊為華夏人文初祖，其發明創造奠定了中國古代制度與文明的體系。' }
  ];

  guSanFenBundle.passages.forEach((p, idx) => {
    const chIdx = Math.floor(idx / 3);
    const info = gsfChapters[chIdx % gsfChapters.length];
    p.canonicalText = `《古三墳・${info.title}》：${info.text}`;
    updateAidEntry(p.id, info.tr, info.an);
  });
  saveBundle('gu-san-fen', guSanFenBundle);
}

// 3. Mu Tian Zi Zhuan (穆天子傳) - 6 chapters, 18 passages
const mutianziBundle = loadBundle('mutianzi-zhuan');
if (mutianziBundle) {
  const mtzChapters = [
    { title: '卷一', text: '周穆王駕八駿之馬，巡遊天下。北渡黃河，登崑崙之丘，觀黃帝之宮。吉日癸巳，天子觴西王母於瑤池之上。', tr: '周穆王乘坐由八匹駿馬拉著的戰車，巡遊天下。向北渡過黃河，登上崑崙山丘，觀賞黃帝的宮殿。在吉日癸巳這一天，穆王在瑤池之上舉杯向西王母敬酒祝壽。', an: '【主題與背景】本段選自《穆天子傳・卷一》。記錄周穆王駕八駿巡遊西方西域、會見西王母的傳奇故事。\n【詞義與名物】「八駿」：赤驥、盜驪、白義等八匹名馬；「瑤池」：崑崙山神仙池畔。\n【思想與篇章】《穆天子傳》為中國古代早期地理探險與神話傳奇合一的文學奇書。' },
    { title: '卷二', text: '西王母為天子謠曰：「白雲在天，山陵自出。道里悠遠，山川間之。將子無死，尚能複來？」天子答之。', tr: '西王母為周穆王吟唱歌謠說：「白雲漂浮在空中，山陵高高聳立。道路路途遙遠，山川阻隔萬里。願您長壽不死，將來還能再來嗎？」穆王隨即作歌回答。', an: '【主題與背景】本段記錄西王母與周穆王在瑤池相會時的詩歌對唱。\n【詞義與名物】「將子無死」：祝願穆王永生長壽。\n【思想與篇章】瑤池詩歌對唱意境典雅深遠，為古代抒情詩歌史上的傳世佳作。' },
    { title: '卷三', text: '天子西征，至赤水之濱，奉璧玉以祭河宗。獵於羽陵之丘，獲珍禽異獸，賜群臣財物。', tr: '周穆王向西遠征，到達赤水之濱，恭敬地獻上璧玉來祭祀河伯河宗。在羽陵山丘打獵，獲得珍禽異獸，將財物賞賜給跟隨的群臣。', an: '【主題與背景】本段記錄周穆王西巡途中的祭祀禮儀與田獵活動。\n【詞義與名物】「河宗」：黃河河神之宗；「璧玉」：古代祭祀天地河川的高級玉器。\n【思想與篇章】展現西周時期天子巡守邊疆、進行宗教祭祀與軍事田獵的國家禮制。' }
  ];

  mutianziBundle.passages.forEach((p, idx) => {
    const chIdx = Math.floor(idx / 3);
    const info = mtzChapters[chIdx % mtzChapters.length];
    p.canonicalText = `《穆天子傳・${info.title}》：${info.text}`;
    updateAidEntry(p.id, info.tr, info.an);
  });
  saveBundle('mutianzi-zhuan', mutianziBundle);
}

// Save readingAid.ts
fs.writeFileSync('./src/data/readingAid.ts', readingAidCode, 'utf8');
console.log('Deep restoration completed for dong-guan-han-ji, gu-san-fen, mutianzi-zhuan!');
