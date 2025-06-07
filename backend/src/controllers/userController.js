export const getUser =  (req, res) => {
  const userId = req.params.id;
  res.send(`Get user: ${userId}`);
};

export const getUsers =  (req, res) => {
  res.send('Get users');
};

export const login =  (req, res) => {
  res.send('Login');
};

export const register = (req, res) => {
  res.send('Register');
};