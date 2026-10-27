import type { PlayMode } from './types';

export type Random = () => number;

export type EndedAction = { type: 'advance'; id: string } | { type: 'stop' };

/**
 * 播放队列：决定"下一张卡"是哪条视频。纯逻辑，不依赖 DOM，前后端都可用。
 *
 * - sequential 顺序循环：按片库顺序，播完最后一条回到第一条
 * - shuffle    随机播放：洗牌袋，一轮内不重复，全部播完再洗一次
 * - manual     手动抽卡：播完停住，由用户点击抽卡；每次抽卡随机且不与当前重复
 */
export class Playlist {
  private ids: string[];
  private bag: string[] = [];
  private history: string[] = [];
  private cursor = -1;

  constructor(
    ids: readonly string[],
    public mode: PlayMode = 'manual',
    private readonly random: Random = Math.random,
  ) {
    this.ids = [...ids];
  }

  get current(): string | null {
    return this.history[this.cursor] ?? null;
  }

  get size(): number {
    return this.ids.length;
  }

  get canGoBack(): boolean {
    return this.cursor > 0;
  }

  setIds(ids: readonly string[]): void {
    this.ids = [...ids];
    this.bag = this.bag.filter((id) => this.ids.includes(id));
  }

  setMode(mode: PlayMode): void {
    this.mode = mode;
    this.bag = [];
  }

  /** 抽一张：随机，且尽量不与当前视频相同 */
  draw(): string | null {
    const pool = this.ids.filter((id) => id !== this.current);
    const pick = this.pickFrom(pool.length ? pool : this.ids);
    return pick === null ? null : this.push(pick);
  }

  /** 按当前模式前进到下一条 */
  next(): string | null {
    if (!this.ids.length) return null;
    switch (this.mode) {
      case 'sequential': {
        const i = this.current === null ? -1 : this.ids.indexOf(this.current);
        return this.push(this.ids[(i + 1) % this.ids.length]!);
      }
      case 'shuffle':
        return this.push(this.fromBag());
      case 'manual':
        return this.draw();
    }
  }

  /** 回到上一条看过的视频；顺序模式下没有历史时退回片库中的上一条 */
  prev(): string | null {
    if (this.cursor > 0) {
      this.cursor -= 1;
      return this.current;
    }
    if (this.mode === 'sequential' && this.current !== null && this.ids.length) {
      const i = this.ids.indexOf(this.current);
      const id = this.ids[(i - 1 + this.ids.length) % this.ids.length]!;
      this.history.unshift(id);
      this.cursor = 0;
      return id;
    }
    return null;
  }

  /** 直接选择某条（例如从片库列表点选） */
  select(id: string): string {
    return this.push(id);
  }

  /** 一条视频播放结束时调用 */
  onEnded(): EndedAction {
    if (this.mode === 'manual') return { type: 'stop' };
    const id = this.next();
    return id === null ? { type: 'stop' } : { type: 'advance', id };
  }

  private push(id: string): string {
    this.history = this.history.slice(0, this.cursor + 1);
    this.history.push(id);
    if (this.history.length > 100) this.history.shift();
    this.cursor = this.history.length - 1;
    return id;
  }

  private pickFrom(pool: readonly string[]): string | null {
    if (!pool.length) return null;
    return pool[Math.floor(this.random() * pool.length)]!;
  }

  private fromBag(): string {
    if (!this.bag.length) {
      this.bag = shuffle(this.ids, this.random);
      // 新一轮的第一条避免与刚播完的那条相同
      if (this.bag.length > 1 && this.bag[this.bag.length - 1] === this.current) {
        this.bag.unshift(this.bag.pop()!);
      }
    }
    return this.bag.pop()!;
  }
}

export function shuffle<T>(items: readonly T[], random: Random = Math.random): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}
