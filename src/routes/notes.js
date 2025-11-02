
import express from 'express';
import fs from 'fs-extra';
import { v4 as uuidv4 } from 'uuid';

const noteRoutes = express.Router();


const dbPath = './src/db/notes.json';

// Garante que o arquivo exista
fs.ensureFileSync(dbPath);
if (!fs.existsSync(dbPath)) fs.writeJSONSync(dbPath, []);

// Listar todas as notas
noteRoutes.get('/', async (req, res) => {
  const notes = await fs.readJSON(dbPath);
  res.json(notes);
});

// Criar uma nova nota
noteRoutes.post('/', async (req, res) => {
  const { userId, title, content, tags } = req.body;

  if (!userId || !title || !content || !tags || tags.length === 0) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando' });
  }

  const notes = await fs.readJSON(dbPath);
  const newNote = {
    id: uuidv4(),
    userId,
    title,
    content,
    tags,
    createdAt: new Date().toISOString(),
  };

  notes.push(newNote);
  await fs.writeJSON(dbPath, notes, { spaces: 2 });
  res.status(201).json(newNote);
});

// Buscar notas por tag ou título
noteRoutes.get('/search', async (req, res) => {
  const { q } = req.query;
  const notes = await fs.readJSON(dbPath);
  const filtered = notes.filter(
    n =>
      n.title.toLowerCase().includes(q.toLowerCase()) ||
      n.tags.some(tag => tag.toLowerCase().includes(q.toLowerCase()))
  );
  res.json(filtered);
});

// Listar últimas 5 notas
noteRoutes.get('/recent', async (req, res) => {
  const notes = await fs.readJSON(dbPath);
  const recent = notes.slice(-5);
  res.json(recent);
});

export default noteRoutes 

