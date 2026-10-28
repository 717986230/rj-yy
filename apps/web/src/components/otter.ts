/**
 * Vido 吉祥物「小獭 Otti」：拟人水獭女孩，水彩绘本画风。
 * 暖棕色皮毛、奶白色肚皮、指尖带淡青色细闪鳞片、宽大扁平的尾巴，
 * 身上只佩戴一条水草编绳和贝壳吊坠。
 * 图片是用户提供的水彩设定稿抠图（public/mascot/otti.webp，透明底）。
 */
export type OtterPose = 'stand' | 'wave';

export function otter({ cls = 'h-48 w-40' }: { pose?: OtterPose; cls?: string } = {}): string {
  return `<img class="${cls} object-contain select-none" src="mascot/otti.webp" alt="Vido 吉祥物：水獭女孩 Otti" draggable="false" decoding="async" />`;
}
