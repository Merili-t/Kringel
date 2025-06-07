import e from 'express';

import {
  getUser,
  getUsers,
  login,
  register,
} from '../controllers/userController.js';
import checkToken from '../middleware/authMiddleware.js';

const router = e.Router();

router.get('/:id', getUser);
router.get('/users', getUsers);
router.get('/login', checkToken, login);
router.get('/register', checkToken, register);

export default router;
