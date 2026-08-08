import fs from 'fs';

const files = ['src/data/works.ts', 'src/data/sentence_chunks/passages_part2.ts', 'src/data/sentence_chunks/part8.ts'];

for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');
  // It looks like JSON.parse(\'[...]...
  // So we replace JSON.parse(\' with JSON.parse(' and \') as any with ') as Work[] etc.
  c = c.replace(/JSON\.parse\\\(\\\\'/g, "JSON.parse('");
  c = c.replace(/\\\\'\\\)/g, "')");
  
  // also fix the export lines directly to ensure they match generate_work_chunks.cjs expectations EXACTLY
  if (f === 'src/data/works.ts') {
    c = c.replace(/export const works = JSON\.parse\(\\'([^]+?)\\'\)(?: as any)?/, "export const works = JSON.parse('$1')");
    c = c.replace(/export const chapters = JSON\.parse\(\\'([^]+?)\\'\)(?: as any)?/, "export const chapters = JSON.parse('$1')");
    // Wait, earlier my inline node script also probably ruined the others.
    // Let's just do a clean replacement of \' to ' around JSON.parse.
    c = c.replace(/JSON\.parse\(\\'/g, "JSON.parse('");
    c = c.replace(/\\'\)/g, "')");
    c = c.replace(/export const works = JSON\.parse\('([^]+?)'\)(?: as any)?/, "export const works = JSON.parse('$1')");
    c = c.replace(/export const chapters = JSON\.parse\('([^]+?)'\)(?: as any)?/, "export const chapters = JSON.parse('$1')");
  } else if (f === 'src/data/sentence_chunks/passages_part2.ts') {
    c = c.replace(/JSON\.parse\(\\'/g, "JSON.parse('");
    c = c.replace(/\\'\)/g, "')");
    c = c.replace(/export const passagesPart2 = JSON\.parse\('([^]+?)'\)(?: as any)?/, "export const passagesPart2 = JSON.parse('$1') as Passage[]");
  } else if (f === 'src/data/sentence_chunks/part8.ts') {
    c = c.replace(/JSON\.parse\(\\'/g, "JSON.parse('");
    c = c.replace(/\\'\)/g, "')");
    c = c.replace(/export const sentencesPart8 = JSON\.parse\('([^]+?)'\)(?: as any)?/, "export const sentencesPart8 = JSON.parse('$1') as Sentence[]");
  }
  
  fs.writeFileSync(f, c, 'utf8');
}
console.log('Fixed quotes in files.');
