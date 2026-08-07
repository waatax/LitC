import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dataDir = path.join(rootDir, 'src', 'data');

function extractData(content) {
  const results = {};
  const regex = /export const (\w+)\s*=\s*JSON\.parse\('([^'\\]*(?:\\.[^'\\]*)*)'\)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const varName = match[1];
    const rawString = match[2];
    try {
      const jsonString = eval(`'${rawString}'`);
      results[varName] = JSON.parse(jsonString);
    } catch (e) {
      console.error(`Error parsing ${varName}`, e);
    }
  }
  return results;
}

function escapeString(str) {
    // Basic escaping to make sure the JSON string can be put into the TypeScript file as a single-quoted string
    return str.replace(/\\/g, '\\\\').replace(/'/g, '\\\'');
}

// 1. Read works & chapters from works.ts
const worksTsPath = path.join(dataDir, 'works.ts');
let worksTsContent = fs.readFileSync(worksTsPath, 'utf-8');
const worksData = extractData(worksTsContent);
const works = worksData.works || [];
const chapters = worksData.chapters || [];

// 2. Read passages from passages_part2.ts
const passagesFile = path.join(dataDir, 'sentence_chunks', `passages_part2.ts`);
let passages = [];
let passagesContent = '';
if (fs.existsSync(passagesFile)) {
    passagesContent = fs.readFileSync(passagesFile, 'utf-8');
    const data = extractData(passagesContent);
    if (data.passagesPart2) {
        passages = data.passagesPart2;
    }
}

// 3. Read sentences from part8.ts
const sentencesFile = path.join(dataDir, 'sentence_chunks', `part8.ts`);
let sentences = [];
let sentencesContent = '';
if (fs.existsSync(sentencesFile)) {
    sentencesContent = fs.readFileSync(sentencesFile, 'utf-8');
    const data = extractData(sentencesContent);
    if (data.sentencesPart8) {
        sentences = data.sentencesPart8;
    }
}

// Data for Yanzi Chunqiu
const yanziData = {
  id: 'yanzi-chun-qiu',
  chapters: [
    {
      title: '內篇諫上・晏子使楚',
      passages: [
        {
          text: '晏子使楚。楚人以晏子短，為小門於大門之側而延晏子。晏子不入，曰：「使狗國者從狗門入。今臣使楚，不當從此門入。」儐者更道，從大門入。',
          translation: '晏子奉命出使楚國。楚國人因為晏子身材矮小，在大門旁邊開了一個小門邀請晏子進去。晏子不肯進去，說：「出使狗國的人才從狗門進去。今天我出使楚國，不應該從這個門進去。」接待的賓客連忙改道，引導晏子從大門進去。'
        },
        {
          text: '見楚王，王曰：「齊無人耶？使子為使。」晏子對曰：「齊之臨淄三百閭，張袂成陰，揮汗成雨，比肩繼踵而在，何為無人？」',
          translation: '晏子謁見楚王，楚王說：「齊國沒有人才了嗎？竟派你作為使者。」晏子回答說：「齊國的首都臨淄有成千上萬的人家，大家張開袖子就能遮天成陰，揮灑汗水就能下雨，肩碰肩腳跟碰腳跟，怎麼會沒有人呢？」'
        },
        {
          text: '王曰：「然則何為使子？」晏子對曰：「齊命使各有所主：其賢者使賢主，不肖者使不肖主。嬰最不肖，故宜使楚矣！」',
          translation: '楚王說：「既然如此，那為什麼派你來呢？」晏子回答說：「齊國派遣使者各有考量：賢德的人出使賢明的君主，無能的人出使無能的君主。晏嬰我最無能，所以最適合出使楚國了！」'
        }
      ]
    },
    {
      title: '內篇雜下・橘生淮南',
      passages: [
        {
          text: '晏子至，楚王賜晏子酒，酒酣，吏二縛一人詣王。王曰：「縛者曷為者也？」對曰：「齊人也，坐盜。」王視晏子曰：「齊人固善盜乎？」',
          translation: '晏子來到楚國，楚王賜酒給晏子宴飲，酒喝得正歡時，兩名官吏押著一個人來到楚王面前。楚王問：「押著的人是幹什麼的？」官吏回答：「是齊國人，犯了偷竊罪。」楚王看著晏子說：「齊國人本來就擅長偷竊嗎？」'
        },
        {
          text: '晏子避席對曰：「嬰聞之，橘生淮南則為橘，生於淮北則為枳，葉徒相似，其實味不同。所以然者何？水土異也。今民生於齊不盜，入楚則盜，得無楚之水土使民善盜耶？」王笑曰：「聖人非所與熙也，寡人反取病焉。」',
          translation: '晏子離開座位回答說：「我聽說，橘樹生長在淮河以南結出的就是甜橘，生長在淮河以北結出的就是苦枳，葉子雖然相似，果實的味道卻截然不同。為什麼會這樣呢？是因為水土不同啊。現在百姓生活在齊國不偷竊，到了楚國就偷竊，難道不是楚國的水土讓百姓變得善於偷竊嗎？」楚王笑著說：「聖人是不容許開玩笑打趣的，寡人反而是自討沒趣了。」'
        }
      ]
    }
  ]
};

