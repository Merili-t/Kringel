import { mysqlTable as table } from 'drizzle-orm/mysql-core';
import * as t from 'drizzle-orm/mysql-core';
import timestamps from '../timestamps';

export default questionType = table('question_type', {
  id: t.char('id', { length: 36 }).primaryKey().notNull(), // stores uuid
  name: t.varchar('name', { length: 255 }).notNull(),
  ...timestamps,
});
