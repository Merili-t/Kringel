import { eq } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';
import db from '../database/drizzle.js';
import blockModel from '../database/models/block.js';
import * as zod from '../database/zod.js';

export const upload = async (req, res) => {
  const serverUserData = req.serverUserData;

  const result = zod.blockUploadSchema.safeParse(req.body);

  if (!result.success) {
    console.log(result.error.flatten());
    return res.status(400).json({ error: 'Bad data given' });
  }

  const { testId, blockNumber } = result.data;
  const blockId = uuidv7();

  try {
    await db.insert(blockModel).values({ id: blockId, testId, blockNumber });

    return res.status(200).json({ message: 'Block created', id: blockId });
  } catch (err) {
    return res.satus(500).json({ error: 'Failed to create block' });
  }
};

export const getByTestId = async (req, res) => {
  const serverUserData = req.serverUserData;

  const result = zod.idSchema.safeParse(req.params.testId);

  if (!result.success) {
    console.log(result.error.flatten());
    return res.status(400).json({ error: 'Bad data given' });
  }

  const testId = result.data;

  try {
    const blocks = await db.select().from(blockModel).where(blockModel.testId, testId);

    return res.status(200).json({ blocks });
  } catch (err) {
    return res.satus(500).json({ error: 'Failed to get blocks' });
  }
};

export const getByBlockId = async (req, res) => {
  const serverUserData = req.serverUserData;

  const result = zod.idSchema.safeParse(req.params.id);

  if (!result.success) {
    console.log(result.error.flatten());
    return res.status(400).json({ error: 'Bad data given' });
  }

  const blockId = result.data;

  try {
    const block = await db.select().from(blockModel).where(blockModel.id, blockId);

    return res.status(200).json(block[0]);
  } catch (err) {
    return res.satus(500).json({ error: 'Failed to get block' });
  }
};

export const deleteBlock = async (req, res) => {
  const serverUserData = req.serverUserData;

  const result = zod.idSchema.safeParse(req.params.id);

  if (!result.success) {
    console.log(result.error.flatten());
    return res.status(400).json({ error: 'Bad data given' });
  }

  const blockId = result.data;

  try {
    const deleteBlock = await db.delete(blockModel).where(eq(blockModel.id, blockId));
    if (deleteBlock.affectedRows === 0) {
      return res.status(404).json({ message: 'Block not found' });
    }
    return res.status(200).json({ message: 'Block deleted' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete block' });
  }
};
