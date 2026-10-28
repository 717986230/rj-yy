import type { Cue, SecondaryLang, SubtitleTracks } from './types';

const TIME_RE = /(?:(\d+):)?(\d{1,2}):(\d{2})[.,](\d{1,3})/;

/** "01:02:03.450" / "02:03,450" → 秒 */
export function parseTimestamp(value: string): number {
  const m = TIME_RE.exec(value.trim());
  if (!m) throw new Error(`无法解析时间码：${value}`);
  const [, h = '0', min = '0', s = '0', ms = '0'] = m;
  return Number(h) * 3600 + Number(min) * 60 + Number(s) + Number(ms.padEnd(3, '0')) / 1000;
}

export function formatTimestamp(seconds: number): string {
  const total = Math.max(0, Math.round(seconds * 1000));
  const h = Math.floor(total / 3_600_000);
  const m = Math.floor((total % 3_600_000) / 60_000);
  const s = Math.floor((total % 60_000) / 1000);
  const ms = total % 1000;
  const p = (n: number, w = 2) => String(n).padStart(w, '0');
  return `${p(h)}:${p(m)}:${p(s)}.${p(ms, 3)}`;
}

/**
 * 解析 WebVTT 或 SRT 文本。忽略 NOTE / STYLE 块和 cue 设置，去掉内联标签。
 * 返回按开始时间排序的 cue 列表。
 */
export function parseSubtitles(text: string): Cue[] {
  const blocks = text.replace(/\r\n?/g, '\n').replace(/^﻿/, '').split(/\n{2,}/);
  const cues: Cue[] = [];
  for (const block of blocks) {
    const lines = block.split('\n').filter((l) => l.trim() !== '');
    const timingIdx = lines.findIndex((l) => l.includes('-->'));
    if (timingIdx === -1) continue;
    const [startRaw = '', endRaw = ''] = lines[timingIdx]!.split('-->');
    const body = lines
      .slice(timingIdx + 1)
      .join('\n')
      .replace(/<[^>]+>/g, '')
      .trim();
    if (!body) continue;
    const start = parseTimestamp(startRaw);
    const end = parseTimestamp(endRaw.trim().split(/\s+/)[0] ?? '');
    if (end <= start) continue;
    cues.push({ start, end, text: body });
  }
  return cues.sort((a, b) => a.start - b.start);
}

export function toWebVtt(cues: Cue[]): string {
  const body = cues
    .map((c, i) => `${i + 1}\n${formatTimestamp(c.start)} --> ${formatTimestamp(c.end)}\n${c.text}`)
    .join('\n\n');
  return `WEBVTT\n\n${body}\n`;
}

/** 二分查找当前时间所在的 cue；没有时返回 null */
export function cueAt(cues: readonly Cue[], time: number): Cue | null {
  let lo = 0;
  let hi = cues.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const c = cues[mid]!;
    if (time < c.start) hi = mid - 1;
    else if (time >= c.end) lo = mid + 1;
    else return c;
  }
  return null;
}

export interface BilingualLine {
  /** 中文，显示在上方 */
  zh: string | null;
  /** 第二语言（德语或英语），显示在下方 */
  second: string | null;
}

/** 各语言轨道独立计时：按当前播放时间分别取中文和所选第二语言的字幕 */
export function bilingualAt(subs: SubtitleTracks, time: number, second: SecondaryLang): BilingualLine {
  return {
    zh: cueAt(subs.zh, time)?.text ?? null,
    second: cueAt(subs[second], time)?.text ?? null,
  };
}

export const emptyTracks = (): SubtitleTracks => ({ zh: [], de: [], en: [] });

export function hasSubtitles(subs: SubtitleTracks): boolean {
  return subs.zh.length + subs.de.length + subs.en.length > 0;
}

/** 由三语对照句子生成时间轴一致的三条轨道（用于内置示例字幕） */
export function alignedTracks(
  lines: ReadonlyArray<readonly [zh: string, de: string, en: string]>,
  { start = 1, length = 4, gap = 0.6 }: { start?: number; length?: number; gap?: number } = {},
): SubtitleTracks {
  const tracks = emptyTracks();
  lines.forEach(([zh, de, en], i) => {
    const s = start + i * (length + gap);
    const at = (text: string): Cue => ({ start: s, end: s + length, text });
    tracks.zh.push(at(zh));
    tracks.de.push(at(de));
    tracks.en.push(at(en));
  });
  return tracks;
}

/**
 * 一部视频默认显示的第二字幕语言：跟随原声（德语原声 → 中·德，英语原声 → 中·英）；
 * 没标原声时，只有一种外语字幕就用那一种；判断不了返回 null（保持用户当前的选择）。
 */
export function defaultSecondLang(v: { audioLang?: SecondaryLang; subtitles?: SubtitleTracks }): SecondaryLang | null {
  if (v.audioLang) return v.audioLang;
  const de = v.subtitles?.de.length ?? 0;
  const en = v.subtitles?.en.length ?? 0;
  if (de && !en) return 'de';
  if (en && !de) return 'en';
  return null;
}

/** 解析一行逐词词义：「词|词义 词|词义 … ## 谐音」 */
export function parseGlossLine(line: string): Pick<Cue, 'words' | 'reading'> {
  const [body = '', reading] = line.split(' ## ');
  const words = body
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((token): [string, string] => {
      const bar = token.indexOf('|');
      return bar < 0 ? [token, ''] : [token.slice(0, bar), token.slice(bar + 1)];
    });
  return { words, ...(reading?.trim() ? { reading: reading.trim() } : {}) };
}

/** 给一条字幕轨道按序号挂上逐词词义和谐音 */
export function withGloss(cues: readonly Cue[], lines: readonly string[] | undefined): Cue[] {
  if (!lines) return [...cues];
  return cues.map((cue, i) => (lines[i] ? { ...cue, ...parseGlossLine(lines[i]!) } : cue));
}
