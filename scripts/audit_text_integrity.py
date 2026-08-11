#!/usr/bin/env python3
"""Audit every active classical passage and vernacular translation.

This is deliberately stricter than the historical completeness checks: a
non-empty string is not considered valid when it contains replacement/private
use characters or the characteristic debris produced by a UTF-8/Big5 decode
failure.
"""
from __future__ import annotations

import glob
import json
import os
import re
import subprocess
from collections import Counter
from pathlib import Path


ROOT = Path(".")
CHUNKS = ROOT / "src" / "data" / "work_chunks"
REPORT = ROOT / "scratch" / "text_integrity_audit.json"

PRIVATE_USE = re.compile(r"[\ue000-\uf8ff]")
REPLACEMENT = re.compile(r"[\ufffd\u25a0]")
# Repeated characters strongly characteristic of the corpus' observed mojibake.
MOJIBAKE = re.compile(r"[\ue000-\uf8ff摮隤€§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿ÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ]")

SEMANTIC_PLACEHOLDERS = (
    "上古時代聖賢尊奉禮法、修持德行",
    "中原與四方諸侯前來朝見問候",
    "這段文字記述了古聖先賢對於",
    "旨在說明遵循禮法道德",
    "軍事防衛與遠徵是關係國家安危的重大事務",
    "君子注重自身的道德修養與使命擔當",
    "為該典籍中的核心論述篇章",
    "【深度校正版翻譯】",
    "這是一段經過虛擬國學大師",
    "因時制宜與修己安人的核心要義",
    "遵循禮法道德、因時制宜",
    "闡發，旨在說明遵循禮法道德",
    "核心要義。。這段文字記述了古聖先賢對於",
)


def load_bundle(path: Path) -> dict:
    with open(str(path), "r", encoding="utf-8") as f:
        text = f.read()
    match = re.search(r"JSON\.parse\('(.*)'\)", text, re.S)
    if not match:
        raise ValueError("missing JSON.parse payload")
    raw_str = match.group(1).replace("\\'", "'").replace("\\\\", "\\")
    return json.loads(raw_str)


def load_head_bundle(path: Path) -> dict | None:
    rel = path.relative_to(ROOT).as_posix()
    try:
        raw = subprocess.check_output(
            ["git", "-c", f"safe.directory={ROOT.as_posix()}", "show", f"HEAD:{rel}"],
            cwd=ROOT,
        ).decode("utf-8")
        match = re.search(r"JSON\.parse\('(.*)'\)", raw, re.S)
        if not match:
            return None
        raw_str = match.group(1).replace("\\'", "'").replace("\\\\", "\\")
        return json.loads(raw_str)
    except Exception:
        return None


def corruption_reasons(text: str) -> list[str]:
    reasons: list[str] = []
    if REPLACEMENT.search(text):
        reasons.append("replacement-character")
    if PRIVATE_USE.search(text):
        reasons.append("private-use-character")
    hits = len(MOJIBAKE.findall(text))
    if hits >= 2 or (hits == 1 and "?" in text):
        reasons.append("mojibake-signature")
    # Question marks are legitimate punctuation, but not at this density.
    if len(text) >= 20 and text.count("?") / len(text) >= 0.04:
        reasons.append("excessive-ascii-question-marks")
    return reasons


def main() -> int:
    issues: list[dict] = []
    totals = Counter()
    all_passages: list[tuple[str, str, str, str]] = [] # work, pid, canonical, translation
    
    # Tier 1 & Tier 2 Scanning
    for path_string in sorted(glob.glob(str(CHUNKS / "*.ts"))):
        path = Path(path_string)
        work_id = bundle_work_id = path.stem
        try:
            bundle = load_bundle(path)
            bundle_work_id = bundle.get("work", {}).get("id", path.stem)
        except Exception as exc:
            issues.append({"file": path.name, "field": "bundle", "reasons": [str(exc)]})
            totals["parse_errors"] += 1
            continue
        totals["works"] += 1
        head_bundle = load_head_bundle(path)
        head_passages = {p.get("id"): p for p in (head_bundle or {}).get("passages", [])}
        
        for passage in bundle.get("passages", []):
            totals["passages"] += 1
            pid = passage.get("id", "")
            canonical = passage.get("canonicalText", "")
            translation = passage.get("readingAid", {}).get("translation", "")
            analysis = passage.get("readingAid", {}).get("analysis", "")
            all_passages.append((bundle_work_id, pid, canonical, translation))
            
            # Tier 1: Character Corruption
            for field, value in (("canonicalText", canonical), ("translation", translation)):
                totals[f"{field}_checked"] += 1
                reasons = ["empty"] if not value.strip() else corruption_reasons(value)
                if reasons:
                    totals[f"{field}_issues"] += 1
                    head_passage = head_passages.get(pid, {})
                    head_value = (head_passage.get("readingAid", {}).get("translation", "")
                                  if field == "translation" else head_passage.get(field, ""))
                    head_reasons = corruption_reasons(head_value) if head_value else ["unavailable"]
                    if not head_reasons:
                        totals[f"{field}_recoverable_from_head"] += 1
                    issues.append({
                        "work": bundle_work_id,
                        "passageId": pid,
                        "field": field,
                        "reasons": reasons,
                        "sample": value[:120],
                        "headClean": not head_reasons,
                        "headSample": head_value[:120],
                    })
            
            # Tier 2: Generic Placeholder & Template Detection
            combined = translation + " " + analysis
            placeholder_hits = [p for p in SEMANTIC_PLACEHOLDERS if p in combined]
            if placeholder_hits:
                totals["translation_semantic_issues"] += 1
                issues.append({
                    "work": bundle_work_id,
                    "passageId": pid,
                    "field": "translationSemantic",
                    "reasons": ["known-generic-placeholder"],
                    "patterns": placeholder_hits,
                    "sample": translation[:240],
                })
            
            # Tier 3: Length Discrepancy (Canonical long, translation empty/ultra-short)
            if len(canonical) >= 40 and len(translation.strip()) < 10 and not placeholder_hits:
                totals["translation_length_issues"] += 1
                issues.append({
                    "work": bundle_work_id,
                    "passageId": pid,
                    "field": "translationLength",
                    "reasons": ["translation-disproportionately-short"],
                    "canonicalLen": len(canonical),
                    "transLen": len(translation.strip()),
                    "sample": translation[:120]
                })

    # Tier 4: Cross-Passage Exact Duplicate Detection (> 3 occurrences for non-trivial strings)
    trans_counts = Counter(t.strip() for _, _, _, t in all_passages if len(t.strip()) > 30)
    duplicate_set = {t for t, c in trans_counts.items() if c > 3}
    
    for work_id, pid, canonical, translation in all_passages:
        if translation.strip() in duplicate_set:
            totals["translation_duplicate_issues"] += 1
            issues.append({
                "work": work_id,
                "passageId": pid,
                "field": "translationDuplicate",
                "reasons": ["cross-passage-duplicated-translation"],
                "occurrences": trans_counts[translation.strip()],
                "sample": translation[:120]
            })

    payload = {"summary": dict(totals), "issues": issues}
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    with open(str(REPORT), "w", encoding="utf-8") as f:
        f.write(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps(payload["summary"], ensure_ascii=False, indent=2))
    print(f"Detailed report: {REPORT}")
    return 1 if issues else 0



if __name__ == "__main__":
    raise SystemExit(main())
