import { mysqlTable as table } from 'drizzle-orm/mysql-core';
import * as t from 'drizzle-orm/mysql-core';
import timestamps from '../timestamps.js';

import user from './user.js';

export default table('test', {
  id: t.char('id', { length: 36 }).primaryKey().notNull(), // stores uuid
  adminId: t
    .char('user_id', { length: 36 })
    .references(() => user.id)
    .notNull(),
  name: t.varchar('name', { length: 255 }).notNull(),
  description: t.text(),
  start: t.datetime('start').notNull(),
  end: t.datetime('end').notNull(),
  timeLimit: t.int('time_limit').notNull(),
  ...timestamps,
});
