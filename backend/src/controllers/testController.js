import { eq, count } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';

import * as zod from '../database/zod.js';
import db from '../database/drizzle.js';
import testModel from '../database/models/test.js';
import blockModel from '../database/models/block.js';
import questionModel from '../database/models/question.js';

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
  const blockId = uuidv7();

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

    try {
      await db.insert(blockModel).values({ id: blockId, testId, blockNumber: 1 });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to create block' });
    }

    return res.status(200).json({ message: 'Test created', id: testId, blockId });
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

    try {
      const result = await db
        .select({ questionCount: count(questionModel.id) })
        .from(testModel)
        .leftJoin(blockModel, eq(blockModel.testId, testModel.id))
        .leftJoin(questionModel, eq(questionModel.blockId, blockModel.id))
        .where(eq(testModel.id, testId));

      test[0].questions = Number(result[0].questionCount);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to get question count' });
    }

    return res.status(200).json(test[0]);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get test' });
  }
};

export const getTests = async (req, res) => {
  try {
    const tests = await db.select().from(testModel);

    for (let i = 0; i < tests.length; i++) {
      try {
        const result = await db
          .select({ questionCount: count(questionModel.id) })
          .from(testModel)
          .leftJoin(blockModel, eq(blockModel.testId, testModel.id))
          .leftJoin(questionModel, eq(questionModel.blockId, blockModel.id))
          .where(eq(testModel.id, tests[i].id));

        tests[i].questions = Number(result[0].questionCount);
      } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Failed to get question count' });
      }
    }

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
