#!/usr/bin/env python3
"""
Phase 1: Harvest clean translations from ALL available sources
         and apply them to work_chunks files + readingAid.ts.

Key insight: work_chunks store text as double-escaped unicode (\\\\uXXXX).
After json.loads(), strings are \\uXXXX literals that need codecs.decode().
"""
import os, sys, re, json, glob, codecs
sys.stdout.reconfigure(encoding='utf-8')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

# ── Template Patterns (in decoded Chinese) ──
TEMPLATE_STRINGS = [
    '本段經文記載古代典籍中的重要思想論述與歷史事件',
    '這是一段來自',
    '展現先秦至漢代思想家的深刻智慧',
    '本段記述歷史風雲人物事跡',
    '史實記載：',
    '段落編號：',
    '【深度校正版翻譯】這是一段經過虛擬國學大師重新校訂',
    '本段典籍核心大意在於闡述現代維度的價值理念',
    '古漢語核心意象與經典表達',
    '這段文字記述了古聖先賢對於',
    '旨在說明遵循禮法道德、因時制宜與修己安人的核心要義',
    '為該典籍中的核心論述篇章，展現了先秦兩漢思想與歷史文化的深刻積澱',
    '文中包含了古代典章名物與關鍵文言虛實詞用法',
    '全篇旨在闡發順應天理、尊德愛民與立身處世的根本之道',
    '具有歷久彌新的思想啟發與借鑒價值',
    '(待擴充)',
    '此句釋義提示',
]

def decode_escaped(s):
    """Decode \\uXXXX escaped strings to actual Chinese."""
    if not s:
        return s
    try:
        if '\\u' in s:
            return codecs.decode(s, 'unicode_escape')
    except:
        pass
    return s

def is_template(text):
    """Check if decoded text is a placeholder template."""
    if not text or len(text.strip()) < 8:
        return True
    decoded = decode_escaped(text)
    for pat in TEMPLATE_STRINGS:
        if pat in decoded:
            return True
    return False

def is_clean(text):
    """Check if text is genuine (not template, not empty)."""
    if not text or len(text.strip()) < 8:
        return False
    decoded = decode_escaped(text)
    for pat in TEMPLATE_STRINGS:
        if pat in decoded:
            return False
    return True


# ═══════════════════════════════════════════════════
# STEP 1: HARVEST from all sources
# ═══════════════════════════════════════════════════
print("=" * 60)
print("PHASE 1: HARVESTING CLEAN TRANSLATIONS")
print("=" * 60)

master_pool = {}  # passageId -> {translation, analysis}

def add_to_pool(pid, trans, analysis, source_name, overwrite=False):
    if not is_clean(trans):
        return False
    if pid in master_pool and not overwrite:
        existing = master_pool[pid]
        if is_clean(existing.get('analysis', '')):
            return False
    master_pool[pid] = {
        'translation': trans.strip(),
        'analysis': (analysis or '').strip(),
        'source': source_name,
    }
    return True

# ── Source 1: review_*.json (HIGHEST priority) ──
print("\n[1/5] Harvesting from review_*.json ...")
for rf in sorted(glob.glob("scratch/review_*.json")):
    basename = os.path.basename(rf)
    try:
        with open(rf, 'r', encoding='utf-8') as f:
            data = json.load(f)
        passages = data.get('passages', [])
        count = 0
        for p in passages:
            pid = p.get('passageId') or p.get('id')
            t = (p.get('translation') or '').strip()
            a = (p.get('analysis') or '').strip()
            if pid and add_to_pool(pid, t, a, basename, overwrite=True):
                count += 1
        print(f"  {basename}: {count} entries")
    except Exception as e:
        print(f"  {basename}: ERROR - {e}")

