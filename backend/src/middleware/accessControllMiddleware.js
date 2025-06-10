const userLevel = { guest: 1, teacher: 2 };

const requireLevel = minLevel => (req, res, next) => {
  const userType = req.serverUserData?.userType;
  if (!userType || userLevel[userType] === undefined) {
    return res.status(401).json({ error: 'Unauthorized access' });
  }

  if (userLevel[userType] >= minLevel) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized access' });
  }
};

const level1 = requireLevel(userLevel.guest);
const level2 = requireLevel(userLevel.teacher);

export { level1, level2 };
