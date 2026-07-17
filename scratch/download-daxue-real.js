import fs from 'fs';
import path from 'path';

const url = 'https://raw.githubusercontent.com/hanzhaodeng/chinese-ancient-text/master/%E5%A4%A7%E5%AD%A6%E7%AB%A0%E5%8F%A5%E9%9B%86%E6%B3%A8.json';
const dir = 'C:/Users/User/.gemini/antigravity/brain/94415241-e907-4a0d-ab2d-2708f581a7e2/scratch';

async function main() {
  const res = await fetch(url);
  const data = await res.json();
  fs.writeFileSync(path.join(dir, 'daxue.json'), JSON.stringify(data, null, 2), 'utf8');
  console.log("Saved daxue.json!");
  console.log("Articles length:", data.articles.length);
  console.log("Sample article:", data.articles[0]);
}

main();
