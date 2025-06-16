import { eq, count } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';

import * as zod from '../database/zod.js';
import db from '../database/drizzle.js';
import teamModel from '../database/models/team.js';
import answerModel from '../database/models/teamAnswer.js';
import attemptModel from '../database/models/testAttempt.js';

// Upload
export const teamUpload = async (req, res) => {};

export const attemptUpload = async (req, res) => {};

export const answerUpload = async (req, res) => {};

// Get one
export const getTeam = async (req, res) => {
  const serverUserData = req.serverUserData;

  const result = zod.idSchema.safeParse(req.params.id);

  if (!result.success) {
    console.log(result.error.flatten());
    return res.status(400).json({ error: 'Bad data given' });
  }

  const teamId = result.data;

  try {
    const team = await db.select().from(teamModel).where(eq(teamModel.id, teamId));

    res.status(200).json(team[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get team' });
  }
};

export const getAttempt = async (req, res) => {
  const serverUserData = req.serverUserData;

  const result = zod.idSchema.safeParse(req.params.id);

  if (!result.success) {
    console.log(result.error.flatten());
    return res.status(400).json({ error: 'Bad data given' });
  }

  const attemptId = result.data;

  try {
    const attempt = await db.select().from(attemptModel).where(eq(attemptModel.id, attemptId));

    res.status(200).json(attempt[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get test attempt' });
  }
};

export const getAnswer = async (req, res) => {
  const serverUserData = req.serverUserData;

  const result = zod.idSchema.safeParse(req.params.id);

  if (!result.success) {
    console.log(result.error.flatten());
    return res.status(400).json({ error: 'Bad data given' });
  }

  const answerId = result.data;

  try {
    const answer = await db.select().from(answerModel).where(eq(answerModel.id, answerId));

    res.status(200).json(answer[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get team answer' });
  }
};

// Get all
export const getTeams = async (req, res) => {
  try {
    const teams = await db.select().from(teamModel);

    console.log(teams);

    return res.status(200).json({ teams });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get tests' });
  }
};

export const getAttempts = async (req, res) => {
  try {
    const attempts = await db.select().from(attemptModel);

    return res.status(200).json({ attempts });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get test attempts' });
  }
};

export const getAnswers = async (req, res) => {
  try {
    const answers = await db.select().from(answerModel);

    return res.status(200).json({ answers });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get team answers' });
  }
};
