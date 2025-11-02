import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

// Corrige __dirname para ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

export async function getAll() {
  const db = await readDB();
  db.users = db.users || [];
  db.tags = db.tags || [];
  db.notes = db.notes || [];
  return db;
}

export async function save(db) {
  await writeDB(db);
  return true;
}

export async function resetSample() {
  const sample = { users: [], tags: [], notes: [] };
  await writeDB(sample);
}
