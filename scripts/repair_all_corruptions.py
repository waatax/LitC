#!/usr/bin/env python3
"""Exhaustive repair script for all 17 corrupted passages in LitC corpus."""

import json
import os
import re
import subprocess

CHUNKS_DIR = "./src/data/work_chunks"

def load_bundle(filename: str) -> dict:
    filepath = os.path.join(CHUNKS_DIR, filename)
    with open(filepath, "r", encoding="utf-8") as f:
        text = f.read()
    match = re.search(r"JSON\.parse\('(.*)'\)", text, re.S)
    if not match:
        raise ValueError(f"Missing JSON payload in {filename}")
    raw_str = match.group(1).replace("\\'", "'").replace("\\\\", "\\")
    return json.loads(raw_str)

def write_bundle(filename: str, bundle: dict) -> None:
    filepath = os.path.join(CHUNKS_DIR, filename)
    payload = json.dumps(bundle, ensure_ascii=False, separators=(",", ":"))
    js_payload = payload.replace("\\", "\\\\").replace("'", "\\'")
    content = (
        "import type { WorkBundle } from '../workLoader'\n\n"
        f"export default JSON.parse('{js_payload}') as WorkBundle\n"
    )
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

def get_head1_passage(rel_path: str, pid: str) -> dict | None:
    try:
        raw = subprocess.check_output(
            ["git", "-c", "safe.directory=C:/Users/User/OneDrive/文件/Antigravity/LitC", "show", f"HEAD~1:{rel_path}"],
            cwd=".",
        ).decode("utf-8", errors="ignore")
        match = re.search(r"JSON\.parse\('(.*)'\)", raw, re.S)
        if not match:
            return None
        raw_str = match.group(1).replace("\\'", "'").replace("\\\\", "\\")
        bundle = json.loads(raw_str)
        for p in bundle.get("passages", []):
            if p.get("id") == pid:
                return p
    except Exception:
        return None
    return None

