import React from 'react';
import FilterBar from '../FilterBar';
import TaskList from '../TaskList';
import { Menu } from 'lucide-react';

export default function AllTasksView({
  tasks,
  filteredAndSortedTasks,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchChange,
  courseFilter,
  onCourseFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  sortBy,
  onSortChange,
  onResetFilters,
  taskCounts,
  hasActiveFilters,
  isLoading,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  onOpenNewTaskModal,
  onOpenMobileSidebar
}) {
  return (
    <div className="all-tasks-view-wrapper">
      {/* Mobile top bar toggle */}
      <div className="mobile-header-bar">
        <button
          type="button"
          className="btn-icon"
          onClick={onOpenMobileSidebar}
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>
        <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
          All Tasks
        </span>
        <div style={{ width: 32 }} />
      </div>

      {/* View Header */}
      <div className="view-intro-header">
        <div>
          <h1 className="view-title">All Tasks & Deadlines</h1>
          <p className="view-subtitle">
            Browse, search, and manage your complete academic workload across all courses.
          </p>
        </div>
      </div>

      {/* Shared Filter Controls & Task List */}
      <FilterBar
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        courseFilter={courseFilter}
        onCourseFilterChange={onCourseFilterChange}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={onCategoryFilterChange}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={onPriorityFilterChange}
        sortBy={sortBy}
        onSortChange={onSortChange}
        onResetFilters={onResetFilters}
        taskCounts={taskCounts}
        hasActiveFilters={hasActiveFilters}
        onOpenNewTaskModal={onOpenNewTaskModal}
      />

      <TaskList
        tasks={filteredAndSortedTasks}
        totalTaskCount={tasks.length}
        isLoading={isLoading}
        onToggleComplete={onToggleComplete}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        onOpenNewTaskModal={onOpenNewTaskModal}
        onResetFilters={onResetFilters}
      />
    </div>
  );
}
