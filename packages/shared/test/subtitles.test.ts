import { describe, expect, it } from 'vitest';
import { alignedTracks, bilingualAt, cueAt, formatTimestamp, parseSubtitles, parseTimestamp, toWebVtt } from '../src';

describe('timestamps', () => {
  it('parses VTT and SRT forms', () => {
    expect(parseTimestamp('00:01.500')).toBe(1.5);
    expect(parseTimestamp('01:02:03,040')).toBeCloseTo(3723.04);
  });
  it('round-trips through formatTimestamp', () => {
    expect(parseTimestamp(formatTimestamp(3723.04))).toBeCloseTo(3723.04);
  });
});

describe('parseSubtitles', () => {
  it('reads WebVTT with header, notes, settings and tags', () => {
    const vtt = `WEBVTT\n\nNOTE demo\n\n1\n00:00:01.000 --> 00:00:03.000 align:center\n<b>你好</b>\n\n00:00:04.000 --> 00:00:05.500\n第二句\n第二行`;
    expect(parseSubtitles(vtt)).toEqual([
      { start: 1, end: 3, text: '你好' },
      { start: 4, end: 5.5, text: '第二句\n第二行' },
    ]);
  });
  it('reads SRT with CRLF', () => {
    const srt = '1\r\n00:00:02,000 --> 00:00:04,000\r\nHallo\r\n\r\n2\r\n00:00:00,500 --> 00:00:01,500\r\nErst\r\n';
    expect(parseSubtitles(srt).map((c) => c.text)).toEqual(['Erst', 'Hallo']);
  });
  it('survives toWebVtt round trip', () => {
    const { zh } = alignedTracks([['一', 'eins', 'one'], ['二', 'zwei', 'two']]);
    expect(parseSubtitles(toWebVtt(zh))).toEqual(zh);
  });
});

describe('cue lookup', () => {
  const subs = alignedTracks(
    [
      ['中文一', 'Deutsch eins', 'English one'],
      ['中文二', 'Deutsch zwei', 'English two'],
    ],
    { start: 1, length: 2, gap: 1 },
  );
  it('finds the active cue and gaps', () => {
    expect(cueAt(subs.zh, 0.5)).toBeNull();
    expect(cueAt(subs.zh, 1)?.text).toBe('中文一');
    expect(cueAt(subs.zh, 3)).toBeNull();
    expect(cueAt(subs.zh, 4.2)?.text).toBe('中文二');
  });
  it('pairs Chinese with the selected second language in real time', () => {
    expect(bilingualAt(subs, 1.5, 'de')).toEqual({ zh: '中文一', second: 'Deutsch eins' });
    expect(bilingualAt(subs, 4.5, 'en')).toEqual({ zh: '中文二', second: 'English two' });
  });
  it('keeps tracks independent when timings differ', () => {
    const mixed = { ...subs, en: [{ start: 0, end: 10, text: 'long line' }] };
    expect(bilingualAt(mixed, 3.5, 'en')).toEqual({ zh: null, second: 'long line' });
  });
});
