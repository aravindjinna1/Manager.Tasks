const Task = require('../models/Task');



const getAllTasks = async (req, res, next) => {
  try {
    const { completed, category, sort } = req.query;
    const filter = {};
    if (completed !== undefined) filter.completed = completed === 'true';
    if (category) filter.category = category;

    const sortOrder = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
    const tasks = await Task.find(filter).sort(sortOrder);

    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    next(err);
  }
};



const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};


const createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, category } = req.body;
    const task = await Task.create({ title, description, dueDate, category });
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (err) {
    next(err);
  }
};


const updateTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, category } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, dueDate, category },
      { new: true, runValidators: true }
    );
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.json({ success: true, message: 'Task updated successfully', data: task });
  } catch (err) {
    next(err);
  }
};



const completeTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    if (task.completed) {
      return res.status(400).json({
        success: false,
        message: 'Task is already marked as completed',
      });
    }
    task.completed = true;
    await task.save();
    res.json({ success: true, message: 'Task marked as completed', data: task });
  } catch (err) {
    next(err);
  }
};



const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllTasks, getTaskById, createTask, updateTask, completeTask, deleteTask };
