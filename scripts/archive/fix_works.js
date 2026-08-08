import fs from 'fs';
const f = 'src/data/works.ts';
let c = fs.readFileSync(f, 'utf8');
c = c.replace(/export const works = JSON\.parse\('([^]+?)'\)/, "export const works = JSON.parse('$1') as any");
c = c.replace(/export const chapters = JSON\.parse\('([^]+?)'\)/, "export const chapters = JSON.parse('$1') as any");
fs.writeFileSync(f, c, 'utf8');
