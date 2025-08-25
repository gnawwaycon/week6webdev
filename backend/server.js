// backend/server.js

const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
require('dotenv').config();

const app = express();
const port = 5001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://conwaywang.github.io'], // Allow frontend to access
  credentials: true,
}));
app.use(express.json());
app.use(session({
  secret: process.env.COOKIE_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));
app.use(passport.initialize());
app.use(passport.session());

// Database Connection
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

// Passport Configuration
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
  proxy: true
},
  async (accessToken, refreshToken, profile, done) => {
    const existingUser = await db.collection('users').findOne({ googleId: profile.id });
    if (existingUser) {
      return done(null, existingUser);
    }
    const newUser = {
      googleId: profile.id,
      displayName: profile.displayName,
    };
    const result = await db.collection('users').insertOne(newUser);
    const insertedUser = await db.collection('users').findOne({ _id: result.insertedId });
    done(null, insertedUser);
  }
));

// Authentication Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
  res.redirect('http://localhost:3000/'); // Redirect to frontend
});

app.get('/api/current_user', (req, res) => {
  res.send(req.user);
});

app.get('/api/logout', (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out successfully' });
  });
});

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send({ error: 'You must be logged in.' });
  }
  next();
};

// Protected API Routes
app.get('/api/todos', requireAuth, async (req, res) => {
  const todos = await db.collection('todos').find({ userId: req.user._id }).toArray();
  res.json(todos);
});

app.post('/api/todos', requireAuth, async (req, res) => {
  const newTodo = {
    text: req.body.text,
    userId: req.user._id, // Associate todo with the logged-in user
  };
  const result = await db.collection('todos').insertOne(newTodo);
  const insertedTodo = await db.collection('todos').findOne({ _id: result.insertedId });
  res.status(201).json(insertedTodo);
});

app.delete('/api/todos/:id', requireAuth, async (req, res) => {
  const id = new ObjectId(req.params.id);
  await db.collection('todos').deleteOne({ _id: id, userId: req.user._id });
  res.status(200).json({ message: 'Todo deleted successfully' });
});

// Gemini Summarization Route
app.post('/api/summarize', requireAuth, async (req, res) => {
  const { todos } = req.body;
  if (!todos || todos.length === 0) {
    return res.status(400).json({ message: 'No todos to summarize.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  const todoListText = todos.map(todo => `- ${todo.text}`).join('\n');
  const prompt = `Please provide a brief, one-paragraph summary of the following to-do list. Focus on the main themes or categories of tasks:\n\n${todoListText}`;

  try {
    const payload = {
      contents: [{
        parts: [{ text: prompt }]
      }]
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const result = await response.json();
    const summary = result.candidates[0].content.parts[0].text;
    res.json({ summary });

  } catch (error) {
    console.error('Error with Gemini API:', error);
    res.status(500).json({ message: 'Failed to generate summary.' });
  }
});

// backend/server.js - Add this before connectToDatabase()

// Gemini Summarization Route
app.post('/api/summarize', requireAuth, async (req, res) => {
  const { todos } = req.body;
  if (!todos || todos.length === 0) {
    return res.status(400).json({ message: 'No todos to summarize.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  const todoListText = todos.map(todo => `- ${todo.text}`).join('\n');
  const prompt = `Please provide a brief, one-paragraph summary of the following to-do list. Focus on the main themes or categories of tasks:\n\n${todoListText}`;

  try {
    const payload = {
      contents: [{
        parts: [{ text: prompt }]
      }]
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const result = await response.json();
    const summary = result.candidates[0].content.parts[0].text;
    res.json({ summary });

  } catch (error) {
    console.error('Error with Gemini API:', error);
    res.status(500).json({ message: 'Failed to generate summary.' });
  }
});

connectToDatabase();