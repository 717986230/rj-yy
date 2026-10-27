import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { ApiError, externalSource, parseSubtitles, toWebVtt, type Video } from '@vido/shared';
import type { Config } from '../config';
import { summarize, videos, type DB } from '../db';
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
});

export function videosRouter(db: DB, config: Config): Router {
  const r = Router();
  r.use(requireAuth(config.jwtSecret));

  const visible = (id: string, userId: string): Video => {
    const v = videos.byId(db, id);
    if (!v || (v.ownerId !== null && v.ownerId !== userId)) throw new ApiError('NOT_FOUND', '视频不存在');
    return v;
  };

  r.get('/', (req, res) => {
    res.json(videos.visibleTo(db, req.userId!).map(summarize));
  });

  r.get('/:id', (req, res) => {
    res.json(visible(req.params.id!, req.userId!));
  });

  /** 单语字幕导出为 WebVTT，可直接用于 <track> */
  r.get('/:id/subtitles/:lang.vtt', (req, res) => {
    const lang = req.params.lang;
    if (lang !== 'zh' && lang !== 'de' && lang !== 'en') throw new ApiError('NOT_FOUND', '仅支持 zh / de / en 字幕');
    const v = visible(req.params.id!, req.userId!);
    res.type('text/vtt; charset=utf-8').send(toWebVtt(v.subtitles[lang]));
  });

  r.post('/', (req, res) => {
    const body = NewVideoBody.parse(req.body);
    const video: Video = {
      id: randomUUID(),
      title: { zh: body.titleZh, de: body.titleDe, en: body.titleEn || body.titleDe },
      src: body.src,
      ...(body.mirrors?.length ? { mirrors: body.mirrors } : {}),
      ...(body.poster ? { poster: body.poster } : {}),
      source: externalSource(body.src)!,
      tags: body.tags ?? ['我的'],
      subtitles: { zh: body.subtitlesZh, de: body.subtitlesDe, en: body.subtitlesEn },
      ownerId: req.userId!,
      createdAt: new Date().toISOString(),
    };
    videos.create(db, video);
    res.status(201).json(video);
  });

  r.delete('/:id', (req, res) => {
    const v = visible(req.params.id!, req.userId!);
    if (v.ownerId !== req.userId) throw new ApiError('FORBIDDEN', '内置视频不能删除');
    videos.remove(db, v.id);
    res.status(204).end();
  });

  return r;
}
