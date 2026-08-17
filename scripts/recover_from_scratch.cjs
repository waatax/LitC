const fs = require('fs');
const path = require('path');

const QUEUE_FILE = path.join(process.cwd(), 'scratch', 'repair_queue.json');
const queue = JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8'));
const queueIds = new Set(queue.map(q => q.id));

const goodPool = new Map();

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  for (const filename of fs.readdirSync(dir)) {
    if (filename.endsWith('.json') && !filename.startsWith('audit_') && !filename.startsWith('temp_fix')) {
      const p = path.join(dir, filename);
      try {
        const data = JSON.parse(fs.readFileSync(p, 'utf8'));
        let items = [];
        if (Array.isArray(data)) items = data;
        else if (data.results) items = data.results;
        else if (data.passages) items = data.passages;
        else if (data.data) items = data.data;
        else if (typeof data === 'object') {
           items = Object.values(data);
        }
        
        for (const item of items) {
          if (!item || typeof item !== 'object') continue;
          const id = item.id || item.passageId;
          const t = item.translation || (item.readingAid && item.readingAid.translation);
          const a = item.analysis || (item.readingAid && item.readingAid.analysis);
          
          if (id && t && a) {
            // Check if analysis is not a template
            if (typeof a === 'string' && !a.includes('這是一段經過虛擬國學大師') && !a.includes('為後世理解先秦兩漢學術源流與治國理政提供深遠啟示')) {
               const normLen = a.replace(/[^\u4e00-\u9fa5]/g, '').length;
               if (normLen >= 80) {
                 goodPool.set(id, { translation: t, analysis: a });
               }
            }
          }
        }
      } catch (e) {}
    }
  }
}

scanDir(path.join(process.cwd(), 'scratch'));
scanDir(path.join(process.cwd(), 'scratch', 'reading_aid_results'));
scanDir(path.join(process.cwd(), 'scratch', 'stage1_batches'));
scanDir(path.join(process.cwd(), 'scratch', 'stage23_batches'));
scanDir(path.join(process.cwd(), 'scratch', 'reading_aid_batches'));

let matchCount = 0;
const fixedArray = [];

for (const q of queue) {
  if (goodPool.has(q.id)) {
    matchCount++;
    fixedArray.push({
      id: q.id,
      translation: goodPool.get(q.id).translation,
      analysis: goodPool.get(q.id).analysis
    });
  }
}

console.log(`Found good replacements for ${matchCount} out of ${queue.length} passages in queue.`);
fs.writeFileSync('scratch/temp_fix.json', JSON.stringify(fixedArray, null, 2));
