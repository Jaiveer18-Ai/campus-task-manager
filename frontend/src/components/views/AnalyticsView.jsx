import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Target, 
  Menu 
} from 'lucide-react';
import { getDueStatus } from '../../utils/dateHelpers';

export default function AnalyticsView({ tasks, onOpenMobileSidebar }) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const active = total - completed;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  // Urgent & overdue tasks
  const urgentCount = tasks.filter(t => {
    if (t.completed) return false;
    const status = getDueStatus(t.dueDate, t.completed);
    return status.urgency === 'urgent';
  }).length;

  const soonCount = tasks.filter(t => {
    if (t.completed) return false;
    const status = getDueStatus(t.dueDate, t.completed);
    return status.urgency === 'soon';
  }).length;

  // Breakdown by Priority
  const priorityCounts = {
    high: tasks.filter(t => t.priority === 'high').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    low: tasks.filter(t => t.priority === 'low').length
  };

  // Breakdown by Category
  const categoryCounts = {
    Assignment: tasks.filter(t => t.category === 'Assignment').length,
    'Exam Prep': tasks.filter(t => t.category === 'Exam Prep').length,
    Project: tasks.filter(t => t.category === 'Project').length,
    Reading: tasks.filter(t => t.category === 'Reading').length,
    Personal: tasks.filter(t => t.category === 'Personal').length
  };

  // Course Workload Breakdown
  const courseWorkload = {};
  tasks.forEach(t => {
    const course = t.course || 'General';
    if (!courseWorkload[course]) {
      courseWorkload[course] = { total: 0, completed: 0 };
    }
    courseWorkload[course].total += 1;
    if (t.completed) courseWorkload[course].completed += 1;
  });

  return (
    <div className="analytics-view-wrapper">
      {/* Mobile Top Bar */}
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
          Analytics
        </span>
        <div style={{ width: 32 }} />
      </div>

      {/* Intro Header */}
      <div className="view-intro-header">
        <div>
          <h1 className="view-title">Academic Study & Progress Analytics</h1>
          <p className="view-subtitle">
            Dynamic breakdown of your study workload, deadlines, and milestone completion.
          </p>
        </div>
      </div>

      {/* Top 4 Metric Overview Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper purple">
            <Target size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Workload</span>
            <div className="stat-value-group">
              <span className="stat-number">{total}</span>
              <span className="stat-unit">{total === 1 ? 'task' : 'tasks'}</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper emerald">
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Completed Tasks</span>
            <div className="stat-value-group">
              <span className="stat-number">{completed}</span>
              <span className="stat-unit">{completed === 1 ? 'task' : 'tasks'}</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper amber">
            <Clock size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Active / In Progress</span>
            <div className="stat-value-group">
              <span className="stat-number">{active}</span>
              <span className="stat-unit">{active === 1 ? 'task' : 'tasks'}</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper coral">
            <AlertTriangle size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Urgent / Due Today</span>
            <div className="stat-value-group">
              <span className="stat-number">{urgentCount}</span>
              <span className="stat-unit">{urgentCount === 1 ? 'task' : 'tasks'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Semester Velocity Banner */}
      <div className="progress-section-card" style={{ marginBottom: '1.75rem' }}>
        <div className="progress-header">
          <div className="progress-title-area">
            <TrendingUp size={19} className="progress-title-icon" />
            <span className="progress-title-text">Semester Task Completion Rate</span>
          </div>
          <div className="progress-meta-area">
            <span className="progress-percentage">{completionRate}% Completed</span>
            <span className="progress-subtext">
              <Clock size={14} />
              <span>{completed} of {total} completed · {soonCount} upcoming soon</span>
            </span>
          </div>
        </div>
        <div className="progress-track" role="progressbar" aria-valuenow={completionRate} aria-valuemin="0" aria-valuemax="100">
          <div className="progress-fill" style={{ width: `${completionRate}%` }} />
        </div>
      </div>

      {/* Analytics Visual Breakdown Grids */}
      <div className="analytics-breakdown-grid">
        {/* Priority Distribution Card */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <h3>Workload by Priority</h3>
            <span className="badge category-badge">3 Levels</span>
          </div>

          <div className="distribution-list">
            <div className="distribution-item">
              <div className="distribution-label-row">
                <span className="dist-label-tag high">High Priority</span>
                <span className="dist-value">{priorityCounts.high} tasks ({total ? Math.round((priorityCounts.high / total) * 100) : 0}%)</span>
              </div>
              <div className="dist-bar-track">
                <div 
                  className="dist-bar-fill high" 
                  style={{ width: `${total ? (priorityCounts.high / total) * 100 : 0}%` }} 
                />
              </div>
            </div>

            <div className="distribution-item">
              <div className="distribution-label-row">
                <span className="dist-label-tag medium">Medium Priority</span>
                <span className="dist-value">{priorityCounts.medium} tasks ({total ? Math.round((priorityCounts.medium / total) * 100) : 0}%)</span>
              </div>
              <div className="dist-bar-track">
                <div 
                  className="dist-bar-fill medium" 
                  style={{ width: `${total ? (priorityCounts.medium / total) * 100 : 0}%` }} 
                />
              </div>
            </div>

            <div className="distribution-item">
              <div className="distribution-label-row">
                <span className="dist-label-tag low">Low Priority</span>
                <span className="dist-value">{priorityCounts.low} tasks ({total ? Math.round((priorityCounts.low / total) * 100) : 0}%)</span>
              </div>
              <div className="dist-bar-track">
                <div 
                  className="dist-bar-fill low" 
                  style={{ width: `${total ? (priorityCounts.low / total) * 100 : 0}%` }} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown Card */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <h3>Workload by Category</h3>
            <span className="badge category-badge">5 Types</span>
          </div>

          <div className="distribution-list">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = total ? Math.round((count / total) * 100) : 0;
              return (
                <div key={cat} className="distribution-item">
                  <div className="distribution-label-row">
                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{cat}</span>
                    <span className="dist-value">{count} tasks ({pct}%)</span>
                  </div>
                  <div className="dist-bar-track">
                    <div 
                      className="dist-bar-fill category" 
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Course Distribution Card */}
        <div className="analytics-card" style={{ gridColumn: 'span 2' }}>
          <div className="analytics-card-header">
            <h3>Course & Subject Workload Breakdown</h3>
            <span className="badge category-badge">{Object.keys(courseWorkload).length} Subjects</span>
          </div>

          <div className="course-breakdown-grid">
            {Object.entries(courseWorkload).map(([course, stats]) => {
              const coursePct = Math.round((stats.completed / stats.total) * 100);
              return (
                <div key={course} className="course-stat-tile">
                  <div className="course-tile-top">
                    <span className="badge course-badge-cs" style={{ fontWeight: 700 }}>
                      {course}
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)' }}>
                      {coursePct}% Done
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', color: 'var(--text-secondary)', margin: '0.6rem 0 0.4rem 0' }}>
                    <span>{stats.completed} Completed</span>
                    <span>{stats.total - stats.completed} Active</span>
                  </div>

                  <div className="dist-bar-track" style={{ height: 6 }}>
                    <div 
                      className="dist-bar-fill emerald" 
                      style={{ width: `${coursePct}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
