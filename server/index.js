const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./db');
require('dotenv').config();
connectDB();

const { all, create, update, remove } = require('./tasks');

const app = express();
app.use(cors());
app.use(express.json());

//  MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/taskmanager';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(' MongoDB connection error:', err.message));

// Health check
app.get('/', (req, res) => res.send('Task Manager API is running'));

// Create a task
app.post('/api/tasks', async (req, res) => {
  try {
    const task = await create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all tasks (with optional filters)
app.get('/api/tasks', async (req, res) => {
  const filter = req.query.filter || 'all';
  const tasks = await all(filter);
  res.json(tasks);
});

// Update a task
app.put('/api/tasks/:id', async (req, res) => {
  const task = await update(req.params.id, req.body);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  const success = await remove(req.params.id);
  if (!success) return res.status(404).json({ error: 'Task not found' });
  res.status(204).send();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on http://localhost:${PORT}`));
