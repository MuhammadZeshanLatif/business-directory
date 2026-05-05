import React, { useState } from 'react';
import { PageView } from '../types';

interface SignupProps {
  setView: (view: PageView) => void;
  onSignup: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: Error | null }>;
}

export const Signup: React.FC<SignupProps> = ({ setView, onSignup }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const { error: err } = await onSignup(email.trim(), password, fullName.trim());
      if (err) {
        setError(err.message || 'Signup failed.');
        return;
      }
      setInfo('Signup done. Now sign in with your account.');
      setView('login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container" style={{ maxWidth: 440 }}>
      <h1 className="form-title">Create Account</h1>
      <p className="form-subtitle">Public can view listings, but adding listing requires an account.</p>
      <form onSubmit={submit} className="listing-form">
        {error && <div className="notification-banner">{error}</div>}
        {info && (
          <div className="notification-banner" style={{ background: '#ecfdf5', borderColor: '#a7f3d0' }}>
            {info}
          </div>
        )}
        <div className="form-field-full">
          <label className="form-label" htmlFor="full-name">Full name</label>
          <input id="full-name" className="form-input" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
        <div className="form-field-full">
          <label className="form-label" htmlFor="su-email">Email</label>
          <input id="su-email" className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-field-full">
          <label className="form-label" htmlFor="su-password">Password</label>
          <input id="su-password" className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
        </div>
        <div className="form-field-full">
          <label className="form-label" htmlFor="su-confirm">Confirm password</label>
          <input id="su-confirm" className="form-input" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
        </div>
        <div className="form-actions">
          <button type="button" className="form-btn-cancel" onClick={() => setView('login')}>
            Back to sign in
          </button>
          <button type="submit" className="form-btn-submit" disabled={loading}>
            {loading ? 'Creating…' : 'Sign up'}
          </button>
        </div>
      </form>
    </div>
  );
};
