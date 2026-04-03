import prisma from '../../prismaClient';

export const createLog = (data: any) => prisma.auditLog.create({ data });

export const listLogs = (skip = 0, take = 50) => prisma.auditLog.findMany({ skip, take, orderBy: { createdAt: 'desc' } });
