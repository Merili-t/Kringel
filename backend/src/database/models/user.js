import { mysqlTable as table } from 'drizzle-orm/mysql-core';
import * as t from 'drizzle-orm/mysql-core';
import timestamps from '../timestamps.js';

export default table('user', {
  id: t.char('id', { length: 36 }).primaryKey().notNull(), // stores uuid
  email: t.varchar('email', { length: 255 }).unique(),
  username: t.varchar('username', { length: 255 }).notNull(),
  password: t.varchar('password', { length: 255 }),
  userType: t.mysqlEnum(['admin', 'teacher', 'student', 'guest']).notNull(),
  ...timestamps,
});
