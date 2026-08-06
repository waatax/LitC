import { execSync } from 'child_process';
try {
  const txt = execSync('git show HEAD~2:src/data/works.ts', { maxBuffer: 1024 * 1024 * 10 }).toString();
  const m = txt.match(/\{"id":"cai-gen-tan_ch-[45]"[^}]+\}/g);
  if (m) {
    m.forEach(match => console.log(match));
  } else {
    console.log('not found');
  }
} catch (e) {
  console.log(e.message);
}