MANUAL_REPAIRS = {
    "cai-gen-tan_ch-1_p-3": {
        "analysis": "【主題與背景】本條闡述修身與立業的辯證關係，融合了儒家的憂患意識與磨練思想。「精金美玉」喻指完美無瑕的品德，非經「烈火」之煅燒（象徵逆境與挫折的考驗）不能去其雜質，這與孟子「天將降大任於是人也，必先苦其心志」的思想相通。\n【詞義與名物】「掀天揭地」指極大的功業，而「薄冰上履」則典出《詩經·小雅·小旻》的「戰戰兢兢，如臨深淵，如履薄冰」，強調越是在成就大事的過程中，越需要有敬畏之心與如履薄冰的審慎態度，如此方能防微杜漸，行穩致遠。\n【思想與篇章】《菜根譚》融會儒釋道三家智慧，兼具操守堅定與處事圓融。"
    },
    "cai-gen-tan_ch-1_p-70": {
        "canonicalText": "趨炎附勢之禍，甚慘亦甚速；棲恬守淡之趣，最濃亦最長。",
        "translation": "趨附權貴熱勢所帶來的禍害，極其慘烈而且來得極快；棲息於恬靜、守持淡泊所獲得的情趣，最為濃郁而且最為持久。",
        "analysis": "【主題與背景】本條對比了追求權勢名利與堅守恬淡心境兩種不同的人生道路及其結局。\n【詞義與名物】「趨炎附勢」指巴結奉承有權有勢的人；「棲恬守淡」指安於寧靜淡泊的生活。\n【思想與篇章】警惕世人勿貪圖一時的榮華富貴，唯有淡泊名利方能長久安樂。"
    },
    "cai-gen-tan_ch-2_p-32": {
        "canonicalText": "醉後添杯不如渺渺看雲，興尖納履不如悠悠觀水。",
        "translation": "酒醉之後再繼續添杯，不如渺渺茫茫地觀看雲彩；興致正濃時急忙穿鞋欲往，不如悠悠自在地觀賞流水。",
        "analysis": "【主題與背景】本條闡述了處事知止與順應自然的智慧。\n【詞義與名物】「興尖納履」指興致勃勃地穿鞋準備出門；「渺渺看雲」、「悠悠觀水」象徵放鬆與適可而止。\n【思想與篇章】勸人凡事切忌過度，適度留白更能享受生活的情趣與安詳。"
    },
    "cai-gen-tan_ch-2_p-34": {
        "canonicalText": "極思辱者，每自冤恨；極喜歡者，每自遺悔。",
        "translation": "極度感到屈辱的人，往往會自我抱怨恨懣；極度狂喜歡樂的人，過後往往會留下遺憾懊悔。",
        "analysis": "【主題與背景】本條提醒人們控制情緒，避免極端的情緒波動。\n【詞義與名物】「極思辱」指陷入深重的屈辱感中；「極喜歡」指沉溺於過度的狂喜中。\n【思想與篇章】強調情緒中庸與心境平和的重要性，避免大喜大悲帶來的副作用。"
    },
    "chun-qiu-zuo-zhuan_ch-1_p-154": {
        "canonicalText": "季文子相宣、成，無衣帛之妾，無食肉之馬。仲孫蔑曰：「子為魯上卿，相二君矣，妾不衣帛，馬不食肉，人將以子為吝，且不榮君。」文子曰：「吾亦願美之。然吾觀國人，其父兄罷病者漸多，吾是以不敢。人父兄食粗衣惡，而我美妾與馬，無乃非人子乎！且吾聞以德榮君，不聞以妾與馬榮君。」",
        "translation": "季文子擔任魯宣公、魯成公的國相，家裏沒有穿絲綢的妾，馬廄裏沒有吃肉的馬。仲孫蔑說：「您是魯國的上卿，輔佐過兩代國君，妾不穿絲綢，馬不吃肉，別人會以為您吝嗇，而且也不光彩。」季文子說：「我也希望穿戴華美。但我看到國人中父親兄長貧困患病的越來越多，因此我不敢這樣。國人的父兄食粗衣惡，而我美妾與馬，無乃非人子乎！且吾聞以德榮君，不聞以妾與馬榮君。」",
        "analysis": "【主題與背景】本段記載魯國大夫季文子以身作則、崇尚節儉、關懷百姓疾苦的美德。\n【詞義與名物】季文子（季孫行父），魯國名臣；「相二君」指輔佐魯宣公與魯成公。\n【思想與篇章】強調為政者應以德治國、關懷民間疾苦，而非追求奢華享受。"
    },
    "mutianzi-zhuan_ch-1_p-4": {
        "canonicalText": "癸丑，天子大朝于燕。",
        "translation": "癸丑日，天子在燕地舉行大朝會。",
        "analysis": "【主題與背景】記述周天子（穆王）巡遊途中舉行朝會的禮儀活動。\n【詞義與名物】「癸丑」為干支紀日；「大朝」指盛大的朝見禮儀。\n【思想與篇章】反映古代天子巡守諸侯、鞏固政權的政治典章與活動。"
    },
    "shi-jing_ch-1_p-3": {
        "canonicalText": "采采卷耳，不盈傾筐。嗟我懷人，寘彼周行。\n陟彼崔嵬，我馬虺隤。我姑酌彼金罍，維以不永懷。\n陟彼高岡，我馬玄黃。我姑酌彼兕觥，維以不永傷。\n陟彼砠矣，我馬瘖矣，我僕瘖矣，云何吁矣！",
        "translation": "採了又採卷耳草，採了半天還裝不滿一個淺筐。唉，我心中思念著遠方的人，把筐子擱置在大路旁。登上那高低不平的山嶺，我的馬兒疲憊生病了。我姑且斟滿那金杯裏的酒，希望能藉此不要長久地思念。登上那高聳的山岡，我的馬兒累得毛色發黃。我姑且斟滿那犀牛角做的酒杯，希望能藉此不要長久地感傷。登上那石頭山，我的馬兒累壞了，我的僕人也病倒了，這該如何是好啊！",
        "analysis": "【題目與背景】\n本篇選自《詩經·國風·周南》，是一首描寫思念遠行之人的詩歌。傳統認為是妻子思念征夫，也有人認為是行役之人思家之作。詩中交織了採摘卷耳的女子與在險峻山道上跋涉的男子，畫面感強烈。\n【詞義與名物】\n1. 卷耳：植物名，即蒼耳。2. 頃筐：淺筐。3. 周行（háng）：大道。4. 虺隤（huī tuí）：馬疲勞生病的樣子。5. 金罍（léi）、兕觥（sì gōng）：皆為古代的青銅酒器，後者以犀牛角製成或造型如犀牛。6. 玄黃：馬過度疲勞而毛色改變。\n【章旨與義理】\n第一章寫女子採卷耳因思念而心不在焉，其後三章則透過想像或實寫男子在險途衝跋涉、馬疲僕病、借酒澆愁的艱辛。全詩採用賦與想像交織的手法，深刻表現了分離之苦與對親人的深切牽掛。"
    }
}

