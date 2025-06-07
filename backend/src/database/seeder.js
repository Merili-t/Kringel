import fs from 'fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const seedersDir = path.join(__dirname, 'seeders');

async function runSeeders() {
  const files = await fs.readdir(seedersDir);

  for (const file of files) {
    try {
      if (file.endsWith('.js')) {
        const filePath = path.join(seedersDir, file);
        const module = await import(filePath);
        if (typeof module.default === 'function') {
          console.log(`Running seeder: ${file}`);
          await module.default(); // Call the default export
        } else {
          console.warn(`No default function export found in ${file}`);
        }
      }
    } catch (err) {}
  }

  console.log('✅ Seeding complete. Connection closed.');
  process.exit(0);
}

runSeeders();