import fs from 'fs';
import path from 'path';

const files = ['zhongyong', 'lunyu', 'mengzi'];
const dir = 'C:/Users/User/.gemini/antigravity/brain/94415241-e907-4a0d-ab2d-2708f581a7e2/scratch';

for (const name of files) {
  const p = path.join(dir, `${name}.json`);
  if (fs.existsSync(p)) {
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    console.log(`=== ${name} ===`);
    console.log("Keys:", Object.keys(data));
    if (data.articles) {
      console.log(`Articles length: ${data.articles.length}`);
      console.log("Sample article:", data.articles[0]);
    } else if (Array.isArray(data)) {
      console.log(`Array length: ${data.length}`);
      console.log("Sample item:", data[0]);
    }
  }
}
