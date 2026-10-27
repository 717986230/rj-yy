import cors from 'cors';
import express from 'express';
import { ApiError } from '@vido/shared';
import type { Config } from './config';
import type { DB } from './db';
import { errorHandler } from './lib/errors';
import { authRouter } from './routes/auth';
import { videosRouter } from './routes/videos';

export function createApp(db: DB, config: Config) {
  const app = express();
  app.disable('x-powered-by');
  app.use(cors({ origin: config.corsOrigins }));
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });
  app.use('/api/auth', authRouter(db, config));
  app.use('/api/videos', videosRouter(db, config));

  app.use((_req, _res, next) => next(new ApiError('NOT_FOUND', '接口不存在')));
  app.use(errorHandler);
  return app;
}
