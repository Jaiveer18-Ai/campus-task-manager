import React from 'react';
import { 
  Search, 
  X, 
  BookOpen, 
  Flag, 
  Tag,
  ArrowUpDown, 
  Plus, 
  RotateCcw 
} from 'lucide-react';
import { COURSE_OPTIONS, CATEGORY_OPTIONS } from '../data/mockTasks';

export default function FilterBar({
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchChange,
  courseFilter,
  onCourseFilterChange,
  categoryFilter = 'all',
  onCategoryFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  sortBy,
  onSortChange,
  onResetFilters,
  taskCounts,
  hasActiveFilters,
  onOpenNewTaskModal
}) {
  return (
    <div className="tasks-controls-wrapper">
      {/* Tasks Section Header: Title, Description & New Task Button */}
      <div className="tasks-section-header">
        <div className="tasks-header-left">
          <h2>Your Tasks</h2>
          <p>Manage your academic tasks, deadlines, and goals.</p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={onOpenNewTaskModal}
          id="btn-add-task-main"
        >
          <Plus size={17} strokeWidth={2.5} />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="filter-toolbar" role="search" aria-label="Task filters and search">
        {/* Top Row: Search + Select Dropdowns */}
        <div className="filter-row-top">
          <div className="search-container">
            <Search size={16} className="search-icon-left" aria-hidden="true" />
            <input
              type="text"
              className="search-input-field"
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
                aria-label="Clear search"
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Course Select */}
          <div className="select-wrapper">
            <BookOpen size={14} className="select-icon-prefix" aria-hidden="true" />
            <select
              className="select-control"
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
          </div>

          {/* Category Select */}
          <div className="select-wrapper">
            <Tag size={14} className="select-icon-prefix" aria-hidden="true" />
            <select
              className="select-control"
              value={categoryFilter}
              onChange={(e) => onCategoryFilterChange?.(e.target.value)}
              aria-label="Filter by category"
              id="select-category-filter"
            >
              <option value="all">All Categories</option>
              {CATEGORY_OPTIONS.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Priority Select */}
          <div className="select-wrapper">
            <Flag size={14} className="select-icon-prefix" aria-hidden="true" />
            <select
              className="select-control"
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
          </div>

          {/* Sort Select */}
          <div className="select-wrapper">
            <ArrowUpDown size={14} className="select-icon-prefix" aria-hidden="true" />
            <select
              className="select-control"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              aria-label="Sort tasks by"
              id="select-sort-tasks"
            >
              <option value="dueDateAsc">Due Date (Soonest)</option>
              <option value="dueDateDesc">Due Date (Latest)</option>
              <option value="priority">Priority (Highest)</option>
              <option value="newest">Recently Added</option>
            </select>
          </div>
        </div>

        {/* Bottom Row: Status Tabs + Reset Button */}
        <div className="filter-row-bottom">
          <div className="status-pill-group" role="tablist" aria-label="Filter tasks by completion status">
            <button
              type="button"
              role="tab"
              aria-selected={statusFilter === 'all'}
              className={`status-pill ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => onStatusFilterChange('all')}
              id="tab-all-tasks"
            >
              <span>All</span>
              <span className="pill-count">{taskCounts.all}</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={statusFilter === 'pending'}
              className={`status-pill ${statusFilter === 'pending' ? 'active' : ''}`}
              onClick={() => onStatusFilterChange('pending')}
              id="tab-pending-tasks"
            >
              <span>Active</span>
              <span className="pill-count">{taskCounts.pending}</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={statusFilter === 'completed'}
              className={`status-pill ${statusFilter === 'completed' ? 'active' : ''}`}
              onClick={() => onStatusFilterChange('completed')}
              id="tab-completed-tasks"
            >
              <span>Completed</span>
              <span className="pill-count">{taskCounts.completed}</span>
            </button>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.8125rem', padding: '0.4rem 0.8rem' }}
              onClick={onResetFilters}
              title="Reset all active filters"
            >
              <RotateCcw size={13} />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
