import fs from 'fs';

const files = {
  daxue: 'C:/Users/User/.gemini/antigravity/brain/94415241-e907-4a0d-ab2d-2708f581a7e2/.system_generated/steps/646/content.md',
  zhongyong: 'C:/Users/User/.gemini/antigravity/brain/94415241-e907-4a0d-ab2d-2708f581a7e2/.system_generated/steps/654/content.md',
  lunyu: 'C:/Users/User/.gemini/antigravity/brain/94415241-e907-4a0d-ab2d-2708f581a7e2/.system_generated/steps/658/content.md',
  mengzi: 'C:/Users/User/.gemini/antigravity/brain/94415241-e907-4a0d-ab2d-2708f581a7e2/.system_generated/steps/660/content.md'
};

for (const [name, path] of Object.entries(files)) {
  if (fs.existsSync(path)) {
    const stat = fs.statSync(path);
    console.log(`${name}: File size = ${stat.size} bytes`);
    const content = fs.readFileSync(path, 'utf8');
    // Find all occurrences of <h2> or similar headings or first occurrences of chapters
    const matches = [...content.matchAll(/<h2>(.*?)<\/h2>/g)].map(m => m[1]);
    console.log(`- Headings found (${matches.length}):`, matches.slice(0, 10));
  } else {
    console.log(`${name}: File not found at ${path}`);
  }
}
