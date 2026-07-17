import fs from 'fs';

const path = 'C:/Users/User/.gemini/antigravity/brain/94415241-e907-4a0d-ab2d-2708f581a7e2/.system_generated/steps/759/content.md';
if (fs.existsSync(path)) {
  const html = fs.readFileSync(path, 'utf8');
  console.log("HTML length:", html.length);
  const query = '學而時習之';
  console.log(`Contains "${query}":`, html.includes(query));
} else {
  console.log("File not found!");
}
