const express = require('express');
const cors = require('cors');
const { all, create, update, remove } = require('./tasks');

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => res.send('Task Manager API is running'));

//  Create a task
app.post('/api/tasks', (req, res) => {
  try {
    const task = create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


//  Get all tasks
app.get('/api/tasks', (req, res) => {
  res.json(all());
});

//  Update a task
app.put('/api/tasks/:id', (req, res) => {
  const task = update(req.params.id, req.body);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

// Get tasks with filter
app.get('/api/tasks', (req, res) => {
  const filter = req.query.filter || 'all';
  const result = tasks.all(filter);
  res.json(result);
});


// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const success = remove(req.params.id);
  if (!success) return res.status(404).json({ error: 'Task not found' });
  res.status(204).send();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
