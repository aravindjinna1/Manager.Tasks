const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  completeTask,
  deleteTask,
} = require('../controllers/taskController');
const { validateTask } = require('../middleware/validate');

router.get('/', getAllTasks);

router.get('/:id', getTaskById);

router.post('/', validateTask, createTask);

router.put('/:id', validateTask, updateTask);

router.patch('/:id/complete', completeTask);

router.delete('/:id', deleteTask);

module.exports = router;
