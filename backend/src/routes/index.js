import express from 'express';

var router = express.Router();

/* GET home page. */
export default router.get('/', function (req, res, next) {
  res.send('index');
});
