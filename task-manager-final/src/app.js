const express = require('express');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Task Manager API is running!',
    version: '1.0.0',
    endpoints: {
      getAllTasks:    'GET    /api/tasks',
      getTaskById:   'GET    /api/tasks/:id',
      createTask:    'POST   /api/tasks',
      updateTask:    'PUT    /api/tasks/:id',
      completeTask:  'PATCH  /api/tasks/:id/complete',
      deleteTask:    'DELETE /api/tasks/:id',
    },
  });
});

app.use('/api/tasks', taskRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use(errorHandler);

module.exports = app;
