import * as repo from './users.repository';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;

export async function createUser(email: string, password: string, name?: string, role?: string) {
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  return repo.createUser({ email, passwordHash: hash, name, isSeedAdmin: false });
}

export const getUser = repo.findById;
export const listUsers = repo.listUsers;
export const updateUser = repo.updateUser;
export const deleteUser = repo.deleteUser;
