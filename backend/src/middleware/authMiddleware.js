import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  if (req.cookies.token) {
    jwt.verify(req.cookies.token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (!err) {
        req.ServerUserData = { isLoggedIn: true, userId: decoded };
        next();
      } else {
        req.ServerUserData = { isLoggedIn: false };
        next();
      }
    });
  } else {
    req.ServerUserData = { isLoggedIn: false };
    next();
  }
};
