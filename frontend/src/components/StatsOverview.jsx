import React from 'react';
import { CheckCircle2, Clock, ListTodo, AlertTriangle, TrendingUp } from 'lucide-react';
import { getDueStatus } from '../utils/dateHelpers';

export default function StatsOverview({ tasks }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  
  const urgentTasks = tasks.filter(t => {
    if (t.completed) return false;
    const status = getDueStatus(t.dueDate, t.completed);
    return status.urgency === 'urgent';
  }).length;

  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <section aria-label="Academic Progress Overview">
      {/* Metric Cards Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Total Assigned</span>
            <span className="stat-value">{totalTasks}</span>
          </div>
          <div className="stat-icon-wrapper primary" aria-hidden="true">
            <ListTodo size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">In Progress</span>
            <span className="stat-value">{pendingTasks}</span>
          </div>
          <div className="stat-icon-wrapper warning" aria-hidden="true">
            <Clock size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{completedTasks}</span>
          </div>
          <div className="stat-icon-wrapper success" aria-hidden="true">
            <CheckCircle2 size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Urgent / Due Today</span>
            <span className="stat-value">{urgentTasks}</span>
          </div>
          <div className="stat-icon-wrapper info" aria-hidden="true">
            <AlertTriangle size={22} />
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-card">
        <div className="progress-header">
          <span className="progress-title">
            <TrendingUp size={16} />
            <span>Semester Task Completion</span>
          </span>
          <span className="progress-pct">{completionRate}% Completed</span>
        </div>
        <div 
          className="progress-track" 
          role="progressbar" 
          aria-valuenow={completionRate} 
          aria-valuemin="0" 
          aria-valuemax="100"
          aria-label="Task completion percentage"
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
