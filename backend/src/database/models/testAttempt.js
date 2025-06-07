import { mysqlTable as table } from 'drizzle-orm/mysql-core';
import * as t from 'drizzle-orm/mysql-core';
import timestamps from '../timestamps.js';

import test from './test';
import user from './user';

export default table('test_attempt', {
  id: t.char('id', { length: 36 }).primaryKey().notNull(), // stores uuid
  testId: t
    .char('test_id', { length: 36 })
    .references(() => test.id)
    .notNull(),
  userId: t
    .char('user_id', { length: 36 })
    .references(() => user.id)
    .notNull(),
  start: t.datetime('start').notNull(),
  end: t.datetime('end').notNull(),
  score: t.int('score').default(0).notNull(),
  ...timestamps,
});
