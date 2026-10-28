"""Fetch freely licensed videos from a Wikimedia Commons category into a Vido collection.

Runs in GitHub Actions (the sandbox can't reach Commons). For each new video it
downloads the original, transcodes it to small phone-friendly H.264 (360p, under
jsDelivr's 20 MB file limit), takes the subtitles in the collection's language
from Commons TimedText or, when there are none, transcribes the speech with Whisper.

Videos go to media shard branches (media-01, media-02, … each under jsDelivr's
150 MB package limit), checked out by the workflow at ./media-shards/<branch>.
Text goes to the main branch:

  content/collections/<collection>/manifest.json
  content/collections/<collection>/<slug>.<lang>.srt

Usage: python scripts/fetch_commons.py <collection> <how many new videos>
"""

import json
import os
import re
import subprocess
import sys
import unicodedata
import urllib.parse
import urllib.request

API = "https://commons.wikimedia.org/w/api.php"
UA = "VidoFetcher/1.0 (https://github.com/717986230/rj-yy; GitHub Actions)"
SHARDS = "media-shards"
SHARD_LIMIT = 140_000_000
FILE_LIMIT = 19_500_000
FREE = re.compile(r"^(CC BY(-SA)? [0-9.]+|CC0|Public domain)", re.I)

# 每个合集：Commons 分类（可多个）、语言、时长范围、标题里要去掉的后缀
COLLECTIONS = {
    "terra-x": {"categories": ["Category:Videos by Terra X"], "lang": "de", "min": 40, "max": 300,
                "strip": r"\s*\((ZDF, )?Terra X(, ZDF)?\)|\s*\(?CC[ -]BY[^)]*\)?", "artist": "ZDF/Terra X",
                "skip_manifests": ["content/terra-x/manifest.json"]},
}


def get(url, params=None, binary=False):
    if params:
        url += "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=300) as r:
        data = r.read()
    return data if binary else data.decode("utf-8")


def category_files(category):
    params = {
        "action": "query", "format": "json", "generator": "categorymembers", "gcmtitle": category,
        "gcmtype": "file", "gcmlimit": "200", "prop": "videoinfo", "viprop": "url|size|mediatype|extmetadata",
        "viextmetadatafilter": "LicenseShortName|Artist|ImageDescription",
    }
    while True:
        data = json.loads(get(API, params))
        for page in data.get("query", {}).get("pages", {}).values():
            info = (page.get("videoinfo") or [{}])[0]
            if info.get("mediatype") == "VIDEO":
                yield page["title"], info
        if "continue" not in data:
            break
        params.update(data["continue"])


def strip_html(text):
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", text or "")).strip()


def slugify(title):
    name = re.sub(r"^File:", "", title)
    name = re.sub(r"\.(webm|ogv|mp4|mpg|mpeg)$", "", name, flags=re.I)
    name = unicodedata.normalize("NFKD", name.replace("ß", "ss")).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")[:56].rstrip("-")


def clean_title(title, strip):
    name = re.sub(r"^File:", "", title)
    name = re.sub(r"\.(webm|ogv|mp4|mpg|mpeg)$", "", name, flags=re.I)
    if strip:
        name = re.sub(strip, "", name, flags=re.I)
    name = re.sub(r"\s*(720p|1080p|HD|50 ?FPS|\d+fps)\b", "", name, flags=re.I)
    return re.sub(r"\s+", " ", name).strip(" -–_")


def commons_subtitles(title, lang):
    for fmt in ("srt", "vtt"):
        try:
            text = get(API, {"action": "timedtext", "title": title, "lang": lang, "trackformat": fmt})
        except Exception:
            continue
        if "-->" in text:
            return text if fmt == "srt" else vtt_to_srt(text)
    return None


def vtt_to_srt(text):
    blocks, n = [], 0
    for block in re.split(r"\n\s*\n", text.replace("\r", "")):
        lines = [l for l in block.strip().split("\n") if l.strip()]
        idx = next((i for i, l in enumerate(lines) if "-->" in l), None)
        if idx is None:
            continue
        n += 1
        times = re.sub(r"(\d)\.(\d{3})", r"\1,\2", lines[idx].split(" align")[0].split(" position")[0])
        times = re.sub(r"^(\d{2}:\d{2}[,.]\d{3})", r"00:\1", times)
        times = re.sub(r"--> (\d{2}:\d{2}[,.]\d{3})", r"--> 00:\1", times)
        blocks.append(f"{n}\n{times}\n" + "\n".join(lines[idx + 1:]))
    return "\n\n".join(blocks) + "\n"


def fmt_ts(t):
    ms = int(round(t * 1000))
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


_whisper = None


def whisper_srt(path, lang):
    global _whisper
    from faster_whisper import WhisperModel

    if _whisper is None:
        _whisper = WhisperModel("small", device="cpu", compute_type="int8")
    segments, _ = _whisper.transcribe(path, language=lang, vad_filter=True, beam_size=5)
    out = [f"{i}\n{fmt_ts(s.start)} --> {fmt_ts(s.end)}\n{s.text.strip()}" for i, s in enumerate(segments, 1)]
    return "\n\n".join(out) + "\n" if out else ""


