import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '@vido/shared';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({ code: 'BAD_REQUEST', message: err.issues[0]?.message ?? '请求参数有误' });
    return;
  }
  if (err instanceof ApiError) {
    res.status(err.status).json({ code: err.code, message: err.message });
    return;
  }
  if (err?.type === 'entity.parse.failed') {
    res.status(400).json({ code: 'BAD_REQUEST', message: '请求体不是有效的 JSON' });
    return;
  }
  console.error(err);
  res.status(500).json({ code: 'INTERNAL', message: '服务器出错了，请稍后再试' });
};
