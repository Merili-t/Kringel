import { mysqlTable as table } from 'drizzle-orm/mysql-core';
import * as t from 'drizzle-orm/mysql-core';
import timestamps from '../timestamps';

export default userAdmin = table('user_admin', {
  id: t.char('id', { length: 36 }).primaryKey().notNull(), // stores uuid
  email: t.varchar('email', { length: 255 }).notNull(),
  password: t.varchar('password', { length: 255 }).notNull(),
  ...timestamps,
});
