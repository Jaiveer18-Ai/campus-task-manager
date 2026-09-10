import { INITIAL_TASKS } from '../data/mockTasks';

const TASKS_STORAGE_KEY = 'campus_task_manager_tasks_v2';
const SETTINGS_STORAGE_KEY = 'campus_task_manager_settings_v1';

export function loadTasks() {
  try {
    const saved = localStorage.getItem(TASKS_STORAGE_KEY);
    // Only seed mock tasks if the user has NEVER saved anything (saved === null)
    if (saved === null) {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(INITIAL_TASKS));
      return INITIAL_TASKS;
    }
    const parsed = JSON.parse(saved);
    // Return parsed array even if empty (allows user to legitimately have 0 tasks)
    return Array.isArray(parsed) ? parsed : INITIAL_TASKS;
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error);
    return INITIAL_TASKS;
  }
}

export function saveTasks(tasks) {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
  }
}

export function resetToDemoTasks() {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(INITIAL_TASKS));
    return INITIAL_TASKS;
  } catch {
    return INITIAL_TASKS;
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
