const fs = require('node:fs')

const source = fs.readFileSync('src/data/works.ts', 'utf8')

function extract(name) {
  const match = source.match(new RegExp(`export const ${name} = JSON\\.parse\\(('(?:\\\\.|[^'\\\\])*')\\) as [A-Za-z]+\\[\\];`))
  if (!match) throw new Error(`Unable to extract ${name} from works.ts`)
  return JSON.parse(Function(`"use strict"; return ${match[1]}`)())
}

function asJsonParse(value) {
  const json = JSON.stringify(value)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
  return `JSON.parse('${json}')`
}

const works = extract('works')
const chapters = extract('chapters').map(({ passageIds: _passageIds, ...chapter }) => chapter)
const output = `// Generated lightweight library index. Run: node scripts/generate_catalog.cjs\n` +
  `import type { Work, Chapter } from '../types/content'\n\n` +
  `export const catalogWorks = ${asJsonParse(works)} as Work[]\n` +
  `export const catalogChapters = ${asJsonParse(chapters)} as Chapter[]\n`

fs.writeFileSync('src/data/catalog.ts', output, 'utf8')
console.log(`Generated catalog: ${works.length} works, ${chapters.length} chapters, ${output.length} bytes`)
