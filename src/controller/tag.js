const { v4: uuidv4 } = require('uuid');
const dbService = require('../services/db.service');

async function createTag(req, res) {
  const { name } = req.body;
  const userId = req.user.id;
  if (!name) return res.status(400).json({ message: 'name required' });
  const db = await dbService.getAll();
  // evita duplicate name para mesmo usuário
  if (db.tags.find(t => t.userId === userId && t.name === name)) {
    return res.status(409).json({ message: 'tag already exists' });
  }
  const tag = { id: uuidv4(), name, userId };
  db.tags.push(tag);
  await dbService.save(db);
  return res.status(201).json(tag);
}

async function listTags(req, res) {
  const userId = req.user.id;
  const db = await dbService.getAll();
  const tags = db.tags.filter(t => t.userId === userId);
  res.json(tags);
}

async function updateTag(req, res) {
  const { id } = req.params;
  const { name } = req.body;
  const userId = req.user.id;
  if (!name) return res.status(400).json({ message: 'name required' });
  const db = await dbService.getAll();
  const tag = db.tags.find(t => t.id === id && t.userId === userId);
  if (!tag) return res.status(404).json({ message: 'tag not found' });
  tag.name = name;
  await dbService.save(db);
  res.json(tag);
}

async function deleteTag(req, res) {
  const { id } = req.params;
  const userId = req.user.id;
  const db = await dbService.getAll();
  const idx = db.tags.findIndex(t => t.id === id && t.userId === userId);
  if (idx === -1) return res.status(404).json({ message: 'tag not found' });
  // Antes de remover, remover referência nas notas (ou impedir se existir nota?)
  // Vamos impedir exclusão se houver notas usando a tag
  const tagId = id;
  const used = db.notes.find(n => n.userId === userId && n.tagIds.includes(tagId));
  if (used) return res.status(400).json({ message: 'tag in use by notes; remove or update notes first' });
  db.tags.splice(idx, 1);
  await dbService.save(db);
  res.status(204).send();
}

module.exports = { createTag, listTags, updateTag, deleteTag };
