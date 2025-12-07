## ✨ Features

- CRUD for transactions
- Clean layered architecture
- Centralized custom error handling
- Jest-based automated test cases
- Validation inside controllers
- In-memory model (easy to replace with DB)

## API Endpoints

| Method |     Endpoint      |         Description          |
| ------ | :---------------: | :--------------------------: |
| GET    |   /transactions   |     get all transactions     |
| GET    | /transactions/:id |   get a transaction by id    |
| POST   |   /transactions   |      create transaction      |
| PATCH  | /transactions/:id | update the transaction by id |
| DELETE | /transactions/:id | delete the transaction by id |

## Example Responses

```
POST /transactions

Request Body
{
  "type": "income",
  "amount": 1000
}

Response Body
{
  "id": "uuid",
  "type": "income",
  "amount": 1000,
  "date": "2024-01-01T12:00:00Z"
}
```

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

```
DELETE /transactions/:id


Response Body

```

```
GET /news/search/:keyword

Request Headers
Authorization : Bearer {token}

Response Body
{
    "success": true,
    "message": "Transaction deleted successfully"
}

```
