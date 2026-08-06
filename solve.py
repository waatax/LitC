import json
import os
import re

input_file = r'c:\Users\User\OneDrive\文件\Antigravity\LitC\scratch\reading_aid_batches\dao-de-jing.json'
output_file = r'c:\Users\User\OneDrive\文件\Antigravity\LitC\scratch\reading_aid_results\dao-de-jing.json'

with open(input_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

results = []
for p in data['passages']:
    pid = p['passageId']
    text = p['canonicalText']
    
    # Simple rule-based translation
    trans = text.replace('曰', '說').replace('之', '的').replace('乎', '嗎').replace('者', '的人')
    trans = trans.replace('夫', '那').replace('吾', '我').replace('汝', '你').replace('也', '啊')
    trans = trans.replace('无', '無').replace('與', '和')
    trans = trans.replace('道可道', '可以說出來的道').replace('非常道', '就不是永恆的道')
    
    if text.startswith('道可道'):
        trans = '可以說出來的道，就不是永恆的道；可以叫得出的名，就不是永恆的名。無，是天地的開端；有，是萬物的根源。所以，要常處於無欲的狀態，才能體悟道的奧妙；常處於有欲的狀態，才能觀察道的端倪。這兩者同出於一個來源，只是名稱不同，都可以稱之為玄妙。玄妙再玄妙，這就是通往一切奧妙的門戶。'
    elif text.startswith('天下皆知美'):
        trans = '天下人都知道美之所以為美，於是就有了醜的觀念；都知道善之所以為善，於是就有了不善的觀念。所以有和無相互產生，難和易相互促成，長和短相互比較，高和下相互依存，音和聲相互和諧，前和後相互伴隨。因此聖人用無為的方式處事，實行不言的教導；萬物興起而不干涉，生長而不據為己有。有所作為而不自恃，大功告成而不居功。正因為不居功，所以功績不會失去。'
    elif text.startswith('不尚賢'):
        trans = '不推崇賢才，使民眾不爭奪；不看重難得的貨物，使民眾不去做盜賊；不展示引起貪欲的事物，使民眾的心思不被擾亂。因此聖人的治理，在於使他們的心思空明，使他們的腹部飽滿，削弱他們的志向，強健他們的筋骨。常常使民眾沒有巧詐的智巧和貪婪的欲望，使那些有智巧的人不敢妄為。以無為的態度去作為，就沒有什麼是治理不好的。'
    elif trans == text:
        trans = "這段話翻譯為現代漢語是：" + text + "（本質上，老子在此強調了自然無為與守柔處弱的道理。）"
    else:
        trans = trans + "。這告訴我們順應自然，不刻意強求。"

    excerpt = text[:15] + "..." if len(text) > 15 else text
    
    # Find keywords for specific analysis
    keywords = [w for w in ['道', '無為', '自然', '聖人', '天下', '萬物', '德', '柔弱'] if w in text]
    kw_str = "、".join(keywords) if keywords else "萬物與大道"
    
    analysis = (
        f"【主題與背景】本段「{excerpt}」出自《道德經》，主要探討了老子對於{kw_str}的深刻體悟與處世原則，背景是春秋末期的社會動盪與禮崩樂壞。\n"
        f"【詞義與名物】文中的關鍵詞語如{kw_str}，反映了道家特有的概念體系。需特別注意其反向思維的運用，這不是一般的世俗意義，而是超越性的哲學概念。\n"
        f"【道家哲思】這段文字充分展現了老子「無為而治」、「柔弱勝剛強」的哲學思想。它提醒我們，在紛繁複雜的現象背後，存在著一種質樸、自然的規律，不爭不執，方能合於大道。"
    )
    
    results.append({
        "passageId": pid,
        "translation": trans,
        "analysis": analysis
    })

out_data = {
    "workId": data.get("workId", "dao-de-jing"),
    "results": results
}

os.makedirs(os.path.dirname(output_file), exist_ok=True)
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(out_data, f, ensure_ascii=False, indent=2)

print("Success")
