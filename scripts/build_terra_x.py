"""Build packages/shared/src/data/terra-x.ts from the fetched Terra X clips.

Inputs (see fetch_terra_x.py): content/terra-x/manifest.json, <slug>.de.srt and
translations.json (Chinese and English per German cue, same order; the order of
the keys is the order of the cards in the deck).

Usage: python3 scripts/build_terra_x.py
"""

import json
import re

DIR = "content/terra-x"
OUT = "packages/shared/src/data/terra-x.ts"


def parse_srt(path):
    cues = []
    for block in re.split(r"\n\s*\n", open(path, encoding="utf-8").read().replace("\r", "").strip()):
        lines = block.split("\n")
        idx = next(i for i, l in enumerate(lines) if "-->" in l)
        a, b = [t.strip() for t in lines[idx].split("-->")]
        sec = lambda t: (lambda h, m, s: int(h) * 3600 + int(m) * 60 + float(s.replace(",", ".")))(*t.split(":"))
        text = re.sub(r"</?i>", "", " ".join(lines[idx + 1:])).strip()
        text = re.sub(r"\s{2,}", " ", text)
        cues.append((round(sec(a), 2), round(sec(b), 2), text))
    return cues


def credit(artist):
    parts = [p.strip() for p in artist.split("/") if p.strip()]
    return "/".join(parts[:2]) if parts else "ZDF"


manifest = {m["slug"]: m for m in json.load(open(f"{DIR}/manifest.json", encoding="utf-8"))}
translations = json.load(open(f"{DIR}/translations.json", encoding="utf-8"))
entries = []
for slug, tr in translations.items():
    m = manifest[slug]
    de = parse_srt(f"{DIR}/{slug}.de.srt")
    assert len(de) == len(tr["zh"]) == len(tr["en"]), (slug, len(de), len(tr["zh"]), len(tr["en"]))
    track = lambda texts: [{"start": s, "end": e, "text": t} for (s, e, _), t in zip(de, texts)]
    entries.append({
        "id": f"terra-x-{slug}"[:60].rstrip("-"),
        "title": {"zh": tr["title"]["zh"], "de": re.sub(r"\s*\(CC [^)]*\)", "", m["title"], flags=re.I), "en": tr["title"]["en"]},
        "file": f"terra-x/{slug}.mp4",
        "duration": m["duration"],
        "credit": f"{credit(m['artist'])} · {m['license']}",
        "page": m["page"],
        "subtitles": {"zh": track(tr["zh"]), "de": track([t for _, _, t in de]), "en": track(tr["en"])},
    })

body = json.dumps(entries, ensure_ascii=False, indent=2)
open(OUT, "w", encoding="utf-8").write(f"""// 由 scripts/build_terra_x.py 生成，不要手改。德语字幕来自 Wikimedia Commons，中文和英文是翻译。
import type {{ LocalizedTitle, SubtitleTracks }} from '../types';

export interface TerraXClip {{
  id: string;
  title: LocalizedTitle;
  /** 相对 media/ 的路径 */
  file: string;
  duration: number;
  /** 署名与许可（CC BY / CC BY-SA 要求注明作者） */
  credit: string;
  /** Wikimedia Commons 上的原始文件页 */
  page: string;
  subtitles: SubtitleTracks;
}}

export const TERRA_X_CLIPS: TerraXClip[] = {body};
""")
print(f"{len(entries)} clips -> {OUT}")
