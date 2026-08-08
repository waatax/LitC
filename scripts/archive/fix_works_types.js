import fs from 'fs';

let worksStr = fs.readFileSync('src/data/works.ts', 'utf8');

worksStr = worksStr.replace(/export const works = JSON\.parse\('([^']+)'\)(?:\s*as Work\[\])?;?/, "export const works = JSON.parse('$1') as Work[];");
worksStr = worksStr.replace(/export const chapters = JSON\.parse\('([^']+)'\)(?:\s*as Chapter\[\])?;?/, "export const chapters = JSON.parse('$1') as Chapter[];");

fs.writeFileSync('src/data/works.ts', worksStr, 'utf8');
console.log('Fixed works.ts types with semicolons');
