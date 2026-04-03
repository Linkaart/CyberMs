import prisma from '../../prismaClient';
import bcrypt from 'bcrypt';
import { signAccessToken, signRefreshToken } from './jwt';

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;

function parseExpiry(envVal: string | undefined, defaultMs: number) {
  if (!envVal) return defaultMs;
  try {
    if (envVal.endsWith('d')) return Number(envVal.slice(0, -1)) * 24 * 3600 * 1000;
    if (envVal.endsWith('h')) return Number(envVal.slice(0, -1)) * 3600 * 1000;
    if (envVal.endsWith('m')) return Number(envVal.slice(0, -1)) * 60 * 1000;
    return Number(envVal);
  } catch {
    return defaultMs;
  }
}

async function persistRefreshToken(token: string, userId: number) {
  const defaultMs = 7 * 24 * 3600 * 1000;
  const ms = parseExpiry(process.env.JWT_REFRESH_TOKEN_EXPIRES, defaultMs);
  const expiresAt = new Date(Date.now() + ms);
  return prisma.refreshToken.create({ data: { token, userId, expiresAt } });
}

export async function registerUser(email: string, password: string, name?: string) {
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({ data: { email, passwordHash: hash, name } });
  return user;
}

export async function authenticate(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;

  const accessToken = signAccessToken({ userId: user.id, role: user.role });
  const refreshToken = signRefreshToken({ userId: user.id });

  // Persist refresh token for rotation/revocation
  await persistRefreshToken(refreshToken, user.id);

  return { user, accessToken, refreshToken };
}

export async function revokeRefreshToken(token: string) {
  await prisma.refreshToken.updateMany({ where: { token }, data: { revoked: true } });
}

export async function issueTokensForUser(userId: number, role?: string) {
  const accessToken = signAccessToken({ userId, role });
  const refreshToken = signRefreshToken({ userId });
  await persistRefreshToken(refreshToken, userId);
  return { accessToken, refreshToken };
}
