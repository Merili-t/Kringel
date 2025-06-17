import { v7 as uuidv7 } from 'uuid';
import argon2 from 'argon2';
import { eq } from 'drizzle-orm';

import db from '../drizzle.js';
import test from '../models/test.js';
import block from '../models/block.js';
import question from '../models/question.js';
import matrixModel from '../models/questionMatrix.js';
import answerVariant from '../models/answerVariant.js';
import team from '../models/team.js';
import attemptModel from '../models/testAttempt.js';
import answerModel from '../models/teamAnswer.js';

import testSeeder from './testSeeder.js';

export default async () => {
  const teamExists = await db.query.team.findFirst({ where: eq(team.email, 'team1@kringel.ee') });

  if (!teamExists) {
    const team1Id = uuidv7();
    const team2Id = uuidv7();

    const attempt1Id = uuidv7();
    const attempt2Id = uuidv7();

    await db.insert(team).values([
      { id: team1Id, email: 'team1@kringel.ee', teamName: 'team1', names: 'Jhon, Joe, Peter', school: 'school1', link: 'empty' },
      { id: team2Id, email: 'team2@kringel.ee', teamName: 'team2', names: 'James, Ben', school: 'school2', link: 'empty' },
    ]);

    let testId = await db.query.test.findFirst();

    if (!testId) {
      await testSeeder();

      testId = await db.query.test.findFirst();
    }

    await db.insert(attemptModel).values([
      {
        id: attempt1Id,
        testId: testId.id,
        teamId: team1Id,
        start: new Date(),
        end: new Date(),
        score: 0,
      },
      {
        id: attempt2Id,
        testId: testId.id,
        teamId: team2Id,
        start: new Date(),
        end: new Date(),
        score: 0,
      },
    ]);

    const testBlocks = await db.query.block.findMany({ where: eq(block.testId, testId.id) });
    let testQuestions = [];

    for (const testBlock of testBlocks) {
      const blockQuestions = await db.query.question.findMany({
        where: eq(question.blockId, testBlock.id),
      });
      for (const blockQuestion of blockQuestions) {
        if (!blockQuestion.matrixId) {
          testQuestions.push(blockQuestion);
        }
      }
    }

    for (const testQuestion of testQuestions) {
      if ([0, 1, 5, 7].includes(testQuestion.type)) {
        const questionVariant = await db.query.answerVariant.findFirst(
          eq(answerVariant.questionId, testQuestion.id)
        );

        await db.insert(answerModel).values([
          {
            id: uuidv7(),
            attemptId: attempt1Id,
            questionId: testQuestion.id,
            variantId: questionVariant.id,
          },
          {
            id: uuidv7(),
            attemptId: attempt2Id,
            questionId: testQuestion.id,
            variantId: questionVariant.id,
          },
        ]);
      }
    }
  }
};
