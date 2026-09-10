import React from 'react';
import { 
  Calendar, 
  Sparkles, 
  RotateCcw, 
  Trash2, 
  Download, 
  Zap, 
  Menu 
} from 'lucide-react';

export default function SettingsView({
  settings,
  onUpdateSettings,
  taskCount,
  onRestoreDemoTasks,
  onOpenClearAllModal,
  onExportTasks,
  onOpenMobileSidebar
}) {
  const semesterOptions = [
    'Fall 2026',
    'Spring 2027',
    'Summer 2027',
    'Fall 2027'
  ];

  return (
    <div className="settings-view-wrapper">
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
          Settings
        </span>
        <div style={{ width: 32 }} />
      </div>

      {/* View Header */}
      <div className="view-intro-header">
        <div>
          <h1 className="view-title">Application & Study Settings</h1>
          <p className="view-subtitle">
            Configure your active academic semester, display options, and manage your local data.
          </p>
        </div>
      </div>

      <div className="settings-cards-list">
        {/* Card 1: Academic Term Preferences */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon-box purple">
              <Calendar size={20} />
            </div>
            <div>
              <h3>Academic Semester</h3>
              <p>Select your current enrolled term to align due dates and calendar tracking.</p>
            </div>
          </div>

          <div className="settings-card-body">
            <div className="form-group" style={{ maxWidth: 320 }}>
              <label htmlFor="settings-semester-select" className="form-label">
                Current Active Semester
              </label>
              <select
                id="settings-semester-select"
                className="select-control"
                value={settings.semester || 'Fall 2026'}
                onChange={(e) => onUpdateSettings({ ...settings, semester: e.target.value })}
              >
                {semesterOptions.map(sem => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Card 2: Accessibility & Motion */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon-box emerald">
              <Zap size={20} />
            </div>
            <div>
              <h3>Display & Accessibility</h3>
              <p>Customize animations and motion for smoother usability.</p>
            </div>
          </div>

          <div className="settings-card-body">
            <div className="setting-toggle-row">
              <div>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  Reduced Motion Mode
                </span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                  Minimize micro-animations and transitions across all interactive cards and modals.
                </p>
              </div>

              <input
                type="checkbox"
                id="toggle-reduced-motion"
                checked={Boolean(settings.reducedMotion)}
                onChange={(e) => onUpdateSettings({ ...settings, reducedMotion: e.target.checked })}
                style={{ width: 18, height: 18, accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Data Management */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon-box amber">
              <Sparkles size={20} />
            </div>
            <div>
              <h3>Local Data Management</h3>
              <p>Currently storing <strong>{taskCount} {taskCount === 1 ? 'task' : 'tasks'}</strong> in your browser storage.</p>
            </div>
          </div>

          <div className="settings-card-body">
            <div className="settings-action-buttons-group">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onExportTasks}
                id="btn-export-tasks-json"
                title="Download backup of tasks"
              >
                <Download size={15} />
                <span>Export Tasks (JSON)</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={onRestoreDemoTasks}
                id="btn-restore-demo-tasks"
                title="Reset to 6 sample campus tasks"
              >
                <RotateCcw size={15} />
                <span>Restore Sample Tasks</span>
              </button>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '1.25rem 0' }} />

            {/* Danger Zone */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--urgent-text)' }}>
                  Clear All Tasks
                </span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                  Permanently wipe all active and completed tasks from your workspace.
                </p>
              </div>

              <button
                type="button"
                className="btn btn-danger"
                onClick={onOpenClearAllModal}
                id="btn-trigger-clear-all"
              >
                <Trash2 size={15} />
                <span>Clear All Tasks</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
