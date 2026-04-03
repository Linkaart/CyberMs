import request from 'supertest';
import app from '../../app';
import prisma from '../../prismaClient';

describe('vulnerabilities integration (example)', () => {
  it('creates and retrieves a vulnerability', async () => {
    const res = await request(app).post('/api/v1/vulnerabilities').send({ title: 'Test vuln', description: 'desc' });
    expect(res.status).toBe(201);
    const id = res.body.id;
    const get = await request(app).get(`/api/v1/vulnerabilities/${id}`);
    expect(get.status).toBe(200);
    // cleanup
    await prisma.vulnerability.delete({ where: { id } });
  });
});