# ── Source 2: reading_aid_results/*.json ──
print("\n[2/5] Harvesting from reading_aid_results/ ...")
ra_count = 0
for rf in sorted(glob.glob("scratch/reading_aid_results/*.json")):
    try:
        with open(rf, 'r', encoding='utf-8') as f:
            data = json.load(f)
        items = data.get('results', []) if isinstance(data, dict) else data
        if isinstance(items, list):
            for item in items:
                pid = item.get('passageId') or item.get('id')
                t = (item.get('translation') or '').strip()
                a = (item.get('analysis') or '').strip()
                if pid and add_to_pool(pid, t, a, os.path.basename(rf)):
                    ra_count += 1
    except Exception:
        pass
print(f"  Total: {ra_count} entries")

# ── Source 3: translated_*.json and extracted_*.json ──
print("\n[3/5] Harvesting from translated_*.json and extracted_*.json ...")
tx_count = 0
for pattern in ["scratch/translated_*.json", "scratch/extracted_*.json"]:
    for rf in sorted(glob.glob(pattern)):
        try:
            with open(rf, 'r', encoding='utf-8') as f:
                data = json.load(f)
            items = data if isinstance(data, list) else data.get('results', data.get('passages', []))
            if isinstance(items, list):
                for item in items:
                    pid = item.get('passageId') or item.get('id')
                    t = (item.get('translation') or '').strip()
                    a = (item.get('analysis') or '').strip()
                    if pid and add_to_pool(pid, t, a, os.path.basename(rf)):
                        tx_count += 1
            elif isinstance(items, dict):
                for k, v in items.items():
                    if isinstance(v, dict) and 'translation' in v:
                        t = (v.get('translation') or '').strip()
                        a = (v.get('analysis') or '').strip()
                        if add_to_pool(k, t, a, os.path.basename(rf)):
                            tx_count += 1
        except Exception:
            pass
print(f"  Total: {tx_count} entries")

# ── Source 4: other batch jsons ──
print("\n[4/5] Harvesting from other JSON sources ...")
other_count = 0
for pattern in ["scratch/batch_*.json", "scratch/mengzi_*.json", "scratch/zhongyong_*.json",
                 "scratch/guwen_*.json", "scratch/canonical_*.json"]:
    for rf in sorted(glob.glob(pattern)):
        try:
            with open(rf, 'r', encoding='utf-8') as f:
                data = json.load(f)
            if isinstance(data, list):
                for item in data:
                    if isinstance(item, dict):
                        pid = item.get('passageId') or item.get('id')
                        t = (item.get('translation') or '').strip()
                        a = (item.get('analysis') or '').strip()
                        if pid and add_to_pool(pid, t, a, os.path.basename(rf)):
                            other_count += 1
            elif isinstance(data, dict):
                for k, v in data.items():
                    if isinstance(v, dict) and 'translation' in v:
                        t = (v.get('translation') or '').strip()
                        a = (v.get('analysis') or '').strip()
                        if add_to_pool(k, t, a, os.path.basename(rf)):
                            other_count += 1
        except Exception:
            pass
print(f"  Total: {other_count} entries")

# ── Source 5: readingAid.ts existing clean ──
print("\n[5/5] Harvesting from readingAid.ts ...")
ra_ts_count = 0
try:
    with open("src/data/readingAid.ts", 'r', encoding='utf-8') as f:
        ra_text = f.read()
    for m in re.finditer(
        r"'([a-zA-Z0-9_\-]+)':\s*\{\s*translation:\s*([`'\"])(.*?)\2,\s*analysis:\s*([`'\"])(.*?)\4\s*\}",
        ra_text, re.DOTALL
    ):
        pid = m.group(1)
        t = m.group(3).strip()
        a = m.group(5).strip()
        if add_to_pool(pid, t, a, 'readingAid.ts'):
            ra_ts_count += 1
except Exception as e:
    print(f"  ERROR: {e}")
print(f"  Total: {ra_ts_count} entries")

print(f"\n{'='*60}")
print(f"TOTAL HARVEST POOL: {len(master_pool)} clean translations")
print(f"{'='*60}")


# ═══════════════════════════════════════════════════
# STEP 2: APPLY to work_chunks files
# ═══════════════════════════════════════════════════
print(f"\n{'='*60}")
print("APPLYING TO WORK_CHUNKS")
print(f"{'='*60}")

