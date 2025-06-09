import express from 'express';
import { fileURLToPath } from 'url';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';

// import routes
import indexRouter from './src/routes/index.js';
import userRouter from './src/routes/user.js';

// set path to .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// express setup
let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

// set server to listen
const host = process.env.HOST || '0.0.0.0';
const port = parseInt(process.env.BE_PORT || '3006', 10);

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
