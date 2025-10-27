import React, { useEffect, useState } from 'react';
import axios from 'axios';


export default function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');

    const API_BASE = process.env.REACT_APP_API_BASE || '';
    useEffect(() => {
        console.log("API Base:", process.env.REACT_APP_API_BASE);
        fetchTasks();
        }, []);


    async function fetchTasks() {
        const res = await axios.get(`${API_BASE}/api/tasks`);
        setTasks(res.data);
    }


    async function add() {
        if (!title) return;
        await axios.post(`${API_BASE}/api/tasks`, { title });
        setTitle('');
        fetchTasks();
    }


    async function toggle(id) {
        const t = tasks.find(x => x.id === id);
        await axios.put(`${API_BASE}/api/tasks/${id}`, { completed: !t.completed });
        fetchTasks();
    }


    async function remove(id) {
        await axios.delete(`${API_BASE}/api/tasks/${id}`);
        fetchTasks();
    }


    return (
        <div style={{ maxWidth: 600, margin: 40 }}>
            <h1>Tasks</h1>
            <div>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="New task" />
                <button onClick={add}>Add</button>
            </div>
            <ul>
                {tasks.map(t => (
                    <li key={t.id}>
                        <input type="checkbox" checked={t.completed} onChange={() => toggle(t.id)} />
                        <span style={{ textDecoration: t.completed ? 'line-through' : 'none', marginLeft: 8 }}>{t.title}</span>
                        <button onClick={() => remove(t.id)} style={{ marginLeft: 12 }}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}