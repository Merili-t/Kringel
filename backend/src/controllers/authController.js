import { eq } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

import * as zod from '../database/zod.js';
import db from '../database/drizzle.js';
import user from '../database/models/user.js';
import team from '../database/models/team.js';

const createSession = (res, id, userType, message, userTypeMessage) => {
  const token = jwt.sign({ id, userType }, process.env.TOKEN_SECRET, { expiresIn: '7d' });
  res
    .cookie('token', token, {
      httpOnly: true,
      sameSite: 'Strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    })
    .json({ message, userTypeMessage });
};

export const login = async (req, res) => {
  const serverUserData = req.serverUserData;

  const result = zod.loginSchema.safeParse(req.body);

  if (!result.success) {
    console.log(result.error.flatten());
    return res.status(400).json({ error: 'Bad data given' });
  }

  const { email, password } = result.data;

  if (!serverUserData.isLoggedIn && email && password) {
    const foundUser = await db.select().from(user).where(eq(user.email, email));

    if (foundUser[0] && (await argon2.verify(foundUser[0].password, password))) {
      createSession(
        res,
        foundUser[0].id,
        foundUser[0].userType,
        'Logged in',
        foundUser[0].userType
      );
    } else {
      res.status(401).json({ error: 'Wrong email or password given' });
    }
  } else if (serverUserData.isLoggedIn && serverUserData.userType === 'teacher') {
    res.json({ message: 'Logged in', userType: 'teacher' });
  } else {
    res.status(400).json({ error: 'Email and password are required' });
  }
};

export const register = async (req, res) => {
  const serverUserData = req.serverUserData;

  const result = zod.registerSchema.safeParse(req.body);

  if (!result.success) {
    console.log(result.error.flatten());
    return res.status(400).json({ error: 'Bad data given' });
  }

  const { email, name, password, userType } = result.data;

  if (serverUserData.isLoggedIn) {
    return res.status(400).json({ error: 'Already logged in' });
  }

  const id = uuidv7();

  if (userType === 'guest' && email && name) {
    // Guest registration
    try {
      await db.insert(team).values({ id, email, name });
      return createSession(res, id, userType, 'Guest account created and logged in', 'guest');
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create guest account' });
    }
  }

  if (userType === 'teacher' && email && password) {
    // Teacher registration
    const lowEmail = email.toLowerCase();
    if (!(await db.query.user.findFirst({ where: eq(user.email, lowEmail) }))) {
      try {
        await db
          .insert(user)
          .values({ id, email: lowEmail, password: await argon2.hash(password) });
        return res.status(200).json({ message: 'Teacher account crated' });
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

export const deleteUser = async (req, res) => {
  const serverUserData = req.serverUserData;

  const result = zod.idSchema.safeParse(req.params.id);

  if (!result.success) {
    console.log(result.error.flatten());
    return res.status(400).json({ error: 'Bad data given' });
  }

  const userId = result.data;

  try {
    const deleteUser = await db.delete(user).where(eq(user.id, userId));
    if (deleteUser.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete user' });
  }
};
