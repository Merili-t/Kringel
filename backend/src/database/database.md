# Database

### Key Legend

- **PK** — Primary Key
- **FK** — Foreign Key
- **N** — NOT NULL

## user

| Name       | Type         | Key   | Notes                               |
| ---------- | ------------ | ----- | ----------------------------------- |
| id         | CHAR(36)     | PK, N | UUID                                |
| email      | VARCHAR(255) | N, U  | Must be UNIQUE                      |
| password   | VARCHAR(255) | N     | Required                            |
| userType   | ENUM         | N     | One of: `admin`, `teacher`, `guest` |
| created_at | TIMESTAMP    |       | Set automatically                   |
| updated_at | TIMESTAMP    |       | Updated automatically               |

## team

| Name       | Type         | Key   | Notes                 |
| ---------- | ------------ | ----- | --------------------- |
| id         | CHAR(36)     | PK, N | UUID                  |
| email      | VARCHAR(255) | N     | Required              |
| teamName   | text         | N     | Required              |
| names      | text         | N     | Required              |
| school     | VARCHAR(255) | N     | Required              |
| link       | VARCHAR(255) | N     | Required              |
| created_at | TIMESTAMP    |       | Set automatically     |
| updated_at | TIMESTAMP    |       | Updated automatically |

## team_answer

| Name        | Type      | Key   | Notes                     |
| ----------- | --------- | ----- | ------------------------- |
| id          | CHAR(36)  | PK, N | UUID                      |
| attempt_id  | CHAR(36)  | FK, N | References `attempt(id)`  |
| question_id | CHAR(36)  | FK, N | References `question(id)` |
| variant_id  | CHAR(36)  | FK    | References `variant(id)`  |
| answer      | TEXT      |       |                           |
| points      | INTEGER   | N     | DEFAULT 0                 |
| created_at  | TIMESTAMP |       | Set automatically         |
| updated_at  | TIMESTAMP |       | Updated automatically     |

## test

| Name        | Type         | Key   | Notes                 |
| ----------- | ------------ | ----- | --------------------- |
| id          | CHAR(36)     | PK, N | UUID                  |
| user_id     | CHAR(36)     | FK, N | Referances `user(id)` |
| name        | VARCHAR(255) | N     | Required              |
| description | TEXT         | N     | Required              |
| start       | DATETIME     | N     | Required              |
| end         | DATETIME     | N     | Required              |
| time_limit  | INTEGER      | N     | In minutes            |
| created_at  | TIMESTAMP    |       | Set automatically     |
| updated_at  | TIMESTAMP    |       | Updated automatically |

## test_attempt

| Name       | Type      | Key   | Notes                 |
| ---------- | --------- | ----- | --------------------- |
| id         | CHAR(36)  | PK, N | UUID                  |
| test_id    | CHAR(36)  | FK, N | Referances `test(id)` |
| team_id    | CHAR(36)  | FK, N | Referance `team(id)`  |
| start      | DATETIME  | N     | Required              |
| end        | DATETIME  |       |                       |
| score      | INTEGER   | N     | DEFAULT 0             |
| created_at | TIMESTAMP |       | Set automatically     |
| updated_at | TIMESTAMP |       | Updated automatically |

## question

| Name         | Type        | Key   | Notes                   |
| ------------ | ----------- | ----- | ----------------------- |
| id           | CHAR(36)    | PK, N | UUID                    |
| block_id     | CHAR(36)    | FK, N | Referances `block(id)`  |
| matrix_id    | CHAR(36)    | FK    | Referances `matrix(id)` |
| type         | INTEGER     | N     | Required                |
| order_number | INTEGER     | N     | Required                |
| description  | TEXT        | N     | Required                |
| points       | INTEGER     | N     | DEFAULT 0               |
| link         | VARCAR(255) |       | DEFAULT null            |
| created_at   | TIMESTAMP   |       | Set automatically       |
| updated_at   | TIMESTAMP   |       | Updated automatically   |

## question_matrix

| Name         | Type        | Key   | Notes                  |
| ------------ | ----------- | ----- | ---------------------- |
| id           | CHAR(36)    | PK, N | UUID                   |
| block_id     | CHAR(36)    | FK, N | Referances `block(id)` |
| order_number | INTEGER     | N     | Required               |
| description  | TEXT        |       |                        |
| points       | INTEGER     | N     | DEFAULT 0              |
| link         | VARCAR(255) |       | DEFAULT null           |
| created_at   | TIMESTAMP   |       | Set automatically      |
| updated_at   | TIMESTAMP   |       | Updated automatically  |

## block

| Name         | Type      | Key   | Notes                 |
| ------------ | --------- | ----- | --------------------- |
| id           | CHAR(36)  | PK, N | UUID                  |
| test_id      | CHAR(36)  | FK, N | Referances `test(id)` |
| block_number | INTEGER   | N     | Required              |
| created_at   | TIMESTAMP |       | Set automatically     |
| updated_at   | TIMESTAMP |       | Updated automatically |

## answer_variant

| Name        | Type      | Key   | Notes                 |
| ----------- | --------- | ----- | --------------------- |
| id          | CHAR(36)  | PK, N | UUID                  |
| question_id | CHAR(36)  | FK, N | UUID                  |
| correct     | BOOLEAN   | N     | DEFAULT FALSE         |
| answer      | TEXT      | N     | Required              |
| created_at  | TIMESTAMP |       | Set automatically     |
| updated_at  | TIMESTAMP |       | Updated automatically |
