const fs = require('node:fs')
const path = require('node:path')

function listTypeScriptFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const target = path.join(directory, entry.name)
    return entry.isDirectory() ? listTypeScriptFiles(target) : entry.name.endsWith('.ts') ? [target] : []
  })
}

const pattern = /export const (\w+): ([A-Za-z]+\[\]) = JSON\.parse\(decodeURIComponent\("([\s\S]*?)"\)\);/g
const rawArrayPattern = /export const (\w+) = (\[[^\n]+\]) as unknown as ([A-Za-z]+\[\]);/g
let totalPayloads = 0
let bytesBefore = 0
let bytesAfter = 0

for (const file of listTypeScriptFiles('src/data')) {
  const source = fs.readFileSync(file, 'utf8')
  let filePayloads = 0
  let normalized = source.replace(pattern, (_match, name, type, encoded) => {
    filePayloads += 1
    return `export const ${name} = ${decodeURIComponent(encoded)} as unknown as ${type};`
  })

  normalized = normalized.replace(rawArrayPattern, (_match, name, json, type) => {
    const escaped = json
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029')
    return `export const ${name} = JSON.parse('${escaped}') as ${type};`
  })
  normalized = normalized
    .replace("] as unknown as Work[] as unknown as Work[]') as Work[];", "]') as Work[];")
    .replace("] as unknown as Chapter[] as unknown as Chapter[]') as Chapter[];", "]') as Chapter[];")

  if (normalized !== source) {
    fs.writeFileSync(file, normalized, 'utf8')
    totalPayloads += filePayloads
    bytesBefore += source.length
    bytesAfter += normalized.length
    console.log(`${file}: ${filePayloads} payload(s), ${source.length} -> ${normalized.length} bytes`)
  }
}

console.log(`Normalized ${totalPayloads} payloads: ${bytesBefore} -> ${bytesAfter} bytes`)
