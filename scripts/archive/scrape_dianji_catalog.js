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
            console.error('API Return:', jsonRes);
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

async function run() {
  console.log("Fetching book page 1 from dianji.fun...");
  const page1 = await requestApi("/book/page/1/100");
  if (page1) {
    console.log("SUCCESS!", page1);
    fs.writeFileSync('scratch/dianji_books_all.json', JSON.stringify(page1, null, 2), 'utf8');
  } else {
    console.log("Failed to fetch.");
  }
}

run();
