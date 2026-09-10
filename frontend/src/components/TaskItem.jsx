import React from 'react';
import { 
  Check, 
  Calendar, 
  Trash2, 
  Pencil, 
  AlertCircle 
} from 'lucide-react';
import { formatDueDate, getDueStatus } from '../utils/dateHelpers';

export default function TaskItem({ task, onToggleComplete, onEditTask, onDeleteTask }) {
  const { label: dueLabel, urgency, chipLabel, chipVariant } = getDueStatus(task.dueDate, task.completed);

  // Map course to badge class
  const getCourseBadgeClass = (course) => {
    if (!course) return 'course-badge-cs';
    const lower = course.toLowerCase();
    if (lower.includes('campus')) return 'course-badge-campus';
    if (lower.includes('math')) return 'course-badge-math';
    if (lower.includes('phys')) return 'course-badge-phys';
    if (lower.includes('eng')) return 'course-badge-eng';
    if (lower.includes('club')) return 'course-badge-club';
    return 'course-badge-cs'; // default CS101
  };

  // Determine left border color class
  const getBorderAccentClass = () => {
    if (task.completed) return 'border-completed';
    if (urgency === 'urgent') return 'border-urgent';
    if (urgency === 'soon') return 'border-soon';
    if (urgency === 'upcoming') return 'border-upcoming';
    return 'border-default';
  };

  return (
    <article 
      className={`task-card ${task.completed ? 'is-completed' : ''} ${getBorderAccentClass()}`}
      aria-label={`Task: ${task.title}`}
    >
      {/* Checkbox */}
      <button
        type="button"
        className={`task-checkbox-btn ${task.completed ? 'checked' : ''}`}
        onClick={() => onToggleComplete(task.id)}
        aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
        title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        <Check size={14} strokeWidth={3} />
      </button>

      {/* Main Task Information */}
      <div className="task-content">
        {/* Tags Row */}
        <div className="task-tags-row">
          {task.course && (
            <span className={`badge ${getCourseBadgeClass(task.course)}`}>
              {task.course}
            </span>
          )}

          {task.category && (
            <span className="badge category-badge">
              {task.category}
            </span>
          )}

          <span className={`badge priority-badge ${task.priority}`}>
            {task.priority === 'high' && 'High Priority'}
            {task.priority === 'medium' && 'Medium Priority'}
            {task.priority === 'low' && 'Low Priority'}
          </span>
        </div>

        {/* Title */}
        <h3 className="task-title-text">
          {task.title}
        </h3>

        {/* Description */}
        {task.description && (
          <p className="task-description-text">{task.description}</p>
        )}

        {/* Due Date Indicator */}
        {task.dueDate && (
          <div className={`task-due-row ${!task.completed && urgency ? urgency : ''}`}>
            <Calendar size={13} aria-hidden="true" />
            <span>{formatDueDate(task.dueDate)}</span>
            {dueLabel && (
              <span>({dueLabel})</span>
            )}
          </div>
        )}
      </div>

      {/* Right Side: Status Chip + Edit & Delete Actions */}
      <div className="task-right-area">
        {chipLabel && (
          <span className={`status-chip ${chipVariant}`}>
            {chipVariant === 'completed' && <Check size={12} strokeWidth={3} />}
            {chipVariant === 'urgent' && <AlertCircle size={12} strokeWidth={2.5} />}
            {chipVariant === 'soon' && <AlertCircle size={12} strokeWidth={2.5} />}
            {chipVariant === 'upcoming' && <AlertCircle size={12} strokeWidth={2.5} />}
            <span>{chipLabel}</span>
          </span>
        )}

        <div className="task-action-buttons">
          <button
            type="button"
            className="btn-icon edit"
            onClick={() => onEditTask(task)}
            aria-label={`Edit task "${task.title}"`}
            title="Edit task"
          >
            <Pencil size={15} />
          </button>

          <button
            type="button"
            className="btn-icon delete"
            onClick={() => onDeleteTask(task.id)}
            aria-label={`Delete task "${task.title}"`}
            title="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
