import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, AlertCircle, Calendar, BookOpen, Layers } from 'lucide-react';
import { COURSE_OPTIONS, CATEGORY_OPTIONS } from '../data/mockTasks';

export default function TaskModal({ isOpen, onClose, onAddTask }) {
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('CS101');
  const [category, setCategory] = useState('Assignment');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const titleInputRef = useRef(null);

  // Set default due date to tomorrow at 23:59
  useEffect(() => {
    if (isOpen) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(23, 59, 0, 0);
      setDueDate(tomorrow.toISOString().slice(0, 16));
      setError('');
      
      // Auto-focus title input when modal opens
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Keyboard shortcut: ESC to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a task title.');
      titleInputRef.current?.focus();
      return;
    }

    const newTask = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      course,
      category,
      priority,
      dueDate,
      description: description.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    onAddTask(newTask);
    // Reset form
    setTitle('');
    setDescription('');
    setError('');
    onClose();
  };

  return (
    <div 
      className="modal-backdrop" 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div 
        className="modal-dialog" 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-add-title"
      >
        <div className="modal-header">
          <h2 id="modal-add-title" className="modal-title">
            <Plus size={20} className="text-primary" />
            <span>Add New Student Task</span>
          </h2>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            {/* Title Input */}
            <div className="form-group">
              <label htmlFor="task-title-input" className="form-label">
                <span>Task Title <span className="required" aria-hidden="true">*</span></span>
              </label>
              <input
                ref={titleInputRef}
                id="task-title-input"
                type="text"
                className="form-input"
                placeholder="e.g. Submit CS101 Lab 3, Prepare for Midterm"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (error) setError('');
                }}
                required
              />
              {error && (
                <div className="form-error-msg" role="alert">
                  <AlertCircle size={13} style={{ display: 'inline', marginRight: '4px' }} />
                  {error}
                </div>
              )}
            </div>

            {/* Course & Category Grid */}
            <div className="form-grid-2">
              <div className="form-group">
                <label htmlFor="task-course-select" className="form-label">
                  <span>Course / Subject</span>
                </label>
                <select
                  id="task-course-select"
                  className="form-select"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                >
                  {COURSE_OPTIONS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="task-category-select" className="form-label">
                  <span>Category</span>
                </label>
                <select
                  id="task-category-select"
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORY_OPTIONS.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Priority Selection (Radio Chips) */}
            <div className="form-group">
              <label className="form-label">Priority Level</label>
              <div className="priority-chip-group" role="radiogroup" aria-label="Priority Level">
                <button
                  type="button"
                  role="radio"
                  aria-checked={priority === 'low'}
                  className={`priority-chip ${priority === 'low' ? 'selected low' : ''}`}
                  onClick={() => setPriority('low')}
                >
                  <span>Low</span>
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={priority === 'medium'}
                  className={`priority-chip ${priority === 'medium' ? 'selected medium' : ''}`}
                  onClick={() => setPriority('medium')}
                >
                  <span>Medium</span>
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={priority === 'high'}
                  className={`priority-chip ${priority === 'high' ? 'selected high' : ''}`}
                  onClick={() => setPriority('high')}
                >
                  <span>High</span>
                </button>
              </div>
            </div>

            {/* Due Date Input */}
            <div className="form-group">
              <label htmlFor="task-due-date-input" className="form-label">
                <span>Due Date & Time</span>
              </label>
              <input
                id="task-due-date-input"
                type="datetime-local"
                className="form-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            {/* Description / Notes */}
            <div className="form-group">
              <label htmlFor="task-desc-input" className="form-label">
                <span>Notes & Instructions (Optional)</span>
              </label>
              <textarea
                id="task-desc-input"
                className="form-textarea"
                rows="3"
                placeholder="Include room location, submission links, or group members..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              id="btn-submit-task"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Add Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
