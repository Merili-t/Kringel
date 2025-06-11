import e from 'express';
import * as test from './controllers/testController.js';
import * as auth from './controllers/authController.js';
import * as block from './controllers/blockController.js';
import * as question from './controllers/questionController.js';
import checkToken from './middleware/authMiddleware.js';
import * as access from './middleware/accessControllMiddleware.js';

const router = e.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to Kringel API' });
});

// auth routes
router.post('/auth/login', checkToken, auth.login);
router.post('/auth/register', checkToken, auth.register);
router.get('/auth/logout', checkToken, access.level1, auth.logout);

// test routes
router.post('/test/upload', checkToken, access.level2, test.upload);
router.get('/test/tests', checkToken, access.level2, test.getTests);
router.get('/test/:id', checkToken, access.level1, test.getByTestId);

// block routes
router.post('/block/upload', checkToken, access.level2, block.upload);
router.get('/block/test/:testId', checkToken, access.level1, block.getByTestId);
router.get('/block/:id', checkToken, access.level1, block.getByBlockId);

// question routes
router.post('/question/upload', checkToken, access.level2, question.upload);
router.get('/question/block/:blockId', checkToken, access.level1, question.getByBlockId);
router.get('/question/:id', checkToken, access.level1, question.getByQuestionId);

export default router;
