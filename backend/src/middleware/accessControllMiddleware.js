const userLevel = { guest: 1, student: 2, teacher: 3, admin: 4 };

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
const level2 = requireLevel(userLevel.student);
const level3 = requireLevel(userLevel.teacher);
const level4 = requireLevel(userLevel.admin);

export { level1, level2, level3, level4 };
