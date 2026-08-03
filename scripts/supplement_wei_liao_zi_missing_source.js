import fs from 'fs';
const path = './scratch/wei_liao_zi_full_source.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const supplements = new Map([
  ['伍制令', '軍中之制，五人為伍，伍相保也。十人為什，五十人為屬，百人為閭。什伍相結，上下相聯，無有不得之姦，無有不揭之罪，父不得以私其子，兄不得以私其弟，而況國人聚舍同食，烏能以干令相私者哉。'],
  ['分塞令', '中軍、左、右、前、後軍，皆有分地，方之以行垣，而無通其交往。將有分地，帥有分地，伯有分地，皆營其溝域，而明其塞令，使非百人無得通。非其百人而入者伯誅之，伯不誅與之同罪。\n軍中縱橫之道，百有二十步而立一府柱。量人與地，柱道相望，禁行清道，非將吏之符節，不得通行。采薪芻牧者皆成伍，不成伍者不得通行。吏屬無節，士無伍者，橫門誅之。踰分干地者，誅之。故內無干令犯禁，則外無不獲之姦。'],
  ['束伍令', '束伍之令曰：五人為伍，共一符，收於將吏之所，亡伍而得伍當之。得伍而不亡有賞，亡伍不得伍，身死家殘。亡長得長當之，得長不亡有賞，亡長不得長，身死家殘。復戰得首長，除之。亡將得將當之，得將不亡有賞，亡將不得將，坐離地遁逃之法。戰誅之法曰：什長得誅十人，伯長得誅什長，千人之將得誅百人之長，萬人之將得誅千人之將，左右將軍得誅萬人之將，大將軍無不得誅。'],
  ['經卒令', '經卒者以經令分之為三分焉。左軍蒼旗卒戴蒼羽，右軍白旗卒戴白羽，中軍黃旗卒戴黃羽。卒有五章：前一行蒼章，次二行赤章，次三行黃章，次四行白章，次五行黑章。次以經卒亡章者有誅：前一五行置章于首，次二五行置章于項，次三五行置章于胷，次四五行置章于腹，次五行置章于腰。如此卒無非其吏，吏無非其卒；見非而不詰，見亂而不禁，其罪如之。鼓行交鬭，則前行進為犯難，後行退為辱眾；踰五行而前者有賞，踰五行而後者有誅，所以知進退先後吏卒之功也。故曰：鼓之前如雷霆，動如風雨，莫敢當其前，莫敢躡其後，言有經也。'],
]);
for (const chapter of data.chapters) {
  const text = supplements.get(chapter.title);
  if (text) chapter.text = text;
}
data.missingChapters = [];
data.fetchedAt = new Date().toISOString();
fs.writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ supplemented: supplements.size, missingChapters: data.missingChapters }, null, 2));
