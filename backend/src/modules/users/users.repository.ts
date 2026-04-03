import prisma from '../../prismaClient';

export const createUser = (data: { email: string; passwordHash: string; name?: string; isSeedAdmin?: boolean }) =>
  prisma.user.create({ data });

export const findByEmail = (email: string) => prisma.user.findUnique({ where: { email } });

export const findById = (id: number) => prisma.user.findUnique({ where: { id } });

export const listUsers = (skip = 0, take = 20) => prisma.user.findMany({ skip, take });

export const updateUser = (id: number, data: any) => prisma.user.update({ where: { id }, data });

export const deleteUser = (id: number) => prisma.user.delete({ where: { id } });
