import fs from 'fs';
const content = fs.readFileSync('./src/data/works.ts', 'utf8');
const match = content.match(/decodeURIComponent\("([^"]+)"\)/);
if (match) {
  const decoded = decodeURIComponent(match[1]);
  const parsed = JSON.parse(decoded);
  console.log('Works schoolIds:', new Set(parsed.map(w => w.schoolId)));
  console.log('Works titles:', parsed.map(w => `${w.title} (${w.schoolId})`));
} else {
  console.log('No decodeURIComponent found');
}
