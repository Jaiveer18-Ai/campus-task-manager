import React from 'react';
import { 
  GraduationCap, 
  LayoutDashboard, 
  ListTodo, 
  Calendar as CalendarIcon, 
  BarChart3, 
  Settings, 
  Sprout, 
  ChevronRight,
  X
} from 'lucide-react';

export default function Sidebar({ activeNav = 'Dashboard', onNavSelect, isMobileOpen, onCloseMobile }) {
  const navItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'All Tasks', label: 'All Tasks', icon: ListTodo },
    { id: 'Calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'Analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'Settings', label: 'Settings', icon: Settings }
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div 
          className="modal-backdrop" 
          style={{ zIndex: 90 }}
          onClick={onCloseMobile}
        />
      )}

      <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`} aria-label="Sidebar Navigation">
        <div>
          {/* Brand Logo Header */}
          <div className="sidebar-header">
            <div className="brand-icon-box" aria-hidden="true">
              <GraduationCap size={22} />
            </div>
            <div className="brand-title">
              Campus<br />Task Manager
            </div>
            {isMobileOpen && (
              <button 
                type="button" 
                className="btn-icon" 
                style={{ marginLeft: 'auto' }}
                onClick={onCloseMobile}
                aria-label="Close sidebar"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="sidebar-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    onNavSelect?.(item.id);
                    if (isMobileOpen) onCloseMobile?.();
                  }}
                  id={`nav-item-${item.id.toLowerCase().replace(' ', '-')}`}
                >
                  <Icon size={18} className="nav-icon" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div>
          {/* Motivational Study Widget */}
          <div className="sidebar-motivation-box">
            <div className="sprout-icon-box" aria-hidden="true">
              <Sprout size={20} />
            </div>
            <p className="motivation-quote">
              &ldquo;Progress today, a brighter tomorrow.&rdquo;
            </p>
            <div className="motivation-subtext">
              Keep going! 💪
            </div>
          </div>

          {/* Student Profile Card */}
          <div className="sidebar-profile-card" title="Student Profile">
            <div className="profile-avatar-circle" aria-hidden="true">
              SS
            </div>
            <div className="profile-info">
              <span className="profile-name">Student</span>
              <span className="profile-status">Stay Productive!</span>
            </div>
            <ChevronRight size={16} color="var(--text-muted)" />
          </div>
        </div>
      </aside>
    </>
  );
}
