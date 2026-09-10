import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/views/DashboardView';
import AllTasksView from './components/views/AllTasksView';
import CalendarView from './components/views/CalendarView';
import AnalyticsView from './components/views/AnalyticsView';
import SettingsView from './components/views/SettingsView';
import TaskModal from './components/TaskModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import ClearAllConfirmModal from './components/ClearAllConfirmModal';
import Toast from './components/Toast';
import { taskService, getFriendlyErrorMessage } from './services/taskService';
import { loadSettings, saveSettings } from './utils/storage';

const NAV_HASH_MAP = {
  '': 'Dashboard',
  '#dashboard': 'Dashboard',
  '#tasks': 'All Tasks',
  '#calendar': 'Calendar',
  '#analytics': 'Analytics',
  '#settings': 'Settings'
};

const NAV_TO_HASH = {
  'Dashboard': '#dashboard',
  'All Tasks': '#tasks',
  'Calendar': '#calendar',
  'Analytics': '#analytics',
  'Settings': '#settings'
};

export default function App() {
  // Navigation State
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Settings State
  const [settings, setSettings] = useState(loadSettings);

  // Tasks State (Initialized via Service Layer)
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOperating, setIsOperating] = useState(false);

  // Filter & Search State
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDateAsc');

  // Modal & Notification State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  // Initial Task Fetch via Data-Access Layer (GET /api/tasks)
  useEffect(() => {
    let isMounted = true;

    const fetchInitialTasks = async () => {
      setIsLoading(true);
      try {
        const loadedTasks = await taskService.getTasks();
        if (isMounted) {
          setTasks(loadedTasks);
        }
      } catch (err) {
        if (isMounted) {
          showToast(getFriendlyErrorMessage(err, 'Failed to load tasks.'), 'danger');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchInitialTasks();

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync settings to localStorage and handle reduced motion
  useEffect(() => {
    saveSettings(settings);
    if (settings?.reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
  }, [settings]);

  // Hash-based routing synchronization (supports back/forward buttons and direct links)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      const matchedNav = NAV_HASH_MAP[hash];
      if (matchedNav) {
        setActiveNav(matchedNav);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavSelect = (navId) => {
    setActiveNav(navId);
    const targetHash = NAV_TO_HASH[navId] || '#dashboard';
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Safe status toggle (PATCH /api/tasks/:id) - non-optimistic to guarantee backend consistency
  const handleToggleComplete = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const nextCompleted = !task.completed;
    setIsOperating(true);

    try {
      const updated = await taskService.updateTask(id, { completed: nextCompleted });
      setTasks(prevTasks => prevTasks.map(t => (t.id === id ? updated : t)));
      showToast(
        nextCompleted ? 'Task completed! Keep up the momentum! 🎉' : 'Task marked as active.',
        nextCompleted ? 'success' : 'info'
      );
    } catch (err) {
      showToast(getFriendlyErrorMessage(err, 'Failed to update task status.'), 'danger');
    } finally {
      setIsOperating(false);
    }
  };

  const handleOpenAddTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  // Safe save task (POST /api/tasks or PATCH /api/tasks/:id)
  const handleSaveTask = async (taskPayload) => {
    setIsOperating(true);

    try {
      if (editingTask) {
        const updated = await taskService.updateTask(editingTask.id, taskPayload);
        setTasks(prevTasks => prevTasks.map(t => (t.id === editingTask.id ? updated : t)));
        showToast(`Updated: "${updated.title}"`, 'success');
      } else {
        const created = await taskService.createTask(taskPayload);
        setTasks(prevTasks => [created, ...prevTasks]);
        showToast(`Added: "${created.title}"`, 'success');
      }
      setEditingTask(null);
      setIsTaskModalOpen(false);
    } catch (err) {
      showToast(getFriendlyErrorMessage(err, 'Failed to save task.'), 'danger');
    } finally {
      setIsOperating(false);
    }
  };

  const handleDeleteRequest = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      setTaskToDelete(task);
    }
  };

  // Safe delete task (DELETE /api/tasks/:id)
  const handleConfirmDelete = async (id) => {
    const task = tasks.find(t => t.id === id);
    setIsOperating(true);

    try {
      await taskService.deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(t => t.id !== id));
      setTaskToDelete(null);
      showToast(task ? `Deleted: "${task.title}"` : 'Task deleted', 'danger');
    } catch (err) {
      showToast(getFriendlyErrorMessage(err, 'Failed to delete task.'), 'danger');
    } finally {
      setIsOperating(false);
    }
  };

  const handleResetFilters = () => {
    setStatusFilter('all');
    setSearchQuery('');
    setCourseFilter('all');
    setCategoryFilter('all');
    setPriorityFilter('all');
    setSortBy('dueDateAsc');
  };

  // Data management actions via Service Layer
  const handleRestoreDemoTasks = async () => {
    setIsOperating(true);
    try {
      const restored = await taskService.restoreDemoTasks();
      setTasks(restored);
      showToast('Demo tasks restored successfully! 🚀', 'success');
    } catch (err) {
      showToast(getFriendlyErrorMessage(err, 'Failed to restore demo tasks.'), 'danger');
    } finally {
      setIsOperating(false);
    }
  };

  const handleConfirmClearAll = async () => {
    setIsOperating(true);
    try {
      await taskService.clearAllTasks();
      setTasks([]);
      setIsClearAllModalOpen(false);
      showToast('All tasks have been cleared from your workspace.', 'danger');
    } catch (err) {
      showToast(getFriendlyErrorMessage(err, 'Failed to clear tasks.'), 'danger');
    } finally {
      setIsOperating(false);
    }
  };

  const handleExportTasks = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `campus_tasks_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Tasks exported to JSON file! 📥', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to export tasks', 'danger');
    }
  };

  // Calculate task counts dynamically from active task state
  const taskCounts = useMemo(() => {
    const completed = tasks.filter(t => t.completed).length;
    return {
      all: tasks.length,
      pending: tasks.length - completed,
      completed
    };
  }, [tasks]);

  const hasActiveFilters = Boolean(
    statusFilter !== 'all' ||
    searchQuery.trim() !== '' ||
    courseFilter !== 'all' ||
    categoryFilter !== 'all' ||
    priorityFilter !== 'all' ||
    sortBy !== 'dueDateAsc'
  );

  // Filtered and Sorted Tasks strictly matching contract fields
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // 1. Status Filter
    if (statusFilter === 'pending') {
      result = result.filter(t => !t.completed);
    } else if (statusFilter === 'completed') {
      result = result.filter(t => t.completed);
    }

    // 2. Search Query (Title, Description, or Course)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(t => 
        (t.title && t.title.toLowerCase().includes(q)) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.course && t.course.toLowerCase().includes(q))
      );
    }

    // 3. Course Filter
    if (courseFilter !== 'all') {
      result = result.filter(t => t.course === courseFilter);
    }

    // 4. Category Filter
    if (categoryFilter !== 'all') {
      result = result.filter(t => t.category === categoryFilter);
    }

    // 5. Priority Filter
    if (priorityFilter !== 'all') {
      result = result.filter(t => t.priority === priorityFilter);
    }

    // 6. Sorting
    result.sort((a, b) => {
      if (sortBy === 'dueDateAsc') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (sortBy === 'dueDateDesc') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(b.dueDate) - new Date(a.dueDate);
      }
      if (sortBy === 'priority') {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
      }
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });

    return result;
  }, [tasks, statusFilter, searchQuery, courseFilter, categoryFilter, priorityFilter, sortBy]);

  return (
    <div className="app-layout">
      {/* Left Navigation Sidebar */}
      <Sidebar
        activeNav={activeNav}
        onNavSelect={handleNavSelect}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <main className="main-content" id="main-content">
        {activeNav === 'Dashboard' && (
          <DashboardView
            tasks={tasks}
            filteredAndSortedTasks={filteredAndSortedTasks}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            courseFilter={courseFilter}
            onCourseFilterChange={setCourseFilter}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onResetFilters={handleResetFilters}
            taskCounts={taskCounts}
            hasActiveFilters={hasActiveFilters}
            isLoading={isLoading}
            onToggleComplete={handleToggleComplete}
            onEditTask={handleOpenEditTask}
            onDeleteTask={handleDeleteRequest}
            onOpenNewTaskModal={handleOpenAddTask}
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
            currentSemester={settings?.semester || 'Fall 2026'}
            onSemesterClick={() => handleNavSelect('Settings')}
          />
        )}

        {activeNav === 'All Tasks' && (
          <AllTasksView
            tasks={tasks}
            filteredAndSortedTasks={filteredAndSortedTasks}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            courseFilter={courseFilter}
            onCourseFilterChange={setCourseFilter}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onResetFilters={handleResetFilters}
            taskCounts={taskCounts}
            hasActiveFilters={hasActiveFilters}
            isLoading={isLoading}
            onToggleComplete={handleToggleComplete}
            onEditTask={handleOpenEditTask}
            onDeleteTask={handleDeleteRequest}
            onOpenNewTaskModal={handleOpenAddTask}
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          />
        )}

        {activeNav === 'Calendar' && (
          <CalendarView
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onEditTask={handleOpenEditTask}
            onDeleteTask={handleDeleteRequest}
            onOpenNewTaskModal={handleOpenAddTask}
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          />
        )}

        {activeNav === 'Analytics' && (
          <AnalyticsView
            tasks={tasks}
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          />
        )}

        {activeNav === 'Settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={setSettings}
            taskCount={tasks.length}
            onRestoreDemoTasks={handleRestoreDemoTasks}
            onOpenClearAllModal={() => setIsClearAllModalOpen(true)}
            onExportTasks={handleExportTasks}
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          />
        )}
      </main>

      {/* Task Creation & Editing Modal Dialog */}
      <TaskModal
        key={editingTask ? editingTask.id : (isTaskModalOpen ? 'open-new' : 'closed')}
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSaveTask={handleSaveTask}
        editingTask={editingTask}
        isSubmitting={isOperating}
      />

      {/* Single Task Delete Confirmation Modal Dialog */}
      <DeleteConfirmModal
        isOpen={Boolean(taskToDelete)}
        task={taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isOperating}
      />

      {/* Clear All Tasks Confirmation Modal Dialog */}
      <ClearAllConfirmModal
        isOpen={isClearAllModalOpen}
        onClose={() => setIsClearAllModalOpen(false)}
        onConfirm={handleConfirmClearAll}
      />

      {/* Action Feedback Toast */}
      <Toast
        toast={toast}
        onClose={() => setToast(null)}
      />
    </div>
  );
}
