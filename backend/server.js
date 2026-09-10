const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed values per Contract.md
const VALID_CATEGORIES = ['Assignment', 'Exam Prep', 'Project', 'Reading', 'Personal'];
const VALID_PRIORITIES = ['high', 'medium', 'low'];

// Middleware
// Enable CORS so the frontend (Vite/React at localhost:5173 or other origins) can communicate freely
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// In-Memory Task Database seeded with Contract.md / Frontend mock tasks
let tasks = [
  {
    id: 'task-1',
    title: 'Submit Data Structures Lab 4 (Binary Search Trees)',
    course: 'CS101',
    category: 'Assignment',
    priority: 'high',
    dueDate: '2026-09-12T23:59:00.000Z',
    description: 'Implement recursive insertion, deletion, and in-order traversal with unit tests.',
    completed: false,
    createdAt: '2026-09-10T10:30:00.000Z',
    updatedAt: '2026-09-10T10:30:00.000Z'
  },
  {
    id: 'task-2',
    title: 'Pick up student transit pass',
    course: 'Campus Life',
    category: 'Personal',
    priority: 'low',
    dueDate: '2026-09-09T16:00:00.000Z',
    description: 'Visit student union room 204.',
    completed: true,
    createdAt: '2026-09-08T09:00:00.000Z',
    updatedAt: '2026-09-09T17:00:00.000Z'
  },
  {
    id: 'task-3',
    title: 'Multivariable Calculus Midterm 1 Practice Exam',
    course: 'MATH201',
    category: 'Exam Prep',
    priority: 'high',
    dueDate: '2026-09-15T14:00:00.000Z',
    description: 'Solve chapter 14 review problems on partial derivatives and gradient vectors.',
    completed: false,
    createdAt: '2026-09-09T12:00:00.000Z',
    updatedAt: '2026-09-09T12:00:00.000Z'
  },
  {
    id: 'task-4',
    title: 'Optics Experiment Lab Report & Graph Analysis',
    course: 'PHYS150',
    category: 'Project',
    priority: 'medium',
    dueDate: '2026-09-16T18:00:00.000Z',
    description: 'Plot Snell’s Law refraction index findings and write abstract with lab partner.',
    completed: false,
    createdAt: '2026-09-07T11:00:00.000Z',
    updatedAt: '2026-09-07T11:00:00.000Z'
  },
  {
    id: 'task-5',
    title: 'Modernist American Poetry Reading (Ch. 4-6)',
    course: 'ENG102',
    category: 'Reading',
    priority: 'low',
    dueDate: '2026-09-18T10:00:00.000Z',
    description: 'Annotate key metaphors in Wallace Stevens and Robert Frost selections.',
    completed: false,
    createdAt: '2026-09-06T08:30:00.000Z',
    updatedAt: '2026-09-06T08:30:00.000Z'
  },
  {
    id: 'task-6',
    title: 'ACM Coding Club Hackathon Team Registration',
    course: 'Club / Extracurricular',
    category: 'Project',
    priority: 'medium',
    dueDate: '2026-09-17T20:00:00.000Z',
    description: 'Confirm team roster of 4 members and submit project pitch outline.',
    completed: true,
    createdAt: '2026-09-05T14:00:00.000Z',
    updatedAt: '2026-09-05T14:00:00.000Z'
  }
];

// Helper: Standard error response matching Contract.md Section 4
function sendError(res, status, error, message, details = []) {
  const payload = { error, message };
  if (details && details.length > 0) {
    payload.details = details;
  }
  return res.status(status).json(payload);
}

// -------------------------------------------------------------
// ROUTES / ENDPOINTS
// -------------------------------------------------------------

// Root health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Campus Task Manager API is running!',
    version: '1.0.0',
    documentation: 'Contract.md',
    endpoints: {
      listTasks: 'GET /api/tasks',
      getTaskById: 'GET /api/tasks/:id',
      createTask: 'POST /api/tasks',
      updateTask: 'PATCH (or PUT) /api/tasks/:id',
      markTaskCompleted: 'PATCH /api/tasks/:id/complete',
      deleteTask: 'DELETE /api/tasks/:id'
    }
  });
});

// 5.1. List All Tasks (with optional filtering per Contract.md Section 5.1)
app.get('/api/tasks', (req, res) => {
  let result = [...tasks];
  const { status, course, priority, search } = req.query;

  // Status filter: 'all' | 'active' | 'completed'
  if (status === 'active') {
    result = result.filter((t) => !t.completed);
  } else if (status === 'completed') {
    result = result.filter((t) => t.completed);
  }

  // Course filter
  if (course && course !== 'all') {
    result = result.filter((t) => t.course.toLowerCase() === course.toLowerCase());
  }

  // Priority filter
  if (priority && priority !== 'all') {
    result = result.filter((t) => t.priority.toLowerCase() === priority.toLowerCase());
  }

  // Search filter (matches title, description, or course)
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    result = result.filter((t) =>
      (t.title && t.title.toLowerCase().includes(q)) ||
      (t.description && t.description.toLowerCase().includes(q)) ||
      (t.course && t.course.toLowerCase().includes(q))
    );
  }

  res.status(200).json(result);
});

// 5.2. Get Task by ID (Contract.md Section 5.2)
app.get('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return sendError(res, 404, 'Not Found', `Task with ID '${id}' was not found.`);
  }

  res.status(200).json(task);
});

