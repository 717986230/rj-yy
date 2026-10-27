import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createHash, randomBytes } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '@vido/shared';

const TOKEN_TTL = '7d';

export const hashPassword = (pw: string) => bcrypt.hash(pw, 10);
export const verifyPassword = (pw: string, hash: string) => bcrypt.compare(pw, hash);

export function signToken(userId: string, secret: string): string {
  return jwt.sign({ sub: userId }, secret, { expiresIn: TOKEN_TTL });
}

export function newResetToken(): { token: string; hash: string } {
  const token = randomBytes(24).toString('base64url');
  return { token, hash: sha256(token) };
}

export const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

/** 校验 Authorization: Bearer <jwt>，通过后把 userId 挂到 req 上 */
export function requireAuth(secret: string) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const header = req.get('authorization') ?? '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    try {
      const payload = jwt.verify(token, secret);
      if (typeof payload === 'string' || !payload.sub) throw new Error('bad payload');
      req.userId = payload.sub;
      next();
    } catch {
      next(new ApiError('UNAUTHORIZED', '登录已过期，请重新登录'));
    }
  };
}
