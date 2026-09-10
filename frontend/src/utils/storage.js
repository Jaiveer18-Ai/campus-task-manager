import { INITIAL_TASKS } from '../data/mockTasks';

const TASKS_STORAGE_KEY = 'campus_task_manager_tasks_v1';
const THEME_STORAGE_KEY = 'campus_task_manager_theme';

export function loadTasks() {
  try {
    const saved = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!saved) {
      // Initialize with mock tasks on first load
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(INITIAL_TASKS));
      return INITIAL_TASKS;
    }
    const parsed = JSON.parse(saved);
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

export function loadTheme() {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  } catch {
    return 'light';
  }
}

export function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.error('Failed to save theme to localStorage:', error);
  }
}
