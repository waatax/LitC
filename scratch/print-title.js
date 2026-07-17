import fs from 'fs';

const html = fs.readFileSync('C:/Users/User/.gemini/antigravity/brain/94415241-e907-4a0d-ab2d-2708f581a7e2/scratch/ctext_cache/lunyu_xue-er-di-yi.html', 'utf8');

const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/);
console.log("Title:", titleMatch ? titleMatch[1].trim() : "No title found");

// Check for redirects or error messages
console.log("First 500 chars of HTML:");
console.log(html.slice(0, 500));
