import { eq } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';
import db from '../database/drizzle.js';
import question from '../database/models/question.js';

const getQuestion = async res => {
    try {
        const qId = req.params.id;
        const result = await db.select().from(question).where(eq(question.id, qId));
        return res.json(result);
    } catch (err) {
        return res.statud(500).json({ error: err.message });
    }
};

const postQuestion = async (req, res) => {
    try {
        const id = uuidv7();
        const { blockId, typeId, orderNumber, description, points } = req.body;
        await db.insert(question).values({ id, orderNumber, description, points, typeId, blockId });
        return res.status(200).json({ message: 'Question created', id })
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
const questionController = {
    getQuestion,
    postQuestion
};

export default questionController;