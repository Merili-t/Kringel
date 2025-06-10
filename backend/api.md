# API Documentation

## /user

### POST /user/register

Registers a new user or guest.

#### Request Body (JSON)

For regular users:

```json
{
  "email": "user@example.com",
  "username": "myuser",
  "password": "securePassword123",
  "userType": "student"
}
```

For guests:

```json
{ "username": "guest123", "userType": "guest" }
```

#### Responses

- `200 OK`: Account created and logged in.
- `400 Bad Request`: Missing or invalid fields.
- `500 Internal Server Error`: Could not create user.

---

### POST /user/login

Logs in a user using email and password.

#### Request Body (JSON)

```json
{ "email": "user@example.com", "password": "securePassword123" }
```

#### Responses

- `200 OK`: Logged in, JWT token set in cookie.
- `400 Bad Request`: Missing fields.
- `401 Unauthorized`: Wrong email or password.

### GET /user/\:id

Returns public information for a user.

#### URL Parameters

- `:id` — UUID of the user

#### Response

```json
{ "id": "uuid-v7-string", "email": "user@example.com", "username": "myuser", "userType": "student" }
```

- `200 OK`: User found.
- `404 Not Found`: No user with given ID.

---

## POST /test/upload

#### Request Body (JSON)

```json
{
  "name": "test",
  "descripion": "Fun test",
  "start": "2025-06-08 13:24:19",
  "end": "2025-06-08 13:24:19",
  "timelimit": 60,
  "block": [
    {
      "blockNumber": 1,
      "blockQuestions": [
        {
          "question": "This is a hard question",
          "points": 10,
          "answerType": 0,
          "answerVariables": [
            { "correct": true, "answer": "This is the first option" },
            { "correct": false, "answer": "This is the second option" }
          ]
        },
        {
          "question": "This is a easy question",
          "points": 5,
          "answerType": 1,
          "answerVariables": [
            { "correct": true, "answer": "This is the first option" },
            { "correct": true, "answer": "This is the second option" },
            { "correct": false, "answer": "This is the third option" }
          ]
        }
      ]
    },
    {
      "blockNumber": 2,
      "blockQuestions": [
        {
          "question": "This is a matrix question",
          "points": 10,
          "answerType": 4,
          "answerVariables": [
            {
              "question": "This is a matrix question question",
              "points": 10,
              "answerType": 0,
              "answerVariables": [
                { "correct": true, "answer": "This is the first option" },
                { "correct": false, "answer": "This is the second option" }
              ]
            },
            {
              "question": "This is a matrix question question",
              "points": 10,
              "answerType": 1,
              "answerVariables": [
                { "correct": true, "answer": "This is the first option" },
                { "correct": true, "answer": "This is the second option" },
                { "correct": false, "answer": "This is the false option" }
              ]
            }
          ]
        }
      ]
    }
  ]
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
  "drawing": 6
}
```

## Cookies

- A secure, HTTP-only `token` cookie is set on successful login/register.
- Cookie expires in 1 hour.

## Auth Notes

- Use the `token` cookie for protected routes.
- Currently, JWT includes `id` and `userType`.
- Token secret is defined in `process.env.TOKEN_SECRET`.

## Development Setup

- No HTTPS required in development (secure cookies disabled when `NODE_ENV !== 'production'`).
