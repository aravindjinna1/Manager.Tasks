const { body, validationResult } = require('express-validator');

const validateTask = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .trim()
    .isLength({ min: 1 }).withMessage('Title cannot be empty'),

  body('description')
    .optional()
    .trim(),

  body('dueDate')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601().withMessage('Due date must be a valid date (YYYY-MM-DD)'),

  body('category')
    .optional()
    .trim()
    .isIn(['General', 'Work', 'Personal', 'Shopping', 'Health', 'Finance', 'Other'])
    .withMessage('Category must be one of: General, Work, Personal, Shopping, Health, Finance, Other'),

  // Middleware to check results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map((e) => ({
          field: e.path,
          message: e.msg,
        })),
      });
    }
    next();
  },
];

module.exports = { validateTask };
