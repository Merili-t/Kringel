import * as dz from 'drizzle-zod';
import * as z from 'zod';
import * as schema from './schema.js';

const insertSchemas = {};
const selectSchemas = {};

for (const [modelName, table] of Object.entries(schema)) {
  insertSchemas[`insert${capitalize(modelName)}Schema`] = dz.createInsertSchema(table);
  selectSchemas[`select${capitalize(modelName)}Schema`] = dz.createSelectSchema(table);
}

// Helper to capitalize first letter
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Other zod schemas
export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

export const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  password: z.string().optional(),
  userType: z.enum(['teacher', 'guest']),
});

export const zodSchemas = { ...insertSchemas, ...selectSchemas };
