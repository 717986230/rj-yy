"""Build apps/web/public/dict/en.json: a small English word list for tapping words in subtitles.

The words come from Word Atlas (https://github.com/designfuchen/word-atlas, dataset under
CC BY 4.0, "Word Atlas contributors"). Only words that appear in the built-in English
subtitles are kept, so the file stays small.

    git clone --depth 1 https://github.com/designfuchen/word-atlas.git /tmp/word-atlas
    python3 scripts/build_en_dict.py /tmp/word-atlas/data/word-atlas.json

Output: {"words": {headword: [ipa, [[pos, zh], …], cefr, [example, 例句]]},
         "forms": {inflected form: headword}}
"""

import glob
import json
import re
import sys

atlas = {w["w"].lower(): w for w in json.load(open(sys.argv[1], encoding="utf-8")) if " " not in w["w"]}

text = []
for path in glob.glob("apps/web/public/subs/*.json"):
    text += [c["text"] for c in json.load(open(path, encoding="utf-8")).get("en", [])]
# Tears of Steel keeps its English track in TypeScript; its strings are plain English.
text.append(open("packages/shared/src/data/tears-of-steel.ts", encoding="utf-8").read())

IRREGULAR = {"was": "be", "were": "be", "is": "be", "are": "be", "been": "be", "has": "have", "had": "have",
             "did": "do", "does": "do", "went": "go", "gone": "go", "made": "make", "took": "take", "taken": "take",
             "saw": "see", "seen": "see", "came": "come", "got": "get", "gave": "give", "given": "give",
             "found": "find", "thought": "think", "told": "tell", "knew": "know", "known": "know", "left": "leave",
             "felt": "feel", "brought": "bring", "began": "begin", "begun": "begin", "kept": "keep", "held": "hold",
             "wrote": "write", "written": "write", "stood": "stand", "heard": "hear", "meant": "mean", "met": "meet",
             "ran": "run", "paid": "pay", "sat": "sit", "spoke": "speak", "spoken": "speak", "lay": "lie",
             "led": "lead", "grew": "grow", "grown": "grow", "lost": "lose", "fell": "fall", "fallen": "fall",
             "sent": "send", "built": "build", "understood": "understand", "drew": "draw", "drawn": "draw",
             "broke": "break", "broken": "break", "spent": "spend", "rose": "rise", "risen": "rise",
             "drove": "drive", "driven": "drive", "bought": "buy", "wore": "wear", "worn": "wear", "chose": "choose",
             "chosen": "choose", "children": "child", "men": "man", "women": "woman", "people": "person",
             "feet": "foot", "teeth": "tooth", "mice": "mouse", "better": "good", "best": "good", "worse": "bad",
             "worst": "bad", "flew": "fly", "flown": "fly", "threw": "throw", "thrown": "throw", "shot": "shoot",
             "caught": "catch", "taught": "teach", "fought": "fight", "sought": "seek", "won": "win", "hid": "hide",
             "hidden": "hide", "struck": "strike", "froze": "freeze", "frozen": "freeze", "ate": "eat", "eaten": "eat"}


def candidates(w):
    yield w
    if w in IRREGULAR:
        yield IRREGULAR[w]
    for suf, rep in (("ies", "y"), ("ied", "y"), ("ier", "y"), ("iest", "y"), ("es", ""), ("s", ""),
                     ("ed", ""), ("ed", "e"), ("ing", ""), ("ing", "e"), ("er", ""), ("er", "e"),
                     ("est", ""), ("est", "e"), ("ly", ""), ("ily", "y")):
        if w.endswith(suf) and len(w) - len(suf) >= 3:
            base = w[: -len(suf)] + rep
            yield base
            if len(base) > 3 and base[-1] == base[-2] and rep == "":  # stopped → stop
                yield base[:-1]


raw = [t.replace("’", "'") for t in re.findall(r"[A-Za-z][A-Za-z'’-]*[A-Za-z]|[A-Za-z]", "\n".join(text))]
raw = [t[:-2] if t.endswith("'s") else t for t in raw]
tokens = {t.lower() for t in raw}
# Words only ever seen capitalised are names (James, Webb): look those up as they are, no inflection.
names = tokens - {t for t in raw if t[0].islower()}

words, forms = {}, {}
for tok in sorted(tokens):
    head = next((c for c in ([tok] if tok in names else candidates(tok)) if c in atlas), None)
    if not head:
        continue
    if head != tok:
        forms[tok] = head
    if head not in words:
        e = atlas[head]
        ex = e.get("ex") or [{}]
        words[head] = [e.get("us") or e.get("uk") or "", [[s["pos"], s["zh"]] for s in e["senses"][:3]], e["cefr"],
                       [ex[0].get("en", ""), ex[0].get("zh", "")]]

out = {"source": "Word Atlas contributors — CC BY 4.0 — https://github.com/designfuchen/word-atlas",
       "words": words, "forms": forms}
json.dump(out, open("apps/web/public/dict/en.json", "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
print(f"{len(tokens)} subtitle tokens → {len(words)} words, {len(forms)} forms")
