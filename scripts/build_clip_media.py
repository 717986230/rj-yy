"""Cut every German cue of the Vido collections into its own tiny mp4, and find each
video's official YouTube upload, for the handbook's 「🎬 原声例句」.

Runs in GitHub Actions (.github/workflows/build-clip-media.yml): the sandbox can reach
neither Commons nor YouTube. Two delivery modes, the same two WinkLingo uses:

1. Short segments on a CDN: each cue (start-0.15s .. end+0.3s) is re-encoded to a
   360p H.264 mp4 with faststart, ~100-250 KB, pushed to cut-NN shard branches
   (each under jsDelivr's 150 MB package limit) at cut/<video id>/<cue index>.mp4.
   Sources are the already-licensed videos in the media-NN shards (CC BY / CC BY-SA /
   public domain, from Wikimedia Commons); nothing copyrighted is added.
2. Official YouTube player: Commons file pages of these clips usually name the YouTube
   upload they came from. We take that id only when YouTube's oEmbed confirms the video
   exists and allows embedding. Only the id is stored; the handbook embeds the official
   player with start/end, never copies the video.

Writes content/clip-media.json: {video id: {"cut": "cut-NN" | null, "n": cues, "yt": id | null}}
build_collections.py folds it into apps/web/public/clips.json.

Usage: python scripts/build_clip_media.py [--no-cut] [--no-youtube] [--recheck-youtube]
"""

import json
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

API = "https://commons.wikimedia.org/w/api.php"
UA = "VidoFetcher/1.0 (https://github.com/717986230/rj-yy; GitHub Actions)"
CLIPS = "apps/web/public/clips.json"
OUT = "content/clip-media.json"
MEDIA = "media-shards"   # media-NN worktrees (sources)
CUTS = "cut-shards"      # cut-NN worktrees (output)
SHARD_LIMIT = 140_000_000
YT_ID = re.compile(r"(?:youtube\.com/(?:watch\?(?:[^\s\"'<>|\]]*&)?v=|embed/|shorts/)|youtu\.be/)([A-Za-z0-9_-]{11})")


def get(url, params=None):
    if params:
        url += "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.status, r.read().decode("utf-8", "replace")
        except urllib.error.HTTPError as e:
            if e.code in (429, 502, 503, 504) and attempt < 4:
                time.sleep(5 * 2 ** attempt)
                continue
            return e.code, ""
        except Exception:
            if attempt == 4:
                return 0, ""
            time.sleep(3)


def manifests():
    """video id -> manifest entry, for every collection."""
    out = {}
    for name in os.listdir("content/collections"):
        p = f"content/collections/{name}/manifest.json"
        if os.path.exists(p):
            for m in json.load(open(p, encoding="utf-8")):
                out[f"{name}-{m['slug']}"] = m
    return out


def youtube_id(m):
    """The YouTube upload a Commons file was taken from, if it says so and embedding is allowed."""
    code, body = get(API, {"action": "query", "format": "json", "titles": m["file"], "prop": "revisions",
                           "rvprop": "content", "rvslots": "main"})
    if code != 200:
        return None
    ids = []
    for page in json.loads(body).get("query", {}).get("pages", {}).values():
        for rev in page.get("revisions", []):
            text = rev.get("slots", {}).get("main", {}).get("*", "")
            ids += YT_ID.findall(text)
            # {{From YouTube|id=XXXXXXXXXXX}} / {{YouTube CC-BY|...}} style templates
            ids += re.findall(r"\{\{\s*From YouTube\s*\|\s*(?:1=|id=)?\s*([A-Za-z0-9_-]{11})", text, re.I)
    if not ids:
        hint = "youtube" in body.lower()
        print(f"  {m['file']}: no YouTube id in wikitext{' (mentions youtube)' if hint else ''}", flush=True)
    for vid in dict.fromkeys(ids):
        code, _ = get("https://www.youtube.com/oembed", {"url": f"https://www.youtube.com/watch?v={vid}", "format": "json"})
        print(f"  {vid}: oEmbed {code}", flush=True)
        # 401 = 禁止嵌入，400/404 = 已删除或私享；其他（被限流、连不上）不能证明不行，先收下，前端还会再探测
        if code not in (400, 401, 403, 404):
            return vid
        time.sleep(0.3)
    return None


