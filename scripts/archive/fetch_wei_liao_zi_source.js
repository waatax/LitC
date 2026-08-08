import fs from 'fs';

const page = encodeURIComponent('尉繚子/全覽');
const api = `https://zh.wikisource.org/w/api.php?action=parse&page=${page}&prop=text&format=json&formatversion=2`;
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
    .replace(/\s+/g, ' ')
    .trim();
}

const titles = [
  '天官', '兵談', '制談', '戰威', '攻權', '守權', '十二陵', '武議',
  '將理', '原官', '治本', '戰權', '重刑令', '伍制令', '分塞令', '束伍令',
  '經卒令', '勒卒令', '將令', '踵軍令', '兵教上', '兵教下', '兵令上', '兵令下',
];

const headings = [...html.matchAll(/<h[234][^>]*>[\s\S]*?<\/h[234]>/g)];
const records = [];
for (let index = 0; index < headings.length; index++) {
  const heading = headings[index];
  const headingText = decode(heading[0]).replace(/\[編輯\]$/, '').trim();
  const title = titles.find(item => headingText === item || headingText.endsWith(item));
  if (!title) continue;
  const start = heading.index + heading[0].length;
  const end = headings[index + 1]?.index ?? html.length;
  const section = html.slice(start, end);
  let paragraphs = [...section.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)]
    .map(match => decode(match[1]))
    .filter(text => text && !text.startsWith('本作品在全世界都属于公有领域'));
  if (!paragraphs.length) {
    const plain = decode(section).replace(/^\[編輯\]\s*/, '').trim();
    if (plain) paragraphs = [plain];
  }
  records.push({ order: titles.indexOf(title) + 1, title, text: paragraphs.join('\n') });
}

records.sort((a, b) => a.order - b.order);
const missing = titles.filter(title => !records.some(record => record.title === title && record.text));
for (const title of missing) {
  const fallbackApi = `https://zh.wikisource.org/w/api.php?action=parse&page=${encodeURIComponent(`尉繚子/${title}`)}&prop=text&format=json&formatversion=2`;
  const fallbackResponse = await fetch(fallbackApi, { headers: { 'User-Agent': 'LitC editorial verification/1.0' } });
  if (!fallbackResponse.ok) continue;
  const fallbackPayload = await fallbackResponse.json();
  const fallbackHtml = fallbackPayload?.parse?.text ?? '';
  const paragraphs = [...fallbackHtml.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)]
    .map(match => decode(match[1]))
    .filter(text => text && !text.startsWith('本作品在全世界都属于公有领域'));
  if (paragraphs.length) records.push({ order: titles.indexOf(title) + 1, title, text: paragraphs.join('\n') });
}
records.sort((a, b) => a.order - b.order);
const stillMissing = titles.filter(title => !records.some(record => record.title === title && record.text));
if (stillMissing.length) console.warn(`Source gap requiring a second witness: ${stillMissing.join('、')}`);

const result = {
  source: '維基文庫《尉繚子／全覽》，並以中國哲學書電子化計劃二十四篇目錄交叉核對',
  sourceUrl: 'https://zh.wikisource.org/wiki/尉繚子/全覽',
  comparisonUrl: 'https://ctext.org/wei-liao-zi/zh',
  fetchedAt: new Date().toISOString(),
  missingChapters: stillMissing,
  chapters: records,
};

fs.writeFileSync('./scratch/wei_liao_zi_full_source.json', `${JSON.stringify(result, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ chapters: records.length, chars: records.reduce((sum, item) => sum + item.text.length, 0), titles: records.map(item => item.title) }, null, 2));
