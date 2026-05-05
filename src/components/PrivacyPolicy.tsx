import React from 'react';
import { PageView } from '../types';
import { ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  setView: (view: PageView) => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ setView }) => {
  return (
    <div className="legal-container">
      <button onClick={() => setView('home')} className="back-btn">
        <ArrowLeft size={16} /> Back to Home
      </button>

      <div className="legal-header">
        <h1 className="legal-title">Privacy Policy</h1>
        <p className="legal-subtitle">Effective Date: January 1, 2026</p>
      </div>

      <div className="legal-content">
        <p>
          Your privacy is a priority to our team. This Privacy Policy describes our practices
          concerning the collection, use, and disclosure of your personal and business data when you
          interact with the Local Business Directory platform.
        </p>

        <h2>1. Information Collection</h2>
        <p>
          We collect business profiles and business listings explicitly provided by users. This
          includes business details such as corporate names, categories, descriptions, addresses, phone
          numbers, and website URLs.
        </p>

        <h2>2. Use of Information</h2>
        <p>
          All collected business details are placed directly onto the public Local Directory database to allow
          consumers to find and connect with registered professionals. Information may be shared with
          third-party infrastructure platforms for standard site hosting, site evaluation, and system stability.
        </p>

        <h2>3. Information Management</h2>
        <p>
          Registered businesses may request the update, verification, or complete removal of their
          business details from the active directories. Please email our administrative panel with your
          official verification details to initiate these modifications.
        </p>

        <h2>4. Data Protection & Governance</h2>
        <p>
          We employ secure server structures, encryption protocols, and periodic backups to ensure your
          listing information remains accurate and accessible. While we protect data, no online transfer
          method can completely guarantee total isolation from malicious intrusions.
        </p>

        <h2>5. Periodic Changes</h2>
        <p>
          We reserve the right to amend this policy at any time. Changes become immediately binding once published on this page.
        </p>
      </div>
    </div>
  );
};
