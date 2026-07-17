import fs from 'fs';
import path from 'path';

const cacheDir = 'C:/Users/User/.gemini/antigravity/brain/94415241-e907-4a0d-ab2d-2708f581a7e2/scratch/ctext_cache';
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

const daxueUrl = 'https://ctext.org/si-shu-zhang-ju-ji-zhu/da-xue-zhang-ju/zh';
const zhongyongUrl = 'https://ctext.org/si-shu-zhang-ju-ji-zhu/zhong-yong-zhang-ju/zh';

const lunyuChapters = [
  'xue-er-di-yi', 'wei-zheng-di-er', 'ba-yi-di-san', 'li-ren-di-si',
  'gong-ye-chang-di-wu', 'yong-ye-di-liu', 'shu-er-di-qi', 'tai-bo-di-ba',
  'zi-han-di-jiu', 'xiang-dang-di-shi', 'xian-jin-di-shi-yi', 'yan-yuan-di-shi-er',
  'zi-lu-di-shi-san', 'xian-wen-di-shi-si', 'wei-ling-gong-di-shi-wu', 'ji-shi-di-shi-liu',
  'yang-huo-di-shi-qi', 'wei-zi-di-shi-ba', 'zi-zhang-di-shi-jiu', 'yao-yue-di-er-shi'
];

const mengziChapters = [
  'liang-hui-wang-zhang-ju-shang', 'liang-hui-wang-zhang-ju-xia',
  'gong-sun-chou-zhang-ju-shang', 'gong-sun-chou-zhang-ju-xia',
  'teng-wen-gong-zhang-ju-shang', 'teng-wen-gong-zhang-ju-xia',
  'li-lou-zhang-ju-shang', 'li-lou-zhang-ju-xia',
  'wan-zhang-zhang-ju-shang', 'wan-zhang-zhang-ju-xia',
  'gao-zi-zhang-ju-shang', 'gao-zi-zhang-ju-xia',
  'jin-xin-zhang-ju-shang', 'jin-xin-zhang-ju-xia'
];

async function fetchAndCache(url, filename, force = false) {
  const filePath = path.join(cacheDir, filename);
  if (!force && fs.existsSync(filePath)) {
    console.log(`Cache exists for ${filename}`);
    return;
  }
  console.log(`Fetching ${url}...`);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`Saved ${filename}!`);
    // Wait 250ms to be polite to ctext
    await new Promise(r => setTimeout(r, 250));
  } catch (e) {
    console.error(`Failed to fetch ${url}:`, e);
  }
}

async function main() {
  // 1. Great Learning & Doctrine of the Mean
  await fetchAndCache(daxueUrl, 'daxue.html', true);
  await fetchAndCache(zhongyongUrl, 'zhongyong.html', true);
  
  // 2. Analects (20 chapters)
  for (const ch of lunyuChapters) {
    const url = `https://ctext.org/si-shu-zhang-ju-ji-zhu/${ch}/zh`;
    await fetchAndCache(url, `lunyu_${ch}.html`, true);
  }
  
  // 3. Mencius (14 chapters)
  for (const ch of mengziChapters) {
    const url = `https://ctext.org/si-shu-zhang-ju-ji-zhu/${ch}/zh`;
    await fetchAndCache(url, `mengzi_${ch}.html`, true);
  }
  
  console.log("All files fetched and cached!");
}

main();
