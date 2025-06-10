import e from 'express';
import { getQuestion, postQuestion } from './controllers/questionController.js';
import { getTests, postTests } from './controllers/testController.js';
import { login, register, logout } from './controllers/authController.js';
import checkToken from './middleware/authMiddleware.js';
import * as access from './middleware/accessControllMiddleware.js';

const router = e.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to Kringel API' });
});

router.post('/auth/login', checkToken, login);
router.post('/auth/register', checkToken, register);
router.get('/auth/logout', checkToken, access.level1, logout);

router.get('/tests', checkToken, access.level2, getTests);
router.post('/test/upload', checkToken, access.level2, postTests);

router.get('/questions', checkToken, access.level2, getQuestion);
router.post('/question/upload', checkToken, access.level2, postQuestion);

export default router;
