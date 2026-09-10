import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import FilterBar from './components/FilterBar';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import { loadTasks, saveTasks, loadTheme, saveTheme } from './utils/storage';

export default function App() {
  // Theme State
  const [theme, setTheme] = useState(loadTheme);

  // Tasks State
  const [tasks, setTasks] = useState(loadTasks);

  // Filter & Search State
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDateAsc');

  // Modal & Notification State
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  // Sync theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    saveTheme(theme);
  }, [theme]);

  // Sync tasks to localStorage
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  // Task Actions
  const handleToggleComplete = (id) => {
    setTasks(prevTasks => {
      const updated = prevTasks.map(task => {
        if (task.id === id) {
          const nextCompleted = !task.completed;
          showToast(
            nextCompleted ? 'Task marked as completed! 🎉' : 'Task marked as active.',
            nextCompleted ? 'success' : 'info'
          );
          return { ...task, completed: nextCompleted };
        }
        return task;
      });
      return updated;
    });
  };

  const handleAddTask = (newTask) => {
    setTasks(prevTasks => [newTask, ...prevTasks]);
    showToast(`Added: "${newTask.title}"`, 'success');
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

  // Calculate task counts for status tabs
  const taskCounts = useMemo(() => {
    const completed = tasks.filter(t => t.completed).length;
    return {
      all: tasks.length,
      pending: tasks.length - completed,
      completed
    };
  }, [tasks]);

  // Check if non-default filters are active
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
    <div className="app-container">
      {/* Top Navigation */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenNewTaskModal={() => setIsNewTaskModalOpen(true)}
      />

      {/* Main Content Area */}
      <main id="main-content">
        {/* Progress & Metrics Overview */}
        <StatsOverview tasks={tasks} />

        {/* Filters, Search & Controls */}
        <FilterBar
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
        />

        {/* Task List / Empty State */}
        <TaskList
          tasks={filteredAndSortedTasks}
          totalTaskCount={tasks.length}
          onToggleComplete={handleToggleComplete}
          onDeleteTask={handleDeleteRequest}
          onOpenNewTaskModal={() => setIsNewTaskModalOpen(true)}
          onResetFilters={handleResetFilters}
        />
      </main>

      {/* Add New Task Modal Dialog */}
      <TaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onAddTask={handleAddTask}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(taskToDelete)}
        task={taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Animated Action Toast */}
      <Toast
        toast={toast}
        onClose={() => setToast(null)}
      />
    </div>
  );
}
