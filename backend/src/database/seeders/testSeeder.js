import { v7 as uuidv7 } from 'uuid';
import { eq } from 'drizzle-orm';

import db from '../drizzle.js';
import test from '../models/test.js';
import user from '../models/user.js';
import block from '../models/block.js';
import question from '../models/question.js';
import answerVariant from '../models/answerVariant.js';

import userSeeder from './userSeeder.js';

export default async () => {
  const testExists = await db.query.test.findFirst({ where: eq(test.name, 'Demo test') });
  let account = await db.query.user.findFirst({ where: eq(user.email, 'teacher@kringel.ee') });

  if (!testExists) {
    if (!account) {
      await userSeeder();

      account = await db.query.user.findFirst({ where: eq(user.email, 'teacher@kringel.ee') });
    }

    const testId = uuidv7();
    const blockId1 = uuidv7();
    const blockId2 = uuidv7();
    const questionId1 = uuidv7();
    const questionId2 = uuidv7();
    const questionId3 = uuidv7();

    await db
      .insert(test)
      .values({
        id: testId,
        userId: account.id,
        name: 'Demo test',
        description: 'This is a demo test to show how the system works',
        start: new Date(Date.now()),
        end: new Date(Date.now()),
        timeLimit: 120,
      });

    await db.insert(block).values([
      { id: blockId1, testId, blockNumber: 1 },
      { id: blockId2, testId, blockNumber: 2 },
    ]);

    await db.insert(question).values([
      {
        id: questionId1,
        blockId: blockId1,
        description: 'This is a simple question',
        points: 10,
        type: 0,
        orderNumber: 1,
      },
      {
        id: questionId2,
        blockId: blockId1,
        description: 'This is a hard question',
        points: 5,
        type: 1,
        orderNumber: 2,
      },
      {
        id: questionId3,
        blockId: blockId2,
        description: 'This is a text question',
        points: 10,
        type: 2,
        orderNumber: 1,
      },
    ]);

    await db.insert(answerVariant).values([
      { id: uuidv7(), questionId: questionId1, correct: true, answer: 'This is the first answer' },
      {
        id: uuidv7(),
        questionId: questionId1,
        correct: false,
        answer: 'This is the second answer',
      },
      { id: uuidv7(), questionId: questionId2, correct: true, answer: 'This is the first answer' },
      { id: uuidv7(), questionId: questionId2, correct: true, answer: 'This is the second answer' },
      { id: uuidv7(), questionId: questionId2, correct: false, answer: 'This is the third answer' },
    ]);
  }
};
