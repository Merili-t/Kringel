const express = require('express');
const router = express.Router();

router.get('/signup', (req, res) => {
  res.render('signup', { notice: null });
});

router.post('/signup', (req, res) => {
  const { emailInput, passwordInput } = req.body;
  if (!emailInput || passwordInput.length < 8) {
    return res.render('signup', { notice: 'Invalid input.' });
  }
  res.render('signup', { notice: 'User created!' });
});

module.exports = router;
