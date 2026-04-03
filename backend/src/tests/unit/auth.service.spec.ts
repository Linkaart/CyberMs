import { describe, it, expect, beforeAll } from '@jest/globals';
import * as authService from '../../modules/auth/auth.service';
import prisma from '../../prismaClient';

describe('auth.service unit (example)', () => {
  it('register and authenticate flow (integration style)', async () => {
    const email = `t${Date.now()}@test.local`;
    const password = 'Password123!';
    const user = await authService.registerUser(email, password, 'test');
    expect(user.email).toBe(email);
    const auth = await authService.authenticate(email, password);
    expect(auth).toHaveProperty('accessToken');
    // cleanup - remove any refresh tokens first to avoid FK constraint
    await prisma.refreshToken.deleteMany({ where: { userId: user.id } }).catch(() => {});
    await prisma.user.delete({ where: { id: user.id } });
  });
});
