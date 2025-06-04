import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';
import path from 'path';

// https://vite.dev/config/

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

const port = process.env.VITE_PORT
    ? parseInt(process.env.VITE_PORT)
    : undefined;

export default defineConfig({
  plugins: [react()],
  server: { host: true, port: port},
})
