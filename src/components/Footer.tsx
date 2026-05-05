import React from 'react';
import { PageView } from '../types';

interface FooterProps {
  setView: (view: PageView) => void;
}

export const Footer: React.FC<FooterProps> = ({ setView }) => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-text">
          &copy; {new Date().getFullYear()} Local Business Directory. All rights reserved.
        </div>
        <div className="footer-links">
          <button
            onClick={() => setView('privacy')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            className="footer-link"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setView('terms')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            className="footer-link"
          >
            Terms and Conditions
          </button>
        </div>
      </div>
    </footer>
  );
};
