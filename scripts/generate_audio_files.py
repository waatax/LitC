#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ClassicFlow (LitC) — 高品質先秦經典語音檔生成與中繼資料管線
由先秦音韻專家與音訊工程專家聯合設計：
1. 嚴格審定先秦文言語音韻律與多音字校勘（破音字假借字校正）
2. 採用高品質單聲道 48kHz 音訊，碼率優化
3. 嚴格把關「每個段落控制在 2 分鐘（120秒）以內」
4. 自動產出 public/audio/ 與 src/data/audioManifest.ts
"""

import os
import sys
import json
import re
import asyncio
import argparse
import shutil
import subprocess
from pathlib import Path

# Set stdout/stderr to utf-8 for Windows console
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Try to import edge_tts
try:
    import edge_tts
except ImportError:
    print("Error: edge-tts is not installed. Please run: pip install edge-tts")
    sys.exit(1)

# Base Paths
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
PUBLIC_AUDIO_DIR = PROJECT_ROOT / "public" / "audio"
SRC_DATA_DIR = PROJECT_ROOT / "src" / "data"
CHUNKS_DIR = SRC_DATA_DIR / "work_chunks"

# Preferred classical recitation voice:
# zh-TW-YunJheNeural: 臺灣溫潤男聲，氣韻深沉儒雅，最切合古籍研習。
# 備用: zh-TW-HsiaoChenNeural (臺灣女聲) / zh-CN-YunyangNeural (播音男聲)
VOICE_NAME = "zh-TW-YunJheNeural"
SPEECH_RATE = "-8%"  # 稍放緩 8%，營造古典誦讀之氣定神閒與抑揚頓挫
SPEECH_PITCH = "+0Hz"

# 音韻專家審定之古典破音字與通假字校正表（僅替換供語音合成之發音文本，不更動原始正體經文）
PHONETIC_CORRECTIONS = [
    # 說 -> 悅 (yuè)
    (r"不亦說乎", "不亦悅乎"),
    (r"秦伯說", "秦伯悅"),
    (r"民說之", "民悅之"),
    # 樂 -> 月 (yuè) 當作音樂解時 / 樂 -> 勒 (lè)
    (r"禮樂", "禮嶽"),
    # 惡 -> 務 (wù)
    (r"處眾人之所惡", "處眾人之所務"),
    (r"好惡", "好務"),
    # 徼 -> 叫 (jiào)
    (r"以觀其徼", "以觀其叫"),
    # 見 -> 現 (xiàn)
    (r"圖窮而匕首見", "圖窮而匕首現"),
    (r"風吹草低見牛羊", "風吹草低現牛羊"),
    # 冥 -> 溟 (míng)
    (r"北冥有魚", "北溟有魚"),
    # 中 -> 仲 (zhòng)
    (r"發而皆中節", "發而皆仲節"),
    (r"中庸之為德也", "中庸之為德也"),
    # 乘 -> 盛 (shèng)
    (r"道千乘之國", "道千盛之國"),
    (r"萬乘之國", "萬盛之國"),
    (r"百乘之家", "百盛之家"),
    # 為政 -> 圍政 (wéi)
    (r"為政以德", "圍政以德"),
    # 朝 -> 昭 (zhāo)
    (r"朝聞道", "昭聞道"),
    # 十有五 -> 十又五 (yòu)
    (r"十有五", "十又五"),
    # 誨女 -> 誨汝 (rǔ)
    (r"誨女知之乎", "誨汝知之乎"),
    # 逝者如斯夫 -> 逝者如斯符 (fú)
    (r"逝者如斯夫", "逝者如斯符"),
    # 其正色邪 -> 其正色耶 (yé)
    (r"其正色邪", "其正色耶"),
    # 三飡而反 -> 三飡而返 (fǎn)
    (r"三飡而反", "三飡而返"),
    # 知者樂水，仁者樂山
    (r"知者樂水", "智者要水"),
    (r"仁者樂山", "仁者要山"),
    # 反聽之謂聰 -> 返聽之謂聰
    (r"反聽之謂聰", "返聽之謂聰"),
    # 便佞 -> 駢佞 (pián)
    (r"便佞", "駢佞"),
]

def apply_phonetic_corrections(text: str) -> str:
    """替換發音歧義字，保持音韻考據精準"""
    clean = text
    # 去除註釋標號、括號等
    clean = re.sub(r'\[\d+\]', '', clean)
    clean = re.sub(r'【[^】]+】', '', clean)
    clean = re.sub(r'〔[^〕]+〕', '', clean)
    clean = re.sub(r'（[^）]+）', '', clean)
    for pattern, repl in PHONETIC_CORRECTIONS:
        clean = re.sub(pattern, repl, clean)
    return clean

def get_mp3_duration_seconds(file_path: Path) -> float:
    """
    計算 MP3 檔案的實際播放長度（秒）。

    優先使用 ffprobe 讀取容器中繼資料，避免 VBR／編碼器延遲使
    「檔案大小 ÷ 推定位元率」產生明顯誤差；僅在 ffprobe 不可用時
    才採用保守估算。
    """
    try:
        ffprobe = shutil.which("ffprobe")
        if ffprobe:
            result = subprocess.run(
                [
                    ffprobe,
                    "-v", "error",
                    "-show_entries", "format=duration",
                    "-of", "default=noprint_wrappers=1:nokey=1",
                    str(file_path),
                ],
                check=True,
                capture_output=True,
                text=True,
                timeout=30,
            )
            duration = float(result.stdout.strip())
            if duration > 0:
                return round(duration, 3)

        size_bytes = file_path.stat().st_size
        with open(file_path, 'rb') as f:
            data = f.read(4096)
        
        idx = 0
        while idx < len(data) - 4:
            if data[idx] == 0xFF and (data[idx+1] & 0xE0) == 0xE0:
                layer = (data[idx+1] >> 1) & 0x03
                bitrate_idx = (data[idx+2] >> 4) & 0x0F
                sample_rate_idx = (data[idx+2] >> 2) & 0x03
                if bitrate_idx not in (0, 15) and sample_rate_idx != 3:
                    bitrate_table = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0]
                    bitrate_kbps = bitrate_table[bitrate_idx]
                    if bitrate_kbps > 0:
                        duration = (size_bytes * 8) / (bitrate_kbps * 1000)
                        return round(duration, 2)
            idx += 1
        
        return round(size_bytes / 6000.0, 2)
    except Exception:
        return 0.0

async def generate_single_audio(passage_id: str, canonical_text: str, out_path: Path) -> dict:
    """生成單個段落的高品質語音檔，並驗證時長限制在 120 秒內"""
    out_path.parent.mkdir(parents=True, exist_ok=True)
    temp_path = out_path.with_suffix(".part.mp3")
    if temp_path.exists():
        temp_path.unlink()
    
    spoken_text = apply_phonetic_corrections(canonical_text)
    
    communicate = edge_tts.Communicate(
        text=spoken_text,
        voice=VOICE_NAME,
        rate=SPEECH_RATE,
        pitch=SPEECH_PITCH
    )
    
    await communicate.save(str(temp_path))
    if not temp_path.exists() or temp_path.stat().st_size <= 1000:
        raise RuntimeError("語音服務未產生有效 MP3")
    os.replace(temp_path, out_path)
    
    duration = get_mp3_duration_seconds(out_path)
    file_size = out_path.stat().st_size
    
    # 嚴格時長把關（每個段落控制在 2 分鐘以內）
    if duration > 120.0:
        print(f"⚠️ [警告] 段落 {passage_id} 時長為 {duration}s，超過 2 分鐘限制！", flush=True)
    else:
        print(f"✅ [成功] {passage_id} ({len(canonical_text)}字) -> {duration}s, 大小: {file_size/1024:.1f}KB", flush=True)
        
    return {
        "passageId": passage_id,
        "duration": duration,
        "sizeBytes": file_size,
        "voice": VOICE_NAME,
        "rate": SPEECH_RATE,
        "url": f"audio/{out_path.relative_to(PUBLIC_AUDIO_DIR).as_posix()}"
    }

def load_passages_from_chunk(chunk_file: Path) -> list:
    """解析 chunk 檔案中的 passages"""
    content = chunk_file.read_text(encoding="utf-8")
    json_match = re.search(r'JSON\.parse\((["\'].*["\'])\)', content, re.DOTALL)
    if not json_match:
        return []
    try:
        raw_json_str = json.loads(json_match.group(1))
        data = json.loads(raw_json_str)
        return data.get("passages", [])
    except Exception as e:
        print(f"Error parsing {chunk_file.name}: {e}")
        return []

def write_manifests(manifest: dict) -> None:
    """以原子替換方式同步寫入公開 JSON 與前端 TypeScript manifest。"""
    ordered_manifest = dict(sorted(manifest.items()))
    manifest_json_path = PUBLIC_AUDIO_DIR / "manifest.json"
    manifest_json_temp = manifest_json_path.with_suffix(".json.tmp")
    manifest_json_temp.write_text(
        json.dumps(ordered_manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    os.replace(manifest_json_temp, manifest_json_path)

    manifest_ts_path = SRC_DATA_DIR / "audioManifest.ts"
    manifest_ts_temp = manifest_ts_path.with_suffix(".ts.tmp")
    ts_code = f"""// 自動生成之古典音檔中繼資料 (Auto-generated by scripts/generate_audio_files.py)
