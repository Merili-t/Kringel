import { eq } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';

import * as zod from '../database/zod.js';
import db from '../database/drizzle.js';
import variantModel from '../database/models/answerVariant.js';

export const getVariantById = async (req, res) => {
  const serverUserData = req.serverUserData;

  const result = zod.idSchema.safeParse(req.params.id);

  if (!result.success) {
    console.log(result.error.flatten());
    return res.status(400).json({ error: 'Bad data given' });
  }

  const variantId = result.data;

  try {
    const variant = await db.select().from(variantModel).where(eq(variantModel.id, variantId));

    return res.status(200).json(variant[0]);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get variant' });
  }
}

export const deleteVariant = async (req, res) => {
  const serverUserData = req.serverUserData;

  const result = zod.idSchema.safeParse(req.params.id);

  if (!result.success) {
    console.log(result.error.flatten());
    return res.status(400).json({ error: 'Bad data given' });
  }

  const variantId = result.data;

  try {
    const deleteVariant = await db.delete(variantModel).where(eq(variantModel.id, variantId));
    if (deleteVariant.affectedRows === 0) {
      return res.status(404).json({ message: 'Answer variant not found' });
    }
    return res.status(200).json({ message: 'Answer variant deleted' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete answer variant' });
  }
};
