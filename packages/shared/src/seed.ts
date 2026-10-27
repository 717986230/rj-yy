import { alignedTracks } from './subtitles';
import type { Video } from './types';

/**
 * 内置示例片库。视频全部是第三方站点的公开外链（Google 示例视频桶、MDN CC0 素材、
 * Blender 开放电影），应用不存放任何视频文件。字幕为演示用的中 / 德 / 英三语示例。
 */
const GV = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample';
const GV_HOST = 'commondatastorage.googleapis.com';
const CREATED = '2026-10-27T00:00:00.000Z';

type Seed = Omit<Video, 'ownerId' | 'createdAt'>;

const seeds: Seed[] = [
  {
    id: 'flower',
    title: { zh: '清晨花开', de: 'Die Blüte am Morgen', en: 'Morning Bloom' },
    src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    duration: 5,
    source: 'interactive-examples.mdn.mozilla.net',
    tags: ['自然', 'CC0'],
    subtitles: alignedTracks(
      [
        ['一朵花在清晨慢慢打开。', 'Eine Blume öffnet sich langsam am Morgen.', 'A flower slowly opens in the morning.'],
        ['花瓣一片接着一片舒展。', 'Ein Blütenblatt nach dem anderen entfaltet sich.', 'One petal after another unfolds.'],
      ],
      { start: 0.2, length: 2.2, gap: 0.2 },
    ),
  },
  {
    id: 'blazes',
    title: { zh: '火光与远方', de: 'Flammen und Ferne', en: 'Fire and Faraway' },
    src: `${GV}/ForBiggerBlazes.mp4`,
    poster: `${GV}/images/ForBiggerBlazes.jpg`,
    duration: 15,
    source: GV_HOST,
    tags: ['短片'],
    subtitles: alignedTracks([
      ['火堆旁，大家都安静下来。', 'Am Feuer werden alle still.', 'By the fire, everyone goes quiet.'],
      ['今晚的天空特别亮。', 'Der Himmel ist heute Nacht besonders hell.', 'The sky is especially bright tonight.'],
      ['我们明天再出发吧。', 'Lass uns morgen weiterfahren.', 'Let\'s set off again tomorrow.'],
    ]),
  },
  {
    id: 'escapes',
    title: { zh: '一次出逃', de: 'Die kleine Flucht', en: 'The Little Escape' },
    src: `${GV}/ForBiggerEscapes.mp4`,
    poster: `${GV}/images/ForBiggerEscapes.jpg`,
    duration: 15,
    source: GV_HOST,
    tags: ['短片'],
    subtitles: alignedTracks([
      ['我们得离开这里，马上。', 'Wir müssen hier weg, sofort.', 'We have to get out of here, now.'],
      ['你确定这条路是对的吗？', 'Bist du sicher, dass das der richtige Weg ist?', 'Are you sure this is the right way?'],
      ['相信我，跟着我走。', 'Vertrau mir und folg mir.', 'Trust me and follow me.'],
    ]),
  },
  {
    id: 'fun',
    title: { zh: '好玩的一分钟', de: 'Eine Minute Spaß', en: 'One Minute of Fun' },
    src: `${GV}/ForBiggerFun.mp4`,
    poster: `${GV}/images/ForBiggerFun.jpg`,
    duration: 60,
    source: GV_HOST,
    tags: ['短片'],
    subtitles: alignedTracks(
      [
        ['这是今天最开心的时刻。', 'Das ist der schönste Moment des Tages.', 'This is the best moment of the day.'],
        ['再来一次！', 'Noch einmal!', 'One more time!'],
        ['你笑得真大声。', 'Du lachst ja richtig laut.', 'You\'re laughing so loudly.'],
        ['小心，别摔倒了。', 'Vorsicht, fall nicht hin.', 'Careful, don\'t fall.'],
        ['我们拍一张合照吧。', 'Lass uns ein Gruppenfoto machen.', 'Let\'s take a group photo.'],
        ['大家看镜头，一、二、三！', 'Alle in die Kamera schauen – eins, zwei, drei!', 'Everyone look at the camera: one, two, three!'],
        ['这张照片我要好好保存。', 'Dieses Foto hebe ich gut auf.', 'I\'m going to keep this photo safe.'],
        ['天快黑了，该回家了。', 'Es wird dunkel, wir sollten nach Hause gehen.', 'It\'s getting dark, time to go home.'],
        ['我们下周还来这里。', 'Nächste Woche kommen wir wieder hierher.', 'We\'ll come back here next week.'],
      ],
      { start: 2, length: 5, gap: 1.2 },
    ),
  },
  {
    id: 'joyrides',
    title: { zh: '兜风', de: 'Spritztour', en: 'Joyride' },
    src: `${GV}/ForBiggerJoyrides.mp4`,
    poster: `${GV}/images/ForBiggerJoyrides.jpg`,
    duration: 15,
    source: GV_HOST,
    tags: ['短片'],
    subtitles: alignedTracks([
      ['系好安全带，我们出发了。', 'Schnall dich an, wir fahren los.', 'Buckle up, we\'re off.'],
      ['把音乐开大一点。', 'Mach die Musik etwas lauter.', 'Turn the music up a bit.'],
      ['前面右转就到了。', 'Vorne rechts, dann sind wir da.', 'Turn right up ahead and we\'re there.'],
    ]),
  },
  {
    id: 'meltdowns',
    title: { zh: '崩溃时刻', de: 'Der Zusammenbruch', en: 'Meltdown' },
    src: `${GV}/ForBiggerMeltdowns.mp4`,
    poster: `${GV}/images/ForBiggerMeltdowns.jpg`,
    duration: 15,
    source: GV_HOST,
    tags: ['短片'],
    subtitles: alignedTracks([
      ['不，不，不……全乱了。', 'Nein, nein, nein … alles ist durcheinander.', 'No, no, no… it\'s all a mess.'],
      ['深呼吸，没事的。', 'Atme tief durch, alles wird gut.', 'Take a deep breath, it\'ll be fine.'],
      ['我们从头再来。', 'Wir fangen noch einmal von vorne an.', 'Let\'s start over from the beginning.'],
    ]),
  },
  {
    id: 'big-buck-bunny',
    title: { zh: '大雄兔', de: 'Big Buck Bunny', en: 'Big Buck Bunny' },
    src: `${GV}/BigBuckBunny.mp4`,
    poster: `${GV}/images/BigBuckBunny.jpg`,
    duration: 596,
    source: GV_HOST,
    tags: ['开放电影', 'Blender'],
    subtitles: alignedTracks(
      [
        ['森林里的早晨很安静。', 'Der Morgen im Wald ist ganz ruhig.', 'The morning in the forest is very quiet.'],
        ['小鸟在树枝上醒来。', 'Ein kleiner Vogel wacht auf dem Ast auf.', 'A little bird wakes up on a branch.'],
        ['一只大兔子从洞里走了出来。', 'Ein großer Hase kommt aus seinem Bau.', 'A big rabbit comes out of his burrow.'],
        ['他伸了个懒腰，看看天空。', 'Er streckt sich und schaut in den Himmel.', 'He stretches and looks at the sky.'],
        ['他闻了闻花，笑了。', 'Er riecht an einer Blume und lächelt.', 'He sniffs a flower and smiles.'],
        ['一只蝴蝶落在他的鼻子上。', 'Ein Schmetterling landet auf seiner Nase.', 'A butterfly lands on his nose.'],
        ['可是，有人在树上看着他。', 'Aber jemand beobachtet ihn vom Baum aus.', 'But someone is watching him from the tree.'],
      ],
      { start: 1.5, length: 5, gap: 2 },
    ),
  },
  {
    id: 'elephants-dream',
    title: { zh: '大象之梦', de: 'Elefantentraum', en: 'Elephants Dream' },
    src: `${GV}/ElephantsDream.mp4`,
    poster: `${GV}/images/ElephantsDream.jpg`,
    duration: 653,
    source: GV_HOST,
    tags: ['开放电影', 'Blender'],
    subtitles: alignedTracks(
      [
        ['跟紧我，别乱碰东西。', 'Bleib dicht bei mir und fass nichts an.', 'Stay close to me and don\'t touch anything.'],
        ['这里的每一扇门都通向别处。', 'Jede Tür hier führt woandershin.', 'Every door here leads somewhere else.'],
        ['这台机器在呼吸。', 'Diese Maschine atmet.', 'This machine is breathing.'],
        ['你听见了吗？', 'Hörst du das?', 'Do you hear that?'],
        ['你看到的不一定是真的。', 'Was du siehst, ist nicht unbedingt echt.', 'What you see isn\'t necessarily real.'],
      ],
      { start: 1.5, length: 5, gap: 2 },
    ),
  },
  {
    id: 'sintel',
    title: { zh: '辛特尔', de: 'Sintel', en: 'Sintel' },
    src: `${GV}/Sintel.mp4`,
    poster: `${GV}/images/Sintel.jpg`,
    duration: 888,
    source: GV_HOST,
    tags: ['开放电影', 'Blender'],
    subtitles: alignedTracks(
      [
        ['雪下了整整三天。', 'Es schneit seit drei Tagen.', 'It has been snowing for three days.'],
        ['我在找一条小龙。', 'Ich suche einen kleinen Drachen.', 'I\'m looking for a little dragon.'],
        ['它叫什么名字？', 'Wie heißt er?', 'What\'s his name?'],
        ['我叫它"鳞片"。', 'Ich nenne ihn „Schuppe".', 'I call him "Scales".'],
        ['不管多远，我都会找到它。', 'Egal wie weit, ich werde ihn finden.', 'No matter how far, I will find him.'],
      ],
      { start: 1.5, length: 5, gap: 2 },
    ),
  },
  {
    id: 'tears-of-steel',
    title: { zh: '钢之泪', de: 'Tränen aus Stahl', en: 'Tears of Steel' },
    src: `${GV}/TearsOfSteel.mp4`,
    poster: `${GV}/images/TearsOfSteel.jpg`,
    duration: 734,
    source: GV_HOST,
    tags: ['开放电影', 'Blender'],
    subtitles: alignedTracks(
      [
        ['我们只有一次机会。', 'Wir haben nur eine Chance.', 'We only have one chance.'],
        ['你还记得我们为什么分开吗？', 'Weißt du noch, warum wir uns getrennt haben?', 'Do you remember why we broke up?'],
        ['因为你说我只是个机器人。', 'Weil du gesagt hast, ich sei nur ein Roboter.', 'Because you said I was just a robot.'],
        ['对不起，我错了。', 'Es tut mir leid, ich lag falsch.', 'I am sorry, I was wrong.'],
      ],
      { start: 1.5, length: 5, gap: 2 },
    ),
  },
];

export const SEED_VIDEOS: readonly Video[] = seeds.map((s) => ({ ...s, ownerId: null, createdAt: CREATED }));
