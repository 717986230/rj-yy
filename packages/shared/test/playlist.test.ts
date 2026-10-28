import { describe, expect, it } from 'vitest';
import { defaultSecondLang, isBilibili, Playlist, SEED_VIDEOS } from '../src';

const ids = ['a', 'b', 'c', 'd'];
const seq = (values: number[]) => {
  let i = 0;
  return () => values[i++ % values.length]!;
};

describe('Playlist', () => {
  it('sequential mode loops through the library', () => {
    const p = new Playlist(ids, 'sequential');
    expect([p.next(), p.next(), p.next(), p.next(), p.next()]).toEqual(['a', 'b', 'c', 'd', 'a']);
    expect(p.onEnded()).toEqual({ type: 'advance', id: 'b' });
  });

  it('shuffle mode plays every video once per round', () => {
    const p = new Playlist(ids, 'shuffle', seq([0.9, 0.1, 0.5, 0.3, 0.7]));
    const round = [p.next(), p.next(), p.next(), p.next()];
    expect([...round].sort()).toEqual(ids);
    const nextRoundFirst = p.next();
    expect(nextRoundFirst).not.toBe(round[3]);
  });

  it('manual mode stops on end and draws a different card', () => {
    const p = new Playlist(ids, 'manual', () => 0);
    expect(p.draw()).toBe('a');
    expect(p.draw()).toBe('b');
    expect(p.onEnded()).toEqual({ type: 'stop' });
  });

  it('prev walks back through history and keeps forward branch trimmed', () => {
    const p = new Playlist(ids, 'manual', () => 0.99);
    p.draw();
    p.draw();
    const second = p.current;
    p.draw();
    expect(p.prev()).toBe(second);
    p.select('a');
    expect(p.prev()).toBe(second);
  });

  it('prev in sequential mode wraps to the previous library entry', () => {
    const p = new Playlist(ids, 'sequential');
    p.select('a');
    expect(p.prev()).toBe('d');
  });

  it('handles an empty library', () => {
    const p = new Playlist([], 'shuffle');
    expect(p.next()).toBeNull();
    expect(p.onEnded()).toEqual({ type: 'stop' });
  });
});

describe('seed library', () => {
  it('only references https links or site-hosted media with zh / de / en subtitles', () => {
    for (const v of SEED_VIDEOS) {
      expect(v.src).toMatch(/^(https:\/\/|media\/)/);
      for (const m of v.mirrors ?? []) expect(m).toMatch(/^https:\/\//);
      // B 站卡字幕烧在画面里；其余卡的官方字幕各语言条数可能不同（比如中文多一句开场），
      // 只要求每种语言都有、且不超出片长
      if (isBilibili(v.src)) continue;
      for (const track of [v.subtitles.zh, v.subtitles.de, v.subtitles.en]) {
        expect(track.length).toBeGreaterThan(0);
        if (v.duration) expect(track.at(-1)!.end).toBeLessThanOrEqual(v.duration);
      }
    }
    expect(new Set(SEED_VIDEOS.map((v) => v.id)).size).toBe(SEED_VIDEOS.length);
  });
});

describe('default subtitle pair follows the spoken language', () => {
  const byId = (id: string) => SEED_VIDEOS.find((v) => v.id === id)!;
  it('uses 中·德 for German audio and 中·英 for English audio', () => {
    expect(defaultSecondLang(byId('otti-intro'))).toBe('de');
    expect(defaultSecondLang(byId('big-buck-bunny'))).toBe('de');
    expect(defaultSecondLang(byId('tears-of-steel'))).toBe('en');
  });
  it('falls back to the only foreign track, or keeps the current choice', () => {
    const cue = [{ start: 0, end: 1, text: 'x' }];
    expect(defaultSecondLang({ subtitles: { zh: cue, de: cue, en: [] } })).toBe('de');
    expect(defaultSecondLang({ subtitles: { zh: cue, de: [], en: cue } })).toBe('en');
    expect(defaultSecondLang({ subtitles: { zh: cue, de: cue, en: cue } })).toBeNull();
  });
});
