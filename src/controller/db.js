const fs = require('fs-extra');
const path = require('path');
const DB_PATH = path.join(__dirname, '..', 'data', 'data.json');

async function readDB() {
  await fs.ensureFile(DB_PATH);
  const raw = await fs.readFile(DB_PATH, 'utf8').catch(() => '{}');
  try {
    return JSON.parse(raw || '{}');
  } catch (e) {
    return { users: [], tags: [], notes: [] };
  }
}

async function writeDB(db) {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}

module.exports = {
  async getAll() {
    const db = await readDB();
    db.users = db.users || [];
    db.tags = db.tags || [];
    db.notes = db.notes || [];
    return db;
  },

  async save(db) {
    await writeDB(db);
    return true;
  },

  // helpers
  async resetSample() {
    const sample = { users: [], tags: [], notes: [] };
    await writeDB(sample);
  }
};
