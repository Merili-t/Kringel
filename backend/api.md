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

## Cookies

- A secure, HTTP-only `token` cookie is set on successful login/register.
- Cookie expires in 1 hour.

## Auth Notes

- Use the `token` cookie for protected routes.
- Currently, JWT includes `id` and `userType`.
- Token secret is defined in `process.env.TOKEN_SECRET`.

## Development Setup

- No HTTPS required in development (secure cookies disabled when `NODE_ENV !== 'production'`).