const existingWorkIdx = works.findIndex(w => w.id === 'yanzi-chun-qiu');
if (existingWorkIdx === -1) {
    console.error('Work yanzi-chun-qiu not found in works.ts');
    process.exit(1);
}

const chapterIds = [];
let totalChars = 0;

yanziData.chapters.forEach((chData, chIdx) => {
  const chNum = chIdx + 1;
  const chapterId = `yanzi-chun-qiu_ch-${chNum}`;
  chapterIds.push(chapterId);

  // Add chapter if not exists
  if (!chapters.find(c => c.id === chapterId)) {
      const passageIds = [];
      chData.passages.forEach((pData, pIdx) => {
        const pNum = pIdx + 1;
        const passageId = `${chapterId}_p-${pNum}`;
        passageIds.push(passageId);

        const sRegex = /[^。；！？\r\n]+[。；！？]+/g;
        const sMatches = pData.text.match(sRegex) || [pData.text];

        const sentenceIds = [];
        sMatches.forEach((sText, sIdx) => {
          const sNum = sIdx + 1;
          const sentenceId = `${passageId}_s-${sNum}`;
          sentenceIds.push(sentenceId);
          totalChars += sText.length;

          if (!sentences.find(s => s.id === sentenceId)) {
              sentences.push({
                id: sentenceId,
                passageId,
                order: sNum,
                canonicalText: sText.trim(),
                cue: sText.trim()[0],
                chunks: [
                  {
                    id: `${sentenceId}_c-1`,
                    sentenceId,
                    order: 1,
                    text: sText.trim(),
                    cue: sText.trim()[0]
                  }
                ]
              });
          }
        });

        if (!passages.find(p => p.id === passageId)) {
            passages.push({
              id: passageId,
              chapterId,
              order: pNum,
              canonicalText: pData.text,
              sentenceIds
            });
        }
      });

      chapters.push({
        id: chapterId,
        workId: 'yanzi-chun-qiu',
        order: chNum,
        title: chData.title,
        difficulty: 2,
        estimatedMinutes: 5,
        passageIds,
        tags: ['史書', '故事']
      });
  }
});

// Update the work entry
works[existingWorkIdx].chapterIds = chapterIds;
works[existingWorkIdx].totalChars = totalChars;

// Helper to write back JSON.parse('...')
function replaceJSONParse(content, varName, newData) {
    const regex = new RegExp(`export const ${varName}\\s*=\\s*JSON\\.parse\\('([^'\\\\]*(?:\\\\.[^'\\\\]*)*)'\\)`);
    const newJson = JSON.stringify(newData);
    
    // We need to escape \ and ' for the JS string literal
    const escaped = newJson.replace(/\\/g, '\\\\').replace(/'/g, '\\\'');
    
    return content.replace(regex, `export const ${varName} = JSON.parse('${escaped}')`);
}

// works.ts
worksTsContent = replaceJSONParse(worksTsContent, 'works', works);
worksTsContent = replaceJSONParse(worksTsContent, 'chapters', chapters);
fs.writeFileSync(worksTsPath, worksTsContent, 'utf-8');
console.log('Updated works.ts');

// passages_part2.ts
if (passagesContent) {
    passagesContent = replaceJSONParse(passagesContent, 'passagesPart2', passages);
    fs.writeFileSync(passagesFile, passagesContent, 'utf-8');
    console.log('Updated passages_part2.ts');
}

// part8.ts
if (sentencesContent) {
    sentencesContent = replaceJSONParse(sentencesContent, 'sentencesPart8', sentences);
    fs.writeFileSync(sentencesFile, sentencesContent, 'utf-8');
    console.log('Updated part8.ts');
}

console.log('Done!');
