import { bilibiliPageUrl } from './bilibili';
import { BIG_BUCK_BUNNY_SUBTITLES } from './data/big-buck-bunny';
import { TEARS_OF_STEEL_SUBTITLES } from './data/tears-of-steel';
import { TERRA_X_CLIPS } from './data/terra-x';
import { emptyTracks } from './subtitles';
import type { Video } from './types';

/**
 * 内置片库：先是随网站托管、任何网络都能播的整部影片（Otti 开场片、《钢铁之泪》、《大雄兔》完整版，
 * 都有中德英字幕），然后是 B 站上标明中德字幕的 DW 德语课与德语动画（实验，默认不进抽卡牌堆）。
 * 每张卡都是一整部视频，不放截取的片段。用户可以在片库里添加自己的外链或 B 站视频。
 */
const CREATED = '2026-10-27T00:00:00.000Z';

/**
 * 两段托管在 Vido 站点自己的短片（apps/web/public/media）：只要网站能打开，它们就能播放，
 * 不受外部视频站点在当前网络下是否可达的影响。备用线路走 jsDelivr 加速的同一文件。
 */
const SITE_MEDIA = 'media';
const JSDELIVR_MEDIA = 'https://cdn.jsdelivr.net/gh/717986230/rj-yy@main/apps/web/public/media';
const SITE_SOURCE = 'Vido 站内';

/**
 * 哔哩哔哩上带中德双语字幕的 DW 德语课与德语动画（用户上传，字幕压在画面里），
 * 用 B 站官方嵌入播放器播放，Vido 不下载、不转存视频。编号来自 B 站公开页面。
 * 用户上传的视频可能被删除（例如电影类），打不开的卡片用户可以在播放页或片库里隐藏。
 */
const bili = (
  id: string,
  bvid: string,
  title: Seed['title'],
  series: string,
  tags: string[],
): Seed => ({
  id,
  title,
  src: bilibiliPageUrl(bvid.startsWith('av') ? { aid: bvid.slice(2), page: 1 } : { bvid, page: 1 }),
  source: 'bilibili.com',
  series,
  episode: 1,
  tags: ['B站', '中德字幕', ...tags],
  subtitles: emptyTracks(),
});

const BILIBILI: Seed[] = [
  bili('bili-nicos-weg-a1', 'BV19V411q7tM', { zh: '跟着 Nicos Weg 学德语 A1', de: 'Nicos Weg A1', en: "Nico's Way A1" }, 'Nicos Weg · DW 德语课', ['DW']),
  bili('bili-nicos-weg-01', 'BV13u4y137e2', { zh: '尼克之路 第 1 集', de: 'Nicos Weg – Folge 1', en: "Nico's Way – Episode 1" }, 'Nicos Weg · DW 德语课', ['DW']),
  bili('bili-nicos-weg-zhde', 'BV15Z4y1G76Q', { zh: 'Nicos Weg（中德字幕版）', de: 'Nicos Weg (chinesisch-deutsch)', en: "Nico's Way (Chinese-German)" }, 'Nicos Weg · DW 德语课', ['DW']),
  bili('bili-nicos-weg-zhde-2', 'BV1Gb411L754', { zh: 'Nicos Weg（中德字幕版 二）', de: 'Nicos Weg (chinesisch-deutsch) II', en: "Nico's Way (Chinese-German) II" }, 'Nicos Weg · DW 德语课', ['DW']),
  bili('bili-nicos-weg-zhde-3', 'BV1pb41137g6', { zh: 'Nicos Weg（中德字幕版 三）', de: 'Nicos Weg (chinesisch-deutsch) III', en: "Nico's Way (Chinese-German) III" }, 'Nicos Weg · DW 德语课', ['DW']),
  bili('bili-bluey-de', 'BV1RT411z7xd', { zh: '布鲁伊（德语版）', de: 'Bluey auf Deutsch', en: 'Bluey in German' }, '德语动画', ['动画']),
  bili('bili-peppa-wutz', 'av801477868', { zh: '小猪佩奇（德语版）', de: 'Peppa Wutz', en: 'Peppa Pig in German' }, '德语动画', ['动画']),
];

type Seed = Omit<Video, 'ownerId' | 'createdAt'>;

