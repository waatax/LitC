#!/usr/bin/env python3
"""Sync reading aids from work_chunks/*.ts to src/data/readingAid.ts."""
import glob
import json
import re
import sys
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ROOT = Path(".")
CHUNKS = ROOT / "src" / "data" / "work_chunks"
READING_AID_FILE = ROOT / "src" / "data" / "readingAid.ts"


def load_bundle(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    match = re.search(r"JSON\.parse\('(.*)'\)", text, re.S)
    if not match:
        raise ValueError("missing JSON.parse payload")
    raw_str = match.group(1).replace("\\'", "'").replace("\\\\", "\\")
    return json.loads(raw_str)


def main():
    aid_map = {}
    total_passages = 0

    for path_string in sorted(glob.glob(str(CHUNKS / "*.ts"))):
        path = Path(path_string)
        try:
            bundle = load_bundle(path)
        except Exception as e:
            print(f"Error loading {path.name}: {e}")
            continue

        for p in bundle.get("passages", []):
            total_passages += 1
            pid = p.get("id")
            aid = p.get("readingAid")
            if pid and aid:
                aid_map[pid] = {
                    "translation": aid.get("translation", ""),
                    "analysis": aid.get("analysis", "")
                }

    print(f"Collected {len(aid_map)} reading aids from {total_passages} passages.")

    lines = []
    lines.append("export interface PassageReadingAid {")
    lines.append("  translation: string")
    lines.append("  analysis: string")
    lines.append("}")
    lines.append("")
    lines.append("export const PASSAGE_AIDS: Record<string, PassageReadingAid> = {")

    for pid in sorted(aid_map.keys()):
        aid = aid_map[pid]
        t_json = json.dumps(aid["translation"], ensure_ascii=False)
        a_json = json.dumps(aid["analysis"], ensure_ascii=False)
        lines.append(f"  '{pid}': {{\n    translation: {t_json},\n    analysis: {a_json}\n  }},")

    lines.append("};")
    lines.append("")
    lines.append("export function getPassageReadingAid(passageId: string, _canonicalText?: string, _workId?: string, _sentences?: any[]): PassageReadingAid | undefined {")
    lines.append("  return PASSAGE_AIDS[passageId];")
    lines.append("}")
    lines.append("")

    content = "\n".join(lines)
    READING_AID_FILE.write_text(content, encoding="utf-8")
    print(f"Successfully updated {READING_AID_FILE} with {len(aid_map)} clean reading aids!")


if __name__ == "__main__":
    main()
