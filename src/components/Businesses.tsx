import React, { useState } from 'react';
import { PageView, Business, Category } from '../types';
import { Search, MapPin, Phone, Globe, ArrowRight } from 'lucide-react';

interface BusinessesProps {
  businesses: Business[];
  directoryEmpty?: boolean;
  currentUserId?: string | null;
  canManageOwn?: boolean;
  showOnlyOwned?: boolean;
  heading?: string;
  onEditBusiness?: (id: string) => void;
  onDeleteBusiness?: (id: string) => Promise<void> | void;
  selectedCategory: Category | 'All';
  setSelectedCategory: (category: Category | 'All') => void;
  keywordSearch: string;
  setKeywordSearch: (term: string) => void;
  setSelectedBusinessId: (id: string) => void;
  setView: (view: PageView) => void;
}

export const Businesses: React.FC<BusinessesProps> = ({
  businesses,
  directoryEmpty = false,
  currentUserId = null,
  canManageOwn = false,
  showOnlyOwned = false,
  heading = 'Directory Listings',
  onEditBusiness,
  onDeleteBusiness,
  selectedCategory,
  setSelectedCategory,
  keywordSearch,
  setKeywordSearch,
  setSelectedBusinessId,
  setView
}) => {
  const [localCity, setLocalCity] = useState('');

  const categories: (Category | 'All')[] = [
    'All',
    'Plumber',
    'Doctor',
    'AC Technician',
    'Car Mechanic',
    'Electrician',
    'Dentist',
    'Lawyer',
    'Restaurant',
    'Salon',
    'Real Estate Agent'
  ];

  // Public sees approved; owner can also see own pending listings.
  const visibleBusinesses = businesses.filter((b) => {
    if (showOnlyOwned) {
      return Boolean(currentUserId && b.ownerId === currentUserId);
    }
    if (b.status === 'approved') return true;
    if (!canManageOwn || !currentUserId) return false;
    return b.ownerId === currentUserId;
  });

  // Multi-tier search filtering (Category, Keyword, City)
  const filteredBusinesses = visibleBusinesses.filter((biz) => {
    const matchCategory =
      selectedCategory === 'All' || biz.category === selectedCategory;

    const matchKeyword =
      !keywordSearch ||
      biz.name.toLowerCase().includes(keywordSearch.toLowerCase()) ||
      biz.category.toLowerCase().includes(keywordSearch.toLowerCase()) ||
      biz.description.toLowerCase().includes(keywordSearch.toLowerCase());

    const matchCity =
      !localCity || biz.city.toLowerCase().includes(localCity.toLowerCase());

    return matchCategory && matchKeyword && matchCity;
  });

  const getCountForCat = (cat: Category | 'All') => {
    if (cat === 'All') return visibleBusinesses.length;
    return visibleBusinesses.filter((b) => b.category === cat).length;
  };

  return (
    <div className="business-listing-layout">
      {/* Sidebar filter */}
      <aside className="filter-sidebar">
        <h3 className="filter-heading">Directory Filter</h3>
        <div className="filter-group">
          <label className="filter-group-title">Business Category</label>
          <ul className="filter-list">
            {categories.map((cat) => {
              const activeClass = selectedCategory === cat ? 'active' : '';
              return (
                <li
                  key={cat}
                  className={`filter-item ${activeClass}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  <span>{cat === 'All' ? 'All Businesses' : cat}</span>
                  <span className="filter-item-count">{getCountForCat(cat)}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="filter-group" style={{ marginBottom: 0 }}>
          <label className="filter-group-title">City / Region</label>
          <input
            type="text"
            placeholder="e.g. Chicago"
            className="form-input"
            value={localCity}
            onChange={(e) => setLocalCity(e.target.value)}
            style={{ padding: '0.5rem 0.6rem', fontSize: '0.85rem' }}
          />
        </div>
      </aside>

      {/* Primary Listing Area */}
      <main className="listings-main">
        <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>{heading}</h2>
        {/* Top Toolbar Search */}
        <div className="listings-top-toolbar">
          <div className="admin-search-wrapper" style={{ flex: 1, maxWidth: 'none' }}>
            <Search size={18} className="admin-search-icon" />
            <input
              type="text"
              placeholder="Search by specialty, business name, or descriptions..."
              className="admin-search-input"
              value={keywordSearch}
              onChange={(e) => setKeywordSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="results-info">
          Showing <strong>{filteredBusinesses.length}</strong> {filteredBusinesses.length === 1 ? 'business' : 'businesses'} matching filter criteria.
        </div>

        {directoryEmpty ? (
          <div
            className="business-card"
            style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}
          >
            No businesses in the database yet. Use <strong>Add listing</strong> or import data in
            Supabase.
          </div>
        ) : filteredBusinesses.length > 0 ? (
          filteredBusinesses.map((biz) => (
            <div key={biz.id} className="business-card">
              <div className="card-top">
                <div className="card-heading">
                  <h3 className="card-title">{biz.name}</h3>
                  <span className="card-category-badge">{biz.category}</span>
                </div>
              </div>
              {biz.description && <p className="card-description">{biz.description}</p>}
              <div className="card-metadata">
                {biz.city && (
                  <div className="meta-item">
                    <MapPin size={16} />
                    <span>{biz.city}</span>
                  </div>
                )}
                {biz.phone && (
                  <div className="meta-item">
                    <Phone size={16} />
                    <span>{biz.phone}</span>
                  </div>
                )}
                {biz.website && (
                  <div className="meta-item">
                    <Globe size={16} />
                    <a href={biz.website.startsWith('http') ? biz.website : `https://${biz.website}`} target="_blank" rel="noopener noreferrer">
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
              <div className="card-bottom-actions">
                {canManageOwn && currentUserId && biz.ownerId === currentUserId && (
                  <>
                    <button
                      onClick={() => onEditBusiness?.(biz.id)}
                      className="card-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        void onDeleteBusiness?.(biz.id);
                      }}
                      className="card-btn"
                      style={{ color: 'var(--error-color)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                    >
                      Delete
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    setSelectedBusinessId(biz.id);
                    setView('detail');
                  }}
                  className="card-btn card-btn-primary"
                >
                  Details <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="business-card" style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No businesses match the current filter selection. Adjust your keyword search or category.
          </div>
        )}
      </main>
    </div>
  );
};
