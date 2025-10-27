const { v4: uuidv4 } = require('uuid');

// In-memory task store
let tasks = [];

/**
 * Create a new task
 */


function all(filter) {
  const now = new Date();
  switch (filter) {
    case 'today':
      return tasks.filter(t => t.dueDate && isToday(parseISO(t.dueDate)));
    case 'tomorrow':
      return tasks.filter(t => t.dueDate && isTomorrow(parseISO(t.dueDate)));
    case 'overdue':
      return tasks.filter(t => t.dueDate && isBefore(parseISO(t.dueDate), now) && !t.completed);
    case 'completed':
      return tasks.filter(t => t.completed);
    default:
      return tasks;
  }
}

function create({ title, description = '' }) {
  if (!title || typeof title !== 'string') throw new Error('title-required');
  const task = {
    id: uuidv4(),
    title,
    description,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  return task;
}

/**
 * Get all tasks
 */
function all() {
  return tasks;
}

/**
 * Update a task by ID
 */
function update(id, patch) {
  const t = tasks.find(task => task.id === id);
  if (!t) return null;

  if (patch.title !== undefined) t.title = patch.title;
  if (patch.description !== undefined) t.description = patch.description;
  if (patch.completed !== undefined) t.completed = !!patch.completed;
  if (patch.dueDate !== undefined) t.dueDate = patch.dueDate;

  t.updatedAt = new Date().toISOString();
  return t;
}

/**
 * Delete a task by ID
 */
function remove(id) {
  const index = tasks.findIndex(task => task.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
}

module.exports = { all, create, update, remove };
