import { mysqlTable as table } from 'drizzle-orm/mysql-core';
import * as t from 'drizzle-orm/mysql-core';
import timestamps from '../timestamps.js';

import attempt from './testAttempt.js';
import question from './question.js';
import variant from './answerVariant.js';

export default table('team_answer', {
  id: t.char('id', { length: 36 }).primaryKey().notNull(), // stores uuid
  attemptId: t
    .char('team_id', { length: 36 })
    .references(() => attempt.id, { onDelete: 'cascade' })
    .notNull(),
  questionId: t
    .char('question_id', { length: 36 })
    .references(() => question.id, { onDelete: 'cascade' })
    .notNull(),
  variantId: t
    .char('variant_id', { length: 36 })
    .references(() => variant.id, { onDelete: 'cascade' })
    .default(null),
  answer: t.text('answer'),
  points: t.int('points').default(0).notNull(),
  ...timestamps,
});
