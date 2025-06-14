import { mysqlTable as table } from 'drizzle-orm/mysql-core';
import * as t from 'drizzle-orm/mysql-core';
import timestamps from '../timestamps.js';

import test from './test.js';

export default table('block', {
  id: t.char('id', { length: 36 }).primaryKey().notNull(), // stores uuid
  testId: t
    .char('test_id', { length: 36 })
    .references(() => test.id, { onDelete: 'cascade' })
    .notNull(),
  blockNumber: t.int('block_number').notNull(),
  ...timestamps,
});
