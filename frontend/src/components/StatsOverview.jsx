import React from 'react';
import { ListTodo, Clock, Check, AlertTriangle, BarChart2 } from 'lucide-react';
import { getDueStatus } from '../utils/dateHelpers';

export default function StatsOverview({ tasks }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const inProgressTasks = totalTasks - completedTasks;

  const urgentTasks = tasks.filter(t => {
    if (t.completed) return false;
    const status = getDueStatus(t.dueDate, t.completed);
    return status.urgency === 'urgent';
  }).length;

  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <section aria-label="Academic Progress Overview">
      {/* 4 Spacious Metric Cards */}
      <div className="stats-grid">
        <div className="stat-card" id="stat-total-assigned">
          <div className="stat-icon-wrapper purple" aria-hidden="true">
            <ListTodo size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Assigned</span>
            <div className="stat-value-group">
              <span className="stat-number">{totalTasks}</span>
              <span className="stat-unit">{totalTasks === 1 ? 'task' : 'tasks'}</span>
            </div>
          </div>
        </div>

        <div className="stat-card" id="stat-in-progress">
          <div className="stat-icon-wrapper amber" aria-hidden="true">
            <Clock size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">In Progress</span>
            <div className="stat-value-group">
              <span className="stat-number">{inProgressTasks}</span>
              <span className="stat-unit">{inProgressTasks === 1 ? 'task' : 'tasks'}</span>
            </div>
          </div>
        </div>

        <div className="stat-card" id="stat-completed">
          <div className="stat-icon-wrapper emerald" aria-hidden="true">
            <Check size={22} strokeWidth={2.5} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Completed</span>
            <div className="stat-value-group">
              <span className="stat-number">{completedTasks}</span>
              <span className="stat-unit">{completedTasks === 1 ? 'task' : 'tasks'}</span>
            </div>
          </div>
        </div>

        <div className="stat-card" id="stat-urgent">
          <div className="stat-icon-wrapper coral" aria-hidden="true">
            <AlertTriangle size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Urgent / Due Today</span>
            <div className="stat-value-group">
              <span className="stat-number">{urgentTasks}</span>
              <span className="stat-unit">{urgentTasks === 1 ? 'task' : 'tasks'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Section Card */}
      <div className="progress-section-card">
        <div className="progress-header">
          <div className="progress-title-area">
            <BarChart2 size={19} className="progress-title-icon" />
            <span className="progress-title-text">Semester Task Completion</span>
          </div>
          <div className="progress-meta-area">
            <span className="progress-percentage">{completionRate}% Completed</span>
            <span className="progress-subtext">
              <Clock size={14} />
              <span>{completedTasks} of {totalTasks} tasks done</span>
            </span>
          </div>
        </div>

        <div 
          className="progress-track"
          role="progressbar"
          aria-valuenow={completionRate}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="Semester task completion"
        >
          <div 
            className="progress-fill"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>
    </section>
  );
}
