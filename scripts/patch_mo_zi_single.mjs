import fs from 'fs';
import path from 'path';
import vm from 'vm';

function loadBundle(file) {
  const source = fs.readFileSync(file, 'utf8');
  const start = source.indexOf('JSON.parse(');
  const end = source.lastIndexOf(') as WorkBundle');
  const expression = source.slice(start, end + 1);
  return vm.runInNewContext(expression, Object.create(null), { timeout: 5_000 });
}

const mzPath = path.resolve('src/data/work_chunks/mo-zi.ts');
const bundle = loadBundle(mzPath);

const p = bundle.passages.find((x) => x.id === 'mo-zi_ch-52_p-3');
if (p) {
  p.readingAid.translation = `防備敵軍高臨雲梯進攻，應當使用重型連弩車。製造連弩車的木材，方正規格為一尺見方，其長度須與城牆防禦工事的厚薄相匹配。車身設有兩根車軸、三個車輪，車輪安裝在木筐底座之中，上下各有一層筐座。左右兩側各豎立兩根立柱，左右設有橫向立柱，橫柱左右兩端均為圓形軸承，內徑各為四寸。左右兩側的強弩均牢固捆綁在立柱上，用弦鉤連綴弓弦直至粗大主弦。弩臂前後與木筐邊緣平齊，車筐高度為八尺，弩軸距離下層木筐為三尺五寸。連弩機的銅郭全部由青銅鑄造，拉力達一百二十斤以上。利用絞盤轆轤拉引長弦張弩。車筐周長為三圍半，左右設有三寸見方的鉤距，車輪厚度為一尺二寸，鉤距臂寬度為一尺四寸，厚七寸，長六尺。橫臂與木筐外側平齊，爪距長一尺五寸，設有瞄準標尺與升降調節器，可上下靈活俯仰調整射角。弩矢長度為十尺，用強韌繩索係在箭尾，如同生絲弋射一般，射出後可用滑輪轆轤卷回回收。弩箭高出弩臂三尺，發射弩箭威力無窮，每車配備六十支重矢，小型箭矢隨取隨用不留空隙。每輛連弩車由十名精壯士卒協同操縱。防守時齊備所有器材，在城頭構築高樓瞭望台作為射擊孔道，城牆之上覆蓋草蓆木盾防禦敵軍矢石。`;
}

// Re-split sentences
const allSentences = [];
bundle.passages.forEach((p) => {
  const rawClauses = p.canonicalText
    .split(/(?<=[。！？；\n])/)
    .map((c) => c.trim())
    .filter(Boolean);

  const sids = [];
  rawClauses.forEach((c, cidx) => {
    const sid = `${p.id}_s-${cidx + 1}`;
    sids.push(sid);
    allSentences.push({
      id: sid,
      workId: 'mo-zi',
      chapterId: p.chapterId,
      passageId: p.id,
      order: cidx + 1,
      canonicalText: c,
      chunks: [],
    });
  });

  p.sentenceIds = sids;
});

bundle.sentences = allSentences;

const updatedMzContent = `import type { WorkBundle } from '../workLoader'

export default JSON.parse(
  ${JSON.stringify(JSON.stringify(bundle, null, 2))}
) as WorkBundle
`;

fs.writeFileSync(mzPath, updatedMzContent, 'utf8');
console.log('Successfully patched Mozi single passage.');
