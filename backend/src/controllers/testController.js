import { eq } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';
import db from '../database/drizzle.js';
import test from '../database/models/test.js';

export const getTests = async res => {
  try {
    const testId = req.params.id;
    const result = await db.select().from(test).where(eq(test.id, testId));
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
export const postTests = async (req, res) => {
  try {
    const { name, description, timelimit, start, end, blockId } = req.body;
    const id = uuidv7();
    await db.insert(test).values({ id, name, description, timelimit, start, end, blockId });
    return res.status(201).json({ message: 'Test created', id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
