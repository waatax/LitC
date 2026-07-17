async function main() {
  const url = 'http://www.xn--5rtnx620bw5s.tw/f/f.htm';
  console.log("Fetching", url);
  try {
    const res = await fetch(url);
    const text = await res.text();
    console.log("Length of response:", text.length);
    console.log("First 1000 chars:");
    console.log(text.slice(0, 1000));
    console.log("\nLast 1000 chars:");
    console.log(text.slice(-1000));
  } catch (e) {
    console.error("Error:", e);
  }
}

main();