class Shards:
    def __init__(self):
        os.makedirs(CUTS, exist_ok=True)
        have = sorted(d for d in os.listdir(CUTS) if d.startswith("cut-"))
        self.name = have[-1] if have else None
        if not self.name:
            self._new(1)

    def _new(self, n):
        self.name = f"cut-{n:02d}"
        path = f"{CUTS}/{self.name}"
        if not os.path.exists(path):
            subprocess.run(["git", "worktree", "add", "--orphan", "-b", self.name, path], check=True)

    def size(self):
        total = 0
        for root, _, files in os.walk(f"{CUTS}/{self.name}"):
            if "/.git" in root:
                continue
            total += sum(os.path.getsize(os.path.join(root, f)) for f in files)
        return total

    def ensure_room(self, need):
        if self.size() + need > SHARD_LIMIT:
            self._new(int(self.name.split("-")[1]) + 1)
        return self.name


def cut_video(src, vid, cues, shard):
    folder = f"{CUTS}/{shard}/cut/{vid}"
    os.makedirs(folder, exist_ok=True)
    for i, (start, end) in enumerate(cues):
        out = f"{folder}/{i}.mp4"
        if os.path.exists(out):
            continue
        a, b = max(0.0, start - 0.15), end + 0.3
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{a:.2f}", "-i", src, "-t", f"{b - a:.2f}",
                        "-vf", "scale=-2:360", "-c:v", "libx264", "-preset", "veryfast", "-crf", "30",
                        "-profile:v", "main", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "64k", "-ac", "1",
                        "-movflags", "+faststart", out], check=True)


def main():
    do_cut = "--no-cut" not in sys.argv
    do_yt = "--no-youtube" not in sys.argv
    clips = json.load(open(CLIPS, encoding="utf-8"))
    man = manifests()
    old = json.load(open(OUT, encoding="utf-8")) if os.path.exists(OUT) else {}
    per = {}
    for c in clips["c"]:
        per.setdefault(c[0], []).append((c[1], c[2]))
    shards = Shards() if do_cut else None
    result = {}
    for vi, v in enumerate(clips["v"]):
        vid = v[0]
        m = man.get(vid)
        cues = per.get(vi, [])
        rec = dict(old.get(vid) or {})
        rec["n"] = len(cues)
        if do_yt and m and ("yt" not in rec or ("--recheck-youtube" in sys.argv and not rec.get("yt"))):
            rec["yt"] = youtube_id(m)
            print(f"{vid}: youtube {rec['yt']}", flush=True)
        if do_cut and m and cues and not rec.get("cut"):
            src = f"{MEDIA}/{m['shard']}/{m['path']}"
            if not os.path.exists(src):
                print(f"::warning::{vid}: source {src} missing", flush=True)
            else:
                shard = shards.ensure_room(len(cues) * 300_000)
                cut_video(src, vid, cues, shard)
                rec["cut"] = shard
                print(f"{vid}: {len(cues)} cuts -> {shard}", flush=True)
        result[vid] = rec
        json.dump(result | {k: old[k] for k in old if k not in result}, open(OUT, "w", encoding="utf-8"),
                  ensure_ascii=False, indent=1, sort_keys=True)
    yt = sum(1 for r in result.values() if r.get("yt"))
    cut = sum(r["n"] for r in result.values() if r.get("cut"))
    print(f"done: {cut} cuts, {yt}/{len(result)} videos with an embeddable YouTube upload")


if __name__ == "__main__":
    main()
