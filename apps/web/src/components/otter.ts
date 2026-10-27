/**
 * Vido 吉祥物「小獭 Otti」：拟人水獭女孩，绘本柔和画风。
 * 暖棕色皮毛、奶白色肚皮、指尖带淡青色细闪鳞片、宽大扁平的尾巴，
 * 身上只佩戴一条水草编绳和贝壳吊坠。纯 SVG，任意尺寸清晰。
 */
let seq = 0;

export type OtterPose = 'stand' | 'wave';

export function otter({ pose = 'stand', cls = 'h-48 w-40' }: { pose?: OtterPose; cls?: string } = {}): string {
  const id = `ot${++seq}`;
  const fur = `url(#${id}-fur)`;
  const sparkle = (x: number, y: number, r = 1.6) =>
    `<g class="otter-sparkle"><circle cx="${x}" cy="${y}" r="${r * 2.2}" fill="#8ff3ec" opacity=".28" filter="url(#${id}-glow)"/><circle cx="${x}" cy="${y}" r="${r}" fill="#c9fffa"/></g>`;

  const leftArm = `
    <path d="M66 140c-12 14-10 32 6 34 9 1 13-6 11-12-3-5-8-9-8-18z" fill="${fur}"/>
    ${sparkle(73, 172)}${sparkle(79, 174, 1.3)}${sparkle(84, 170, 1.4)}`;
  const rightArm =
    pose === 'wave'
      ? `
    <path d="M136 140c10-10 18-26 22-42 2-8 14-8 14 2-1 18-13 36-26 48z" fill="${fur}"/>
    <ellipse cx="165" cy="92" rx="10" ry="9" fill="#9b6038"/>
    ${sparkle(160, 84)}${sparkle(166, 82, 1.3)}${sparkle(172, 86, 1.5)}`
      : `
    <path d="M134 140c12 14 10 32-6 34-9 1-13-6-11-12 3-5 8-9 8-18z" fill="${fur}"/>
    ${sparkle(127, 172)}${sparkle(121, 174, 1.3)}${sparkle(116, 170, 1.4)}`;

  return `<svg class="${cls}" viewBox="0 0 200 240" role="img" aria-label="Vido 吉祥物：水獭女孩 Otti">
  <defs>
    <radialGradient id="${id}-fur" cx="45%" cy="30%" r="80%">
      <stop offset="0" stop-color="#c58a5a"/><stop offset=".6" stop-color="#a86a3f"/><stop offset="1" stop-color="#7f4d2c"/>
    </radialGradient>
    <radialGradient id="${id}-belly" cx="50%" cy="35%" r="70%">
      <stop offset="0" stop-color="#fff6e6"/><stop offset="1" stop-color="#efdcc0"/>
    </radialGradient>
    <linearGradient id="${id}-tail" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#8a5634"/><stop offset="1" stop-color="#6a3e22"/>
    </linearGradient>
    <filter id="${id}-glow" x="-1" y="-1" width="3" height="3"><feGaussianBlur stdDeviation="1.6"/></filter>
  </defs>

  <ellipse cx="100" cy="232" rx="62" ry="6" fill="#000" opacity=".28"/>

  <!-- 宽大扁平的水獭尾巴 -->
  <path d="M122 206c26 6 52-2 64-22 6-10 0-20-9-16-6 3-8 10-14 16-12 11-26 12-41 10z" fill="url(#${id}-tail)"/>
  <path d="M150 204c9-2 17-7 23-14M140 207c7 0 14-2 20-5" stroke="#b07a52" stroke-width="1.4" stroke-linecap="round" fill="none" opacity=".6"/>

  <!-- 身体与肚皮 -->
  <path d="M62 128c-9 34-10 74 8 92 16 14 44 14 60 0 18-18 17-58 8-92z" fill="${fur}"/>
  <path d="M74 150c-4 24-2 52 10 64 9 8 23 8 32 0 12-12 14-40 10-64-6-10-46-10-52 0z" fill="url(#${id}-belly)"/>

  <!-- 脚 -->
  <ellipse cx="80" cy="226" rx="15" ry="7" fill="#6e4026"/>
  <ellipse cx="120" cy="226" rx="15" ry="7" fill="#6e4026"/>

  ${leftArm}
  ${rightArm}

  <!-- 头 -->
  <ellipse cx="100" cy="88" rx="54" ry="47" fill="${fur}"/>
  <circle cx="56" cy="54" r="11" fill="#8d5532"/><circle cx="56" cy="55" r="5.5" fill="#d29a74"/>
  <circle cx="144" cy="54" r="11" fill="#8d5532"/><circle cx="144" cy="55" r="5.5" fill="#d29a74"/>
  <path d="M90 45c2-10 12-13 15-5 4-7 12-4 9 4" fill="none" stroke="#a86a3f" stroke-width="5" stroke-linecap="round"/>
  <path d="M60 100c0-22 18-30 40-26 22-4 40 4 40 26 0 22-18 33-40 33s-40-11-40-33z" fill="url(#${id}-belly)"/>

  <!-- 眼睛与睫毛 -->
  <ellipse cx="79" cy="86" rx="7" ry="8" fill="#26170f"/><circle cx="81.5" cy="82.5" r="2.4" fill="#fff"/><circle cx="77" cy="89" r="1" fill="#fff" opacity=".7"/>
  <ellipse cx="121" cy="86" rx="7" ry="8" fill="#26170f"/><circle cx="123.5" cy="82.5" r="2.4" fill="#fff"/><circle cx="119" cy="89" r="1" fill="#fff" opacity=".7"/>
  <path d="M72 80l-5-3.5M71.5 84l-6-1M128 80l5-3.5M128.5 84l6-1" stroke="#26170f" stroke-width="1.8" stroke-linecap="round"/>

  <!-- 腮红、鼻子、嘴 -->
  <ellipse cx="68" cy="103" rx="8.5" ry="4.5" fill="#f2a3a0" opacity=".55"/>
  <ellipse cx="132" cy="103" rx="8.5" ry="4.5" fill="#f2a3a0" opacity=".55"/>
  <path d="M91.5 98c0-5 17-5 17 0 0 4.5-5 8-8.5 8s-8.5-3.5-8.5-8z" fill="#3a2418"/>
  <ellipse cx="97" cy="96.5" rx="2.6" ry="1.4" fill="#fff" opacity=".45"/>
  <path d="M100 106v4m0 0c-3 5-8 4.5-10 1.5m10-1.5c3 5 8 4.5 10 1.5" fill="none" stroke="#3a2418" stroke-width="2" stroke-linecap="round"/>
  <g stroke="#f4e8d8" stroke-width="1.1" stroke-linecap="round" opacity=".75">
    <path d="M84 104l-28-4M84 108l-27 3M116 104l28-4M116 108l27 3"/>
  </g>

  <!-- 水草编绳 + 贝壳吊坠（唯一的配饰） -->
  <path d="M64 124c12 18 60 18 72 0" fill="none" stroke="#5f8a46" stroke-width="4" stroke-linecap="round"/>
  <path d="M64 124c12 18 60 18 72 0" fill="none" stroke="#9cc47a" stroke-width="1.6" stroke-dasharray="3 3.5" stroke-linecap="round"/>
  <path d="M74 133c-3 4-3 8 0 10M126 133c3 4 3 8 0 10" stroke="#5f8a46" stroke-width="2" stroke-linecap="round" fill="none"/>
  <path d="M100 156l-11-12c1-9 21-9 22 0z" fill="#f8dccf"/>
  <path d="M100 156l-6-12.5M100 156v-13.5M100 156l6-12.5M100 156l-10-9M100 156l10-9" stroke="#d9a495" stroke-width="1" stroke-linecap="round"/>
  <circle cx="100" cy="141" r="2" fill="#e9c1b2"/>
</svg>`;
}
