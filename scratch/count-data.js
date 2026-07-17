import { works, chapters, passages, sentences } from '../src/data/works.ts';

console.log("=== DATA COUNTS ===");
console.log("Total works:", works.length);
console.log("Total chapters:", chapters.length);
console.log("Total passages:", passages.length);
console.log("Total sentences:", sentences.length);

console.log("\n=== WORKS DETAILS ===");
works.forEach(w => {
  console.log(`- ${w.title} (${w.id}) under ${w.schoolId}: ${w.chapterIds.length} chapters, ${w.totalChars} chars`);
});
