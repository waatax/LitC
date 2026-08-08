import fs from 'fs';

const worksFile = 'src/data/works.ts';
const chunkFile = 'src/data/work_chunks/three-strategies.ts';

// 1. Load the new three-strategies chunk
const chunkDataStr = fs.readFileSync(chunkFile, 'utf8');
const workBundleMatch = chunkDataStr.match(/JSON\.parse\('(.+)'\) as WorkBundle/);
if (!workBundleMatch) throw new Error('Cannot parse chunk data');
const newBundle = JSON.parse(workBundleMatch[1]);

// 2. Load works.ts and parse the works and chapters arrays
const worksDataStr = fs.readFileSync(worksFile, 'utf8');

const worksMatch = worksDataStr.match(/export const works = JSON\.parse\('(\[.+?\])'\)/);
const chaptersMatch = worksDataStr.match(/export const chapters = JSON\.parse\('(\[.+?\])'\)/);

if (!worksMatch || !chaptersMatch) {
    throw new Error('Could not find works or chapters export in works.ts');
}

const works = JSON.parse(worksMatch[1]);
const chapters = JSON.parse(chaptersMatch[1]);

// 3. Remove old three-strategies data
const workId = 'three-strategies';
const worksClean = works.filter(w => w.id !== workId);
const chaptersClean = chapters.filter(c => c.workId !== workId);

// 4. Inject new three-strategies data
worksClean.push(newBundle.work);
chaptersClean.push(...newBundle.chapters);

// 5. Replace in works.ts
let newWorksDataStr = worksDataStr.replace(worksMatch[0], `export const works = JSON.parse('${JSON.stringify(worksClean).replace(/'/g, "\\'")}')`);
newWorksDataStr = newWorksDataStr.replace(chaptersMatch[0], `export const chapters = JSON.parse('${JSON.stringify(chaptersClean).replace(/'/g, "\\'")}')`);

fs.writeFileSync(worksFile, newWorksDataStr, 'utf8');
console.log('Successfully injected three-strategies works and chapters into works.ts');

// Since passages are stored in passagesPart1/2, we don't necessarily have to inject them there 
// because workLoader dynamically loads passages from src/data/work_chunks/*.ts!
// Let's verify this assumption. We'll just exit here.
