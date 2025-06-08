require('dotenv/config');
const { defineConfig } = require('drizzle-kit');
const path = require('path');

module.exports = defineConfig({
  out: './src/database/migrations',
  schema: './src/database/models',
  dialect: 'mysql',
  dbCredentials: {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
});
