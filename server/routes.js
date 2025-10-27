const express = require('express');
const tasks = require('./tasks');
const router = express.Router();


// GET /api/tasks
router.get('/tasks', (req, res) => {
res.json(tasks.all());
});


// POST /api/tasks
router.post('/tasks', (req, res) => {
try {
const t = tasks.create(req.body);
res.status(201).json(t);
} catch (err) {
res.status(400).json({ error: err.message });
}
});


// GET /api/tasks/:id
router.get('/tasks/:id', (req, res) => {
const t = tasks.get(req.params.id);
if (!t) return res.status(404).json({ error: 'not-found' });
res.json(t);
});


// PUT /api/tasks/:id
router.put('/tasks/:id', (req, res) => {
const t = tasks.update(req.params.id, req.body);
if (!t) return res.status(404).json({ error: 'not-found' });
res.json(t);
});


// DELETE /api/tasks/:id
router.delete('/tasks/:id', (req, res) => {
const ok = tasks.remove(req.params.id);
if (!ok) return res.status(404).json({ error: 'not-found' });
res.status(204).end();
});


module.exports = router;