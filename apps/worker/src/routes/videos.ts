import { Hono } from 'hono';
import { z } from 'zod';
import { ApiError, SEED_VIDEOS, externalSource, parseSubtitles, toWebVtt, type Video } from '@vido/shared';
import type { AppEnv } from '../env';
import { summarize, videos } from '../db';
import { requireAuth } from '../lib/auth';

const externalUrl = (label: string) =>
  z
    .string({ required_error: `请填写${label}` })
    .trim()
    .refine((v) => externalSource(v) !== null, `${label}必须是 http(s) 外部链接`);

const subtitleText = z
  .string()
  .max(500_000, '字幕文件太大')
  .optional()
  .transform((text, ctx) => {
    if (!text?.trim()) return [];
    try {
      const cues = parseSubtitles(text);
      if (!cues.length) ctx.addIssue({ code: z.ZodIssueCode.custom, message: '没有读到字幕内容，请检查 VTT / SRT 格式' });
      return cues;
    } catch (e) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: (e as Error).message });
      return z.NEVER;
    }
  });

const NewVideoBody = z.object({
  titleZh: z.string({ required_error: '请填写中文标题' }).trim().min(1, '请填写中文标题').max(80),
  titleDe: z.string({ required_error: '请填写德语标题' }).trim().min(1, '请填写德语标题').max(80),
  titleEn: z.string().trim().max(80).optional(),
  src: externalUrl('视频链接'),
  mirrors: z.array(externalUrl('备用链接')).max(5, '备用链接最多 5 条').optional(),
  poster: externalUrl('封面链接').optional(),
  subtitlesZh: subtitleText,
  subtitlesDe: subtitleText,
  subtitlesEn: subtitleText,
  tags: z.array(z.string().trim().max(20)).max(8).optional(),
  series: z.string().trim().max(60).optional(),
  episode: z.number().int().min(1).max(9999).optional(),
  audioLang: z.enum(['de', 'en']).optional(),
});

export const videoRoutes = new Hono<AppEnv>();
videoRoutes.use(requireAuth);

async function visible(db: D1Database, id: string, userId: string): Promise<Video> {
  const v = await videos.visible(db, id, userId);
  if (!v) throw new ApiError('NOT_FOUND', '视频不存在');
  return v;
}

videoRoutes.get('/', async (c) => c.json((await videos.visibleTo(c.env.DB, c.get('userId'))).map(summarize)));

/** 单语字幕导出为 WebVTT，可直接用于 <track> */
videoRoutes.get('/:id/subtitles/:file{(zh|de|en)\\.vtt}', async (c) => {
  const lang = c.req.param('file').slice(0, 2) as 'zh' | 'de' | 'en';
  const v = await visible(c.env.DB, c.req.param('id'), c.get('userId'));
  return c.body(toWebVtt(v.subtitles[lang]), 200, { 'Content-Type': 'text/vtt; charset=utf-8' });
});

videoRoutes.get('/:id', async (c) => c.json(await visible(c.env.DB, c.req.param('id'), c.get('userId'))));

videoRoutes.post('/', async (c) => {
  const body = NewVideoBody.parse(await c.req.json());
  const userId = c.get('userId');
  const video = {
    id: crypto.randomUUID(),
    title: { zh: body.titleZh, de: body.titleDe, en: body.titleEn || body.titleDe },
    src: body.src,
    ...(body.mirrors?.length ? { mirrors: body.mirrors } : {}),
    ...(body.poster ? { poster: body.poster } : {}),
    source: externalSource(body.src)!,
    ...(body.series ? { series: body.series } : {}),
    ...(body.episode ? { episode: body.episode } : {}),
    ...(body.audioLang ? { audioLang: body.audioLang } : {}),
    tags: body.tags ?? ['我的'],
    subtitles: { zh: body.subtitlesZh, de: body.subtitlesDe, en: body.subtitlesEn },
    ownerId: userId,
    createdAt: new Date().toISOString(),
  } satisfies Video;
  await videos.create(c.env.DB, video);
  return c.json(video, 201);
});

videoRoutes.delete('/:id', async (c) => {
  const id = c.req.param('id');
  if (SEED_VIDEOS.some((v) => v.id === id)) throw new ApiError('FORBIDDEN', '内置视频不能删除');
  const v = await visible(c.env.DB, id, c.get('userId'));
  await videos.remove(c.env.DB, v.id);
  return c.body(null, 204);
});
