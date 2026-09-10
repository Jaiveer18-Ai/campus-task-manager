/**
 * API Service Layer for Campus Task Manager
 * Implements the exact specification from Contract.md / docs/API_CONTRACT.md.
 * 
 * Supports both live backend communication (when Dhruv's server is running on /api)
 * and seamless local fallback (via storage.js) when the backend is offline.
 */

import { loadTasks, saveTasks } from '../utils/storage';

const API_BASE_URL = '/api';

/**
 * Helper to check if live API is available
 */
async function request(url, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers
    },
    ...options
  };

  const res = await fetch(url, config);
  if (!res.ok) {
    let errorData;
    try {
      errorData = await res.json();
    } catch {
      errorData = { error: res.statusText, message: `Request failed with status ${res.status}` };
    }
    const error = new Error(errorData.message || 'API request failed');
    error.status = res.status;
    error.data = errorData;
    throw error;
  }

  // Handle 204 No Content
  if (res.status === 204) return null;
  return res.json();
}

/**
 * GET /api/tasks
 * Supports query params: status, course, priority, search
 */
export async function apiGetTasks(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.course && filters.course !== 'all') params.append('course', filters.course);
    if (filters.priority && filters.priority !== 'all') params.append('priority', filters.priority);
    if (filters.search) params.append('search', filters.search);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return await request(`${API_BASE_URL}/tasks${queryString}`);
  } catch {
    // Graceful fallback to localStorage when backend is offline
    console.info('[API] Backend offline or unreachable. Using local storage.');
    return loadTasks();
  }
}

/**
 * GET /api/tasks/:id
 */
export async function apiGetTaskById(id) {
  try {
    return await request(`${API_BASE_URL}/tasks/${id}`);
  } catch {
    const local = loadTasks();
    const task = local.find(t => t.id === id);
    if (!task) throw new Error(`Task with ID '${id}' not found`);
    return task;
  }
}

/**
 * POST /api/tasks
 * Body: { title, course, category, priority, dueDate, description }
 */
export async function apiCreateTask(taskData) {
  try {
    return await request(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
  } catch {
    // Local fallback
    const local = loadTasks();
    const newTask = {
      ...taskData,
      id: taskData.id || `task-${Date.now()}`,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [newTask, ...local];
    saveTasks(updated);
    return newTask;
  }
}

/**
 * PATCH /api/tasks/:id
 * Body: partial task fields (e.g. { completed: true })
 */
export async function apiUpdateTask(id, patchData) {
  try {
    return await request(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patchData)
    });
  } catch {
    // Local fallback
    const local = loadTasks();
    let updatedTask = null;
    const updatedList = local.map(t => {
      if (t.id === id) {
        updatedTask = {
          ...t,
          ...patchData,
          updatedAt: new Date().toISOString()
        };
        return updatedTask;
      }
      return t;
    });
    saveTasks(updatedList);
    return updatedTask;
  }
}

/**
 * DELETE /api/tasks/:id
 */
export async function apiDeleteTask(id) {
  try {
    return await request(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE'
    });
  } catch {
    // Local fallback
    const local = loadTasks();
    const filtered = local.filter(t => t.id !== id);
    saveTasks(filtered);
    return { message: `Task '${id}' was successfully deleted.`, id };
  }
}
