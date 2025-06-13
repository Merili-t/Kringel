import { eq } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';

import * as zod from '../database/zod.js';
import db from '../database/drizzle.js';
import testModel from '../database/models/test.js';

export const upload = async (req, res) => {
  const serverUserData = req.serverUserData;

  const result = zod.testUploadSchema.safeParse(req.body);

  if (!result.success) {
    console.log(result.error.flatten());
    console.log(req.body);
    return res.status(400).json({ error: 'Bad data given' });
  }

  const { name, description, start, end, timeLimit } = result.data;
  const testId = uuidv7();
  const userId = serverUserData.userId;

  try {
    await db
      .insert(testModel)
      .values({
        id: testId,
        userId: userId,
        name,
        description,
        start: new Date(start),
        end: new Date(end),
        timeLimit,
      });

    return res.status(200).json({ message: 'Test created', id: testId });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create test' });
  }
};

export const getByTestId = async (req, res) => {
  const serverUserData = req.serverUserData;

  const result = zod.idSchema.safeParse(req.params.id);

  if (!result.success) {
    console.log(result.error.flatten());
    return res.status(400).json({ error: 'Bad data given' });
  }

  const testId = result.data;

  try {
    const test = await db.select().from(testModel).where(eq(testModel.id, testId));

    return res.status(200).json(test[0]);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get test' });
  }
};

export const getTests = async (req, res) => {
  try {
    const tests = await db.select().from(testModel);

    return res.status(200).json({ tests });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get tests' });
  }
};

export const deleteTest = async (req, res) => {
  const serverUserData = req.serverUserData;

  const result = zod.idSchema.safeParse(req.params.id);

  if (!result.success) {
    console.log(result.error.flatten());
    return res.status(400).json({ error: 'Bad data given' });
  }

  const testId = result.data;

  try {
    const deleteTest = await db.delete(testModel).where(eq(testModel.id, testId));
    if (deleteTest.affectedRows === 0) {
      return res.status(404).json({ message: 'Test not found' });
    }
    return res.status(200).json({ message: 'Test deleted' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete test' });
  }
};
