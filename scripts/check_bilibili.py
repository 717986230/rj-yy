"""Check the built-in Bilibili cards and search for online replacements.

Runs in GitHub Actions (the sandbox can't reach bilibili.com). For each BV/av id in
packages/shared/src/seed.ts it asks the public view API whether the video is still
online, then searches Bilibili for German-learning videos with Chinese-German
subtitles and prints the candidates that are online, with their length and views.

Usage: python scripts/check_bilibili.py
"""

import http.cookiejar
import json
import re
import time
import urllib.parse
import urllib.request

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15"
jar = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
QUERIES = [
    "Nicos Weg 中德字幕", "Nicos Weg 德语", "尼克之路 德语", "Nicos Weg A1 全集", "Nicos Weg A2", "Nicos Weg B1",
    "小猪佩奇 德语版 中德字幕", "Peppa Wutz deutsch", "Bluey 德语", "德语动画 中德字幕", "Easy German 中德字幕",
    "德语新闻 中德字幕", "tagesschau 中德字幕", "logo Kindernachrichten 中德", "Deutsch lernen mit Videos 中德字幕",
    "Extr@ Deutsch 中德字幕", "Jojo sucht das Glück 中德字幕", "德语 慢速新闻 中德", "DW Langsam gesprochene Nachrichten",
    "Die Sendung mit der Maus 德语", "Wissen macht Ah 中德字幕", "Dark 德剧 中德字幕",
]


def get(url, params=None, referer="https://www.bilibili.com/"):
    if params:
        url += "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Referer": referer})
    with opener.open(req, timeout=30) as r:
        return r.read().decode("utf-8", "replace")


def view(bvid=None, aid=None):
    data = json.loads(get("https://api.bilibili.com/x/web-interface/view", {"bvid": bvid} if bvid else {"aid": aid}))
    return data


def main():
    get("https://www.bilibili.com/")  # buvid3 cookie for the search API
    seed = open("packages/shared/src/seed.ts", encoding="utf-8").read()
    ids = re.findall(r"bili\('([^']+)', '([^']+)'", seed)
    print("== built-in cards")
    for card, vid in ids:
        try:
            d = view(aid=vid[2:]) if vid.startswith("av") else view(bvid=vid)
        except Exception as e:
            print(card, vid, "ERROR", e)
            continue
        v = d.get("data") or {}
        print(card, vid, "code", d.get("code"), d.get("message"), "|", v.get("title"), "|", v.get("duration"), "s |",
              "pages", len(v.get("pages") or []), "| views", (v.get("stat") or {}).get("view"),
              "| no_share", (v.get("rights") or {}).get("no_share"), "| state", v.get("state"))
        time.sleep(1)
    print("== search")
    seen = {}
    for q in QUERIES:
        for search_url in ("https://api.bilibili.com/x/web-interface/search/type",
                           "https://api.bilibili.com/x/web-interface/wbi/search/type"):
            try:
                d = json.loads(get(search_url, {"search_type": "video", "keyword": q, "page": 1}))
            except Exception as e:
                print("search error", q, e)
                continue
            if d.get("code") != 0:
                print("search code", q, d.get("code"), d.get("message"))
                continue
            for r in (d.get("data") or {}).get("result") or []:
                bvid = r.get("bvid")
                if not bvid or bvid in seen:
                    continue
                seen[bvid] = {"q": q, "title": re.sub(r"<[^>]+>", "", r.get("title", "")), "author": r.get("author"),
                              "duration": r.get("duration"), "play": r.get("play"), "pubdate": r.get("pubdate")}
            break
        time.sleep(1.5)
    rows = []
    for bvid, s in seen.items():
        try:
            d = view(bvid=bvid)
        except Exception:
            continue
        if d.get("code") != 0:
            continue
        v = d["data"]
        rows.append({"bvid": bvid, **s, "pages": len(v.get("pages") or []), "copyright": v.get("copyright"),
                     "no_share": (v.get("rights") or {}).get("no_share"), "desc": (v.get("desc") or "")[:80]})
        time.sleep(0.6)
    rows.sort(key=lambda r: -int(r.get("play") or 0))
    for r in rows:
        print(json.dumps(r, ensure_ascii=False))
    json.dump(rows, open("bilibili.json", "w"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
