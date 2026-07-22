import fs from 'fs';
const html = fs.readFileSync('./scratch/dao-de-jing.html', 'utf8');

// Find a section of the HTML where chapter 1 starts
const anchorIndex = html.indexOf('id="n11592"');
if (anchorIndex !== -1) {
  console.log('Snippet around n11592:');
  console.log(html.substring(anchorIndex - 200, anchorIndex + 1000));
} else {
  console.log('n11592 not found');
}
