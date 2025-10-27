const request = require('supertest');
const app = require('../index');
const tasks = require('../tasks');


beforeEach(() => tasks.reset());


describe('Tasks API', () => {
test('POST /api/tasks and GET /api/tasks', async () => {
const res = await request(app).post('/api/tasks').send({ title: 'api test' });
expect(res.status).toBe(201);
const list = await request(app).get('/api/tasks');
expect(list.body.length).toBe(1);
});
});