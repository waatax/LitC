async function test() {
  const url = 'https://ctext.org/si-shu-zhang-ju-ji-zhu/xue-er-di-yi/zh';
  console.log("Fetching test chapter...");
  const res = await fetch(url);
  const html = await res.ok ? await res.text() : '';
  
  // Find all <span class="original">...</span>
  const matches = [...html.matchAll(/<span class="original">(.*?)<\/span>/g)].map(m => m[1]);
  console.log(`Found ${matches.length} original sentences:`);
  console.log(matches.slice(0, 10));
}

test();
