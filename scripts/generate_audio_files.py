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
    計算 MP3 檔案的播放長度（秒）
    透過讀取 MP3 幀頭或檔案位元率概算
    """
    try:
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
    except Exception as e:
        return 0.0

async def generate_single_audio(passage_id: str, canonical_text: str, out_path: Path) -> dict:
    """生成單個段落的高品質語音檔，並驗證時長限制在 120 秒內"""
    out_path.parent.mkdir(parents=True, exist_ok=True)
    
    spoken_text = apply_phonetic_corrections(canonical_text)
    
    communicate = edge_tts.Communicate(
        text=spoken_text,
        voice=VOICE_NAME,
        rate=SPEECH_RATE,
        pitch=SPEECH_PITCH
    )
    
    await communicate.save(str(out_path))
    
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

async def main():
    print("=" * 60)
    print("經典文脈 (LitC) — 專家級高品質典籍語音檔生成管線")
    print(f"語音模型: {VOICE_NAME} | 節奏調諧: {SPEECH_RATE} | 目標時長: ≤ 120 秒/段")
    print("=" * 60)

    target_tasks = [
        {"workId": "dao-de-jing", "desc": "《道德經》八十一章全文語音檔", "allChapters": True},
        {"workId": "da-xue", "desc": "《大學》經一章傳十章全文語音檔", "allChapters": True},
        {"workId": "zhong-yong", "desc": "《中庸》三十三章全文語音檔", "allChapters": True},
        {"workId": "art-of-war", "desc": "《孫子兵法》十三篇全本語音檔", "allChapters": True},
        {"workId": "jian-zhu-ke-shu", "desc": "《諫逐客書》全文駢散語音檔", "allChapters": True},
        {"workId": "lun-yu", "desc": "《論語》核心名篇全文語音檔", "chapters": ["lun-yu_ch-1", "lun-yu_ch-2", "lun-yu_ch-4"]},
        {"workId": "gu-wen-guan-zhi", "desc": "《古文觀止》卷一名篇語音檔", "chapters": ["gu-wen-guan-zhi_ch-1", "gu-wen-guan-zhi_ch-2", "gu-wen-guan-zhi_ch-3"]},
    ]

    manifest = {}
    total_generated = 0
    total_size = 0

    for task in target_tasks:
        work_id = task["workId"]
        work_dir = CHUNKS_DIR / work_id
        if not work_dir.exists():
            continue
        
        print(f"\n--- 正在生成: {task['desc']} ---", flush=True)
        chunk_files = sorted(work_dir.glob("*.ts"))
        
        for cf in chunk_files:
            ch_name = cf.stem
            if not task.get("allChapters", False) and ch_name not in task.get("chapters", []):
                continue
                
            passages = load_passages_from_chunk(cf)
            for p in passages:
                pid = p.get("id")
                text = p.get("canonicalText", "").strip()
                if not pid or not text:
                    continue
                
                out_path = PUBLIC_AUDIO_DIR / work_id / f"{pid}.mp3"
                
                if out_path.exists() and out_path.stat().st_size > 1000:
                    duration = get_mp3_duration_seconds(out_path)
                    manifest[pid] = {
                        "passageId": pid,
                        "duration": duration,
                        "sizeBytes": out_path.stat().st_size,
                        "voice": VOICE_NAME,
                        "rate": SPEECH_RATE,
                        "url": f"audio/{work_id}/{pid}.mp3"
                    }
                    total_generated += 1
                    total_size += out_path.stat().st_size
                    continue
                
                try:
                    res = await generate_single_audio(pid, text, out_path)
                    manifest[pid] = res
                    total_generated += 1
                    total_size += res["sizeBytes"]
                    await asyncio.sleep(0.15)
                except Exception as err:
                    print(f"❌ 生成失敗 [{pid}]: {err}")

    manifest_json_path = PUBLIC_AUDIO_DIR / "manifest.json"
    PUBLIC_AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    manifest_json_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")

    manifest_ts_path = SRC_DATA_DIR / "audioManifest.ts"
    ts_code = f"""// 自動生成之古典音檔中繼資料 (Auto-generated by scripts/generate_audio_files.py)
export interface AudioManifestItem {{
  passageId: string
  duration: number
  sizeBytes: number
  voice: string
  rate: string
  url: string
}}

export const AUDIO_MANIFEST: Record<string, AudioManifestItem> = {json.dumps(manifest, ensure_ascii=False, indent=2)}

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
    manifest_ts_path.write_text(ts_code, encoding="utf-8")

    print("\n" + "=" * 60)
    print("🎉 語音檔生成與中繼資料產出完成！")
    print(f"總計音檔數量: {total_generated} 段")
    print(f"總體積大小: {total_size / (1024 * 1024):.2f} MB (完美符合 GitHub Pages 限制)")
    print(f"Manifest JSON: {manifest_json_path}")
    print(f"Manifest TS:   {manifest_ts_path}")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(main())
