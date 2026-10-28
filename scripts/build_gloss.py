"""Build packages/shared/src/data/gloss.ts from content/gloss/<video id>.<de|en>.txt.

Each line belongs to the cue with the same index in that video's de / en track:

    Ich|我 stehe|站 um|在…点 sieben|七 Uhr|点钟 auf.|起 ## 伊希 施特厄 乌姆 …

Tokens are separated by single spaces as word|gloss (the gloss may be empty); the
words joined with spaces must equal the cue text. After " ## " comes the Chinese
reading (谐音), optional. The shared tests check every line against its cue.

Usage: python3 scripts/build_gloss.py
"""

import glob
import json
import os

out = {}
for path in sorted(glob.glob("content/gloss/*.txt")):
    vid, lang = os.path.basename(path)[:-4].rsplit(".", 1)
    lines = [l.rstrip("\n") for l in open(path, encoding="utf-8") if l.strip()]
    out.setdefault(vid, {})[lang] = lines

body = json.dumps(out, ensure_ascii=False, indent=1)
open("packages/shared/src/data/gloss.ts", "w", encoding="utf-8").write(
    "// 由 scripts/build_gloss.py 从 content/gloss/*.txt 生成，不要手改。\n"
    "// 每行对应同一视频德语 / 英语字幕的同序号句子：词|词义 词|词义 … ## 谐音\n"
    f"export const GLOSS: Record<string, {{ de?: string[]; en?: string[] }}> = {body};\n"
)
print(f"{sum(len(v.get('de', [])) + len(v.get('en', [])) for v in out.values())} lines for {len(out)} videos")
