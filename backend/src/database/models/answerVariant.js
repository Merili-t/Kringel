import { mysqlTable as table } from 'drizzle-orm/mysql-core';
import * as t from 'drizzle-orm/mysql-core';
import timestamps from '../timestamps.js';
import question from './question.js';

export default table('answer_variant', {
  id: t.char('id', { length: 36 }).primaryKey().notNull(), // stores uuid
  questionId: t
    .char('question_id', { length: 36 })
    .references(() => question.id, { onDelete: 'cascade' })
    .notNull(),
  correct: t.boolean('correct').default(false).notNull(),
  answer: t.text('answer').notNull(),
  ...timestamps,
});
