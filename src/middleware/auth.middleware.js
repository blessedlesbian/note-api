
import * as dbService from '../services/db.service.js';

async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: missing token' });
  }
  const token = auth.slice(7);
  const db = await dbService.getAll();
  const user = db.users.find(u => u.token === token);
  if (!user) return res.status(401).json({ message: 'Unauthorized: invalid token' });
  req.user = { id: user.id, name: user.name, email: user.email };
  next();
}

export default authMiddleware
