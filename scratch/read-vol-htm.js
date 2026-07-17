async function main() {
  const url = 'http://www.xn--5rtnx620bw5s.tw/f/f01/f01.htm';
  console.log("Fetching", url);
  try {
    const res = await fetch(url);
    const text = await res.text();
    console.log("Length of response:", text.length);
    console.log("First 1500 chars:");
    console.log(text.slice(0, 1500));
    console.log("\nLast 1500 chars:");
    console.log(text.slice(-1500));
  } catch (e) {
    console.error("Error:", e);
  }
}

main();