chunk_dir = "src/data/work_chunks"
chunk_files = sorted(glob.glob(os.path.join(chunk_dir, "*.ts")))

total_passages = 0
total_fixed_trans = 0
total_fixed_analysis = 0
total_already_clean = 0
total_still_template = 0
still_template_by_work = {}

def encode_for_chunk(text):
    """Encode text to \\\\uXXXX format for storage in work_chunks."""
    result = []
    for ch in text:
        cp = ord(ch)
        if cp > 127:
            result.append(f'\\\\u{cp:04x}')
        elif ch == '\\':
            result.append('\\\\')
        elif ch == '"':
            result.append('\\"')
        elif ch == '\n':
            result.append('\\n')
        elif ch == '\r':
            result.append('\\r')
        elif ch == '\t':
            result.append('\\t')
        else:
            result.append(ch)
    return ''.join(result)

for cf in chunk_files:
    fname = os.path.basename(cf)
    with open(cf, 'r', encoding='utf-8') as f:
        content = f.read()

    m = re.search(r"JSON\.parse\('(.*)'\)", content, re.DOTALL)
    if not m:
        print(f"  SKIP {fname}: no JSON.parse pattern")
        continue

    json_str = m.group(1)
    try:
        data = json.loads(json_str)
    except json.JSONDecodeError:
        try:
            data = json.loads(json_str.replace("\\'", "'"))
        except json.JSONDecodeError as e:
            print(f"  SKIP {fname}: JSON error - {e}")
            continue

    work_id = data.get('work', {}).get('id', fname.replace('.ts', ''))
    passages = data.get('passages', [])
    work_fixed_t = 0
    work_fixed_a = 0
    work_still = 0
    modified = False

    for p in passages:
        total_passages += 1
        pid = p.get('id')
        if not pid:
            continue

        aid = p.get('readingAid', {})
        if not aid:
            aid = {}
            p['readingAid'] = aid

        current_t = aid.get('translation', '')
        current_a = aid.get('analysis', '')

        t_is_template = is_template(current_t)
        a_is_template = is_template(current_a)

        if not t_is_template and not a_is_template:
            total_already_clean += 1
            continue

        if pid in master_pool:
            pool = master_pool[pid]
            pool_t = pool['translation']
            pool_a = pool['analysis']

            if t_is_template and is_clean(pool_t):
                # Encode the clean translation for storage
                aid['translation'] = encode_for_chunk(pool_t)
                work_fixed_t += 1
                total_fixed_trans += 1
                modified = True

            if a_is_template and is_clean(pool_a):
                aid['analysis'] = encode_for_chunk(pool_a)
                work_fixed_a += 1
                total_fixed_analysis += 1
                modified = True

        # Check if still template after attempted fix
        if is_template(aid.get('translation', '')) or is_template(aid.get('analysis', '')):
            work_still += 1
            total_still_template += 1

    if modified:
        # Serialize back - use ensure_ascii=False since we manually encode
        new_json = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
        # Escape single quotes for JS string
        new_json = new_json.replace("'", "\\'")
        
        # Check the import line format
        import_line = "import type { WorkBundle } from '../workLoader'"
        if 'as WorkBundle' in content:
            new_content = f"{import_line}\n\nexport default JSON.parse('{new_json}') as WorkBundle\n"
        else:
            new_content = f"{import_line}\n\nexport default JSON.parse('{new_json}')\n"
        
        with open(cf, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"  {fname}: fixed {work_fixed_t}T/{work_fixed_a}A, still template: {work_still}")
    else:
        if work_still > 0:
            still_template_by_work[work_id] = work_still

print(f"\n{'='*60}")
print("PHASE 1 RESULTS")
print(f"{'='*60}")
print(f"Total passages:         {total_passages}")
print(f"Already clean:          {total_already_clean}")
print(f"Fixed translations:     {total_fixed_trans}")
print(f"Fixed analyses:         {total_fixed_analysis}")
print(f"Still template:         {total_still_template}")
pct = (total_already_clean + total_fixed_trans) / max(1, total_passages) * 100
print(f"Clean rate:             {pct:.1f}%")

