import { v7 as uuidv7 } from 'uuid';
import argon2 from 'argon2';
import { eq } from 'drizzle-orm';

import db from '../drizzle.js';
import user from '../models/user.js';

export default async () => {
  const adminExists = await db.query.user.findFirst({ where: eq(user.username, 'admin') });

  if (!adminExists) {
    await db.insert(user).values([
      {
        id: uuidv7(),
        email: 'admin@kringel.ee',
        username: 'admin',
        password: await argon2.hash('1234'),
        userType: 'admin',
      },
      {
        id: uuidv7(),
        email: 'teacher@kringel.ee',
        username: 'teacher',
        password: await argon2.hash('1234'),
        userType: 'teacher',
      },
      {
        id: uuidv7(),
        email: 'student@kringel.ee',
        username: 'student',
        password: await argon2.hash('1234'),
        userType: 'student',
      },
      { id: uuidv7(), username: 'guest', userType: 'guest' },
    ]);
  }
};
