import { v7 as uuidv7 } from 'uuid';
import argon2 from 'argon2';
import { eq } from 'drizzle-orm';

import db from '../drizzle.js';
import user from '../models/user.js';

export default async () => {
  const adminExists = await db.query.user.findFirst({ where: eq(user.email, 'teacher@kringel.ee') });

  if (!adminExists) {
    await db
      .insert(user)
      .values({ id: uuidv7(), email: 'teacher@kringel.ee', password: await argon2.hash('1234') });
  }
};
