const express = require('express');
const cors = require('cors');

const app = express();
const port = 5001; // CHANGED FROM 5000 to 5001

app.use(cors());
app.use(express.json());

let todos = [
  { id: 1, text: 'Learn React' },
  { id: 2, text: 'Build a server with Express' },
  { id: 3, text: 'Connect frontend and backend' },
];

let nextId = 4;

app.get('/api/todos', (req, res) => {
  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  const newTodo = {
    id: nextId++,
    text: req.body.text,
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  todos = todos.filter(todo => todo.id !== id);
  res.status(200).json({ message: 'Todo deleted successfully' });
});

// MODIFIED TO CATCH STARTUP ERRORS
const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

server.on('error', (err) => {
  console.error('Server startup error:', err);
});