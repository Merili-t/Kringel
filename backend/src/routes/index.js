import e from 'express';

const router = e.Router();

router.get('/', (req, res, next) => {
  res.json({ message: 'Welcome to Kringel API' });
});

export default router;
