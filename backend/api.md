# API Documentation

## /auth

### POST /auth/register

Registers a new user or guest.

#### Request Body (JSON)

For teacher:

```json
{
  "email": "user@example.com",
  "password": "1234",
  "userType": "teacher"
}
```

For guests:

```json
{
  "email": "guest@kringel.ee",
  "name": "guest1, guest2",
  "userType": "guest"
}
```

#### Responses

- `200 OK`: Account created and logged in.
- `400 Bad Request`: Missing or invalid fields.
- `500 Internal Server Error`: Could not create user.

### POST /auth/login

Logs in a teacher using email and password.

#### Request Body (JSON)

```json
{
  "email": "teacher@kringel.ee",
  "password": "1234"
}
```

#### Responses

- `200 OK`: Logged in, JWT token set in cookie.
- `400 Bad Request`: Missing fields.
- `401 Unauthorized`: Wrong email or password.

### GET /auth/logout

Logs user out.

#### Responses

- `200 OK`: Logged in, JWT token set in cookie.
- `400 Bad Request`: Missing fields.
- `401 Unauthorized`: Wrong email or password.

---

## /admin

## GET /admin/users

Returns all users.

#### Response

```json
{
  "users": [
    {
      "id": "uuid-v7-string",
      "email": "admin@kringel.ee",
      "password": "super-secret-password",
      "userType": "admin",
      "createdAt": "2025-06-13T23:15:54.000Z",
      "updatedAt": "2025-06-13T23:15:54.000Z"
    },
    {
      "id": "uuid-v7-string",
      "email": "teacher@kringel.ee",
      "password": "super-secret-password",
      "userType": "teacher",
      "createdAt": "2025-06-13T23:15:54.000Z",
      "updatedAt": "2025-06-13T23:19:28.000Z"
    }
  ]
}
```

### PATCH /admin/password

#### Request Body (JSON)

```json
{
  "id": "uuid-v7-string",
  "password": "1234"
}
```

#### Response

```json
{
  "message": "Password changed"
}
```


### DELETE /admin/delete/:id

Deletes user.

#### Responses

```json
{
  "message": "User deleted"
}
```

#### URL parameters

- `:id` — UUID of the user

---

## /test

## POST /test/upload

#### Request Body (JSON)

```json
{
  "name": "test",
  "description": "Fun test",
  "start": "2025-06-08 13:24:19",
  "end": "2025-06-08 13:24:19",
  "timeLimit": 60
}
```

#### Response

```json
{
  "message": "Test created",
  "id": "uuid-v7-string",
  "blockId": "uuid-v7-string"
}
```

## GET /test/:id

Return test with specific id.

#### Response

```json
{
  "id": "uuid-v7-string",
  "userId": "uuid-v7-string",
  "name": "test",
  "description": "Fun test",
  "start": "2025-06-08T13:24:19.000Z",
  "end": "2025-06-08T13:24:19.000Z",
  "timeLimit": 60,
  "createdAt": "2025-06-11T09:26:44.000Z",
  "updatedAt": "2025-06-11T09:26:44.000Z",
  "questions": 3
}
```

#### URL parameters

- `:id` — UUID of the test

## GET /test/tests

Returns all tests.

#### Response

```json
{
  "tests": [
    {
      "id": "uuid-v7-string",
      "userId": "uuid-v7-string",
      "name": "test",
      "description": "Fun test",
      "start": "2025-06-08T13:24:19.000Z",
      "end": "2025-06-08T13:24:19.000Z",
      "timeLimit": 60,
      "createdAt": "2025-06-11T09:26:44.000Z",
      "updatedAt": "2025-06-11T09:26:44.000Z",
      "questions": 3
    },
    {
      "id": "uuid-v7-string",
      "userId": "uuid-v7-string",
      "name": "test",
      "description": "Fun test",
      "start": "2025-06-08T13:24:19.000Z",
      "end": "2025-06-08T13:24:19.000Z",
      "timeLimit": 60,
      "createdAt": "2025-06-11T09:55:35.000Z",
      "updatedAt": "2025-06-11T09:55:35.000Z",
      "questions": 3
    }
  ]
}
```

### DELETE /test/delete/:id

Deletes test.

#### Responses

```json
{
  "message": "Test deleted"
}
```

---

## /block

## POST /block/upload

#### Request Body (JSON)

```json
{
  "testId": "uuid-v7-string",
  "blockNumber": 1
}
```

#### Response

```json
{
  "message": "Block created",
  "id": "uuid-v7-string"
}
```

## GET /block/test/:testId

Get all blocks for a test.

#### Response

