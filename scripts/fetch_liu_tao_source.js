import fs from 'fs';

const api = 'https://zh.wikisource.org/w/api.php?action=parse&page=%E5%85%AD%E9%9F%9C&prop=text&format=json&formatversion=2';
const response = await fetch(api, { headers: { 'User-Agent': 'LitC editorial verification/1.0' } });
if (!response.ok) throw new Error(`Wikisource HTTP ${response.status}`);
const payload = await response.json();
const html = payload?.parse?.text;
if (!html) throw new Error('No parsed source returned');

function decode(text) {
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  return text
    .replace(/<sup[^>]*>[\s\S]*?<\/sup>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (_, entity) => {
      if (entity[0] === '#') {
        const hex = entity[1].toLowerCase() === 'x';
        return String.fromCodePoint(parseInt(entity.slice(hex ? 2 : 1), hex ? 16 : 10));
      }
      return named[entity] ?? `&${entity};`;
    })
    .replace(/\[[^\]]*編輯[^\]]*\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const headings = [...html.matchAll(/<h3[^>]*>[\s\S]*?<\/h3>/g)];
const records = [];
for (let index = 0; index < headings.length; index++) {
  const heading = headings[index];
  const titleText = decode(heading[0]).replace(/第[一二三四五六七八九十百〇零\d]+$/, '').trim();
  if (!titleText || titleText === '姊妹计划') continue;
  const start = heading.index + heading[0].length;
  const end = headings[index + 1]?.index ?? html.length;
  const section = html.slice(start, end);
  const paragraphs = [...section.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)]
    .map(match => decode(match[1]))
    .filter(text => text
      && !/^第[一二三四五六]篇\s*[文武龍虎豹犬]韜$/.test(text)
      && !text.startsWith('此作品在全世界都屬於公有領域')
      && !text.startsWith('此作品在全世界都属于公有领域')
      && !text.startsWith('Public domain'));
  if (paragraphs.length) {
    const text = paragraphs.join('\n')
      .replaceAll('无取于天下', '無取於天下')
      .replaceAll('聖有將動', '聖人將動')
      .replaceAll('暴虐殘疾', '暴虐殘賊')
      .replaceAll('群曲', '羣曲')
      .replaceAll('揔攬', '總攬')
      .replaceAll('五糓', '五穀')
      .replaceAll('决嫌疑', '決嫌疑')
      .replaceAll('摇動', '搖動')
      .replaceAll('攻鈗', '攻銳')
      .replaceAll('法筭', '法算')
      .replaceAll('馬洗厩養', '馬洗廄養')
      .replaceAll('陳勢巳固', '陳勢已固')
      .replaceAll('敗步騎群寇', '敗步騎羣寇')
      .replaceAll('太公曰：」太公曰：「', '太公曰：「')
      .replaceAll('吾盟誤失', '吾候望誤失')
      .replaceAll('為敵所栖', '為敵所棲')
      .replaceAll('并力合戰', '併力合戰')
      .replaceAll('披距伸鉤', '拔距伸鉤')
      .replaceAll('子弟欲為其將報仇', '子弟欲與其將報仇')
      .replaceAll('名曰死憤之士', '名曰敢死之士')
      .replaceAll('欲掩揭名', '欲掩跡揚名')
      .replaceAll('名曰幸用之士', '名曰倖用之士')
      .replaceAll('十而為群', '十而為羣')
      .replaceAll('均置蒺莉', '均置蒺藜')
      .replace(/([一二三四五六七八九十]+曰)：?「/g, '$1曰：');
    records.push({ title: titleText, text });
  }
}

const canonicalVolumes = [
  ['文韜', ['文師', '盈虛', '國務', '大禮', '明傳', '六守', '守土', '守國', '上賢', '舉賢', '賞罰', '兵道']],
  ['武韜', ['發啟', '文啟', '文伐', '順啟', '三疑']],
  ['龍韜', ['王翼', '論將', '選將', '立將', '將威', '勵軍', '陰符', '陰書', '軍勢', '奇兵', '五音', '兵徵', '農器']],
  ['虎韜', ['軍用', '三陳', '疾戰', '必出', '軍略', '臨境', '動靜', '金鼓', '絕道', '略地', '火戰', '壘虛']],
  ['豹韜', ['林戰', '突戰', '敵強', '敵武', '鳥雲山兵', '鳥雲澤兵', '少眾', '分險']],
  ['犬韜', ['分兵', '武鋒', '練士', '教戰', '均兵', '武車士', '武騎士', '戰車', '戰騎', '戰步']],
];

const duplicateCounts = new Map();
const ordered = [];
const sourceTitleAliases = { '鳥雲山兵': '烏雲山兵', '鳥雲澤兵': '烏雲澤兵', '分兵': '分合' };
for (const [volume, titles] of canonicalVolumes) {
  for (const title of titles) {
    const sourceTitle = sourceTitleAliases[title] ?? title;
    const matches = records.filter(record => record.title === sourceTitle);
    const used = duplicateCounts.get(sourceTitle) ?? 0;
    const record = matches[used];
    if (!record) throw new Error(`Missing chapter: ${volume}・${title} (occurrence ${used + 1}); available: ${records.map(item => item.title).join('、')}`);
    duplicateCounts.set(sourceTitle, used + 1);
    ordered.push({ order: ordered.length + 1, volume, title, text: record.text });
  }
}

const result = {
  source: '維基文庫《六韜》（標點本），篇次依《四部叢刊初編》本六卷目錄校正',
  sourceUrl: 'https://zh.wikisource.org/wiki/六韜',
  fetchedAt: new Date().toISOString(),
  chapters: ordered,
};
fs.writeFileSync('./scratch/liu_tao_full_source.json', `${JSON.stringify(result, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ chapters: ordered.length, volumes: Object.fromEntries(canonicalVolumes.map(([v, t]) => [v, t.length])), chars: ordered.reduce((sum, item) => sum + item.text.length, 0) }, null, 2));
