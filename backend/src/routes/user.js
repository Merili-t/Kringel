import e from 'express';
import {getQuestion, postQuestion} from '../controllers/questionController.js'
import {getTests, postTests} from '../controllers/testController.js';
import { getUser, login, register, logout } from '../controllers/userController.js';
import checkToken from '../middleware/authMiddleware.js';
import * as access from '../middleware/accessControllMiddleware.js';

const router = e.Router();

router.get('/:id', checkToken, access.level2, getUser);
router.post('/login', checkToken, login);
router.post('/register', checkToken, register);
router.get('/logout', checkToken, access.level1, logout);

router.get('/tests', getTests);
router.post('/test/upload', postTests);

router.get('/questions', getQuestion);
router.post('/question/upload', postQuestion);

export default router;