if still_template_by_work:
    print(f"\nStill-template by work (no changes made):")
    for wid, cnt in sorted(still_template_by_work.items(), key=lambda x: -x[1]):
        print(f"  {wid}: {cnt}")


# ═══════════════════════════════════════════════════
# STEP 3: REBUILD readingAid.ts
# ═══════════════════════════════════════════════════
print(f"\n{'='*60}")
print("REBUILDING readingAid.ts")
print(f"{'='*60}")

all_aids = {}
for cf in chunk_files:
    with open(cf, 'r', encoding='utf-8') as f:
        content = f.read()
    m = re.search(r"JSON\.parse\('(.*)'\)", content, re.DOTALL)
    if not m:
        continue
    try:
        data = json.loads(m.group(1))
    except:
        try:
            data = json.loads(m.group(1).replace("\\'", "'"))
        except:
            continue
    for p in data.get('passages', []):
        pid = p.get('id')
        aid = p.get('readingAid', {})
        if pid and aid:
            t = decode_escaped(aid.get('translation', ''))
            a = decode_escaped(aid.get('analysis', ''))
            if t:
                all_aids[pid] = {'translation': t, 'analysis': a}

lines = [
    "export interface PassageReadingAid {",
    "  translation: string",
    "  analysis: string",
    "}",
    "",
    "export const PASSAGE_AIDS: Record<string, PassageReadingAid> = {",
]
for pid in sorted(all_aids.keys()):
    entry = all_aids[pid]
    t_esc = json.dumps(entry['translation'], ensure_ascii=False)
    a_esc = json.dumps(entry['analysis'], ensure_ascii=False)
    lines.append(f"  '{pid}': {{")
    lines.append(f"    translation: {t_esc},")
    lines.append(f"    analysis: {a_esc}")
    lines.append(f"  }},")
lines.append("}")
lines.append("")
lines.append("export function getPassageReadingAid(passageId: string, _canonicalText?: string, _workId?: string, _sentences?: any[]): PassageReadingAid | undefined {")
lines.append("  return PASSAGE_AIDS[passageId]")
lines.append("}")
lines.append("")

with open("src/data/readingAid.ts", 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))
print(f"readingAid.ts rebuilt with {len(all_aids)} entries")


# ═══════════════════════════════════════════════════
# STEP 4: Produce Phase 2 remaining list
# ═══════════════════════════════════════════════════
remaining = {}
for cf in chunk_files:
    with open(cf, 'r', encoding='utf-8') as f:
        content = f.read()
    m = re.search(r"JSON\.parse\('(.*)'\)", content, re.DOTALL)
    if not m:
        continue
    try:
        data = json.loads(m.group(1))
    except:
        try:
            data = json.loads(m.group(1).replace("\\'", "'"))
        except:
            continue
    work_id = data.get('work', {}).get('id', '')
    for p in data.get('passages', []):
        pid = p.get('id')
        aid = p.get('readingAid', {})
        t = aid.get('translation', '')
        a = aid.get('analysis', '')
        if is_template(t) or is_template(a):
            if work_id not in remaining:
                remaining[work_id] = []
            ctext = decode_escaped(p.get('canonicalText', ''))
            remaining[work_id].append({
                'passageId': pid,
                'canonicalText': ctext[:150],
                'templateTrans': is_template(t),
                'templateAnalysis': is_template(a),
            })

with open("scratch/phase2_remaining.json", 'w', encoding='utf-8') as f:
    json.dump(remaining, f, ensure_ascii=False, indent=2)

total_r = sum(len(v) for v in remaining.values())
print(f"\nPhase 2 remaining: {total_r} passages across {len(remaining)} works")
for wid, items in sorted(remaining.items(), key=lambda x: -len(x[1])):
    print(f"  {wid}: {len(items)}")
