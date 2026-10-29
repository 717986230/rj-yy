import { esc } from '../app/dom';
import { icon } from './icons';

/**
 * 英语字幕点词查义（借鉴 Word Atlas 的词卡：音标、分级、词义、例句）。
 * 词库 dict/en.json 由 scripts/build_en_dict.py 从 Word Atlas 数据集（CC BY 4.0）里
 * 只挑内置英语字幕出现过的词生成，第一次点词时才下载。
 */
type Entry = [ipa: string, senses: Array<[pos: string, zh: string]>, cefr: string, example: [en: string, zh: string]];
interface EnDict {
  words: Record<string, Entry>;
  forms: Record<string, string>;
}

let dict: Promise<EnDict | null> | null = null;
const loadDict = () =>
  (dict ??= fetch(`${import.meta.env.BASE_URL}dict/en.json`)
    .then((r) => (r.ok ? (r.json() as Promise<EnDict>) : null))
    .catch(() => ((dict = null), null)));

/** 字幕里的一个词 → 词典里的词条名（去标点、所有格，查变形表，再试几种常见词尾） */
export function lookupKey(d: EnDict, token: string): string | null {
  let w = token.toLowerCase().replace(/’/g, "'").replace(/^[^a-z]+|[^a-z]+$/g, '');
  if (w.endsWith("'s")) w = w.slice(0, -2);
  if (!w) return null;
  if (d.words[w]) return w;
  if (d.forms[w]) return d.forms[w]!;
  for (const [suf, rep] of [['ies', 'y'], ['es', ''], ['s', ''], ['ed', ''], ['ed', 'e'], ['ing', ''], ['ing', 'e']] as const) {
    if (w.endsWith(suf) && w.length - suf.length >= 3) {
      const base = w.slice(0, -suf.length) + rep;
      if (d.words[base]) return base;
    }
  }
  return null;
}

function speak(text: string) {
  const s = window.speechSynthesis;
  if (!s) return;
  s.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = 0.9;
  s.speak(u);
}

export class WordCard {
  private readonly node: HTMLElement;

  constructor(
    host: HTMLElement,
    private readonly onToggle: (open: boolean) => void,
  ) {
    this.node = document.createElement('div');
    this.node.className = 'wordcard';
    this.node.hidden = true;
    this.node.addEventListener('click', (e) => {
      const t = e.target as HTMLElement;
      const say = t.closest<HTMLElement>('[data-say]');
      if (say) speak(say.dataset.say!);
      else if (t.closest('[data-close]')) this.close();
    });
    host.append(this.node);
  }

  get open() {
    return !this.node.hidden;
  }

  async show(token: string) {
    const word = token.replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, '');
    if (!word) return;
    this.render(`<p class="wordcard-head"><b>${esc(word)}</b></p><p class="wordcard-note">查词中…</p>`);
    const d = await loadDict();
    if (this.node.hidden) return;
    const key = d && lookupKey(d, word);
    const e = key ? d!.words[key] : null;
    if (!e) {
      this.render(`<p class="wordcard-head"><b>${esc(word)}</b>${this.sayBtn(word)}</p><p class="wordcard-note">${d ? '小词典里没有这个词' : '词典加载失败，稍后再点一次'}</p>`);
      return;
    }
    const [ipa, senses, cefr, [exEn, exZh]] = e;
    this.render(`
      <p class="wordcard-head"><b>${esc(key)}</b>${ipa ? `<span class="wordcard-ipa">${esc(ipa)}</span>` : ''}<span class="wordcard-cefr">${esc(cefr)}</span>${this.sayBtn(key!)}</p>
      ${senses.map(([pos, zh]) => `<p class="wordcard-sense"><i>${esc(pos)}</i> ${esc(zh)}</p>`).join('')}
      ${exEn ? `<p class="wordcard-ex" lang="en">${esc(exEn)}${this.sayBtn(exEn)}</p><p class="wordcard-ex-zh">${esc(exZh)}</p>` : ''}
      <p class="wordcard-credit">词义来自 Word Atlas · CC BY 4.0</p>`);
  }

  close() {
    if (this.node.hidden) return;
    this.node.hidden = true;
    this.onToggle(false);
  }

  private sayBtn(text: string) {
    return `<button type="button" class="wordcard-say" data-say="${esc(text)}" aria-label="朗读" title="朗读">${icon('speaker', 'h-4 w-4')}</button>`;
  }

  private render(body: string) {
    const wasOpen = !this.node.hidden;
    this.node.innerHTML = `<button type="button" class="wordcard-x" data-close aria-label="关闭">×</button>${body}`;
    this.node.hidden = false;
    if (!wasOpen) this.onToggle(true);
  }
}