AUTO_HEAD1_RECOVERIES = [
    ("dong-guan-han-ji.ts", "dong-guan-han-ji_ch-2_p-2"),
    ("gu-san-fen.ts", "gu-san-fen_ch-1_p-1"),
    ("gu-san-fen.ts", "gu-san-fen_ch-1_p-2"),
    ("gu-san-fen.ts", "gu-san-fen_ch-1_p-3"),
    ("gu-san-fen.ts", "gu-san-fen_ch-2_p-1"),
    ("gu-san-fen.ts", "gu-san-fen_ch-2_p-2"),
    ("gu-san-fen.ts", "gu-san-fen_ch-2_p-3"),
    ("jian-zhu-ke-shu.ts", "jian-zhu-ke-shu_ch-1_p-1"),
    ("jian-zhu-ke-shu.ts", "jian-zhu-ke-shu_ch-1_p-2"),
    ("shi-jing.ts", "shi-jing_ch-1_p-1"),
]

def run_repairs():
    print("=== EXECUTING COMPLETE REPAIR PROCEDURE ===")
    repaired_count = 0
    by_file = {}
    
    # 1. Recover auto HEAD~1 items
    for filename, pid in AUTO_HEAD1_RECOVERIES:
        if filename not in by_file:
            by_file[filename] = load_bundle(filename)
        bundle = by_file[filename]
        rel_path = f"src/data/work_chunks/{filename}"
        clean_p = get_head1_passage(rel_path, pid)
        if clean_p:
            for p in bundle.get("passages", []):
                if p["id"] == pid:
                    p["canonicalText"] = clean_p.get("canonicalText", p.get("canonicalText"))
                    p["readingAid"] = clean_p.get("readingAid", p.get("readingAid"))
                    repaired_count += 1
                    print(f"[RECOVERED HEAD~1] {filename} -> {pid}")
        else:
            print(f"[ERROR] Could not recover HEAD~1 for {filename} {pid}")
            
    # 2. Apply manual repairs for the 7 passages
    for pid, patch in MANUAL_REPAIRS.items():
        filename = pid.split("_ch-")[0] + ".ts"
        if filename not in by_file:
            by_file[filename] = load_bundle(filename)
        
        bundle = by_file[filename]
        for p in bundle.get("passages", []):
            if p["id"] == pid:
                if "canonicalText" in patch:
                    p["canonicalText"] = patch["canonicalText"]
                if "readingAid" not in p:
                    p["readingAid"] = {}
                if "translation" in patch:
                    p["readingAid"]["translation"] = patch["translation"]
                if "analysis" in patch:
                    p["readingAid"]["analysis"] = patch["analysis"]
                repaired_count += 1
                print(f"[REPAIRED MANUAL] {filename} -> {pid}")
                
    for filename, bundle in by_file.items():
        write_bundle(filename, bundle)
        
    print(f"\nTotal Repaired Passages: {repaired_count}")

if __name__ == "__main__":
    run_repairs()
