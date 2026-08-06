import fs from 'fs';

let readingAidCode = fs.readFileSync('./src/data/readingAid.ts', 'utf8');

// Fix traditional variants identified by audit
readingAidCode = readingAidCode.replace(/鬱郁紛紛/g, '鬱鬱紛紛');
readingAidCode = readingAidCode.replace(/鬱郁乎文哉/g, '鬱鬱乎文哉');
readingAidCode = readingAidCode.replace(/鬱郁，文章貌/g, '鬱鬱，文章貌');
readingAidCode = readingAidCode.replace(/鬱郁，文/g, '鬱鬱，文');
readingAidCode = readingAidCode.replace(/朱干玉鏚/g, '朱幹玉鏚');

fs.writeFileSync('./src/data/readingAid.ts', readingAidCode, 'utf8');
console.log('Fixed 8 traditional Chinese variant lines!');
