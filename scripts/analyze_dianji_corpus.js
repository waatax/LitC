import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';
import crypto from 'crypto';
import https from 'https';
import fs from 'fs';
import * as OpenCC from 'opencc-js';

const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });

const KEY_HEX = "a9e15f58d41c2853fa63b7b9f376f9de334a790e90301d2ac573ecf0a99f7bc3";
const KEY = Buffer.from(KEY_HEX, 'hex');
const SALT = "8MDz@JLgBBUk^GJR";

const agent = new https.Agent({ rejectUnauthorized: false });

function encryptPath(pathStr) {
  const nonce = nacl.randomBytes(24);
  const msg = naclUtil.decodeUTF8(pathStr);
  const cipher = nacl.secretbox(msg, nonce, KEY);
  
  const combined = new Uint8Array(nonce.length + cipher.length);
  combined.set(nonce, 0);
  combined.set(cipher, nonce.length);
  
  const b64 = naclUtil.encodeBase64(combined);
  return b64.replace(/\//g, '_').replace(/\+/g, '-');
}

function decryptData(b64Data) {
  const stdB64 = b64Data.replace(/_/g, '/').replace(/-/g, '+');
  const combined = naclUtil.decodeBase64(stdB64);
  
  const nonce = combined.slice(0, 24);
  const cipher = combined.slice(24);
  
  const decrypted = nacl.secretbox.open(cipher, nonce, KEY);
  if (!decrypted) throw new Error("Decryption failed");
  return naclUtil.encodeUTF8(decrypted);
}

function genSignature(encPath, ts, nonce) {
  const params = { path: encPath, timestamp: String(ts), nonce: String(nonce) };
  const sortedKeys = Object.keys(params).sort();
  const paramStr = sortedKeys.map(k => `${k}=${params[k]}`).join('&');
  return crypto.createHash('md5').update(paramStr + SALT).digest('hex');
}

function requestApi(relPath) {
  return new Promise((resolve, reject) => {
    const ts = Date.now();
    const nonce = crypto.randomUUID().replace(/-/g, '');
    const encPath = encryptPath(relPath);
    const sig = genSignature(encPath, ts, nonce);
    
    const url = `https://www.dianji.fun/api/${encPath}`;
    const req = https.get(url, {
      agent,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'X-Timestamp': String(ts),
        'X-Nonce': nonce,
        'X-Signature': sig
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonRes = JSON.parse(data);
          if (jsonRes.code === 200 && jsonRes.data) {
            const decStr = decryptData(jsonRes.data);
            resolve(JSON.parse(decStr));
          } else {
            resolve(null);
          }
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
  });
}

async function fetchAllDianjiBooks() {
  console.log("Fetching dianji.fun books catalog...");
  let pageNum = 1;
  const pageSize = 100;
  let allBooks = [];
  
  while (pageNum <= 25) { // Fetch up to 2,500 books across all 25 pages
    console.log(`Fetching page ${pageNum}...`);
    const res = await requestApi(`/book/page/${pageNum}/${pageSize}`);
    if (res && res.data && Array.isArray(res.data.data)) {
      const records = res.data.data;
      allBooks = allBooks.concat(records);
      console.log(`Page ${pageNum} fetched ${records.length} books. Accum Total: ${allBooks.length}`);
      if (!res.data.hasNext) break;
      pageNum++;
    } else {
      break;
    }
  }
  
  console.log(`Fetched ${allBooks.length} books total!`);
  
  // Convert all Simplified Chinese to 100% Traditional Chinese
  const convertedBooks = allBooks.map(b => ({
    id: b.id,
    titleSimp: b.bookName || b.name,
    titleTrad: converter(b.bookName || b.name || ''),
    authorSimp: b.authorName || b.author || '',
    authorTrad: converter(b.authorName || b.author || ''),
    dynastySimp: b.dynastyName || b.dynasty || '',
    dynastyTrad: converter(b.dynastyName || b.dynasty || ''),
    summarySimp: b.summary || b.brief || '',
    summaryTrad: converter(b.summary || b.brief || '')
  }));
  
  fs.writeFileSync('scratch/dianji_books_converted.json', JSON.stringify(convertedBooks, null, 2), 'utf8');
  console.log("Saved scratch/dianji_books_converted.json");
  return convertedBooks;
}

fetchAllDianjiBooks();
