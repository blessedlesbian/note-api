import { getUsers } from "../services/db.service.js";
import * as dbService from '../services/db.service.js';

async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: missing token' });
  }
  const token = auth.slice(7);
  const db = await getUsers();
  const user = db.find(u => u.id === token);
  if (!user) return res.status(401).json({ message: 'Unauthorized: invalid token' });
  req.user = { id: user.id, name: user.name, email: user.email };
  next();
}

export default authMiddleware
