/**
 * Vido 吉祥物「小獭 Otti」：拟人水獭女孩，水彩绘本画风。
 * 暖棕色皮毛、奶白色肚皮、指尖带淡青色细闪鳞片、宽大扁平的尾巴，
 * 身上只佩戴一条水草编绳和贝壳吊坠。
 * 图片是用户提供的水彩设定稿抠图（public/mascot/*.webp，透明底），按场景换姿势和表情：
 *
 * | 场景      | 图                         | 用在哪里                     |
 * |-----------|----------------------------|------------------------------|
 * | hello     | 正面站立、举手挥动（两层）  | 欢迎卡                       |
 * | study     | 坐着捧小罐子、侧头看        | 卡背「点我抽一张」            |
 * | swim      | 浮在水面上                 | 视频 / 片库加载中             |
 * | nap       | 浮在水面上睡着             | 片库空空                     |
 * | happy     | 眯眼笑                     | 一部看完                     |
 * | sorry     | 闭眼抿嘴                   | 视频打不开                   |
 */
export type OtterScene = 'hello' | 'study' | 'swim' | 'nap' | 'happy' | 'sorry';

const ALT: Record<OtterScene, string> = {
  hello: 'Otti 挥手打招呼',
  study: 'Otti 坐着认真看',
  swim: 'Otti 在水里游',
  nap: 'Otti 浮在水面上睡着了',
  happy: 'Otti 开心地笑',
  sorry: 'Otti 有点难过',
};

export function otter({ scene = 'hello', cls = 'h-48 w-40' }: { scene?: OtterScene; cls?: string } = {}): string {
  if (scene === 'hello') {
    // 打招呼：身体和举起的手臂分两层，手臂绕肩膀来回挥（main.css 的 .otter-wave）
    return `<span class="otter-wave relative inline-block ${cls}" style="aspect-ratio:450/560;width:auto" role="img" aria-label="${ALT.hello}"><img class="absolute inset-0 h-full w-full select-none" src="mascot/hello-body.webp" alt="" draggable="false" decoding="async" /><img class="otter-arm absolute inset-0 h-full w-full select-none" src="mascot/hello-arm.webp" alt="" draggable="false" decoding="async" /></span>`;
  }
  return `<img class="${cls} object-contain select-none" src="mascot/${scene}.webp" alt="${ALT[scene]}" draggable="false" decoding="async" />`;
}
