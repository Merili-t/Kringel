# Database

### Key Legend

- **PK** — Primary Key
- **FK** — Foreign Key
- **N** — NOT NULL

## user

| Name       | Type         | Key   | Notes                 |
| ---------- | ------------ | ----- | --------------------- |
| id         | CHAR(36)     | PK, N | UUID                  |
| email      | VARCHAR(255) | N     | Should be UNIQUE      |
| username   | VARCHAR(255) | N     | Should be UNIQUE      |
| created_at | TIMESTAMP    |       | Set automatically     |
| updated_at | TIMESTAMP    |       | Updated automatically |

## user_admin

| Name       | Type         | Key   | Notes                 |
| ---------- | ------------ | ----- | --------------------- |
| id         | CHAR(36)     | PK, N | UUID                  |
| email      | VARCHAR(255) | N     | Should be UNIQUE      |
| password   | VARCHAR(255) | N     | Hashed (argon2)       |
| created_at | TIMESTAMP    |       | Set automatically     |
| updated_at | TIMESTAMP    |       | Updated automatically |

## user_answer

| Name        | Type      | Key   | Notes                     |
| ----------- | --------- | ----- | ------------------------- |
| id          | CHAR(36)  | PK, N | UUID                      |
| user_id     | CHAR(36)  | FK, N | References `user(id)`     |
| question_id | CHAR(36)  | FK, N | References `question(id)` |
| answer      | TEXT      |       |                           |
| points      | INTEGER   | N     | DEFAULT 0                 |
| created_at  | TIMESTAMP |       | Set automatically         |
| updated_at  | TIMESTAMP |       | Updated automatically     |

## test

| Name        | Type         | Key   | Notes                       |
| ----------- | ------------ | ----- | --------------------------- |
| id          | CHAR(36)     | PK, N | UUID                        |
| admin_id    | CHAR(36)     | FK, N | Referances `user_admin(id)` |
| name        | VARCHAR(255) | N     |                             |
| description | TEXT         | N     |                             |
| start       | DATETIME     | N     |                             |
| end         | DATETIME     | N     |                             |
| time_limit  | INTEGER      | N     | In minutes                  |
| created_at  | TIMESTAMP    |       | Set automatically           |
| updated_at  | TIMESTAMP    |       | Updated automatically       |

## test_attempt

| Name       | Type      | Key   | Notes                 |
| ---------- | --------- | ----- | --------------------- |
| id         | CHAR(36)  | PK, N | UUID                  |
| test_id    | CHAR(36)  | FK, N | Referances `test(id)` |
| user_id    | CHAR(36)  | FK, N | Referance `user(id)`  |
| start      | DATETIME  | N     |                       |
| end        | DATETIME  | N     |                       |
| score      | INTEGER   | N     | DEFAULT 0             |
| created_at | TIMESTAMP |       | Set automatically     |
| updated_at | TIMESTAMP |       | Updated automatically |

## question

| Name         | Type      | Key   | Notes                          |
| ------------ | --------- | ----- | ------------------------------ |
| id           | CHAR(36)  | PK, N | UUID                           |
| block_id     | CHAR(36)  | FK, N | Referances `block(id)`         |
| type_id      | CHAR(36)  | FK, N | Referances `question_type(id)` |
| order_number | INTEGER   | N     |                                |
| description  | TEXT      | N     |                                |
| points       | INTEGER   | N     | DEFAULT 0                      |
| created_at   | TIMESTAMP |       | Set automatically              |
| updated_at   | TIMESTAMP |       | Updated automatically          |

## question_type

| Name       | Type         | Key   | Notes                 |
| ---------- | ------------ | ----- | --------------------- |
| id         | CHAR(36)     | PK, N | UUID                  |
| name       | VARCHAR(255) | N     |                       |
| created_at | TIMESTAMP    |       | Set automatically     |
| updated_at | TIMESTAMP    |       | Updated automatically |

## block

| Name         | Type      | Key   | Notes                 |
| ------------ | --------- | ----- | --------------------- |
| id           | CHAR(36)  | PK, N | UUID                  |
| test_id      | CHAR(36)  | FK, N | Referances `test(id)` |
| order_number | INTEGER   | N     |                       |
| created_at   | TIMESTAMP |       | Set automatically     |
| updated_at   | TIMESTAMP |       | Updated automatically |

## answer_variant

| Name       | Type      | Key   | Notes                 |
| ---------- | --------- | ----- | --------------------- |
| id         | CHAR(36)  | PK, N | UUID                  |
| correct    | BOOLEAN   | N     | DEFAULT FALSE         |
| answer     | TEXT      | N     |                       |
| created_at | TIMESTAMP |       | Set automatically     |
| updated_at | TIMESTAMP |       | Updated automatically |
