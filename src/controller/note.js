import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

// Necessário porque __dirname não existe em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const notesPath = path.join(__dirname, '../data/notes.json');
const notes = await fs.readJson(notesPath).catch(() => []); // evita erro se o arquivo não existir



export async function createNote(req, res) {
  const { title, content, tagIds } = req.body;
  const userId = req.user.id;
  if (!title || !content || !Array.isArray(tagIds) || tagIds.length === 0) {
    return res.status(400).json({ message: 'title, content and at least one tagId required' });
  }
  const db = await getAll();
  // verificar se as tags existem e pertencem ao usuario
  for (const tid of tagIds) {
    const t = db.tags.find(x => x.id === tid && x.userId === userId);
    if (!t) return res.status(400).json({ message: `tagId ${tid} not found for this user` });
  }
  const note = {
    id: uuidv4(),
    userId,
    title,
    content,
    tagIds,
    createdAt: new Date().toISOString()
  };
  db.notes.push(note);
  await save(db);
  res.status(201).json(note);
}

async function listNotes(req, res) {
  const userId = req.user.id;
  const db = await getAll();
  const notes = db.notes.filter(n => n.userId === userId);
  res.json(notes);


}

async function getNote(req, res) {
  const { id } = req.params;
  const userId = req.user.id;
  const db = await getAll();
  const note = db.notes.find(n => n.id === id && n.userId === userId);
  if (!note) return res.status(404).json({ message: 'note not found' });
  res.json(note);
}

async function updateNote(req, res) {
  const { id } = req.params;
  const { title, content, tagIds } = req.body;
  const userId = req.user.id;
  const db = await getAll();
  const note = db.notes.find(n => n.id === id && n.userId === userId);
  if (!note) return res.status(404).json({ message: 'note not found' });
  if (title) note.title = title;
  if (content) note.content = content;
  if (tagIds) {
    if (!Array.isArray(tagIds) || tagIds.length === 0) return res.status(400).json({ message: 'tagIds must be non-empty array' });
    for (const tid of tagIds) {
      const t = db.tags.find(x => x.id === tid && x.userId === userId);
      if (!t) return res.status(400).json({ message: `tagId ${tid} not found for this user` });
    }
    note.tagIds = tagIds;
  }
  await save(db);
  res.json(note);
}

async function deleteNote(req, res) {
  const { id } = req.params;
  const userId = req.user.id;
  const db = await getAll();
  const idx = db.notes.findIndex(n => n.id === id && n.userId === userId);
  if (idx === -1) return res.status(404).json({ message: 'note not found' });
  db.notes.splice(idx, 1);
  await save(db);
  res.status(204).send();
}

// search by title, content or tag name (query param q or tag=tagName)
async function searchNotes(req, res) {
  const userId = req.user.id;
  const { q, tag } = req.query;
  const db = await getAll();
  let notes = db.notes.filter(n => n.userId === userId);
  if (q) {
    const ql = q.toLowerCase();
    notes = notes.filter(n => n.title.toLowerCase().includes(ql) || n.content.toLowerCase().includes(ql));
  }
  if (tag) {
    // find tag id(s) for this user with name match
    const tagObjs = db.tags.filter(t => t.userId === userId && t.name.toLowerCase() === tag.toLowerCase());
    if (tagObjs.length === 0) return res.json([]); // no tag -> no notes
    const tagIds = tagObjs.map(t => t.id);
    notes = notes.filter(n => n.tagIds.some(tid => tagIds.includes(tid)));
  }
  res.json(notes);
}

// last 5 recent notes
async function recentNotes(req, res) {
  const userId = req.user.id;
  const db = await getAll();
  const notes = db.notes
    .filter(n => n.userId === userId)
    .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0,5);
  res.json(notes);
}

module.exports = {
  createNote, listNotes, getNote, updateNote, deleteNote, searchNotes, recentNotes
};


const notas = []; // simulando banco de dados

exports.listarNotas = (req, res) => {
  res.json(notas);
};

exports.buscarNota = (req, res) => {
  const id = req.params.id;
  const nota = notas.find(n => n.id === parseInt(id));
  if (!nota) return res.status(404).json({ error: 'Nota não encontrada' });
  res.json(nota);
};

exports.criarNota = (req, res) => {
  const novaNota = { id: notas.length + 1, ...req.body };
  notas.push(novaNota);
  res.status(201).json(novaNota);
};

exports.atualizarNota = (req, res) => {
  const id = parseInt(req.params.id);
  const nota = notas.find(n => n.id === id);
  if (!nota) return res.status(404).json({ error: 'Nota não encontrada' });
  Object.assign(nota, req.body);
  res.json(nota);
};

exports.deletarNota = (req, res) => {
  const id = parseInt(req.params.id);
  const index = notas.findIndex(n => n.id === id);
  if (index === -1) return res.status(404).json({ error: 'Nota não encontrada' });
  notas.splice(index, 1);
  res.json({ message: 'Nota deletada com sucesso!' });
};

