import React from 'react';
import TaskItem from './TaskItem';
import { ClipboardList, CheckCheck, Plus, Sparkles } from 'lucide-react';

export default function TaskList({ 
  tasks, 
  totalTaskCount,
  onToggleComplete, 
  onDeleteTask, 
  onOpenNewTaskModal,
  onResetFilters 
}) {
  // Empty State 1: No tasks at all in the system
  if (totalTaskCount === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon-circle">
          <Sparkles size={32} />
        </div>
        <h3 className="empty-title">Welcome to Campus Task Manager!</h3>
        <p className="empty-subtitle">
          Your academic workspace is currently clear. Add your upcoming assignments, exams, or campus projects to stay on top of your semester.
        </p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onOpenNewTaskModal}
          id="btn-empty-add-task"
        >
          <Plus size={16} />
          <span>Create Your First Task</span>
        </button>
      </div>
    );
  }

  // Empty State 2: No tasks match the current filter/search
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon-circle" style={{ backgroundColor: 'var(--bg-surface-subtle)', color: 'var(--text-secondary)' }}>
          <ClipboardList size={32} />
        </div>
        <h3 className="empty-title">No Matching Tasks Found</h3>
        <p className="empty-subtitle">
          No tasks matched your active filter or search query. Try switching filter tabs or clearing your search criteria.
        </p>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onResetFilters}
          id="btn-empty-reset-filters"
        >
          <span>Clear All Filters</span>
        </button>
      </div>
    );
  }

  // Active Task List
  return (
    <section className="task-list-section" aria-label="Tasks list">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </section>
  );
}
