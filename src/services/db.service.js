
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PATHS = {
  users: join(__dirname, '..', 'db', 'users.json'),
  notes: join(__dirname, '..', 'db', 'notes.json'),
  tags: join(__dirname, '..', 'db', 'tags.json')
};

async function read(path) {
  await fs.ensureFile(path);
  const raw = await fs.readFile(path, 'utf8').catch(() => '[]');
  console.log(raw)
  return JSON.parse(raw || '[]');
}

async function write(path, data) {
  await fs.writeFile(path, JSON.stringify(data, null, 2));
}

export async function getUsers() {
  return read(PATHS.users);
  
}
export async function saveUsers(users) {
  return write(PATHS.users, users);
}

export async function getNotesDB() {
  return read(PATHS.notes);
}
export async function saveNotes(notes) {
  return write(PATHS.notes, notes);
}

export async function getTagsDB() {
  return read(PATHS.tags);
}
export async function saveTags(tags) {
  return write(PATHS.tags, tags);
}

