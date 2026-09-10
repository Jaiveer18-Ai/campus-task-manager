const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Enable CORS so your frontend teammates (e.g. React/Vite/HTML on localhost) can call this API without CORS errors
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// In-Memory Task Database
// We start with a couple of sample campus tasks so you can test GET requests immediately
let tasks = [
  {
    id: '1',
    title: 'Complete CS101 Lab Assignment',
    subject: 'Computer Science',
    dueDate: '2026-09-15',
    completed: false
  },
  {
    id: '2',
    title: 'Read Chapter 4 for Calculus Quiz',
    subject: 'Mathematics',
    dueDate: '2026-09-12',
    completed: true
  }
];

// ----------------------------------------------------
// ROUTES / ENDPOINTS
// ----------------------------------------------------

// Root health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Campus Task Manager API is running!',
    endpoints: {
      getAllTasks: 'GET /api/tasks',
      addTask: 'POST /api/tasks',
      markTaskCompleted: 'PATCH /api/tasks/:id/complete',
      deleteTask: 'DELETE /api/tasks/:id'
    }
  });
});

// 1. GET ALL TASKS
// Endpoint: GET /api/tasks
app.get('/api/tasks', (req, res) => {
  res.status(200).json(tasks);
});

// 2. ADD A TASK
// Endpoint: POST /api/tasks
// Expects JSON body: { "title": "...", "subject": "...", "dueDate": "..." }
app.post('/api/tasks', (req, res) => {
  const { title, subject, dueDate } = req.body;

  // Basic validation: ensure required fields are provided
  if (!title || !subject || !dueDate) {
    return res.status(400).json({
      error: 'Please provide title, subject, and dueDate for the task.'
    });
  }

  // Create new task object
  const newTask = {
    id: crypto.randomUUID(),
    title: title.trim(),
    subject: subject.trim(),
    dueDate,
    completed: false
  };

  tasks.push(newTask);

  // Return created task with 201 Created status
  res.status(201).json(newTask);
});

// 3. MARK A TASK AS COMPLETED
// Endpoint: PATCH /api/tasks/:id/complete
// Also supports PATCH /api/tasks/:id with { "completed": true/false }
app.patch('/api/tasks/:id/complete', (req, res) => {
  const { id } = req.params;
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: `Task with id "${id}" not found.` });
  }

  task.completed = true;
  res.status(200).json({
    message: 'Task marked as completed successfully.',
    task
  });
});

// Optional helper: update completed status via PATCH /api/tasks/:id
app.patch('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: `Task with id "${id}" not found.` });
  }

  // If a completed boolean is passed in request body, use it; otherwise toggle or mark true
  if (typeof req.body.completed === 'boolean') {
    task.completed = req.body.completed;
  } else {
    task.completed = true;
  }

  res.status(200).json({
    message: 'Task updated successfully.',
    task
  });
});

// 4. DELETE A TASK
// Endpoint: DELETE /api/tasks/:id
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: `Task with id "${id}" not found.` });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];

  res.status(200).json({
    message: 'Task deleted successfully.',
    deletedTask
  });
});

// Export the Express app for testing
module.exports = app;

// Start the server only if run directly (e.g. node server.js or npm start)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(` Campus Task Manager Backend is running!`);
    console.log(` Local URL: http://localhost:${PORT}`);
    console.log(` API Route: http://localhost:${PORT}/api/tasks`);
    console.log(`=========================================`);
  });
}

