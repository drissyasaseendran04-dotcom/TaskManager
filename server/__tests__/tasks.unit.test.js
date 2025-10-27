const tasks = require('../tasks');


beforeEach(() => tasks.reset());


test('create -> all -> get -> update -> remove', () => {
const t = tasks.create({ title: 'write tests' });
expect(t.id).toBeTruthy();
expect(tasks.all().length).toBe(1);
const fetched = tasks.get(t.id);
expect(fetched.title).toBe('write tests');
tasks.update(t.id, { completed: true, title: 'updated' });
expect(tasks.get(t.id).completed).toBe(true);
const removed = tasks.remove(t.id);
expect(removed).toBe(true);
expect(tasks.all().length).toBe(0);
});