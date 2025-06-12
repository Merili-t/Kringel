import { mysqlTable as table } from 'drizzle-orm/mysql-core';
import * as t from 'drizzle-orm/mysql-core';
import timestamps from '../timestamps.js';

export default table('user', {
  id: t.char('id', { length: 36 }).primaryKey().notNull(), // stores uuid
  email: t.varchar('email', { length: 255 }).unique().notNull(),
  password: t.varchar('password', { length: 255 }).notNull(),
  userType: t.mysqlEnum('user_type', ['admin', 'teacher', 'guest']).notNull(),
  ...timestamps,
});
