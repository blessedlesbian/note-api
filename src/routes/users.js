import express from 'express';
import fs from 'fs-extra';
import { v4 as uuidv4 } from 'uuid';

const userRoutes = express.Router();

const dbPath = './src/db/users.json';

// Listar usuários
userRoutes.get('/', async (req, res) => {
  const users = await fs.readJSON(dbPath);
  res.json(users);
});

// Criar usuário
userRoutes.post('/', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando' });
  }

  const users = await fs.readJSON(dbPath);
  const newUser = { id: uuidv4(), name, email, password };
  users.push(newUser);

  await fs.writeJSON(dbPath, users, { spaces: 2 });
  res.status(201).json(newUser);
});

export default userRoutes;

