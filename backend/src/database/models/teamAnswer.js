import { mysqlTable as table } from 'drizzle-orm/mysql-core';
import * as t from 'drizzle-orm/mysql-core';
import timestamps from '../timestamps.js';

import team from './team.js';
import question from './question.js';

export default table('team_answer', {
  id: t.char('id', { length: 36 }).primaryKey().notNull(), // stores uuid
  teamId: t
    .char('team_id', { length: 36 })
    .references(() => team.id, { onDelete: 'cascade' })
    .notNull(),
  questionId: t
    .char('question_id', { length: 36 })
    .references(() => question.id, { onDelete: 'cascade' })
    .notNull(),
  answer: t.text('answer'),
  points: t.int('points').default(0).notNull(),
  ...timestamps,
});
