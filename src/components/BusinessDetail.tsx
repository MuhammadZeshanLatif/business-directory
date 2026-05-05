import React from 'react';
import { PageView, Business } from '../types';
import { ArrowLeft, MapPin, Phone, Globe, Calendar, UserCheck } from 'lucide-react';

interface BusinessDetailProps {
  business: Business | null;
  setView: (view: PageView) => void;
}

export const BusinessDetail: React.FC<BusinessDetailProps> = ({ business, setView }) => {
  if (!business) {
    return (
      <div className="detail-view-container">
        <button onClick={() => setView('businesses')} className="back-btn">
          <ArrowLeft size={16} /> Back to Listings
        </button>
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Business not found.</p>
      </div>
    );
  }

  const formattedDate = new Date(business.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="detail-view-container">
      <button onClick={() => setView('businesses')} className="back-btn">
        <ArrowLeft size={16} /> Back to Listings
      </button>

      <div className="detail-header">
        <div className="detail-top">
          <div>
            <h1 className="detail-title">{business.name}</h1>
            <span className="card-category-badge" style={{ marginTop: '0.4rem', fontSize: '0.85rem' }}>
              {business.category}
            </span>
          </div>
        </div>
      </div>

      <div className="detail-desc-block">
        {business.description || 'No description provided.'}
      </div>

      <div className="detail-info-grid">
        {business.address && (
          <div className="info-card">
            <div className="info-card-label">
              <MapPin size={16} style={{ verticalAlign: 'middle', marginRight: '0.35rem' }} /> Street Address
            </div>
            <div className="info-card-value">{business.address}</div>
          </div>
        )}

        {business.city && (
          <div className="info-card">
            <div className="info-card-label">
              <MapPin size={16} style={{ verticalAlign: 'middle', marginRight: '0.35rem' }} /> City / Region
            </div>
            <div className="info-card-value">{business.city}</div>
          </div>
        )}

        {business.phone && (
          <div className="info-card">
            <div className="info-card-label">
              <Phone size={16} style={{ verticalAlign: 'middle', marginRight: '0.35rem' }} /> Phone Contact
            </div>
            <div className="info-card-value">{business.phone}</div>
          </div>
        )}

        {business.website && (
          <div className="info-card">
            <div className="info-card-label">
              <Globe size={16} style={{ verticalAlign: 'middle', marginRight: '0.35rem' }} /> Official Website
            </div>
            <div className="info-card-value">
              <a
                href={business.website.startsWith('http') ? business.website : `https://${business.website}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {business.website}
              </a>
            </div>
          </div>
        )}

        <div className="info-card">
          <div className="info-card-label">
            <Calendar size={16} style={{ verticalAlign: 'middle', marginRight: '0.35rem' }} /> Registered Date
          </div>
          <div className="info-card-value">{formattedDate}</div>
        </div>

        <div className="info-card">
          <div className="info-card-label">
            <UserCheck size={16} style={{ verticalAlign: 'middle', marginRight: '0.35rem' }} /> Verification Status
          </div>
          <div className="info-card-value" style={{ textTransform: 'capitalize' }}>
            <span className={`status-tag ${business.status}`}>
              {business.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
