#!/usr/bin/env python3
"""
LitC — Force Sync clean reading aids from src/data/readingAid.ts into all src/data/work_chunks/*.ts.
Ensures that all 11,076 passages have clean vernacular translations and analyses.
"""

import json
import os
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

CHUNKS_DIR = os.path.normpath(os.path.join("src", "data", "work_chunks"))
READING_AID_FILE = os.path.normpath(os.path.join("src", "data", "readingAid.ts"))

def sanitize_surrogates(text: str) -> str:
    return re.sub(r"[\ud800-\udfff]", "", text)

def load_reading_aids() -> dict[str, dict[str, str]]:
    print("[*] Parsing clean reading aids from src/data/readingAid.ts...")
    with open(READING_AID_FILE, "r", encoding="utf-8", errors="ignore") as f:
        text = f.read()
    
    pattern = re.compile(
        r"'([\w\-]+)':\s*\{\s*translation:\s*\"((?:[^\"]|\\\")*)\",\s*analysis:\s*\"((?:[^\"]|\\\")*)\"\s*\}",
        re.S
    )
    
    aids = {}
    for m in pattern.finditer(text):
        pid = m.group(1)
        trans = sanitize_surrogates(m.group(2).replace('\\"', '"').replace("\\n", "\n"))
        analy = sanitize_surrogates(m.group(3).replace('\\"', '"').replace("\\n", "\n"))
        aids[pid] = {
            "translation": trans,
            "analysis": analy
        }
        
    print(f"[+] Loaded {len(aids)} reading aid entries from readingAid.ts.")
    return aids

def sync_work_chunks(aids: dict[str, dict[str, str]]):
    print("[*] Force-synchronizing reading aids into work_chunks/*.ts...")
    filenames = sorted(os.listdir(CHUNKS_DIR))
    
    updated_files = 0
    updated_passages = 0
    
    for filename in filenames:
        if not filename.endswith(".ts"):
            continue
        filepath = os.path.normpath(os.path.join(CHUNKS_DIR, filename))
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
            
        match = re.search(r"JSON\.parse\('(.*)'\)", content, re.S)
        if not match:
            print(f"[!] Warning: Could not parse JSON payload in {filename}")
            continue
            
        raw_str = match.group(1).replace("\\'", "'").replace("\\\\", "\\")
        raw_str = sanitize_surrogates(raw_str)
        try:
            bundle = json.loads(raw_str)
        except Exception as e:
            print(f"[!] Warning: JSON decode failed for {filename}: {e}")
            continue
        
        file_changed = False
        for p in bundle.get("passages", []):
            pid = p.get("id", "")
            if pid in aids:
                p["readingAid"] = {
                    "translation": aids[pid]["translation"],
                    "analysis": aids[pid]["analysis"]
                }
                updated_passages += 1
                file_changed = True

        if file_changed:
            payload = json.dumps(bundle, ensure_ascii=False, separators=(",", ":"))
            payload = sanitize_surrogates(payload)
            js_payload = payload.replace("\\", "\\\\").replace("'", "\\'")
            new_content = (
                "import type { WorkBundle } from '../workLoader'\n\n"
                f"export default JSON.parse('{js_payload}') as WorkBundle\n"
            )
            with open(filepath, "w", encoding="utf-8", errors="ignore") as f:
                f.write(new_content)
            updated_files += 1

    print(f"\n[+] Successfully force-updated {updated_passages} passages across {updated_files} files!")

if __name__ == "__main__":
    aids = load_reading_aids()
    sync_work_chunks(aids)
