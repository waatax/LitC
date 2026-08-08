import fs from 'fs';
const content = fs.readFileSync('C:/Users/User/.gemini/antigravity/brain/94415241-e907-4a0d-ab2d-2708f581a7e2/.system_generated/steps/385/content.md', 'utf8');
const idx = content.indexOf('素位');
const sub = content.substring(idx - 1000, idx);
console.log(sub);
