import React from 'react';
import { Calendar, ChevronDown, User, Menu } from 'lucide-react';
import campusBannerImg from '../assets/campus_banner.jpg';

export default function HeaderBanner({ onOpenMobileSidebar }) {
  return (
    <>
      {/* Mobile Top App Bar */}
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
          Campus Task Manager
        </span>
        <div className="user-header-avatar" style={{ width: 32, height: 32 }}>
          <User size={16} />
        </div>
      </div>

      {/* Main Banner Header */}
      <header className="banner-header" role="banner">
        {/* Scenic Campus Illustration Backdrop */}
        <div 
          className="banner-backdrop-art" 
          style={{ backgroundImage: `url(${campusBannerImg})` }}
          aria-hidden="true"
        />

        {/* Left Welcome Area */}
        <div className="banner-left">
          <h1 className="greeting-title">
            Good Morning, Student! 👋
          </h1>
          <p className="greeting-subtitle">
            Let's make today count. Here's your academic overview.
          </p>
        </div>

        {/* Right Controls & Quote */}
        <div className="banner-right">
          <div className="banner-quote-badge">
            &ldquo;Discipline today, a brighter tomorrow.&rdquo;
          </div>

          <button
            type="button"
            className="semester-select-btn"
            id="btn-semester-select"
            title="Academic Term"
          >
            <Calendar size={15} color="var(--primary)" />
            <span>Fall 2026</span>
            <ChevronDown size={14} color="var(--text-muted)" />
          </button>

          <button
            type="button"
            className="user-header-avatar"
            id="btn-user-profile"
            aria-label="Student Account Menu"
          >
            <User size={18} />
          </button>
        </div>
      </header>
    </>
  );
}
