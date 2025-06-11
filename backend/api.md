# API Documentation

## /auth

### POST /auth/register

Registers a new user or guest.

#### Request Body (JSON)

For teacher:

```json
{ "email": "user@example.com", "password": "1234", "userType": "teacher" }
```

For guests:

```json
{ "email": "guest@kringel.ee", "name": "guest1, guest2", "userType": "guest" }
```

#### Responses

- `200 OK`: Account created and logged in.
- `400 Bad Request`: Missing or invalid fields.
- `500 Internal Server Error`: Could not create user.

---

### POST /auth/login

Logs in a teacher using email and password.

#### Request Body (JSON)

```json
{ "email": "teacher@kringel.ee", "password": "1234" }
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
{ "message": "Test created", "id": "uuid-v7-string" }
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
  "updatedAt": "2025-06-11T09:26:44.000Z"
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
      "updatedAt": "2025-06-11T09:26:44.000Z"
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
      "updatedAt": "2025-06-11T09:55:35.000Z"
    }
  ]
}
```

## /block

## POST /block/upload

#### Request Body (JSON)

```json
{ "testId": "uuid-v7-string", "blockNumber": 1 }
```

#### Response

```json
{ "message": "Block created", "id": "uuid-v7-string" }
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
{ "message": "Question created", "id": "uuid-v7-string" }
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
  "calculator": 7
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
