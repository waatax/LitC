async function main() {
  const url = 'https://ancient-china-books.github.io/guwenguanzhi/';
  console.log("Fetching", url);
  try {
    const res = await fetch(url);
    const text = await res.text();
    console.log("Length of response:", text.length);
    
    // Find all links to OEBPS/Text/part*.html
    const linkRegex = /href="OEBPS\/Text\/(part[0-9]+.html)"/g;
    const links = [...text.matchAll(linkRegex)].map(m => m[1]);
    console.log(`Found ${links.length} chapter links!`);
    if (links.length > 0) {
      console.log("First 10 links:", links.slice(0, 10));
      console.log("Last 10 links:", links.slice(-10));
    }
  } catch (e) {
    console.error("Error:", e);
  }
}

main();
