// backend/server.js

const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = 5001; 

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db;

async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db('todo-app'); 
    console.log('Successfully connected to MongoDB.');

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
}

// GET /api/todos: Fetch all todos
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await db.collection('todos').find({}).toArray();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching todos' });
  }
});

// POST /api/todos: Add a new todo
app.post('/api/todos', async (req, res) => {
  if (!req.body.text || req.body.text.trim() === '') {
    return res.status(400).json({ message: 'Todo text cannot be empty' });
  }
  try {
    const newTodo = { text: req.body.text };
    const result = await db.collection('todos').insertOne(newTodo);
    const insertedTodo = await db.collection('todos').findOne({ _id: result.insertedId });
    res.status(201).json(insertedTodo);
  } catch (err) {
    res.status(500).json({ message: 'Error adding todo' });
  }
});

// DELETE /api/todos/:id: Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const result = await db.collection('todos').deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting todo' });
  }
});

connectToDatabase();