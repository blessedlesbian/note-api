import express from 'express';
import { createTag, listTags, updateTag, deleteTag } from '../controller/tag.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(auth);
router.post('/', createTag);
router.get('/', listTags);
router.put('/:id', updateTag);
router.delete('/:id', deleteTag);

export default router;

