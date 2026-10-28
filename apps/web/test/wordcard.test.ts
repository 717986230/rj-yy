import { describe, expect, it, vi } from 'vitest';
import { alignedTracks } from '@vido/shared';
import { SubtitleOverlay } from '../src/components/subtitles';
import { lookupKey } from '../src/components/wordcard';

const dict = {
  words: { planet: ['', [], 'A2', ['', '']], study: ['', [], 'A1', ['', '']], move: ['', [], 'A1', ['', '']] },
  forms: { studied: 'study' },
} as unknown as Parameters<typeof lookupKey>[0];

describe('lookupKey', () => {
  it('strips punctuation and finds inflected forms', () => {
    expect(lookupKey(dict, 'Planets,')).toBe('planet');
    expect(lookupKey(dict, '“studied.”')).toBe('study');
    expect(lookupKey(dict, 'moving')).toBe('move');
    expect(lookupKey(dict, "planet's")).toBe('planet');
    expect(lookupKey(dict, 'Webb')).toBeNull();
  });
});

describe('SubtitleOverlay word taps', () => {
  const tracks = alignedTracks([['你好', 'Hallo Welt', 'Hello world']], { start: 0, length: 2 });
  const opts = { visible: true, second: 'en' as const, offset: 0, glosses: true };

  it('reports the tapped English word', () => {
    const onWord = vi.fn();
    const root = document.createElement('div');
    const overlay = new SubtitleOverlay(root, () => undefined, onWord);
    overlay.update(tracks, 1, opts);
    (root.querySelectorAll<HTMLElement>('[data-word]')[1]!).click();
    expect(onWord).toHaveBeenCalledWith('world');
  });

  it('leaves German subtitles untappable', () => {
    const root = document.createElement('div');
    const overlay = new SubtitleOverlay(root, () => undefined, vi.fn());
    overlay.update(tracks, 1, { ...opts, second: 'de' });
    expect(root.querySelector('[data-word]')).toBeNull();
  });
});
