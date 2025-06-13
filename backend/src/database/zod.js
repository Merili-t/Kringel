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
export const loginSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(1),
});

export const registerSchema = z.object({
  email: z.string().email().trim(),
  name: z.string().optional(),
  password: z.string().optional(),
  userType: z.enum(['teacher', 'guest']),
});

export const blockUploadSchema = z.object({ testId: z.string(), blockNumber: z.number().min(1) });

export const idSchema = z.string();

export const passwordUpdateSchema = z.object({
  id: z.string(),
  password: z.string()
});

const answerVariable = z.object({ correct: z.boolean(), answer: z.string() });

export const questionSchema = z.object({
  blockId: z.string(),
  question: z.string(),
  points: z.number().min(0),
  answerType: z.number().min(0).max(6),
  orderNumber: z.number().min(1),
  answerVariables: z.union([z.array(answerVariable), z.lazy(() => z.array(questionSchema))]),
});

export const testUploadSchema = z.object({
  name: z.string(),
  description: z.string(),
  start: z.string(),
  end: z.string(),
  timeLimit: z.number(),
});

export const zodSchemas = { ...insertSchemas, ...selectSchemas };
