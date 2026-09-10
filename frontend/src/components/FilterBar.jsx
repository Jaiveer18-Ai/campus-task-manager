import React from 'react';
import { Search, X, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { COURSE_OPTIONS } from '../data/mockTasks';

export default function FilterBar({
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
  hasActiveFilters
}) {
  return (
    <div className="filter-card" role="search" aria-label="Task filters and search">
      {/* Top Row: Status Tabs & Quick Reset */}
      <div className="filter-top-row">
        <div className="status-tabs" role="tablist" aria-label="Filter tasks by completion status">
          <button
            type="button"
            role="tab"
            aria-selected={statusFilter === 'all'}
            className={`status-tab ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => onStatusFilterChange('all')}
            id="tab-all-tasks"
          >
            <span>All</span>
            <span className="tab-counter">{taskCounts.all}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={statusFilter === 'pending'}
            className={`status-tab ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => onStatusFilterChange('pending')}
            id="tab-pending-tasks"
          >
            <span>Active</span>
            <span className="tab-counter">{taskCounts.pending}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={statusFilter === 'completed'}
            className={`status-tab ${statusFilter === 'completed' ? 'active' : ''}`}
            onClick={() => onStatusFilterChange('completed')}
            id="tab-completed-tasks"
          >
            <span>Completed</span>
            <span className="tab-counter">{taskCounts.completed}</span>
          </button>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            className="btn btn-ghost"
            style={{ fontSize: '0.8125rem', padding: '0.4rem 0.65rem' }}
            onClick={onResetFilters}
            title="Reset all filters to default"
          >
            <RotateCcw size={14} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Bottom Row: Search, Course, Priority, and Sort Dropdowns */}
      <div className="filter-bottom-row">
        <div className="search-wrapper">
          <Search size={16} className="search-icon" aria-hidden="true" />
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks, courses, or notes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search tasks"
            id="input-task-search"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              aria-label="Clear search input"
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="dropdown-group">
          <select
            className="custom-select"
            value={courseFilter}
            onChange={(e) => onCourseFilterChange(e.target.value)}
            aria-label="Filter by course"
            id="select-course-filter"
          >
            <option value="all">All Courses</option>
            {COURSE_OPTIONS.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>

          <select
            className="custom-select"
            value={priorityFilter}
            onChange={(e) => onPriorityFilterChange(e.target.value)}
            aria-label="Filter by priority"
            id="select-priority-filter"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          <select
            className="custom-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort tasks by"
            id="select-sort-tasks"
          >
            <option value="dueDateAsc">Due Date (Soonest first)</option>
            <option value="dueDateDesc">Due Date (Latest first)</option>
            <option value="priority">Priority (High to Low)</option>
            <option value="newest">Recently Added</option>
          </select>
        </div>
      </div>
    </div>
  );
}
