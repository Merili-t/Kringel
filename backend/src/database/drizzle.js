import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import * as schema from './schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const db = drizzle(pool, { schema, mode: 'default' });

export default db;
