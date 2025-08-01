import { mysqlTable as table } from 'drizzle-orm/mysql-core';
import * as t from 'drizzle-orm/mysql-core';
import timestamps from '../timestamps.js';

import test from './test.js';
import team from './team.js';

export default table('test_attempt', {
  id: t.char('id', { length: 36 }).primaryKey().notNull(), // stores uuid
  testId: t
    .char('test_id', { length: 36 })
    .references(() => test.id, { onDelete: 'cascade' })
    .notNull(),
  teamId: t
    .char('team_id', { length: 36 })
    .references(() => team.id)
    .notNull(),
  start: t.datetime('start').notNull(),
  end: t.datetime('end').default(null),
  score: t.int('score').default(0).notNull(),
  ...timestamps,
});
