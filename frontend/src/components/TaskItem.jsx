import React from 'react';
import { Check, Calendar, Trash2, Tag, AlertCircle } from 'lucide-react';
import { formatDueDate, getDueStatus } from '../utils/dateHelpers';

export default function TaskItem({ task, onToggleComplete, onDeleteTask }) {
  const { label: dueLabel, urgency } = getDueStatus(task.dueDate, task.completed);

  // Helper to map course code to badge style
  const getCourseBadgeClass = (course) => {
    if (!course) return 'course-badge';
    const lower = course.toLowerCase();
    if (lower.includes('math')) return 'course-badge math';
    if (lower.includes('phys') || lower.includes('chem') || lower.includes('bio')) return 'course-badge science';
    if (lower.includes('eng') || lower.includes('hist') || lower.includes('lit')) return 'course-badge humanities';
    if (lower.includes('club') || lower.includes('extra')) return 'course-badge club';
    return 'course-badge'; // Default CS / Tech indigo
  };

  return (
    <article 
      className={`task-card ${task.completed ? 'completed' : ''}`}
      aria-label={`Task: ${task.title}`}
    >
      {/* Interactive Animated Checkbox */}
      <button
        type="button"
        className={`task-checkbox-btn ${task.completed ? 'checked' : ''}`}
        onClick={() => onToggleComplete(task.id)}
        aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as completed'}
        title={task.completed ? 'Mark as incomplete' : 'Mark as completed'}
      >
        <Check size={14} strokeWidth={3} />
      </button>

      {/* Task Information */}
      <div className="task-content">
        <div className="task-meta-top">
          {task.course && (
            <span className={`badge ${getCourseBadgeClass(task.course)}`}>
              {task.course}
            </span>
          )}

          {task.category && (
            <span className="badge category-tag">
              <Tag size={10} aria-hidden="true" />
              <span>{task.category}</span>
            </span>
          )}

          <span className={`badge priority-badge ${task.priority}`}>
            {task.priority === 'high' && 'High Priority'}
            {task.priority === 'medium' && 'Medium Priority'}
            {task.priority === 'low' && 'Low Priority'}
          </span>
        </div>

        <h3 className="task-title">
          {task.title}
        </h3>

        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        <div className="task-meta-bottom">
          {task.dueDate && (
            <div className={`due-date-indicator ${!task.completed && urgency ? urgency : ''}`}>
              <Calendar size={13} aria-hidden="true" />
              <span>{formatDueDate(task.dueDate)}</span>
              {dueLabel && (
                <span style={{ fontWeight: 600 }}>({dueLabel})</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Task Actions */}
      <div className="task-actions">
        <button
          type="button"
          className="btn-icon"
          onClick={() => onDeleteTask(task.id)}
          aria-label={`Delete task "${task.title}"`}
          title="Delete task"
          style={{ color: 'var(--danger)' }}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </article>
  );
}
