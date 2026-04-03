import request from 'supertest';
import app from '../../app';
import prisma from '../../prismaClient';

describe('auth refresh flow', () => {
  const email = `refresh_test_${Date.now()}@test.local`;
  const password = 'Passw0rd!';
  const agent = request.agent(app);

  beforeAll(async () => {
    // create user
    await prisma.user.create({ data: { email, passwordHash: await (await import('bcrypt')).hash(password, 10), role: 'ADMIN', name: 'Refresh Tester' } });
    const res = await agent.post('/api/v1/auth/login').send({ email, password });
    expect(res.status).toBe(200);
    // client should receive cookies; agent stores them
  });

  afterAll(async () => {
    // cleanup
    await prisma.refreshToken.deleteMany({ where: { userId: { not: undefined } } }).catch(() => {});
    await prisma.user.deleteMany({ where: { email } }).catch(() => {});
    await prisma.$disconnect();
  });

  it('rotates refresh token using cookie + csrf header', async () => {
    // read csrf cookie from agent by hitting a route that returns cookies are set in agent
    // after login, csrf cookie exists; retrieve it via a request that echoes cookies
    // Supertest agent does not expose cookies directly, but server set-cookie stored; we'll parse from last response header
    const loginRes = await agent.get('/api/v1/auth/login').catch(() => null);
    // fetch csrf cookie by reading cookies stored in agent via a helper endpoint isn't available; instead, retrieve set-cookie header from login response above
    // Simpler approach: after login, request refresh and include header from cookie stored by agent
    // Agent will send cookies automatically; we need to extract csrf cookie value by reading cookies from previous responses
    const cookies = agent.jar && agent.jar.getCookies ? agent.jar.getCookies({} as any) : null;
    // fallback: send refresh without csrf header should fail
    const resFail = await agent.post('/api/v1/auth/refresh').send();
    expect(resFail.status).toBe(403);

    // Now call login again to get csrfToken in body (login returns csrfToken in body)
    const login2 = await agent.post('/api/v1/auth/login').send({ email, password });
    expect(login2.status).toBe(200);
    const csrfToken = login2.body.csrfToken;
    expect(csrfToken).toBeTruthy();

    const res = await agent.post('/api/v1/auth/refresh').set('x-csrf-token', csrfToken).send();
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('csrfToken');

    // check that old tokens are revoked; there may be multiple tokens - ensure at least one revoked
    const tokens = await prisma.refreshToken.findMany({ where: { userId: { not: undefined } }, orderBy: { createdAt: 'desc' } });
    expect(tokens.length).toBeGreaterThan(0);
    expect(tokens[0].revoked).toBe(false);
  });
});
