import fs from 'fs';
import path from 'path';

const root = process.cwd();
const aidFile = path.join(root, 'src/data/readingAid.ts');
let aidSource = fs.readFileSync(aidFile, 'utf8');

const newTr = `"孟子再次重申先王道統說：「大禹厭惡美酒而喜愛聽取善言。商湯堅持中庸之道，舉用賢才不受宗族門第限制。周文王看待百姓就像看待受傷的人一樣痛惜，展望大道就像尚未看見一樣謙遜求索。周武王不輕慢細小的善行，不忘遠方的賢士。周公思考兼採夏商周三代聖王的美德，用來實行這四位聖王的事務；如果有不相符合的地方，便仰頭思考它，夜以繼日；幸而思考獲得了答案，便高興地坐著等待天亮去施行啊。」"`;

const p20Pattern = /('meng-zi_ch-8_p-20':\s*\{\s*translation:\s*)"孟子說：「大禹厭惡美酒[^"]+"/;
if (aidSource.match(p20Pattern)) {
  aidSource = aidSource.replace(p20Pattern, `$1${newTr}`);
  
  let written = false;
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      fs.writeFileSync(aidFile, aidSource, 'utf8');
      written = true;
      console.log(`Successfully updated meng-zi_ch-8_p-20 translation on attempt ${attempt}!`);
      break;
    } catch (err) {
      console.log(`Attempt ${attempt} failed: ${err.message}. Retrying...`);
      const end = Date.now() + 500;
      while (Date.now() < end) {}
    }
  }
} else {
  console.log("Could not find p20 pattern in readingAid.ts!");
}
