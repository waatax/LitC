import fs from 'fs';

const lunyuPath = 'C:/Users/User/.gemini/antigravity/brain/94415241-e907-4a0d-ab2d-2708f581a7e2/.system_generated/steps/658/content.md';
const mengziPath = 'C:/Users/User/.gemini/antigravity/brain/94415241-e907-4a0d-ab2d-2708f581a7e2/.system_generated/steps/660/content.md';

function extract(filePath, label) {
  if (!fs.existsSync(filePath)) {
    console.log(`${label} not found!`);
    return;
  }
  const html = fs.readFileSync(filePath, 'utf8');
  // Look for hrefs matching si-shu-zhang-ju-ji-zhu/...
  const matches = [...html.matchAll(/href=["']si-shu-zhang-ju-ji-zhu\/(.*?)["']/g)].map(m => m[1]);
  console.log(`=== ${label} links (${matches.length}) ===`);
  // Remove duplicates and print
  const unique = [...new Set(matches)];
  console.log(unique);
}

extract(lunyuPath, 'Lunyu');
extract(mengziPath, 'Mengzi');
