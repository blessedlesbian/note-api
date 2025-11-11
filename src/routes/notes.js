import express from 'express';
import fs from 'fs-extra';
import { v4 as uuidv4 } from 'uuid';


import {createNote, listNotes, updateNote, deleteNote, getNotes, searchNotes, recentNotes} from '../controller/note.js';
import auth from '../middleware/auth.middleware.js';

const noteRoutes = express.Router();
const dbPath = './src/db/notes.json';


noteRoutes.use(auth);
noteRoutes.post('/', createNote);
noteRoutes.get('/', listNotes);
noteRoutes.put('/:id', updateNote);
noteRoutes.delete('/:id', deleteNote);
noteRoutes.get('/search', searchNotes);
noteRoutes.get('/recent-notes', recentNotes);
noteRoutes.get('/:id', getNotes);





export default noteRoutes; 