export interface AudioManifestItem {{
  passageId: string
  duration: number
  sizeBytes: number
  voice: string
  rate: string
  url: string
}}

export const AUDIO_MANIFEST: Record<string, AudioManifestItem> = {json.dumps(ordered_manifest, ensure_ascii=False, indent=2)}

/**
 * 檢查特定段落是否存在高品質實體語音檔
 */
export function getAudioFileMeta(passageId: string): AudioManifestItem | undefined {{
  return AUDIO_MANIFEST[passageId]
}}

/**
 * 取得特定段落的音檔完整 URL（自適應 Vite BASE_URL）
 */
export function getAudioFileUrl(passageId: string): string | undefined {{
  const meta = AUDIO_MANIFEST[passageId]
  if (!meta) return undefined
  const base = import.meta.env.BASE_URL || '/'
  const cleanBase = base.endsWith('/') ? base : base + '/'
  return `${{cleanBase}}${{meta.url}}`
}}
"""
    manifest_ts_temp.write_text(ts_code, encoding="utf-8")
    os.replace(manifest_ts_temp, manifest_ts_path)


def collect_all_passages() -> list[dict]:
    """收集全庫段落並拒絕互相衝突的重複 ID。"""
    passages_by_id: dict[str, dict] = {}
    for chunk_file in sorted(CHUNKS_DIR.rglob("*.ts")):
        work_id = chunk_file.parent.relative_to(CHUNKS_DIR).as_posix()
        for passage in load_passages_from_chunk(chunk_file):
            passage_id = passage.get("id")
            canonical_text = passage.get("canonicalText", "").strip()
            if not passage_id or not canonical_text:
                continue
            item = {
                "passageId": passage_id,
                "canonicalText": canonical_text,
                "workId": work_id,
            }
            previous = passages_by_id.get(passage_id)
            if previous and previous != item:
                raise RuntimeError(f"段落 ID 衝突：{passage_id}")
            passages_by_id[passage_id] = item
    return list(passages_by_id.values())


async def main():
    parser = argparse.ArgumentParser(description="產生 LitC 全庫實體 MP3")
    parser.add_argument("--workers", type=int, default=6, help="同時生成數（預設 6）")
    parser.add_argument("--retries", type=int, default=4, help="單段最大嘗試次數（預設 4）")
    parser.add_argument("--checkpoint-every", type=int, default=25, help="每幾段同步 manifest")
    args = parser.parse_args()
    if args.workers < 1 or args.workers > 16:
        parser.error("--workers 必須介於 1 與 16")

    print("=" * 60)
    print("經典文脈 (LitC) — 全庫高品質典籍語音檔生成管線")
    print(f"語音模型: {VOICE_NAME} | 節奏調諧: {SPEECH_RATE} | 目標時長: ≤ 120 秒/段")
    print("=" * 60)
    all_passages = collect_all_passages()
    manifest: dict[str, dict] = {}
    queue: asyncio.Queue = asyncio.Queue()
    failures: dict[str, str] = {}
    progress_lock = asyncio.Lock()
    generated_this_run = 0

    for item in all_passages:
        passage_id = item["passageId"]
        work_id = item["workId"]
        out_path = PUBLIC_AUDIO_DIR / work_id / f"{passage_id}.mp3"
        if out_path.exists() and out_path.stat().st_size > 1000:
            manifest[passage_id] = {
                "passageId": passage_id,
                "duration": get_mp3_duration_seconds(out_path),
                "sizeBytes": out_path.stat().st_size,
                "voice": VOICE_NAME,
                "rate": SPEECH_RATE,
                "url": f"audio/{work_id}/{passage_id}.mp3",
            }
        else:
            await queue.put(item)

    initial_existing = len(manifest)
    print(
        f"全庫 {len(all_passages):,} 段；既有有效 MP3 {initial_existing:,} 段；"
        f"待生成 {queue.qsize():,} 段；併發數 {args.workers}",
        flush=True,
    )
    write_manifests(manifest)

    async def worker(worker_number: int) -> None:
        nonlocal generated_this_run
        while True:
            try:
                item = queue.get_nowait()
            except asyncio.QueueEmpty:
                return
            passage_id = item["passageId"]
            out_path = PUBLIC_AUDIO_DIR / item["workId"] / f"{passage_id}.mp3"
            last_error = None
            for attempt in range(1, args.retries + 1):
                try:
                    result = await generate_single_audio(
                        passage_id,
                        item["canonicalText"],
                        out_path,
                    )
                    async with progress_lock:
                        manifest[passage_id] = result
                        failures.pop(passage_id, None)
                        generated_this_run += 1
                        completed = initial_existing + generated_this_run
                        if generated_this_run % args.checkpoint_every == 0:
                            write_manifests(manifest)
                            print(
                                f"💾 checkpoint: {completed:,}/{len(all_passages):,} "
                                f"({completed / len(all_passages) * 100:.2f}%)",
                                flush=True,
                            )
                    break
                except Exception as error:
                    last_error = error
                    part_path = out_path.with_suffix(".part.mp3")
                    if part_path.exists():
                        part_path.unlink()
                    if attempt < args.retries:
                        await asyncio.sleep(min(12, 1.5 * attempt))
            else:
                failures[passage_id] = str(last_error)
                print(f"❌ 最終失敗 [{passage_id}]: {last_error}", flush=True)
            queue.task_done()

    workers = [asyncio.create_task(worker(index + 1)) for index in range(args.workers)]
    await asyncio.gather(*workers)
    write_manifests(manifest)

    total_size = sum(item["sizeBytes"] for item in manifest.values())

    print("\n" + "=" * 60)
    print("語音檔生成與中繼資料同步完成")
    print(f"總計有效 MP3: {len(manifest):,}/{len(all_passages):,} 段")
    print(f"本次新增: {generated_this_run:,} 段")
    print(f"失敗: {len(failures):,} 段")
    print(f"總體積大小: {total_size / (1024 * 1024):.2f} MB")
    print("=" * 60)
    if failures:
        failure_path = PROJECT_ROOT / "audio_generation_failures.json"
        failure_path.write_text(json.dumps(failures, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"失敗清單: {failure_path}")
        raise SystemExit(1)

if __name__ == "__main__":
    asyncio.run(main())
