import { describe, expect, it } from 'vitest';
import { alignedTracks } from '@vido/shared';
import { SubtitleOverlay } from '../src/components/subtitles';

const tracks = alignedTracks([['你好', 'Hallo', 'Hello']], { start: 1, length: 2 });

describe('SubtitleOverlay', () => {
  it('renders Chinese on top and the chosen second language below', () => {
    const root = document.createElement('div');
    const overlay = new SubtitleOverlay(root);
    overlay.update(tracks, 1.5, { visible: true, second: 'de', offset: 0 });
    expect([...root.children].map((c) => c.textContent)).toEqual(['你好', 'Hallo']);
    overlay.update(tracks, 1.6, { visible: true, second: 'en', offset: 0 });
    expect(root.children[1]!.textContent).toBe('Hello');
    expect(root.children[1]!.getAttribute('lang')).toBe('en');
  });

  it('follows playback time, offset and the on/off switch', () => {
    const root = document.createElement('div');
    const overlay = new SubtitleOverlay(root);
    overlay.update(tracks, 3.5, { visible: true, second: 'de', offset: 0 });
    expect(root.textContent).toBe('');
    overlay.update(tracks, 3.5, { visible: true, second: 'de', offset: -1 });
    expect(root.textContent).toBe('你好Hallo');
    overlay.update(tracks, 1.5, { visible: false, second: 'de', offset: 0 });
    expect(root.textContent).toBe('');
  });
});
