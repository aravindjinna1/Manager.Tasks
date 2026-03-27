const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [1, 'Title cannot be empty'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    completed: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
      enum: {
        values: ['General', 'Work', 'Personal', 'Shopping', 'Health', 'Finance', 'Other'],
        message: '{VALUE} is not a valid category',
      },
    },
  },
  { timestamps: true } 
);

module.exports = mongoose.model('Task', taskSchema);
