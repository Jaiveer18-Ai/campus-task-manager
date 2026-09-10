import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import HeaderBanner from './components/HeaderBanner';
import StatsOverview from './components/StatsOverview';
import FilterBar from './components/FilterBar';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import { loadTasks, saveTasks } from './utils/storage';

export default function App() {
  // Navigation State
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
  const [toast, setToast] = useState(null);

  // Sync tasks to localStorage
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const handleNavSelect = (navId) => {
    setActiveNav(navId);
    if (navId === 'All Tasks') {
      setStatusFilter('all');
      document.getElementById('main-tasks-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (navId !== 'Dashboard') {
      showToast(`${navId} module will be available in the next release!`, 'info');
    }
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
      <div className="main-content">
        {/* Scenic Academic Header Banner */}
        <HeaderBanner
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* 4 Metric Cards & Completion Progress */}
        <StatsOverview tasks={tasks} />

        {/* Tasks Section with Filter Toolbar */}
        <div id="main-tasks-section">
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
            onOpenNewTaskModal={handleOpenAddTask}
          />

          <TaskList
            tasks={filteredAndSortedTasks}
            totalTaskCount={tasks.length}
            onToggleComplete={handleToggleComplete}
            onEditTask={handleOpenEditTask}
            onDeleteTask={handleDeleteRequest}
            onOpenNewTaskModal={handleOpenAddTask}
            onResetFilters={handleResetFilters}
          />
        </div>
      </div>

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

      {/* Delete Confirmation Modal Dialog */}
      <DeleteConfirmModal
        isOpen={Boolean(taskToDelete)}
        task={taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Action Feedback Toast */}
      <Toast
        toast={toast}
        onClose={() => setToast(null)}
      />
    </div>
  );
}
