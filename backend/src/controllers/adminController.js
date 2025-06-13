import { eq } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

import * as zod from '../database/zod.js';
import db from '../database/drizzle.js';
import user from '../database/models/user.js';
import team from '../database/models/team.js';

export const getUsers = async (req, res) => {
  const serverUserData = req.serverUserData;

  try {
    const users = await db.query.user.findMany();

    return res.status(200).json({ users });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get users' });
  };
};

export const updatePassword = async (req, res) => {
  const serverUserData = req.serverUserData;

  const result = zod.passwordUpdateSchema.safeParse(req.body);

  if (!result.success) {
    console.log(result.error.flatten());
    return res.status(400).json({ error: 'Bad data given' });
  }

  const { id, password } = result.data;

  try {
    await db.update(user).set({ password: await argon2.hash(password) }).where(eq(user.id, id));

    return res.status(200).json({ message: 'Password changed' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to change password' });
  };
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