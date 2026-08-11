#!/usr/bin/env python3
"""Restore only provably corrupt fields when the Git baseline is clean."""
from __future__ import annotations

import glob
import json
import re
from pathlib import Path

from audit_text_integrity import (
    CHUNKS, REPORT, ROOT, corruption_reasons, load_bundle, load_head_bundle,
)


def write_bundle(path: Path, bundle: dict) -> None:
    payload = json.dumps(bundle, ensure_ascii=True, separators=(",", ":")).replace("'", "\\'")
    path.write_text(
        "import type { WorkBundle } from '../workLoader'\n\n"
        f"export default JSON.parse('{payload}') as WorkBundle\n",
        encoding="utf-8",
    )


def repair_utf8_as_latin1(value):
    """Reverse the lossless UTF-8-as-Latin-1 corruption seen in 菜根譚."""
    if isinstance(value, dict):
        return {key: repair_utf8_as_latin1(item) for key, item in value.items()}
    if isinstance(value, list):
        return [repair_utf8_as_latin1(item) for item in value]
    if not isinstance(value, str) or not re.search(r"[\x80-\x9fÃÂäåæçèéï]", value):
        return value
    try:
        repaired = value.encode("latin-1").decode("utf-8")
        return repaired if len(corruption_reasons(repaired)) <= len(corruption_reasons(value)) else value
    except (UnicodeEncodeError, UnicodeDecodeError):
        return value


def main() -> int:
    report = json.loads(REPORT.read_text(encoding="utf-8"))
    targets: dict[str, list[dict]] = {}
    for issue in report["issues"]:
        if issue.get("headClean"):
            targets.setdefault(issue["work"], []).append(issue)

    changed = 0
    for work, issues in targets.items():
        path = CHUNKS / f"{work}.ts"
        current = load_bundle(path)
        baseline = load_head_bundle(path)
        if not baseline:
            continue
        current_by_id = {p["id"]: p for p in current.get("passages", [])}
        baseline_by_id = {p["id"]: p for p in baseline.get("passages", [])}
        for issue in issues:
            pid, field = issue["passageId"], issue["field"]
            dst, src = current_by_id[pid], baseline_by_id[pid]
            if field == "translation":
                dst.setdefault("readingAid", {})[field] = src.get("readingAid", {}).get(field, "")
            else:
                dst[field] = src[field]
            changed += 1
        write_bundle(path, current)

    # The committed 菜根譚 payload is itself corrupt. The workspace contains
    # the earlier per-batch extraction, keyed by stable passage IDs; use it only
    # for fields that the audit still identifies as corrupt.
    canonical_pool: dict[str, str] = {}
    for filename in glob.glob(str(ROOT / "scratch" / "batch_caigentan_*.json")):
        items = json.loads(Path(filename).read_text(encoding="utf-8"))
        if not isinstance(items, list):
            continue
        for item in items:
            pid, text = item.get("passageId"), item.get("canonicalText", "")
            if pid and text and not corruption_reasons(text):
                canonical_pool[pid] = text
    cai_path = CHUNKS / "cai-gen-tan.ts"
    cai_before = load_bundle(cai_path)
    cai = repair_utf8_as_latin1(cai_before)
    cai_changed = int(cai != cai_before)
    for passage in cai.get("passages", []):
        pid = passage.get("id", "")
        if corruption_reasons(passage.get("canonicalText", "")) and pid in canonical_pool:
            passage["canonicalText"] = canonical_pool[pid]
            changed += 1
            cai_changed += 1
    if cai_changed:
        write_bundle(cai_path, cai)
    print(f"Restored {changed} corrupt fields from clean Git baseline.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
