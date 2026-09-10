import React from 'react';
import TaskItem from './TaskItem';
import { ClipboardList, Plus, Sparkles } from 'lucide-react';

export default function TaskList({ 
  tasks, 
  totalTaskCount,
  onToggleComplete, 
  onEditTask,
  onDeleteTask, 
  onOpenNewTaskModal,
  onResetFilters 
}) {
  // Empty State 1: No tasks at all in system
  if (totalTaskCount === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon-circle">
          <Sparkles size={32} />
        </div>
        <h3 className="empty-title">Your Task List is Clear!</h3>
        <p className="empty-subtitle">
          Add your upcoming assignments, exams, or campus projects to stay organized and achieve your academic goals this semester.
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

  // Empty State 2: Filters or search yielded no results
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon-circle" style={{ backgroundColor: '#f1f5f9', color: 'var(--text-secondary)' }}>
          <ClipboardList size={30} />
        </div>
        <h3 className="empty-title">No Matching Tasks Found</h3>
        <p className="empty-subtitle">
          No tasks matched your active filter or search keyword. Try clearing your search or switching to another filter tab.
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

  // Render list of task cards
  return (
    <section className="task-list-container" aria-label="Tasks list">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </section>
  );
}
