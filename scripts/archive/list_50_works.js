import fs from 'fs';

const worksSource = fs.readFileSync('src/data/works.ts', 'utf8');
const match = worksSource.match(/export const works: Work\[\] = JSON\.parse\(decodeURIComponent\("([^"]+)"\)\);/);

if (match) {
  const jsonStr = decodeURIComponent(match[1]);
  const works = JSON.parse(jsonStr);
  console.log(`Total works: ${works.length}`);
  works.forEach((w, index) => {
    console.log(`${index + 1}. [${w.id}] ${w.title} (${w.schoolId}) - ${w.chapterIds.length}章, ${w.totalChars}字`);
  });
}
