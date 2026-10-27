import { el, esc } from '../app/dom';
import { openModal } from './modal';

const READY = ['0 无数据', '1 有元数据', '2 当前帧', '3 可继续', '4 足够播放'];
const NETWORK = ['0 空', '1 空闲', '2 下载中', '3 无来源'];
const ERRORS = ['', '1 中止', '2 网络错误', '3 解码失败', '4 格式不支持 / 打不开'];

function snapshot(video: HTMLVideoElement): [string, string][] {
  const rect = video.getBoundingClientRect();
  const quality = video.getVideoPlaybackQuality?.();
  const chain: string[] = [];
  for (let node: HTMLElement | null = video; node && node !== document.body; node = node.parentElement) {
    const cs = getComputedStyle(node);
    const marks = [
      cs.transform !== 'none' && `transform`,
      cs.backfaceVisibility === 'hidden' && 'backface',
      cs.transformStyle === 'preserve-3d' && '3d',
      cs.visibility === 'hidden' && 'hidden',
      cs.filter !== 'none' && 'filter',
    ].filter(Boolean);
    if (marks.length) chain.push(`${node.dataset.ref ?? node.className.toString().split(' ')[0] ?? node.tagName}(${marks.join(',')})`);
  }
  return [
    ['版本', __APP_VERSION__],
    ['浏览器', navigator.userAgent],
    ['视频地址', video.currentSrc || '（无）'],
    ['加载状态', READY[video.readyState] ?? String(video.readyState)],
    ['网络状态', NETWORK[video.networkState] ?? String(video.networkState)],
    ['错误', video.error ? `${ERRORS[video.error.code] ?? video.error.code} ${video.error.message}` : '无'],
    ['画面尺寸', `${video.videoWidth}×${video.videoHeight}（显示 ${Math.round(rect.width)}×${Math.round(rect.height)}）`],
    ['已解码帧', quality ? `${quality.totalVideoFrames}（丢 ${quality.droppedVideoFrames}）` : '浏览器不提供'],
    ['播放', `${video.paused ? '暂停' : '播放中'} · ${video.currentTime.toFixed(1)}s · ${video.muted ? '静音' : `音量 ${Math.round(video.volume * 100)}%`}`],
    ['变换层', chain.length ? chain.join(' → ') : '无'],
  ];
}

/** 黑屏诊断：实时显示视频元素的状态，方便用户截图反馈 */
export function showDiagnostics(video: HTMLVideoElement): void {
  const view = el(`
    <div class="grid w-[min(92vw,380px)] gap-3 rounded-3xl border border-line/10 bg-panel p-4 text-left">
      <div class="flex items-center justify-between">
        <p class="text-base font-bold">播放诊断</p>
        <button data-close class="btn-ghost h-8 px-3 text-xs" autofocus>关闭</button>
      </div>
      <p class="text-xs leading-relaxed text-mute">画面不对时，把这一页截图发给我们。数据每半秒刷新。</p>
      <dl data-rows class="grid max-h-[55vh] gap-1.5 overflow-y-auto text-[11px] leading-snug"></dl>
    </div>`);
  const rows = view.querySelector<HTMLElement>('[data-rows]')!;
  const render = () => {
    rows.innerHTML = snapshot(video)
      .map(([k, v]) => `<div class="grid grid-cols-[4.5em_minmax(0,1fr)] gap-2"><dt class="text-mute">${k}</dt><dd class="break-all text-fg">${esc(v)}</dd></div>`)
      .join('');
  };
  render();
  const timer = window.setInterval(render, 500);
  const close = openModal(view, { onClose: () => clearInterval(timer) });
  view.querySelector<HTMLButtonElement>('[data-close]')!.onclick = close;
}
