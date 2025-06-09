import e from 'express';

import { getUser, login, register, logout } from '../controllers/userController.js';
import checkToken from '../middleware/authMiddleware.js';
import * as access from '../middleware/accessControllMiddleware.js';

const router = e.Router();

router.get('/:id', checkToken, access.level2, getUser);
router.post('/login', checkToken, login);
router.post('/register', checkToken, register);
router.get('/logout', checkToken, access.level1, logout);

export default router;
