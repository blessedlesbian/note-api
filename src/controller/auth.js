import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import * as dbService from '../services/db.service.js';

// Necessário para usar __dirname em módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const notesPath = path.join(__dirname, '../data/notes.json');
const notes = await fs.readJson(notesPath).catch(() => []);

// Função de login simples
export async function login(req, res) {
  const { email, password } = req.body;
  const db = await dbService.readDB();

  const user = db.users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Usuário ou senha incorretos' });
  }

  // “Token” falso — só o ID do usuário (prova de conceito)
  res.status(200).json({ message: 'Login bem-sucedido', token: user.id });
}

