import { mysqlTable as table } from 'drizzle-orm/mysql-core';
import * as t from 'drizzle-orm/mysql-core';
import timestamps from '../timestamps.js';

import user from './user.js';
import question from './question.js';

export default table('user_answer', {
  id: t.char('id', { length: 36 }).primaryKey().notNull(), // stores uuid
  userId: t
    .char('user_id', { length: 36 })
    .references(() => user.id)
    .notNull(),
  questionId: t
    .char('question_id', { length: 36 })
    .references(() => question.id)
    .notNull(),
  answer: t.text('answer'),
  points: t.int('points').default(0).notNull(),
  ...timestamps,
});
