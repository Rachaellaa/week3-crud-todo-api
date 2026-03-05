// ────────────────────────────────────────────────
// Load environment variables from .env
// ────────────────────────────────────────────────
require('dotenv').config();

// ────────────────────────────────────────────────
// Import Express
// ────────────────────────────────────────────────
const express = require('express');
const app = express();

// ────────────────────────────────────────────────
// Middleware to parse JSON bodies
// ────────────────────────────────────────────────
app.use(express.json());

// ────────────────────────────────────────────────
// In-memory database (array)
// ────────────────────────────────────────────────
let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
];

// ────────────────────────────────────────────────
// ROOT endpoint (basic health check)
// ────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('Todo API is running 🚀');
});

// ────────────────────────────────────────────────
// READ ALL TODOS
// GET /todos
// ────────────────────────────────────────────────
app.get('/todos', (req, res) => {
  res.status(200).json(todos);
});

// ────────────────────────────────────────────────
// READ SINGLE TODO BY ID
// GET /todos/:id
// ────────────────────────────────────────────────
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);

  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  res.json(todo);
});

// ────────────────────────────────────────────────
// CREATE A NEW TODO
// POST /todos
// ────────────────────────────────────────────────
app.post('/todos', (req, res) => {
  if (!req.body.task || typeof req.body.task !== 'string' || req.body.task.trim() === '') {
    return res.status(400).json({ error: 'Task field is required and must be a non-empty string' });
  }

  const newId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;
  const newTodo = {
    id: newId,
    task: req.body.task,
    completed: req.body.completed === true,
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// ────────────────────────────────────────────────
// UPDATE A TODO PARTIALLY
// PATCH /todos/:id
// ────────────────────────────────────────────────
app.patch('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);

  if (!todo) return res.status(404).json({ message: 'Todo not found' });

  if ('task' in req.body) todo.task = req.body.task;
  if ('completed' in req.body) todo.completed = !!req.body.completed;

  res.status(200).json(todo);
});

// ────────────────────────────────────────────────
// FULL UPDATE A TODO
// PUT /todos/:id
// ────────────────────────────────────────────────
app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);

  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  if (!req.body.task || typeof req.body.task !== 'string') {
    return res.status(400).json({ error: 'Task is required and must be a string' });
  }

  todo.task = req.body.task;
  todo.completed = !!req.body.completed;

  res.json(todo);
});

// ────────────────────────────────────────────────
// DELETE A TODO
// DELETE /todos/:id
// ────────────────────────────────────────────────
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const beforeLength = todos.length;

  todos = todos.filter(t => t.id !== id);

  if (todos.length === beforeLength) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  res.status(204).send();
});

// ────────────────────────────────────────────────
// BONUS: GET ONLY ACTIVE TODOS
// GET /todos/active
// ────────────────────────────────────────────────
app.get('/todos/active', (req, res) => {
  const activeTodos = todos.filter(t => !t.completed);
  res.json(activeTodos);
});

// ────────────────────────────────────────────────
// BONUS: GET ONLY COMPLETED TODOS
// GET /todos/completed
// ────────────────────────────────────────────────
app.get('/todos/completed', (req, res) => {
  const completedTodos = todos.filter(t => t.completed);
  res.json(completedTodos);
});

// ────────────────────────────────────────────────
// Catch-all error handler
// ────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server!' });
});

// ────────────────────────────────────────────────
// START SERVER
// ────────────────────────────────────────────────
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log('Try these in Postman or your browser:');
  console.log(`  GET  http://localhost:${PORT}/todos`);
  console.log(`  GET  http://localhost:${PORT}/todos/1`);
  console.log(`  GET  http://localhost:${PORT}/todos/active`);
});