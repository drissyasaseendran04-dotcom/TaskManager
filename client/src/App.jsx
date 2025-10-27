import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import TaskDetailModal from './TaskDetailModal';

  const API_BASE = process.env.REACT_APP_API_BASE || '';

function emptyTask() {
  return { title: '', description: '', dueDate: '' };
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyTask());
  const [filter, setFilter] = useState('all');
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch tasks when the filter changes
  useEffect(() => {
    fetchTasks();
  }, [filter]);

  // Fetch tasks from backend based on filter
  async function fetchTasks() {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/tasks?filter=${filter}`);
      setTasks(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }

  // Add new task
  async function addTask() {
    try {
      await axios.post(`${API_BASE}/api/tasks`, form);
      setForm(emptyTask());
      fetchTasks();
    } catch (err) {
      console.error(err);
      setError('Failed to add task');
    }
  }

  // Handle form submit
  function submit(e) {
    e.preventDefault();
    if (!form.title.trim()) return setError('Title is required');
    addTask();
  }

  // Update task completion
  async function toggleComplete(id) {
    const t = tasks.find(task => task.id === id);
    if (!t) return;
    try {
      await axios.put(`${API_BASE}/api/tasks/${id}`, { completed: !t.completed });
      fetchTasks();
    } catch (err) {
      console.error(err);
      setError('Failed to update task');
    }
  }

  // Delete task
  async function removeTask(id) {
    try {
      await axios.delete(`${API_BASE}/api/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
      setError('Failed to delete task');
    }
  }

  return (
    <div className="container">
      <h1>Task Manager</h1>

      {/* Add Task Form */}
      <form onSubmit={submit}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="date"
          value={form.dueDate ? form.dueDate.split('T')[0] : ''}
          onChange={e =>
            setForm({
              ...form,
              dueDate: e.target.value ? new Date(e.target.value).toISOString() : '',
            })
          }
        />
        <button type="submit">Add</button>
      </form>

      {/* Filter Buttons */}
      <div className="filters">
        {['all', 'today', 'tomorrow', 'overdue', 'completed'].map(f => (
          <button
            key={f}
            className={filter === f ? 'active' : ''}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Error + Loading */}
      {error && <div className="error">{error}</div>}
      {loading && <div>Loading...</div>}

      {/* Task List */}
      {!loading && !error && (
        <div className="list">
          {tasks.length === 0 ? (
            <div className="empty">No tasks found</div>
          ) : (
            tasks.map(t => (
              <div key={t.id} className={`task ${t.completed ? 'completed' : ''}`}>
                <div onClick={() => setDetail(t)}>
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => toggleComplete(t.id)}
                  />
                  <span>{t.title}</span>
                  {t.dueDate && (
                    <small style={{ marginLeft: '10px' }}>
                      {format(parseISO(t.dueDate), 'yyyy-MM-dd')}
                    </small>
                  )}
                </div>
                <button onClick={() => removeTask(t.id)}>Delete</button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Task Modal */}
      {detail && (
        <TaskDetailModal
          detail={detail}
          closeDetail={() => setDetail(null)}
          toggleComplete={toggleComplete}
          removeTask={removeTask}
        />
      )}
    </div>
  );
}
