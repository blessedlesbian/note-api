import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

// recria __dirname (não existe em módulos ES)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const notesPath = path.join(__dirname, '../data/notes.json');

// o await agora funciona no topo
const notes = await fs.readJson(notesPath).catch(() => []);


export async function createTag(req, res) {
  const { name } = req.body;
  const userId = req.user.id;
  if (!name) return res.status(400).json({ message: 'name required' });
  const db = await getAll();
  // evita duplicate name para mesmo usuário
  if (db.tags.find(t => t.userId === userId && t.name === name)) {
    return res.status(409).json({ message: 'tag already exists' });
  }
  const tag = { id: uuidv4(), name, userId };
  db.tags.push(tag);
  await save(db);
  return res.status(201).json(tag);
}

export async function listTags(req, res) {
  const userId = req.user.id;
  const db = await getAll();
  const tags = db.tags.filter(t => t.userId === userId);
  res.json(tags);
}

export async function updateTag(req, res) {
  const { id } = req.params;
  const { name } = req.body;
  const userId = req.user.id;
  if (!name) return res.status(400).json({ message: 'name required' });
  const db = await getAll();
  const tag = db.tags.find(t => t.id === id && t.userId === userId);
  if (!tag) return res.status(404).json({ message: 'tag not found' });
  tag.name = name;
  await save(db);
  res.json(tag);
}

export async function deleteTag(req, res) {
  const { id } = req.params;
  const userId = req.user.id;
  const db = await getAll();
  const idx = db.tags.findIndex(t => t.id === id && t.userId === userId);
  if (idx === -1) return res.status(404).json({ message: 'tag not found' });
  // Antes de remover, remover referência nas notas (ou impedir se existir nota?)
  // Vamos impedir exclusão se houver notas usando a tag
  const tagId = id;
  const used = db.notes.find(n => n.userId === userId && n.tagIds.includes(tagId));
  if (used) return res.status(400).json({ message: 'tag in use by notes; remove or update notes first' });
  db.tags.splice(idx, 1);
  await save(db);
  res.status(204).send();
}



