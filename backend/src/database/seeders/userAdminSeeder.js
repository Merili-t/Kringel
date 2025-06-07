import { v7 as uuidv7 } from 'uuid';
import argon2 from 'argon2';

import db from '../drizzle.js';
import userAdmin from '../models/userAdmin.js';

export default async () => {
  await db
    .insert(userAdmin)
    .values({
      id: uuidv7(),
      email: 'kringel@kringel.ee',
      password: await argon2.hash('1234'),
    });
};
