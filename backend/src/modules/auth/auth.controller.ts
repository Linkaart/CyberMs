import express from 'express';
import { z } from 'zod';
import * as authService from './auth.service';
import prisma from '../../prismaClient';
import { verifyRefreshToken, signAccessToken, signRefreshToken } from './jwt';
import logger from '../../utils/logger';
import crypto from 'crypto';

const router = express.Router();

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8) });

router.post('/login', async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const result = await authService.authenticate(data.email, data.password);
    if (!result) return res.status(401).json({ message: 'Invalid credentials' });
    // set httpOnly refresh token cookie and CSRF cookie
    const refreshToken = result.refreshToken;
    const csrfToken = crypto.randomBytes(16).toString('hex');
    const cookieOptions: any = {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(Date.now() + (parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRES || '7d') ? 7 * 24 * 3600 * 1000 : 7 * 24 * 3600 * 1000)),
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    // csrf cookie accessible to JS (double-submit)
    res.cookie('csrfToken', csrfToken, { sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });

    res.json({ user: { id: result.user.id, email: result.user.email, role: result.user.role }, accessToken: result.accessToken, csrfToken });
  } catch (err) {
    next(err);
  }
});

router.post('/refresh', async (req, res, next) => {
  try {
    // read refresh token from httpOnly cookie
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(400).json({ message: 'Missing refresh token cookie' });

    // CSRF: require header matches csrf cookie (double-submit)
    const csrfHeader = req.headers['x-csrf-token'];
    const csrfCookie = req.cookies?.csrfToken;
    if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
      logger.warn('CSRF token mismatch');
      return res.status(403).json({ message: 'CSRF validation failed' });
    }

    try {
      verifyRefreshToken(token);
    } catch (e) {
      logger.warn('Invalid refresh token presented');
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const stored = await prisma.refreshToken.findUnique({ where: { token } });
    if (!stored || stored.revoked || new Date(stored.expiresAt) <= new Date()) {
      logger.info('Refresh token revoked/expired or not found');
      return res.status(401).json({ message: 'Refresh token revoked or expired' });
    }

    const user = await prisma.user.findUnique({ where: { id: stored.userId } });
    if (!user) return res.status(401).json({ message: 'Invalid token user' });

    // rotation: revoke old and create new refresh token in a transaction
    const newRefresh = signRefreshToken({ userId: user.id });
    const newAccess = signAccessToken({ userId: user.id, role: user.role });

    const defaultMs = 7 * 24 * 3600 * 1000;
    const ms = (() => {
      const envVal = process.env.JWT_REFRESH_TOKEN_EXPIRES;
      if (!envVal) return defaultMs;
      try {
        if (envVal.endsWith('d')) return Number(envVal.slice(0, -1)) * 24 * 3600 * 1000;
        if (envVal.endsWith('h')) return Number(envVal.slice(0, -1)) * 3600 * 1000;
        if (envVal.endsWith('m')) return Number(envVal.slice(0, -1)) * 60 * 1000;
        return Number(envVal);
      } catch {
        return defaultMs;
      }
    })();
    const expiresAt = new Date(Date.now() + ms);

    // Revoke old token first, then attempt to create a new unique refresh token.
    await prisma.refreshToken.update({ where: { token }, data: { revoked: true } });
    let created = null;
    for (let attempt = 0; attempt < 5; attempt++) {
      const candidate = attempt === 0 ? newRefresh : `${newRefresh}-${attempt}`;
      try {
        created = await prisma.refreshToken.create({ data: { token: candidate, userId: user.id, expiresAt } });
        break;
      } catch (e: any) {
        // retry on unique constraint failure
        if (e && e.code === 'P2002') continue;
        throw e;
      }
    }
    if (!created) throw new Error('Failed to create unique refresh token after retries');
    const finalToken = created.token;

    // set new cookie and rotate csrf
    const cookieOptions: any = {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      expires: expiresAt,
    };
    const newCsrf = crypto.randomBytes(16).toString('hex');
    res.cookie('refreshToken', finalToken, cookieOptions);
    res.cookie('csrfToken', newCsrf, { sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });

    logger.info('Refresh token rotated for user %d', user.id);
    res.json({ accessToken: newAccess, csrfToken: newCsrf });
  } catch (err) {
    logger.error('Refresh token flow error: %o', err);
    next(err);
  }
});

router.post('/logout', async (req, res, next) => {
  try {
    // revoke cookie token if present
    const token = req.cookies?.refreshToken;
    if (token) await authService.revokeRefreshToken(token);
    res.clearCookie('refreshToken');
    res.clearCookie('csrfToken');
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
