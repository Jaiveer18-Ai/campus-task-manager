import { INITIAL_TASKS } from '../data/mockTasks';
import { sanitizeTask } from '../services/taskService';

const TASKS_STORAGE_KEY = 'campus_task_manager_tasks_v2';
const SETTINGS_STORAGE_KEY = 'campus_task_manager_settings_v1';

export function loadTasks() {
  try {
    const saved = localStorage.getItem(TASKS_STORAGE_KEY);
    // Only seed mock tasks if the user has NEVER saved anything (saved === null)
    if (saved === null) {
      const sanitized = INITIAL_TASKS.map(sanitizeTask);
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(sanitized));
      return sanitized;
    }
    const parsed = JSON.parse(saved);
    // Return parsed array even if empty (allows user to legitimately have 0 tasks)
    return Array.isArray(parsed) ? parsed.map(sanitizeTask) : INITIAL_TASKS.map(sanitizeTask);
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error);
    return INITIAL_TASKS.map(sanitizeTask);
  }
}

export function saveTasks(tasks) {
  try {
    const sanitized = Array.isArray(tasks) ? tasks.map(sanitizeTask) : [];
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(sanitized));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
  }
}

export function resetToDemoTasks() {
  try {
    const sanitized = INITIAL_TASKS.map(sanitizeTask);
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(sanitized));
    return sanitized;
  } catch {
    return INITIAL_TASKS.map(sanitizeTask);
  }
}

export function clearAllStoredTasks() {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify([]));
    return [];
  } catch {
    return [];
  }
}

export function loadSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!saved) return { semester: 'Fall 2026', reducedMotion: false };
    return JSON.parse(saved);
  } catch {
    return { semester: 'Fall 2026', reducedMotion: false };
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}
