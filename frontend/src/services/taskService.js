/**
 * Campus Task Manager — Task Data & API Service Layer
 * 
 * Single source of truth for frontend task data operations.
 * Strictly adheres to docs/API_CONTRACT.md.
 * 
 * Current Mode: LocalStorage / Mock Provider
 * Future Mode: HTTP REST API via fetch() to /api/tasks
 * 
 * Provides unified async signatures and error envelopes so the UI
 * is 100% decoupled from the underlying storage mechanism.
 */

import { INITIAL_TASKS } from '../data/mockTasks';

// Configurable Base URL for future backend integration (Dhruv / Lavesh)
export const API_BASE_URL = '/api';

const TASKS_STORAGE_KEY = 'campus_task_manager_tasks_v2';

export const ALLOWED_CATEGORIES = [
  'Assignment',
  'Exam Prep',
  'Project',
  'Reading',
  'Personal'
];

export const ALLOWED_PRIORITIES = [
  'high',
  'medium',
  'low'
];

/**
 * Standard Error Class matching Contract Envelope (Section 4)
 */
export class TaskApiError extends Error {
  constructor(message, status = 500, details = [], errorType = 'Internal Server Error') {
    super(message);
    this.name = 'TaskApiError';
    this.status = status;
    this.error = errorType;
    this.details = details;
  }
}

/**
 * Transforms any error into a user-friendly message suitable for UI toasts/alerts
 */
export function getFriendlyErrorMessage(error, defaultMessage = 'An unexpected error occurred.') {
  if (!error) return defaultMessage;
  if (error instanceof TaskApiError) {
    if (error.status === 404) return error.message || 'Task not found.';
    if (error.status === 400) return error.message || 'Validation error. Please check your task inputs.';
    if (error.status >= 500) return 'Server error. Please try again later.';
    return error.message || defaultMessage;
  }
  if (error.name === 'TypeError' && error.message.toLowerCase().includes('fetch')) {
    return 'Network connection error. Could not connect to the server.';
  }
  return error.message || defaultMessage;
}

/**
 * Normalizes and sanitizes a task object to ensure 100% compliance with Task Schema:
 * id: string
 * title: string (1-200 chars)
 * course: string
 * category: string ('Assignment' | 'Exam Prep' | 'Project' | 'Reading' | 'Personal')
 * priority: string ('high' | 'medium' | 'low')
 * dueDate: string (ISO 8601) or null
 * description: string (<= 1000 chars)
 * completed: boolean
 * createdAt: string (ISO 8601)
 * updatedAt: string (ISO 8601)
 */
export function sanitizeTask(rawTask) {
  if (!rawTask || typeof rawTask !== 'object') {
    throw new TaskApiError('Invalid task object', 400);
  }

  // Handle legacy/alternate field names if migrating from old data
  const rawId = rawTask.id || rawTask._id || `task-${Date.now()}`;
  const rawTitle = (rawTask.title || rawTask.name || '').trim();
  const rawCourse = (rawTask.course || rawTask.subject || 'General').trim();
  const rawCategory = rawTask.category && ALLOWED_CATEGORIES.includes(rawTask.category)
    ? rawTask.category
    : 'Assignment';
  const rawPriority = rawTask.priority && ALLOWED_PRIORITIES.includes(rawTask.priority)
    ? rawTask.priority
    : 'medium';

  let rawDueDate = null;
  const candidateDueDate = rawTask.dueDate !== undefined ? rawTask.dueDate : rawTask.deadline;
  if (candidateDueDate) {
    const d = new Date(candidateDueDate);
    if (!isNaN(d.getTime())) {
      rawDueDate = d.toISOString();
    }
  }

  const rawDescription = typeof rawTask.description === 'string'
    ? rawTask.description.trim().slice(0, 1000)
    : '';

  const rawCompleted = rawTask.completed !== undefined
    ? Boolean(rawTask.completed)
    : Boolean(rawTask.isCompleted);

  const nowIso = new Date().toISOString();
  const rawCreatedAt = rawTask.createdAt && !isNaN(new Date(rawTask.createdAt).getTime())
    ? new Date(rawTask.createdAt).toISOString()
    : nowIso;
  const rawUpdatedAt = rawTask.updatedAt && !isNaN(new Date(rawTask.updatedAt).getTime())
    ? new Date(rawTask.updatedAt).toISOString()
    : rawCreatedAt;

  return {
    id: String(rawId),
    title: rawTitle.slice(0, 200),
    course: rawCourse || 'General',
    category: rawCategory,
    priority: rawPriority,
    dueDate: rawDueDate,
    description: rawDescription,
    completed: rawCompleted,
    createdAt: rawCreatedAt,
    updatedAt: rawUpdatedAt
  };
}

