import fs from 'fs';
import path from 'path';

const urls = {
  daxue: 'https://raw.githubusercontent.com/hanzhaodeng/chinese-ancient-text/master/%E5%A4%A7%E5%AD%A6.json',
  zhongyong: 'https://raw.githubusercontent.com/hanzhaodeng/chinese-ancient-text/master/%E4%B8%AD%E5%BA%B8.json',
  lunyu: 'https://raw.githubusercontent.com/hanzhaodeng/chinese-ancient-text/master/%E8%AE%BA%E8%AF%AD.json',
  mengzi: 'https://raw.githubusercontent.com/hanzhaodeng/chinese-ancient-text/master/%E5%AD%9F%E5%AD%90.json'
};

const outputDir = 'C:/Users/User/.gemini/antigravity/brain/94415241-e907-4a0d-ab2d-2708f581a7e2/scratch';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function download() {
  for (const [name, url] of Object.entries(urls)) {
    console.log(`Downloading ${name} from ${url}...`);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const filePath = path.join(outputDir, `${name}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`Saved ${name}.json to ${filePath}. Size = ${JSON.stringify(data).length} chars`);
    } catch (e) {
      console.error(`Failed to download ${name}:`, e);
    }
  }
}

download();
