# Todo CRUD API

A simple RESTful API for managing todo items built with Express.js.

## Features

- **Create** new todos
- **Read** all todos or a single todo by ID
- **Update** existing todos (task text and completion status)
- **Delete** todos
- Filter todos by status (active/completed)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/todos` | Get all todos |
| GET | `/todos/:id` | Get a single todo by ID |
| GET | `/todos/active` | Get only active (incomplete) todos |
| GET | `/todos/completed` | Get only completed todos |
| POST | `/todos` | Create a new todo |
| PATCH | `/todos/:id` | Update a todo |
| DELETE | `/todos/:id` | Delete a todo |

## Request Examples

### Create a todo
```bash
POST /todos
Content-Type: application/json

{
  "task": "Buy groceries",
  "completed": false
}
```

### Update a todo
```bash
PATCH /todos/1
Content-Type: application/json

{
  "task": "Buy groceries and milk",
  "completed": true
}
```

## Installation

```bash
npm install
```

## Usage

```bash
# Start the server
npm start

# Or use nodemon for development
npm run dev
```

The server runs on `http://localhost:3002`.

## Tech Stack

- Node.js
- Express.js

## License

ISC
