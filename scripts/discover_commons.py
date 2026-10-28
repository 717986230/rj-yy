"""List freely licensed spoken-language video collections on Wikimedia Commons.

Runs in GitHub Actions (the sandbox can't reach Commons). Searches categories by
keyword, then for each category counts the video files whose license is free
(CC BY / BY-SA / CC0 / public domain), their durations and whether a German or
English TimedText track exists. Prints a table and writes discover.json.

Usage: python scripts/discover_commons.py
"""

import json
import sys
import re
import urllib.parse
import urllib.request

API = "https://commons.wikimedia.org/w/api.php"
UA = "VidoFetcher/1.0 (https://github.com/717986230/rj-yy; GitHub Actions)"
KEYWORDS = sys.argv[1:] or [
    "Videos by Terra X", "Terra X", "tagesschau", "SRF Wissen", "SRF", "Planet Wissen", "kolleg24",
    "Videos in German", "German-language videos", "Videos with German subtitles", "MrWissen2go",
    "Bayerischer Rundfunk", "WDR", "NDR", "Deutschlandfunk", "Bundesregierung videos", "Bundestag videos",
    "VOA Learning English", "Videos by NASA", "NASA Goddard videos",
]
FREE = re.compile(r"^(CC BY(-SA)? [0-9.]+|CC0|Public domain|PD)", re.I)


def get(params):
    req = urllib.request.Request(API + "?" + urllib.parse.urlencode(params), headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.loads(r.read().decode())


def search_categories(term):
    data = get({"action": "query", "format": "json", "list": "search", "srsearch": term,
                "srnamespace": 14, "srlimit": 15})
    return [h["title"] for h in data["query"]["search"]]


def files(category, limit=3000):
    params = {"action": "query", "format": "json", "generator": "categorymembers", "gcmtitle": category,
              "gcmtype": "file", "gcmlimit": "500", "prop": "videoinfo", "viprop": "size|mediatype|extmetadata",
              "viextmetadatafilter": "LicenseShortName"}
    n = 0
    while n < limit:
        data = get(params)
        for page in data.get("query", {}).get("pages", {}).values():
            info = (page.get("videoinfo") or [{}])[0]
            if info.get("mediatype") != "VIDEO":
                continue
            n += 1
            yield page["title"], float(info.get("duration") or 0), info.get("extmetadata", {}).get("LicenseShortName", {}).get("value", "")
        if "continue" not in data:
            break
        params.update(data["continue"])


def subtitle_langs(titles):
    found = {}
    for i in range(0, len(titles), 50):
        chunk = titles[i:i + 50]
        names = [f"TimedText:{t[5:]}.{lang}.srt" for t in chunk for lang in ("de", "en", "zh")]
        for j in range(0, len(names), 50):
            data = get({"action": "query", "format": "json", "titles": "|".join(names[j:j + 50])})
            for p in data["query"]["pages"].values():
                if "missing" not in p:
                    m = re.match(r"TimedText:(.*)\.(de|en|zh)\.srt$", p["title"])
                    if m:
                        found.setdefault("File:" + m.group(1), set()).add(m.group(2))
    return found


def main():
    cats = []
    for k in KEYWORDS:
        try:
            for c in search_categories(k):
                if c not in cats:
                    cats.append(c)
        except Exception as e:
            print("search failed", k, e)
    report = []
    for c in cats:
        try:
            vids = list(files(c))
        except Exception as e:
            print("list failed", c, e)
            continue
        free = [v for v in vids if FREE.match(v[2])]
        if not free:
            continue
        short = [v for v in free if 30 <= v[1] <= 900]
        subs = subtitle_langs([v[0] for v in short[:400]]) if short else {}
        row = {
            "category": c, "videos": len(vids), "free": len(free), "free_30s_15min": len(short),
            "minutes": round(sum(v[1] for v in short) / 60),
            "with_de": sum(1 for v in short if "de" in subs.get(v[0], ())),
            "with_en": sum(1 for v in short if "en" in subs.get(v[0], ())),
            "with_zh": sum(1 for v in short if "zh" in subs.get(v[0], ())),
            "licenses": sorted({v[2] for v in free})[:6],
            "sample": [v[0] for v in short[:8]],
        }
        report.append(row)
        print(json.dumps(row, ensure_ascii=False), flush=True)
    json.dump(report, open("discover.json", "w"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
