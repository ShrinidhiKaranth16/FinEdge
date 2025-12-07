# FinEdge – Personal Finance & Expense Tracker API

Build a RESTful API backend for a personal finance tracker using Node.js and Express,
demonstrating asynchronous programming, modular architecture, and clean REST design.
Users can create accounts, add income or expenses, view summaries, and generate
monthly insights

## Project Setup

Add .env file in root folder and add PORT

```
PORT = 3000
```

## Install Dependencies

```
npm install
```

## Run Development Server

Running the Server

```
npm run dev
```

## Verify with

```
http://localhost:5001/health

Expected:
{ "status": "ok", "timestamp": "..." }
```

## To run the test cases

```
npm run test
```

## What’s Ready Now

- Server fully running
- Health route
- User registration API
- transactions API
- budgets API
- Error-handling and validation
- JSON persistence
- Logging
- Jest + Supertest test suite

## ✨ Features

- Logging Middleware Logs every request with:
  - method
  - URL
  - status code
  - response time
- Input Validation Middleware
  - Ensures request body data follow required rules.
- Global Error Handler
  - Standardized error response using a custom AppError class.
- File-Based Persistence
  - In-memory model (easy to replace with DB)
  - Using fs/promises
- Services Layer handles

  - business login
  - Validate data beyond simple “required” checks
  - hashing passwords
  - checking existing email
  - generating uuids
  - saving data

- MVC Separation The project follows:

  - routes
  - controllers
  - services
  - models pattern.

- CRUD for all routes
- Clean layered architecture
- Jest-based automated test cases

## API Endpoints

| Method |     Endpoint      |         Description          |
| ------ | :---------------: | :--------------------------: |
| POST   |      /users       |       create new user        |
| GET    |   /transactions   |     get all transactions     |
| GET    | /transactions/:id |   get a transaction by id    |
| POST   |   /transactions   |      create transaction      |
| PATCH  | /transactions/:id | update the transaction by id |
| DELETE | /transactions/:id | delete the transaction by id |

# /users

## Route: POST /users

Purpose: Register new users

## Validation:

- name: required
- email: valid + unique
- password: min. 6 chars

## Behavior:

- Passwords are hashed using bcryptjs
- User is stored inside src/data/users.json
- Duplicate emails return 409
- Validation errors return 400

## Example Response

```
POST /users

Request Body
{
"name": "Sanath",
"email": "sanath@example.com",
"password": "secret123"
}

Response Body
{
"success" : "true",
"data": {
"id": "auto-generated",
"name": "Sanath",
"email": "sanath@example.com",
"createdAt": "..."
}
}
```

## What is tested

POST /users

- Missing fields → 400
- Invalid email → 400
- Short password → 400
- Successful user creation → 201
- Duplicate email → 409

# /transactions

## Route: POST /transactions

Purpose: create a transaction

## Validation:

- type: required & should be either "income"/"expense"
- amount: required, should be not negative and less that zero
- category : required

## Behavior:

- if any value missed returns 400

## Example Response

```
POST /transactions

Request Body
{
  "type": "income",
  "amount": 1000,
  "category": "utilities",
}

Response Body
{
  "id": "uuid",
  "type": "income",
  "amount": 1000,
  "category": "utilities",
  "date": "2024-01-01T12:00:00Z"
}
```

## Route: GET /transactions

Purpose: get all transactions

## Example Response

```
GET /transactions

Response Body

{
  "success": true,
  "count": 25,
  "data": [
    {
      "id": "0a3a614c-1df4-453b-a7c1-6189759115e0",
      "type": "income",
      "category": "utilities",
      "amount": 2163.88,
      "date": "2024-11-15"
    },
    {
      "id": "d3c3cb63-c1b3-4c57-94f7-f45f78697c45",
      "type": "income",
      "category": "shopping",
      "amount": 2042.92,
      "date": "2024-01-12"
    },
    {
      "id": "18086538-e84b-4fe4-9f13-4421c3d0667b",
      "type": "income",
      "category": "food",
      "amount": 1287.34,
      "date": "2024-10-10"
    },
    {
      "id": "46410455-6df7-4aca-adf1-cb92949bbf1d",
      "type": "expense",
      "category": "food",
      "amount": 4671.52,
      "date": "2024-05-14"
    },
    ...
  ]}

```

## Route: GET /transactions/:id

Purpose: get a transaction by id

## Example Response

```
GET /transactions/:id

Request Headers
Authorization : Bearer {token}

Response Body
{
  "success": true,
  "data": {
    "id": "0a3a614c-1df4-453b-a7c1-6189759115e0",
    "type": "income",
    "category": "utilities",
    "amount": 2163.88,
    "date": "2024-11-15"
  }
}

```

## Route: PATCH /transactions/:id

Purpose: update a transaction by id

## Validation:

- type: required & should be either "income"/"expense"
- amount: required, should be not negative and less that zero
- category : required

## Behavior:

- checks if any one is available else throws error

## Example Response

```
PATCH /transactions/:id

Request Headers
Authorization : Bearer {token}

Request Body
{
  "amount": 2000
}

Response Body
{
    "success": true,
    "data": {
        "id": "18086538-e84b-4fe4-9f13-4421c3d0667b",
        "type": "income",
        "category": "food",
        "amount": 200,
        "date": "2024-10-10",
        "updatedAt": "2025-12-07T14:07:04.380Z"
    }
}

```

## Route: DELETE /transactions/:id

Purpose: delete a transaction by id

```
DELETE /transactions/:id

Response Body
{
    "success": true,
    "message": "Transaction deleted successfully"
}

```
