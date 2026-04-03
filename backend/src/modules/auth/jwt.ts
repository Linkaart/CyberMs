import { randomBytes } from 'crypto';
import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const ACCESS_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || 'YOUR_JWT_ACCESS_SECRET_HERE';
const REFRESH_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET || 'YOUR_JWT_REFRESH_SECRET_HERE';

export function signAccessToken(payload: object) {
  return jwt.sign(
    payload as any,
    ACCESS_SECRET as jwt.Secret,
    { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES || '15m' } as jwt.SignOptions
  );
}

export function signRefreshToken(payload: object) {
  const jwtId = randomBytes(16).toString('hex');
  return jwt.sign(
    payload as any,
    REFRESH_SECRET as jwt.Secret,
    { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES || '7d', jwtid: jwtId } as jwt.SignOptions
  );
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_SECRET as jwt.Secret);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET as jwt.Secret);
}
