"""Fetch freely licensed ZDF Terra X explainers from Wikimedia Commons.

Runs in GitHub Actions (the sandbox can't reach Commons). For each picked video it
downloads the original, transcodes it to phone-friendly H.264, takes the German
subtitles from Commons TimedText or, when there are none, transcribes the German
narration with Whisper. Writes:

  apps/web/public/media/terra-x/<slug>.mp4
  content/terra-x/<slug>.de.srt
  content/terra-x/manifest.json   (title, duration, license, author, source page)

Usage: python scripts/fetch_terra_x.py <count>
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
CATEGORY = "Category:Videos by Terra X"
MEDIA_DIR = "apps/web/public/media/terra-x"
TEXT_DIR = "content/terra-x"
OK_LICENSES = ("CC BY 4.0", "CC BY-SA 4.0", "CC BY 3.0", "CC BY-SA 3.0", "CC0")


def get(url, params=None, binary=False):
    if params:
        url += "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=120) as r:
        data = r.read()
    return data if binary else data.decode("utf-8")


def category_files():
    params = {
        "action": "query", "format": "json", "generator": "categorymembers",
        "gcmtitle": CATEGORY, "gcmtype": "file", "gcmlimit": "200",
        "prop": "videoinfo", "viprop": "url|size|mime|extmetadata",
        "viextmetadatafilter": "LicenseShortName|Artist|ImageDescription",
    }
    while True:
        data = json.loads(get(API, params))
        for page in data.get("query", {}).get("pages", {}).values():
            info = (page.get("videoinfo") or [{}])[0]
            yield page["title"], info
        if "continue" not in data:
            break
        params.update(data["continue"])


def strip_html(text):
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", text or "")).strip()


def slugify(title):
    name = re.sub(r"^File:", "", title)
    name = re.sub(r"\.(webm|ogv|mp4)$", "", name, flags=re.I)
    name = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")[:60]


def clean_title(title):
    name = re.sub(r"^File:", "", title)
    name = re.sub(r"\.(webm|ogv|mp4)$", "", name, flags=re.I)
    name = re.sub(r"\s*\((ZDF, )?Terra X(, ZDF)?\)", "", name)
    name = re.sub(r"\s*(720p|1080p|HD|50 ?FPS|\d+fps)\b", "", name, flags=re.I)
    return re.sub(r"\s+", " ", name).strip(" -–")


def commons_subtitles(title, lang="de"):
    for fmt in ("srt", "vtt"):
        try:
            text = get(API, {"action": "timedtext", "title": title, "lang": lang, "trackformat": fmt})
        except Exception:
            continue
        if "-->" in text:
            return text, fmt
    return None, None


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


def whisper_srt(path):
    global _whisper
    from faster_whisper import WhisperModel

    if _whisper is None:
        _whisper = WhisperModel("small", device="cpu", compute_type="int8")
    segments, _ = _whisper.transcribe(path, language="de", vad_filter=True, beam_size=5)
    out = []
    for i, seg in enumerate(segments, 1):
        out.append(f"{i}\n{fmt_ts(seg.start)} --> {fmt_ts(seg.end)}\n{seg.text.strip()}")
    return "\n\n".join(out) + "\n"


def main():
    want = int(sys.argv[1]) if len(sys.argv) > 1 else 16
    os.makedirs(MEDIA_DIR, exist_ok=True)
    os.makedirs(TEXT_DIR, exist_ok=True)
    manifest_path = os.path.join(TEXT_DIR, "manifest.json")
    manifest = json.load(open(manifest_path)) if os.path.exists(manifest_path) else []
    have = {m["slug"] for m in manifest}

    candidates = []
    for title, info in category_files():
        meta = info.get("extmetadata", {})
        license_name = meta.get("LicenseShortName", {}).get("value", "")
        duration = float(info.get("duration") or 0)
        if not info.get("url") or not license_name.startswith(OK_LICENSES):
            continue
        if not 60 <= duration <= 480:
            continue
        candidates.append((title, info, license_name, duration))
    print(f"{len(candidates)} usable files in {CATEGORY}")

    # 先挑在 Commons 上已有德语字幕的（人工字幕比语音识别准），不够再用其余的
    with_subs, without = [], []
    for c in sorted(candidates, key=lambda c: c[0]):
        if slugify(c[0]) in have:
            continue
        text, fmt = commons_subtitles(c[0])
        (with_subs if text else without).append((c, text, fmt))
    print(f"{len(with_subs)} with German subtitles on Commons, {len(without)} without")

    picked = (with_subs + without)[: max(0, want - len(manifest))]
    for (title, info, license_name, duration), text, fmt in picked:
        slug = slugify(title)
        print(f"--- {slug} ({duration:.0f}s, {license_name})", flush=True)
        src = f"/tmp/{slug}.src"
        with open(src, "wb") as f:
            f.write(get(info["url"], binary=True))
        mp4 = os.path.join(MEDIA_DIR, f"{slug}.mp4")
        subprocess.run([
            "ffmpeg", "-v", "error", "-y", "-i", src,
            "-vf", "scale=-2:480,fps=25,format=yuv420p",
            "-c:v", "libx264", "-profile:v", "main", "-preset", "slow", "-b:v", "550k", "-maxrate", "800k", "-bufsize", "1600k",
            "-c:a", "aac", "-b:a", "96k", "-ac", "2", "-ar", "44100", "-movflags", "+faststart", mp4,
        ], check=True)
        if text:
            srt = text if fmt == "srt" else vtt_to_srt(text)
            subs_from = "Commons"
        else:
            srt = whisper_srt(src)
            subs_from = "Whisper"
        with open(os.path.join(TEXT_DIR, f"{slug}.de.srt"), "w") as f:
            f.write(srt)
        os.remove(src)
        meta = info.get("extmetadata", {})
        manifest.append({
            "slug": slug,
            "file": title,
            "title": clean_title(title),
            "duration": round(duration, 1),
            "license": license_name,
            "artist": strip_html(meta.get("Artist", {}).get("value", "")) or "ZDF Terra X",
            "description": strip_html(meta.get("ImageDescription", {}).get("value", ""))[:300],
            "page": info.get("descriptionurl", ""),
            "subtitles": subs_from,
            "bytes": os.path.getsize(mp4),
        })
        json.dump(manifest, open(manifest_path, "w"), ensure_ascii=False, indent=2)
    print(json.dumps(manifest, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
