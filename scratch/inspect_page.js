import fs from 'fs';
const content = fs.readFileSync('C:/Users/User/.gemini/antigravity/brain/4626fe96-8a9f-4061-a8aa-e18484eefe63/.system_generated/steps/155/content.md', 'utf8');
console.log('File length:', content.length);
console.log(content.substring(0, 1000));
console.log('-----------------');
console.log(content.substring(content.length - 2000));
