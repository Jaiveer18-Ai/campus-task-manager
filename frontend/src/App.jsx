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
import { 
  loadTasks, 
  saveTasks, 
  loadSettings, 
  saveSettings, 
  resetToDemoTasks, 
  clearAllStoredTasks 
} from './utils/storage';

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

  // Tasks State
  const [tasks, setTasks] = useState(loadTasks);

  // Filter & Search State
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDateAsc');

  // Modal & Notification State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Sync tasks to localStorage
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Sync settings to localStorage and handle reduced motion
  useEffect(() => {
    saveSettings(settings);
    if (settings?.reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
  }, [settings]);

  // Hash-based routing synchronization (supports back/forward buttons and bookmarks)
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

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const handleNavSelect = (navId) => {
    setActiveNav(navId);
    const targetHash = NAV_TO_HASH[navId] || '#dashboard';
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Task Actions
  const handleToggleComplete = (id) => {
    setTasks(prevTasks => {
      const updated = prevTasks.map(task => {
        if (task.id === id) {
          const nextCompleted = !task.completed;
          showToast(
            nextCompleted ? 'Task completed! Keep up the momentum! 🎉' : 'Task marked as active.',
            nextCompleted ? 'success' : 'info'
          );
          return { ...task, completed: nextCompleted, updatedAt: new Date().toISOString() };
        }
        return task;
      });
      return updated;
    });
  };

  const handleOpenAddTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (taskData) => {
    setTasks(prevTasks => {
      const exists = prevTasks.some(t => t.id === taskData.id);
      if (exists) {
        showToast(`Updated: "${taskData.title}"`, 'success');
        return prevTasks.map(t => (t.id === taskData.id ? taskData : t));
      } else {
        showToast(`Added: "${taskData.title}"`, 'success');
        return [taskData, ...prevTasks];
      }
    });
    setEditingTask(null);
  };

  const handleDeleteRequest = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      setTaskToDelete(task);
    }
  };

  const handleConfirmDelete = (id) => {
    const task = tasks.find(t => t.id === id);
    setTasks(prevTasks => prevTasks.filter(t => t.id !== id));
    setTaskToDelete(null);
    showToast(task ? `Deleted: "${task.title}"` : 'Task deleted', 'danger');
  };

  const handleResetFilters = () => {
    setStatusFilter('all');
    setSearchQuery('');
    setCourseFilter('all');
    setPriorityFilter('all');
    setSortBy('dueDateAsc');
  };

  // Data management actions
  const handleRestoreDemoTasks = () => {
    const restored = resetToDemoTasks();
    setTasks(restored);
    showToast('Demo tasks restored successfully! 🚀', 'success');
  };

  const handleConfirmClearAll = () => {
    clearAllStoredTasks();
    setTasks([]);
    setIsClearAllModalOpen(false);
    showToast('All tasks have been cleared from your workspace.', 'danger');
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

  // Calculate task counts
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
    priorityFilter !== 'all' ||
    sortBy !== 'dueDateAsc'
  );

  // Filtered and Sorted Tasks
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
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.course && t.course.toLowerCase().includes(q))
      );
    }

    // 3. Course Filter
    if (courseFilter !== 'all') {
      result = result.filter(t => t.course === courseFilter);
    }

    // 4. Priority Filter
    if (priorityFilter !== 'all') {
      result = result.filter(t => t.priority === priorityFilter);
    }

    // 5. Sorting
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
  }, [tasks, statusFilter, searchQuery, courseFilter, priorityFilter, sortBy]);

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
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onResetFilters={handleResetFilters}
            taskCounts={taskCounts}
            hasActiveFilters={hasActiveFilters}
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
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onResetFilters={handleResetFilters}
            taskCounts={taskCounts}
            hasActiveFilters={hasActiveFilters}
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
      />

      {/* Single Task Delete Confirmation Modal Dialog */}
      <DeleteConfirmModal
        isOpen={Boolean(taskToDelete)}
        task={taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
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
