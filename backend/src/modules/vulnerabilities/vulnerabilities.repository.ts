import prisma from '../../prismaClient';

export const createVuln = (data: any) => prisma.vulnerability.create({ data });

export const findById = (id: string) => prisma.vulnerability.findUnique({ where: { id } });

export const list = (skip = 0, take = 20, filters: any = {}) => {
  const where: any = { isDeleted: false };
  if (filters.severity) where.severity = filters.severity;
  if (filters.status) where.status = filters.status;
  if (filters.application) where.application = { contains: filters.application };
  return prisma.vulnerability.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } });
};

export const updateVuln = (id: string, data: any) => prisma.vulnerability.update({ where: { id }, data });

export const softDelete = (id: string) => prisma.vulnerability.update({ where: { id }, data: { isDeleted: true } });
