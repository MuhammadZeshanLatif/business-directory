import React, { useState } from 'react';
import { PageView } from '../types';

interface LoginProps {
  setView: (view: PageView) => void;
  onLogin: (email: string, password: string) => Promise<{ error: Error | null }>;
}

export const Login: React.FC<LoginProps> = ({ setView, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error: err } = await onLogin(email.trim(), password);
      if (err) setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container" style={{ maxWidth: 420 }}>
      <h1 className="form-title">Sign In</h1>
      <p className="form-subtitle">Add listing and dashboard access requires login.</p>
      <form onSubmit={submit} className="listing-form">
        {error && <div className="notification-banner">{error}</div>}
        <div className="form-field-full">
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="form-input"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-field-full">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className="form-input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-actions">
          <button type="button" className="form-btn-cancel" onClick={() => setView('signup')}>
            Create account
          </button>
          <button type="submit" className="form-btn-submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </div>
      </form>
    </div>
  );
};
