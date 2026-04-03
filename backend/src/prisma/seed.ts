import dotenv from 'dotenv';
dotenv.config();
import prisma from '../prismaClient';
import bcrypt from 'bcrypt';

async function main() {
  const pw = process.env.SEED_ADMIN_PASSWORD || 'Admin123!';
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;
  const hash = await bcrypt.hash(pw, saltRounds);
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@vulntrack.local';
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    await prisma.user.create({
      data: { email: adminEmail, passwordHash: hash, role: 'ADMIN', name: 'Seed Admin', isSeedAdmin: true },
    });
    // eslint-disable-next-line no-console
    console.log('Seeded admin:', adminEmail);
  } else {
    // eslint-disable-next-line no-console
    console.log('Admin already exists');
  }
}

main()
  .catch(e => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
