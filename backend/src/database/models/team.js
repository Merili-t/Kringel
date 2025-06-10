import { mysqlTable as table } from 'drizzle-orm/mysql-core';
import * as t from 'drizzle-orm/mysql-core';
import timestamps from '../timestamps.js';

import testAttempt from './testAttempt.js';

export default table('team', {
  id: t.char('id', { length: 36 }).primaryKey().notNull(), // stores uuid
  attemptId: t.char('attempt_id', { length: 36 }).references(() => testAttempt.id).default(null),
  email: t.varchar('email', { length: 255 }).notNull(),
  name: t.text('name').notNull(),
  ...timestamps,
});
