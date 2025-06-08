import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  if (req.cookies.token) {
    jwt.verify(req.cookies.token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (!err) {
        req.serverUserData = { isLoggedIn: true, userId: decoded.id, userType: decoded.userType };
        next();
      } else {
        req.serverUserData = { isLoggedIn: false };
        next();
      }
    });
  } else {
    req.serverUserData = { isLoggedIn: false };
    next();
  }
};
