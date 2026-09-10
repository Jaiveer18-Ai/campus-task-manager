import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Plus, 
  Check, 
  Clock, 
  Pencil, 
  Trash2, 
  Menu 
} from 'lucide-react';
import { 
  MONTH_NAMES, 
  DAY_NAMES, 
  getDaysInMonth, 
  getFirstDayOfWeek, 
  isSameDay, 
  formatDueDate 
} from '../../utils/dateHelpers';

export default function CalendarView({
  tasks,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  onOpenNewTaskModal,
  onOpenMobileSidebar
}) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(today);

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const prevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const jumpToToday = () => {
    const now = new Date();
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(now);
  };

  // Build days for month grid
  const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfWeek = getFirstDayOfWeek(currentYear, currentMonth);
  const daysInPrevMonth = getDaysInMonth(currentYear, currentMonth - 1);

  // Group tasks by day
  const getTasksForDay = (year, month, day) => {
    const target = new Date(year, month, day);
    return tasks.filter(t => t.dueDate && isSameDay(t.dueDate, target));
  };

  // Selected date tasks
  const selectedDayTasks = tasks.filter(t => t.dueDate && isSameDay(t.dueDate, selectedDate));

  return (
    <div className="calendar-view-wrapper">
      {/* Mobile Header Bar */}
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
          Calendar
        </span>
        <div style={{ width: 32 }} />
      </div>

      {/* Calendar Header */}
      <div className="calendar-header-card">
        <div className="calendar-nav-left">
          <div className="calendar-title-group">
            <h1 className="view-title" style={{ fontSize: '1.45rem', marginBottom: '0.2rem' }}>
              Academic Deadline Calendar
            </h1>
            <p className="view-subtitle" style={{ fontSize: '0.85rem' }}>
              Track due dates, exams, and milestones across the semester.
            </p>
          </div>
        </div>

        <div className="calendar-nav-controls">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={jumpToToday}
            id="btn-calendar-today"
          >
            Today
          </button>

          <div className="month-pagination-group">
            <button
              type="button"
              className="btn-icon"
              onClick={prevMonth}
              aria-label="Previous Month"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="current-month-display">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </span>

            <button
              type="button"
              className="btn-icon"
              onClick={nextMonth}
              aria-label="Next Month"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={onOpenNewTaskModal}
            id="btn-calendar-add-task"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Main Calendar Grid & Day Sidebar Layout */}
      <div className="calendar-content-layout">
        {/* Calendar Grid Container */}
        <div className="calendar-grid-card">
          {/* Day of Week Headers */}
          <div className="calendar-days-header" role="row">
            {DAY_NAMES.map(day => (
              <div key={day} className="day-name-cell" role="columnheader">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Day Cells */}
          <div className="calendar-month-grid" role="grid">
            {/* Prev month padding days */}
            {Array.from({ length: firstDayOfWeek }).map((_, idx) => {
              const dayNum = daysInPrevMonth - firstDayOfWeek + idx + 1;
              return (
                <div key={`prev-${dayNum}`} className="calendar-day-cell outside-month" aria-hidden="true">
                  <span className="day-number">{dayNum}</span>
                </div>
              );
            })}

            {/* Current month days */}
            {Array.from({ length: daysInCurrentMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateObj = new Date(currentYear, currentMonth, dayNum);
              const isToday = isSameDay(dateObj, today);
              const isSelected = isSameDay(dateObj, selectedDate);
              const dayTasks = getTasksForDay(currentYear, currentMonth, dayNum);

              return (
                <div
                  key={`cur-${dayNum}`}
                  className={`calendar-day-cell ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => setSelectedDate(dateObj)}
                  role="gridcell"
                  tabIndex={0}
                  aria-label={`${MONTH_NAMES[currentMonth]} ${dayNum}, ${currentYear}. ${dayTasks.length} tasks.`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setSelectedDate(dateObj);
                  }}
                >
                  <div className="day-cell-top">
                    <span className={`day-number ${isToday ? 'today-pill' : ''}`}>
                      {dayNum}
                    </span>
                    {dayTasks.length > 0 && (
                      <span className="day-task-count-dot" title={`${dayTasks.length} tasks due`} />
                    )}
                  </div>

                  {/* Task chips list */}
                  <div className="day-task-chips">
                    {dayTasks.slice(0, 2).map(t => (
                      <div
                        key={t.id}
                        className={`calendar-task-chip ${t.completed ? 'completed' : ''} priority-${t.priority}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditTask(t);
                        }}
                        title={`${t.course}: ${t.title} (${t.priority} priority)`}
                      >
                        <span className="chip-course">{t.course}</span>
                        <span className="chip-title">{t.title}</span>
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <span className="more-tasks-badge">
                        +{dayTasks.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Task Details Panel */}
        <aside className="calendar-day-details-panel" aria-label="Selected Date Deadlines">
          <div className="panel-header">
            <div>
              <span className="panel-sub">Selected Date</span>
              <h3 className="panel-date-title">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </h3>
            </div>
            {isSameDay(selectedDate, today) && (
              <span className="badge priority-badge low" style={{ fontWeight: 700 }}>
                Today
              </span>
            )}
          </div>

          <div className="panel-tasks-list">
            {selectedDayTasks.length === 0 ? (
              <div className="panel-empty-state">
                <CalendarIcon size={32} color="var(--text-muted)" style={{ marginBottom: '0.75rem' }} />
                <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  No Deadlines Scheduled
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Take advantage of free study time or plan ahead!
                </p>
              </div>
            ) : (
              selectedDayTasks.map(task => (
                <div key={task.id} className={`panel-task-card ${task.completed ? 'completed' : ''}`}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={task.completed}
                    className={`task-checkbox-btn ${task.completed ? 'checked' : ''}`}
                    onClick={() => onToggleComplete(task.id)}
                    aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
                  >
                    <Check size={13} strokeWidth={3} />
                  </button>

                  <div className="panel-task-content">
                    <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', marginBottom: '0.2rem' }}>
                      <span className="badge category-badge" style={{ fontSize: '0.7rem' }}>
                        {task.course}
                      </span>
                      <span className={`badge priority-badge ${task.priority}`} style={{ fontSize: '0.7rem' }}>
                        {task.priority}
                      </span>
                    </div>
                    <span className={`panel-task-title ${task.completed ? 'strike' : ''}`}>
                      {task.title}
                    </span>
                    <span className="panel-task-time">
                      <Clock size={12} />
                      <span>{formatDueDate(task.dueDate)}</span>
                    </span>
                  </div>

                  <div className="task-action-buttons">
                    <button
                      type="button"
                      className="btn-icon edit"
                      onClick={() => onEditTask(task)}
                      aria-label="Edit task"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      className="btn-icon delete"
                      onClick={() => onDeleteTask(task.id)}
                      aria-label="Delete task"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