/**
 * ZDF Terra X / 3sat 的德语科普短片（Wikimedia Commons，CC BY / CC BY-SA，署名见 source），
 * 德语原声 + 官方德语字幕，中文和英文是翻译。由 .github/workflows/fetch-terra-x.yml 拉取并托管在站内。
 */
const TERRA_X: Seed[] = TERRA_X_CLIPS.map((c) => ({
  id: c.id,
  title: c.title,
  src: `${SITE_MEDIA}/${c.file}`,
  duration: c.duration,
  source: c.credit,
  series: 'Terra X · 德语科普',
  audioLang: 'de',
  tags: ['站内', '德语原声', '科普'],
  subtitles: c.subtitles,
}));

const seeds: Seed[] = [
  {
    id: 'otti-intro',
    title: { zh: '小獭 Otti 打招呼', de: 'Otti sagt Hallo', en: 'Otti Says Hello' },
    src: `${SITE_MEDIA}/otti-intro-de.mp4`,
    mirrors: [`${JSDELIVR_MEDIA}/otti-intro-de.mp4`],
    duration: 16,
    source: SITE_SOURCE,
    audioLang: 'de',
    tags: ['站内', '德语配音'],
    subtitles: {
      zh: [
        { start: 0.7, end: 3.6, text: '你好！我是小獭 Otti。' },
        { start: 4.4, end: 7.4, text: '每一张卡，都是一整部视频。' },
        { start: 8.1, end: 11.4, text: '抽一张，从头看到尾。' },
        { start: 12.3, end: 15.6, text: '中文在上，德语或英语在下。' },
      ],
      de: [
        { start: 0.7, end: 3.6, text: 'Hallo! Ich bin Otti, der kleine Otter.' },
        { start: 4.4, end: 7.4, text: 'Jede Karte ist ein ganzer Film.' },
        { start: 8.1, end: 11.4, text: 'Zieh eine Karte und schau sie von Anfang bis Ende.' },
        { start: 12.3, end: 15.6, text: 'Chinesisch oben, Deutsch oder Englisch unten.' },
      ],
      en: [
        { start: 0.7, end: 3.6, text: "Hi! I'm Otti, the little otter." },
        { start: 4.4, end: 7.4, text: 'Every card is a whole video.' },
        { start: 8.1, end: 11.4, text: 'Draw one and watch it from start to end.' },
        { start: 12.3, end: 15.6, text: 'Chinese on top, German or English below.' },
      ],
    },
  },
  {
    // Blender 开放电影（CC BY 3.0 © Blender Foundation | mango.blender.org），12 分钟真人科幻短片，英语对白，
    // 官方中文与德语字幕。文件约 60MB，超过 jsDelivr 单文件上限，所以只由网站自己提供。
    id: 'tears-of-steel',
    title: { zh: '钢铁之泪', de: 'Tears of Steel', en: 'Tears of Steel' },
    src: `${SITE_MEDIA}/tears-of-steel.mp4`,
    duration: 734,
    source: SITE_SOURCE,
    series: '开放电影 · Blender',
    audioLang: 'en',
    tags: ['站内', '电影', '英语原声', '官方中德英字幕', 'CC BY'],
    subtitles: TEARS_OF_STEEL_SUBTITLES,
  },
  {
    // Blender 开放电影完整版（CC BY 3.0 © Blender Foundation | peach.blender.org），约 10 分钟，没有对白；
    // Vido 加了简单德语旁白并配中德英字幕。约 48MB，只由网站自己提供。
    id: 'big-buck-bunny',
    title: { zh: '大雄兔', de: 'Big Buck Bunny', en: 'Big Buck Bunny' },
    src: `${SITE_MEDIA}/big-buck-bunny-de.mp4`,
    duration: 596,
    source: SITE_SOURCE,
    series: '开放电影 · Blender',
    audioLang: 'de',
    tags: ['站内', '动画', '德语旁白', 'CC BY'],
    subtitles: BIG_BUCK_BUNNY_SUBTITLES,
  },
  ...TERRA_X,
  ...BILIBILI,
];

export const SEED_VIDEOS: readonly Video[] = seeds.map((s) => ({ ...s, ownerId: null, createdAt: CREATED }));
