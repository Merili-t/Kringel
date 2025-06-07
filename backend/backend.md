# Backend

## Secuity

- To generate a token, run:
  ```bash
  npm run token
  ```
  > This gives you a randomly generated token in **Base64** format.

## Database Operations

- To generate migrations, run:

  ```bash
  npm run generate
  ```

- To apply (push) migrations to the database, run:
  ```bash
  npm run migrate
  ```

## Pre-commit Checklist

Before creating a commit, run the following to ensure consistent code formatting:

```bash
npm run format
```

> This uses **Prettier** to enforce a unified code style across the project.

## Technology Stack

- [Vite](https://vite.dev/) – Frontend tooling for faster builds
- [Express.js](https://expressjs.com/) – Web framework for Node.js
- [DrizzleORM](https://orm.drizzle.team/) – TypeScript-first ORM for SQL databases
- [Prettier](https://prettier.io/) – Code formatter for consistent style
