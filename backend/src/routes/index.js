import e from 'express';

const router = e.Router();

router.get('/', (req, res, next) => {
  res.send('Welcome to Kringel API');
});

export default router;