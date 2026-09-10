import React from 'react';
import { GraduationCap, Sun, Moon, Plus, Sparkles } from 'lucide-react';

export default function Navbar({ theme, onToggleTheme, onOpenNewTaskModal }) {
  return (
    <header className="navbar" role="banner">
      <div className="nav-brand">
        <div className="nav-logo-icon" aria-hidden="true">
          <GraduationCap size={24} />
        </div>
        <div className="nav-title-group">
          <h1>Campus Task Manager</h1>
          <span className="nav-subtitle">Student Academic Planner & Progress Tracker</span>
        </div>
      </div>

      <div className="nav-actions">
        <span className="term-badge" title="Current Academic Session">
          <Sparkles size={12} />
          <span>Fall 2026</span>
        </span>

        <button
          type="button"
          className="btn-icon"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={onOpenNewTaskModal}
          id="btn-add-task-header"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
}
