// 1. Import the Express library (this is what lets us build a web server easily)
const express = require('express');

// 2. Create our app – this is our mini web server
const app = express();

// 3. Tell Express: "Please understand JSON data that people send us"
//    (Without this, req.body would be undefined when someone sends JSON)
app.use(express.json());

// 4. This is our fake database – just a normal JavaScript array
//    In real apps we would use MongoDB or PostgreSQL instead
let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
];

// ────────────────────────────────────────────────
// READ ALL TODOS
// ────────────────────────────────────────────────
// When someone visits GET /todos, send back the full list
app.get('/todos', (req, res) => {
  // 200 = OK, everything is good
  // .json() automatically turns the array into JSON and sets correct headers
  res.status(200).json(todos);
});

// ────────────────────────────────────────────────
// CREATE A NEW TODO
// ────────────────────────────────────────────────
// POST /todos → someone wants to add a new task
app.post('/todos', (req, res) => {
  // Check if they sent a "task" field and it's not empty junk
  if (!req.body.task || typeof req.body.task !== 'string' || req.body.task.trim() === '') {
    // Bad request – tell them what went wrong
    return res.status(400).json({ error: 'Task field is required and must be a non-empty string' });
  }

  // Create a new ID: look at the highest existing ID and add 1
  // (This is safer than just using length + 1 after deletions)
  const newId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;

  // Build the new todo object – we only take what we expect
  const newTodo = {
    id: newId,
    task: req.body.task,               // the main thing they sent
    completed: req.body.completed === true,  // true only if they actually sent true
  };

  // Add it to our array (our "database")
  todos.push(newTodo);

  // 201 = Created – success + we send back the new item
  res.status(201).json(newTodo);
});

// ────────────────────────────────────────────────
// UPDATE A TODO (change task or mark as done)
// ────────────────────────────────────────────────
// PATCH /todos/:id  → partial update (you can change just one field)
app.patch('/todos/:id', (req, res) => {
  // Find the todo with the ID from the URL (e.g. /todos/3 → id = 3)
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);

  // If we didn't find it → 404 Not Found
  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  // Only update fields we actually allow
  if ('task' in req.body) {
    todo.task = req.body.task;
  }
  if ('completed' in req.body) {
    todo.completed = !!req.body.completed;  // !! turns anything into true/false
  }

  // Send back the updated todo
  res.status(200).json(todo);
});

// ────────────────────────────────────────────────
// DELETE A TODO
// ────────────────────────────────────────────────
// DELETE /todos/:id → remove one todo
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const beforeLength = todos.length;

  // Keep only the todos that do NOT have this ID
  todos = todos.filter(t => t.id !== id);

  // If length didn't change → we didn't find it
  if (todos.length === beforeLength) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  // 204 = No Content – success, but nothing to send back
  res.status(204).send();
});

// ────────────────────────────────────────────────
// BONUS: GET ONLY ACTIVE (not completed) TODOS
// ────────────────────────────────────────────────
app.get('/todos/active', (req, res) => {
  // .filter() keeps only items where completed is false
  const activeTodos = todos.filter(t => !t.completed);
  res.json(activeTodos);
});

// ────────────────────────────────────────────────
// BONUS EXTRA: GET ONLY COMPLETED TODOS
// ────────────────────────────────────────────────
app.get('/todos/completed', (req, res) => {
  const completedTodos = todos.filter(t => t.completed);
  res.json(completedTodos);
});

// ────────────────────────────────────────────────
// REQUIRED: GET A SINGLE TODO BY ID
// ────────────────────────────────────────────────
// GET /todos/:id  → example: /todos/2
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);           // :id from URL
  const todo = todos.find(t => t.id === id);

  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  res.json(todo);  // send just that one todo
});

// ────────────────────────────────────────────────
// Catch-all error handler (good practice)
// ────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err);  // log the error so we can debug
  res.status(500).json({ error: 'Something went wrong on the server!' });
});

// Start the server
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log('Try these in your browser or Postman:');
  console.log('  GET  http://localhost:3002/todos');
  console.log('  GET  http://localhost:3002/todos/1');
  console.log('  GET  http://localhost:3002/todos/active');
});