```json
{
  "blocks": [
    {
      "id": "uuid-v7-string",
      "testId": "uuid-v7-string",
      "blockNumber": 1,
      "createdAt": "2025-06-11T10:16:50.000Z",
      "updatedAt": "2025-06-11T10:16:50.000Z"
    }
  ]
}
```

#### URL parameters

- `:testId` — UUID of the test you want to get the blocks for.

## GET /block/:id

Get a block with id.

#### Response

```json
{
  "id": "uuid-v7-string",
  "testId": "uuid-v7-string",
  "blockNumber": 1,
  "createdAt": "2025-06-11T10:16:50.000Z",
  "updatedAt": "2025-06-11T10:16:50.000Z"
}
```

#### URL parameters

- `:id` — UUID of the block.

### DELETE /block/delete/:id

Deletes block.

#### Responses

```json
{
  "message": "Block deleted"
}
```

---

## /question

## POST /question/upload

#### Request Body (JSON)

##### Regular question

```json
{
  "blockId": "uuid-v7-string",
  "question": "This is a hard question",
  "points": 10,
  "answerType": 0,
  "orderNumber": 1,
  "answerVariables": [
    { "correct": true, "answer": "This is the first option" },
    { "correct": false, "answer": "This is the second option" }
  ]
}
```

The `answerVariables` is optional.

##### Matrix question

```json
{
  "blockId": "uuid-v7-string",
  "question": "This is a matrix question",
  "points": 10,
  "answerType": 3,
  "orederNumber": 2,
  "answerVariables": [
    {
      "blockId": "uuid-v7-string",
      "question": "This is a hard question",
      "points": 10,
      "answerType": 0,
      "orderNumber": 1,
      "answerVariables": [
        { "correct": true, "answer": "This is the first option" },
        { "correct": false, "answer": "This is the second option" }
      ]
    },
    {
      "blockId": "uuid-v7-string",
      "question": "This is a hard question",
      "points": 10,
      "answerType": 0,
      "orderNumber": 1,
      "answerVariables": [
        { "correct": true, "answer": "This is the first option" },
        { "correct": false, "answer": "This is the second option" }
      ]
    }
  ]
}
```

#### Response

```json
{
  "message": "Question created",
  "id": "uuid-v7-string"
}
```

##### Answer types:

```json
{
  "one_correct": 0,
  "many_correct": 1,
  "text": 2,
  "matrix": 3,
  "picture": 4,
  "chemistry": 5,
  "drawing": 6,
  "calculator": 7,
  "chemisrtyPicture": 8
}
```

## GET /question/block/:blockId

Get all questions that belong to block.

#### Response

##### Regular question

```json
{
  "blockQuestions": [
    {
      "id": "uuid-v7-string",
      "blockId": "uuid-v7-string",
      "matrixId": null,
      "type": 0,
      "orderNumber": 1,
      "description": "This is a hard question",
      "points": 10,
      "createdAt": "2025-06-11T11:02:48.000Z",
      "updatedAt": "2025-06-11T11:02:48.000Z"
    }
  ]
}
```

##### Matrix question

```json
{
  "id": "uuid-v7-string",
  "question": "This is a matrix question",
  "points": 10,
  "answerType": 4,
  "answerVariables": [
    {
      "id": "uuid-v7-string",
      "question": "This is a matrix question question",
      "points": 10,
      "answerType": 0,
      "answerVariables": [
        { "correct": true, "answer": "This is the first option" },
        { "correct": false, "answer": "This is the second option" }
      ]
    },
    {
      "id": "uuid-v7-string",
      "question": "This is a matrix question question",
      "points": 10,
      "answerType": 1,
      "answerVariables": [
        { "correct": true, "answer": "This is the first option" },
        { "correct": true, "answer": "This is the second option" },
        { "correct": false, "answer": "This is the false option" }
      ]
    }
  ],
  "blockId": "uuid-v7-string"
}
```

#### URL parameters

- `:blockId` — UUID of the block.

## GET /question/:id

Get question by id.

#### Response

##### Regular question

```json
{
  "id": "uuid-v7-string",
  "blockId": "uuid-v7-string",
  "matrixId": null,
  "type": 0,
  "orderNumber": 1,
  "description": "This is a hard question",
  "points": 10,
  "createdAt": "2025-06-11T11:02:48.000Z",
  "updatedAt": "2025-06-11T11:02:48.000Z"
}
```

##### Matrix question

```json
{
  "id": "uuid-v7-string",
  "question": "This is a matrix question",
  "points": 10,
  "answerType": 4,
  "answerVariables": [
    {
      "id": "uuid-v7-string",
      "question": "This is a matrix question question",
      "points": 10,
      "answerType": 0,
      "answerVariables": [
        { "correct": true, "answer": "This is the first option" },
        { "correct": false, "answer": "This is the second option" }
      ]
    },
    {
      "id": "uuid-v7-string",
      "question": "This is a matrix question question",
      "points": 10,
      "answerType": 1,
      "answerVariables": [
        { "correct": true, "answer": "This is the first option" },
        { "correct": true, "answer": "This is the second option" },
        { "correct": false, "answer": "This is the false option" }
      ]
    }
  ],
  "blockId": "uuid-v7-string"
}
```

