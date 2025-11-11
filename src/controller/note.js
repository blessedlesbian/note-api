import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { getNotesDB, getTagsDB, saveNotes } from '../services/db.service.js';



// Necessário porque __dirname não existe em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const notesPath = path.join(__dirname, '../db/notes.json');
const notes = await fs.readJson(notesPath).catch(() => []); // evita erro se o arquivo não existir



export async function createNote(req, res) {
  const { title, content, tagIds } = req.body;
  const userId = req.user.id;
  if (!title || !content || !Array.isArray(tagIds) || tagIds.length === 0) {
    return res.status(400).json({ message: 'title, content and at least one tagId required' });
  }
  const db = await getNotesDB();
  // verificar se as tags existem e pertencem ao usuario
  for (const tid of tagIds) {
    const tags = await getTagsDB(); 
    console.log (userId, tags, tid)
    const t = tags.find(x => x.id === tid && x.userId === userId);
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
  db.push(note);
  await saveNotes(db);
  res.status(201).json(note);
}

export async function listNotes(req, res) {
  const userId = req.user.id;
  const db = await getNotesDB();
  const notes = db.filter(n => n.userId === userId);
  res.json(notes);


}

export async function getNotes(req, res) {
  const { id } = req.params;
  const userId = req.user.id;
  const db = await getNotesDB();
  const note = db.find(n => n.id === id && n.userId === userId);
  if (!note) return res.status(404).json({ message: 'note not found' });
  res.json(note);
}

export async function updateNote(req, res) {
  const { id } = req.params;
  const { title, content, tagIds } = req.body;
  const userId = req.user.id;
  const db = await getNotesDB();
  const note = db.find(n => n.id === id && n.userId === userId);
  if (!note) return res.status(404).json({ message: 'note not found' });
  if (title) note.title = title;
  if (content) note.content = content;
  if (tagIds) {
    if (!Array.isArray(tagIds) || tagIds.length === 0) return res.status(400).json({ message: 'tagIds must be non-empty array' });
    for (const tid of tagIds) { 
       const tags = await getTagsDB(); 
       const t = tags.find(x => x.id === tid && x.userId === userId);
      if (!t) return res.status(400).json({ message: `tagId ${tid} not found for this user` });
    }
    note.tagIds = tagIds;
  }
  await saveNotes(db);
  res.json(note);
}

export async function deleteNote(req, res) {
  const { id } = req.params;
  const userId = req.user.id;
  const db = await getNotesDB();
  const idx = db.findIndex(n => n.id === id && n.userId === userId);
  if (idx === -1) return res.status(404).json({ message: 'note not found' });
  db.splice(idx, 1);
  await saveNotes(db);
  res.status(204).send();
}

// search by title, content or tag name (query param q or tag=tagName)
export async function searchNotes(req, res) {
  const userId = req.user.id;
  const { q, tag } = req.query;
  const db = await getNotesDB();
  let notes = db.filter(n => n.userId === userId);
  if (q) {
    const ql = q.toLowerCase();
    notes = notes.filter(n => n.title.toLowerCase().includes(ql) || n.content.toLowerCase().includes(ql));
  }
  if (tag) {
    const tags = await getTagsDB(); 
    const tagObjs = tags.filter(t => t.userId === userId && t.name.toLowerCase() === tag.toLowerCase());
    if (tagObjs.length === 0) return res.json([]); // no tag -> no notes
    const tagIds = tagObjs.map(t => t.id);
    notes = notes.filter(n => n.tagIds.some(tid => tagIds.includes(tid)));
  }
  res.json(notes);
}

// last 5 recent notes
export async function recentNotes(req, res) {
  const userId = req.user.id;
  const db = await getNotesDB();
  const notes = db
    .filter(n => n.userId === userId)
    .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0,5);
  res.json(notes);
}

