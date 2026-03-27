const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Task = require('../src/models/Task');

const MONGO_TEST_URI = 'mongodb://localhost:27017/taskmanager_test';

beforeAll(async () => {
  await mongoose.connect(MONGO_TEST_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

afterEach(async () => {
  await Task.deleteMany({});
});

describe('Task Manager API - Unit Tests', () => {


  describe('POST /api/tasks', () => {
    test('should create a task with title and description', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'Test Task', description: 'Test Description' });
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Test Task');
      expect(res.body.data.completed).toBe(false);
    });

    test('should fail when title is empty', async () => {
      const res = await request(app).post('/api/tasks').send({ title: '' });
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('should fail when title is missing', async () => {
      const res = await request(app).post('/api/tasks').send({ description: 'No title' });
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('should create task with bonus fields (dueDate, category)', async () => {
      const res = await request(app).post('/api/tasks').send({
        title: 'Bonus Task',
        dueDate: '2025-12-31',
        category: 'Work',
      });
      expect(res.statusCode).toBe(201);
      expect(res.body.data.category).toBe('Work');
    });
  });

  describe('GET /api/tasks', () => {
    test('should return all tasks', async () => {
      await Task.create({ title: 'Task 1' });
      await Task.create({ title: 'Task 2' });
      const res = await request(app).get('/api/tasks');
      expect(res.statusCode).toBe(200);
      expect(res.body.count).toBe(2);
    });

    test('should return empty array when no tasks', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.statusCode).toBe(200);
      expect(res.body.count).toBe(0);
    });

    test('should get a single task by ID', async () => {
      const task = await Task.create({ title: 'Single Task' });
      const res = await request(app).get(`/api/tasks/${task._id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.title).toBe('Single Task');
    });

    test('should return 404 for non-existent task ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/tasks/${fakeId}`);
      expect(res.statusCode).toBe(404);
    });
  });


  describe('PUT /api/tasks/:id', () => {
    test('should update task title and description', async () => {
      const task = await Task.create({ title: 'Old Title' });
      const res = await request(app)
        .put(`/api/tasks/${task._id}`)
        .send({ title: 'New Title', description: 'Updated' });
      expect(res.statusCode).toBe(200);
      expect(res.body.data.title).toBe('New Title');
    });
  });


  describe('PATCH /api/tasks/:id/complete', () => {
    test('should mark a task as completed', async () => {
      const task = await Task.create({ title: 'Complete Me' });
      const res = await request(app).patch(`/api/tasks/${task._id}/complete`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.completed).toBe(true);
    });

    test('should return 400 if task is already completed', async () => {
      const task = await Task.create({ title: 'Already Done', completed: true });
      const res = await request(app).patch(`/api/tasks/${task._id}/complete`);
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });


  describe('DELETE /api/tasks/:id', () => {
    test('should delete a task', async () => {
      const task = await Task.create({ title: 'Delete Me' });
      const res = await request(app).delete(`/api/tasks/${task._id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test('should return 404 when deleting non-existent task', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/api/tasks/${fakeId}`);
      expect(res.statusCode).toBe(404);
    });
  });

});
