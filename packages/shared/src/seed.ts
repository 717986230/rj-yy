import { bilibiliPageUrl } from './bilibili';
import { alignedTracks, emptyTracks } from './subtitles';
import type { Video } from './types';

/**
 * 内置片库：Otti 开场片（站内）、B 站中德字幕的 DW 德语课与德语动画、大雄兔片段（站内），
 * 以及几条中国大陆网络通常能直接访问的示例外链（火山引擎 CDN、video.js CDN、w3school 中文站）。
 * 外链可带 mirrors 备用链接，播放器会自动切换。外链样片的字幕为演示用的中 / 德 / 英三语示例句。
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
  bili('bili-bluey-de', 'BV1RT411z7xd', { zh: '布鲁伊（德语版）', de: 'Bluey auf Deutsch', en: 'Bluey in German' }, '德语动画', ['动画']),
  bili('bili-peppa-wutz', 'av801477868', { zh: '小猪佩奇（德语版）', de: 'Peppa Wutz', en: 'Peppa Pig in German' }, '德语动画', ['动画']),
  bili('bili-zoomania', 'BV1Zh411S7Tg', { zh: '疯狂动物城（德语版）', de: 'Zoomania', en: 'Zootopia in German' }, '德语电影', ['动画', '电影']),
  bili('bili-kleiner-prinz', 'BV1W4411h7fW', { zh: '小王子 德语广播剧', de: 'Der kleine Prinz – Hörspiel', en: 'The Little Prince – Audio Drama' }, '德语广播剧', []),
];

type Seed = Omit<Video, 'ownerId' | 'createdAt'>;

const seeds: Seed[] = [
  {
    id: 'otti-intro',
    title: { zh: '小獭 Otti 打招呼', de: 'Otti sagt Hallo', en: 'Otti Says Hello' },
    src: `${SITE_MEDIA}/otti-intro-de.mp4`,
    mirrors: [`${JSDELIVR_MEDIA}/otti-intro-de.mp4`],
    duration: 16,
    source: SITE_SOURCE,
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
  ...BILIBILI,
  {
    id: 'bunny-wakeup',
    title: { zh: '大雄兔起床', de: 'Big Buck Bunny wacht auf', en: 'Big Buck Bunny Wakes Up' },
    src: `${SITE_MEDIA}/bunny-wakeup-de.mp4`,
    mirrors: [`${JSDELIVR_MEDIA}/bunny-wakeup-de.mp4`],
    duration: 5.3,
    source: SITE_SOURCE,
    tags: ['站内', '德语配音', 'Blender'],
    subtitles: alignedTracks(
      [
        ['大兔子从洞里钻出来了。', 'Der große Hase kriecht aus seinem Bau.', 'The big rabbit crawls out of his burrow.'],
        ['他伸了个大大的懒腰。', 'Er streckt sich ganz ausgiebig.', 'He has a really big stretch.'],
      ],
      { start: 0.3, length: 2.3, gap: 0.2 },
    ),
  },
  {
    id: 'xgplayer-demo',
    title: { zh: '西瓜播放器示例片', de: 'XGPlayer-Beispielvideo', en: 'XGPlayer Sample' },
    src: 'https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-720p.mp4',
    mirrors: ['https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-360p.mp4'],
    source: 'sf1-cdn-tos.huoshanstatic.com',
    tags: ['国内线路'],
    subtitles: alignedTracks(
      [
        ['准备好了吗？我们开始吧。', 'Bist du bereit? Dann fangen wir an.', "Ready? Let's begin."],
        ['先看看周围有什么。', 'Schau dich erst einmal um.', "First, let's look around."],
        ['这里的光线真好。', 'Das Licht hier ist wirklich schön.', 'The light here is really nice.'],
        ['慢一点，别着急。', 'Langsam, keine Eile.', 'Slow down, no rush.'],
        ['我们就在这儿停一下。', 'Lass uns hier kurz anhalten.', "Let's stop here for a moment."],
      ],
      { start: 1, length: 4, gap: 1 },
    ),
  },
  {
    id: 'oceans',
    title: { zh: '海洋', de: 'Der Ozean', en: 'Oceans' },
    src: 'https://vjs.zencdn.net/v/oceans.mp4',
    source: 'vjs.zencdn.net',
    tags: ['国内线路', '自然'],
    subtitles: alignedTracks(
      [
        ['海浪一次又一次拍向岸边。', 'Die Wellen schlagen immer wieder ans Ufer.', 'The waves hit the shore again and again.'],
        ['海水下面是另一个世界。', 'Unter dem Wasser liegt eine andere Welt.', 'Beneath the water lies another world.'],
        ['鱼群在珊瑚之间穿行。', 'Fischschwärme ziehen zwischen den Korallen hindurch.', 'Schools of fish move between the corals.'],
        ['阳光照进很深的地方。', 'Das Sonnenlicht reicht bis in die Tiefe.', 'Sunlight reaches deep down.'],
        ['大海从来不会安静下来。', 'Das Meer wird nie ganz still.', 'The sea is never completely quiet.'],
      ],
      { start: 1.5, length: 5, gap: 2 },
    ),
  },
  {
    id: 'bear',
    title: { zh: '河边的熊', de: 'Der Bär am Fluss', en: 'Bear by the River' },
    src: 'https://www.w3school.com.cn/i/movie.mp4',
    mirrors: ['https://www.w3schools.com/html/movie.mp4'],
    source: 'www.w3school.com.cn',
    tags: ['国内线路', '自然'],
    subtitles: alignedTracks(
      [
        ['一只熊慢慢走过来。', 'Ein Bär kommt langsam näher.', 'A bear slowly walks closer.'],
        ['它在找吃的东西。', 'Er sucht etwas zu fressen.', "It's looking for something to eat."],
      ],
      { start: 0.5, length: 4, gap: 0.8 },
    ),
  },
  {
    id: 'bunny-short',
    title: { zh: '大雄兔片段', de: 'Big Buck Bunny – Ausschnitt', en: 'Big Buck Bunny Clip' },
    src: 'https://www.w3school.com.cn/example/html5/mov_bbb.mp4',
    mirrors: ['https://www.w3schools.com/html/mov_bbb.mp4'],
    source: 'www.w3school.com.cn',
    tags: ['国内线路', 'Blender'],
    subtitles: alignedTracks(
      [
        ['一只大兔子从洞里走了出来。', 'Ein großer Hase kommt aus seinem Bau.', 'A big rabbit comes out of his burrow.'],
        ['他伸了个懒腰，看看天空。', 'Er streckt sich und schaut in den Himmel.', 'He stretches and looks at the sky.'],
      ],
      { start: 0.5, length: 4, gap: 0.6 },
    ),
  },
];

export const SEED_VIDEOS: readonly Video[] = seeds.map((s) => ({ ...s, ownerId: null, createdAt: CREATED }));