#### URL parameters

- `:id` — UUID of the question.

### DELETE /question/delete/:id

Deletes question.

#### Responses

```json
{
  "message": "Question deleted"
}
```

---

## /variant

### DELETE /variant/delete/:id

Deletes answer variant.

#### Responses

```json
{
  "message": "Answer variant deleted"
}
```

---

## /team

### POST /team/attempt/upload

#### Request Body (JSON)
```json
{
  "testId": "uuid-v7-string",
  "teamId": "uuid-v7-string",
  "start": "2025-06-13T23:15:54.000Z"
}
```

#### Responses

```json
{
  "message": "Test attempt created",
  "id": "uuid-v7-string"
}
```

### POST /team/answer/upload

#### Request Body (JSON)
```json
{
  "attemptId": "uuid-v7-string",
  "questionId": "uuid-v7-string",
  "variantId": "uuid-v7-string",
  "answer": "Tihis is as test answer",
  "questionType": 2
}
```

The `variantId`, `answer`, `questionType` are optional.

#### Responses

```json
{
  "message": "Team answer uploaded"
}
```

### PATCH /team/attempt/update

#### Request Body (JSON)
```json
{
  "id": "uuid-v7-string",
  "end": "2025-06-13T23:19:28.000Z"
}
```

#### Responses

```json
{
  "message": "Test attempt updated"
}
```

### GET /team/team/:id

Get team by id.

#### Responses

```json
{
  "id": "uuid-v7-string",
  "email": "team1@kringel.ee",
  "name": "Jhon, Joe, Peter",
  "createdAt": "2025-06-16T08:43:42.000Z",
  "updatedAt": "2025-06-16T08:43:42.000Z"
}
```

### GET /team/attempt/:id

Get attempt by id.

#### Responses

```json
{
  "id": "uuid-v7-string",
  "testId": "uuid-v7-string",
  "teamId": "uuid-v7-string",
  "start": "2025-06-16T08:43:42.000Z",
  "end": "2025-06-16T08:43:42.000Z",
  "score": 0,
  "createdAt": "2025-06-16T08:43:42.000Z",
  "updatedAt": "2025-06-16T08:43:42.000Z"
}
```

### GET /team/answer/:id

Get answer by id.

#### Responses

```json
{
  "id": "uuid-v7-string",
  "attemptId": "uuid-v7-string",
  "questionId": "uuid-v7-string",
  "variantId": "uuid-v7-string",
  "answer": null,
  "points": 0,
  "createdAt": "2025-06-16T08:43:42.000Z",
  "updatedAt": "2025-06-16T08:43:42.000Z"
}
```

### GET /team/teams

Get teams.

#### Responses

```json
{
  "teams": [
    {
      "id": "uuid-v7-string",
      "email": "team1@kringel.ee",
      "name": "Jhon, Joe, Peter",
      "createdAt": "2025-06-16T08:43:42.000Z",
      "updatedAt": "2025-06-16T08:43:42.000Z"
    }
}
```

### GET /team/attempts

Get attempts.

#### Responses

```json
{
  "attempts": [
    {
      "id": "uuid-v7-string",
      "testId": "uuid-v7-string",
      "teamId": "uuid-v7-string",
      "start": "2025-06-16T08:43:42.000Z",
      "end": "2025-06-16T08:43:42.000Z",
      "score": 0,
      "createdAt": "2025-06-16T08:43:42.000Z",
      "updatedAt": "2025-06-16T08:43:42.000Z"
    }
}
```

### GET /team/answers

Get answers.

#### Responses

```json
{
  "answers": [
    {
      "id": "uuid-v7-string",
      "attemptId": "uuid-v7-string",
      "questionId": "uuid-v7-string",
      "variantId": "uuid-v7-string",
      "answer": null,
      "points": 0,
      "createdAt": "2025-06-16T08:43:42.000Z",
      "updatedAt": "2025-06-16T08:43:42.000Z"
    }
}
```

---

## Other

## Cookies

- A secure, HTTP-only `token` cookie is set on successful login/register.
- Cookie expires in 1 hour.

## Auth Notes

- Use the `token` cookie for protected routes.
- Currently, JWT includes `id` and `userType`.
- Token secret is defined in `process.env.TOKEN_SECRET`.

## Development Setup

- No HTTPS required in development (secure cookies disabled when `NODE_ENV !== 'production'`).
