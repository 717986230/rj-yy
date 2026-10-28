import { describe, expect, it, vi } from 'vitest';
import { alignedTracks, type SubtitleTracks } from '@vido/shared';
import { SubtitleOverlay } from '../src/components/subtitles';

const tracks = alignedTracks([['你好', 'Hallo', 'Hello']], { start: 1, length: 2 });
const opts = { visible: true, second: 'de' as const, offset: 0, glosses: true };
const text = (root: HTMLElement, sel: string) => root.querySelector(sel)?.textContent?.replace(/\s+/g, ' ').trim() ?? null;

describe('SubtitleOverlay', () => {
  it('shows the foreign sentence, then the Chinese translation', () => {
    const root = document.createElement('div');
    const overlay = new SubtitleOverlay(root, () => undefined);
    overlay.update(tracks, 1.5, opts);
    expect(text(root, '.sub-second')).toBe('Hallo');
    expect(text(root, '.sub-zh')).toBe('你好');
    overlay.update(tracks, 1.6, { ...opts, second: 'en' });
    expect(text(root, '.sub-second')).toBe('Hello');
    expect(root.querySelector('.sub-second')!.getAttribute('lang')).toBe('en');
  });

  it('puts the Chinese gloss under each word and the reading below, and can hide them', () => {
    const glossed: SubtitleTracks = {
      zh: [{ start: 0, end: 2, text: '我七点起床。' }],
      de: [{ start: 0, end: 2, text: 'Ich stehe auf.', words: [['Ich', '我'], ['stehe', '站'], ['auf.', '起']], reading: '伊希 施特厄 奥夫' }],
      en: [],
    };
    const root = document.createElement('div');
    const overlay = new SubtitleOverlay(root, () => undefined);
    overlay.update(glossed, 1, opts);
    expect([...root.querySelectorAll('.sub-w')].map((w) => [w.children[0]!.textContent, w.children[1]?.textContent])).toEqual([
      ['Ich', '我'],
      ['stehe', '站'],
      ['auf.', '起'],
    ]);
    expect(text(root, '.sub-reading')).toBe('伊希 施特厄 奥夫');
    overlay.update(glossed, 1, { ...opts, glosses: false });
    expect(root.querySelector('.sub-w-g')).toBeNull();
    expect(root.querySelector('.sub-reading')).toBeNull();
  });

  it('replays the current sentence from the speaker button', () => {
    const root = document.createElement('div');
    const onReplay = vi.fn();
    const overlay = new SubtitleOverlay(root, onReplay);
    overlay.update(tracks, 1.5, opts);
    root.querySelector<HTMLButtonElement>('[data-replay]')!.click();
    expect(onReplay).toHaveBeenCalledWith(expect.objectContaining({ start: 1, text: 'Hallo' }));
  });

  it('follows playback time, offset and the on/off switch', () => {
    const root = document.createElement('div');
    const overlay = new SubtitleOverlay(root, () => undefined);
    overlay.update(tracks, 3.5, opts);
    expect(root.textContent).toBe('');
    overlay.update(tracks, 3.5, { ...opts, offset: -1 });
    expect(text(root, '.sub-zh')).toBe('你好');
    overlay.update(tracks, 1.5, { ...opts, visible: false });
    expect(root.textContent).toBe('');
  });
});
