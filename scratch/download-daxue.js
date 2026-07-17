async function download() {
  const url = 'https://raw.githubusercontent.com/hanzhaodeng/chinese-ancient-text/master/%E5%A4%A7%E5%AD%A6%E7%AB%A0%E5%8F%A5%E9%9B%86%E6%B3%A8.json';
  console.log(`Downloading daxue from ${url}...`);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log(`Success! Data length = ${JSON.stringify(data).length} chars`);
    // Print first keys
    console.log("Keys:", Object.keys(data).slice(0, 5));
    // Let's print some sample structure
    if (Array.isArray(data)) {
      console.log("Sample item:", data[0]);
    } else {
      console.log("Keys in object:", Object.keys(data));
    }
  } catch (e) {
    console.error("Failed:", e);
  }
}

download();
