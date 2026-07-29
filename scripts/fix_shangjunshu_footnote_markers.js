import fs from 'node:fs'

const worksFile = 'src/data/works.ts'
let source = fs.readFileSync(worksFile, 'utf8')
const matches = [...source.matchAll(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g)]
const datasets = matches.map(match => JSON.parse(decodeURIComponent(match[1])))
const [, , passages, sentences] = datasets
const affected = new Set(['shang-jun-shu_ch-4_p-1', 'shang-jun-shu_ch-20_p-1'])

for (const passage of passages) {
  if (affected.has(passage.id)) passage.canonicalText = passage.canonicalText.replace('以強去強1者', '以強去強者')
}
for (const sentence of sentences) {
  if (!affected.has(sentence.passageId)) continue
  sentence.canonicalText = sentence.canonicalText.replace('以強去強1者', '以強去強者')
  for (const chunk of sentence.chunks || []) chunk.text = chunk.text.replace('以強去強1者', '以強去強者')
}

let datasetIndex = 0
source = source.replace(/JSON\.parse\(decodeURIComponent\("([^"]+)"\)\)/g, () =>
  `JSON.parse(decodeURIComponent("${encodeURIComponent(JSON.stringify(datasets[datasetIndex++]))}"))`)
fs.writeFileSync(worksFile, source, 'utf8')
console.log(`Removed source footnote markers from ${affected.size} 商君書 passages.`)
