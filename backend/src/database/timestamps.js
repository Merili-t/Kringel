import * as t from 'drizzle-orm/mysql-core';

export default timestamps = {
  createdAt: t.timestamp('created_at').defaultNow(),
  updatedAt: t.timestamp('updated_at').onUpdateNow().defaultNow(),
};
