import React from 'react';
import HeaderBanner from '../HeaderBanner';
import StatsOverview from '../StatsOverview';
import FilterBar from '../FilterBar';
import TaskList from '../TaskList';

export default function DashboardView({
  tasks,
  filteredAndSortedTasks,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchChange,
  courseFilter,
  onCourseFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  sortBy,
  onSortChange,
  onResetFilters,
  taskCounts,
  hasActiveFilters,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  onOpenNewTaskModal,
  onOpenMobileSidebar,
  currentSemester,
  onSemesterClick
}) {
  return (
    <div className="dashboard-view-wrapper">
      {/* Scenic Academic Header Banner */}
      <HeaderBanner
        onOpenMobileSidebar={onOpenMobileSidebar}
        currentSemester={currentSemester}
        onSemesterClick={onSemesterClick}
      />

      {/* 4 Spacious Metric Cards & Completion Progress */}
      <StatsOverview tasks={tasks} />

      {/* Tasks Section with Filter Toolbar */}
      <div id="main-tasks-section">
        <FilterBar
          statusFilter={statusFilter}
          onStatusFilterChange={onStatusFilterChange}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          courseFilter={courseFilter}
          onCourseFilterChange={onCourseFilterChange}
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
          onToggleComplete={onToggleComplete}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onOpenNewTaskModal={onOpenNewTaskModal}
          onResetFilters={onResetFilters}
        />
      </div>
    </div>
  );
}
