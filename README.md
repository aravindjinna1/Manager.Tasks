# 📋 Task Manager API

> **Node.js Internship Assignment** — PR: NODEJSIIP-01909  
> Built with **Node.js**, **Express.js**, and **MongoDB (Mongoose)**

---

## 📁 Project Structure

```
task-manager-api/
├── src/
│   ├── server.js                  # Entry point — connects DB, starts server
│   ├── app.js                     # Express app setup (routes, middleware)
│   ├── config/
│   │   └── db.js                  # MongoDB connection logic
│   ├── models/
│   │   └── Task.js                # Mongoose Task schema & model
│   ├── controllers/
│   │   └── taskController.js      # Business logic for all task operations
│   ├── routes/
│   │   └── taskRoutes.js          # REST route definitions
│   └── middleware/
│       ├── validate.js            # Input validation (express-validator)
│       └── errorHandler.js        # Global error handler
├── tests/
│   └── task.test.js               # Unit tests (Jest + Supertest)
├── .env.example                   # Environment variable template
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/) — local install OR free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Open `.env` and set your MongoDB URI:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/taskmanager
NODE_ENV=development
```

> **Using MongoDB Atlas?** Replace `MONGODB_URI` with your Atlas connection string:  
> `MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/taskmanager`

### 4. Run the Server

```bash
# Development (auto-restarts on file change)
npm run dev

# Production
npm start
```

Server starts at: **http://localhost:3000**

---

## 🔌 API Reference

Base URL: `http://localhost:3000/api/tasks`

| Method   | Endpoint                  | Description                        |
|----------|---------------------------|------------------------------------|
| `GET`    | `/api/tasks`              | Get all tasks                      |
| `GET`    | `/api/tasks/:id`          | Get a single task by ID            |
| `POST`   | `/api/tasks`              | Create a new task                  |
| `PUT`    | `/api/tasks/:id`          | Update task details                |
| `PATCH`  | `/api/tasks/:id/complete` | Mark a task as completed           |
| `DELETE` | `/api/tasks/:id`          | Delete a task                      |

### Query Parameters (GET /api/tasks)

| Param       | Example              | Description                        |
|-------------|----------------------|------------------------------------|
| `completed` | `?completed=true`    | Filter by completion status        |
| `category`  | `?category=Work`     | Filter by category                 |
| `sort`      | `?sort=oldest`       | Sort by oldest first (default: newest) |

---

## 📝 Request & Response Examples

### ✅ Create a Task

```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, eggs, and bread",
  "dueDate": "2025-12-31",
  "category": "Personal"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "664f1a2b3c4d5e6f7a8b9c0d",
    "title": "Buy groceries",
    "description": "Milk, eggs, and bread",
    "completed": false,
    "dueDate": "2025-12-31T00:00:00.000Z",
    "category": "Personal",
    "createdAt": "2025-01-01T10:00:00.000Z",
    "updatedAt": "2025-01-01T10:00:00.000Z"
  }
}
```

### ✅ Mark as Completed

```http
PATCH /api/tasks/664f1a2b3c4d5e6f7a8b9c0d/complete
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Task marked as completed",
  "data": { "completed": true, ... }
}
```

**If already completed — Response `400`:**
```json
{
  "success": false,
  "message": "Task is already marked as completed"
}
```

### ❌ Validation Error (empty title)

```http
POST /api/tasks
{ "title": "" }
```

**Response `400`:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "title", "message": "Title is required" }]
}
```

---

## 🏷️ Task Schema

| Field         | Type      | Required | Default     | Notes                                      |
|---------------|-----------|----------|-------------|--------------------------------------------|
| `title`       | String    | ✅ Yes   | —           | Cannot be empty                            |
| `description` | String    | No       | `""`        | Optional details                           |
| `completed`   | Boolean   | No       | `false`     | Use PATCH /:id/complete to set to `true`   |
| `dueDate`     | Date      | No       | `null`      | ISO 8601 format (YYYY-MM-DD)               |
| `category`    | String    | No       | `"General"` | General, Work, Personal, Shopping, Health, Finance, Other |
| `createdAt`   | Date      | Auto     | —           | Set by Mongoose timestamps                 |
| `updatedAt`   | Date      | Auto     | —           | Set by Mongoose timestamps                 |

---

## 🧪 Running Tests

```bash
npm test
```

Tests use **Jest** + **Supertest** and connect to a separate `taskmanager_test` database (auto-cleaned after each test).

**Test coverage includes:**
- Create task (valid, empty title, missing title, with bonus fields)
- Get all tasks, get by ID, 404 for missing ID
- Update task details
- Mark complete (success + already-completed guard)
- Delete task (success + 404 for missing)

---

## 🏗️ Key Design Decisions

- **MVC Pattern** — Separates routing, business logic, and data models for maintainability
- **express-validator** — Declarative validation keeps controllers clean
- **Global Error Handler** — Catches Mongoose errors (CastError, ValidationError) and unknown throws; returns consistent JSON responses
- **Query Filtering** — GET /api/tasks supports filtering by `completed`, `category`, and `sort` without extra routes
- **Bonus Features** — `dueDate` and `category` are included in the Task schema with enum validation

---

## 📦 Dependencies

| Package              | Purpose                            |
|---------------------|------------------------------------|
| `express`           | Web framework                      |
| `mongoose`          | MongoDB ODM                        |
| `express-validator` | Request validation                 |
| `dotenv`            | Environment variable management    |
| `nodemon` (dev)     | Auto-restart during development    |
| `jest` (dev)        | Test runner                        |
| `supertest` (dev)   | HTTP assertions for tests          |

---

## 🌐 Environment Variables

| Variable       | Default                                  | Description              |
|----------------|------------------------------------------|--------------------------|
| `PORT`         | `3000`                                   | Server port              |
| `MONGODB_URI`  | `mongodb://localhost:27017/taskmanager`  | MongoDB connection string|
| `NODE_ENV`     | `development`                            | Environment mode         |

---

