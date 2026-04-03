const fs = require('fs');
const path = require('path');

module.exports = async () => {
  const projectDir = __dirname;
  const marker = path.resolve(projectDir, '.test-db-path');
  try {
    if (fs.existsSync(marker)) {
      const dbFile = fs.readFileSync(marker, 'utf8').trim();
      if (fs.existsSync(dbFile)) {
        fs.unlinkSync(dbFile);
        console.log('Jest globalTeardown: removed test DB', dbFile);
      }
      fs.unlinkSync(marker);
    }
  } catch (e) {
    // best-effort cleanup
    // eslint-disable-next-line no-console
    console.warn('global-teardown cleanup failed', e);
  }
};
