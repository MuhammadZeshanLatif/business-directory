import React from 'react';
import { PageView } from '../types';
import { ArrowLeft } from 'lucide-react';

interface TermsProps {
  setView: (view: PageView) => void;
}

export const Terms: React.FC<TermsProps> = ({ setView }) => {
  return (
    <div className="legal-container">
      <button onClick={() => setView('home')} className="back-btn">
        <ArrowLeft size={16} /> Back to Home
      </button>

      <div className="legal-header">
        <h1 className="legal-title">Terms and Conditions</h1>
        <p className="legal-subtitle">Effective Date: January 1, 2026</p>
      </div>

      <div className="legal-content">
        <p>
          Welcome to Local Directory. By navigating, interacting with, or creating profile listings on this platform,
          you consent to comply with our overall operations policies.
        </p>

        <h2>1. Permitted Business Representation</h2>
        <p>
          Listing submissions must represent authentic entities operating legally under local and federal rules.
          Intentional distribution of false, misleading, or plagiarized information is strictly prohibited and
          will lead to profile termination.
        </p>

        <h2>2. Administration Review</h2>
        <p>
          The platform operates a validation layer. Our administration reserves absolute rights to approve, edit,
          filter, or decline profile listings to ensure high quality standards across our platform.
        </p>

        <h2>3. Acceptable Conduct</h2>
        <p>
          Directories are intended solely for legitimate customer discovery. Users must not utilize platform directories
          for unsolicited marketing, email harvesting, spam, or competitive intimidation.
        </p>

        <h2>4. Disclaimer of Warranty</h2>
        <p>
          The Local Directory does not warrant that information supplied by any listing is error-free,
          reliable, or current. Consumers assume all direct risks in making contact with service providers.
        </p>

        <h2>5. Limitation of Liability</h2>
        <p>
          Under no circumstances shall the platform administrators or partners be held liable for any damages,
          revenue loss, or performance shortfalls resulting from listing profile publications.
        </p>
      </div>
    </div>
  );
};
