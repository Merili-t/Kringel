# How to Use an API with `fetch`

> Text in `{}` is meant to be replaced (including the curly braces).

## Fetch

#### Fetch Overview

```js
await fetch('url', {
  method: 'METHOD', // GET or POST
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ // only needed for POST
    // your data here
  })
});
```

### Details

#### URL

For development, you usually use `http://localhost:{server port}/`.

##### Examples

* **Example 1**

In our API documentation, you might see: `GET /test/:id`.
If your server runs on port `3006`, the URL would be:

```
http://localhost:3006/test/{testId}
```

* **Example 2**

If the documentation says: `POST /test/upload`,
then the URL should be:

```
http://localhost:3006/test/upload
```

#### How to Read API Documentation

> The data shown in the documentation is just an example.
> (The data is usually shown after a `:`)

---

### POST Routes

###### Example from API Documentation:

> ## POST /test/upload
>
> #### Request Body (JSON)
>
> ```json
> {
>   "name": "test",
>   "description": "Fun test",
>   "start": "2025-06-08 13:24:19",
>   "end": "2025-06-08 13:24:19",
>   "timeLimit": 60
> }
> ```
>
> #### Response
>
> ```json
> { "message": "Test created", "id": "uuid-v7-string" }
> ```

---

### Title (`POST /test/upload`)

The first part (POST) tells you what HTTP method to use with `fetch`.
In this case, it's a `POST` request.

Sometimes there’s a short description under the title that explains what the route does.

---

### Request (`Request Body (JSON)`)

> This section only applies to POST requests.

This part shows what data the API expects and what types they are.
For example:

* `"name"` is a `string` because it’s in quotes.
* `"timeLimit"` is a `number` (or `int`) because it's not in quotes.

**Spelling and capitalization must match exactly** what the documentation shows.

---

### Response

This section shows what you get back after a successful request.

For example:

```json
{ "message": "Test created", "id": "uuid-v7-string" }
```

This means you get a confirmation `message` and the `id` of the created test.

---

### In Code (POST)

Here’s what the fetch call would look like for this route:

```js
const response = await fetch('http://localhost:3006/test/upload', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: "test",
    description: "Fun test",
    start: "2025-06-08 13:24:19",
    end: "2025-06-08 13:24:19",
    timeLimit: 60
  })
});
const data = await response.json();

/*
data = {
  message: "Test created",
  id: "uuid-v7-string"
}
*/
```

> You can use variables in the `body` object like `name: nameVariable`.
> To access response data, use dot notation: `data.message`.

---

### GET Routes

###### Example from API Documentation:

> ## GET /test/\:id
>
> Returns a test with a specific ID.
>
> #### Response
>
> ```json
> {
>   "id": "uuid-v7-string",
>   "userId": "uuid-v7-string",
>   "name": "test",
>   "description": "Fun test",
>   "start": "2025-06-08T13:24:19.000Z",
>   "end": "2025-06-08T13:24:19.000Z",
>   "timeLimit": 60,
>   "createdAt": "2025-06-11T09:26:44.000Z",
>   "updatedAt": "2025-06-11T09:26:44.000Z"
> }
> ```
>
> #### URL Parameters
>
> * `:id` — UUID of the test

---

### Parameters (URL Parameters)

URL parameters tell you what dynamic values you need to include in the route.

---

### In Code (GET)

```js
const response = await fetch(`http://localhost:3006/test/${testId}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
});
const data = await response.json();

/*
data = {
  id: "uuid-v7-string",
  userId: "uuid-v7-string",
  name: "test",
  description: "Fun test",
  start: "2025-06-08T13:24:19.000Z",
  end: "2025-06-08T13:24:19.000Z",
  timeLimit: 60,
  createdAt: "2025-06-11T09:26:44.000Z",
  updatedAt: "2025-06-11T09:26:44.000Z"
}
*/
```

> You can insert variables into the URL using backticks and `${}`:
> Example: `` `http://localhost:3006/test/${testId}` ``
