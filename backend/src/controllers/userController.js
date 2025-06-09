import { eq } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

import db from '../database/drizzle.js';
import user from '../database/models/user.js';

const createSession = (res, id, userType, message) => {
  const token = jwt.sign({ id, userType }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
  res
    .cookie('token', token, {
      httpOnly: true,
      sameSite: 'Strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1h
    })
    .json({ message });
};

export const getUser = async (req, res) => {
  const userId = req.params.id;

  const result = await db
    .select({ id: user.id, email: user.email, username: user.username, userType: user.userType })
    .from(user)
    .where(eq(user.id, userId));

  res.json(result[0]);
};

export const login = async (req, res) => {
  const serverUserData = req.serverUserData;
  const { email, password } = req.body;

  if (!serverUserData.isLoggedIn && email && password) {
    const foundUser = await db.select().from(user).where(eq(user.email, email));

    if (foundUser && (await argon2.verify(foundUser[0].password, password))) {
      createSession(res, foundUser[0].userId, foundUser[0].userType, 'Logged in');
    } else {
      res.status(401).json({ error: 'Wrong email or password given' });
    }
  } else if (serverUserData.isLoggedIn) {
    res.json({ message: 'Logged in' });
  } else {
    res.status(400).json({ error: 'Email and password are required' });
  }
};

export const register = async (req, res) => {
  const serverUserData = req.serverUserData;
  const { email, username, password, userType } = req.body;

  if (serverUserData.isLoggedIn) {
    return res.status(400).json({ error: 'Already logged in' });
  }

  const id = uuidv7();

  if (userType === 'guest' && username) {
    // Guest registration
    try {
      await db.insert(user).values({ id, username, userType });
      return createSession(res, id, userType, 'Guest account created and logged in');
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create guest account' });
    }
  }

  if (email && username && password && userType) {
    if (!(await db.query.user.findFirst({ where: eq(user.email, email) }))) {
      try {
        await db
          .insert(user)
          .values({
            id,
            email: email.toLowerCase(),
            username,
            password: await argon2.hash(password),
            userType,
          });
        return createSession(res, id, userType, 'Account created and logged in');
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to create user' });
      }
    } else {
      return res.status(400).json({ error: 'Account already exists' });
    }
  }

  return res.status(400).json({ error: 'Missing required fields' });
};

export const logout = (req, res) => {
  if (req.serverUserData.isLoggedIn) {
    res.cookie('token', '', {
      httpOnly: true,
      sameSite: 'Strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
    });
    return res.json({ message: 'User is logged out' });
  } else {
    return res.status(400).json({ error: 'User is not logged in' });
  }
};
