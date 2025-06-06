import { mysqlTable as table } from 'drizzle-orm/mysql-core';
import * as t from 'drizzle-orm/mysql-core';
import timestamps from '../timestamps';

import block from './block';
import questionType from './questionType';

export default question = table('question', {
  id: t.char('id', { length: 36 }).primaryKey().notNull(), // stores uuid
  blockId: t
    .char('block_id', { length: 36 })
    .references(() => block.id)
    .notNull(),
  typeId: t
    .char('type_id', { length: 36 })
    .references(() => questionType.id)
    .notNull(),
  orderNumber: t.int('order_number').notNull(),
  description: t.text('description').notNull(),
  points: t.int('points').default(0).notNull(),
  ...timestamps,
});