/* ==========================================================================
   Internal LocalStorage Storage Helpers
   ========================================================================== */

function getStoredTasks() {
  try {
    const saved = localStorage.getItem(TASKS_STORAGE_KEY);
    if (saved === null) {
      // First time initialization with mock demo data
      const sanitizedInitial = INITIAL_TASKS.map(sanitizeTask);
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(sanitizedInitial));
      return sanitizedInitial;
    }
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.map(sanitizeTask);
  } catch (err) {
    console.error('Failed to read tasks from storage:', err);
    return INITIAL_TASKS.map(sanitizeTask);
  }
}

function setStoredTasks(tasks) {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to write tasks to storage:', err);
    throw new TaskApiError('Failed to save task to local storage.', 500);
  }
}

/* ==========================================================================
   Task Service Public API (Strictly mirrors docs/API_CONTRACT.md)
   ========================================================================== */

export const taskService = {
  /**
   * GET /api/tasks
   * Retrieves all tasks with optional query filters (status, course, priority, search).
   * 
   * @param {Object} [filters]
   * @param {('all'|'active'|'completed')} [filters.status]
   * @param {string} [filters.course]
   * @param {('high'|'medium'|'low')} [filters.priority]
   * @param {string} [filters.category]
   * @param {string} [filters.search]
   * @returns {Promise<Task[]>}
   */
  async getTasks(filters = {}) {
    // Current LocalStorage Provider Implementation
    const allTasks = getStoredTasks();

    let filtered = [...allTasks];

    // 1. Status Filter
    if (filters.status === 'active') {
      filtered = filtered.filter(t => !t.completed);
    } else if (filters.status === 'completed') {
      filtered = filtered.filter(t => t.completed);
    }

    // 2. Course Filter
    if (filters.course && filters.course !== 'all') {
      filtered = filtered.filter(t => t.course.toLowerCase() === filters.course.toLowerCase());
    }

    // 3. Category Filter
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(t => t.category === filters.category);
    }

    // 4. Priority Filter
    if (filters.priority && filters.priority !== 'all') {
      filtered = filtered.filter(t => t.priority === filters.priority);
    }

    // 5. Search Filter (matches title, description, or course)
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.course && t.course.toLowerCase().includes(q))
      );
    }

    return filtered;
  },

  /**
   * GET /api/tasks/:id
   * Retrieves a single task by ID.
   * 
   * @param {string} id
   * @returns {Promise<Task>}
   */
  async getTask(id) {
    if (!id) {
      throw new TaskApiError("Parameter 'id' is required.", 400, ["id must be provided"]);
    }

    const tasks = getStoredTasks();
    const task = tasks.find(t => t.id === String(id));

    if (!task) {
      throw new TaskApiError(`Task with ID '${id}' was not found.`, 404, [], 'Not Found');
    }

    return task;
  },

  /**
   * POST /api/tasks
   * Creates a new task. The backend generates id, createdAt, and updatedAt.
   * 
   * @param {Object} taskData
   * @param {string} taskData.title
   * @param {string} [taskData.course]
   * @param {string} [taskData.category]
   * @param {string} [taskData.priority]
   * @param {string|null} [taskData.dueDate]
   * @param {string} [taskData.description]
   * @param {boolean} [taskData.completed]
   * @returns {Promise<Task>}
   */
  async createTask(taskData) {
    if (!taskData || typeof taskData !== 'object') {
      throw new TaskApiError('Request body must be a valid JSON object.', 400);
    }

    const details = [];

    // Title validation: required, 1-200 chars
    const title = typeof taskData.title === 'string' ? taskData.title.trim() : '';
    if (!title) {
      details.push("Field 'title' is required and cannot be blank.");
    } else if (title.length > 200) {
      details.push("Field 'title' must not exceed 200 characters.");
    }

    // Category validation
    if (taskData.category !== undefined && !ALLOWED_CATEGORIES.includes(taskData.category)) {
      details.push(`Field 'category' must be one of: ${ALLOWED_CATEGORIES.join(', ')}.`);
    }

    // Priority validation
    if (taskData.priority !== undefined && !ALLOWED_PRIORITIES.includes(taskData.priority)) {
      details.push(`Field 'priority' must be one of: ${ALLOWED_PRIORITIES.join(', ')}.`);
    }

    // Description validation
    if (taskData.description && taskData.description.length > 1000) {
      details.push("Field 'description' must not exceed 1000 characters.");
    }

    if (details.length > 0) {
      throw new TaskApiError('Validation failed for new task.', 400, details, 'Bad Request');
    }

    const nowIso = new Date().toISOString();
    const newTask = sanitizeTask({
      id: `task-${Date.now()}`,
      title,
      course: taskData.course || 'General',
      category: taskData.category || 'Assignment',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      description: taskData.description || '',
      completed: Boolean(taskData.completed),
      createdAt: nowIso,
      updatedAt: nowIso
    });

    const tasks = getStoredTasks();
    tasks.unshift(newTask);
    setStoredTasks(tasks);

    return newTask;
  },

  /**
   * PATCH /api/tasks/:id
   * Updates an existing task with partial updates (e.g. { completed: true }).
   * 
   * @param {string} id
   * @param {Object} updates
   * @returns {Promise<Task>}
   */
  async updateTask(id, updates) {
    if (!id) {
      throw new TaskApiError("Parameter 'id' is required.", 400);
    }
    if (!updates || typeof updates !== 'object') {
      throw new TaskApiError('Updates body must be an object.', 400);
    }

    const tasks = getStoredTasks();
    const taskIndex = tasks.findIndex(t => t.id === String(id));

    if (taskIndex === -1) {
      throw new TaskApiError(`Task with ID '${id}' was not found.`, 404, [], 'Not Found');
    }

    const existingTask = tasks[taskIndex];
    const details = [];

    // Validation for partial fields
    if (updates.title !== undefined) {
      if (typeof updates.title !== 'string' || !updates.title.trim()) {
        details.push("Field 'title' cannot be empty.");
      } else if (updates.title.trim().length > 200) {
        details.push("Field 'title' must not exceed 200 characters.");
      }
    }

    if (updates.category !== undefined && !ALLOWED_CATEGORIES.includes(updates.category)) {
      details.push(`Field 'category' must be one of: ${ALLOWED_CATEGORIES.join(', ')}.`);
    }

    if (updates.priority !== undefined && !ALLOWED_PRIORITIES.includes(updates.priority)) {
      details.push(`Field 'priority' must be one of: ${ALLOWED_PRIORITIES.join(', ')}.`);
    }

    if (updates.description !== undefined && typeof updates.description === 'string' && updates.description.length > 1000) {
      details.push("Field 'description' must not exceed 1000 characters.");
    }

    if (details.length > 0) {
      throw new TaskApiError('Validation failed for task update.', 400, details, 'Bad Request');
    }

    const updatedTask = sanitizeTask({
      ...existingTask,
      ...updates,
      id: existingTask.id, // Immutable ID
      createdAt: existingTask.createdAt, // Immutable creation timestamp
      updatedAt: new Date().toISOString()
    });

    tasks[taskIndex] = updatedTask;
    setStoredTasks(tasks);

    return updatedTask;
  },

  /**
   * DELETE /api/tasks/:id
   * Deletes an existing task by ID.
   * 
   * @param {string} id
   * @returns {Promise<{ message: string, id: string }>}
   */
  async deleteTask(id) {
    if (!id) {
      throw new TaskApiError("Parameter 'id' is required.", 400);
    }

    const tasks = getStoredTasks();
    const taskExists = tasks.some(t => t.id === String(id));

    if (!taskExists) {
      throw new TaskApiError(`Task with ID '${id}' was not found.`, 404, [], 'Not Found');
    }

    const filtered = tasks.filter(t => t.id !== String(id));
    setStoredTasks(filtered);

    return {
      message: `Task '${id}' was successfully deleted.`,
      id: String(id)
    };
  },

  /**
   * Utility helper to restore sample/demo tasks
   * @returns {Promise<Task[]>}
   */
  async restoreDemoTasks() {
    const sanitizedDemo = INITIAL_TASKS.map(sanitizeTask);
    setStoredTasks(sanitizedDemo);
    return sanitizedDemo;
  },

  /**
   * Utility helper to clear all tasks
   * @returns {Promise<Task[]>}
   */
  async clearAllTasks() {
    setStoredTasks([]);
    return [];
  }
};
