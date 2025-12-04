Running the Server

Start in development mode:
nodemon src/server.js

Verify with:
http://localhost:5001/health

Expected:
{ "status": "ok", "timestamp": "..." }

User Registration API
- Route: POST /users
- Purpose: Register new users

Validation:
- name: required
- email: valid + unique
- password: min. 6 chars

Behavior:
- Passwords are hashed using bcryptjs
- User is stored inside src/data/users.json
- Duplicate emails return 409
- Validation errors return 400

Sample Request
{
  "name": "Sanath",
  "email": "sanath@example.com",
  "password": "secret123"
}

Sample Success Response
{
  "status": "success",
  "data": {
    "id": "auto-generated",
    "name": "Sanath",
    "email": "sanath@example.com",
    "createdAt": "..."
  }
}

Key Features Implemented

1. Logging Middleware
Logs every request with:
- method
- URL
- status code
- response time

2. Input Validation Middleware
- Ensures name, email, password follow required rules.

3. Global Error Handler
- Standardized error response using a custom AppError class.

4. File-Based Persistence
Stored in:
src/data/users.json

Using fs/promises

5. Services Layer (Business Logic)
userService.js handles:
- hashing passwords
- checking existing email
- generating user IDs
- saving data

6. MVC Separation
The project follows:
- routes
- controllers
- services
- models
pattern.

--------------------

Testing (Jest + Supertest)

Run Tests
npm test

What is tested

POST /users
- Missing fields → 400
- Invalid email → 400
- Short password → 400
- Successful user creation → 201
- Duplicate email → 409

Placeholder test files are included for:
- transaction.test.js
- summary.test.js

These will be expanded when those modules are implemented.

----------------------

What’s Ready Now

- Server fully running
- Health route
- User registration API
- Error-handling and validation
- JSON persistence
- Logging
- Jest + Supertest test suite