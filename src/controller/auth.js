const { v4: uuidv4 } = require('uuid');
const dbService = require('../services/db.service');

async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email and password are required' });
  }
  const db = await dbService.getAll();
  if (db.users.find(u => u.email === email)) {
    return res.status(409).json({ message: 'email already registered' });
  }
  const id = uuidv4();
  const token = uuidv4();
  const user = { id, name, email, password, token };
  db.users.push(user);
  await dbService.save(db);
  // do not return password in response
  return res.status(201).json({ id, name, email, token });
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'email and password required' });
  const db = await dbService.getAll();
  const user = db.users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: 'invalid credentials' });
  // generate new token (simple)
  user.token = uuidv4();
  await dbService.save(db);
  return res.json({ id: user.id, name: user.name, email: user.email, token: user.token });
}

module.exports = { register, login };
