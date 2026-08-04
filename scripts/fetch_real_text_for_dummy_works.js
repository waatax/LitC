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

const dianjiBooks = JSON.parse(fs.readFileSync('scratch/dianji_books_converted.json', 'utf8'));

const dummyWorkNames = [
  '春秋左傳', '韓非子', '尚書', '詩經', '禮記', '春秋', '春秋穀梁傳', '春秋公羊傳',
  '後漢書', '前漢紀', '東觀漢記', '鹽鐵論', '國語', '晏子春秋', '吳越春秋',
  '越絕書', '西京雜記', '列女傳', '穆天子傳', '古三墳', '燕丹子'
];

async function run() {
  console.log("=== Finding Dianji.fun Book IDs for 21 Dummy Works ===");
  
  const matchedBooks = [];
  
  for (const name of dummyWorkNames) {
    const primaryName = name.replace(/^春秋/, '');
    const match = dianjiBooks.find(b => 
      b.titleTrad === name || b.titleTrad === primaryName ||
      b.titleTrad.includes(primaryName) || primaryName.includes(b.titleTrad)
    );
    if (match) {
      console.log(`Matched 《${name}》 -> Dianji.fun ID ${match.id} 《${match.titleTrad}》`);
      matchedBooks.push({ targetName: name, dianjiId: match.id, titleTrad: match.titleTrad });
    } else {
      console.log(`NO direct match for 《${name}》 in Dianji catalog`);
    }
  }
  
  fs.writeFileSync('scratch/matched_dummy_books.json', JSON.stringify(matchedBooks, null, 2), 'utf8');
}

run();
