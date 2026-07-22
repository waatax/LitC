import fs from 'fs';
const content = fs.readFileSync('C:/Users/User/.gemini/antigravity/brain/4626fe96-8a9f-4061-a8aa-e18484eefe63/.system_generated/steps/155/content.md', 'utf8');

// Print lines around the word "第一" or "1" to see how chapters are listed
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('第一') || line.includes('chapter') || line.includes('天瑞')) {
    console.log(`${idx + 1}: ${line}`);
  }
});
