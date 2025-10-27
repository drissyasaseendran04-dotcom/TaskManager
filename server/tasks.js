// tasks.js - business logic separated from HTTP layer
const { v4: uuidv4 } = require('uuid');


let tasks = []; // in-memory store — replaceable with a DB adapter


function reset() {
tasks = [];
}


function all() {
return tasks;
}


function create({ title, description = '' }) {
if (!title || typeof title !== 'string') throw new Error('title-required');
const t = { id: uuidv4(), title, description, completed: false, createdAt: new Date().toISOString() };
tasks.push(t);
return t;
}


function get(id) {
return tasks.find(t => t.id === id) || null;
}


function update(id, patch) {
const t = get(id);
if (!t) return null;
if (patch.title !== undefined) t.title = patch.title;
if (patch.description !== undefined) t.description = patch.description;
if (patch.completed !== undefined) t.completed = !!patch.completed;
return t;
}


function remove(id) {
const idx = tasks.findIndex(t => t.id === id);
if (idx === -1) return false;
tasks.splice(idx, 1);
return true;
}


module.exports = { reset, all, create, get, update, remove };