def shard_dir(size):
    """当前还装得下的分片目录（media-shards/media-NN），装不下就开一个新的"""
    names = sorted(n for n in os.listdir(SHARDS) if re.fullmatch(r"media-\d{2}", n)) if os.path.isdir(SHARDS) else []
    if names:
        last = os.path.join(SHARDS, names[-1])
        used = sum(os.path.getsize(os.path.join(dp, f)) for dp, _, fs in os.walk(last) if ".git" not in dp for f in fs)
        if used + size <= SHARD_LIMIT:
            return names[-1], last
    last_no = int(names[-1][-2:]) if names else 0
    name = f"media-{last_no + 1:02d}"
    path = os.path.join(SHARDS, name)
    os.makedirs(SHARDS, exist_ok=True)
    subprocess.run(["git", "worktree", "add", "--orphan", "-b", name, path], check=True)
    return name, path


def transcode(src, dst, crf):
    subprocess.run([
        "ffmpeg", "-v", "error", "-y", "-i", src,
        "-vf", "scale=-2:360,fps=25,format=yuv420p",
        "-c:v", "libx264", "-profile:v", "main", "-preset", "slow", "-crf", str(crf), "-maxrate", "450k", "-bufsize", "900k",
        "-c:a", "aac", "-b:a", "64k", "-ac", "2", "-ar", "44100", "-movflags", "+faststart", dst,
    ], check=True)


def main():
    name, want = sys.argv[1], int(sys.argv[2]) if len(sys.argv) > 2 else 20
    cfg = COLLECTIONS[name]
    text_dir = f"content/collections/{name}"
    os.makedirs(text_dir, exist_ok=True)
    manifest_path = os.path.join(text_dir, "manifest.json")
    manifest = json.load(open(manifest_path)) if os.path.exists(manifest_path) else []
    # 已经在别的地方（旧的 Terra X 站内片）用过的文件不再拉
    taken = {m["file"] for m in manifest}
    for extra in cfg.get("skip_manifests", []):
        if os.path.exists(extra):
            taken |= {m["file"] for m in json.load(open(extra))}

    candidates = []
    for category in cfg["categories"]:
        for title, info in category_files(category):
            meta = info.get("extmetadata", {})
            license_name = meta.get("LicenseShortName", {}).get("value", "")
            duration = float(info.get("duration") or 0)
            if title in taken or not info.get("url") or not FREE.match(license_name):
                continue
            if not cfg["min"] <= duration <= cfg["max"]:
                continue
            taken.add(title)
            candidates.append((title, info, license_name, duration))
    print(f"{len(candidates)} new usable files", flush=True)

    with_subs, without = [], []
    for c in sorted(candidates, key=lambda c: c[0]):
        if len(with_subs) >= want:
            break
        text = commons_subtitles(c[0], cfg["lang"])
        (with_subs if text else without).append((c, text))
    print(f"{len(with_subs)} with {cfg['lang']} subtitles on Commons", flush=True)

    done = 0
    for (title, info, license_name, duration), text in with_subs + without:
        if done >= want:
            break
        slug = slugify(title)
        print(f"--- {slug} ({duration:.0f}s, {license_name})", flush=True)
        src = f"/tmp/{slug}.src"
        try:
            with open(src, "wb") as f:
                f.write(get(info["url"], binary=True))
            tmp = f"/tmp/{slug}.mp4"
            for crf in (28, 31, 34):
                transcode(src, tmp, crf)
                if os.path.getsize(tmp) <= FILE_LIMIT:
                    break
            else:
                print("too big, skipped")
                continue
            srt = text or whisper_srt(src, cfg["lang"])
            if srt.count("-->") < 3:
                print("no usable speech, skipped")
                continue
        except Exception as e:
            print("failed:", e)
            continue
        finally:
            if os.path.exists(src):
                os.remove(src)
        shard, path = shard_dir(os.path.getsize(tmp))
        os.makedirs(os.path.join(path, name), exist_ok=True)
        os.replace(tmp, os.path.join(path, name, f"{slug}.mp4"))
        with open(os.path.join(text_dir, f"{slug}.{cfg['lang']}.srt"), "w") as f:
            f.write(srt)
        meta = info.get("extmetadata", {})
        manifest.append({
            "slug": slug,
            "file": title,
            "title": clean_title(title, cfg.get("strip")),
            "duration": round(duration, 1),
            "license": license_name,
            "artist": strip_html(meta.get("Artist", {}).get("value", ""))[:120] or cfg.get("artist", ""),
            "description": strip_html(meta.get("ImageDescription", {}).get("value", ""))[:300],
            "page": info.get("descriptionurl", ""),
            "subtitles": "Commons" if text else "Whisper",
            "shard": shard,
            "path": f"{name}/{slug}.mp4",
            "bytes": os.path.getsize(os.path.join(path, name, f"{slug}.mp4")),
        })
        json.dump(manifest, open(manifest_path, "w"), ensure_ascii=False, indent=2)
        done += 1
    print(f"added {done}; {len(manifest)} in {name}")


if __name__ == "__main__":
    main()
