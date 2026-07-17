import { getWorks, getSchools, getChapters } from '../src/data/index.ts';

console.log("Schools count:", getSchools().length);
console.log("Works count:", getWorks().length);
const works = getWorks();
if (works.length > 0) {
  console.log("First work:", works[0].title);
  console.log("Chapters for first work:", getChapters(works[0].id).length);
} else {
  console.log("No works found!");
}
