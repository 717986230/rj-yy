"""Build the Commons collections into the app.

For every clip in content/collections/<name>/manifest.json that has a translation
file <slug>.zh.txt, writes the subtitles to apps/web/public/subs/<id>.json (loaded
when the card opens) and the card list to packages/shared/src/data/collections.ts.

<slug>.zh.txt:
    # 中文标题 | English title
    中文译文 ⟂ 词义 词义 … ## 谐音        (one line per cue of <slug>.<lang>.srt)

The glosses are separated by single spaces, one per word of the cue (split on
spaces); "_" means no gloss. The reading after " ## " is optional.

Usage: python3 scripts/build_collections.py
"""

import glob
import html
import json
import os
import re

REPO = "717986230/rj-yy"
SUBS = "apps/web/public/subs"
OUT = "packages/shared/src/data/collections.ts"
# 合集在卡片上的显示：系列名、标签、语言
META = {
    "terra-x": {"series": "Terra X · 德语科普", "tags": ["德语原声", "科普"], "lang": "de"},
    "nasa": {"series": "NASA · 英语科普", "tags": ["英语原声", "科普", "公有领域"], "lang": "en"},
}


def parse_srt(path):
    cues = []
    text = html.unescape(open(path, encoding="utf-8").read()).replace("\r", "").strip()
    for block in re.split(r"\n\s*\n", text):
        lines = block.split("\n")
        idx = next((i for i, l in enumerate(lines) if "-->" in l), None)
        if idx is None:
            continue
        a, b = [t.strip().split(" ")[0] for t in lines[idx].split("-->")]
        sec = lambda t: (lambda h, m, s: int(h) * 3600 + int(m) * 60 + float(s.replace(",", ".")))(*t.split(":"))
        body = re.sub(r"<[^>]+>", "", " ".join(lines[idx + 1:]))
        if "â" in body:  # UTF-8 被当成 Latin-1 读过一次的字幕（isnât → isn’t）
            try:
                body = body.encode("latin-1").decode("utf-8")
            except (UnicodeEncodeError, UnicodeDecodeError):
                pass
        # 去掉音效说明（[music]、♪），只剩音效的句子整条不要
        body = re.sub(r"\[[^\]]*\]|♪", " ", body)
        body = re.sub(r"\s+", " ", body).strip()
        if body and not re.fullmatch(r"(?i)(music|tone|beeping|applause|laughter|silence)\.?", body):
            cues.append((round(sec(a), 2), round(sec(b), 2), body))
    return cues


def credit(artist, license_name):
    parts = [p.strip() for p in re.split(r"[/,;]", artist) if p.strip()]
    return f"{'/'.join(parts[:2]) or 'Wikimedia Commons'} · {license_name}"


def main():
    os.makedirs(SUBS, exist_ok=True)
    cards = []
    for name, meta in META.items():
        folder = f"content/collections/{name}"
        if not os.path.exists(f"{folder}/manifest.json"):
            continue
        lang = meta["lang"]
        for m in json.load(open(f"{folder}/manifest.json", encoding="utf-8")):
            zh_path = f"{folder}/{m['slug']}.zh.txt"
            if not os.path.exists(zh_path):
                continue
            cues = parse_srt(f"{folder}/{m['slug']}.{lang}.srt")
            lines = [l.rstrip("\n") for l in open(zh_path, encoding="utf-8") if l.strip()]
            head, lines = lines[0], lines[1:]
            assert head.startswith("# ") and "|" in head, (zh_path, "first line must be '# 中文标题 | English title'")
            zh_title, en_title = [t.strip() for t in head[2:].split("|", 1)]
            assert len(lines) == len(cues), (zh_path, len(lines), "lines for", len(cues), "cues")
            zh, foreign = [], []
            for i, ((start, end, text), line) in enumerate(zip(cues, lines)):
                zh_text, _, rest = line.partition(" ⟂ ")
                gloss, _, reading = rest.partition(" ## ")
                words = text.split(" ")
                glosses = gloss.split(" ") if gloss.strip() else []
                assert len(glosses) == len(words), (zh_path, i + 2, len(words), "words", len(glosses), "glosses", text)
                cue = {"start": start, "end": end, "text": text,
                       "words": [[w, "" if g == "_" else g] for w, g in zip(words, glosses)]}
                if reading.strip():
                    cue["reading"] = reading.strip()
                foreign.append(cue)
                zh.append({"start": start, "end": end, "text": zh_text.strip()})
            vid = f"{name}-{m['slug']}"
            tracks = {"zh": zh, "de": foreign if lang == "de" else [], "en": foreign if lang == "en" else []}
            json.dump(tracks, open(f"{SUBS}/{vid}.json", "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
            cards.append({
                "id": vid,
                # 英语片用译文文件第一行的英文标题（Commons 文件名常带 YouTube 编号等杂质）
                "title": {"zh": zh_title, "de": m["title"] if lang == "de" else en_title, "en": en_title},
                "src": f"https://cdn.jsdelivr.net/gh/{REPO}@{m['shard']}/{m['path']}",
                "mirrors": [f"https://cdn.statically.io/gh/{REPO}/{m['shard']}/{m['path']}"],
                "duration": m["duration"],
                "source": credit(m["artist"], m["license"]),
                "series": meta["series"],
                "audioLang": lang,
                "tags": meta["tags"],
                "subtitlesUrl": f"subs/{vid}.json",
            })
    body = json.dumps(cards, ensure_ascii=False, indent=1)
    open(OUT, "w", encoding="utf-8").write(
        "// 由 scripts/build_collections.py 生成，不要手改。视频来自 Wikimedia Commons（自由许可，署名见 source），\n"
        "// 由 jsDelivr 从 media-NN 分支提供；字幕在 apps/web/public/subs，打开卡片时再加载。\n"
        "import type { Video } from '../types';\n\n"
        "export const COLLECTION_VIDEOS: Array<Omit<Video, 'ownerId' | 'createdAt' | 'subtitles'>> = "
        f"{body};\n"
    )
    print(f"{len(cards)} cards -> {OUT}")


if __name__ == "__main__":
    main()
