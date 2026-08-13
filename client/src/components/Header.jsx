import React from 'react';

// Global header for the app — purely presentational and navigation-only.
// Keep this component free of business logic so it can be reused across pages.
export default function Header() {
  return (
    <div className="header-shell">
      <div className="header-inner">
        <div className="brand">
          <div className="brand-dot" />
          <div>
            <div className="brand-title">Graph Book Explorer</div>
            <div className="brand-sub">Explore books, authors & recommendations</div>
          </div>
        </div>
        <nav className="nav">
          <a href="#" className="nav-link">Home</a>
          <a href="#" className="nav-link">Recommendations</a>
        </nav>
      </div>
    </div>
  );
}
