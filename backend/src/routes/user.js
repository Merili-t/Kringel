import e from 'express';

import { getUser, login, register } from '../controllers/userController.js';
import checkToken from '../middleware/authMiddleware.js';

const router = e.Router();

router.get('/:id', getUser);
router.post('/login', checkToken, login);
router.post('/register', checkToken, register);

export default router;