// 5.3. Create a New Task (Contract.md Section 5.3)
app.post('/api/tasks', (req, res) => {
  const { title, course, category, priority, dueDate, description } = req.body;
  const validationErrors = [];

  // Title validation
  if (!title || typeof title !== 'string' || !title.trim()) {
    validationErrors.push("Field 'title' is required and cannot be blank.");
  } else if (title.trim().length > 200) {
    validationErrors.push("Field 'title' must not exceed 200 characters.");
  }

  // Category validation
  if (category && !VALID_CATEGORIES.includes(category)) {
    validationErrors.push(`Field 'category' must be one of: ${VALID_CATEGORIES.join(', ')}.`);
  }

  // Priority validation
  if (priority && !VALID_PRIORITIES.includes(priority)) {
    validationErrors.push(`Field 'priority' must be one of: ${VALID_PRIORITIES.join(', ')}.`);
  }

  // Description validation
  if (description && typeof description === 'string' && description.length > 1000) {
    validationErrors.push("Field 'description' must not exceed 1000 characters.");
  }

  if (validationErrors.length > 0) {
    return sendError(
      res,
      400,
      'Bad Request',
      'Validation failed for new task.',
      validationErrors
    );
  }

  const now = new Date().toISOString();
  const newTask = {
    id: `task-${Date.now()}`,
    title: title.trim(),
    course: course && typeof course === 'string' && course.trim() ? course.trim() : 'General',
    category: category || 'Assignment',
    priority: priority || 'medium',
    dueDate: dueDate || null,
    description: description && typeof description === 'string' ? description.trim() : '',
    completed: false,
    createdAt: now,
    updatedAt: now
  };

  tasks.unshift(newTask); // Add to top so newly created tasks appear first
  res.status(201).json(newTask);
});

// 5.4. Update a Task (Partial or Full) handler (Contract.md Section 5.4)
const handleUpdateTask = (req, res) => {
  const { id } = req.params;
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return sendError(res, 404, 'Not Found', `Task with ID '${id}' was not found.`);
  }

  const { title, course, category, priority, dueDate, description, completed } = req.body;
  const validationErrors = [];

  if (title !== undefined) {
    if (typeof title !== 'string' || !title.trim()) {
      validationErrors.push("Field 'title' cannot be blank.");
    } else if (title.trim().length > 200) {
      validationErrors.push("Field 'title' must not exceed 200 characters.");
    }
  }

  if (category !== undefined && !VALID_CATEGORIES.includes(category)) {
    validationErrors.push(`Field 'category' must be one of: ${VALID_CATEGORIES.join(', ')}.`);
  }

  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    validationErrors.push(`Field 'priority' must be one of: ${VALID_PRIORITIES.join(', ')}.`);
  }

  if (description !== undefined && typeof description === 'string' && description.length > 1000) {
    validationErrors.push("Field 'description' must not exceed 1000 characters.");
  }

  if (validationErrors.length > 0) {
    return sendError(res, 400, 'Bad Request', 'Invalid field value provided.', validationErrors);
  }

  // Apply updates
  if (title !== undefined) task.title = title.trim();
  if (course !== undefined && typeof course === 'string') task.course = course.trim();
  if (category !== undefined) task.category = category;
  if (priority !== undefined) task.priority = priority;
  if (dueDate !== undefined) task.dueDate = dueDate;
  if (description !== undefined && typeof description === 'string') task.description = description.trim();
  if (typeof completed === 'boolean') task.completed = completed;

  task.updatedAt = new Date().toISOString();

  res.status(200).json(task);
};

// Supports both PATCH and PUT as specified in Contract.md Section 5.4
app.patch('/api/tasks/:id', handleUpdateTask);
app.put('/api/tasks/:id', handleUpdateTask);

// Convenience endpoint: Mark Task Complete (Contract.md Section 5.4 / Frontend shortcut)
app.patch('/api/tasks/:id/complete', (req, res) => {
  const { id } = req.params;
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return sendError(res, 404, 'Not Found', `Task with ID '${id}' was not found.`);
  }

  task.completed = true;
  task.updatedAt = new Date().toISOString();

  res.status(200).json({
    message: 'Task marked as completed successfully.',
    task
  });
});

// 5.5. Delete a Task (Contract.md Section 5.5)
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    return sendError(res, 404, 'Not Found', `Task with ID '${id}' was not found.`);
  }

  tasks.splice(taskIndex, 1);

  res.status(200).json({
    message: `Task '${id}' was successfully deleted.`,
    id
  });
});

// Global Error Handler for malformed JSON or unexpected errors (Contract.md Section 4 & 6)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return sendError(res, 400, 'Bad Request', 'Malformed JSON in request body.');
  }
  return sendError(res, 500, 'Internal Server Error', 'An unexpected server error occurred.');
});

// Export app for modularity and testing
module.exports = app;

// Start server directly when executed via node server.js
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(` Campus Task Manager Backend is running!`);
    console.log(` Local URL: http://localhost:${PORT}`);
    console.log(` API Route: http://localhost:${PORT}/api/tasks`);
    console.log(` Spec: Contract.md compliant (v1.0.0)`);
    console.log(`=========================================`);
  });
}
