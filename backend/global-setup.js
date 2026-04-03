const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = async () => {
  const projectDir = __dirname; // backend folder
  const dbFile = path.resolve(projectDir, 'dev-test.db');
  const dbUrl = `file:${dbFile}`;

  // Persist path for teardown
  const marker = path.resolve(projectDir, '.test-db-path');
  fs.writeFileSync(marker, dbFile, 'utf8');

  console.log('Jest globalSetup: creating test sqlite DB at', dbFile);

  // Run prisma db push with DATABASE_URL set so sqlite file is created with test schema
  execSync('npx prisma db push --schema=prisma/schema.test.prisma', { stdio: 'inherit', env: { ...process.env, DATABASE_URL: dbUrl } });

  // Export DATABASE_URL to environment for worker processes (Jest spawns after setup)
  process.env.DATABASE_URL = dbUrl;
};
