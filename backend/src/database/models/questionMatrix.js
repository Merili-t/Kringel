import { mysqlTable as table } from 'drizzle-orm/mysql-core';
import * as t from 'drizzle-orm/mysql-core';
import timestamps from '../timestamps.js';

import block from './block.js';

export default table('question_matrix', {
  id: t.char('id', { length: 36 }).primaryKey().notNull(), // stores uuid
  blockId: t
    .char('block_id', { length: 36 })
    .references(() => block.id)
    .notNull(),
  name: t.varchar('name', { length: 255 }),
  description: t.text('description'),
  orderNumber: t.int('order_number').notNull(),
  points: t.int('points').default(0).notNull(),
  ...timestamps,
});
