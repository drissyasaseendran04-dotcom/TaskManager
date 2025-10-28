const Task = require('./models/Task');

// Create
async function create(data) {
  const task = new Task({
    title: data.title,
    description: data.description,
    dueDate: data.dueDate,
  });
  return await task.save();
}

// Get all (optionally filtered)
async function all(filter = 'all') {
  const now = new Date();
  let query = {};

  switch (filter) {
    case 'today':
      query = {
        dueDate: {
          $gte: new Date(now.setHours(0, 0, 0, 0)),
          $lt: new Date(now.setHours(23, 59, 59, 999)),
        },
      };
      break;
    case 'tomorrow':
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      query = {
        dueDate: {
          $gte: new Date(tomorrow.setHours(0, 0, 0, 0)),
          $lt: new Date(tomorrow.setHours(23, 59, 59, 999)),
        },
      };
      break;
    case 'overdue':
      query = { dueDate: { $lt: new Date() }, completed: false };
      break;
    case 'completed':
      query = { completed: true };
      break;
    default:
      query = {}; // all tasks
  }

  return await Task.find(query).sort({ dueDate: 1 });
}

//  Update (by ID)
async function update(id, patch) {
  const updated = await Task.findByIdAndUpdate(id, patch, { new: true });
  return updated;
}

// Remove (by ID)
async function remove(id) {
  const result = await Task.findByIdAndDelete(id);
  return result ? true : false;
}

module.exports = { create, all, update, remove };
