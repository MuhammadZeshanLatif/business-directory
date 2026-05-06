import React from 'react';
import { PageView } from '../types';
import { PlusCircle, LogOut } from 'lucide-react';
import logoUrl from '../images/logo.webp';

interface HeaderProps {
  currentView: PageView;
  setView: (view: PageView) => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  userEmail?: string | null;
  userName?: string | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setView,
  isLoggedIn,
  isAdmin,
  userEmail,
  userName,
  onLogout
}) => {
  const showAuthButtons = !isLoggedIn;
  const showManageButtons = isLoggedIn;

  return (
    <header className="site-header">
      <div className="header-container">
        <div className="site-logo" style={{ cursor: 'pointer' }} onClick={() => setView('home')}>
          <img src={logoUrl} alt="Local Directory" className="site-logo-img" width={52} height={52} />
        </div>
        <nav className="site-nav">
          <button
            onClick={() => setView('home')}
            className={`nav-link ${currentView === 'home' ? 'active' : ''}`}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Home
          </button>
          <button
            onClick={() => setView('businesses')}
            className={`nav-link ${currentView === 'businesses' ? 'active' : ''}`}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            All Listings
          </button>
          {isLoggedIn && (
            <button
              onClick={() => setView('my-business')}
              className={`nav-link ${currentView === 'my-business' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              My Business
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => setView('admin')}
              className={`nav-link ${currentView === 'admin' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Admin Dashboard
            </button>
          )}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {showManageButtons && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: 160 }}>
              {userName?.trim() || userEmail}
            </span>
          )}
          {showAuthButtons && (
            <>
              <button
                onClick={() => setView('login')}
                className="form-btn-cancel"
                style={{ padding: '0.55rem 1rem' }}
              >
                Login
              </button>
              <button
                onClick={() => setView('signup')}
                className="header-cta-btn"
              >
                Sign up
              </button>
            </>
          )}
          {showManageButtons && (
            <button
              onClick={() => setView('add')}
              className="header-cta-btn"
            >
              <PlusCircle size={18} /> Add Business
            </button>
          )}
          {showManageButtons && (
            <button className="form-btn-cancel" style={{ padding: '0.5rem 0.7rem' }} onClick={onLogout}>
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
