import e from 'express';
import * as test from './controllers/testController.js';
import * as auth from './controllers/authController.js';
import * as block from './controllers/blockController.js';
import * as question from './controllers/questionController.js';
import * as variant from './controllers/variantController.js';
import * as team from './controllers/teamController.js';
import * as admin from './controllers/adminController.js';
import checkToken from './middleware/authMiddleware.js';
import multer from './middleware/multer.js';
import * as access from './middleware/accessControllMiddleware.js';

const router = e.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to Kringel API' });
});

// Auth routes
router.post('/auth/login', checkToken, auth.login);
router.post('/auth/register', checkToken, auth.register);
router.get('/auth/logout', checkToken, access.level1, auth.logout);

// Test routes
router.post('/test/upload', checkToken, access.level2, test.upload);
router.get('/test/tests', checkToken, access.level2, test.getTests);
router.get('/test/:id', checkToken, test.getByTestId);
router.delete('/test/delete/:id', checkToken, access.level2, test.deleteTest);

// Block routes
router.post('/block/upload', checkToken, access.level2, block.upload);
router.get('/block/test/:testId', checkToken, access.level1, block.getByTestId);
router.get('/block/:id', checkToken, access.level1, block.getByBlockId);
router.delete('/block/delete/:id', checkToken, access.level2, block.deleteBlock);

// Question routes
router.post('/question/upload', checkToken, access.level2, question.upload);
router.get('/question/block/:blockId', checkToken, access.level1, question.getByBlockId);
router.get('/question/:id', checkToken, access.level1, question.getByQuestionId);
router.delete('/question/delete/:id', checkToken, access.level2, question.deleteQuestion);

// Answer variant routes
router.get('/variant/:id', checkToken, access.level2, variant.getVariantById);
router.delete('/variant/delete/:id', checkToken, access.level2, variant.deleteVariant);

// Team routes
router.post('/team/attempt/upload', checkToken, access.level1, team.attemptUpload);
router.post('/team/answer/upload', checkToken, access.level1, multer.single('file'), team.answerUpload);

router.patch('/team/attempt/update', checkToken, access.level1, team.updateAttempt);
router.patch('/team/answer/update', checkToken, access.level2, team.updateAnswer);

router.get('/team/team/:id', checkToken, access.level2, team.getTeam);
router.get('/team/attempt/:id', checkToken, access.level2, team.getAttempt);
router.get('/team/answer/:id', checkToken, access.level2, team.getAnswer);

router.get('/team/teams', checkToken, access.level2, team.getTeams);
router.get('/team/attempts', checkToken, access.level2, team.getAttempts);
router.get('/team/answers', checkToken, access.level2, team.getAnswers);

// Admin routes
router.get('/admin/users', checkToken, access.level3, admin.getUsers);
router.patch('/admin/update', checkToken, access.level3, admin.updatePassword);
router.delete('/admin/delete/:id', checkToken, access.level3, admin.deleteUser);

export default router;
